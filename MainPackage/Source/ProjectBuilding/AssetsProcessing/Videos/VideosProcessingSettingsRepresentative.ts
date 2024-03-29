/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type VideosProcessingSettings__Normalized from "@VideosProcessing/VideosProcessingSettings__Normalized";
import ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";
import AssetsGroupID = ProjectBuildingConfig__Normalized.AssetsGroupID;

/* --- Settings representatives ------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import AssetsProcessingSettingsRepresentative from
    "@ProjectBuilding/Common/SettingsRepresentatives/AssetsProcessingSettingsRepresentative";


export default class VideosProcessingSettingsRepresentative extends AssetsProcessingSettingsRepresentative<
  VideosProcessingSettings__Normalized.Common, VideosProcessingSettings__Normalized.AssetsGroup
> {

  public readonly TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM: string = "Video";
  public readonly TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM: string = "Videos";
  public readonly relevantSourceFilesGlobSelectors: Array<string>;

  protected readonly assetsProcessingCommonSettings: VideosProcessingSettings__Normalized.Common;
  protected readonly actualAssetsGroupsSettings: Map<AssetsGroupID, VideosProcessingSettings__Normalized.AssetsGroup>;


  public constructor(
    videosManagementSettings: VideosProcessingSettings__Normalized,
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ) {

    super(masterConfigRepresentative);

    this.assetsProcessingCommonSettings = videosManagementSettings.common;
    this.actualAssetsGroupsSettings = videosManagementSettings.assetsGroups;

    this.relevantSourceFilesGlobSelectors = Array.from(this.actualAssetsGroupsSettings.values()).map(
      (imagesGroupSettings: VideosProcessingSettings__Normalized.AssetsGroup): string =>
          imagesGroupSettings.sourceFilesGlobSelector
    );
  }
}
