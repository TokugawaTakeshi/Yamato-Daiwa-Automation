/* ─── Raw Valid Config ───────────────────────────────────────────────────────────────────────────────────────────── */
import type { ProjectBuildingTasksIDsForConfigFile } from
    "@ProjectBuilding/Common/RawConfig/Enumerations/ProjectBuildingTasksIDsForConfigFile";

import ProjectBuildingCommonSettings__FromFile__RawValid from
    "@ProjectBuilding:Common/RawConfig/ProjectBuildingCommonSettings__FromFile__RawValid";
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
import { RawObjectDataProcessor } from "@yamato-daiwa/es-extensions";


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

  /* [ Theory ] "yamljs" will convert empty properties' values to 'null'; 'nullToUndefined' is required to recognize
        the property as optional. */
  export const propertiesSpecification: RawObjectDataProcessor.ObjectDataSpecification = {

    nameForLogging: "ProjectBuildingConfig__FromFile__RawValid",
    subtype: RawObjectDataProcessor.ObjectSubtypes.fixedSchema,

    properties: {

      $projectBuilding: {

        newName: "projectBuilding",
        type: Object,
        isUndefinedForbidden: true,
        isNullForbidden: true,

        properties: {

          $commonSettings: {
            newName: "commonSettings",
            type: Object,
            isUndefinedForbidden: false,
            mustTransformNullToUndefined: true,
            properties: ProjectBuildingCommonSettings__FromFile__RawValid.propertiesSpecification
          },

          $markupProcessing: {
            newName: "markupProcessing",
            type: Object,
            isUndefinedForbidden: false,
            mustTransformNullToUndefined: true,
            properties: MarkupProcessingSettings__FromFile__RawValid.propertiesSpecification
          },

          $stylesProcessing: {
            newName: "stylesProcessing",
            type: Object,
            isUndefinedForbidden: false,
            mustTransformNullToUndefined: true,
            properties: StylesProcessingSettings__FromFile__RawValid.propertiesSpecification
          },

          $ECMA_ScriptLogicProcessing: {
            newName: "ECMA_ScriptLogicProcessing",
            type: Object,
            isUndefinedForbidden: false,
            mustTransformNullToUndefined: true,
            properties: ECMA_ScriptLogicProcessingSettings__FromFile__RawValid.propertiesSpecification
          },

          $imagesProcessing: {
            newName: "imagesProcessing",
            type: Object,
            isUndefinedForbidden: false,
            mustTransformNullToUndefined: true,
            properties: ImagesProcessingSettings__FromFile__RawValid.propertiesSpecification
          },

          $fontsProcessing: {
            newName: "fontsProcessing",
            type: Object,
            isUndefinedForbidden: false,
            mustTransformNullToUndefined: true,
            properties: FontsProcessingSettings__FromFile__RawValid.propertiesSpecification
          },

          $videosProcessing: {
            newName: "videosProcessing",
            type: Object,
            isUndefinedForbidden: false,
            mustTransformNullToUndefined: true,
            properties: VideosProcessingSettings__FromFile__RawValid.propertiesSpecification
          },

          $audiosProcessing: {
            newName: "audiosProcessing",
            type: Object,
            isUndefinedForbidden: false,
            mustTransformNullToUndefined: true,
            properties: AudiosProcessingSettings__FromFile__RawValid.propertiesSpecification
          },

          $plainCopying: {
            newName: "plainCopying",
            type: Object,
            isUndefinedForbidden: false,
            mustTransformNullToUndefined: true,
            properties: PlainCopyingSettings__FromFile__RawValid.propertiesSpecification
          },

          $filesWatching: {
            newName: "filesWatching",
            type: Object,
            isUndefinedForbidden: false,
            mustTransformNullToUndefined: true,
            properties: FilesWatchingSettings__FromFile__RawValid.propertiesSpecification
          },

          $browserLiveReloading: {
            newName: "browserLiveReloading",
            type: Object,
            isUndefinedForbidden: false,
            mustTransformNullToUndefined: true,
            properties: BrowserLiveReloadingSettings__FromFile__RawValid.propertiesSpecification
          },

          $outputPackageJSON_Generating: {
            newName: "outputPackageJSON_Generating",
            type: Object,
            isUndefinedForbidden: false,
            mustTransformNullToUndefined: true,
            properties: OutputPackageJSON_GeneratingSettings__FromFile__RawValid.propertiesSpecification
          }

        }

      }

    }

  };

}


export default ProjectBuildingConfig__FromFile__RawValid;
