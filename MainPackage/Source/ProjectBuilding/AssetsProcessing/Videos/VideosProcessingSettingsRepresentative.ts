/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type VideosProcessingSettings__Normalized from "@VideosProcessing/VideosProcessingSettings__Normalized";
import type AssetsProcessingSettingsGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/AssetsProcessingSettingsGenericProperties__Normalized";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import AssetsProcessingSettingsRepresentative from
    "@ProjectBuilding/Common/SettingsRepresentatives/AssetsProcessingSettingsRepresentative";


export default class VideosProcessingSettingsRepresentative extends AssetsProcessingSettingsRepresentative<
  VideosProcessingSettings__Normalized.Common, VideosProcessingSettings__Normalized.AssetsGroup
> {

  public readonly relevantSourceFilesGlobSelectors: ReadonlyArray<string>;

  public readonly assetsProcessingCommonSettings: VideosProcessingSettings__Normalized.Common;
  public readonly relevantAssetsGroupsSettingsMappedByGroupID: ReadonlyMap<
    AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup.ID,
    VideosProcessingSettings__Normalized.AssetsGroup
  >;

  public readonly TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM: string = "Video";
  public readonly TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM: string = "Videos";


  public constructor(
    videosManagementSettings: VideosProcessingSettings__Normalized,
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ) {

    super({
      assetsProcessingCommonSettings: videosManagementSettings.common,
      projectBuildingMasterConfigRepresentative,
      loggingSettings: videosManagementSettings.logging,
      relevantAssetsGroupsSettingsMappedByGroupID: videosManagementSettings.assetsGroups
    });

    this.assetsProcessingCommonSettings = videosManagementSettings.common;
    this.relevantAssetsGroupsSettingsMappedByGroupID = videosManagementSettings.assetsGroups;

    this.relevantSourceFilesGlobSelectors = Array.from(this.relevantAssetsGroupsSettingsMappedByGroupID.values()).map(
      (videosGroupSettings: VideosProcessingSettings__Normalized.AssetsGroup): string =>
          videosGroupSettings.sourceFilesGlobSelector
    );

  }

}
