/* --- Raw valid config --------------------------------------------------------------------------------------------- */
import { ProjectBuildingTasksIDsForConfigFile } from
    "@ProjectBuilding:Common/RawConfig/Enumerations/ProjectBuildingTasksIDsForConfigFile";
import type ProjectBuildingConfig__FromFile__RawValid from
    "./ProjectBuildingConfig__FromFile__RawValid";
import type ProjectBuildingCommonSettings__FromFile__RawValid from
    "@ProjectBuilding:Common/RawConfig/ProjectBuildingCommonSettings__FromFile__RawValid";
import type MarkupProcessingSettings__FromFile__RawValid from
    "@MarkupProcessing/MarkupProcessingSettings__FromFile__RawValid";
import type StylesProcessingSettings__FromFile__RawValid from
    "@StylesProcessing/StylesProcessingSettings__FromFile__RawValid";
import type ECMA_ScriptLogicProcessingSettings__FromFile__RawValid from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettings__FromFile__RawValid";
import type ImagesProcessingSettings__FromFile__RawValid from
    "@ImagesProcessing/ImagesProcessingSettings__FromFile__RawValid";
import type FontsProcessingSettings__FromFile__RawValid from
    "@FontsProcessing/FontsProcessingSettings__FromFile__RawValid";
import type VideosProcessingSettings__FromFile__RawValid from
    "@VideosProcessing/VideosProcessingSettings__FromFile__RawValid";
import type AudiosProcessingSettings__FromFile__RawValid from
    "@AudiosProcessing/AudiosProcessingSettings__FromFile__RawValid";
import type BrowserLiveReloadingSettings__FromFile__RawValid from
    "./BrowserLiveReloading/BrowserLiveReloadingSettings__FromFile__RawValid";

/* --- Normalized config -------------------------------------------------------------------------------------------- */
import type ProjectBuildingConfig__Normalized from "./ProjectBuildingConfig__Normalized";
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding:Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";
import ProjectBuildingCommonSettingsNormalizer from
    "@ProjectBuilding:Common/NormalizedConfig/ProjectBuildingCommonSettingsNormalizer";
import ProjectBuildingDebuggingSettingsNormalizer from "./Debugging/ProjectBuildingDebuggingSettingsNormalizer";
import type MarkupProcessingSettings__Normalized from "@MarkupProcessing/MarkupProcessingSettings__Normalized";
import MarkupProcessingRawSettingsNormalizer from "@MarkupProcessing/MarkupProcessingRawSettingsNormalizer";
import type StylesProcessingSettings__Normalized from "@StylesProcessing/StylesProcessingSettings__Normalized";
import StylesProcessingRawSettingsNormalizer from "@StylesProcessing/StylesProcessingRawSettingsNormalizer";
import type ECMA_ScriptLogicProcessingSettings__Normalized from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettings__Normalized";
import ECMA_ScriptLogicProcessingRawSettingsNormalizer from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingRawSettingsNormalizer";
import type ImagesProcessingSettings__Normalized from "@ImagesProcessing/ImagesProcessingSettings__Normalized";
import ImagesProcessingRawSettingsNormalizer from "@ImagesProcessing/ImagesProcessingRawSettingsNormalizer";
import type FontsProcessingSettings__Normalized from "@FontsProcessing/FontsProcessingSettings__Normalized";
import FontsProcessingSettingsRawSettingsNormalizer from "@FontsProcessing/FontsProcessingRawSettingsNormalizer";
import type VideosProcessingSettings__Normalized from "@VideosProcessing/VideosProcessingSettings__Normalized";
import VideosProcessingRawSettingsNormalizer from "@VideosProcessing/VideosProcessingRawSettingsNormalizer";
import type AudiosProcessingSettings__Normalized from "@AudiosProcessing/AudiosProcessingSettings__Normalized";
import AudiosProcessingRawSettingsNormalizer from "@AudiosProcessing/AudiosProcessingRawSettingsNormalizer";
import type BrowserLiveReloadingSettings__Normalized from
    "./BrowserLiveReloading/BrowserLiveReloadingSettings__Normalized";
