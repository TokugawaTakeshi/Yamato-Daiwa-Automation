/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type FontsProcessingSettings__Normalized from "@FontsProcessing/FontsProcessingSettings__Normalized";
import ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";
import AssetsGroupID = ProjectBuildingConfig__Normalized.AssetsGroupID;

/* --- Settings representatives --------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import AssetsProcessingSettingsRepresentative from
    "@ProjectBuilding/Common/SettingsRepresentatives/AssetsProcessingSettingsRepresentative";


export default class FontsProcessingSettingsRepresentative extends AssetsProcessingSettingsRepresentative<
  FontsProcessingSettings__Normalized.Common, FontsProcessingSettings__Normalized.AssetsGroup
> {

  public readonly TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM: string = "Font";
  public readonly TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM: string = "Fonts";
  public readonly relevantSourceFilesGlobSelectors: Array<string>;

  protected readonly assetsProcessingCommonSettings: FontsProcessingSettings__Normalized.Common;
  protected readonly actualAssetsGroupsSettings: Map<AssetsGroupID, FontsProcessingSettings__Normalized.AssetsGroup>;


  public constructor(
    imagesManagementSettings: FontsProcessingSettings__Normalized,
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ) {

    super(masterConfigRepresentative);

    this.assetsProcessingCommonSettings = imagesManagementSettings.common;
    this.actualAssetsGroupsSettings = imagesManagementSettings.assetsGroups;

    this.relevantSourceFilesGlobSelectors = Array.from(this.actualAssetsGroupsSettings.values()).map(
        (imagesGroupSettings: FontsProcessingSettings__Normalized.AssetsGroup): string =>
            imagesGroupSettings.sourceFilesGlobSelector
    );
  }
}
