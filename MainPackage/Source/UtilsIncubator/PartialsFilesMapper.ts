/* --- Settings representatives -------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";

/* --- Third-party solutions specialises ---------------------------------------------------------------------------- */
import PugPreProcessorSpecialist from "@ThirdPartySolutionsSpecialists/PugPreProcessorSpecialist";
import StylusPreProcessorSpecialist from "@ThirdPartySolutionsSpecialists/StylusPreProcessorSpecialist";

/* --- General utils  ---------------------------------------------------------------------------------------------- */
import FileSystem from "fs";
import ImprovedPath from "./ImprovedPath/ImprovedPath";

import {
  isUndefined,
  isNotUndefined,
  isNull,
  Logger,
  UnexpectedEventError,
  AlgorithmMismatchError,
  removeNthCharacter
} from "@yamato-daiwa/es-extensions";
import { isErrnoException } from "@yamato-daiwa/es-extensions-nodejs";
import Stopwatch from "@UtilsIncubator/Stopwatch";


class PartialsFilesMapper {

  private static readonly partialFilesResolutionRules: Array<PartialsFilesMapper.PartialFilesResolutionRule> = [
    {
      targetFileNamesExtensionsWithoutPrependedDots:
          PugPreProcessorSpecialist.supportedFileNamesExtensionsWithoutPrependedDots,
      partialFilesIncludingDeclarationPatterns: PugPreProcessorSpecialist.partialFilesIncludingDeclarationPatterns,
      implicitFileNamesExtensionsWithoutPrependedDotsOfPartials:
          PugPreProcessorSpecialist.implicitFileNamesExtensionsWithoutPrependedDotsOfPartials
    },
    {
      targetFileNamesExtensionsWithoutPrependedDots:
          StylusPreProcessorSpecialist.supportedFileNamesExtensionsWithoutPrependedDots,
      partialFilesIncludingDeclarationPatterns: StylusPreProcessorSpecialist.partialFilesIncludingDeclarationPatterns,
      implicitFileNamesExtensionsWithoutPrependedDotsOfPartials:
          StylusPreProcessorSpecialist.implicitFileNamesExtensionsWithoutPrependedDotsOfPartials
    }
  ];


  /* [ Approach ] For this application, no need to crate the full tree of dependencies - it's enough just know the parents
      (direct or older generations) of each file. */
  public static getPartialFilesAndParentEntryPointsRelationsMap(
    {
      targetEntryPointsFilesAbsolutePaths,
      masterConfigRepresentative,
      sourceFilesTypeLabelForLogging
    }: {
      targetEntryPointsFilesAbsolutePaths: Array<string>;
      masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
      sourceFilesTypeLabelForLogging: string;
    }
  ): PartialsFilesMapper.PartialFilesAndParentEntryPointsRelationsMap {

    const mappingTimeMeasuringStopwatch: Stopwatch = new Stopwatch().startOrRestart();

    Logger.logInfo({
      title: "Partial files and parent entry points mapping",
      description: `Mapping of ${ sourceFilesTypeLabelForLogging } entry points and partial files relations started ...`
    });

    const partialFilesAndParentEntryPointsRelationsMap: PartialsFilesMapper.PartialFilesAndParentEntryPointsRelationsMap =
        new Map<PartialsFilesMapper.PartialFileAbsolutePath, Set<PartialsFilesMapper.EntryPointSourceFileAbsolutePath>>();
    const queueOfAbsolutePathsOfPartialFilesWhichWillBeScanned: Set<PartialsFilesMapper.PartialFileAbsolutePath> = new Set();


    /* [ Approach ] In this class, we will not throw the error if detect the  intersecting entry points groups -
     *    is it valid or no, other classes  (e. g. validators) must decide. */
    for (const entryPointFileAbsolutePath of targetEntryPointsFilesAbsolutePaths) {

      /* [ Approach ] For the simplification of searching im map, it is assuming that parent of entry point file itself.
       *   Normally, the value corresponding to 'entryPointFileAbsolutePath' key should not be overwritten, but even if it
       *   occurred, just it will hardly cause a bug while technical requirement until not change. */
      partialFilesAndParentEntryPointsRelationsMap.set(
        entryPointFileAbsolutePath,
        new Set<PartialsFilesMapper.EntryPointSourceFileAbsolutePath>([ entryPointFileAbsolutePath ])
      );

      PartialsFilesMapper.addAbsolutePathsOfExistingPartialsOfCurrentEntryPointOrPartialFileToQueue({
        targetEntryPointOrPartialFileAbsolutePath: entryPointFileAbsolutePath,
        queueOfAbsolutePathsOfPartialFilesWhichWillBeScanned
      });


      for (const partialFileAbsolutePath of queueOfAbsolutePathsOfPartialFilesWhichWillBeScanned) {

        if (PartialsFilesMapper.canPartialFilesHasOwnPartials({
          absolutePathOfTargetPartialFile: partialFileAbsolutePath
        })) {
          PartialsFilesMapper.addAbsolutePathsOfExistingPartialsOfCurrentEntryPointOrPartialFileToQueue({
            targetEntryPointOrPartialFileAbsolutePath: partialFileAbsolutePath,
            queueOfAbsolutePathsOfPartialFilesWhichWillBeScanned
          });
        }

        const absolutePathsOfParentEntryPointsAddedOnPreviousIterations: Set<
          PartialsFilesMapper.EntryPointSourceFileAbsolutePath
        > | undefined = partialFilesAndParentEntryPointsRelationsMap.get(partialFileAbsolutePath);

        if (isUndefined(absolutePathsOfParentEntryPointsAddedOnPreviousIterations)) {
          partialFilesAndParentEntryPointsRelationsMap.set(
            partialFileAbsolutePath, new Set([ entryPointFileAbsolutePath ])
          );
        } else {
          absolutePathsOfParentEntryPointsAddedOnPreviousIterations.add(entryPointFileAbsolutePath);
        }
      }
    }

    mappingTimeMeasuringStopwatch.stop();

    Logger.logInfo({
      title: "Partial files and parent entry points mapping",
      description: `Mapping of ${ sourceFilesTypeLabelForLogging } entry points and partial files relations done. ` +
          `${ mappingTimeMeasuringStopwatch.stop().seconds } seconds elapsed.`
    });

    if (masterConfigRepresentative.mustDebugEntryPointsAndPartialFiles) {
       PartialsFilesMapper.dumpIncludedFilesAndEntryPointsAccordanceMap(
         partialFilesAndParentEntryPointsRelationsMap,
         masterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath
       );
     }

    return partialFilesAndParentEntryPointsRelationsMap;
  }