import BrowserLiveReloadingSettingsNormalizer from "@BrowserLiveReloading/BrowserLiveReloadingSettingsNormalizer";

/* --- Auxiliaries -------------------------------------------------------------------------------------------------- */
import {
  Logger,
  InvalidParameterValueError,
  isNotUndefined,
  isUndefined
} from "@yamato-daiwa/es-extensions";
import InvalidConsoleCommandError from "@UtilsIncubator/Logging/Errors/InvalidConsoleCommandError";


abstract class ProjectBuilderRawConfigNormalizer {

  private static localization: ProjectBuilderRawConfigNormalizer.Localization =
      ProjectBuilderRawConfigNormalizer.getDefaultLocalization();


  public static normalize(
    {
      consumingProjectRootDirectoryAbsolutePath,
      projectBuildingConfig__fromFile__rawValid,
      projectBuildingConfig__fromConsole
    }: {
      consumingProjectRootDirectoryAbsolutePath: string;
      projectBuildingConfig__fromFile__rawValid: ProjectBuildingConfig__FromFile__RawValid;
      projectBuildingConfig__fromConsole: {
        selectiveExecutionID?: string;
        projectBuildingMode: string;
      };
    }
  ): ProjectBuildingConfig__Normalized {

    const commonSettings__fromFile__rawValid: ProjectBuildingCommonSettings__FromFile__RawValid =
        projectBuildingConfig__fromFile__rawValid.commonSettings ?? {};

    const actualSelectiveExecution: ProjectBuildingCommonSettings__FromFile__RawValid.SelectiveExecution | undefined =
        ProjectBuilderRawConfigNormalizer.determineActualSelectiveExecutionID({
          commonSettings__fromFile__rawValid,
          projectBuildingConfig__fromConsole
        });

    const commonSettings__normalized: ProjectBuildingCommonSettings__Normalized =
        ProjectBuildingCommonSettingsNormalizer.normalize({
          commonSettings__fromFile__rawValid,
          consumingProjectRootDirectoryAbsolutePath,
          projectBuildingMode: projectBuildingConfig__fromConsole.projectBuildingMode,
          actualSelectiveExecution
        });


    return {

      commonSettings: commonSettings__normalized,

      debugging: ProjectBuildingDebuggingSettingsNormalizer.normalize(projectBuildingConfig__fromFile__rawValid.debugging),

      ...((): { markupProcessing?: MarkupProcessingSettings__Normalized; } => {

        const markupProcessingSettings__fromFile__rawValid: MarkupProcessingSettings__FromFile__RawValid | undefined =
            projectBuildingConfig__fromFile__rawValid[ProjectBuildingTasksIDsForConfigFile.markupProcessing];

        if (isUndefined(markupProcessingSettings__fromFile__rawValid)) {
          return {};
        }


        /* 〔 Theory 〕 Be careful:
         * isUndefined(commonSettings__normalized.tasksAndSourceFilesSelection?.markupProcessing)
         * is not the equivalent to below condition. */
        if (
          isNotUndefined(commonSettings__normalized.tasksAndSourceFilesSelection) &&
          isUndefined(commonSettings__normalized.tasksAndSourceFilesSelection.markupProcessing)
        ) {
          return {};
        }


        return {
          markupProcessing: MarkupProcessingRawSettingsNormalizer.normalize({
            markupProcessingSettings__fromFile__rawValid, commonSettings__normalized
          })
        };
      })(),

      ...((): { stylesProcessing?: StylesProcessingSettings__Normalized; } => {

        const stylesProcessingSettings__fromFile__rawValid: StylesProcessingSettings__FromFile__RawValid | undefined =
            projectBuildingConfig__fromFile__rawValid[ProjectBuildingTasksIDsForConfigFile.stylesProcessing];

        if (isUndefined(stylesProcessingSettings__fromFile__rawValid)) {
          return {};
        }


        /* 〔 Theory 〕 Be careful:
         * isUndefined(commonSettings__normalized.tasksAndSourceFilesSelection?.stylesProcessing)
         * is not the equivalent to below condition. */
        if (
          isNotUndefined(commonSettings__normalized.tasksAndSourceFilesSelection) &&
          isUndefined(commonSettings__normalized.tasksAndSourceFilesSelection.stylesProcessing)
        ) {
          return {};
        }


        return {
          stylesProcessing: StylesProcessingRawSettingsNormalizer.normalize({
            stylesProcessingSettings__fromFile__rawValid, commonSettings__normalized
          })
        };
      })(),

      ...((): { ECMA_ScriptLogicProcessing?: ECMA_ScriptLogicProcessingSettings__Normalized; } => {

        const ECMA_ScriptLogicProcessingSettings__fromFile__rawValid:
            ECMA_ScriptLogicProcessingSettings__FromFile__RawValid | undefined =
            projectBuildingConfig__fromFile__rawValid[ProjectBuildingTasksIDsForConfigFile.ECMA_ScriptLogicProcessing];

        if (isUndefined(ECMA_ScriptLogicProcessingSettings__fromFile__rawValid)) {
          return {};
        }


        /* 〔 Theory 〕 Be careful:
         * isUndefined(commonSettings__normalized.tasksAndSourceFilesSelection?.ECMA_ScriptLogicProcessing)
         * is not the equivalent to below condition. */
        if (
          isNotUndefined(commonSettings__normalized.tasksAndSourceFilesSelection) &&
          isUndefined(commonSettings__normalized.tasksAndSourceFilesSelection.ECMA_ScriptLogicProcessing)
        ) {
          return {};
        }


        return {
          ECMA_ScriptLogicProcessing: ECMA_ScriptLogicProcessingRawSettingsNormalizer.normalize({
            ECMA_ScriptLogicProcessingSettings__fromFile__rawValid, commonSettings__normalized
          })
        };
      })(),

      ...((): { imagesProcessing?: ImagesProcessingSettings__Normalized; } => {

        const imagesProcessingSettings__fromFile__rawValid: ImagesProcessingSettings__FromFile__RawValid | undefined =
            projectBuildingConfig__fromFile__rawValid[ProjectBuildingTasksIDsForConfigFile.imagesProcessing];

        if (isUndefined(imagesProcessingSettings__fromFile__rawValid)) {
          return {};
        }


        /* 〔 Theory 〕 Be careful:
         * isUndefined(commonSettings__normalized.tasksAndSourceFilesSelection?.imagesProcessing)
         * is not the equivalent to below condition. */
        if (
          isNotUndefined(commonSettings__normalized.tasksAndSourceFilesSelection) &&
          isUndefined(commonSettings__normalized.tasksAndSourceFilesSelection.imagesProcessing)
        ) {
          return {};
        }


        return {
          imagesProcessing: ImagesProcessingRawSettingsNormalizer.normalize({
            imagesProcessingSettings__fromFile__rawValid,
            commonSettings__normalized
          })
        };
      })(),

      ...((): { fontsProcessing?: FontsProcessingSettings__Normalized; } => {

        const fontsProcessingSettings__fromFile__rawValid: FontsProcessingSettings__FromFile__RawValid | undefined =
            projectBuildingConfig__fromFile__rawValid[ProjectBuildingTasksIDsForConfigFile.fontsProcessing];

        if (isUndefined(fontsProcessingSettings__fromFile__rawValid)) {
          return {};
        }


        /* 〔 Theory 〕 Be careful:
         * isUndefined(commonSettings__normalized.tasksAndSourceFilesSelection?.fontsProcessing)
         * is not the equivalent to below condition. */
        if (
          isNotUndefined(commonSettings__normalized.tasksAndSourceFilesSelection) &&
          isUndefined(commonSettings__normalized.tasksAndSourceFilesSelection.fontsProcessing)
        ) {
          return {};
        }


        return {
          fontsProcessing: FontsProcessingSettingsRawSettingsNormalizer.normalize({
            fontsProcessingSettings__fromFile__rawValid,
            commonSettings__normalized
          })
        };
      })(),


      ...((): { videosProcessing?: VideosProcessingSettings__Normalized; } => {

        const videosProcessingSettings__fromFile__rawValid: VideosProcessingSettings__FromFile__RawValid | undefined =
            projectBuildingConfig__fromFile__rawValid[ProjectBuildingTasksIDsForConfigFile.videosProcessing];

        if (isUndefined(videosProcessingSettings__fromFile__rawValid)) {
          return {};
        }


        if (
          isNotUndefined(commonSettings__normalized.tasksAndSourceFilesSelection) &&
          isUndefined(commonSettings__normalized.tasksAndSourceFilesSelection.videosProcessing)
        ) {
          return {};
        }


        /* 〔 Theory 〕 Be careful:
         * isUndefined(commonSettings__normalized.tasksAndSourceFilesSelection?.fontsProcessing)
         * is not the equivalent to below condition. */
        return {
          videosProcessing: VideosProcessingRawSettingsNormalizer.normalize({
            videosProcessingSettings__fromFile__rawValid,
            commonSettings__normalized
          })
        };
      })(),

      ...((): { audiosProcessing?: AudiosProcessingSettings__Normalized; } => {

        const audiosProcessingSettings__fromFile__rawValid: AudiosProcessingSettings__FromFile__RawValid | undefined =
            projectBuildingConfig__fromFile__rawValid[ProjectBuildingTasksIDsForConfigFile.videosProcessing];

        if (isUndefined(audiosProcessingSettings__fromFile__rawValid)) {
          return {};
        }


        if (
          isNotUndefined(commonSettings__normalized.tasksAndSourceFilesSelection) &&
          isUndefined(commonSettings__normalized.tasksAndSourceFilesSelection.audiosProcessing)
        ) {
          return {};
        }


        /* 〔 Theory 〕 Be careful:
         * isUndefined(commonSettings__normalized.tasksAndSourceFilesSelection?.fontsProcessing)
         * is not the equivalent to below condition. */
        return {
          audiosProcessing: AudiosProcessingRawSettingsNormalizer.normalize({
            audiosProcessingSettings__fromFile__rawValid,
            commonSettings__normalized
          })
        };
      })(),

      ...((): { browserLiveReloading?: BrowserLiveReloadingSettings__Normalized; } => {

        const browserLiveReloadingSettings__fromFile__rawValid: BrowserLiveReloadingSettings__FromFile__RawValid | undefined =
            projectBuildingConfig__fromFile__rawValid[ProjectBuildingTasksIDsForConfigFile.browserLiveReloading];

        if (isUndefined(browserLiveReloadingSettings__fromFile__rawValid)) {
          return {};
        }


        const selectedBrowserLiveReloadingSetupID: string | undefined = actualSelectiveExecution?.browserLiveReloadingSetupID;

        return {
          browserLiveReloading: BrowserLiveReloadingSettingsNormalizer.getNormalizedSettings({
            browserLiveReloadingSettings__fromFile__rawValid,
            projectBuilderCommonSettings__normalized: commonSettings__normalized,
            hasSelectiveExecutionBeenDeclared: isNotUndefined(actualSelectiveExecution),
            ...isNotUndefined(selectedBrowserLiveReloadingSetupID) ? { selectedBrowserLiveReloadingSetupID } : {}
          })
        };
      })()
    };
  }

