/* --- Restrictions ------------------------------------------------------------------------------------------------- */
import type ConsumingProjectPreDefinedBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectPreDefinedBuildingModes";

/* --- Raw valid config --------------------------------------------------------------------------------------------- */
import ProjectBuildingConfig__FromFile__RawValid from
    "./ProjectBuilding/ProjectBuildingConfig__FromFile__RawValid";
import ProjectBuildingConfigDefaultLocalization__FromFile__RawValid from
    "@ProjectBuilding/ProjectBuildingConfigFromFileDefaultLocalization";

/* --- Normalized config -------------------------------------------------------------------------------------------- */
import type ProjectBuildingConfig__Normalized from "./ProjectBuilding/ProjectBuildingConfig__Normalized";
import ProjectBuilderRawConfigNormalizer from "./ProjectBuilding/ProjectBuilderRawConfigNormalizer";
import ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";

/* --- Actuators ---------------------------------------------------------------------------------------------------- */
import MarkupProcessor from "@MarkupProcessing/MarkupProcessor";
import MarkupSourceCodeLinter from "@MarkupProcessing/Subtasks/Linting/MarkupSourceCodeLinter";
import CompiledInlineTypeScriptImporterForPug from "@MarkupProcessing/Subtasks/CompiledTypeScriptImporterForPug";
import StylesProcessor from "@StylesProcessing/StylesProcessor";
import ECMA_ScriptLogicProcessor from "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessor";
import TypeScriptTypesChecker from "@ECMA_ScriptProcessing/Subtasks/TypeScirptTypesChecker/TypeScriptTypesChecker";
import ImagesProcessor from "@ImagesProcessing/ImagesProcessor";
import FontsProcessor from "@FontsProcessing/FontsProcessor";
import VideosProcessor from "@VideosProcessing/VideosProcessor";
import AudiosProcessor from "@AudiosProcessing/AudiosProcessor";
import PlainCopier from "@ProjectBuilding/PlainCopying/PlainCopier";
import BrowserLiveReloader from "@BrowserLiveReloading/BrowserLiveReloader";

/* --- Applied utils ------------------------------------------------------------------------------------------------ */
import Gulp from "gulp";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import {
  RawObjectDataProcessor,
  Logger,
  InvalidConfigError,
  isNeitherUndefinedNorNull
} from "@yamato-daiwa/es-extensions";


abstract class ProjectBuilder {

  public static buildProject(
    {
      consumingProjectRootDirectoryAbsolutePath,
      projectBuildingConfig__fromConsole,
      rawConfigFromFile
    }: ProjectBuilder.NamedParameters
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

    Gulp.task(GULP_TASK_NAME, Gulp.parallel([

      MarkupSourceCodeLinter.provideLintingIfMust(masterConfigRepresentative),
      TypeScriptTypesChecker.provideTypeCheckingIfMust(masterConfigRepresentative),

      Gulp.series([

        Gulp.parallel([
          CompiledInlineTypeScriptImporterForPug.provideTypeScriptImportsForMarkupIfMust(masterConfigRepresentative),
          StylesProcessor.provideStylesProcessingIfMust(masterConfigRepresentative),
          ECMA_ScriptLogicProcessor.provideLogicProcessingIfMust(masterConfigRepresentative),
          PlainCopier.providePlainCopierIfMust(masterConfigRepresentative)
        ]),

        /* 〔 理論 〕 何方でも重たいので、"Gulp.parallel"に結合しない方が良い。 */
        ImagesProcessor.provideImagesProcessingIfMust(masterConfigRepresentative),
        FontsProcessor.provideFontsProcessingIfMust(masterConfigRepresentative),
        AudiosProcessor.provideAudiosProcessingIfMust(masterConfigRepresentative),
        VideosProcessor.provideVideosProcessingIfMust(masterConfigRepresentative),

        MarkupProcessor.provideMarkupProcessingIfMust(masterConfigRepresentative),

        ...masterConfigRepresentative.mustProvideBrowserLiveReloading ? [
          BrowserLiveReloader.provideBrowserLiveReloadingIfMust(masterConfigRepresentative)
        ] : []
      ])

    ]));

    /* eslint-disable-next-line @typescript-eslint/no-floating-promises --
    *  This issue is not false positive because gulp chain could collapse on some errors, but working solution has
    *  not been found yet. https://stackoverflow.com/q/66169978/4818123 */
    Gulp.task(GULP_TASK_NAME)?.(
      (error?: Error | null): void => {
        if (isNeitherUndefinedNorNull(error)) {
          Logger.logError({
            errorType: "UnhandledGulpPipelinesError",
            title: "Unhandled Gulp pipelines error",
            description: "Unhandled in Gulp pipelines error occurred",
            occurrenceLocation: "ProjectBuilder.buildProject(namedParameters)",
            caughtError: error
          });
        }
      }
    );

  }

}


namespace ProjectBuilder {

  export type NamedParameters = Readonly<{
    consumingProjectRootDirectoryAbsolutePath: string;
    projectBuildingConfig__fromConsole: ProjectBuildingConfig__FromConsole;
    rawConfigFromFile: unknown;
  }>;

  export type ProjectBuildingConfig__FromConsole = Readonly<{
    projectBuildingMode: ConsumingProjectPreDefinedBuildingModes;
    selectiveExecutionID?: string;
  }>;

  export type ContainerizedProjectBuildingValidConfigFromFile = Readonly<{
    projectBuilding: ProjectBuildingConfig__FromFile__RawValid;
  }>;

}


export default ProjectBuilder;