  private static addAbsolutePathsOfExistingPartialsOfCurrentEntryPointOrPartialFileToQueue(
    {
      targetEntryPointOrPartialFileAbsolutePath,
      queueOfAbsolutePathsOfPartialFilesWhichWillBeScanned
    }: {
      targetEntryPointOrPartialFileAbsolutePath: string;
      queueOfAbsolutePathsOfPartialFilesWhichWillBeScanned: Set<string>;
    }
  ): void {

    const CURRENT_METHOD_INVOCATION_EXPRESSION: string = "PartialsFilesMapper." +
        "getPartialFilesAndParentEntryPointsRelationsMap(parametersObject) ->" +
        "addAbsolutePathsOfExistingPartialsOfCurrentEntryPointOrPartialFileToQueue(parametersObject)";

    const absolutePathOfDirectoryOfTargetEntryPointOrPartialFile: string = ImprovedPath.
        extractDirectoryFromFilePath(targetEntryPointOrPartialFileAbsolutePath);
    const fileNameLastExtensionWithoutDotOfTargetEntryPointOrPartialFile: string | null = ImprovedPath.
        extractLastFilenameExtensionWithoutFirstDot(targetEntryPointOrPartialFileAbsolutePath);

    if (isNull(fileNameLastExtensionWithoutDotOfTargetEntryPointOrPartialFile)) {
      Logger.logError({
        errorType: AlgorithmMismatchError.NAME,
        title: AlgorithmMismatchError.localization.defaultTitle,
        description: `The file '${ targetEntryPointOrPartialFileAbsolutePath }' is missing the filename extensions.` +
            "The partials of this file will not be detected.",
        occurrenceLocation: CURRENT_METHOD_INVOCATION_EXPRESSION
      });
      return;
    }


    const partialFilesResolutionRuleForCurrentFilenameExtension: PartialsFilesMapper.PartialFilesResolutionRule | undefined =
        PartialsFilesMapper.partialFilesResolutionRules.find(
            (partialFilesResolutionRule: PartialsFilesMapper.PartialFilesResolutionRule): boolean =>
                partialFilesResolutionRule.targetFileNamesExtensionsWithoutPrependedDots.
                    includes(fileNameLastExtensionWithoutDotOfTargetEntryPointOrPartialFile)
        );

    if (isUndefined(partialFilesResolutionRuleForCurrentFilenameExtension)) {

      Logger.logError({
        errorType: AlgorithmMismatchError.NAME,
        title: AlgorithmMismatchError.localization.defaultTitle,
        description: "No partial file resolution rules has been found for the file " +
            `'${ targetEntryPointOrPartialFileAbsolutePath }'. The partials of this file will not be detected.`,
        occurrenceLocation: CURRENT_METHOD_INVOCATION_EXPRESSION
      });

      return;
    }


    let entryPointFileContent: string;

    try {
      entryPointFileContent = FileSystem.readFileSync(targetEntryPointOrPartialFileAbsolutePath, "utf-8");

    } catch (error: unknown) {

      if (isErrnoException(error) && error.code === "ENOENT") {
        Logger.throwErrorAndLog({
          errorInstance: new UnexpectedEventError(
            `Target file '${ targetEntryPointOrPartialFileAbsolutePath }' is expecting to be existing, but actually was` +
            "not found."
          ),
          title: UnexpectedEventError.localization.defaultTitle,
          occurrenceLocation: CURRENT_METHOD_INVOCATION_EXPRESSION,
          wrappableError: error
        });
      }

      Logger.throwErrorAndLog({
        errorInstance: new UnexpectedEventError("不明な理由"),
        title: UnexpectedEventError.localization.defaultTitle,
        occurrenceLocation: "className.methodName(parametersObject)",
        wrappableError: error
      });
    }


    for (
      const fileIncludingDeclarationPattern
      of partialFilesResolutionRuleForCurrentFilenameExtension.partialFilesIncludingDeclarationPatterns
    ) {

      for (const regularExpressionMatchingData of entryPointFileContent.matchAll(fileIncludingDeclarationPattern)) {

        if (isUndefined(regularExpressionMatchingData.groups)) {
          Logger.throwErrorAndLog({
            errorInstance: new UnexpectedEventError(
              "The named capturing group 'filePath' expected to be present in regular expression matching results, " +
              "but actually there are no capturing groups."
            ),
            occurrenceLocation: CURRENT_METHOD_INVOCATION_EXPRESSION,
            title: UnexpectedEventError.localization.defaultTitle
          });
        }


        PartialsFilesMapper.addAbsolutePathOfSingleExistingPartialFileToQueue({
          targetPartialFilePathRelativeToParentFileDirectory: regularExpressionMatchingData.groups.filePath,
          directoryAbsolutePathOfParentOfTargetPartialFile: absolutePathOfDirectoryOfTargetEntryPointOrPartialFile,
          implicitFilenameExtensionsOfPartialsForCurrentFileType: partialFilesResolutionRuleForCurrentFilenameExtension.
              implicitFileNamesExtensionsWithoutPrependedDotsOfPartials,
          queueOfAbsolutePathsOfPartialFilesWhichWillBeScanned
        });
      }
    }
  }

