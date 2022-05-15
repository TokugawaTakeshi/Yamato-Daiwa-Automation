import type ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";


type ProjectBuildingCommonSettings__Normalized = {
  readonly projectRootDirectoryAbsolutePath: string;
  readonly projectBuildingMode: string;
  readonly tasksAndSourceFilesSelection?: ProjectBuildingCommonSettings__Normalized.TasksAndSourceFilesSelection;
  readonly browserLiveReloadingSetupID?: string;
  readonly actualPublicDirectoryAbsolutePath?: string;
};

/* eslint-disable-next-line @typescript-eslint/no-redeclare --
 * The merging of type/interface and namespace is completely valid TypeScript,
 * but @typescript-eslint community does not wish to support it.
 * https://github.com/eslint/eslint/issues/15504 */
namespace ProjectBuildingCommonSettings__Normalized {
  export type TasksAndSourceFilesSelection = {
    readonly markupProcessing?: Array<ProjectBuildingConfig__Normalized.EntryPointsGroupID>;
    readonly stylesProcessing?: Array<ProjectBuildingConfig__Normalized.EntryPointsGroupID>;
    readonly ECMA_ScriptLogicProcessing?: Array<ProjectBuildingConfig__Normalized.EntryPointsGroupID>;
    readonly imagesProcessing?: Array<ProjectBuildingConfig__Normalized.AssetsGroupID>;
    readonly fontsProcessing?: Array<ProjectBuildingConfig__Normalized.AssetsGroupID>;
    readonly audiosProcessing?: Array<ProjectBuildingConfig__Normalized.AssetsGroupID>;
    readonly videosProcessing?: Array<ProjectBuildingConfig__Normalized.AssetsGroupID>;
  };
}


export default ProjectBuildingCommonSettings__Normalized;
