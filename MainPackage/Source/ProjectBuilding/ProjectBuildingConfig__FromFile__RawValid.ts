/* ─── Raw Valid Config ───────────────────────────────────────────────────────────────────────────────────────────── */
import type {
  ProjectBuildingTasksIDsForConfigFile,
  ProjectBuildingTasksIDsForConfigFile__Localized
} from "@ProjectBuilding/Common/RawConfig/Enumerations/ProjectBuildingTasksIDsForConfigFile";

import type ConsumingProjectPreDefinedBuildingModes__Localized from
    "@ProjectBuilding/Common/RawConfig/Enumerations/ConsumingProjectPreDefinedBuildingModes__Localized";

import ProjectBuildingCommonSettings__FromFile__RawValid from
    "@ProjectBuilding:Common/RawConfig/ProjectBuildingCommonSettings__FromFile__RawValid";
import type SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid from
    "@ProjectBuilding:Common/RawConfig/SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid";
import ResourceFilesGroupBuildingModeDependentOutputGenericSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/ResourceFilesGroupBuildingModeDependentOutputGenericSettings__FromFile__RawValid";
import RevisioningSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/RevisioningSettings__FromFile__RawValid";
import LintingSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/LintingSettings__FromFile__RawValid";
import OutputDirectoryPathTransformationsSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/OutputDirectoryPathTransformationsSettings__FromFile__RawValid";
import MarkupProcessingSettings__FromFile__RawValid from
    "@MarkupProcessing/MarkupProcessingSettings__FromFile__RawValid";
import StylesProcessingSettings__FromFile__RawValid from
    "@StylesProcessing/StylesProcessingSettings__FromFile__RawValid";
import ECMA_ScriptLogicProcessingSettings__FromFile__RawValid from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettings__FromFile__RawValid";
import ImagesProcessingSettings__FromFile__RawValid from
    "@ImagesProcessing/ImagesProcessingSettings__FromFile__RawValid";
import FontsProcessingSettings__FromFile__RawValid from
    "@FontsProcessing/FontsProcessingSettings__FromFile__RawValid";
import VideosProcessingSettings__FromFile__RawValid from
    "@VideosProcessing/VideosProcessingSettings__FromFile__RawValid";
import AudiosProcessingSettings__FromFile__RawValid from
    "@AudiosProcessing/AudiosProcessingSettings__FromFile__RawValid";
import PlainCopyingSettings__FromFile__RawValid from
    "@ProjectBuilding/PlainCopying/PlainCopyingSettings__FromFile__RawValid";
import FilesWatchingSettings__FromFile__RawValid from
    "@ProjectBuilding/FilesWatching/FilesWatchingSettings__FromFile__RawValid";
import BrowserLiveReloadingSettings__FromFile__RawValid from
    "@BrowserLiveReloading/BrowserLiveReloadingSettings__FromFile__RawValid";
import OutputPackageJSON_GeneratingSettings__FromFile__RawValid from
    "@ProjectBuilding/OutputPackageJSON_Generating/OutputPackageJSON_GeneratingSettings__FromFile__RawValid";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { RawObjectDataProcessor, nullToUndefined } from "@yamato-daiwa/es-extensions";


type ProjectBuildingConfig__FromFile__RawValid = {

  commonSettings?: ProjectBuildingCommonSettings__FromFile__RawValid;

  [ProjectBuildingTasksIDsForConfigFile.markupProcessing]?: MarkupProcessingSettings__FromFile__RawValid;
  [ProjectBuildingTasksIDsForConfigFile.stylesProcessing]?: StylesProcessingSettings__FromFile__RawValid;
  [ProjectBuildingTasksIDsForConfigFile.ECMA_ScriptLogicProcessing]?: ECMA_ScriptLogicProcessingSettings__FromFile__RawValid;

  [ProjectBuildingTasksIDsForConfigFile.imagesProcessing]?: ImagesProcessingSettings__FromFile__RawValid;
  [ProjectBuildingTasksIDsForConfigFile.fontsProcessing]?: FontsProcessingSettings__FromFile__RawValid;
  [ProjectBuildingTasksIDsForConfigFile.videosProcessing]?: VideosProcessingSettings__FromFile__RawValid;
  [ProjectBuildingTasksIDsForConfigFile.audiosProcessing]?: AudiosProcessingSettings__FromFile__RawValid;

  [ProjectBuildingTasksIDsForConfigFile.plainCopying]?: PlainCopyingSettings__FromFile__RawValid;

  [ProjectBuildingTasksIDsForConfigFile.filesWatching]?: FilesWatchingSettings__FromFile__RawValid;
  [ProjectBuildingTasksIDsForConfigFile.browserLiveReloading]?: BrowserLiveReloadingSettings__FromFile__RawValid;

  [ProjectBuildingTasksIDsForConfigFile.outputPackageJSON_Generating]?: OutputPackageJSON_GeneratingSettings__FromFile__RawValid;

};


