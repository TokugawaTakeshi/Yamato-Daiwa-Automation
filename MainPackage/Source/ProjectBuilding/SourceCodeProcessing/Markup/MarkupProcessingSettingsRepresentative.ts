/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type MarkupProcessingSettings__Normalized from
    "@MarkupProcessing/MarkupProcessingSettings__Normalized";
import type ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";

/* --- Settings representatives ------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import GulpStreamBasedSourceCodeProcessingConfigRepresentative from
    "@ProjectBuilding/Common/SettingsRepresentatives/GulpStreamBasedSourceCodeProcessingConfigRepresentative";

/* --- Utils -------------------------------------------------------------------------------------------------------- */
import { Logger } from "@yamato-daiwa/es-extensions";


export default class MarkupProcessingSettingsRepresentative extends GulpStreamBasedSourceCodeProcessingConfigRepresentative <
  MarkupProcessingSettings__Normalized.Common, MarkupProcessingSettings__Normalized.EntryPointsGroup
> {

  public readonly TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM: string = "Markup";
  public readonly supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: Array<string>;
  public readonly waitingForTheOtherFilesWillBeSavedPeriod__seconds: number;

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
    this.relevantEntryPointsGroupsSettings = normalizedMarkupProcessingSettings.
        entryPointsGroupsActualForCurrentProjectBuildingMode;

    if (this.relevantEntryPointsGroupsSettings.size === 0) {
      Logger.logWarning({
        title: "Styles processing idle",
        description: "Styles processing idle",
        occurrenceLocation: "No markup processing settings has been specified for project building mode " +
            `'${ this.masterConfigRepresentative.consumingProjectBuildingMode }' and/or current ` +
            "selective execution."
      });
    }


    this.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots = normalizedMarkupProcessingSettings.common.
        supportedSourceFileNameExtensionsWithoutLeadingDots;
    this.waitingForTheOtherFilesWillBeSavedPeriod__seconds = normalizedMarkupProcessingSettings.common.
        waitingForSubsequentFilesWillBeSavedPeriod__seconds;

    super.initializeOrUpdatePartialFilesAndEntryPointsRelationsMap();
  }
}
