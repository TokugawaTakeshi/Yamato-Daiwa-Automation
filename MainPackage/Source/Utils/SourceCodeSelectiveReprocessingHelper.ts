/* eslint max-depth: [ warn, 4 ] */

import {
  Logger,
  UnexpectedEventError,
  FileReadingFailedError,
  RawObjectDataProcessor,
  extractLastExtensionOfFileName,
  addMultipleElementsToSet,
  createSetBasedOnOtherSet,
  stringifyAndFormatArbitraryValue,
  isNonEmptyString,
  isUndefined,
  isNotUndefined,
  isNull,
  isNotNull
} from "@yamato-daiwa/es-extensions";
import {
  ImprovedPath,
  ObjectDataFilesProcessor,
  FileNotFoundError,
  isErrnoException
} from "@yamato-daiwa/es-extensions-nodejs";
import FileSystem from "fs";


/* [ Theory ]
 * With plain Gulp, we don't know the relations of entry points and affiliated files thus must to re-process all entry
 * points on any file changed. When files number is large, the performance impact will be tangible even for the local
 * development mode when the speed is negligible to certain extent. To optimize this, we need to know the parents entry
 * points of each file, herewith the hierarchy could be arbitrary large. Also, we need to avoid of the reading of same
 * file twice while its content not changed. */
class SourceCodeSelectiveReprocessingHelper {

  private static readonly DEBUGGING_MODE: boolean = false;
  private static readonly cachedMetadataFileContentSpecification: RawObjectDataProcessor.
      FixedKeyAndValuesTypeObjectDataSpecification =
    {
      nameForLogging: "SourceCodeSelectiveReprocessingHelper.CachedRawMetadata",
      subtype: RawObjectDataProcessor.ObjectSubtypes.fixedKeyAndValuePairsObject,
      properties: {
        entryPoints: {
          type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
          required: true,
          value: {
            type: Object,
            properties: {
              modificationDate__ISO8601: {
                type: String,
                required: true
              },
              directAffiliatedFilesRelativePaths: {
                type: Array,
                required: true,
                element: { type: String }
              }
            }
          }
        },
        affiliatedFiles: {
          type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
          required: true,
          value: {
            type: Object,
            properties: {
              modificationDate__ISO8601: {
                type: String,
                required: true
              },
              directAffiliatedFilesRelativePaths: {
                type: Array,
                required: true,
                element: { type: String }
              },
              parentEntryPointsRelativePaths: {
                type: Array,
                required: true,
                element: { type: String }
              }
            }
          }
        }
      }
    };

  private readonly entryPointsMetadata: SourceCodeSelectiveReprocessingHelper.EntryPointsMetadata = new Map();
  private readonly isEntryPoint: (targetFileAbsolutePath: string) => boolean;

  private readonly affiliatedFilesMetadata: SourceCodeSelectiveReprocessingHelper.AffiliatedFilesMetadata = new Map();
  private readonly affiliatedFilesResolutionRules: SourceCodeSelectiveReprocessingHelper.AffiliatedFilesResolutionRules;
  private readonly absolutePathsOfAffiliatedFilesWhichHasBeenScannedDuringCurrentPass: Set<string> = new Set();

  private readonly CONSUMING_PROJECT_ROOT_DIRECTORY_ABSOLUTE_PATH: string;
  private readonly CACHED_METADATA_FILE_ABSOLUTE_PATH: string;
  private readonly TARGET_FILES_TYPE_IN_SINGULAR_FORM: string;


  public constructor(initializationProperties: SourceCodeSelectiveReprocessingHelper.InitializationProperties) {

    this.isEntryPoint = initializationProperties.isEntryPoint;

    this.affiliatedFilesResolutionRules = initializationProperties.affiliatedFilesResolutionRules;

    this.CONSUMING_PROJECT_ROOT_DIRECTORY_ABSOLUTE_PATH = initializationProperties.consumingProjectRootDirectoryAbsolutePath;
    this.CACHED_METADATA_FILE_ABSOLUTE_PATH = initializationProperties.cacheFileAbsolutePath;
    this.TARGET_FILES_TYPE_IN_SINGULAR_FORM = initializationProperties.logging.targetFilesTypeInSingularForm;

    this.generateInitialMetadataMaps(
      new Set(
        initializationProperties.initialEntryPointsSourceFilesAbsolutePaths.map(
          (entryPointFileAbsolutePath__potentiallyWithOperationingSystemDependentPathSeparators: string): string =>
              ImprovedPath.replacePathSeparatorsToForwardSlashes(
                entryPointFileAbsolutePath__potentiallyWithOperationingSystemDependentPathSeparators
              )
        )
      )
    );

    if (initializationProperties.logging.mustEnable) {
      this.logAffiliatedFilesAndEntryPointsRelationships();
    }

    this.cacheFilesMetadataMapsToFile();

  }