namespace ProjectBuildingConfig__FromFile__RawValid {

  export type Localization = Readonly<{

    KEY: string;

    enumerations: Readonly<{
      tasksIDs: ProjectBuildingTasksIDsForConfigFile__Localized;
      consumingProjectPreDefinedBuildingModes: ConsumingProjectPreDefinedBuildingModes__Localized;
    }>;

    reusables: Readonly<{
      sourceCodeProcessingGenericProperties:
          SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.Localization;
      resourceFilesGroupBuildingModeDependentOutputGenericSettings:
          ResourceFilesGroupBuildingModeDependentOutputGenericSettings__FromFile__RawValid.Localization;
      revisioning: RevisioningSettings__FromFile__RawValid.Localization;
      lintingCommonSettings: LintingSettings__FromFile__RawValid.Localization;
      outputPathTransformationsSettings: OutputDirectoryPathTransformationsSettings__FromFile__RawValid.Localization;
    }>;

    tasks: Readonly<{
      markupProcessing: MarkupProcessingSettings__FromFile__RawValid.Localization;
      stylesProcessing: StylesProcessingSettings__FromFile__RawValid.Localization;
      ECMA_ScriptLogicProcessing: ECMA_ScriptLogicProcessingSettings__FromFile__RawValid.Localization;
      imagesProcessing: ImagesProcessingSettings__FromFile__RawValid.Localization;
      fontsProcessing: FontsProcessingSettings__FromFile__RawValid.Localization;
      videosProcessing: VideosProcessingSettings__FromFile__RawValid.Localization;
      audiosProcessing: AudiosProcessingSettings__FromFile__RawValid.Localization;
      plainCopying: PlainCopyingSettings__FromFile__RawValid.Localization;
      filesWatching: FilesWatchingSettings__FromFile__RawValid.Localization;
      browserLiveReloading: BrowserLiveReloadingSettings__FromFile__RawValid.Localization;
      outputPackageJSON_Generating: OutputPackageJSON_GeneratingSettings__FromFile__RawValid.Localization;
    }>;

  }>;


