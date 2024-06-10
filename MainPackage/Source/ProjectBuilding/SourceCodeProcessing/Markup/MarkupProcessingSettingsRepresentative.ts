/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import MarkupProcessingRestrictions from "@MarkupProcessing/MarkupProcessingRestrictions";
import PROCESSABLE_FILE_REFERENCE_ALIAS_PREFIX from
    "@ProjectBuilding/Common/Restrictions/ResourcesReferences/PROCESSABLE_FILE_REFERENCE_ALIAS_PREFIX";
import PLAIN_COPIED_FILES_ALIAS_PREFIX from
    "@ProjectBuilding/Common/Restrictions/ResourcesReferences/PLAIN_COPIED_FILES_ALIAS_PREFIX";

/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type MarkupProcessingSettings__Normalized from "@MarkupProcessing/MarkupProcessingSettings__Normalized";
import type SourceCodeProcessingGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/SourceCodeProcessingGenericProperties__Normalized";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import GulpStreamBasedSourceCodeProcessingConfigRepresentative from
    "@ProjectBuilding/Common/SettingsRepresentatives/GulpStreamBasedSourceCodeProcessingConfigRepresentative";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { insertSubstringIf, replaceDoubleBackslashesWithForwardSlashes } from "@yamato-daiwa/es-extensions";


export default class MarkupProcessingSettingsRepresentative extends GulpStreamBasedSourceCodeProcessingConfigRepresentative<
  MarkupProcessingSettings__Normalized.Common, MarkupProcessingSettings__Normalized.EntryPointsGroup
