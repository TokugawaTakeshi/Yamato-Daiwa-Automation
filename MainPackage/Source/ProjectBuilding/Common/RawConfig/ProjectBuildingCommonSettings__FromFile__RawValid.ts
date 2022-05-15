/* --- Raw valid config ---------------------------------------------------------------------------------------------- */
import type { ProjectBuildingTasksIDsForConfigFile__Localized } from
    "@ProjectBuilding:Common/RawConfig/Enumerations/ProjectBuildingTasksIDsForConfigFile";
import { ProjectBuildingTasksIDsForConfigFile } from
    "@ProjectBuilding:Common/RawConfig/Enumerations/ProjectBuildingTasksIDsForConfigFile";

/* --- General auxiliaries ------------------------------------------------------------------------------------------ */
import { RawObjectDataProcessor, nullToUndefined } from "@yamato-daiwa/es-extensions";


type ProjectBuildingCommonSettings__FromFile__RawValid = {
  readonly selectiveExecutions?: ProjectBuildingCommonSettings__FromFile__RawValid.SelectiveExecutions;
  readonly publicDirectoriesRelativePaths?: { [projectBuildingMode__possiblyCustom: string ]: string | undefined; };
};


/* eslint-disable-next-line @typescript-eslint/no-redeclare --
 * The merging of type/interface and namespace is completely valid TypeScript,
 * but @typescript-eslint community does not wish to support it.
 * https://github.com/eslint/eslint/issues/15504 */
namespace ProjectBuildingCommonSettings__FromFile__RawValid {

  /* === Types ====================================================================================================== */
  export type SelectiveExecutions = { [selectiveExecutionID: string]: SelectiveExecution | undefined; };

  export type SelectiveExecution = {
    readonly tasksAndSourceFilesSelection: ProjectBuilderTasksAndSourceFilesSelection;
    readonly browserLiveReloadingSetupID?: string;
  };

  type ProjectBuilderTasksAndSourceFilesSelection = {
    [ProjectBuildingTasksIDsForConfigFile.markupProcessing]?: Array<string>;
    [ProjectBuildingTasksIDsForConfigFile.stylesProcessing]?: Array<string>;
    [ProjectBuildingTasksIDsForConfigFile.ECMA_ScriptLogicProcessing]?: Array<string>;
    [ProjectBuildingTasksIDsForConfigFile.imagesProcessing]?: Array<string>;
    [ProjectBuildingTasksIDsForConfigFile.fontsProcessing]?: Array<string>;
    [ProjectBuildingTasksIDsForConfigFile.audiosProcessing]?: Array<string>;
    [ProjectBuildingTasksIDsForConfigFile.videosProcessing]?: Array<string>;
  };


  /* === Localization =============================================================================================== */
  export type Localization = {
    readonly selectiveExecutions: {
      readonly KEY: string;
      readonly tasksAndSourceFilesSelection: { readonly KEY: string; };
      readonly browserLiveReloadingSetupID: { readonly KEY: string; };
    };
    readonly publicDirectoriesRelativePaths: { readonly KEY: string; };
  };

  export function getLocalizedPropertiesSpecification(
    {
      projectBuildingCommonSettingsLocalization,
      tasksLocalizedIDs
    }: {
      projectBuildingCommonSettingsLocalization: Localization;
      tasksLocalizedIDs: ProjectBuildingTasksIDsForConfigFile__Localized;
    }
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
            }
          }
        }
      }
    };
  }
}


export default ProjectBuildingCommonSettings__FromFile__RawValid;
