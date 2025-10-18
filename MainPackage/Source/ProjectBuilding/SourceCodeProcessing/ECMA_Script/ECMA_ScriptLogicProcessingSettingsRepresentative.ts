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

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { mergeSets } from "@yamato-daiwa/es-extensions";


export default class ECMA_ScriptLogicProcessingSettingsRepresentative extends SourceCodeProcessingConfigRepresentative<
  ECMA_ScriptLogicProcessingSettings__Normalized.Common, ECMA_ScriptLogicProcessingSettings__Normalized.EntryPointsGroup
> {

  /* [ Theory ] Below two fields could be even or not. */
  public readonly supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: ReadonlySet<string>;
  public readonly actualFileNameExtensionsWithoutLeadingDots: ReadonlySet<string>;

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

  public readonly electronSettings?: ECMA_ScriptLogicProcessingSettings__Normalized.Electron;
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
    this.electronSettings = normalizedECMA_ScriptLogicProcessingSettings.electron;
    this.loggingSettings = normalizedECMA_ScriptLogicProcessingSettings.logging;
    this.localDevelopmentServerOrchestrationSettings = normalizedECMA_ScriptLogicProcessingSettings.
        localDevelopmentServerOrchestration;

    this.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots = normalizedECMA_ScriptLogicProcessingSettings.common.
        supportedEntryPointsSourceFilesNamesExtensionsWithoutLeadingDots;

    this.actualFileNameExtensionsWithoutLeadingDots = mergeSets(
      this.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots,
      normalizedECMA_ScriptLogicProcessingSettings.common.supportedAdditionalFilesNamesExtensionsWithoutLeadingDotsOfChildrenFiles
    );

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


  public get mustLogSourceFilesWatcherEvents(): boolean {
    return this.loggingSettings.filesWatcherEvents;
  }

}
