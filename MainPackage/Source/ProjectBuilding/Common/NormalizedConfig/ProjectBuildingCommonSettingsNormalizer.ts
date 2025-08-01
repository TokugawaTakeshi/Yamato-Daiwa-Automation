/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import ConsumingProjectBuildingModes from "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";
import mustProvideIncrementalProjectBuilding from
    "@ProjectBuilding/Common/Restrictions/mustProvideIncrementalProjectBuilding";
import FilesWatchingRestrictions from "@ProjectBuilding/FilesWatching/FilesWatchingRestrictions";

/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import { ProjectBuildingTasksIDsForConfigFile } from
    "@ProjectBuilding:Common/RawConfig/Enumerations/ProjectBuildingTasksIDsForConfigFile";
import type ProjectBuildingCommonSettings__FromFile__RawValid from
    "@ProjectBuilding:Common/RawConfig/ProjectBuildingCommonSettings__FromFile__RawValid";

/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding:Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import { isNotUndefined } from "@yamato-daiwa/es-extensions";
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


export default abstract class ProjectBuildingCommonSettingsNormalizer {

  public static normalize(
    {
      commonSettings__fromFile__rawValid,
      consumingProjectRootDirectoryAbsolutePath,
      projectBuildingMode,
      actualSelectiveExecutionID,
      actualSelectiveExecution
    }: Readonly<{
      commonSettings__fromFile__rawValid: ProjectBuildingCommonSettings__FromFile__RawValid;
      consumingProjectRootDirectoryAbsolutePath: string;
      projectBuildingMode: ConsumingProjectBuildingModes;
      actualSelectiveExecutionID?: string;
      actualSelectiveExecution?: ProjectBuildingCommonSettings__FromFile__RawValid.SelectiveExecution;
    }>
  ): ProjectBuildingCommonSettings__Normalized {

    const consumingProjectRootDirectoryAbsolutePath__forwardSlashes: string = ImprovedPath.
        replacePathSeparatorsToForwardSlashes(consumingProjectRootDirectoryAbsolutePath);

    const actualPublicDirectoryRelativePath: string | undefined =
        commonSettings__fromFile__rawValid.publicDirectoriesRelativePaths?.[projectBuildingMode];

    let actualPublicDirectoryAbsolutePath: string | undefined;

    if (isNotUndefined(actualPublicDirectoryRelativePath)) {
      actualPublicDirectoryAbsolutePath = ImprovedPath.joinPathSegments(
        [ consumingProjectRootDirectoryAbsolutePath__forwardSlashes, actualPublicDirectoryRelativePath ],
        { alwaysForwardSlashSeparators: true }
      );
    }

    const filesWatchingSettings__fromFile__rawValid:
        ProjectBuildingCommonSettings__FromFile__RawValid.FilesWatching | undefined =
            commonSettings__fromFile__rawValid.filesWatching;

    return {

      projectRootDirectoryAbsolutePath: consumingProjectRootDirectoryAbsolutePath__forwardSlashes,

      projectBuildingMode,

      mustProvideIncrementalBuilding: mustProvideIncrementalProjectBuilding(projectBuildingMode),

      ...isNotUndefined(actualSelectiveExecutionID) ? { selectiveExecutionID: actualSelectiveExecutionID } : null,

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

          plainCopying: actualSelectiveExecution.
              tasksAndSourceFilesSelection[ProjectBuildingTasksIDsForConfigFile.plainCopying],

          videosProcessing: actualSelectiveExecution.
              tasksAndSourceFilesSelection[ProjectBuildingTasksIDsForConfigFile.videosProcessing]

        }

      } : null,

      browserLiveReloadingSetupID: actualSelectiveExecution?.browserLiveReloadingSetupID,

      mustGenerateOutputPackageJSON: actualSelectiveExecution?.distributablePackageJSON_Generating === true,

      dockerSetupID: actualSelectiveExecution?.dockerSetupID,

      actualPublicDirectoryAbsolutePath,

      filesWatching: {

        excludedFilesGlobSelectors: new Set(
          [

            ...FilesWatchingRestrictions.relativePathsOfExcludeFiles,
            ...filesWatchingSettings__fromFile__rawValid?.relativePathsOfExcludedFiles ?? [],

            /* eslint-disable-next-line @stylistic/no-extra-parens -- For squared layout */
            ...(
              projectBuildingMode === ConsumingProjectBuildingModes.staticPreview ||
              projectBuildingMode === ConsumingProjectBuildingModes.localDevelopment
            ) ?
              filesWatchingSettings__fromFile__rawValid?.buildingModeDependent?.[projectBuildingMode].
                  relativePathsOfExcludedFiles ??
                [] :
              []
          ].
              map(
                (fileRelativePath: string): string =>

                    /* [ Theory ] In this case the Glob even with a directory absolute path is fine. */
                    ImprovedPath.joinPathSegments(
                      [ consumingProjectRootDirectoryAbsolutePath, fileRelativePath ],
                      { alwaysForwardSlashSeparators: true }
                    )

              )

        ),

        excludedDirectoriesGlobSelectors: new Set(
          [

            ...FilesWatchingRestrictions.relativePathsOfExcludeDirectories,
            ...filesWatchingSettings__fromFile__rawValid?.relativePathsOfExcludeDirectories ?? [],

            /* eslint-disable-next-line @stylistic/no-extra-parens -- For squared layout */
            ...(
              projectBuildingMode === ConsumingProjectBuildingModes.staticPreview ||
              projectBuildingMode === ConsumingProjectBuildingModes.localDevelopment
            ) ?
              filesWatchingSettings__fromFile__rawValid?.buildingModeDependent?.[projectBuildingMode].
                  relativePathsOfExcludeDirectories ??
                [] :
              []

          ].
              map(
                (directoryRelativePath: string): string =>

                    /* [ Theory ] In this case the Glob even with a directory absolute path is fine. */
                    ImprovedPath.joinPathSegments(
                      [ consumingProjectRootDirectoryAbsolutePath, directoryRelativePath ],
                      { alwaysForwardSlashSeparators: true }
                    )

              )
        )

      }

    };

  }

}
