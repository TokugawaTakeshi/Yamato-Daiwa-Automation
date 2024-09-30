import ECMA_ScriptLogicProcessingSharedState from "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSharedState";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type ECMA_ScriptLogicProcessingSettingsRepresentative from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettingsRepresentative";

/* ─── Third-party Solutions Specialists ──────────────────────────────────────────────────────────────────────────── */
import ECMA_ScriptSpecialist from "@ThirdPartySolutionsSpecialists/ECMA_ScriptSpecialist";

/* ─── Applied Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import Webpack from "webpack";
import type { Configuration as WebpackConfiguration } from "webpack";
import WebpackConfigGenerator from "@ECMA_ScriptProcessing/Utils/WebpackConfigGenerator";
import ECMA_ScriptLogicEntryPointsSourceFilesAbsolutePathsAndOutputFilesActualPathsMapGenerator from
    "@ECMA_ScriptProcessing/Utils/ECMA_ScriptLogicEntryPointsSourceFilesAbsolutePathsAndOutputFilesActualPathsMapGenerator";
import ECMA_ScriptSourceFilesWatcher from "@ECMA_ScriptProcessing/ECMA_ScriptSourceFilesWatcher";
import NodeNotifier from "node-notifier";
import SourceCodeSelectiveReprocessingHelper from "@Utils/SourceCodeSelectiveReprocessingHelper";
import DotYDA_DirectoryManager from "@Utils/DotYDA_DirectoryManager";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import {
  Logger,
  UnexpectedEventError,
  isNeitherUndefinedNorNull,
  addEntriesToMap,
  isUndefined,
  isNotUndefined,
  isNotNull,
  secondsToMilliseconds,
  addMultipleElementsToSet,
  filterMap,
  getArrayElementSatisfiesThePredicateIfSuchElementIsExactlyOne
} from "@yamato-daiwa/es-extensions";
import { ImprovedPath, ImprovedGlob } from "@yamato-daiwa/es-extensions-nodejs";


class ECMA_ScriptLogicProcessor {

  private static readonly ENTRY_POINTS_AND_PARTIAL_FILES_MAPPING_CACHE_FILE_NAME_WITH_EXTENSION: string =
      "ECMA_ScriptEntryPointsAndAffiliatedFilesMappingCache.json";

  protected readonly TASK_NAME_FOR_LOGGING: string = "ECMAScript logic processing";

  private readonly projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
  private readonly ECMA_ScriptLogicProcessingConfigRepresentative: ECMA_ScriptLogicProcessingSettingsRepresentative;

  private readonly webpackConfigurationsForExistingEntryPoints: ReadonlyArray<WebpackConfiguration>;
  private readonly webpackMultiCompiler: Webpack.MultiCompiler;

  private readonly entryPointsSourceFilesAbsolutePathsAndWebpackConfigurationNamesMap:
      ECMA_ScriptLogicProcessor.EntryPointsSourceFilesAbsolutePathsAndWebpackConfigurationNamesMap;

  private readonly absolutePathOfFilesWaitingForReProcessing: Set<string> = new Set<string>();
  private readonly sourceCodeSelectiveReprocessingHelper?: SourceCodeSelectiveReprocessingHelper;
  private subsequentFilesStateChangeTimeout: NodeJS.Timeout | null = null;


  public static provideLogicProcessingIfMust(
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): (callback: (error?: Error) => void) => void {

    const ecmaScriptLogicProcessingSettingsRepresentative: ECMA_ScriptLogicProcessingSettingsRepresentative | undefined =
        projectBuildingMasterConfigRepresentative.ECMA_ScriptLogicProcessingSettingsRepresentative;

    if (isUndefined(ecmaScriptLogicProcessingSettingsRepresentative)) {
      return (callback: () => void): void => { callback(); };
    }


    const dataHoldingSelfInstance: ECMA_ScriptLogicProcessor = new ECMA_ScriptLogicProcessor(
      ecmaScriptLogicProcessingSettingsRepresentative, projectBuildingMasterConfigRepresentative
    );

    return (gulpCallback: (error?: Error) => void): void => {

      try {

        dataHoldingSelfInstance.webpackMultiCompiler.run(
          dataHoldingSelfInstance.generateWebpackCallback(gulpCallback)
        );

      } catch (error: unknown) {

        /* [ Theory ] Once reached here, the Gulp tasks chain will collapse whatever will callback called to no. */
        Logger.logError({
          errorType: UnexpectedEventError.NAME,
          title: UnexpectedEventError.localization.defaultTitle,
          description:
              "The error emitted by Webpack has been caught while no error catching required according the official" +
                "documentation: https://webpack.js.org/api/node/",
          occurrenceLocation: "ECMA_ScriptLogicProcessor.provideLogicProcessing(projectBuildingMasterConfigRepresentative)",
          caughtError: error
        });

      }

      gulpCallback();

    };
  }


  private constructor(
    ecmaScriptLogicProcessingConfigRepresentative: ECMA_ScriptLogicProcessingSettingsRepresentative,
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ) {

    this.ECMA_ScriptLogicProcessingConfigRepresentative = ecmaScriptLogicProcessingConfigRepresentative;
    this.projectBuildingMasterConfigRepresentative = masterConfigRepresentative;

    const webpackConfigurationsForExistingEntryPoints: Array<WebpackConfiguration> = [];
    const entryPointsSourceFilesAbsolutePathsAndWebpackConfigurationNamesMap:
        ECMA_ScriptLogicProcessor.EntryPointsSourceFilesAbsolutePathsAndWebpackConfigurationNamesMap =
            new Map();

    for (
      const [ index, ECMA_ScriptLogicEntryPointsGroupSettings ] of
          Array.from(
            this.ECMA_ScriptLogicProcessingConfigRepresentative.relevantEntryPointsGroupsSettings.values()
          ).entries()
    ) {

      const entryPointsSourceFilesAbsolutePaths: ReadonlyArray<string> = ImprovedGlob.getFilesAbsolutePathsSynchronously(
        ECMA_ScriptLogicEntryPointsGroupSettings.sourceFilesGlobSelectors,
        { alwaysForwardSlashSeparators: true }
      );

      if (entryPointsSourceFilesAbsolutePaths.length === 0) {

        Logger.logWarning({
          title: "ECMAScript Logic Entry Points Not Found",
          description:
              `No ECMAScript entry points has been found for group "${ ECMA_ScriptLogicEntryPointsGroupSettings.ID }". ` +
              "Please restart the project building once they will be added."
        });

        continue;

      }


      webpackConfigurationsForExistingEntryPoints.push(
        WebpackConfigGenerator.generateWebpackConfigurationForEntryPointsGroupWithExistingFiles({
          entryPointsSourceFilesAbsolutePaths,
          ECMA_ScriptLogicEntryPointsGroupSettings,
          ECMA_ScriptLogicProcessingConfigRepresentative: this.ECMA_ScriptLogicProcessingConfigRepresentative,
          masterConfigRepresentative: this.projectBuildingMasterConfigRepresentative,
          mustProvideTypeScriptTypeChecking: index === 0
        })
      );

      addEntriesToMap({
        targetMap: entryPointsSourceFilesAbsolutePathsAndWebpackConfigurationNamesMap,
        newEntries: entryPointsSourceFilesAbsolutePaths.map(
          (entryPointsSourceFileAbsolutePath: string): [
            ECMA_ScriptLogicProcessor.EntryPointsSourceFilesAbsolutePathsAndWebpackConfigurationNamesMap.
                EntryPointSourceFileAbsolutePath,
            ECMA_ScriptLogicProcessor.EntryPointsSourceFilesAbsolutePathsAndWebpackConfigurationNamesMap.
                WebpackConfigurationName
          ] => [ entryPointsSourceFileAbsolutePath, ECMA_ScriptLogicEntryPointsGroupSettings.ID ]
        ),
        mutably: true
      });

    }

    this.webpackConfigurationsForExistingEntryPoints = webpackConfigurationsForExistingEntryPoints;
    this.webpackMultiCompiler = Webpack(this.webpackConfigurationsForExistingEntryPoints);

    this.entryPointsSourceFilesAbsolutePathsAndWebpackConfigurationNamesMap =
        entryPointsSourceFilesAbsolutePathsAndWebpackConfigurationNamesMap;

    if (this.projectBuildingMasterConfigRepresentative.mustProvideIncrementalBuilding) {

      this.sourceCodeSelectiveReprocessingHelper = new SourceCodeSelectiveReprocessingHelper({
        initialEntryPointsSourceFilesAbsolutePaths:
            this.ECMA_ScriptLogicProcessingConfigRepresentative.initialRelevantEntryPointsSourceFilesAbsolutePaths,
        childrenFilesResolutionRules: {
          childrenFilesIncludingDeclarationsPatterns: ECMA_ScriptSpecialist.partialFilesIncludingDeclarationPatterns,
          implicitFilesNamesExtensionsWithoutLeadingDotsOfChildrenFiles:
              this.ECMA_ScriptLogicProcessingConfigRepresentative.
              supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots
        },
        directoriesAliasesAndTheirAbsolutePatsMap: ECMA_ScriptLogicProcessor.
            generateUnifiedDirectoriesAliasesAndTheirAbsolutePatsMapForSourceCodeSelectiveReprocessingHelper(
              this.ECMA_ScriptLogicProcessingConfigRepresentative
            ),
        isEntryPoint: this.ECMA_ScriptLogicProcessingConfigRepresentative.
            isEntryPoint.
            bind(this.ECMA_ScriptLogicProcessingConfigRepresentative),
        logging: {
          mustEnable: this.ECMA_ScriptLogicProcessingConfigRepresentative.loggingSettings.
              partialFilesAndParentEntryPointsCorrespondence,
          targetFilesTypeInSingularForm: this.ECMA_ScriptLogicProcessingConfigRepresentative.
              TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM
        },
        consumingProjectRootDirectoryAbsolutePath:
            this.projectBuildingMasterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath,
        cacheFileAbsolutePath: ImprovedPath.joinPathSegments([
          DotYDA_DirectoryManager.OPTIMIZATION_FILES_DIRECTORY_ABSOLUTE_PATH,
          ECMA_ScriptLogicProcessor.ENTRY_POINTS_AND_PARTIAL_FILES_MAPPING_CACHE_FILE_NAME_WITH_EXTENSION
        ])
      });

      ECMA_ScriptSourceFilesWatcher.
          initializeIfRequiredAndGetInstance({
            ecmaScriptLogicProcessingSettingsRepresentative: this.ECMA_ScriptLogicProcessingConfigRepresentative,
            projectBuildingMasterConfigRepresentative: this.projectBuildingMasterConfigRepresentative
          }).
          addOnAnyEventRelatedWithActualFilesHandler({
            handlerID: "ON_ANY_EVENT_WITH_ECMA_SCRIPT_LOGIC_SOURCE_CODE_FILE--BY_ECMA_SCRIPT_LOGIC_PROCESSOR",
            handler: this.onSourceFilesWatcherEmittedAnyEvent.bind(this)
          });

    }

  }


  /* ━━━ Rebuilding ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private onSourceFilesWatcherEmittedAnyEvent(targetFileAbsolutePath: string): void {

    this.absolutePathOfFilesWaitingForReProcessing.add(targetFileAbsolutePath);

    if (isNotNull(this.subsequentFilesStateChangeTimeout)) {
      clearTimeout(this.subsequentFilesStateChangeTimeout);
    }


    this.subsequentFilesStateChangeTimeout = setTimeout(
      (): void => {

        const absolutePathOfEntryPointsWhichMustBeReprocessed__forwardSlashSeparators: ReadonlyArray<string> =
            this.sourceCodeSelectiveReprocessingHelper?.getAbsolutePathsOfEntryPointsWhichMustBeProcessed(
              this.absolutePathOfFilesWaitingForReProcessing
            ) ??
            [];

        const actualConfigurationsNames: ReadonlyArray<string> = Array.from(
          filterMap(
            this.entryPointsSourceFilesAbsolutePathsAndWebpackConfigurationNamesMap,
            (targetEntryPointAbsolutePath__forwardSlashSeparators: string): boolean =>
              absolutePathOfEntryPointsWhichMustBeReprocessed__forwardSlashSeparators.
                  includes(targetEntryPointAbsolutePath__forwardSlashSeparators)
          ).values()
        );

        if (actualConfigurationsNames.length === 1) {
          getArrayElementSatisfiesThePredicateIfSuchElementIsExactlyOne(
            this.webpackMultiCompiler.compilers,
            (webpackCompiler: Webpack.Compiler): boolean => webpackCompiler.name === actualConfigurationsNames[0],
            { mustThrowErrorIfElementNotFoundOrMatchesAreMultiple: true }
          ).run(this.generateWebpackCallback());
        } else if (actualConfigurationsNames.length > 1) {
          this.webpackMultiCompiler.run(this.generateWebpackCallback());
        }

        this.absolutePathOfFilesWaitingForReProcessing.clear();

      },
      secondsToMilliseconds(1)
    );

  }

  private generateWebpackCallback(
    gulpCallback?: (error?: Error) => void
  ): (hardError?: Error | null, statistics?: Webpack.Stats | Webpack.MultiStats) => void {
    return (hardError?: Error | null, statistics?: Webpack.Stats | Webpack.MultiStats): void => {

      if (isNotUndefined(statistics)) {
        process.stdout.write(`${ statistics.toString({ colors: true }) }\n`);
      }

      let finalErrorMessageDynamicPart: string | undefined;

      /* [ Webpack theory ] Even there is no hard error braking the build, there are could be the soft errors. */
      let softErrors: ReadonlyArray<Error> = [];

      if (statistics instanceof Webpack.Stats) {

        softErrors = statistics.compilation.errors;

      /* [ Theory ]
       * `statistics instanceof Webpack.MultiStats` will fail because actually there is no `Webpack.MultiStats` class. */
      } else if (isNotUndefined(statistics)) {
        softErrors = statistics.stats[0]?.compilation.errors;
      }

      if (isNeitherUndefinedNorNull(hardError)) {
        finalErrorMessageDynamicPart = hardError.message;
      } else if (softErrors.length > 0) {
        finalErrorMessageDynamicPart = softErrors.toString();
      }

      if (isNotUndefined(finalErrorMessageDynamicPart)) {

        Logger.logError({
          errorType: "ECMA_ScriptLogicProcessingError",
          title: "ECMAScript logic processing error",
          description: finalErrorMessageDynamicPart,
          occurrenceLocation: "ECMA_ScriptLogicProcessor.provideLogicProcessing(projectBuildingMasterConfigRepresentative)"
        });

        NodeNotifier.notify({
          title: "ECMAScript logic processing",
          message: "Error has occurred. Please check the console."
        });

      }


      if (
        !this.projectBuildingMasterConfigRepresentative.mustProvideIncrementalBuilding &&
            isNotUndefined(finalErrorMessageDynamicPart)
      ) {

        Logger.logError({
          errorType: "ECMA_ScriptLogicProcessingError",
          title: "ECMAScript logic processing error",
          description: "Unable to production build.",
          occurrenceLocation: "ECMA_ScriptLogicProcessor.provideLogicProcessing(projectBuildingMasterConfigRepresentative)"
        });

        gulpCallback?.(new Error(finalErrorMessageDynamicPart));

      } else {

        addEntriesToMap({
          targetMap: ECMA_ScriptLogicProcessingSharedState.sourceFilesAbsolutePathsAndOutputFilesActualPathsMap,
          newEntries: ECMA_ScriptLogicEntryPointsSourceFilesAbsolutePathsAndOutputFilesActualPathsMapGenerator.generate(
            this.ECMA_ScriptLogicProcessingConfigRepresentative
          ),
          mutably: true
        });

        gulpCallback?.();

      }

    };
  }

  /* [ Theory ] Although it is a rare case, same directory alias (e.g. "@components") could refer to different
  *    directory depending on entry points group. Because the `SourceCodeSelectiveReprocessingHelper` does not
  *    respect the specific entry points group, all aliases definition must be merged herewith wihtout overwriting. */
  private static generateUnifiedDirectoriesAliasesAndTheirAbsolutePatsMapForSourceCodeSelectiveReprocessingHelper(
    ecmaScriptLogicProcessingConfigRepresentative: ECMA_ScriptLogicProcessingSettingsRepresentative
  ): Map<string, Set<string>> {

    const unifiedDirectoriesAliasesAndTheirAbsolutePatsMap: Map<string, Set<string>> = new Map();

    for (
      const entryPointsGroup of ecmaScriptLogicProcessingConfigRepresentative.relevantEntryPointsGroupsSettings.values()
    ) {

      for (
        const [ directoryAlias, correspondingDirectoriesAbsolutePaths ] of
            entryPointsGroup.directoriesAliasesAndCorrespondingAbsolutePathsMap
      ) {

        const alreadyRegisteredCorrespondingDirectoriesAbsolutePaths: Set<string> | undefined =
            unifiedDirectoriesAliasesAndTheirAbsolutePatsMap.get(directoryAlias);

        if (isUndefined(alreadyRegisteredCorrespondingDirectoriesAbsolutePaths)) {
          unifiedDirectoriesAliasesAndTheirAbsolutePatsMap.set(
            directoryAlias,
            new Set(correspondingDirectoriesAbsolutePaths)
          );
        } else {
          addMultipleElementsToSet(
            alreadyRegisteredCorrespondingDirectoriesAbsolutePaths,
            correspondingDirectoriesAbsolutePaths
          );
        }
      }
    }

    return unifiedDirectoriesAliasesAndTheirAbsolutePatsMap;

  }

}


namespace ECMA_ScriptLogicProcessor {

  export type EntryPointsSourceFilesAbsolutePathsAndWebpackConfigurationNamesMap = Map<
    EntryPointsSourceFilesAbsolutePathsAndWebpackConfigurationNamesMap.EntryPointSourceFileAbsolutePath,
    EntryPointsSourceFilesAbsolutePathsAndWebpackConfigurationNamesMap.WebpackConfigurationName
  >;

  export namespace EntryPointsSourceFilesAbsolutePathsAndWebpackConfigurationNamesMap {
    export type EntryPointSourceFileAbsolutePath = string;
    export type WebpackConfigurationName = string;
  }

}


export default ECMA_ScriptLogicProcessor;
