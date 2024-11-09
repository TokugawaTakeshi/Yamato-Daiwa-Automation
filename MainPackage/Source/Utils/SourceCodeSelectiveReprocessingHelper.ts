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
  replaceArrayElementsByIndexesImmutably,
  isString,
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
import Path from "path";


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
              directChildrenFilesRelativePaths: {
                type: Array,
                required: true,
                element: { type: String }
              }
            }
          }
        },
        childrenFiles: {
          type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
          required: true,
          value: {
            type: Object,
            properties: {
              modificationDate__ISO8601: {
                type: String,
                required: true
              },
              directChildrenFilesRelativePaths: {
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

  private readonly childrenFilesMetadata: SourceCodeSelectiveReprocessingHelper.ChildrenFilesMetadata = new Map();
  private readonly resolvedAliasedPaths: Map<string, string> = new Map<string, string>();
  private readonly childrenFilesResolutionRules: SourceCodeSelectiveReprocessingHelper.ChildrenFilesResolutionRules;
  private readonly absolutePathsOfChildrenFilesWhichHasBeenScannedDuringCurrentPass: Set<string> = new Set();
  private readonly directoriesAliasesAndTheirAbsolutePatsMap: ReadonlyMap<string, ReadonlySet<string>>;

  private readonly CONSUMING_PROJECT_ROOT_DIRECTORY_ABSOLUTE_PATH: string;
  private readonly CACHED_METADATA_FILE_ABSOLUTE_PATH: string;
  private readonly TARGET_FILES_TYPE_IN_SINGULAR_FORM: string;


  /* ━━━ Constructor ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public constructor(initializationProperties: SourceCodeSelectiveReprocessingHelper.InitializationProperties) {

    this.isEntryPoint = initializationProperties.isEntryPoint;

    this.childrenFilesResolutionRules = initializationProperties.childrenFilesResolutionRules;
    this.directoriesAliasesAndTheirAbsolutePatsMap =
        initializationProperties.directoriesAliasesAndTheirAbsolutePatsMap ?? new Map();

    this.CONSUMING_PROJECT_ROOT_DIRECTORY_ABSOLUTE_PATH = initializationProperties.consumingProjectRootDirectoryAbsolutePath;
    this.CACHED_METADATA_FILE_ABSOLUTE_PATH = initializationProperties.cacheFileAbsolutePath;
    this.TARGET_FILES_TYPE_IN_SINGULAR_FORM = initializationProperties.logging.targetFilesTypeInSingularForm;

    /* [ Theory ] The cached metadata from previous YDA launches could be. */
    this.retrieveCacheFromFileAndApplyIfItExists();

    this.scanFilesHierarchyTreeForEntryPoints(
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
      this.logChildrenFilesAndEntryPointsRelationships();
    }

    this.saveCachedFilesMetadataMapsToFile();

  }


  /* ━━━ Public Methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public getAbsolutePathsOfEntryPointsWhichMustBeProcessed(
    absolutePathsOfFilesWithChangedStatus__forwardSlashSeparators: ReadonlySet<string>
  ): Array<string> {

    const absolutePathsOfEntryPointsWhichMustBeProcessed__forwardSlashSeparators: Set<string> = new Set();
    const absolutePathsOfChildrenFilesWhichParentEntryPointsMustBeProcessed__forwardSlashSeparators: Set<string> = new Set();

    for (
      const absolutePathOfFileWithChangedStatus__forwardSlashSeparators of
          absolutePathsOfFilesWithChangedStatus__forwardSlashSeparators
    ) {

      const pathRelativeRelativeToConsumingProjectRootDirectoryOfFileWithChangedStatus__forwardSlashSeparators: string =
          ImprovedPath.computeRelativePath({
            basePath: this.CONSUMING_PROJECT_ROOT_DIRECTORY_ABSOLUTE_PATH,
            comparedPath: absolutePathOfFileWithChangedStatus__forwardSlashSeparators,
            alwaysForwardSlashSeparators: true
          });

      if (FileSystem.existsSync(absolutePathOfFileWithChangedStatus__forwardSlashSeparators)) {

        if (this.isEntryPoint(absolutePathOfFileWithChangedStatus__forwardSlashSeparators)) {
          absolutePathsOfEntryPointsWhichMustBeProcessed__forwardSlashSeparators.
              add(absolutePathOfFileWithChangedStatus__forwardSlashSeparators);
        } else {
          absolutePathsOfChildrenFilesWhichParentEntryPointsMustBeProcessed__forwardSlashSeparators.
              add(absolutePathOfFileWithChangedStatus__forwardSlashSeparators);
        }

      } else {
        this.clearFileMetadataPathFromCache(
          pathRelativeRelativeToConsumingProjectRootDirectoryOfFileWithChangedStatus__forwardSlashSeparators
        );
      }

    }

    this.scanFilesHierarchyTreeForEntryPoints(absolutePathsOfEntryPointsWhichMustBeProcessed__forwardSlashSeparators);

    this.saveCachedFilesMetadataMapsToFile();

    for (
      const absolutePathOfChildFile__forwardSlashSeparators of
          absolutePathsOfChildrenFilesWhichParentEntryPointsMustBeProcessed__forwardSlashSeparators
    ) {

      const pathOfChildFileRelativeToConsumingProjectRootDirectory__forwardSlashSeparators: string = ImprovedPath.
          computeRelativePath({
            basePath: this.CONSUMING_PROJECT_ROOT_DIRECTORY_ABSOLUTE_PATH,
            comparedPath: absolutePathOfChildFile__forwardSlashSeparators,
            alwaysForwardSlashSeparators: true
          });

      addMultipleElementsToSet(
        absolutePathsOfEntryPointsWhichMustBeProcessed__forwardSlashSeparators,
        Array.from(
          this.childrenFilesMetadata.get(
            pathOfChildFileRelativeToConsumingProjectRootDirectory__forwardSlashSeparators
          )?.parentEntryPointsAbsolutePaths ??
          new Set()
        )
      );

    }

    return Array.from(absolutePathsOfEntryPointsWhichMustBeProcessed__forwardSlashSeparators);

  }


  /* ━━━ Private Methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* ─── Initial Pass ─────────────────────────────────────────────────────────────────────────────────────────────── */
  private retrieveCacheFromFileAndApplyIfItExists(): void {

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
          errorType: "CachedDataRetrievingFailedError",
          title: "Cached Data Retrieving Failed",
          description: `Unable to read the existing cache file at "${ this.CACHED_METADATA_FILE_ABSOLUTE_PATH }".`,
          occurrenceLocation: "sourceCodeSelectiveReprocessingHelper.retrieveCacheFromFileAndApplyIfItExists()",
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
          directChildrenFilesRelativePaths: new Set(entryPointRawMetadata.directChildrenFilesRelativePaths)
        }
      );
    }

    for (
      const [ childFilePathRelativeToConsumingProjectRootDirectory, childFileMetadata ] of
          Object.entries(cachedRawMetadata.childrenFiles)
    ) {
      this.childrenFilesMetadata.set(
        childFilePathRelativeToConsumingProjectRootDirectory,
        {
          modificationDateTime__ISO8601: childFileMetadata.modificationDate__ISO8601,
          directChildrenFilesRelativePaths: new Set(childFileMetadata.directChildrenFilesRelativePaths),
          parentEntryPointsAbsolutePaths: new Set(
            childFileMetadata.parentEntryPointsRelativePaths.map(
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


  /* ─── All Passes ───────────────────────────────────────────────────────────────────────────────────────────────── */
  private scanFilesHierarchyTreeForEntryPoints(
    targetEntryPointsAbsolutePaths__forwardSlashSeparators: ReadonlySet<string>
  ): void {

    for (const entryPointAbsolutePath__forwardSlashSeparators of targetEntryPointsAbsolutePaths__forwardSlashSeparators) {

      const entryPointDirectoryAbsolutePath__forwardSlashSeparators: string = ImprovedPath.extractDirectoryFromFilePath({
        targetPath: entryPointAbsolutePath__forwardSlashSeparators,
        ambiguitiesResolution: {
          mustConsiderLastSegmentStartingWithDotAsDirectory: false,
          mustConsiderLastSegmentWithNonLeadingDotAsDirectory: false,
          mustConsiderLastSegmentWithoutDotsAsFileNameWithoutExtension: true
        },
        alwaysForwardSlashSeparators: true
      });

      const entryPointPathRelativeToConsumingProjectRootDirectory__forwardSlashSeparators: string = ImprovedPath.
          computeRelativePath({
            basePath: this.CONSUMING_PROJECT_ROOT_DIRECTORY_ABSOLUTE_PATH,
            comparedPath: entryPointAbsolutePath__forwardSlashSeparators,
            alwaysForwardSlashSeparators: true
          });

      let entryPointLastModificationDateTime__ISO8601: string;

      try {

        entryPointLastModificationDateTime__ISO8601 = FileSystem.statSync(entryPointAbsolutePath__forwardSlashSeparators).
            mtime.
            toISOString();

      } catch (error: unknown) {

        if (isErrnoException(error) && error.code === "ENOENT") {
          this.entryPointsMetadata.delete(entryPointPathRelativeToConsumingProjectRootDirectory__forwardSlashSeparators);
          continue;
        }


        Logger.logError({
          mustOutputIf: __IS_DEVELOPMENT_BUILDING_MODE__ || SourceCodeSelectiveReprocessingHelper.DEBUGGING_MODE,
          errorType: "FileStatisticsRetrievingFailedError",
          title: "File Statistics Retrieving Failed Error",
          description:
              "Unable to retrieve the statistics of file " +
                `"${ entryPointPathRelativeToConsumingProjectRootDirectory__forwardSlashSeparators }". ` +
              "This file will not be mapped.",
          occurrenceLocation: "sourceCodeSelectiveReprocessingHelper." +
              "scanFilesHierarchyTreeForEntryPoints(targetEntryPointsAbsolutePaths__forwardSlashSeparators)",
          caughtError: error
        });

        continue;

      }


      let cachedMetadataOfCurrentEntryPoint: SourceCodeSelectiveReprocessingHelper.EntryPointFileMetadata | undefined =
          this.entryPointsMetadata.get(entryPointPathRelativeToConsumingProjectRootDirectory__forwardSlashSeparators);

      let absolutePathsOfExistingDirectChildrenFilesOfCurrentEntryPoint__forwardSlashSeparators: ReadonlySet<string> =
          new Set();

      /* [ Theory ] This condition will could be truthy (but not always) only on initial pass. */
      if (cachedMetadataOfCurrentEntryPoint?.modificationDate__ISO8601 === entryPointLastModificationDateTime__ISO8601) {

        /* [ Theory ]
         * Although the entry point file is existing and has not changed since last scan, its children files could
         *  be added or deleted. */
        for (
          const pathRelativeToConsumingProjectRootDirectoryOfChildFileOfCurrentEntryPoint__forwardSlashSeparators of
              cachedMetadataOfCurrentEntryPoint.directChildrenFilesRelativePaths
        ) {

          const absolutePathOfChildFileOfCurrentEntryPoint__forwardSlashSeparators: string = ImprovedPath.joinPathSegments(
            [
              this.CONSUMING_PROJECT_ROOT_DIRECTORY_ABSOLUTE_PATH,
              pathRelativeToConsumingProjectRootDirectoryOfChildFileOfCurrentEntryPoint__forwardSlashSeparators
            ],
            { alwaysForwardSlashSeparators: true }
          );

          if (!FileSystem.existsSync(absolutePathOfChildFileOfCurrentEntryPoint__forwardSlashSeparators)) {
            this.clearFileMetadataPathFromCache(
              pathRelativeToConsumingProjectRootDirectoryOfChildFileOfCurrentEntryPoint__forwardSlashSeparators
            );
          }

          absolutePathsOfExistingDirectChildrenFilesOfCurrentEntryPoint__forwardSlashSeparators = new Set(
            Array.from(cachedMetadataOfCurrentEntryPoint.directChildrenFilesRelativePaths)
          );

        }

      } else {

        /* [ Maintainability ]　Keep this variable for debugging. */
        absolutePathsOfExistingDirectChildrenFilesOfCurrentEntryPoint__forwardSlashSeparators = this.
            getAbsolutePathsOfExistingChildrenFilesOfExistingTargetFile__forwardSlashSeparators({
              targetFileAbsolutePath__forwardSlashSeparators: entryPointAbsolutePath__forwardSlashSeparators,
              preComputedTargetFileDirectoryAbsolutePath__forwardSlashSeparators:
                  entryPointDirectoryAbsolutePath__forwardSlashSeparators
            });

        cachedMetadataOfCurrentEntryPoint = {
          modificationDate__ISO8601: entryPointLastModificationDateTime__ISO8601,
          directChildrenFilesRelativePaths: createSetBasedOnOtherSet(
            absolutePathsOfExistingDirectChildrenFilesOfCurrentEntryPoint__forwardSlashSeparators,
            (absolutePathOfExistingDirectChildFileOfCurrentEntryPoint__forwardSlashSeparators: string): string =>
                ImprovedPath.computeRelativePath({
                  basePath: this.CONSUMING_PROJECT_ROOT_DIRECTORY_ABSOLUTE_PATH,
                  comparedPath: absolutePathOfExistingDirectChildFileOfCurrentEntryPoint__forwardSlashSeparators,
                  alwaysForwardSlashSeparators: true
                })
          )
        };

        this.entryPointsMetadata.set(
          entryPointPathRelativeToConsumingProjectRootDirectory__forwardSlashSeparators,
          cachedMetadataOfCurrentEntryPoint
        );

      }

      Logger.logGeneric({
        mustOutputIf: SourceCodeSelectiveReprocessingHelper.DEBUGGING_MODE,
        badge: { customText: "Debug" },
        title: "SourceCodeSelectiveReprocessingHelper, Entry Point Analysis Complete.",
        description: entryPointPathRelativeToConsumingProjectRootDirectory__forwardSlashSeparators,
        additionalData: cachedMetadataOfCurrentEntryPoint
      });

      for (
        const absolutePathOfDirectExistingChildFileOfCurrentEntryPoint__forwardSlashSeparators of
            absolutePathsOfExistingDirectChildrenFilesOfCurrentEntryPoint__forwardSlashSeparators
      ) {

        this.updateMetadataForExistingChildFile({
          targetChildFileAbsolutePath__forwardSlashSeparators:
              absolutePathOfDirectExistingChildFileOfCurrentEntryPoint__forwardSlashSeparators,
          parentEntryPointAbsolutePath__forwardSlashSeparators: entryPointAbsolutePath__forwardSlashSeparators
        });

        this.absolutePathsOfChildrenFilesWhichHasBeenScannedDuringCurrentPass.
            add(absolutePathOfDirectExistingChildFileOfCurrentEntryPoint__forwardSlashSeparators);

      }

    }

    this.absolutePathsOfChildrenFilesWhichHasBeenScannedDuringCurrentPass.clear();

  }

  /* [ Approach ] The target file could be either entry point or not. */
  private getAbsolutePathsOfExistingChildrenFilesOfExistingTargetFile__forwardSlashSeparators(
    {
      targetFileAbsolutePath__forwardSlashSeparators,
      preComputedTargetFileDirectoryAbsolutePath__forwardSlashSeparators
    }: Readonly<{
      targetFileAbsolutePath__forwardSlashSeparators: string;
      preComputedTargetFileDirectoryAbsolutePath__forwardSlashSeparators?: string;
    }>
  ): Set<string> {

    const absolutePathsOfExistingChildrenFilesOfTargetOne__forwardSlashSeparators: Set<string> = new Set();

    let fileContent: string;

    try {

      fileContent = FileSystem.readFileSync(targetFileAbsolutePath__forwardSlashSeparators, "utf-8");

    } catch (error: unknown) {

      if (isErrnoException(error) && error.code === "ENOENT") {

        Logger.logError({
          mustOutputIf: __IS_DEVELOPMENT_BUILDING_MODE__ || SourceCodeSelectiveReprocessingHelper.DEBUGGING_MODE,
          errorType: UnexpectedEventError.NAME,
          title: UnexpectedEventError.localization.defaultTitle,
          description:
              `Contrary to expectations, "${ targetFileAbsolutePath__forwardSlashSeparators }" file does not exist. ` +
              "Skipping this file.",
          occurrenceLocation: "sourceCodeSelectiveReprocessingHelper." +
              "getAbsolutePathsOfExistingChildrenFilesOfExistingTargetFile__forwardSlashSeparators(compoundParameter)",
          caughtError: error
        });

        return absolutePathsOfExistingChildrenFilesOfTargetOne__forwardSlashSeparators;

      }


      Logger.logError({
        mustOutputIf: __IS_DEVELOPMENT_BUILDING_MODE__ || SourceCodeSelectiveReprocessingHelper.DEBUGGING_MODE,
        errorType: FileReadingFailedError.NAME,
        title: FileReadingFailedError.localization.defaultTitle,
        description: FileReadingFailedError.localization.
            generateDescription({ filePath: targetFileAbsolutePath__forwardSlashSeparators }),
        occurrenceLocation: "sourceCodeSelectiveReprocessingHelper." +
            "getAbsolutePathsOfExistingChildrenFilesOfExistingTargetFile__forwardSlashSeparators(compoundParameter)",
        caughtError: error
      });

      return absolutePathsOfExistingChildrenFilesOfTargetOne__forwardSlashSeparators;

    }


    for (
      const fileIncludingDeclarationPattern of
          this.childrenFilesResolutionRules.childrenFilesIncludingDeclarationsPatterns
    ) {

      /* [ Theory ] Same file could be included for the multiple times.
       *   Occasionally it is even meaningful, but we are not need the duplicated here. */
      const childrenFilesRawPaths: Set<string> = new Set<string>(
        Array.from(fileContent.matchAll(fileIncludingDeclarationPattern)).
            map((regularExpressionMatchingData: RegExpMatchArray): string | undefined => regularExpressionMatchingData[1]).
            filter<string>(
              (childFileRawPath: string | undefined): childFileRawPath is string => isNonEmptyString(childFileRawPath)
            )
      );

      const targetChildFileDirectoryAbsolutePath__forwardSlashSeparators: string =
          preComputedTargetFileDirectoryAbsolutePath__forwardSlashSeparators ??
          ImprovedPath.extractDirectoryFromFilePath({
            targetPath: targetFileAbsolutePath__forwardSlashSeparators,
            ambiguitiesResolution: {
              mustConsiderLastSegmentStartingWithDotAsDirectory: false,
              mustConsiderLastSegmentWithNonLeadingDotAsDirectory: false,
              mustConsiderLastSegmentWithoutDotsAsFileNameWithoutExtension: true
            },
            alwaysForwardSlashSeparators: true
          });

      for (const childFileRawPath of childrenFilesRawPaths) {

        const childFileNormalizedPath: string | null = this.computeAbsolutePathOfChildFileIfItExists({
          childFileRawPath,
          parentFileDirectoryAbsolutePath__forwardSlashSeparators:
              targetChildFileDirectoryAbsolutePath__forwardSlashSeparators
        });

        if (isNotNull(childFileNormalizedPath)) {
          absolutePathsOfExistingChildrenFilesOfTargetOne__forwardSlashSeparators.add(childFileNormalizedPath);
        }

      }

    }

    return absolutePathsOfExistingChildrenFilesOfTargetOne__forwardSlashSeparators;

  }

  private computeAbsolutePathOfChildFileIfItExists(
    {
      childFileRawPath,
      parentFileDirectoryAbsolutePath__forwardSlashSeparators
    }: Readonly<{
      childFileRawPath: string;
      parentFileDirectoryAbsolutePath__forwardSlashSeparators: string;
    }>
  ): string | null {

    let possibleIntermediatePathsOfChildFileWithResolvedAlias: Set<string> = new Set();

    const segmentsOfChildFileRawPath: ReadonlyArray<string> = ImprovedPath.explodePathToSegments(childFileRawPath);
    const firstSegmentOfChildFileRawPath: string | undefined = segmentsOfChildFileRawPath[0];

    if (isNonEmptyString(firstSegmentOfChildFileRawPath)) {
      possibleIntermediatePathsOfChildFileWithResolvedAlias = createSetBasedOnOtherSet(
        this.directoriesAliasesAndTheirAbsolutePatsMap.get(firstSegmentOfChildFileRawPath) ?? new Set<string>(),
        (absolutePathOfDirectoryOnWhichAliasedFirstPathSegmentCouldRefer: string): string =>
            ImprovedPath.joinPathSegments(
              replaceArrayElementsByIndexesImmutably({
                targetArray: segmentsOfChildFileRawPath,
                index: 0,
                newElement: absolutePathOfDirectoryOnWhichAliasedFirstPathSegmentCouldRefer
              }),
              { alwaysForwardSlashSeparators: true }
            )
      );
    }

    let isChildFileRawPathAliased: boolean;

    if (possibleIntermediatePathsOfChildFileWithResolvedAlias.size > 0) {

      const previouslyResolvedPathFromAliasedOne: string | undefined = this.resolvedAliasedPaths.get(childFileRawPath);

      if (isString(previouslyResolvedPathFromAliasedOne)) {

        try {

          if (FileSystem.existsSync(previouslyResolvedPathFromAliasedOne)) {
            return previouslyResolvedPathFromAliasedOne;
          }

        } catch (error: unknown) {

          if (__IS_DEVELOPMENT_BUILDING_MODE__) {
            Logger.logError({
              errorType: "FileCheckingError",
              title: "File Checking Error",
              description:
                  `The error occurred during the checking of the file ${ previouslyResolvedPathFromAliasedOne }` +
                  "for existence.",
              occurrenceLocation: "sourceCodeSelectiveReprocessingHelper." +
                  "computeAbsolutePathOfChildFileIfItExists(compoundParameter)",
              caughtError: error
            });
          }

        }

        this.resolvedAliasedPaths.delete(childFileRawPath);

      }

      isChildFileRawPathAliased = true;

    } else {
      isChildFileRawPathAliased = false;
      possibleIntermediatePathsOfChildFileWithResolvedAlias = new Set([ childFileRawPath ]);
    }

    const possibleAbsolutePathsOfTargetChildFile__forwardSlashSeparators: Set<string> = new Set();

    const explicitlySpecifiedLastFileNameExtensionInChildrenFileRawPath: string | null =
        extractLastExtensionOfFileName({ targetPath: childFileRawPath, withLeadingDot: false });

    /* [ Approach ]
    * The second condition of if-branch is aimed to the processing of paths with multiple files names extensions.
    * For example, in the Pug preprocessor case, the file "ProductCard.static.pug" could be referred as
    *   `include ProductCard.static`. */
    if (
      isNull(explicitlySpecifiedLastFileNameExtensionInChildrenFileRawPath) ||
      !this.childrenFilesResolutionRules.implicitFilesNamesExtensionsWithoutLeadingDotsOfChildrenFiles.
          includes(explicitlySpecifiedLastFileNameExtensionInChildrenFileRawPath)
    ) {

      for (
        const possibleIntermediatePathOfChildFileWithResolvedAlias of
            possibleIntermediatePathsOfChildFileWithResolvedAlias
      ) {

        addMultipleElementsToSet(
          possibleAbsolutePathsOfTargetChildFile__forwardSlashSeparators,
          this.childrenFilesResolutionRules.implicitFilesNamesExtensionsWithoutLeadingDotsOfChildrenFiles.map(
            (childFileNameImplicitExtension: string): string =>
              ImprovedPath.joinPathSegments(
                [
                  ...Path.isAbsolute(possibleIntermediatePathOfChildFileWithResolvedAlias) ?
                      [] : [ parentFileDirectoryAbsolutePath__forwardSlashSeparators ],
                  `${ possibleIntermediatePathOfChildFileWithResolvedAlias }.${ childFileNameImplicitExtension }`
                ],
                { alwaysForwardSlashSeparators: true }
              )
          )
        );

      }

    } else {

      for (
        const possibleIntermediatePathOfChildFileWithResolvedAlias of
            possibleIntermediatePathsOfChildFileWithResolvedAlias
      ) {

        possibleAbsolutePathsOfTargetChildFile__forwardSlashSeparators.add(
          ImprovedPath.joinPathSegments(
            [
              ...Path.isAbsolute(possibleIntermediatePathOfChildFileWithResolvedAlias) ?
                  [] : [ parentFileDirectoryAbsolutePath__forwardSlashSeparators ],
              possibleIntermediatePathOfChildFileWithResolvedAlias
            ],
            { alwaysForwardSlashSeparators: true }
          )
        );

      }

    }

    for (const possibleAbsolutePathOfTargetChildFile of possibleAbsolutePathsOfTargetChildFile__forwardSlashSeparators) {

      try {

        if (FileSystem.existsSync(possibleAbsolutePathOfTargetChildFile)) {

          if (isChildFileRawPathAliased) {
            this.resolvedAliasedPaths.set(childFileRawPath, possibleAbsolutePathOfTargetChildFile);
          }

          return possibleAbsolutePathOfTargetChildFile;

        }

      } catch (error: unknown) {

        if (__IS_DEVELOPMENT_BUILDING_MODE__) {
          Logger.logError({
            errorType: "FileCheckingError",
            title: "File Checking Error",
            description:
                `The error occurred during the checking of the file ${ possibleAbsolutePathOfTargetChildFile }` +
                  "for existence.",
            occurrenceLocation: "sourceCodeSelectiveReprocessingHelper." +
                "computeAbsolutePathOfChildFileIfItExists(compoundParameter)",
            caughtError: error
          });
        }

        return null;

      }

    }

    return null;

  }

  private updateMetadataForExistingChildFile(
    {
      targetChildFileAbsolutePath__forwardSlashSeparators,
      parentEntryPointAbsolutePath__forwardSlashSeparators
    }: Readonly<{
      targetChildFileAbsolutePath__forwardSlashSeparators: string;
      parentEntryPointAbsolutePath__forwardSlashSeparators: string;
    }>
  ): void {

    const targetChildFileRelativePath__forwardSlashSeparators: string = ImprovedPath.computeRelativePath({
      basePath: this.CONSUMING_PROJECT_ROOT_DIRECTORY_ABSOLUTE_PATH,
      comparedPath: targetChildFileAbsolutePath__forwardSlashSeparators,
      alwaysForwardSlashSeparators: true
    });

    const cachedMetadataOfCurrentChildFile: SourceCodeSelectiveReprocessingHelper.ChildFileMetadata | undefined =
        this.childrenFilesMetadata.get(targetChildFileRelativePath__forwardSlashSeparators);

    Logger.logGeneric({
      mustOutputIf: SourceCodeSelectiveReprocessingHelper.DEBUGGING_MODE,
      badge: { customText: "Debug" },
      title: "SourceCodeSelectiveReprocessingHelper, Updating of Children Files Metadata",
      description: targetChildFileRelativePath__forwardSlashSeparators,
      additionalData: {
        absolutePathsOfAffiliatedFilesWhichHasBeenScannedDuringCurrentPass:
            this.absolutePathsOfChildrenFilesWhichHasBeenScannedDuringCurrentPass
      }
    });

    /* [ Approach ] If the child file has been scanned it must be in the `childrenFilesMetadata` however for the
    *    TypeScript type checking the non-undefined check of "cachedMetadataOfCurrentAffiliatedFile" additionally
    *    required. */
    if (
      this.absolutePathsOfChildrenFilesWhichHasBeenScannedDuringCurrentPass.
          has(targetChildFileRelativePath__forwardSlashSeparators) &&
      isNotUndefined(cachedMetadataOfCurrentChildFile)
    ) {

      cachedMetadataOfCurrentChildFile.parentEntryPointsAbsolutePaths.
          add(parentEntryPointAbsolutePath__forwardSlashSeparators);

      this.registerEntryPointAsParentTo({
        cachedMetadataOfTargetChildFile: cachedMetadataOfCurrentChildFile,
        parentEntryPointAbsolutePath__forwardSlashSeparators
      });

      return;

    }


    let targetChildFileModificationDateTime__ISO8601: string;

    try {

      targetChildFileModificationDateTime__ISO8601 = FileSystem.
          statSync(targetChildFileAbsolutePath__forwardSlashSeparators).mtime.toISOString();

    } catch (error: unknown) {

      Logger.logError({
        errorType: "FileStatisticsRetrievingFailedError",
        title: "File Statistics Retrieving Failed Error",
        description:
            `Unable to retrieve the statistics of file "${ targetChildFileAbsolutePath__forwardSlashSeparators }". ` +
            "This file will not be mapped.",
        occurrenceLocation: "sourceCodeSelectiveReprocessingHelper.updateMetadataForExistingChildFile(compoundParameter)",
        caughtError: error
      });

      return;

    }


    let absolutePathsOfExistingChildrenFilesOfTargetOne__forwardSlashSeparators: Set<string>;

    if (cachedMetadataOfCurrentChildFile?.modificationDateTime__ISO8601 === targetChildFileModificationDateTime__ISO8601) {

      absolutePathsOfExistingChildrenFilesOfTargetOne__forwardSlashSeparators = new Set<string>();

      /* [ Theory ] Although the children file is existing and has not changed since last mapping, its children
       *   files could be added or deleted. */
      for (
        const relativePathOfChildFileOfCurrentOne of cachedMetadataOfCurrentChildFile.directChildrenFilesRelativePaths
      ) {

        const absolutePathOfChildFileOfCurrentOne__forwardSlashSeparators: string = ImprovedPath.joinPathSegments(
          [ this.CONSUMING_PROJECT_ROOT_DIRECTORY_ABSOLUTE_PATH, relativePathOfChildFileOfCurrentOne ],
          { alwaysForwardSlashSeparators: true }
        );

        if (!FileSystem.existsSync(absolutePathOfChildFileOfCurrentOne__forwardSlashSeparators)) {
          cachedMetadataOfCurrentChildFile.directChildrenFilesRelativePaths.delete(relativePathOfChildFileOfCurrentOne);
        }

        absolutePathsOfExistingChildrenFilesOfTargetOne__forwardSlashSeparators = new Set(
          Array.from(cachedMetadataOfCurrentChildFile.directChildrenFilesRelativePaths)
        );

      }

      cachedMetadataOfCurrentChildFile.parentEntryPointsAbsolutePaths.
          add(parentEntryPointAbsolutePath__forwardSlashSeparators);

    } else {

      absolutePathsOfExistingChildrenFilesOfTargetOne__forwardSlashSeparators = this.
          getAbsolutePathsOfExistingChildrenFilesOfExistingTargetFile__forwardSlashSeparators({
            targetFileAbsolutePath__forwardSlashSeparators: targetChildFileAbsolutePath__forwardSlashSeparators
          });

      this.childrenFilesMetadata.set(
        targetChildFileRelativePath__forwardSlashSeparators,
        {
          parentEntryPointsAbsolutePaths: new Set<string>([ parentEntryPointAbsolutePath__forwardSlashSeparators ]),
          modificationDateTime__ISO8601: targetChildFileModificationDateTime__ISO8601,
          directChildrenFilesRelativePaths: createSetBasedOnOtherSet(
              absolutePathsOfExistingChildrenFilesOfTargetOne__forwardSlashSeparators,
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

    this.absolutePathsOfChildrenFilesWhichHasBeenScannedDuringCurrentPass.
        add(targetChildFileRelativePath__forwardSlashSeparators);

    for (
      const absolutePathOfExistingAffiliatedFileOfTargetOne__forwardSlashSeparators of
            absolutePathsOfExistingChildrenFilesOfTargetOne__forwardSlashSeparators
    ) {
      this.updateMetadataForExistingChildFile({
        targetChildFileAbsolutePath__forwardSlashSeparators:
            absolutePathOfExistingAffiliatedFileOfTargetOne__forwardSlashSeparators,
        parentEntryPointAbsolutePath__forwardSlashSeparators
      });
    }

  }

  private registerEntryPointAsParentTo(
    {
      cachedMetadataOfTargetChildFile,
      parentEntryPointAbsolutePath__forwardSlashSeparators
    }: Readonly<{
      cachedMetadataOfTargetChildFile: SourceCodeSelectiveReprocessingHelper.ChildFileMetadata;
      parentEntryPointAbsolutePath__forwardSlashSeparators: string;
    }>
  ): void {

    for (
      const relativePathsOfDirectChildFileOfCurrentOne__forwardSlashSeparators of
          cachedMetadataOfTargetChildFile.directChildrenFilesRelativePaths
    ) {

      const cachedMetadataOfChildFileOfCurrentOne: SourceCodeSelectiveReprocessingHelper.ChildFileMetadata | undefined =
          this.childrenFilesMetadata.get(relativePathsOfDirectChildFileOfCurrentOne__forwardSlashSeparators);

      if (isUndefined(cachedMetadataOfChildFileOfCurrentOne)) {
        continue;
      }


      cachedMetadataOfChildFileOfCurrentOne.parentEntryPointsAbsolutePaths.
          add(parentEntryPointAbsolutePath__forwardSlashSeparators);

      this.registerEntryPointAsParentTo({
        cachedMetadataOfTargetChildFile: cachedMetadataOfChildFileOfCurrentOne,
        parentEntryPointAbsolutePath__forwardSlashSeparators
      });

    }

  }

  private clearFileMetadataPathFromCache(targetFileRelativePath__forwardSlashesPathSeparators: string): void {

    this.entryPointsMetadata.delete(targetFileRelativePath__forwardSlashesPathSeparators);

    for (const entryPointMetadata of this.entryPointsMetadata.values()) {
      entryPointMetadata.directChildrenFilesRelativePaths.delete(targetFileRelativePath__forwardSlashesPathSeparators);
    }

    this.childrenFilesMetadata.delete(targetFileRelativePath__forwardSlashesPathSeparators);

    for (const childFileMetadata of this.childrenFilesMetadata.values()) {
      childFileMetadata.directChildrenFilesRelativePaths.delete(targetFileRelativePath__forwardSlashesPathSeparators);
      childFileMetadata.parentEntryPointsAbsolutePaths.delete(targetFileRelativePath__forwardSlashesPathSeparators);
    }

  }


  /* ─── Cache File ───────────────────────────────────────────────────────────────────────────────────────────────── */
  private saveCachedFilesMetadataMapsToFile(): void {

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
                directChildrenFilesRelativePaths: Array.from(entryPointMetadata.directChildrenFilesRelativePaths)
              };

              return entryPointsMetadata;

            },
            {}
          ),

      childrenFiles: Array.from(this.childrenFilesMetadata.entries()).
          reduce(
            (
              childrenFilesMetadata: SourceCodeSelectiveReprocessingHelper.CachedRawMetadata.ChildrenFiles,
              [ childFilePathRelativeToConsumingProjectRootDirectory, childFileMetadata ]:
                  [ string, SourceCodeSelectiveReprocessingHelper.ChildFileMetadata ]
            ): SourceCodeSelectiveReprocessingHelper.CachedRawMetadata.ChildrenFiles => {

              childrenFilesMetadata[childFilePathRelativeToConsumingProjectRootDirectory] = {
                modificationDate__ISO8601: childFileMetadata.modificationDateTime__ISO8601,
                directChildrenFilesRelativePaths: Array.from(childFileMetadata.directChildrenFilesRelativePaths),
                parentEntryPointsRelativePaths: Array.from(childFileMetadata.parentEntryPointsAbsolutePaths).
                    map(
                      (parentEntryPointsAbsolutePath: string): string =>
                          ImprovedPath.computeRelativePath({
                            basePath: this.CONSUMING_PROJECT_ROOT_DIRECTORY_ABSOLUTE_PATH,
                            comparedPath: parentEntryPointsAbsolutePath,
                            alwaysForwardSlashSeparators: true
                          })
                    )
              };

              return childrenFilesMetadata;

            },
            {}
          )

    };

    FileSystem.writeFileSync(this.CACHED_METADATA_FILE_ABSOLUTE_PATH, stringifyAndFormatArbitraryValue(outputData));

  }


  /* ─── Logging ──────────────────────────────────────────────────────────────────────────────────────────────────── */
  private logChildrenFilesAndEntryPointsRelationships(): void {

    let accumulatingString: string = "";

    for (const [ childFileRelativePath, childFileMetadata ] of this.childrenFilesMetadata.entries()) {

      accumulatingString = `${ accumulatingString }File: "${ childFileRelativePath }" has parents:\n`;

      for (const entryPointFileAbsolutePath of childFileMetadata.parentEntryPointsAbsolutePaths) {
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
      title: `${ this.TARGET_FILES_TYPE_IN_SINGULAR_FORM } Children Files and Respective Parent Entry Points Relationships`,
      description: accumulatingString.length > 0 ? accumulatingString : "No existing children files has been found."
    });

  }

}


namespace SourceCodeSelectiveReprocessingHelper {

  export type InitializationProperties = Readonly<{
    initialEntryPointsSourceFilesAbsolutePaths: ReadonlyArray<string>;
    isEntryPoint: (targetFileAbsolutePath: string) => boolean;
    childrenFilesResolutionRules: ChildrenFilesResolutionRules;
    directoriesAliasesAndTheirAbsolutePatsMap?: ReadonlyMap<string, ReadonlySet<string>>;
    consumingProjectRootDirectoryAbsolutePath: string;
    cacheFileAbsolutePath: string;
    logging: Readonly<{
      mustEnable: boolean;
      targetFilesTypeInSingularForm: string;
    }>;
  }>;


  export type EntryPointsMetadata = Map<
    EntryPointMetadata.PathRelativeConsumingProjectRootDirectory, EntryPointFileMetadata
  >;

  export namespace EntryPointMetadata {
    export type PathRelativeConsumingProjectRootDirectory = string;
  }

  export type EntryPointFileMetadata = {
    modificationDate__ISO8601: string;
    directChildrenFilesRelativePaths: Set<string>;
  };


  export type ChildrenFilesMetadata = Map<
    ChildrenFilesMetadata.PathRelativeToConsumingProjectRootDirectory, ChildFileMetadata
  >;

  export namespace ChildrenFilesMetadata {
    export type PathRelativeToConsumingProjectRootDirectory = string;
  }

  export type ChildFileMetadata = {
    modificationDateTime__ISO8601: string;
    directChildrenFilesRelativePaths: Set<string>;
    parentEntryPointsAbsolutePaths: Set<string>;
  };


  export type ChildrenFilesResolutionRules = Readonly<{
    implicitFilesNamesExtensionsWithoutLeadingDotsOfChildrenFiles: ReadonlyArray<string>;
    childrenFilesIncludingDeclarationsPatterns: ReadonlyArray<RegExp>;
  }>;


  export type CachedRawMetadata = Readonly<{
    entryPoints: CachedRawMetadata.EntryPoints;
    childrenFiles: CachedRawMetadata.ChildrenFiles;
  }>;

  /* [ Theory ] Currently, the "ObjectDataFilesProcessor" does not support the Readonly-types. */
  export namespace CachedRawMetadata {

    export type EntryPoints = { [pathRelativeToConsumingProjectRootDirectory: string]: EntryPoint; };

    export type EntryPoint = {
      modificationDate__ISO8601: string;
      directChildrenFilesRelativePaths: Array<string>;
    };

    export type ChildrenFiles = { [pathRelativeToConsumingProjectRootDirectory: string]: ChildFile; };

    export type ChildFile = {
      modificationDate__ISO8601: string;
      directChildrenFilesRelativePaths: Array<string>;
      parentEntryPointsRelativePaths: Array<string>;
    };

  }

}


export default SourceCodeSelectiveReprocessingHelper;
