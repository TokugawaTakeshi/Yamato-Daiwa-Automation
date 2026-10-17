/* ━━━ < Imports ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* ┅┅┅ Restrictions ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import type ConsumingProjectBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";

/* ┅┅┅ Raw Valid Settings ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import { ProjectBuildingTasksIDsForConfigFile } from
    "@ProjectBuilding:Common/RawConfig/Enumerations/ProjectBuildingTasksIDsForConfigFile";
import type ProjectBuildingConfig__FromFile__RawValid from
    "./ProjectBuildingConfig__FromFile__RawValid";
import type ProjectBuildingCommonSettings__FromFile__RawValid from
    "@ProjectBuilding:Common/RawConfig/ProjectBuildingCommonSettings__FromFile__RawValid";

/* ╍╍╍ Source Code Processing ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
import type MarkupProcessingSettings__FromFile__RawValid from
    "@MarkupProcessing/MarkupProcessingSettings__FromFile__RawValid";
import type StylesProcessingSettings__FromFile__RawValid from
    "@StylesProcessing/StylesProcessingSettings__FromFile__RawValid";
import type ECMA_ScriptLogicProcessingSettings__FromFile__RawValid from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettings__FromFile__RawValid";

/* ╍╍╍ Assets Management ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
import type ImagesProcessingSettings__FromFile__RawValid from
    "@ImagesProcessing/ImagesProcessingSettings__FromFile__RawValid";
import type FontsProcessingSettings__FromFile__RawValid from
    "@FontsProcessing/FontsProcessingSettings__FromFile__RawValid";
import type VideosProcessingSettings__FromFile__RawValid from
    "@VideosProcessing/VideosProcessingSettings__FromFile__RawValid";
import type AudiosProcessingSettings__FromFile__RawValid from
    "@AudiosProcessing/AudiosProcessingSettings__FromFile__RawValid";
import type PlainCopyingSettings__FromFile__RawValid from
    "@ProjectBuilding/PlainCopying/PlainCopyingSettings__FromFile__RawValid";

/* ╍╍╍ Other ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
import type BrowserLiveReloadingSettings__FromFile__RawValid from
    "./BrowserLiveReloading/BrowserLiveReloadingSettings__FromFile__RawValid";

/* ┅┅┅ Normalized Settings ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import type ProjectBuildingConfig__Normalized from "./ProjectBuildingConfig__Normalized";
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding:Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";
import ProjectBuildingCommonSettingsNormalizer from
    "@ProjectBuilding:Common/NormalizedConfig/ProjectBuildingCommonSettingsNormalizer";

/* ╍╍╍ Source Code Processing ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
/* ─── Markup ─────────────────────────────────────────────────────────────────────────────────────────────────────── */
import type MarkupProcessingSettings__Normalized from "@MarkupProcessing/MarkupProcessingSettings__Normalized";
import MarkupProcessingRawSettingsNormalizer from "@MarkupProcessing/RawSettingsNormalizer/MarkupProcessingRawSettingsNormalizer";

/* ─── Styles ─────────────────────────────────────────────────────────────────────────────────────────────────────── */
import type StylesProcessingSettings__Normalized from "@StylesProcessing/StylesProcessingSettings__Normalized";
import StylesProcessingRawSettingsNormalizer from "@StylesProcessing/StylesProcessingRawSettingsNormalizer";

/* ─── ECMAScript Logic ───────────────────────────────────────────────────────────────────────────────────────────── */
import type ECMA_ScriptLogicProcessingSettings__Normalized from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettings__Normalized";
import ECMA_ScriptLogicProcessingRawSettingsNormalizer from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingRawSettingsNormalizer";

/* ╍╍╍ Assets Management ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
/* ─── Images ─────────────────────────────────────────────────────────────────────────────────────────────────────── */
import type ImagesProcessingSettings__Normalized from "@ImagesProcessing/ImagesProcessingSettings__Normalized";
import ImagesProcessingRawSettingsNormalizer from "@ImagesProcessing/ImagesProcessingRawSettingsNormalizer";

/* ─── Fonts ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import type FontsProcessingSettings__Normalized from "@FontsProcessing/FontsProcessingSettings__Normalized";
import FontsProcessingSettingsRawSettingsNormalizer from "@FontsProcessing/FontsProcessingRawSettingsNormalizer";

/* ─── Videos ─────────────────────────────────────────────────────────────────────────────────────────────────────── */
import type VideosProcessingSettings__Normalized from "@VideosProcessing/VideosProcessingSettings__Normalized";
import VideosProcessingRawSettingsNormalizer from "@VideosProcessing/VideosProcessingRawSettingsNormalizer";

