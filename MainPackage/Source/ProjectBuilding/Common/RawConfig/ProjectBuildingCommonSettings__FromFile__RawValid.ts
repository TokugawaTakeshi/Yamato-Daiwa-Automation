/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import ConsumingProjectBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";

/* ─── Raw Valid Configuration ────────────────────────────────────────────────────────────────────────────────────── */
import type { ProjectBuildingTasksIDsForConfigFile__Localized } from
    "@ProjectBuilding:Common/RawConfig/Enumerations/ProjectBuildingTasksIDsForConfigFile";
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

  export function getLocalizedPropertiesSpecification(
    {
      projectBuildingCommonSettingsLocalization,
      tasksLocalizedIDs
    }: Readonly<{
      projectBuildingCommonSettingsLocalization: Localization;
      tasksLocalizedIDs: ProjectBuildingTasksIDsForConfigFile__Localized;
    }>
  ): RawObjectDataProcessor.PropertiesSpecification {

    return {

      [projectBuildingCommonSettingsLocalization.selectiveExecutions.KEY]: {

        newName: "selectiveExecutions",
        preValidationModifications: nullToUndefined,
        type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
        required: false,

        value: {

          type: Object,
          properties: {

            [projectBuildingCommonSettingsLocalization.selectiveExecutions.tasksAndSourceFilesSelection.KEY]: {

              newName: "tasksAndSourceFilesSelection",
              type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
              required: true,

              allowedKeys: Object.values(tasksLocalizedIDs),
              keysRenamings: {
                [tasksLocalizedIDs.markupProcessing]: ProjectBuildingTasksIDsForConfigFile.markupProcessing,
                [tasksLocalizedIDs.stylesProcessing]: ProjectBuildingTasksIDsForConfigFile.stylesProcessing,
                [tasksLocalizedIDs.ECMA_ScriptLogicProcessing]: ProjectBuildingTasksIDsForConfigFile.
                    ECMA_ScriptLogicProcessing,
                [tasksLocalizedIDs.imagesProcessing]: ProjectBuildingTasksIDsForConfigFile.imagesProcessing,
                [tasksLocalizedIDs.fontsProcessing]: ProjectBuildingTasksIDsForConfigFile.fontsProcessing,
                [tasksLocalizedIDs.audiosProcessing]: ProjectBuildingTasksIDsForConfigFile.audiosProcessing,
                [tasksLocalizedIDs.videosProcessing]: ProjectBuildingTasksIDsForConfigFile.videosProcessing,
                [tasksLocalizedIDs.plainCopying]: ProjectBuildingTasksIDsForConfigFile.plainCopying,
                [tasksLocalizedIDs.browserLiveReloading]: ProjectBuildingTasksIDsForConfigFile.browserLiveReloading
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

            [projectBuildingCommonSettingsLocalization.selectiveExecutions.browserLiveReloadingSetupID.KEY]: {
              newName: "browserLiveReloadingSetupID",
              type: String,
              required: false
            },

            [projectBuildingCommonSettingsLocalization.selectiveExecutions.outputPackageJSON_Generating.KEY]: {
              newName: "outputPackageJSON_Generating",
              type: Boolean,
              required: false
            }

          }
        }

      },

      [projectBuildingCommonSettingsLocalization.publicDirectoriesRelativePaths.KEY]: {
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

}


export default ProjectBuildingCommonSettings__FromFile__RawValid;
