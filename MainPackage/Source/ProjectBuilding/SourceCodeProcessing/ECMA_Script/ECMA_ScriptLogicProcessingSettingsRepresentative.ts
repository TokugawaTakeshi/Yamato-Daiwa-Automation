/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import PROCESSABLE_FILES_POINTER_ALIAS_PREFIX from
    "@ProjectBuilding/Common/Restrictions/ResourcesReferences/PROCESSABLE_FILES_POINTER_ALIAS_PREFIX";

/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type ECMA_ScriptLogicProcessingSettings__Normalized from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettings__Normalized";
import type SourceCodeProcessingGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/SourceCodeProcessingGenericProperties__Normalized";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import SourceCodeProcessingConfigRepresentative from
    "@ProjectBuilding/Common/SettingsRepresentatives/SourceCodeProcessingConfigRepresentative";


export default class ECMA_ScriptLogicProcessingSettingsRepresentative extends SourceCodeProcessingConfigRepresentative<
  ECMA_ScriptLogicProcessingSettings__Normalized.Common, ECMA_ScriptLogicProcessingSettings__Normalized.EntryPointsGroup
> {

  /* [ Theory ] Below two fields could be even or not. */
  public readonly supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: ReadonlyArray<string>;
  public readonly actualFileNameExtensionsWithoutLeadingDots: ReadonlyArray<string>;

  public readonly TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM: string = "ECMAScript logic";
  public readonly TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM: string = "ECMAScript logic";
  public readonly TASK_NAME_FOR_LOGGING: string = "ECMAScript Logic Processing";

  public readonly entryPointsGroupsNormalizedSettingsMappedByReferences: ReadonlyMap<
    string, ECMA_ScriptLogicProcessingSettings__Normalized.EntryPointsGroup
  >;

  public readonly relevantEntryPointsGroupsSettings: ReadonlyMap<
    SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup.ID,
    ECMA_ScriptLogicProcessingSettings__Normalized.EntryPointsGroup
  >;
  public readonly loggingSettings: ECMA_ScriptLogicProcessingSettings__Normalized.Logging;
  public readonly localDevelopmentServerOrchestrationSettings?:
      ECMA_ScriptLogicProcessingSettings__Normalized.LocalDevelopmentServerOrchestration;

  protected readonly sourceCodeProcessingCommonSettings: ECMA_ScriptLogicProcessingSettings__Normalized.Common;


  public constructor(
    normalizedECMA_ScriptLogicProcessingSettings: ECMA_ScriptLogicProcessingSettings__Normalized,
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ) {

    super(projectBuildingMasterConfigRepresentative);

    this.sourceCodeProcessingCommonSettings = normalizedECMA_ScriptLogicProcessingSettings.common;
    this.relevantEntryPointsGroupsSettings = normalizedECMA_ScriptLogicProcessingSettings.relevantEntryPointsGroups;
    this.loggingSettings = normalizedECMA_ScriptLogicProcessingSettings.logging;
    this.localDevelopmentServerOrchestrationSettings = normalizedECMA_ScriptLogicProcessingSettings.
        localDevelopmentServerOrchestration;

    this.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots = normalizedECMA_ScriptLogicProcessingSettings.common.
        supportedSourceFileNameExtensionsWithoutLeadingDots;
    this.actualFileNameExtensionsWithoutLeadingDots = normalizedECMA_ScriptLogicProcessingSettings.common.
        supportedSourceFileNameExtensionsWithoutLeadingDots;

    this.entryPointsGroupsNormalizedSettingsMappedByReferences = new Map<
      string, ECMA_ScriptLogicProcessingSettings__Normalized.EntryPointsGroup
    >(
      Array.from(this.relevantEntryPointsGroupsSettings.values()).map(
        (entryPointsGroupSettings: ECMA_ScriptLogicProcessingSettings__Normalized.EntryPointsGroup):
            [string, ECMA_ScriptLogicProcessingSettings__Normalized.EntryPointsGroup] =>
                [
                  `${ PROCESSABLE_FILES_POINTER_ALIAS_PREFIX }${ entryPointsGroupSettings.ID }`,
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