  public getAbsolutePathsOfEntryPointsWhichMustBeProcessed(
    absolutePathsOfFilesWithChangesStatus: ReadonlySet<string>
  ): Array<string> {

    const absolutePathsOfEntryPointsWhichMustBeProcessed: Set<string> = new Set<string>();

    for (const absolutePathOfFileWithChangesStatus of absolutePathsOfFilesWithChangesStatus) {

      if (this.isEntryPoint(absolutePathOfFileWithChangesStatus)) {

        if (FileSystem.existsSync(absolutePathOfFileWithChangesStatus)) {
          absolutePathsOfEntryPointsWhichMustBeProcessed.add(absolutePathOfFileWithChangesStatus);
        } else {
          this.entryPointsMetadata.delete(
            ImprovedPath.computeRelativePath({
              basePath: this.CONSUMING_PROJECT_ROOT_DIRECTORY_ABSOLUTE_PATH,
              comparedPath: absolutePathOfFileWithChangesStatus,
              alwaysForwardSlashSeparators: true
            })
          );
        }

      } else {

        const targetAffiliatedFileRelativePath: string = ImprovedPath.computeRelativePath({
          basePath: this.CONSUMING_PROJECT_ROOT_DIRECTORY_ABSOLUTE_PATH,
          comparedPath: absolutePathOfFileWithChangesStatus,
          alwaysForwardSlashSeparators: true
        });

        if (FileSystem.existsSync(absolutePathOfFileWithChangesStatus)) {

          addMultipleElementsToSet(
            absolutePathsOfEntryPointsWhichMustBeProcessed,
            Array.from(this.affiliatedFilesMetadata.get(targetAffiliatedFileRelativePath)?.parentEntryPointsAbsolutePaths ?? [])
          );

        } else {

          this.affiliatedFilesMetadata.delete(targetAffiliatedFileRelativePath);

        }

      }

    }

    return Array.from(absolutePathsOfEntryPointsWhichMustBeProcessed);

  }


