/* --- Business rules ----------------------------------------------------------------------------------------------- */
import { ProjectBuildingTasksIDsForConfigFile } from
    "@ProjectBuilding:Common/RawConfig/Enumerations/ProjectBuildingTasksIDsForConfigFile";

/* --- Raw valid config ---------------------------------------------------------------------------------------------- */
import type ProjectBuildingCommonSettings__FromFile__RawValid from
    "@ProjectBuilding:Common/RawConfig/ProjectBuildingCommonSettings__FromFile__RawValid";

/* --- Normalized config -------------------------------------------------------------------------------------------- */
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding:Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";

/* --- Utils -------------------------------------------------------------------------------------------------------- */
import { isNotUndefined } from "@yamato-daiwa/es-extensions";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";


export default abstract class ProjectBuildingCommonSettingsNormalizer {

  public static normalize(
    {
      commonSettings__fromFile__rawValid,
      consumingProjectRootDirectoryAbsolutePath,
      projectBuildingMode,
      actualSelectiveExecution
    }: {
      commonSettings__fromFile__rawValid: ProjectBuildingCommonSettings__FromFile__RawValid;
      consumingProjectRootDirectoryAbsolutePath: string;
      projectBuildingMode: string;
      actualSelectiveExecution?: ProjectBuildingCommonSettings__FromFile__RawValid.SelectiveExecution;
    }
  ): ProjectBuildingCommonSettings__Normalized {

    const consumingProjectRootDirectoryAbsolutePath__forwardSlashes: string = ImprovedPath.
        replacePathSeparatorsToForwardSlashes(consumingProjectRootDirectoryAbsolutePath);

    const actualPublicDirectoryRelativePath: string | undefined =
        commonSettings__fromFile__rawValid.publicDirectoriesRelativePaths?.[projectBuildingMode];

    let actualPublicDirectoryAbsolutePath: string | undefined;

    if (isNotUndefined(actualPublicDirectoryRelativePath)) {
      actualPublicDirectoryAbsolutePath = ImprovedPath.buildAbsolutePath(
        [ consumingProjectRootDirectoryAbsolutePath__forwardSlashes, actualPublicDirectoryRelativePath ],
        { forwardSlashOnlySeparators: true }
      );
    }


    return {

      projectRootDirectoryAbsolutePath: consumingProjectRootDirectoryAbsolutePath__forwardSlashes,

      projectBuildingMode,

      ...isNotUndefined(actualSelectiveExecution) ? {

        tasksAndSourceFilesSelection: {

          markupProcessing: actualSelectiveExecution.
              tasksAndSourceFilesSelection[ProjectBuildingTasksIDsForConfigFile.markupProcessing],

          stylesProcessing: actualSelectiveExecution.
              tasksAndSourceFilesSelection[ProjectBuildingTasksIDsForConfigFile.stylesProcessing],

          ECMA_ScriptLogicProcessing: actualSelectiveExecution.
              tasksAndSourceFilesSelection[ProjectBuildingTasksIDsForConfigFile.ECMA_ScriptLogicProcessing],

          imagesProcessing: actualSelectiveExecution.
              tasksAndSourceFilesSelection[ProjectBuildingTasksIDsForConfigFile.imagesProcessing],

          fontsProcessing: actualSelectiveExecution.
              tasksAndSourceFilesSelection[ProjectBuildingTasksIDsForConfigFile.fontsProcessing],

          audiosProcessing: actualSelectiveExecution.
              tasksAndSourceFilesSelection[ProjectBuildingTasksIDsForConfigFile.audiosProcessing],

          videosProcessing: actualSelectiveExecution.
              tasksAndSourceFilesSelection[ProjectBuildingTasksIDsForConfigFile.videosProcessing]
        }
      } : null,

      browserLiveReloadingSetupID: actualSelectiveExecution?.browserLiveReloadingSetupID,

      actualPublicDirectoryAbsolutePath
    };
  }
}
