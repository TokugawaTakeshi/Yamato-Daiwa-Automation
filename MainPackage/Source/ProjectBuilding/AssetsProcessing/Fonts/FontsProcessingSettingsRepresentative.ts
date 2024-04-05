/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type FontsProcessingSettings__Normalized from "@FontsProcessing/FontsProcessingSettings__Normalized";
import type AssetsProcessingSettingsGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/AssetsProcessingSettingsGenericProperties__Normalized";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import AssetsProcessingSettingsRepresentative from
    "@ProjectBuilding/Common/SettingsRepresentatives/AssetsProcessingSettingsRepresentative";


export default class FontsProcessingSettingsRepresentative extends AssetsProcessingSettingsRepresentative<
  FontsProcessingSettings__Normalized.Common, FontsProcessingSettings__Normalized.AssetsGroup
> {

  public readonly relevantSourceFilesGlobSelectors: ReadonlyArray<string>;

  public readonly assetsProcessingCommonSettings: FontsProcessingSettings__Normalized.Common;
  public readonly relevantAssetsGroupsSettingsMappedByGroupID: ReadonlyMap<
    AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup.ID,
    FontsProcessingSettings__Normalized.AssetsGroup
  >;

  public readonly TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM: string = "Font";
  public readonly TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM: string = "Fonts";


  public constructor(
    fontsManagementSettings: FontsProcessingSettings__Normalized,
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ) {

    super({
      assetsProcessingCommonSettings: fontsManagementSettings.common,
      projectBuildingMasterConfigRepresentative,
      loggingSettings: fontsManagementSettings.logging,
      relevantAssetsGroupsSettingsMappedByGroupID: fontsManagementSettings.assetsGroups
    });

    this.assetsProcessingCommonSettings = fontsManagementSettings.common;
    this.relevantAssetsGroupsSettingsMappedByGroupID = fontsManagementSettings.assetsGroups;

    this.relevantSourceFilesGlobSelectors = Array.from(this.relevantAssetsGroupsSettingsMappedByGroupID.values()).map(
        (fontsGroupSettings: FontsProcessingSettings__Normalized.AssetsGroup): string =>
            fontsGroupSettings.sourceFilesGlobSelector
    );

  }

}