  private static addAbsolutePathOfSingleExistingPartialFileToQueue(
    {
      targetPartialFilePathRelativeToParentFileDirectory,
      directoryAbsolutePathOfParentOfTargetPartialFile,
      implicitFilenameExtensionsOfPartialsForCurrentFileType = [],
      queueOfAbsolutePathsOfPartialFilesWhichWillBeScanned
    }: {
      targetPartialFilePathRelativeToParentFileDirectory: string;
      directoryAbsolutePathOfParentOfTargetPartialFile: string;
      implicitFilenameExtensionsOfPartialsForCurrentFileType?: Array<string>;
      queueOfAbsolutePathsOfPartialFilesWhichWillBeScanned: Set<string>;
    }
  ): void {

    const possibleAbsolutePathsOfTargetPartialFile: Array<string> = [];
    const filenameExtensionOfTargetPartialFile__notNullIfExplicitlySpecified: string | null =
        ImprovedPath.extractLastFilenameExtensionWithoutFirstDot(targetPartialFilePathRelativeToParentFileDirectory);

    if (isNull(filenameExtensionOfTargetPartialFile__notNullIfExplicitlySpecified)) {
      possibleAbsolutePathsOfTargetPartialFile.push(
        ...implicitFilenameExtensionsOfPartialsForCurrentFileType.map(
          (partialFileImplicitFilenameExtension: string): string =>
              ImprovedPath.buildAbsolutePath(
                [
                  directoryAbsolutePathOfParentOfTargetPartialFile,
                  `${ targetPartialFilePathRelativeToParentFileDirectory }.${ partialFileImplicitFilenameExtension }`
                ],
                { forwardSlashOnlySeparators: true }
              )
          )
      );
    } else {
      possibleAbsolutePathsOfTargetPartialFile.push(
        ImprovedPath.buildAbsolutePath(
          [ directoryAbsolutePathOfParentOfTargetPartialFile, targetPartialFilePathRelativeToParentFileDirectory ],
          { forwardSlashOnlySeparators: true }
        )
      );
    }

    for (const possibleAbsolutePathOfTargetPartialFile of possibleAbsolutePathsOfTargetPartialFile) {
      if (FileSystem.existsSync(possibleAbsolutePathOfTargetPartialFile)) {
        queueOfAbsolutePathsOfPartialFilesWhichWillBeScanned.add(possibleAbsolutePathOfTargetPartialFile);
        break;
      }
    }
  }


