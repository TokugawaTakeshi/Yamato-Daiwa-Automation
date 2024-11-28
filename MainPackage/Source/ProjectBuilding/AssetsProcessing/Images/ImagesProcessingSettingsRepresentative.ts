/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type ImagesProcessingSettings__Normalized from "@ImagesProcessing/ImagesProcessingSettings__Normalized";
import type AssetsProcessingSettingsGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/AssetsProcessingSettingsGenericProperties__Normalized";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import AssetsProcessingSettingsRepresentative from
    "@ProjectBuilding/Common/SettingsRepresentatives/AssetsProcessingSettingsRepresentative";


export default class ImagesProcessingSettingsRepresentative extends AssetsProcessingSettingsRepresentative<
  ImagesProcessingSettings__Normalized.Common, ImagesProcessingSettings__Normalized.AssetsGroup
> {

  public readonly relevantSourceFilesGlobSelectors: ReadonlyArray<string>;

  public readonly assetsProcessingCommonSettings: ImagesProcessingSettings__Normalized.Common;
  public readonly relevantAssetsGroupsSettingsMappedByGroupID: ReadonlyMap<
    AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup.ID,
    ImagesProcessingSettings__Normalized.AssetsGroup
  >;

  public readonly TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM: string = "image";
  public readonly TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM: string = "images";


  public constructor(
    imagesManagementSettings: ImagesProcessingSettings__Normalized,
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ) {

    super({
      assetsProcessingCommonSettings: imagesManagementSettings.common,
      projectBuildingMasterConfigRepresentative,
      loggingSettings: imagesManagementSettings.logging,
      relevantAssetsGroupsSettingsMappedByGroupID: imagesManagementSettings.assetsGroups
    });

    this.assetsProcessingCommonSettings = imagesManagementSettings.common;
    this.relevantAssetsGroupsSettingsMappedByGroupID = imagesManagementSettings.assetsGroups;

    this.relevantSourceFilesGlobSelectors = Array.from(this.relevantAssetsGroupsSettingsMappedByGroupID.values()).map(
      (imagesGroupSettings: ImagesProcessingSettings__Normalized.AssetsGroup): string =>
          imagesGroupSettings.sourceFilesGlobSelector
    );

  }

}
