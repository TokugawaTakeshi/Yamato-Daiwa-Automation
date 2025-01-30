/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import ConsumingProjectBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";

/* ─── Raw Valid Configuration ────────────────────────────────────────────────────────────────────────────────────── */
import { ProjectBuildingTasksIDsForConfigFile } from
    "@ProjectBuilding:Common/RawConfig/Enumerations/ProjectBuildingTasksIDsForConfigFile";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import { RawObjectDataProcessor } from "@yamato-daiwa/es-extensions";


type ProjectBuildingCommonSettings__FromFile__RawValid = Readonly<{
  selectiveExecutions?: ProjectBuildingCommonSettings__FromFile__RawValid.SelectiveExecutions;
  publicDirectoriesRelativePaths?: Readonly<{ [projectBuildingMode: string]: string | undefined; }>;
}>;


namespace ProjectBuildingCommonSettings__FromFile__RawValid {

  export type SelectiveExecutions = Readonly<{ [selectiveExecutionID: string]: SelectiveExecution | undefined; }>;

  export type SelectiveExecution = Readonly<{
    tasksAndSourceFilesSelection: ProjectBuilderTasksAndSourceFilesSelection;
    browserLiveReloadingSetupID?: string;
    distributablePackageJSON_Generating?: boolean;
  }>;

  type ProjectBuilderTasksAndSourceFilesSelection = Readonly<{
    [ProjectBuildingTasksIDsForConfigFile.markupProcessing]?: ReadonlyArray<string>;
    [ProjectBuildingTasksIDsForConfigFile.stylesProcessing]?: ReadonlyArray<string>;
    [ProjectBuildingTasksIDsForConfigFile.ECMA_ScriptLogicProcessing]?: ReadonlyArray<string>;
    [ProjectBuildingTasksIDsForConfigFile.imagesProcessing]?: ReadonlyArray<string>;
    [ProjectBuildingTasksIDsForConfigFile.fontsProcessing]?: ReadonlyArray<string>;
    [ProjectBuildingTasksIDsForConfigFile.audiosProcessing]?: ReadonlyArray<string>;
    [ProjectBuildingTasksIDsForConfigFile.videosProcessing]?: ReadonlyArray<string>;
    [ProjectBuildingTasksIDsForConfigFile.plainCopying]?: ReadonlyArray<string>;
  }>;


  export const propertiesSpecification: RawObjectDataProcessor.PropertiesSpecification = {

    $selectiveExecutions: {

      newName: "selectiveExecutions",
      type: RawObjectDataProcessor.ValuesTypesIDs.associativeArray,
      isUndefinedForbidden: false,
      mustTransformNullToUndefined: true,
      areUndefinedTypeValuesForbidden: true,
      areNullTypeValuesForbidden: true,
      minimalEntriesCount: 1,

      value: {

        type: Object,
        properties: {

          $tasksAndSourceFilesSelection: {

            newName: "tasksAndSourceFilesSelection",
            type: RawObjectDataProcessor.ValuesTypesIDs.associativeArray,
            isUndefinedForbidden: true,
            isNullForbidden: true,
            areUndefinedTypeValuesForbidden: true,
            areNullTypeValuesForbidden: true,

            allowedKeys: [
              "$markupProcessing",
              "$stylesProcessing",
              "$ECMA_ScriptLogicProcessing",
              "$imagesProcessing",
              "$fontsProcessing",
              "$audiosProcessing",
              "$videosProcessing",
              "$plainCopying",
              "$browserLiveReloading"
            ],

            keysRenamings: {
              $markupProcessing: ProjectBuildingTasksIDsForConfigFile.markupProcessing,
              $stylesProcessing: ProjectBuildingTasksIDsForConfigFile.stylesProcessing,
              $ECMA_ScriptLogicProcessing: ProjectBuildingTasksIDsForConfigFile.ECMA_ScriptLogicProcessing,
              $imagesProcessing: ProjectBuildingTasksIDsForConfigFile.imagesProcessing,
              $fontsProcessing: ProjectBuildingTasksIDsForConfigFile.fontsProcessing,
              $audiosProcessing: ProjectBuildingTasksIDsForConfigFile.audiosProcessing,
              $videosProcessing: ProjectBuildingTasksIDsForConfigFile.videosProcessing,
              $plainCopying: ProjectBuildingTasksIDsForConfigFile.plainCopying,
              $browserLiveReloading: ProjectBuildingTasksIDsForConfigFile.browserLiveReloading
            },

            value: {

              type: Array,
              minimalElementsCount: 1,
              areUndefinedElementsForbidden: true,
              areNullElementsForbidden: true,

              element: {
                type: String,
                minimalCharactersCount: 1
              }

            }

          },

          $browserLiveReloadingSetupID: {
            newName: "browserLiveReloadingSetupID",
            type: String,
            isUndefinedForbidden: false,
            isNullForbidden: true
          },

          $distributablePackageJSON_Generating: {
            newName: "distributablePackageJSON_Generating",
            type: Boolean,
            isUndefinedForbidden: false,
            isNullForbidden: true
          }

        }
      }

    },

    $publicDirectoriesRelativePaths: {

      newName: "publicDirectoriesRelativePaths",
      type: RawObjectDataProcessor.ValuesTypesIDs.associativeArray,
      isUndefinedForbidden: false,
      mustTransformNullToUndefined: true,
      areUndefinedTypeValuesForbidden: true,
      areNullTypeValuesForbidden: true,

      allowedKeys: [
        "$localDevelopment",
        "$testing",
        "$staging",
        "$production"
      ],

      keysRenamings: {
        $localDevelopment: ConsumingProjectBuildingModes.localDevelopment,
        $testing: ConsumingProjectBuildingModes.testing,
        $staging: ConsumingProjectBuildingModes.staging,
        $production: ConsumingProjectBuildingModes.production
      },

      value: {
        type: String,
        minimalCharactersCount: 1
      }

    }

  };

}


export default ProjectBuildingCommonSettings__FromFile__RawValid;
