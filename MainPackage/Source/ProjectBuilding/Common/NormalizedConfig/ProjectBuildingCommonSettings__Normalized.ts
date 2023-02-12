import type ConsumingProjectPreDefinedBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectPreDefinedBuildingModes";

import type ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";
import type PlainCopyingSettings__Normalized from "@ProjectBuilding/PlainCopying/PlainCopyingSettings__Normalized";


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
    markupProcessing?: ReadonlyArray<ProjectBuildingConfig__Normalized.EntryPointsGroupID>;
    stylesProcessing?: ReadonlyArray<ProjectBuildingConfig__Normalized.EntryPointsGroupID>;
    ECMA_ScriptLogicProcessing?: ReadonlyArray<ProjectBuildingConfig__Normalized.EntryPointsGroupID>;
    imagesProcessing?: ReadonlyArray<ProjectBuildingConfig__Normalized.AssetsGroupID>;
    fontsProcessing?: ReadonlyArray<ProjectBuildingConfig__Normalized.AssetsGroupID>;
    audiosProcessing?: ReadonlyArray<ProjectBuildingConfig__Normalized.AssetsGroupID>;
    videosProcessing?: ReadonlyArray<ProjectBuildingConfig__Normalized.AssetsGroupID>;
    plainCopying?: ReadonlyArray<PlainCopyingSettings__Normalized.FilesGroup.ID>;
  }>;
}


export default ProjectBuildingCommonSettings__Normalized;