  /* ━━━ First Mapping Since Last YDA Launch ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* [ Theory ] The cached metadata from previous YDA launches could be. */
  private generateInitialMetadataMaps(initialEntryPointsAbsolutePaths: ReadonlySet<string>): void {

    this.extractCacheFromFileAndApplyIfItExists();

    for (const entryPointFileAbsolutePath of initialEntryPointsAbsolutePaths) {

      const entryPointDirectoryAbsolutePath: string = ImprovedPath.extractDirectoryFromFilePath({
        targetPath: entryPointFileAbsolutePath,
        alwaysForwardSlashSeparators: true,
        ambiguitiesResolution: {
          mustConsiderLastSegmentStartingWithDotAsDirectory: false,
          mustConsiderLastSegmentWithNonLeadingDotAsDirectory: false,
          mustConsiderLastSegmentWihtoutDotsAsFileNameWithoutExtension: true
        }
      });

      const entryPointFilePathRelativeToConsumingProjectRootDirectory: string = ImprovedPath.computeRelativePath({
        basePath: this.CONSUMING_PROJECT_ROOT_DIRECTORY_ABSOLUTE_PATH,
        comparedPath: entryPointFileAbsolutePath,
        alwaysForwardSlashSeparators: true
      });

      let entryPointModificationDateTime__ISO8601: string;

      try {

        entryPointModificationDateTime__ISO8601 = FileSystem.statSync(entryPointFileAbsolutePath).mtime.toISOString();

      } catch (error: unknown) {

        if (isErrnoException(error) && error.code === "ENOENT") {
          this.entryPointsMetadata.delete(entryPointFilePathRelativeToConsumingProjectRootDirectory);
          continue;
        }


        Logger.logError({
          mustOutputIf: __IS_DEVELOPMENT_BUILDING_MODE__ || SourceCodeSelectiveReprocessingHelper.DEBUGGING_MODE,
          errorType: "FileStatisticsRetrievingFailedError",
          title: "File Statistics Retrieving Failed Error",
          description:
              `Unable to retrieve the statistics of file "${ entryPointFilePathRelativeToConsumingProjectRootDirectory }". ` +
              "This file will not be mapped.",
          occurrenceLocation: "sourceCodeSelectiveReprocessingHelper.generateInitialMetadataMaps()",
          caughtError: error
        });

        continue;

      }


      const cachedMetadataOfCurrentEntryPoint: SourceCodeSelectiveReprocessingHelper.EntryPointFileMetadata | undefined =
          this.entryPointsMetadata.get(entryPointFilePathRelativeToConsumingProjectRootDirectory);

      let absolutePathsOfDirectExistingAffiliatedFilesOfCurrentEntryPoint: Set<string>;

      if (cachedMetadataOfCurrentEntryPoint?.modificationDate__ISO8601 === entryPointModificationDateTime__ISO8601) {

        /* [ Theory ] Although the entry point file is existing and has not changed since last mapping, its affiliated
         *   files could be added or deleted. */
        absolutePathsOfDirectExistingAffiliatedFilesOfCurrentEntryPoint = new Set<string>();

        for (
          const relativePathOfAffiliatedFileOfCurrentEntryPoint of
              cachedMetadataOfCurrentEntryPoint.directAffiliatedFilesRelativePaths
        ) {

          const absolutePathOfAffiliatedFileOfCurrentEntryPoint: string = ImprovedPath.joinPathSegments(
            [ this.CONSUMING_PROJECT_ROOT_DIRECTORY_ABSOLUTE_PATH, relativePathOfAffiliatedFileOfCurrentEntryPoint ],
            { alwaysForwardSlashSeparators: true }
          );

          if (!FileSystem.existsSync(absolutePathOfAffiliatedFileOfCurrentEntryPoint)) {
            cachedMetadataOfCurrentEntryPoint.directAffiliatedFilesRelativePaths.
                delete(relativePathOfAffiliatedFileOfCurrentEntryPoint);
          }

          absolutePathsOfDirectExistingAffiliatedFilesOfCurrentEntryPoint = new Set(
            Array.from(cachedMetadataOfCurrentEntryPoint.directAffiliatedFilesRelativePaths)
          );

        }

      } else {

        absolutePathsOfDirectExistingAffiliatedFilesOfCurrentEntryPoint = this.
            getAbsolutePathsOfExistingAffiliatedFilesOfExistingUpdatedTargetOne({
              targetFileAbsolutePath: entryPointFileAbsolutePath,
              targetFileDirectoryAbsolutePath: entryPointDirectoryAbsolutePath
            });

        this.entryPointsMetadata.set(
          entryPointFilePathRelativeToConsumingProjectRootDirectory,
          {
            modificationDate__ISO8601: entryPointModificationDateTime__ISO8601,
            directAffiliatedFilesRelativePaths: createSetBasedOnOtherSet(
              absolutePathsOfDirectExistingAffiliatedFilesOfCurrentEntryPoint,
              (absolutePathOfExistingAffiliatedFileOfCurrentEntryPoint: string): string =>
                  ImprovedPath.computeRelativePath({
                    basePath: this.CONSUMING_PROJECT_ROOT_DIRECTORY_ABSOLUTE_PATH,
                    comparedPath: absolutePathOfExistingAffiliatedFileOfCurrentEntryPoint,
                    alwaysForwardSlashSeparators: true
                  })
            )
          }
        );

      }

      Logger.logGeneric({
        mustOutputIf: SourceCodeSelectiveReprocessingHelper.DEBUGGING_MODE,
        badge: { customText: "Debug" },
        title: "SourceCodeSelectiveReprocessingHelper, entry point has been analyzed.",
        description:
            `The metadata of entry point "${ entryPointFilePathRelativeToConsumingProjectRootDirectory }" ` +
            `has been is:\n${ stringifyAndFormatArbitraryValue(this.entryPointsMetadata) }\n`
      });

      for (
        const absolutePathOfDirectExistingAffiliatedFileOfCurrentEntryPoint of
            absolutePathsOfDirectExistingAffiliatedFilesOfCurrentEntryPoint
      ) {

        this.updateMetadataMapForExistingAffiliatedFile({
          targetAffiliatedFileAbsolutePath: absolutePathOfDirectExistingAffiliatedFileOfCurrentEntryPoint,
          parentEntryPointAbsolutePath: entryPointFileAbsolutePath
        });

        this.absolutePathsOfAffiliatedFilesWhichHasBeenScannedDuringCurrentPass.
            add(absolutePathOfDirectExistingAffiliatedFileOfCurrentEntryPoint);

      }

    }

    this.absolutePathsOfAffiliatedFilesWhichHasBeenScannedDuringCurrentPass.clear();

  }

