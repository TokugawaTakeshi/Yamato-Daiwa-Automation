import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";

/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";

/* --- Utils -------------------------------------------------------------------------------------------------------- */
import ImprovedGlob from "@UtilsIncubator/ImprovedGlob";


export default abstract class SourceCodeProcessingConfigRepresentative<
  SourceCodeProcessingCommonNormalizedSettings extends ProjectBuildingConfig__Normalized.
      SourceCodeProcessingCommonSettingsGenericProperties,
  EntryPointsGroupNormalizedSettings extends ProjectBuildingConfig__Normalized.EntryPointsGroupGenericSettings
> {

  public abstract readonly supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: Array<string>;
  public abstract readonly TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM: string;

  public abstract readonly relevantEntryPointsGroupsSettings: Map<
    ProjectBuildingConfig__Normalized.EntryPointsGroupID, EntryPointsGroupNormalizedSettings
  >;
  protected abstract readonly sourceCodeProcessingCommonSettings: SourceCodeProcessingCommonNormalizedSettings;

  protected masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;


  public constructor(masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative) {
    this.masterConfigRepresentative = masterConfigRepresentative;
  }


  public getEntryPointsGroupSettingsByID(
    entryPointsGroupID: ProjectBuildingConfig__Normalized.EntryPointsGroupID
  ): EntryPointsGroupNormalizedSettings | undefined {
    return this.relevantEntryPointsGroupsSettings.get(entryPointsGroupID);
  }


  public get actualOutputFilesGlobSelectors(): Array<string> {
    return Array.from(this.relevantEntryPointsGroupsSettings.values()).map(
      (entryPointsGroupNormalizedSettings: EntryPointsGroupNormalizedSettings): string =>
        ImprovedGlob.buildAllFilesInCurrentDirectoryAndBelowGlobSelector({
          basicDirectoryPath: entryPointsGroupNormalizedSettings.
              outputFilesTopDirectoryAbsolutePath,
          fileNamesExtensions: this.sourceCodeProcessingCommonSettings.supportedOutputFileNameExtensionsWithoutLeadingDots
      })
    );
  }
}