  public static setLocalization(newLocalization: ProjectBuilderRawConfigNormalizer.Localization): void {
    ProjectBuilderRawConfigNormalizer.localization = newLocalization;
  }

  private static determineActualSelectiveExecutionID(
    {
      commonSettings__fromFile__rawValid,
      projectBuildingConfig__fromConsole
    }: {
      commonSettings__fromFile__rawValid: ProjectBuildingCommonSettings__FromFile__RawValid;
      projectBuildingConfig__fromConsole: {
        selectiveExecutionID?: string;
        projectBuildingMode: string;
      };
    }
  ): ProjectBuildingCommonSettings__FromFile__RawValid.SelectiveExecution | undefined {

    const selectiveExecutions: ProjectBuildingCommonSettings__FromFile__RawValid.SelectiveExecutions | undefined =
        commonSettings__fromFile__rawValid.selectiveExecutions;

    let actualSelectiveExecution: ProjectBuildingCommonSettings__FromFile__RawValid.SelectiveExecution | undefined;

    if (isNotUndefined(projectBuildingConfig__fromConsole.selectiveExecutionID)) {

      if (isUndefined(selectiveExecutions)) {
        Logger.throwErrorAndLog({
          errorInstance: new InvalidConsoleCommandError({
            customMessage: ProjectBuilderRawConfigNormalizer.localization.
                generateNoSelectiveExecutionsHasBeenDefinedErrorMessage({
                  specifiedInConsoleCommandSelectiveExecutionID: projectBuildingConfig__fromConsole.selectiveExecutionID
                })
          }),
          occurrenceLocation: "ProjectBuilderRawConfigNormalizer.determineActualSelectiveExecutionID(parametersObject)",
          title: InvalidParameterValueError.localization.defaultTitle
        });
      }


      actualSelectiveExecution = selectiveExecutions[projectBuildingConfig__fromConsole.selectiveExecutionID];

      if (isUndefined(actualSelectiveExecution)) {
        Logger.throwErrorAndLog({
          errorInstance: new InvalidConsoleCommandError({
            customMessage: ProjectBuilderRawConfigNormalizer.localization.
                generateUndefinedSelectiveExecutionID_ErrorMessage({
                  specifiedInConsoleCommandSelectiveExecutionID: projectBuildingConfig__fromConsole.selectiveExecutionID
                })
          }),
          occurrenceLocation: "ProjectBuilderRawConfigNormalizer.determineActualSelectiveExecutionID(parametersObject)",
          title: InvalidParameterValueError.localization.defaultTitle
        });
      }
    }


    return actualSelectiveExecution;
  }