  private extractCacheFromFileAndApplyIfItExists(): void {

    let cachedRawMetadata: SourceCodeSelectiveReprocessingHelper.CachedRawMetadata;

    try {

      cachedRawMetadata = ObjectDataFilesProcessor.processFile<SourceCodeSelectiveReprocessingHelper.CachedRawMetadata>({
        filePath: this.CACHED_METADATA_FILE_ABSOLUTE_PATH,
        validDataSpecification: SourceCodeSelectiveReprocessingHelper.cachedMetadataFileContentSpecification,
        synchronously: true
      });

    } catch (error: unknown) {

      if (!(error instanceof FileNotFoundError)) {

        Logger.logError({
          mustOutputIf: __IS_DEVELOPMENT_BUILDING_MODE__ || SourceCodeSelectiveReprocessingHelper.DEBUGGING_MODE,
          errorType: "CachedDataRetrievingFailure",
          title: "Cached Data Retrieving Failure",
          description: `Unable to read the existing cache file "${ this.CACHED_METADATA_FILE_ABSOLUTE_PATH }".`,
          occurrenceLocation: "sourceCodeSelectiveReprocessingHelper.extractCacheFromFileAndApplyIfItExists()",
          caughtError: error
        });

      }

      return;

    }


    for (
      const [ entryPointPathRelativeToConsumingProjectRootDirectory, entryPointRawMetadata ] of
          Object.entries(cachedRawMetadata.entryPoints)
    ) {
      this.entryPointsMetadata.set(
        entryPointPathRelativeToConsumingProjectRootDirectory,
        {
          modificationDate__ISO8601: entryPointRawMetadata.modificationDate__ISO8601,
          directAffiliatedFilesRelativePaths: new Set(entryPointRawMetadata.directAffiliatedFilesRelativePaths)
        }
      );
    }

    for (
      const [ affiliatedFilePathRelativeToConsumingProjectRootDirectory, affiliatedFileMetadata ] of
          Object.entries(cachedRawMetadata.affiliatedFiles)
    ) {
      this.affiliatedFilesMetadata.set(
        affiliatedFilePathRelativeToConsumingProjectRootDirectory,
        {
          modificationDateTime__ISO8601: affiliatedFileMetadata.modificationDate__ISO8601,
          directAffiliatedFilesRelativePaths: new Set(affiliatedFileMetadata.directAffiliatedFilesRelativePaths),
          parentEntryPointsAbsolutePaths: new Set(
            affiliatedFileMetadata.parentEntryPointsRelativePaths.map(
              (parentEntryPointsRelativePath: string): string => ImprovedPath.joinPathSegments(
                [ this.CONSUMING_PROJECT_ROOT_DIRECTORY_ABSOLUTE_PATH, parentEntryPointsRelativePath ],
                { alwaysForwardSlashSeparators: true }
              )
            )
          )
        }
      );
    }

  }

  private getAbsolutePathsOfExistingAffiliatedFilesOfExistingUpdatedTargetOne(
    {
      targetFileAbsolutePath,
      targetFileDirectoryAbsolutePath
    }: Readonly<{
      targetFileAbsolutePath: string;
      targetFileDirectoryAbsolutePath: string;
    }>
  ): Set<string> {

    const absolutePathsOfExistingAffiliatedFilesOfTargetOne: Set<string> = new Set();

    let fileContent: string;

    try {

      fileContent = FileSystem.readFileSync(targetFileAbsolutePath, "utf-8");

    } catch (error: unknown) {

      if (isErrnoException(error) && error.code === "ENOENT") {

        Logger.logError({
          mustOutputIf: __IS_DEVELOPMENT_BUILDING_MODE__ || SourceCodeSelectiveReprocessingHelper.DEBUGGING_MODE,
          errorType: UnexpectedEventError.NAME,
          title: UnexpectedEventError.localization.defaultTitle,
          description: `The existence of the file "${ targetFileAbsolutePath }" has been confirmed one moment ago ` +
              "but suddenly disappeared during reading. Skipping this file.",
          occurrenceLocation: "sourceCodeSelectiveReprocessingHelper." +
              "getAbsolutePathsOfExistingAffiliatedFilesOfExistingUpdatedTargetOne(compoundParameter)",
          caughtError: error
        });

        return absolutePathsOfExistingAffiliatedFilesOfTargetOne;

      }


      Logger.logError({
        mustOutputIf: __IS_DEVELOPMENT_BUILDING_MODE__ || SourceCodeSelectiveReprocessingHelper.DEBUGGING_MODE,
        errorType: FileReadingFailedError.NAME,
        title: FileReadingFailedError.localization.defaultTitle,
        description: FileReadingFailedError.localization.generateDescription({ filePath: targetFileAbsolutePath }),
        occurrenceLocation: "sourceCodeSelectiveReprocessingHelper." +
            "getAbsolutePathsOfExistingAffiliatedFilesOfExistingUpdatedTargetOne(compoundParameter)",
        caughtError: error
      });

      return absolutePathsOfExistingAffiliatedFilesOfTargetOne;

    }


    for (
      const fileIncludingDeclarationPattern of
          this.affiliatedFilesResolutionRules.affiliatedFilesIncludingDeclarationsPatterns
    ) {

      /* [ Theory ] Same file could be included for the multiple times.
       *   Occasionally it is even meaningful, but we are not need the duplicated here. */
      const affiliatedFilesRawPaths: Set<string> = new Set<string>(
        Array.from(fileContent.matchAll(fileIncludingDeclarationPattern)).
            map((regularExpressionMatchingData: RegExpMatchArray): string | undefined => regularExpressionMatchingData[1]).
            filter<string>(
              (affiliatedFileRawPath: string | undefined): affiliatedFileRawPath is string =>
                  isNonEmptyString(affiliatedFileRawPath)
            )
      );

      for (const affiliatedFileRawPath of affiliatedFilesRawPaths) {

        const affiliatedFileNormalizedPath: string | null = this.computeAbsolutePathOfAffiliatedFileIfItExists({
          affiliatedFileRawPath,
          parentFileDirectoryAbsolutePath: targetFileDirectoryAbsolutePath
        });

        if (isNotNull(affiliatedFileNormalizedPath)) {
          absolutePathsOfExistingAffiliatedFilesOfTargetOne.add(affiliatedFileNormalizedPath);
        }

      }

    }

    return absolutePathsOfExistingAffiliatedFilesOfTargetOne;

  }

