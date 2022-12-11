/* --- Raw valid config ---------------------------------------------------------------------------------------------- */
import type {
  ProjectBuildingTasksIDsForConfigFile,
  ProjectBuildingTasksIDsForConfigFile__Localized
} from "@ProjectBuilding/Common/RawConfig/Enumerations/ProjectBuildingTasksIDsForConfigFile";

import type ConsumingProjectPreDefinedBuildingModes__Localized from
    "@ProjectBuilding/Common/RawConfig/Enumerations/ConsumingProjectPreDefinedBuildingModes__Localized";

import ProjectBuildingCommonSettings__FromFile__RawValid from
    "@ProjectBuilding:Common/RawConfig/ProjectBuildingCommonSettings__FromFile__RawValid";
import SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid from
    "@ProjectBuilding:Common/RawConfig/SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid";
import RevisioningSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/RevisioningSettings__FromFile__RawValid";
import LintingCommonSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/LintingCommonSettings__FromFile__RawValid";
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
import BrowserLiveReloadingSettings__FromFile__RawValid from
    "@BrowserLiveReloading/BrowserLiveReloadingSettings__FromFile__RawValid";

/* --- General auxiliaries ------------------------------------------------------------------------------------------ */
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

  [ProjectBuildingTasksIDsForConfigFile.browserLiveReloading]?: BrowserLiveReloadingSettings__FromFile__RawValid;

};


