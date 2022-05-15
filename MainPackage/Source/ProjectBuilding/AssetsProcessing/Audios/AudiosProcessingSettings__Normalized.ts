import type ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";


type AudiosProcessingSettings__Normalized = {
  readonly common: AudiosProcessingSettings__Normalized.Common;
  readonly assetsGroups: Map<ProjectBuildingConfig__Normalized.AssetsGroupID, AudiosProcessingSettings__Normalized.AssetsGroup>;
};


/* eslint-disable-next-line @typescript-eslint/no-redeclare --
 * The merging of type/interface and namespace is completely valid TypeScript,
 * but @typescript-eslint community does not wish to support it.
 * https://github.com/eslint/eslint/issues/15504 */
namespace AudiosProcessingSettings__Normalized {
  export type Common = ProjectBuildingConfig__Normalized.AssetsProcessingCommonSettingsGenericProperties;
  export type AssetsGroup = ProjectBuildingConfig__Normalized.AssetsGroupSettingsGenericProperties;
}


export default AudiosProcessingSettings__Normalized;