  private updateMetadataMapForExistingAffiliatedFile(
    {
      targetAffiliatedFileAbsolutePath,
      parentEntryPointAbsolutePath
    }: Readonly<{
      targetAffiliatedFileAbsolutePath: string;
      parentEntryPointAbsolutePath: string;
    }>
  ): void {

    const targetAffiliatedFileRelativePath: string = ImprovedPath.computeRelativePath({
      basePath: this.CONSUMING_PROJECT_ROOT_DIRECTORY_ABSOLUTE_PATH,
      comparedPath: targetAffiliatedFileAbsolutePath,
      alwaysForwardSlashSeparators: true
    });

    const cachedMetadataOfCurrentAffiliatedFile: SourceCodeSelectiveReprocessingHelper.AffiliatedFileMetadata | undefined =
        this.affiliatedFilesMetadata.get(targetAffiliatedFileRelativePath);

    Logger.logGeneric({
      mustOutputIf: SourceCodeSelectiveReprocessingHelper.DEBUGGING_MODE,
      badge: { customText: "Debug" },
      title: "SourceCodeSelectiveReprocessingHelper, updating of affiliated files metadata map.",
      description: `The metadata of affiliated file "${ targetAffiliatedFileRelativePath }" .\n`,
      additionalData: {
        absolutePathsOfAffiliatedFilesWhichHasBeenScannedDuringCurrentPass:
            this.absolutePathsOfAffiliatedFilesWhichHasBeenScannedDuringCurrentPass
      }
    });

    /* [ Approach ] If the file has been scanned it must be in the cache however for the TypeScript type checking
    *   the non-undefined check of "cachedMetadataOfCurrentAffiliatedFile" additionally required. */
    if (
      this.absolutePathsOfAffiliatedFilesWhichHasBeenScannedDuringCurrentPass.has(targetAffiliatedFileRelativePath) &&
      isNotUndefined(cachedMetadataOfCurrentAffiliatedFile)
    ) {

      cachedMetadataOfCurrentAffiliatedFile.parentEntryPointsAbsolutePaths.add(parentEntryPointAbsolutePath);

      this.registerEntryPointAsParentTo({
        cachedMetadataOfCurrentAffiliatedFile,
        parentEntryPointAbsolutePath
      });

      return;

    }


    let targetAffiliatedFileModificationDateTime__ISO8601: string;

    try {

      targetAffiliatedFileModificationDateTime__ISO8601 = FileSystem.
          statSync(targetAffiliatedFileAbsolutePath).mtime.toISOString();

    } catch (error: unknown) {

      Logger.logError({
        errorType: "FileStatisticsRetrievingFailedError",
        title: "File statistics retrieving failed error",
        description: `Unable to retrieve the statistics of file "${ targetAffiliatedFileAbsolutePath }". ` +
            "This file will not be mapped.",
        occurrenceLocation: "sourceCodeSelectiveReprocessingHelper." +
            "updateMetadataMapForExistingAffiliatedFile(propertiesObject)",
        caughtError: error
      });

      return;

    }


    let absolutePathsOfExistingAffiliatedFilesOfTargetOne: Set<string>;

    if (
      isNotUndefined(cachedMetadataOfCurrentAffiliatedFile) &&
      cachedMetadataOfCurrentAffiliatedFile.modificationDateTime__ISO8601 === targetAffiliatedFileModificationDateTime__ISO8601
    ) {

      absolutePathsOfExistingAffiliatedFilesOfTargetOne = new Set<string>();

      /* [ Theory ] Although the affiliated file is existing and has not changed since last mapping, its affiliated
       *   files could be added or deleted. */
      for (
        const relativePathOfAffiliatedFileOfCurrentOne of
            cachedMetadataOfCurrentAffiliatedFile.directAffiliatedFilesRelativePaths
      ) {

        const absolutePathOfAffiliatedFileOfCurrentOne: string = ImprovedPath.joinPathSegments(
          [ this.CONSUMING_PROJECT_ROOT_DIRECTORY_ABSOLUTE_PATH, relativePathOfAffiliatedFileOfCurrentOne ],
          { alwaysForwardSlashSeparators: true }
        );

        if (!FileSystem.existsSync(absolutePathOfAffiliatedFileOfCurrentOne)) {
          cachedMetadataOfCurrentAffiliatedFile.directAffiliatedFilesRelativePaths.
              delete(relativePathOfAffiliatedFileOfCurrentOne);
        }

        absolutePathsOfExistingAffiliatedFilesOfTargetOne = new Set(
          Array.from(cachedMetadataOfCurrentAffiliatedFile.directAffiliatedFilesRelativePaths)
        );

      }

      cachedMetadataOfCurrentAffiliatedFile.parentEntryPointsAbsolutePaths.add(parentEntryPointAbsolutePath);

    } else {

      absolutePathsOfExistingAffiliatedFilesOfTargetOne = this.
          getAbsolutePathsOfExistingAffiliatedFilesOfExistingUpdatedTargetOne({
            targetFileAbsolutePath: targetAffiliatedFileAbsolutePath,
            targetFileDirectoryAbsolutePath: ImprovedPath.extractDirectoryFromFilePath({
              targetPath: targetAffiliatedFileAbsolutePath,
              alwaysForwardSlashSeparators: true,
              ambiguitiesResolution: {
                mustConsiderLastSegmentStartingWithDotAsDirectory: false,
                mustConsiderLastSegmentWithNonLeadingDotAsDirectory: false,
                mustConsiderLastSegmentWihtoutDotsAsFileNameWithoutExtension: true
              }
            })
          });

      this.affiliatedFilesMetadata.set(
        targetAffiliatedFileRelativePath,
        {
          parentEntryPointsAbsolutePaths: new Set<string>([ parentEntryPointAbsolutePath ]),
          modificationDateTime__ISO8601: targetAffiliatedFileModificationDateTime__ISO8601,
          directAffiliatedFilesRelativePaths: createSetBasedOnOtherSet(
              absolutePathsOfExistingAffiliatedFilesOfTargetOne,
              (absolutePathOfExistingAffiliatedFileOfCurrentOne: string): string =>
                  ImprovedPath.computeRelativePath({
                    basePath: this.CONSUMING_PROJECT_ROOT_DIRECTORY_ABSOLUTE_PATH,
                    comparedPath: absolutePathOfExistingAffiliatedFileOfCurrentOne,
                    alwaysForwardSlashSeparators: true
                  })
          )
        }
      );

    }

    this.absolutePathsOfAffiliatedFilesWhichHasBeenScannedDuringCurrentPass.add(targetAffiliatedFileRelativePath);

    if (SourceCodeSelectiveReprocessingHelper.DEBUGGING_MODE) {
      Logger.logInfo({
        badge: { customText: "Debug" },
        title: "SourceCodeSelectiveReprocessingHelper, affiliated files scanning complete.",
        description: `The metadata of affiliated file "${ targetAffiliatedFileRelativePath }"has been updated.\n`,
        additionalData: {
          affiliatedFilesMetadata: this.affiliatedFilesMetadata
        }
      });
    }

    for (const absolutePathOfExistingAffiliatedFileOfTargetOne of absolutePathsOfExistingAffiliatedFilesOfTargetOne) {
      this.updateMetadataMapForExistingAffiliatedFile({
        targetAffiliatedFileAbsolutePath: absolutePathOfExistingAffiliatedFileOfTargetOne,
        parentEntryPointAbsolutePath
      });
    }

  }

