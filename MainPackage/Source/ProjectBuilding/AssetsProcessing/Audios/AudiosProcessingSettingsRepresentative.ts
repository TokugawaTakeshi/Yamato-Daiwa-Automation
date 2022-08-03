/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type AudiosProcessingSettings__Normalized from "@AudiosProcessing/AudiosProcessingSettings__Normalized";
import ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";
import AssetsGroupID = ProjectBuildingConfig__Normalized.AssetsGroupID;

/* --- Settings representatives ------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import AssetsProcessingSettingsRepresentative from
    "@ProjectBuilding/Common/SettingsRepresentatives/AssetsProcessingSettingsRepresentative";


export default class AudiosProcessingSettingsRepresentative extends AssetsProcessingSettingsRepresentative<
  AudiosProcessingSettings__Normalized.Common, AudiosProcessingSettings__Normalized.AssetsGroup
> {

  public readonly TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM: string = "Audio";
  public readonly TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM: string = "Audios";
  public readonly relevantSourceFilesGlobSelectors: Array<string>;

  protected readonly assetsProcessingCommonSettings: AudiosProcessingSettings__Normalized.Common;
  protected readonly actualAssetsGroupsSettings: Map<AssetsGroupID, AudiosProcessingSettings__Normalized.AssetsGroup>;


  public constructor(
    audiosManagementSettings: AudiosProcessingSettings__Normalized,
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ) {

    super(masterConfigRepresentative);

    this.assetsProcessingCommonSettings = audiosManagementSettings.common;
    this.actualAssetsGroupsSettings = audiosManagementSettings.assetsGroups;

    this.relevantSourceFilesGlobSelectors = Array.from(this.actualAssetsGroupsSettings.values()).map(
        (imagesGroupSettings: AudiosProcessingSettings__Normalized.AssetsGroup): string =>
            imagesGroupSettings.sourceFilesGlobSelector
    );
  }
}