/* eslint-disable-next-line @typescript-eslint/no-redeclare --
 * The merging of type/interface and namespace is completely valid TypeScript,
 * but @typescript-eslint community does not wish to support it.
 * https://github.com/eslint/eslint/issues/15504 */
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
      revisioning: RevisioningSettings__FromFile__RawValid.Localization;
      lintingCommonSettings: LintingCommonSettings__FromFile__RawValid.Localization;
    }>;

    commonSettings: Readonly<{
      KEY: string;
      properties: ProjectBuildingCommonSettings__FromFile__RawValid.Localization;
    }>;

    tasks: Readonly<{
      markupProcessing: MarkupProcessingSettings__FromFile__RawValid.Localization;
      stylesProcessing: StylesProcessingSettings__FromFile__RawValid.Localization;
      ECMA_ScriptLogicProcessing: ECMA_ScriptLogicProcessingSettings__FromFile__RawValid.Localization;
      imagesProcessing: ImagesProcessingSettings__FromFile__RawValid.Localization;
      fontsProcessing: FontsProcessingSettings__FromFile__RawValid.Localization;
      videosProcessing: VideosProcessingSettings__FromFile__RawValid.Localization;
      audiosProcessing: AudiosProcessingSettings__FromFile__RawValid.Localization;
      browserLiveReloading: BrowserLiveReloadingSettings__FromFile__RawValid.Localization;
    }>;

  }>;


  /* [ Theory ] "yamljs" will convert empty properties' values to 'null'; 'nullToUndefined' is required to recognize
        the property as optional. */
  export function getLocalizedSpecification(localization: Localization): RawObjectDataProcessor.ObjectDataSpecification {

    const sourceCodeProcessingSettingsGenericPropertiesLocalizedSpecification: RawObjectDataProcessor.PropertiesSpecification =
        SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.
            getLocalizedPropertiesSpecification(localization.reusables.sourceCodeProcessingGenericProperties);

    const consumingProjectLocalizedPreDefinedBuildingModes: ConsumingProjectPreDefinedBuildingModes__Localized =
        localization.enumerations.consumingProjectPreDefinedBuildingModes;

    const revisioningPropertiesLocalizedSpecification: RawObjectDataProcessor.PropertiesSpecification =
        RevisioningSettings__FromFile__RawValid.getLocalizedPropertiesSpecification(localization.reusables.revisioning);

    const lintingCommonSettingsLocalizedPropertiesSpecification: RawObjectDataProcessor.PropertiesSpecification =
        LintingCommonSettings__FromFile__RawValid.
            getLocalizedPropertiesSpecification(localization.reusables.lintingCommonSettings);

    return {

      nameForLogging: "ProjectBuildingConfig__FromFile__RawValid",
      subtype: RawObjectDataProcessor.ObjectSubtypes.fixedKeyAndValuePairsObject,

      properties: {

        [localization.KEY]: {

          newName: "projectBuilding",
          preValidationModifications: nullToUndefined,
          type: Object,
          required: true,

          properties: {

            [localization.commonSettings.KEY]: {
              newName: "commonSettings",
              preValidationModifications: nullToUndefined,
              type: Object,
              required: false,
              properties: ProjectBuildingCommonSettings__FromFile__RawValid.getLocalizedPropertiesSpecification({
                projectBuildingCommonSettingsLocalization: localization.commonSettings.properties,
                tasksLocalizedIDs: localization.enumerations.tasksIDs
              })
            },

            [localization.enumerations.tasksIDs.markupProcessing]: {
              newName: "markupProcessing",
              preValidationModifications: nullToUndefined,
              type: Object,
              required: false,
              properties: MarkupProcessingSettings__FromFile__RawValid.getLocalizedPropertiesSpecification({
                markupProcessingLocalization: localization.tasks.markupProcessing,
                sourceCodeProcessingSettingsGenericPropertiesLocalizedSpecification,
                consumingProjectLocalizedPreDefinedBuildingModes,
                lintingCommonSettingsLocalizedPropertiesSpecification
              })
            },

            [localization.enumerations.tasksIDs.stylesProcessing]: {
              newName: "stylesProcessing",
              preValidationModifications: nullToUndefined,
              type: Object,
              required: false,
              properties: StylesProcessingSettings__FromFile__RawValid.getLocalizedPropertiesSpecification({
                stylesProcessingLocalization: localization.tasks.stylesProcessing,
                sourceCodeProcessingSettingsGenericPropertiesLocalizedSpecification,
                consumingProjectLocalizedPreDefinedBuildingModes,
                revisioningPropertiesLocalizedSpecification,
                lintingCommonSettingsLocalizedPropertiesSpecification
              })
            },

            [localization.enumerations.tasksIDs.ECMA_ScriptLogicProcessing]: {
              newName: "ECMA_ScriptLogicProcessing",
              preValidationModifications: nullToUndefined,
              type: Object,
              required: false,
              properties: ECMA_ScriptLogicProcessingSettings__FromFile__RawValid.getLocalizedPropertiesSpecification({
                ECMA_ScriptProcessingLocalization: localization.tasks.ECMA_ScriptLogicProcessing,
                sourceCodeProcessingSettingsGenericPropertiesLocalizedSpecification,
                consumingProjectLocalizedPreDefinedBuildingModes,
                revisioningPropertiesLocalizedSpecification,
                lintingCommonSettingsLocalizedPropertiesSpecification
              })
            },

            [localization.enumerations.tasksIDs.imagesProcessing]: {
              newName: "imagesProcessing",
              type: Object,
              required: false,
              preValidationModifications: nullToUndefined,
              properties: ImagesProcessingSettings__FromFile__RawValid.getLocalizedPropertiesSpecification({
                imagesProcessingLocalization: localization.tasks.imagesProcessing,
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
                revisioningPropertiesLocalizedSpecification,
                consumingProjectLocalizedPreDefinedBuildingModes
              })
            },

            [localization.enumerations.tasksIDs.audiosProcessing]: {
              newName: "audiosProcessing",
              type: Object,
              required: false,
              preValidationModifications: nullToUndefined,
              properties: AudiosProcessingSettings__FromFile__RawValid.normalize({
                audiosProcessingLocalization: localization.tasks.audiosProcessing,
                revisioningPropertiesLocalizedSpecification,
                consumingProjectLocalizedPreDefinedBuildingModes
              })
            },

            [localization.enumerations.tasksIDs.browserLiveReloading]: {
              newName: "browserLiveReloading",
              type: Object,
              required: false,
              preValidationModifications: nullToUndefined,
              properties: BrowserLiveReloadingSettings__FromFile__RawValid.
                  getLocalizedPropertiesSpecification(localization.tasks.browserLiveReloading)
            }
          }
        }
      }
    };
  }
}


export default ProjectBuildingConfig__FromFile__RawValid;