  private computeAbsolutePathOfAffiliatedFileIfItExists(
    {
      affiliatedFileRawPath,
      parentFileDirectoryAbsolutePath
    }: Readonly<{
      affiliatedFileRawPath: string;
      parentFileDirectoryAbsolutePath: string;
    }>
  ): string | null {

    const possibleAbsolutePathsOfTargetAffiliatedFile: Set<string> = new Set();

    const explicitlySpecifiedLastFileNameExtensionInAffiliatedFileRawPath: string | null =
        extractLastExtensionOfFileName({ targetPath: affiliatedFileRawPath, withLeadingDot: false });

    /* [ Approach ]
    * The second condition is aimed to the processing of paths with multiple files names extensions.
    * For example, in the Pug preprocessor case, the file "ProductCard.static.pug" could be referred as
    *   `include ProductCard.static`. */
    if (
      isNull(explicitlySpecifiedLastFileNameExtensionInAffiliatedFileRawPath) ||
      !this.affiliatedFilesResolutionRules.implicitFilesNamesExtensionsWithoutLeadingDotsOfAffiliatedFiles.
          includes(explicitlySpecifiedLastFileNameExtensionInAffiliatedFileRawPath)
    ) {

      addMultipleElementsToSet(
        possibleAbsolutePathsOfTargetAffiliatedFile,
        this.affiliatedFilesResolutionRules.implicitFilesNamesExtensionsWithoutLeadingDotsOfAffiliatedFiles.map(
          (affiliatedFileNameImplicitExtension: string): string =>
              ImprovedPath.joinPathSegments(
                [ parentFileDirectoryAbsolutePath, `${ affiliatedFileRawPath }.${ affiliatedFileNameImplicitExtension }` ],
                { alwaysForwardSlashSeparators: true }
              )
        )
      );

    } else {

      possibleAbsolutePathsOfTargetAffiliatedFile.add(
        ImprovedPath.joinPathSegments(
          [ parentFileDirectoryAbsolutePath, affiliatedFileRawPath ],
          { alwaysForwardSlashSeparators: true }
        )
      );

    }


    for (const possibleAbsolutePathOfTargetAffiliatedFile of possibleAbsolutePathsOfTargetAffiliatedFile) {

      try {

        if (FileSystem.existsSync(possibleAbsolutePathOfTargetAffiliatedFile)) {
          return possibleAbsolutePathOfTargetAffiliatedFile;
        }

      } catch (error: unknown) {

        if (__IS_DEVELOPMENT_BUILDING_MODE__) {
          Logger.logError({
            errorType: "FileCheckingError",
            title: "File checking error",
            description: `The error occurred during the checking of the file ${ possibleAbsolutePathOfTargetAffiliatedFile }` +
                "for existence.",
            occurrenceLocation: "sourceCodeSelectiveReprocessingHelper." +
                "computeAbsolutePathOfAffiliatedFileIfItExists(compoundParameter)",
            caughtError: error
          });
        }

        return null;

      }

    }

    return null;

  }

