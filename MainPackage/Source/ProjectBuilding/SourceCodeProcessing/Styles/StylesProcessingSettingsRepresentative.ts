/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import PROCESSABLE_FILES_POINTER_ALIAS_PREFIX from
    "@ProjectBuilding/Common/Restrictions/ResourcesReferences/PROCESSABLE_FILES_POINTER_ALIAS_PREFIX";

/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type StylesProcessingSettings__Normalized from "@StylesProcessing/StylesProcessingSettings__Normalized";
import type SourceCodeProcessingGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/SourceCodeProcessingGenericProperties__Normalized";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import GulpStreamBasedSourceCodeProcessingConfigRepresentative from
    "@ProjectBuilding/Common/SettingsRepresentatives/GulpStreamBasedSourceCodeProcessingConfigRepresentative";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { mergeSets } from "@yamato-daiwa/es-extensions";


export default class StylesProcessingSettingsRepresentative extends GulpStreamBasedSourceCodeProcessingConfigRepresentative<
  StylesProcessingSettings__Normalized.Common, StylesProcessingSettings__Normalized.EntryPointsGroup
> {

  /* ━━━ Fields ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* ┅┅┅ Superclasses' Requirements ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */

  /* [ Theory ] Below two fields may be even or not. */
  public readonly supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: ReadonlySet<string>;
  public readonly actualFileNameExtensionsWithoutLeadingDots: ReadonlySet<string>;

  public readonly TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM: string = "Stylesheet";
  public readonly TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM: string = "Stylesheets";

  /* ┅┅┅ Specific ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  public readonly WAITING_FOR_SUBSEQUENT_FILES_WILL_SAVED_PERIOD__SECONDS: number;

  public readonly entryPointsGroupsNormalizedSettingsMappedByReferences:
      ReadonlyMap<string, StylesProcessingSettings__Normalized.EntryPointsGroup>;

  public readonly sourceCodeLintingCommonSettings: StylesProcessingSettings__Normalized.Linting;

  public readonly relevantEntryPointsGroupsSettings: ReadonlyMap<
    SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup.ID,
    StylesProcessingSettings__Normalized.EntryPointsGroup
  >;

  public readonly loggingSettings: StylesProcessingSettings__Normalized.Logging;

  protected readonly sourceCodeProcessingCommonSettings: StylesProcessingSettings__Normalized.Common;


  /* ━━━ Constructor ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public constructor(
    stylesProcessingSettings__normalized: StylesProcessingSettings__Normalized,
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ) {

    super(projectBuildingMasterConfigRepresentative);

    this.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots = stylesProcessingSettings__normalized.common.
        supportedEntryPointsSourceFilesNamesExtensionsWithoutLeadingDots;

    this.actualFileNameExtensionsWithoutLeadingDots = mergeSets(
      this.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots,
      stylesProcessingSettings__normalized.common.supportedAdditionalFilesNamesExtensionsWithoutLeadingDotsOfChildrenFiles
    );

    this.WAITING_FOR_SUBSEQUENT_FILES_WILL_SAVED_PERIOD__SECONDS = stylesProcessingSettings__normalized.common.
        secondsBetweenFileUpdatingAndStartingOfRebuilding;

    this.relevantEntryPointsGroupsSettings = stylesProcessingSettings__normalized.relevantEntryPointsGroups;

    this.entryPointsGroupsNormalizedSettingsMappedByReferences = new Map<
      string, StylesProcessingSettings__Normalized.EntryPointsGroup
    >(
      Array.from(this.relevantEntryPointsGroupsSettings.values()).map(
        (entryPointsGroupSettings: StylesProcessingSettings__Normalized.EntryPointsGroup):
            [string, StylesProcessingSettings__Normalized.EntryPointsGroup] =>
                [
                  `${ PROCESSABLE_FILES_POINTER_ALIAS_PREFIX }${ entryPointsGroupSettings.ID }`,
                  entryPointsGroupSettings
                ]
      )
    );

    this.sourceCodeLintingCommonSettings = stylesProcessingSettings__normalized.linting;
    this.loggingSettings = stylesProcessingSettings__normalized.logging;

    this.sourceCodeProcessingCommonSettings = stylesProcessingSettings__normalized.common;

  }


  /* ━━━ Logging ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public get mustLogSourceFilesWatcherEvents(): boolean {
    return this.loggingSettings.filesWatcherEvents;
  }

}
