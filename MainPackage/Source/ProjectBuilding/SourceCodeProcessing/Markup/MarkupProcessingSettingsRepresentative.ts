/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type MarkupProcessingSettings__Normalized from "@MarkupProcessing/MarkupProcessingSettings__Normalized";
import type ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";

/* --- Settings representatives ------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import GulpStreamBasedSourceCodeProcessingConfigRepresentative from
    "@ProjectBuilding/Common/SettingsRepresentatives/GulpStreamBasedSourceCodeProcessingConfigRepresentative";


export default class MarkupProcessingSettingsRepresentative extends GulpStreamBasedSourceCodeProcessingConfigRepresentative<
  MarkupProcessingSettings__Normalized.Common, MarkupProcessingSettings__Normalized.EntryPointsGroup
> {

  public readonly supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: Array<string>;
  public readonly TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM: string = "Markup";
  public readonly TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM: string = "Markup";
  public readonly prefixOfEntryPointsGroupReference: string = "@";

  public readonly waitingForTheOtherFilesWillBeSavedPeriod__seconds: number;
  public readonly entryPointsGroupsNormalizedSettingsMappedByReferences: Map<
    string, MarkupProcessingSettings__Normalized.EntryPointsGroup
  >;

  public readonly sourceCodeLintingCommonSettings: MarkupProcessingSettings__Normalized.Linting;
  public readonly sourceAndOutputFilesAbsolutePathsCorrespondenceMap: Map<string, string> = new Map<string, string>();

  public readonly relevantEntryPointsGroupsSettings: Map<
    ProjectBuildingConfig__Normalized.EntryPointsGroupID, MarkupProcessingSettings__Normalized.EntryPointsGroup
  >;

  protected readonly sourceCodeProcessingCommonSettings: MarkupProcessingSettings__Normalized.Common;


  public constructor(
    normalizedMarkupProcessingSettings: MarkupProcessingSettings__Normalized,
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ) {

    super(projectBuildingMasterConfigRepresentative);

    this.sourceCodeProcessingCommonSettings = normalizedMarkupProcessingSettings.common;
    this.sourceCodeLintingCommonSettings = normalizedMarkupProcessingSettings.linting;
    this.relevantEntryPointsGroupsSettings = normalizedMarkupProcessingSettings.relevantEntryPointsGroups;

    this.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots = normalizedMarkupProcessingSettings.common.
        supportedSourceFileNameExtensionsWithoutLeadingDots;
    this.waitingForTheOtherFilesWillBeSavedPeriod__seconds = normalizedMarkupProcessingSettings.common.
        waitingForSubsequentFilesWillBeSavedPeriod__seconds;

    this.entryPointsGroupsNormalizedSettingsMappedByReferences = new Map<
      string, MarkupProcessingSettings__Normalized.EntryPointsGroup
    >(
      Array.from(this.relevantEntryPointsGroupsSettings.values()).map(
        (entryPointsGroupSettings: MarkupProcessingSettings__Normalized.EntryPointsGroup):
            [string, MarkupProcessingSettings__Normalized.EntryPointsGroup] =>
                [
                  `${ this.prefixOfEntryPointsGroupReference }${ entryPointsGroupSettings.ID }`,
                  entryPointsGroupSettings
                ]
      )
    );

    super.initializeOrUpdatePartialFilesAndEntryPointsRelationsMap();
  }
}
