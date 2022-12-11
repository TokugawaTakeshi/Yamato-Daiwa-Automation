/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type ECMA_ScriptLogicProcessingSettings__Normalized from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettings__Normalized";
import type ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";

/* --- Settings representatives ------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import SourceCodeProcessingConfigRepresentative from
    "@ProjectBuilding/Common/SettingsRepresentatives/SourceCodeProcessingConfigRepresentative";

/* --- Utils -------------------------------------------------------------------------------------------------------- */
import { Logger } from "@yamato-daiwa/es-extensions";


export default class ECMA_ScriptLogicProcessingSettingsRepresentative extends SourceCodeProcessingConfigRepresentative<
  ECMA_ScriptLogicProcessingSettings__Normalized.Common,
  ECMA_ScriptLogicProcessingSettings__Normalized.EntryPointsGroup
> {

  public readonly supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: ReadonlyArray<string>;
  public readonly TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM: string = "Script";
  public readonly TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM: string = "Scripts";
  public readonly prefixOfAliasOfTopDirectoryOfEntryPointsGroup: string = "@";

  public readonly relevantEntryPointsGroupsSettings: ReadonlyMap<
    ProjectBuildingConfig__Normalized.EntryPointsGroupID, ECMA_ScriptLogicProcessingSettings__Normalized.EntryPointsGroup
  >;
  public readonly entryPointsSourceFilesAbsolutePathsAndOutputFilesActualPathsMap: Map<string, string> =
      new Map<string, string>();

  protected readonly sourceCodeProcessingCommonSettings: ECMA_ScriptLogicProcessingSettings__Normalized.Common;


  public constructor(
    ECMA_ScriptLogicProcessingSettings__normalized: ECMA_ScriptLogicProcessingSettings__Normalized,
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ) {

    super(projectBuildingMasterConfigRepresentative);

    this.sourceCodeProcessingCommonSettings = ECMA_ScriptLogicProcessingSettings__normalized.common;
    this.relevantEntryPointsGroupsSettings = ECMA_ScriptLogicProcessingSettings__normalized.relevantEntryPointsGroups;

    if (this.relevantEntryPointsGroupsSettings.size === 0) {
      Logger.logWarning({
        title: "The ECMAScript logic processing will not be executed",
        description: "No files has been found for project building mode " +
            `"${ projectBuildingMasterConfigRepresentative.consumingProjectBuildingMode }" `,
        occurrenceLocation: "ECMA_ScriptLogicProcessingSettingsRepresentative.constructor(...parameters)"
      });
    }

    this.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots = ECMA_ScriptLogicProcessingSettings__normalized.common.
        supportedSourceFileNameExtensionsWithoutLeadingDots;

  }


  public get absolutePathsOfAliasesOfDirectories(): { [aliasName: string]: string | undefined; } {
    return this.sourceCodeProcessingCommonSettings.directoriesAliasesAbsolutePaths ?? {};
  }

  public get entryPointsGroupsNormalizedSettingsMappedByPathAliases():
      Map<string, ECMA_ScriptLogicProcessingSettings__Normalized.EntryPointsGroup> {

    return new Map<string, ECMA_ScriptLogicProcessingSettings__Normalized.EntryPointsGroup>(
        Array.from(this.relevantEntryPointsGroupsSettings.values()).map(
          (entryPointsGroupSettings: ECMA_ScriptLogicProcessingSettings__Normalized.EntryPointsGroup):
          [string, ECMA_ScriptLogicProcessingSettings__Normalized.EntryPointsGroup] =>
              [
                `${ entryPointsGroupSettings.entryPointsSourceFilesTopDirectoryOrSingleFilePathAliasForReferencingFromHTML }`,
                entryPointsGroupSettings
              ]
        )
    );
  }

}
