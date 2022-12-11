import type ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";
import type ConsumingProjectPreDefinedBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectPreDefinedBuildingModes";


type ProjectBuildingCommonSettings__Normalized = Readonly<{
  projectRootDirectoryAbsolutePath: string;
  projectBuildingMode: ConsumingProjectPreDefinedBuildingModes;
  tasksAndSourceFilesSelection?: ProjectBuildingCommonSettings__Normalized.TasksAndSourceFilesSelection;
  browserLiveReloadingSetupID?: string;
  actualPublicDirectoryAbsolutePath?: string;
}>;

/* eslint-disable-next-line @typescript-eslint/no-redeclare --
 * The merging of type/interface and namespace is completely valid TypeScript,
 * but @typescript-eslint community does not wish to support it.
 * https://github.com/eslint/eslint/issues/15504 */
namespace ProjectBuildingCommonSettings__Normalized {
  export type TasksAndSourceFilesSelection = Readonly<{
    markupProcessing?: Array<ProjectBuildingConfig__Normalized.EntryPointsGroupID>;
    stylesProcessing?: Array<ProjectBuildingConfig__Normalized.EntryPointsGroupID>;
    ECMA_ScriptLogicProcessing?: Array<ProjectBuildingConfig__Normalized.EntryPointsGroupID>;
    imagesProcessing?: Array<ProjectBuildingConfig__Normalized.AssetsGroupID>;
    fontsProcessing?: Array<ProjectBuildingConfig__Normalized.AssetsGroupID>;
    audiosProcessing?: Array<ProjectBuildingConfig__Normalized.AssetsGroupID>;
    videosProcessing?: Array<ProjectBuildingConfig__Normalized.AssetsGroupID>;
  }>;
}


export default ProjectBuildingCommonSettings__Normalized;
