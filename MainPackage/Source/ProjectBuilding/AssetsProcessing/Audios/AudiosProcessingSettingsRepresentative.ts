/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type AudiosProcessingSettings__Normalized from "@AudiosProcessing/AudiosProcessingSettings__Normalized";
import type AssetsProcessingSettingsGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/AssetsProcessingSettingsGenericProperties__Normalized";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import AssetsProcessingSettingsRepresentative from
    "@ProjectBuilding/Common/SettingsRepresentatives/AssetsProcessingSettingsRepresentative";


export default class AudiosProcessingSettingsRepresentative extends AssetsProcessingSettingsRepresentative<
  AudiosProcessingSettings__Normalized.Common, AudiosProcessingSettings__Normalized.AssetsGroup
> {

  public readonly relevantSourceFilesGlobSelectors: ReadonlyArray<string>;

  public readonly assetsProcessingCommonSettings: AudiosProcessingSettings__Normalized.Common;
  public readonly relevantAssetsGroupsSettingsMappedByGroupID: ReadonlyMap<
    AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup.ID,
    AudiosProcessingSettings__Normalized.AssetsGroup
  >;

  public readonly TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM: string = "Audio";
  public readonly TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM: string = "Audios";


  public constructor(
    audiosManagementSettings: AudiosProcessingSettings__Normalized,
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ) {

    super({
      assetsProcessingCommonSettings: audiosManagementSettings.common,
      projectBuildingMasterConfigRepresentative,
      loggingSettings: audiosManagementSettings.logging,
      relevantAssetsGroupsSettingsMappedByGroupID: audiosManagementSettings.assetsGroups
    });

    this.assetsProcessingCommonSettings = audiosManagementSettings.common;
    this.relevantAssetsGroupsSettingsMappedByGroupID = audiosManagementSettings.assetsGroups;

    this.relevantSourceFilesGlobSelectors = Array.from(this.relevantAssetsGroupsSettingsMappedByGroupID.values()).map(
        (audiosGroupSettings: AudiosProcessingSettings__Normalized.AssetsGroup): string =>
            audiosGroupSettings.sourceFilesGlobSelector
    );

  }

}