  private registerEntryPointAsParentTo(
    {
      cachedMetadataOfCurrentAffiliatedFile,
      parentEntryPointAbsolutePath
    }: Readonly<{
      cachedMetadataOfCurrentAffiliatedFile: SourceCodeSelectiveReprocessingHelper.AffiliatedFileMetadata;
      parentEntryPointAbsolutePath: string;
    }>
  ): void {

    for (
      const relativePathsOfDirectAffiliatedFileOfCurrentOne of
          cachedMetadataOfCurrentAffiliatedFile.directAffiliatedFilesRelativePaths
    ) {

      const cachedMetadataOfAffiliatedFileOfCurrentOne: SourceCodeSelectiveReprocessingHelper.AffiliatedFileMetadata | undefined =
          this.affiliatedFilesMetadata.get(relativePathsOfDirectAffiliatedFileOfCurrentOne);

      if (isUndefined(cachedMetadataOfAffiliatedFileOfCurrentOne)) {
        continue;
      }


      cachedMetadataOfAffiliatedFileOfCurrentOne.parentEntryPointsAbsolutePaths.add(parentEntryPointAbsolutePath);

      this.registerEntryPointAsParentTo({
        cachedMetadataOfCurrentAffiliatedFile: cachedMetadataOfAffiliatedFileOfCurrentOne,
        parentEntryPointAbsolutePath
      });

    }

  }

  /* === Cache file ================================================================================================= */
  private cacheFilesMetadataMapsToFile(): void {

    const outputData: SourceCodeSelectiveReprocessingHelper.CachedRawMetadata = {

      entryPoints: Array.from(this.entryPointsMetadata.entries()).
          reduce(
            (
              entryPointsMetadata: SourceCodeSelectiveReprocessingHelper.CachedRawMetadata.EntryPoints,
              [ entryPointPathRelativeToConsumingProjectRootDirectory, entryPointMetadata ]:
                  [ string, SourceCodeSelectiveReprocessingHelper.EntryPointFileMetadata ]
            ): SourceCodeSelectiveReprocessingHelper.CachedRawMetadata.EntryPoints => {

              entryPointsMetadata[entryPointPathRelativeToConsumingProjectRootDirectory] = {
                modificationDate__ISO8601: entryPointMetadata.modificationDate__ISO8601,
                directAffiliatedFilesRelativePaths: Array.from(entryPointMetadata.directAffiliatedFilesRelativePaths)
              };

              return entryPointsMetadata;

            },
            {}
          ),

      affiliatedFiles: Array.from(this.affiliatedFilesMetadata.entries()).
          reduce(
            (
              affiliatedFilesMetadata: SourceCodeSelectiveReprocessingHelper.CachedRawMetadata.AffiliatedFiles,
              [ affiliatedFilePathRelativeToConsumingProjectRootDirectory, affiliatedFileMetadata ]:
                  [ string, SourceCodeSelectiveReprocessingHelper.AffiliatedFileMetadata ]
            ): SourceCodeSelectiveReprocessingHelper.CachedRawMetadata.AffiliatedFiles => {

              affiliatedFilesMetadata[affiliatedFilePathRelativeToConsumingProjectRootDirectory] = {
                modificationDate__ISO8601: affiliatedFileMetadata.modificationDateTime__ISO8601,
                directAffiliatedFilesRelativePaths: Array.from(affiliatedFileMetadata.directAffiliatedFilesRelativePaths),
                parentEntryPointsRelativePaths: Array.from(affiliatedFileMetadata.parentEntryPointsAbsolutePaths).
                    map(
                      (parentEntryPointsAbsolutePath: string): string =>
                          ImprovedPath.computeRelativePath({
                            basePath: this.CONSUMING_PROJECT_ROOT_DIRECTORY_ABSOLUTE_PATH,
                            comparedPath: parentEntryPointsAbsolutePath,
                            alwaysForwardSlashSeparators: true
                          })
                    )
              };

              return affiliatedFilesMetadata;

            },
            {}
          )

    };

    FileSystem.writeFileSync(this.CACHED_METADATA_FILE_ABSOLUTE_PATH, stringifyAndFormatArbitraryValue(outputData));

  }