  /* [ Theory ] "yamljs" will convert empty properties' values to 'null'; 'nullToUndefined' is required to recognize
        the property as optional. */
  export function getLocalizedSpecification(localization: Localization): RawObjectDataProcessor.ObjectDataSpecification {

    const outputDirectoryPathTransformationsPropertiesLocalizedSpecification: RawObjectDataProcessor.PropertiesSpecification =
        OutputDirectoryPathTransformationsSettings__FromFile__RawValid.getLocalizedPropertiesSpecification(
            localization.reusables.outputPathTransformationsSettings
        );

    const entryPointsGroupBuildingModeDependentOutputGenericSettingsLocalizedPropertiesSpecification:
        RawObjectDataProcessor.PropertiesSpecification =
            ResourceFilesGroupBuildingModeDependentOutputGenericSettings__FromFile__RawValid.getLocalizedPropertiesSpecification({
              resourceFileOutputBuildingModeDependentSettingsLocalization:
                  localization.reusables.resourceFilesGroupBuildingModeDependentOutputGenericSettings,
              outputDirectoryPathTransformationsPropertiesLocalizedSpecification
            });

    const consumingProjectLocalizedPreDefinedBuildingModes: ConsumingProjectPreDefinedBuildingModes__Localized =
        localization.enumerations.consumingProjectPreDefinedBuildingModes;

    const revisioningPropertiesLocalizedSpecification: RawObjectDataProcessor.PropertiesSpecification =
        RevisioningSettings__FromFile__RawValid.getLocalizedPropertiesSpecification(localization.reusables.revisioning);

    const lintingCommonSettingsLocalizedPropertiesSpecification: RawObjectDataProcessor.PropertiesSpecification =
        LintingSettings__FromFile__RawValid.
            getLocalizedPropertiesSpecification(localization.reusables.lintingCommonSettings);

    return {

      nameForLogging: "ProjectBuildingConfig__FromFile__RawValid",
      subtype: RawObjectDataProcessor.ObjectSubtypes.fixedKeyAndValuePairsObject,

      properties: {

        $projectBuilding: {

          newName: "projectBuilding",
          preValidationModifications: nullToUndefined,
          type: Object,
          required: true,

          properties: {

            $commonSettings: {
              newName: "commonSettings",
              preValidationModifications: nullToUndefined,
              type: Object,
              required: false,
              properties: ProjectBuildingCommonSettings__FromFile__RawValid.propertiesSpecification
            },

            $markupProcessing: {
              newName: "markupProcessing",
              preValidationModifications: nullToUndefined,
              type: Object,
              required: false,
              properties: MarkupProcessingSettings__FromFile__RawValid.getLocalizedPropertiesSpecification({
                markupProcessingPropertiesLocalization: localization.tasks.markupProcessing,
                localizedConsumingProjectLocalizedPreDefinedBuildingModes: consumingProjectLocalizedPreDefinedBuildingModes,
                lintingSettingsLocalizedPropertiesSpecification: lintingCommonSettingsLocalizedPropertiesSpecification,
                sourceCodeProcessingSettingsGenericPropertiesLocalization: localization.reusables.
                    sourceCodeProcessingGenericProperties,
                entryPointsGroupBuildingModeDependentOutputGenericSettingsLocalizedPropertiesSpecification
              })
            },

            $stylesProcessing: {
              newName: "stylesProcessing",
              preValidationModifications: nullToUndefined,
              type: Object,
              required: false,
              properties: StylesProcessingSettings__FromFile__RawValid.getLocalizedPropertiesSpecification({
                stylesProcessingPropertiesLocalization: localization.tasks.stylesProcessing,
                localizedConsumingProjectLocalizedPreDefinedBuildingModes: consumingProjectLocalizedPreDefinedBuildingModes,
                lintingSettingsLocalizedPropertiesSpecification: lintingCommonSettingsLocalizedPropertiesSpecification,
                sourceCodeProcessingSettingsGenericPropertiesLocalization: localization.reusables.
                    sourceCodeProcessingGenericProperties,
                entryPointsGroupBuildingModeDependentOutputGenericSettingsLocalizedPropertiesSpecification,
                revisioningSettingsLocalizedPropertiesSpecification: revisioningPropertiesLocalizedSpecification
              })
            },

            [localization.enumerations.tasksIDs.ECMA_ScriptLogicProcessing]: {
              newName: "ECMA_ScriptLogicProcessing",
              preValidationModifications: nullToUndefined,
              type: Object,
              required: false,
              properties: ECMA_ScriptLogicProcessingSettings__FromFile__RawValid.getLocalizedPropertiesSpecification({
                ECMA_ScriptProcessingPropertiesLocalization: localization.tasks.ECMA_ScriptLogicProcessing,
                localizedConsumingProjectLocalizedPreDefinedBuildingModes: consumingProjectLocalizedPreDefinedBuildingModes,
                lintingSettingsLocalizedPropertiesSpecification: lintingCommonSettingsLocalizedPropertiesSpecification,
                sourceCodeProcessingSettingsGenericPropertiesLocalization: localization.reusables.
                    sourceCodeProcessingGenericProperties,
                entryPointsGroupBuildingModeDependentOutputGenericSettingsLocalizedPropertiesSpecification,
                revisioningSettingsLocalizedPropertiesSpecification: revisioningPropertiesLocalizedSpecification
              })
            },

            [localization.enumerations.tasksIDs.imagesProcessing]: {
              newName: "imagesProcessing",
              type: Object,
              required: false,
              preValidationModifications: nullToUndefined,
              properties: ImagesProcessingSettings__FromFile__RawValid.getLocalizedPropertiesSpecification({
                imagesProcessingLocalization: localization.tasks.imagesProcessing,
                entryPointsGroupBuildingModeDependentOutputGenericSettingsLocalizedPropertiesSpecification,
                revisioningPropertiesLocalizedSpecification,
                consumingProjectLocalizedPreDefinedBuildingModes
              })
            },

            [localization.enumerations.tasksIDs.fontsProcessing]: {
              newName: "fontsProcessing",
              type: Object,
              required: false,
              preValidationModifications: nullToUndefined,
              properties: FontsProcessingSettings__FromFile__RawValid.getLocalizedPropertiesSpecification({
                fontsProcessingLocalization: localization.tasks.fontsProcessing,
                entryPointsGroupBuildingModeDependentOutputGenericSettingsLocalizedPropertiesSpecification,
                revisioningPropertiesLocalizedSpecification,
                consumingProjectLocalizedPreDefinedBuildingModes
              })
            },

            [localization.enumerations.tasksIDs.videosProcessing]: {
              newName: "videosProcessing",
              type: Object,
              required: false,
              preValidationModifications: nullToUndefined,
              properties: VideosProcessingSettings__FromFile__RawValid.getLocalizedPropertiesSpecification({
                videosProcessingLocalization: localization.tasks.videosProcessing,
                entryPointsGroupBuildingModeDependentOutputGenericSettingsLocalizedPropertiesSpecification,
                revisioningPropertiesLocalizedSpecification,
                consumingProjectLocalizedPreDefinedBuildingModes
              })
            },

            [localization.enumerations.tasksIDs.audiosProcessing]: {
              newName: "audiosProcessing",
              type: Object,
              required: false,
              preValidationModifications: nullToUndefined,
              properties: AudiosProcessingSettings__FromFile__RawValid.getLocalizedPropertiesSpecification({
                audiosProcessingLocalization: localization.tasks.audiosProcessing,
                entryPointsGroupBuildingModeDependentOutputGenericSettingsLocalizedPropertiesSpecification,
                revisioningPropertiesLocalizedSpecification,
                consumingProjectLocalizedPreDefinedBuildingModes
              })
            },

            [localization.enumerations.tasksIDs.plainCopying]: {
              newName: "plainCopying",
              type: Object,
              required: false,
              preValidationModifications: nullToUndefined,
              properties: PlainCopyingSettings__FromFile__RawValid.getLocalizedPropertiesSpecification({
                plainCopyingLocalization: localization.tasks.plainCopying,
                consumingProjectLocalizedPreDefinedBuildingModes,
                outputDirectoryPathTransformationsPropertiesLocalizedSpecification
              })
            },

            [localization.enumerations.tasksIDs.filesWatching]: {
              newName: "filesWatching",
              type: Object,
              required: false,
              preValidationModifications: nullToUndefined,
              properties: FilesWatchingSettings__FromFile__RawValid.getLocalizedPropertiesSpecification(
                localization.tasks.filesWatching
              )
            },

            [localization.enumerations.tasksIDs.browserLiveReloading]: {
              newName: "browserLiveReloading",
              type: Object,
              required: false,
              preValidationModifications: nullToUndefined,
              properties: BrowserLiveReloadingSettings__FromFile__RawValid.
                  getLocalizedPropertiesSpecification(localization.tasks.browserLiveReloading)
            },

            [localization.enumerations.tasksIDs.outputPackageJSON_Generating]: {
              newName: "outputPackageJSON_Generating",
              type: Object,
              required: false,
              preValidationModifications: nullToUndefined,
              properties: OutputPackageJSON_GeneratingSettings__FromFile__RawValid.getLocalizedPropertiesSpecification({
                outputPackageJSON_GeneratingSettingsLocalization: localization.tasks.outputPackageJSON_Generating,
                consumingProjectLocalizedPreDefinedBuildingModes
              })
            }

          }

        }

      }

    };

  }

}


export default ProjectBuildingConfig__FromFile__RawValid;
