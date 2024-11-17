/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import PROCESSABLE_FILE_REFERENCE_ALIAS_PREFIX from
    "@ProjectBuilding/Common/Restrictions/ResourcesReferences/PROCESSABLE_FILE_REFERENCE_ALIAS_PREFIX";

/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type StylesProcessingSettings__Normalized from "@StylesProcessing/StylesProcessingSettings__Normalized";
import type SourceCodeProcessingGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/SourceCodeProcessingGenericProperties__Normalized";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import GulpStreamBasedSourceCodeProcessingConfigRepresentative from
    "@ProjectBuilding/Common/SettingsRepresentatives/GulpStreamBasedSourceCodeProcessingConfigRepresentative";


export default class StylesProcessingSettingsRepresentative extends GulpStreamBasedSourceCodeProcessingConfigRepresentative<
  StylesProcessingSettings__Normalized.Common, StylesProcessingSettings__Normalized.EntryPointsGroup
> {

  /* [ Theory ] Below two fields could be even or not. */
  public readonly supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: ReadonlyArray<string>;
  public readonly actualFileNameExtensionsWithoutLeadingDots: ReadonlyArray<string>;

  public readonly TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM: string = "Stylesheet";
  public readonly TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM: string = "Stylesheets";
  public readonly TASK_NAME_FOR_LOGGING: string = "Styles processing";
  public readonly WAITING_FOR_SUBSEQUENT_FILES_WILL_SAVED_PERIOD__SECONDS: number;

  public readonly entryPointsGroupsNormalizedSettingsMappedByReferences: ReadonlyMap<
    string, StylesProcessingSettings__Normalized.EntryPointsGroup
  >;

  public readonly sourceCodeLintingCommonSettings: StylesProcessingSettings__Normalized.Linting;
  public readonly loggingSettings: StylesProcessingSettings__Normalized.Logging;

  public readonly relevantEntryPointsGroupsSettings: ReadonlyMap<
    SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup.ID,
    StylesProcessingSettings__Normalized.EntryPointsGroup
  >;

  protected readonly sourceCodeProcessingCommonSettings: StylesProcessingSettings__Normalized.Common;


  public constructor(
    normalizedStylesProcessingSettings: StylesProcessingSettings__Normalized,
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ) {

    super(projectBuildingMasterConfigRepresentative);

    this.sourceCodeProcessingCommonSettings = normalizedStylesProcessingSettings.common;
    this.sourceCodeLintingCommonSettings = normalizedStylesProcessingSettings.linting;
    this.relevantEntryPointsGroupsSettings = normalizedStylesProcessingSettings.relevantEntryPointsGroups;
    this.loggingSettings = normalizedStylesProcessingSettings.logging;

    this.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots = normalizedStylesProcessingSettings.common.
        supportedSourceFileNameExtensionsWithoutLeadingDots;
    this.actualFileNameExtensionsWithoutLeadingDots = normalizedStylesProcessingSettings.common.
        supportedSourceFileNameExtensionsWithoutLeadingDots;

    this.WAITING_FOR_SUBSEQUENT_FILES_WILL_SAVED_PERIOD__SECONDS = normalizedStylesProcessingSettings.common.
        secondsBetweenFileUpdatingAndStartingOfRebuilding;

    this.entryPointsGroupsNormalizedSettingsMappedByReferences = new Map<
      string, StylesProcessingSettings__Normalized.EntryPointsGroup
    >(
      Array.from(this.relevantEntryPointsGroupsSettings.values()).map(
        (entryPointsGroupSettings: StylesProcessingSettings__Normalized.EntryPointsGroup):
            [string, StylesProcessingSettings__Normalized.EntryPointsGroup] =>
                [
                  `${ PROCESSABLE_FILE_REFERENCE_ALIAS_PREFIX }${ entryPointsGroupSettings.ID }`,
                  entryPointsGroupSettings
                ]
      )
    );

  }

  /* ━━━ Logging ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public get mustLogSourceFilesWatcherEvents(): boolean {
    return this.loggingSettings.filesWatcherEvents;
  }

}