  /* === Incremental remapping ====================================================================================== */


  /* ━━━ Logging ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private logAffiliatedFilesAndEntryPointsRelationships(): void {

    let accumulatingString: string = "";

    for (const [ affiliatedFileRelativePath, affiliatedFileMetadata ] of this.affiliatedFilesMetadata.entries()) {

      accumulatingString = `${ accumulatingString }File: "${ affiliatedFileRelativePath }" has parents:\n`;

      for (const entryPointFileAbsolutePath of affiliatedFileMetadata.parentEntryPointsAbsolutePaths) {
        accumulatingString = `${ accumulatingString }  ● ${
          ImprovedPath.computeRelativePath({
            basePath: this.CONSUMING_PROJECT_ROOT_DIRECTORY_ABSOLUTE_PATH,
            comparedPath: entryPointFileAbsolutePath,
            alwaysForwardSlashSeparators: true
          })
        }\n`;
      }

    }

    Logger.logInfo({
      title: `${ this.TARGET_FILES_TYPE_IN_SINGULAR_FORM } Affiliated Files and Respective Parent Entry Points Relationships`,
      description: accumulatingString.length > 0 ? accumulatingString : "No existing affiliated files has been found."
    });

  }

}


namespace SourceCodeSelectiveReprocessingHelper {

  export type InitializationProperties = Readonly<{
    initialEntryPointsSourceFilesAbsolutePaths: ReadonlyArray<string>;
    isEntryPoint: (targetFileAbsolutePath: string) => boolean;
    affiliatedFilesResolutionRules: AffiliatedFilesResolutionRules;
    consumingProjectRootDirectoryAbsolutePath: string;
    cacheFileAbsolutePath: string;
    logging: Readonly<{
      mustEnable: boolean;
      targetFilesTypeInSingularForm: string;
    }>;
  }>;


  export type EntryPointsMetadata = Map<
    EntryPointMetadata.EntryPointPathRelativeConsumingProjectRootDirectory, EntryPointFileMetadata
  >;

  export namespace EntryPointMetadata {
    export type EntryPointPathRelativeConsumingProjectRootDirectory = string;
  }

  export type EntryPointFileMetadata = {
    modificationDate__ISO8601: string;
    directAffiliatedFilesRelativePaths: Set<string>;
  };


  export type AffiliatedFilesMetadata = Map<
    AffiliatedFilesMetadata.AffiliatedFilePathRelativeToConsumingProjectRootDirectory, AffiliatedFileMetadata
  >;

  export namespace AffiliatedFilesMetadata {
    export type AffiliatedFilePathRelativeToConsumingProjectRootDirectory = string;
  }

  export type AffiliatedFileMetadata = {
    modificationDateTime__ISO8601: string;
    directAffiliatedFilesRelativePaths: Set<string>;
    parentEntryPointsAbsolutePaths: Set<string>;
  };


  export type AffiliatedFilesResolutionRules = Readonly<{
    implicitFilesNamesExtensionsWithoutLeadingDotsOfAffiliatedFiles: ReadonlyArray<string>;
    affiliatedFilesIncludingDeclarationsPatterns: ReadonlyArray<RegExp>;
  }>;


  export type CachedRawMetadata = Readonly<{
    entryPoints: CachedRawMetadata.EntryPoints;
    affiliatedFiles: CachedRawMetadata.AffiliatedFiles;
  }>;

  /* [ Theory ] Currently, the "ObjectDataFilesProcessor" does not support the Readonly-types. */
  export namespace CachedRawMetadata {

    export type EntryPoints = { [pathRelativeToConsumingProjectRootDirectory: string]: EntryPoint; };

    export type EntryPoint = {
      modificationDate__ISO8601: string;
      directAffiliatedFilesRelativePaths: Array<string>;
    };

    export type AffiliatedFiles = { [pathRelativeToConsumingProjectRootDirectory: string]: AffiliatedFile; };

    export type AffiliatedFile = {
      modificationDate__ISO8601: string;
      directAffiliatedFilesRelativePaths: Array<string>;
      parentEntryPointsRelativePaths: Array<string>;
    };

  }

}


export default SourceCodeSelectiveReprocessingHelper;