/* ─── Audios ─────────────────────────────────────────────────────────────────────────────────────────────────────── */
import type AudiosProcessingSettings__Normalized from "@AudiosProcessing/AudiosProcessingSettings__Normalized";
import AudiosProcessingRawSettingsNormalizer from "@AudiosProcessing/AudiosProcessingRawSettingsNormalizer";

/* ╍╍╍ Other ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
/* ─── Plain Copying ──────────────────────────────────────────────────────────────────────────────────────────────── */
import type PlainCopyingSettings__Normalized from "@ProjectBuilding/PlainCopying/PlainCopyingSettings__Normalized";
import PlainCopyingRawSettingsNormalizer from "@ProjectBuilding/PlainCopying/PlainCopyingRawSettingsNormalizer";

/* ─── Browser Live Reloading ─────────────────────────────────────────────────────────────────────────────────────── */
import type BrowserLiveReloadingSettings__Normalized from
    "@BrowserLiveReloading/BrowserLiveReloadingSettings__Normalized";
import BrowserLiveReloadingSettingsNormalizer from
    "@BrowserLiveReloading/RawSettingsNormalizer/BrowserLiveReloadingSettingsNormalizer";

/* ─── Docker Compose ─────────────────────────────────────────────────────────────────────────────────────────────── */
import type DockerComposeSettings__Normalized from "@ProjectBuilding/DockerCompose/DockerComposeSettings__Normalized";
import DockerComposeSettingsNormalizer from "@ProjectBuilding/DockerCompose/DockerComposeSettingsNormalizer";

/* ─── Output package.json Generating ─────────────────────────────────────────────────────────────────────────────── */
import type OutputPackageJSON_GeneratingSettings__Normalized from
    "@ProjectBuilding/OutputPackageJSON_Generating/OutputPackageJSON_GeneratingSettings__Normalized";
import OutputPackageJSON_GeneratingSettingsNormalizer from
    "@ProjectBuilding/OutputPackageJSON_Generating/OutputPackageJSON_GeneratingSettingsNormalizer";

/* ┅┅┅ Utils ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import {
  Logger,
  InvalidParameterValueError,
  isNotUndefined,
  isUndefined, isNotNull
} from "@yamato-daiwa/es-extensions";
import { InvalidConsoleCommandError } from "@yamato-daiwa/es-extensions-nodejs";
/* ━━━ Imports > ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */


export default abstract class ProjectBuilderRawConfigNormalizer {

