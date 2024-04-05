/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import type ConsumingProjectBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";

/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type SourceCodeProcessingGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/SourceCodeProcessingGenericProperties__Normalized";
import type AssetsProcessingSettingsGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/AssetsProcessingSettingsGenericProperties__Normalized";
import type PlainCopyingSettings__Normalized from "@ProjectBuilding/PlainCopying/PlainCopyingSettings__Normalized";


type ProjectBuildingCommonSettings__Normalized = Readonly<{
  projectRootDirectoryAbsolutePath: string;
  projectBuildingMode: ConsumingProjectBuildingModes;
  mustProvideIncrementalBuilding: boolean;
  selectiveExecutionID?: string;
  tasksAndSourceFilesSelection?: ProjectBuildingCommonSettings__Normalized.TasksAndSourceFilesSelection;
  browserLiveReloadingSetupID?: string;
  actualPublicDirectoryAbsolutePath?: string;
}>;


namespace ProjectBuildingCommonSettings__Normalized {
  export type TasksAndSourceFilesSelection = Readonly<{
    markupProcessing?: ReadonlyArray<SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup.ID>;
    stylesProcessing?: ReadonlyArray<SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup.ID>;
    ECMA_ScriptLogicProcessing?: ReadonlyArray<SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup.ID>;
    imagesProcessing?: ReadonlyArray<AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup.ID>;
    fontsProcessing?: ReadonlyArray<AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup.ID>;
    audiosProcessing?: ReadonlyArray<AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup.ID>;
    videosProcessing?: ReadonlyArray<AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup.ID>;
    plainCopying?: ReadonlyArray<PlainCopyingSettings__Normalized.FilesGroup.ID>;
  }>;
}


export default ProjectBuildingCommonSettings__Normalized;