  /* [ Approach ] If mentioned path of the partial file has explicit extension which is not among
   * 'supportedFileNamesExtensionsWithoutPrependedDots', such file is being considering as terminal.
   *  Until other behaviours will not be demanded. */
  private static canPartialFilesHasOwnPartials(
    {
      absolutePathOfTargetPartialFile
    }: {
      absolutePathOfTargetPartialFile: string;
    }
  ): boolean {

    const lastFileNameExtensionsOfTargetPartialFile: string | null = ImprovedPath.
        extractLastFilenameExtensionWithoutFirstDot(absolutePathOfTargetPartialFile);

    if (isNull(lastFileNameExtensionsOfTargetPartialFile)) {
      return false;
    }


    let partialFilesResolutionRulesForCurrentFilenameExtension: PartialsFilesMapper.PartialFilesResolutionRule | undefined;

    for (const partialFilesResolutionRule of PartialsFilesMapper.partialFilesResolutionRules) {
      if (
        partialFilesResolutionRule.targetFileNamesExtensionsWithoutPrependedDots.
            includes(lastFileNameExtensionsOfTargetPartialFile)
      ) {
        partialFilesResolutionRulesForCurrentFilenameExtension = partialFilesResolutionRule;
      }
    }

    return isNotUndefined(partialFilesResolutionRulesForCurrentFilenameExtension);
  }

  private static dumpIncludedFilesAndEntryPointsAccordanceMap(
    partialFilesAndParentEntryPointsAccordanceMap: Map<
      PartialsFilesMapper.PartialFileAbsolutePath, Set<PartialsFilesMapper.EntryPointSourceFileAbsolutePath>
    >,
    consumingProjectAbsolutePath: string
  ): void {

    let accumulatingString: string = "";

    for (const [ includedFileAbsolutePath, parentEntryPoints ] of partialFilesAndParentEntryPointsAccordanceMap.entries()) {

      const includedFileRelativePath: string = includedFileAbsolutePath.replace(`${ consumingProjectAbsolutePath }/`, "");

      if (
        parentEntryPoints.size === 1 &&
        Array.from(parentEntryPoints)[0].replace(`${ consumingProjectAbsolutePath }/`, "") === includedFileRelativePath
      ) {
        continue;
      }

      accumulatingString = `${ accumulatingString }\nPartial file: '${ includedFileRelativePath }'\nhas parents:\n`;

      for (const entryPointFileAbsolutePath of parentEntryPoints) {
        accumulatingString = `${ accumulatingString }  ● ${ entryPointFileAbsolutePath.replace(
          `${ consumingProjectAbsolutePath }/`, ""
        ) }\n`;
      }
    }

    Logger.logInfo({
      title: "Partial files and parent entry points accordance map",
      description: accumulatingString.length > 0 ?
          removeNthCharacter(accumulatingString, { targetCharacterNumber: 1, numerationFrom: 1 }) :
          "No partials files found"
    });
  }
}


namespace PartialsFilesMapper {

  export type EntryPointSourceFileAbsolutePath = string;
  export type PartialFileAbsolutePath = string;
  export type PartialFilesAndParentEntryPointsRelationsMap =
      Map<PartialFileAbsolutePath, Set<EntryPointSourceFileAbsolutePath>>;

  export type PartialFilesResolutionRule = {
    targetFileNamesExtensionsWithoutPrependedDots: Array<string>;
    partialFilesIncludingDeclarationPatterns: Array<RegExp>;
    implicitFileNamesExtensionsWithoutPrependedDotsOfPartials?: Array<string>;
  };
}


export default PartialsFilesMapper;