  private static getDefaultLocalization(): ProjectBuilderRawConfigNormalizer.Localization {
    return {
      generateNoSelectiveExecutionsHasBeenDefinedErrorMessage: (
        { specifiedInConsoleCommandSelectiveExecutionID }: { specifiedInConsoleCommandSelectiveExecutionID: string; }
      ): string =>
          `The selective execution '${ specifiedInConsoleCommandSelectiveExecutionID }' has been demanded in the console ` +
          "command while no selective executions has been defined in configuration file.",
      generateUndefinedSelectiveExecutionID_ErrorMessage: (
        { specifiedInConsoleCommandSelectiveExecutionID }: { specifiedInConsoleCommandSelectiveExecutionID: string; }
      ): string =>
          `The selective execution '${ specifiedInConsoleCommandSelectiveExecutionID }' is undefined. ` +
          "Please check which selective executions you have defined in configuration file."
    };
  }
}


namespace ProjectBuilderRawConfigNormalizer {

  export type Localization = {

    generateNoSelectiveExecutionsHasBeenDefinedErrorMessage: (
      parametersObject: { specifiedInConsoleCommandSelectiveExecutionID: string; }
    ) => string;

    generateUndefinedSelectiveExecutionID_ErrorMessage: (
      parametersObject: { specifiedInConsoleCommandSelectiveExecutionID: string; }
    ) => string;
  };
}


export default ProjectBuilderRawConfigNormalizer;