> {

  /* [ Theory ] Below two fields could be even or not. */
  public readonly supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: ReadonlyArray<string>;
  public readonly actualFileNameExtensionsWithoutLeadingDots: ReadonlyArray<string>;

  public readonly TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM: string = "Markup";
  public readonly TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM: string = "Markup";
  public readonly TASK_NAME_FOR_LOGGING: string = "Markup processing";
  public readonly PLAIN_COPIED_FILES_ALIAS_PREFIX: string = PLAIN_COPIED_FILES_ALIAS_PREFIX;
  public readonly WAITING_FOR_SUBSEQUENT_FILES_WILL_SAVED_PERIOD__SECONDS: number;

  public readonly entryPointsGroupsNormalizedSettingsMappedByReferences: ReadonlyMap<
    string, MarkupProcessingSettings__Normalized.EntryPointsGroup
  >;

  public readonly sourceCodeLintingCommonSettings: MarkupProcessingSettings__Normalized.Linting;
  public readonly importingFromTypeScriptSettings?: MarkupProcessingSettings__Normalized.ImportingFromTypeScript;
  public readonly staticPreviewSettings: MarkupProcessingSettings__Normalized.StaticPreview;
  public readonly relevantEntryPointsGroupsSettings: ReadonlyMap<
    SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup.ID, MarkupProcessingSettings__Normalized.EntryPointsGroup
  >;
  public readonly loggingSettings: MarkupProcessingSettings__Normalized.Logging;

  public readonly mustValidateHTML: boolean;
  public readonly mustInspectAccessibility: boolean;

  protected readonly sourceCodeProcessingCommonSettings: MarkupProcessingSettings__Normalized.Common;
  protected readonly mustResolveResourcesReferencesToAbsolutePath: boolean;


  public constructor(
    normalizedMarkupProcessingSettings: MarkupProcessingSettings__Normalized,
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ) {

    super(projectBuildingMasterConfigRepresentative);

    this.sourceCodeLintingCommonSettings = normalizedMarkupProcessingSettings.linting;
    this.importingFromTypeScriptSettings = normalizedMarkupProcessingSettings.importingFromTypeScript;
    this.staticPreviewSettings = normalizedMarkupProcessingSettings.staticPreview;
    this.relevantEntryPointsGroupsSettings = normalizedMarkupProcessingSettings.relevantEntryPointsGroups;
    this.loggingSettings = normalizedMarkupProcessingSettings.logging;

    this.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots = normalizedMarkupProcessingSettings.common.
        supportedSourceFileNameExtensionsWithoutLeadingDots;
    this.actualFileNameExtensionsWithoutLeadingDots = normalizedMarkupProcessingSettings.common.
        supportedSourceFileNameExtensionsWithoutLeadingDots;

    this.WAITING_FOR_SUBSEQUENT_FILES_WILL_SAVED_PERIOD__SECONDS = normalizedMarkupProcessingSettings.common.
        periodBetweenFileUpdatingAndRebuildingStarting__seconds;

    this.entryPointsGroupsNormalizedSettingsMappedByReferences = new Map<
      string, MarkupProcessingSettings__Normalized.EntryPointsGroup
    >(
      Array.from(this.relevantEntryPointsGroupsSettings.values()).map(
        (entryPointsGroupSettings: MarkupProcessingSettings__Normalized.EntryPointsGroup):
            [string, MarkupProcessingSettings__Normalized.EntryPointsGroup] =>
                [
                  `${ PROCESSABLE_FILE_REFERENCE_ALIAS_PREFIX }${ entryPointsGroupSettings.ID }`,
                  entryPointsGroupSettings
                ]
      )
    );

    this.mustValidateHTML = Array.from(this.relevantEntryPointsGroupsSettings.values()).some(
      (entryPointsGroupSettings: MarkupProcessingSettings__Normalized.EntryPointsGroup): boolean =>
          entryPointsGroupSettings.HTML_Validation.mustExecute
    );

    this.mustInspectAccessibility = Array.from(this.relevantEntryPointsGroupsSettings.values()).some(
      (entryPointsGroupSettings: MarkupProcessingSettings__Normalized.EntryPointsGroup): boolean =>
          entryPointsGroupSettings.accessibilityInspection.mustExecute
    );

    this.sourceCodeProcessingCommonSettings = normalizedMarkupProcessingSettings.common;
    this.mustResolveResourcesReferencesToAbsolutePath = normalizedMarkupProcessingSettings.common.
        mustResolveResourcesReferencesToAbsolutePath;

  }


  /* ━━━ Common ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public computeOutputFileNameExtension(
    compoundParameter: Readonly<
      (
        { targetFilePath: string; } |
        { entryPointsGroupSettingsActualForTargetFile: MarkupProcessingSettings__Normalized.EntryPointsGroup; }
      ) &
      { mustPrependDotToFileNameExtension: boolean; }
    >
  ): string {

    const actualEntryPointsGroupSettings: MarkupProcessingSettings__Normalized.EntryPointsGroup =
        "entryPointsGroupSettingsActualForTargetFile" in compoundParameter ?
            compoundParameter.entryPointsGroupSettingsActualForTargetFile :
            this.getExpectedToExistEntryPointsGroupSettingsRelevantForSpecifiedSourceFileAbsolutePath(
              compoundParameter.targetFilePath
            );

    let fileNameExtensionWithoutLeadingDot: string;

    switch (actualEntryPointsGroupSettings.outputFormat) {

      case MarkupProcessingRestrictions.OutputFormats.HTML: {
        fileNameExtensionWithoutLeadingDot = "html";
        break;
      }

      case MarkupProcessingRestrictions.OutputFormats.handlebars: {
        fileNameExtensionWithoutLeadingDot =
            this.projectBuildingMasterConfigRepresentative.isStaticPreviewBuildingMode ?
                "html" : "hbs";
        break;
      }

      case MarkupProcessingRestrictions.OutputFormats.razor: {
        fileNameExtensionWithoutLeadingDot = "razor";
      }

    }

    return insertSubstringIf(".", compoundParameter.mustPrependDotToFileNameExtension) +
        fileNameExtensionWithoutLeadingDot;

  }


  /* ━━━ Static preview ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public getStateDependentVariationsForEntryPointWithAbsolutePath(
    targetFileAbsolutePath: string
  ): MarkupProcessingSettings__Normalized.StaticPreview.PagesStateDependentVariationsSpecification.Page | undefined {
    return this.staticPreviewSettings.
        stateDependentPagesVariationsSpecification[replaceDoubleBackslashesWithForwardSlashes(targetFileAbsolutePath)];
  }

  public get staticDataForStaticPreview(): MarkupProcessingSettings__Normalized.StaticPreview.ImportsFromStaticDataFiles {
    return this.staticPreviewSettings.importsFromStaticDataFiles;
  }


  /* ━━━ Logging ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public get mustLogSourceFilesWatcherEvents(): boolean {
    return this.loggingSettings.filesWatcherEvents;
  }

}
