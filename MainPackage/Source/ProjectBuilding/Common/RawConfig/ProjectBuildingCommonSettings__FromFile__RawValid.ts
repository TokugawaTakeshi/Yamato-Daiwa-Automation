/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import ConsumingProjectBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";

/* ─── Raw Valid Configuration ────────────────────────────────────────────────────────────────────────────────────── */
import { ProjectBuildingTasksIDsForConfigFile } from
    "@ProjectBuilding:Common/RawConfig/Enumerations/ProjectBuildingTasksIDsForConfigFile";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import { RawObjectDataProcessor, nullToUndefined } from "@yamato-daiwa/es-extensions";


type ProjectBuildingCommonSettings__FromFile__RawValid = Readonly<{
  selectiveExecutions?: ProjectBuildingCommonSettings__FromFile__RawValid.SelectiveExecutions;
  publicDirectoriesRelativePaths?: Readonly<{ [projectBuildingMode: string]: string | undefined; }>;
}>;


namespace ProjectBuildingCommonSettings__FromFile__RawValid {

  export type SelectiveExecutions = Readonly<{ [selectiveExecutionID: string]: SelectiveExecution | undefined; }>;

  export type SelectiveExecution = Readonly<{
    tasksAndSourceFilesSelection: ProjectBuilderTasksAndSourceFilesSelection;
    browserLiveReloadingSetupID?: string;
    outputPackageJSON_Generating?: boolean;
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


  /* ━━━ Localization ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type Localization = Readonly<{
    selectiveExecutions: Readonly<{
      KEY: string;
      tasksAndSourceFilesSelection: Readonly<{ KEY: string; }>;
      browserLiveReloadingSetupID: Readonly<{ KEY: string; }>;
      outputPackageJSON_Generating: Readonly<{ KEY: string; }>;
    }>;
    publicDirectoriesRelativePaths: Readonly<{ KEY: string; }>;
  }>;

  export const propertiesSpecification: RawObjectDataProcessor.PropertiesSpecification = {

    $selectiveExecutions: {

      newName: "selectiveExecutions",
      preValidationModifications: nullToUndefined,
      type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
      required: false,
      minimalEntriesCount: 1,

      value: {

        type: Object,
        properties: {

          $tasksAndSourceFilesSelection: {

            newName: "tasksAndSourceFilesSelection",
            type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
            required: true,

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

              element: {
                type: String,
                minimalCharactersCount: 1
              }

            }

          },

          $browserLiveReloadingSetupID: {
            newName: "browserLiveReloadingSetupID",
            type: String,
            required: false
          },

          $distributablePackageJSON_Generating: {
            newName: "distributablePackageJSON_Generating",
            type: Boolean,
            required: false
          }

        }
      }

    },

    $publicDirectoriesRelativePaths: {

      newName: "publicDirectoriesRelativePaths",
      type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
      required: false,
      allowedKeys: Object.values(ConsumingProjectBuildingModes),
      value: {
        type: String,
        minimalCharactersCount: 1
      }
    }

  };

}


export default ProjectBuildingCommonSettings__FromFile__RawValid;