  public static normalize(
    {
      consumingProjectRootDirectoryAbsolutePath,
      projectBuildingConfig__fromFile__rawValid,
      projectBuildingConfig__fromConsole
    }: Readonly<{
      consumingProjectRootDirectoryAbsolutePath: string;
      projectBuildingConfig__fromFile__rawValid: ProjectBuildingConfig__FromFile__RawValid;
      projectBuildingConfig__fromConsole: {
        selectiveExecutionID?: string;
        projectBuildingMode: ConsumingProjectBuildingModes;
      };
    }>
  ): ProjectBuildingConfig__Normalized {

    const commonSettings__fromFile__rawValid: ProjectBuildingCommonSettings__FromFile__RawValid =
        projectBuildingConfig__fromFile__rawValid.commonSettings ?? {};

    const actualSelectiveExecution: ProjectBuildingCommonSettings__FromFile__RawValid.SelectiveExecution | undefined =
        ProjectBuilderRawConfigNormalizer.determineActualSelectiveExecution({
          commonSettings__fromFile__rawValid,
          projectBuildingConfig__fromConsole
        });

    const commonSettings__normalized: ProjectBuildingCommonSettings__Normalized =
        ProjectBuildingCommonSettingsNormalizer.normalize({
          commonSettings__fromFile__rawValid,
          consumingProjectRootDirectoryAbsolutePath,
          projectBuildingMode: projectBuildingConfig__fromConsole.projectBuildingMode,
          ...isNotUndefined(projectBuildingConfig__fromConsole.selectiveExecutionID) ?
              { actualSelectiveExecutionID: projectBuildingConfig__fromConsole.selectiveExecutionID } : null,
          actualSelectiveExecution
        });

    return {

      commonSettings: commonSettings__normalized,

      ...((): { markupProcessing?: MarkupProcessingSettings__Normalized; } => {

        const markupProcessingSettings__fromFile__rawValid: MarkupProcessingSettings__FromFile__RawValid | undefined =
            projectBuildingConfig__fromFile__rawValid[ProjectBuildingTasksIDsForConfigFile.markupProcessing];

        if (isUndefined(markupProcessingSettings__fromFile__rawValid)) {
          return {};
        }


        /* 〔 Theory 〕 ※ Be careful:
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


        /* 〔 Theory 〕 See ※. */
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


        /* 〔 Theory 〕 See ※. */
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


        /* 〔 Theory 〕 See ※. */
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


        /* 〔 Theory 〕 See ※. */
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


        /* 〔 Theory 〕 See ※. */
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


        /* 〔 Theory 〕 See ※. */
        return {
          audiosProcessing: AudiosProcessingRawSettingsNormalizer.normalize({
            audiosProcessingSettings__fromFile__rawValid,
            commonSettings__normalized
          })
        };

      })(),

      ...((): { plainCopying?: PlainCopyingSettings__Normalized; } => {

        const plainCopyingSettings__rawValid__fromFile: PlainCopyingSettings__FromFile__RawValid | undefined =
            projectBuildingConfig__fromFile__rawValid[ProjectBuildingTasksIDsForConfigFile.plainCopying];

        if (isUndefined(plainCopyingSettings__rawValid__fromFile)) {
          return {};
        }


        if (
          isNotUndefined(commonSettings__normalized.tasksAndSourceFilesSelection) &&
          isUndefined(commonSettings__normalized.tasksAndSourceFilesSelection.plainCopying)
        ) {
          return {};
        }


        /* 〔 Theory 〕 See ※. */
        return {
          plainCopying: PlainCopyingRawSettingsNormalizer.normalize({
            plainCopyingSettings__fromFile__rawValid: plainCopyingSettings__rawValid__fromFile,
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
          browserLiveReloading: BrowserLiveReloadingSettingsNormalizer.normalize({
            browserLiveReloadingSettings__fromFile__rawValid,
            projectBuilderCommonSettings__normalized: commonSettings__normalized,
            hasSelectiveExecutionBeenDeclared: isNotUndefined(actualSelectiveExecution),
            ...isNotUndefined(selectedBrowserLiveReloadingSetupID) ? { selectedBrowserLiveReloadingSetupID } : {}
          })
        };

      })(),

      ...((): Pick<ProjectBuildingConfig__Normalized, "dockerCompose"> => {

        const dockerComposeSettings__normalized: DockerComposeSettings__Normalized | null =
            DockerComposeSettingsNormalizer.normalize({
              dockerComposeSettings__fromFile__rawValid:
                  projectBuildingConfig__fromFile__rawValid[ProjectBuildingTasksIDsForConfigFile.dockerLaunching],
              commonSettings__normalized
            });

        return isNotNull(dockerComposeSettings__normalized) ? { dockerCompose: dockerComposeSettings__normalized } : {};

      })(),

      ...((): { outputPackageJSON_Generating?: OutputPackageJSON_GeneratingSettings__Normalized; } => {

        const outputPackageJSON_Generating: OutputPackageJSON_GeneratingSettings__Normalized | null =
            OutputPackageJSON_GeneratingSettingsNormalizer.normalizeIfThereAreActualOnes({
              outputPackageJSON_GeneratingSettings__fromFile__rawValid: projectBuildingConfig__fromFile__rawValid[
                ProjectBuildingTasksIDsForConfigFile.outputPackageJSON_Generating
              ],
              commonSettings__normalized
            });

        return isNotNull(outputPackageJSON_Generating) ? { outputPackageJSON_Generating } : {};

      })()

    };
  }

  private static determineActualSelectiveExecution(
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
        Logger.throwErrorWithFormattedMessage({
          errorInstance: new InvalidConsoleCommandError({
            customMessage:
              `The selective execution "${ projectBuildingConfig__fromConsole.selectiveExecutionID }" has been demanded ` +
                "by the console command while no selective executions has been defined in configuration file."
          }),
          occurrenceLocation: "ProjectBuilderRawConfigNormalizer.determineActualSelectiveExecution(parametersObject)",
          title: InvalidParameterValueError.localization.defaultTitle
        });
      }


      actualSelectiveExecution = selectiveExecutions[projectBuildingConfig__fromConsole.selectiveExecutionID];

      if (isUndefined(actualSelectiveExecution)) {
        Logger.throwErrorWithFormattedMessage({
          errorInstance: new InvalidConsoleCommandError({
            customMessage:
                `The selective execution "${ projectBuildingConfig__fromConsole.selectiveExecutionID }" is undefined. ` +
                "Please check which selective executions you have defined in configuration file."
          }),
          occurrenceLocation: "ProjectBuilderRawConfigNormalizer.determineActualSelectiveExecution(parametersObject)",
          title: InvalidParameterValueError.localization.defaultTitle
        });
      }

    }


    return actualSelectiveExecution;

  }

}
