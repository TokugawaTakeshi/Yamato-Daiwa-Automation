/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type ImagesProcessingSettings__Normalized from "@ImagesProcessing/ImagesProcessingSettings__Normalized";
import ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";
import AssetsGroupID = ProjectBuildingConfig__Normalized.AssetsGroupID;

/* --- Settings representatives --------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import AssetsProcessingSettingsRepresentative from
    "@ProjectBuilding/Common/SettingsRepresentatives/AssetsProcessingSettingsRepresentative";


export default class ImagesProcessingSettingsRepresentative extends AssetsProcessingSettingsRepresentative<
  ImagesProcessingSettings__Normalized.Common, ImagesProcessingSettings__Normalized.AssetsGroup
> {

  public readonly TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM: string = "Image";
  public readonly TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM: string = "Images";

  protected readonly assetsProcessingCommonSettings: ImagesProcessingSettings__Normalized.Common;
  protected readonly actualAssetsGroupsSettings: Map<AssetsGroupID, ImagesProcessingSettings__Normalized.AssetsGroup>;


  public constructor(
    imagesManagementSettings: ImagesProcessingSettings__Normalized,
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ) {

    super(masterConfigRepresentative);

    this.assetsProcessingCommonSettings = imagesManagementSettings.common;
    this.actualAssetsGroupsSettings = imagesManagementSettings.assetsGroups;
  }
}
