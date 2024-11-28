/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import type ConsumingProjectBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";

/* ─── Raw Valid Config ───────────────────────────────────────────────────────────────────────────────────────────── */
import ProjectBuildingConfig__FromFile__RawValid from
    "./ProjectBuilding/ProjectBuildingConfig__FromFile__RawValid";
import ProjectBuildingConfigDefaultLocalization__FromFile__RawValid from
    "@ProjectBuilding/ProjectBuildingConfigFromFileDefaultLocalization";

/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingConfig__Normalized from "./ProjectBuilding/ProjectBuildingConfig__Normalized";
import ProjectBuilderRawConfigNormalizer from "./ProjectBuilding/ProjectBuilderRawConfigNormalizer";
import ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";

/* ─── Tasks Runners ──────────────────────────────────────────────────────────────────────────────────────────────── */
import MarkupProcessor from "@MarkupProcessing/MarkupProcessor";
import MarkupSourceCodeLinter from "@MarkupProcessing/Subtasks/Linting/MarkupSourceCodeLinter";
import CompiledInlineTypeScriptImporterForPug from "@MarkupProcessing/Subtasks/CompiledTypeScriptImporterForPug";
import StylesProcessor from "@StylesProcessing/StylesProcessor";
import ECMA_ScriptLogicProcessor from "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessor";
import ECMA_ScriptSourceCodeLinter from "@ECMA_ScriptProcessing/Subtasks/Linting/ECMA_ScriptSourceCodeLinter";
import ImagesProcessor from "@ImagesProcessing/ImagesProcessor";
import FontsProcessor from "@FontsProcessing/FontsProcessor";
import VideosProcessor from "@VideosProcessing/VideosProcessor";
import AudiosProcessor from "@AudiosProcessing/AudiosProcessor";
import PlainCopier from "@ProjectBuilding/PlainCopying/PlainCopier";
import LocalDevelopmentServerOrchestrator from
    "@ECMA_ScriptProcessing/Subtasks/LocalDevelopmentServerOrchestration/LocalDevelopmentServerOrchestrator";
import BrowserLiveReloader from "@BrowserLiveReloading/BrowserLiveReloader";
import OutputPackageJSON_Generator from "@ProjectBuilding/OutputPackageJSON_Generating/OutputPackageJSON_Generator";

/* ─── Applied Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import Gulp from "gulp";
import FilesMasterWatcher from "@ProjectBuilding/FilesWatching/Watchers/FilesMasterWatcher";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import {
  RawObjectDataProcessor,
  Logger,
  InvalidConfigError,
  isNeitherUndefinedNorNull, UnexpectedEventError
} from "@yamato-daiwa/es-extensions";


abstract class ProjectBuilder {

  public static buildProject(
    {
      consumingProjectRootDirectoryAbsolutePath,
      projectBuildingConfig__fromConsole,
      rawConfigFromFile
    }: ProjectBuilder.CompoundParameter
  ): void {

    const rawDataProcessingResult: RawObjectDataProcessor.
        ProcessingResult<ProjectBuilder.ContainerizedProjectBuildingValidConfigFromFile> =
            RawObjectDataProcessor.process(
              rawConfigFromFile,
              ProjectBuildingConfig__FromFile__RawValid.getLocalizedSpecification(
                ProjectBuildingConfigDefaultLocalization__FromFile__RawValid
              )
            );

    if (rawDataProcessingResult.rawDataIsInvalid) {
      Logger.throwErrorAndLog({
        errorInstance: new InvalidConfigError({
          mentionToConfig: "@yamato-daiwa/automation (project building)",
          messageSpecificPart: RawObjectDataProcessor.formatValidationErrorsList(
            rawDataProcessingResult.validationErrorsMessages
          )
        }),
        title: InvalidConfigError.localization.defaultTitle,
        occurrenceLocation: "ProjectBuilder.buildProject(parametersObject)"
      });
    }


    const projectBuildingConfig__fromFile__rawValid: ProjectBuildingConfig__FromFile__RawValid =
        rawDataProcessingResult.processedData.projectBuilding;

    const projectBuildingConfig__normalized: ProjectBuildingConfig__Normalized = ProjectBuilderRawConfigNormalizer.
        normalize({
          consumingProjectRootDirectoryAbsolutePath,
          projectBuildingConfig__fromConsole,
          projectBuildingConfig__fromFile__rawValid
        });

    const masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative =
        new ProjectBuildingMasterConfigRepresentative(projectBuildingConfig__normalized);

    const GULP_TASK_NAME: string = "BUILD_PROJECT";

    Gulp.task(

      GULP_TASK_NAME,

      Gulp.parallel([

        MarkupSourceCodeLinter.provideLintingIfMust(masterConfigRepresentative),
        ECMA_ScriptSourceCodeLinter.provideLintingIfMust(masterConfigRepresentative),

        Gulp.series([

          Gulp.parallel([
            CompiledInlineTypeScriptImporterForPug.provideTypeScriptImportsForMarkupIfMust(masterConfigRepresentative),
            ECMA_ScriptLogicProcessor.provideLogicProcessingIfMust(masterConfigRepresentative),
            PlainCopier.providePlainCopierIfMust(masterConfigRepresentative)
          ]),

          /* [ Theory ] The following 4 tasks are heavy thus it is better to not run them at parallel. */
          ImagesProcessor.provideImagesProcessingIfMust(masterConfigRepresentative),
          FontsProcessor.provideFontsProcessingIfMust(masterConfigRepresentative),
          AudiosProcessor.provideAudiosProcessingIfMust(masterConfigRepresentative),
          VideosProcessor.provideVideosProcessingIfMust(masterConfigRepresentative),

          /* [ Theory ] The styles needs the images and fonts be processed. */
          StylesProcessor.provideStylesProcessingIfMust(masterConfigRepresentative),

          /* [ Theory ] The markup needs all previously mentioned resources be processed. */
          MarkupProcessor.provideMarkupProcessingIfMust(masterConfigRepresentative),

          BrowserLiveReloader.provideBrowserLiveReloadingIfMust(masterConfigRepresentative),
          OutputPackageJSON_Generator.generateIfMust(masterConfigRepresentative),

          Gulp.parallel([
            FilesMasterWatcher.watchIfMust(masterConfigRepresentative),
            LocalDevelopmentServerOrchestrator.orchestrateIfMust(masterConfigRepresentative)
          ])

        ])

      ])

    );

    Gulp.task(GULP_TASK_NAME)?.(
      (error?: Error | null): void => {
        if (isNeitherUndefinedNorNull(error)) {
          Logger.logError({
            errorType: UnexpectedEventError.NAME,
            title: UnexpectedEventError.localization.defaultTitle,
            description: "The following unexpected error has crashed the Gulp pipeline:",
            occurrenceLocation: "ProjectBuilder.buildProject(compoundParameter)",
            caughtError: error
          });
        }
      }
    );

  }

}


namespace ProjectBuilder {

  export type CompoundParameter = Readonly<{
    consumingProjectRootDirectoryAbsolutePath: string;
    projectBuildingConfig__fromConsole: ProjectBuildingConfig__FromConsole;
    rawConfigFromFile: unknown;
  }>;

  export type ProjectBuildingConfig__FromConsole = Readonly<{
    projectBuildingMode: ConsumingProjectBuildingModes;
    selectiveExecutionID?: string;
  }>;

  export type ContainerizedProjectBuildingValidConfigFromFile = Readonly<{
    projectBuilding: ProjectBuildingConfig__FromFile__RawValid;
  }>;

}


export default ProjectBuilder;
