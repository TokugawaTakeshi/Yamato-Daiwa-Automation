/* ─── Related Classes ────────────────────────────────────────────────────────────────────────────────────────────── */
import CodeSourceFilesWatcher from "@ProjectBuilding/FilesWatching/Watchers/CodeSourceFilesWatcher";
import FilesMasterWatcher from "@ProjectBuilding/FilesWatching/Watchers/FilesMasterWatcher";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ECMA_ScriptLogicProcessingSettingsRepresentative from
      "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettingsRepresentative";
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { isNull } from "@yamato-daiwa/es-extensions";


class ECMA_ScriptSourceFilesWatcher extends CodeSourceFilesWatcher {

  protected static selfSoleInstance: ECMA_ScriptSourceFilesWatcher | null = null;


  protected readonly settingsRepresentative: ECMA_ScriptLogicProcessingSettingsRepresentative;


  public static initializeIfRequiredAndGetInstance(
    initializationRequirements: ECMA_ScriptSourceFilesWatcher.InitializationRequirements
  ): ECMA_ScriptSourceFilesWatcher {

    if (isNull(ECMA_ScriptSourceFilesWatcher.selfSoleInstance)) {
      ECMA_ScriptSourceFilesWatcher.selfSoleInstance = new ECMA_ScriptSourceFilesWatcher(initializationRequirements);
      FilesMasterWatcher.addPassiveWatcher(ECMA_ScriptSourceFilesWatcher.selfSoleInstance);
    }

    return ECMA_ScriptSourceFilesWatcher.selfSoleInstance;

  }


  private constructor(
    {
      ecmaScriptLogicProcessingSettingsRepresentative,
      projectBuildingMasterConfigRepresentative
    }: ECMA_ScriptSourceFilesWatcher.InitializationRequirements
  ) {

    super({
      ID: "ECMA_SCRIPT_LOGIC_SOURCE_FILES_WATCHER",
      mustLogEvents: ecmaScriptLogicProcessingSettingsRepresentative.mustLogSourceFilesWatcherEvents,
      projectBuildingMasterConfigRepresentative,
      targetFilesNamesExtensionsWithoutLeadingDots: ecmaScriptLogicProcessingSettingsRepresentative.
          actualFileNameExtensionsWithoutLeadingDots,
      outputFilesGlobSelectors: ecmaScriptLogicProcessingSettingsRepresentative.actualOutputFilesGlobSelectors,
      targetSourceFilesType__singularForm: "ECMAScript Logic"
    });

    this.settingsRepresentative = ecmaScriptLogicProcessingSettingsRepresentative;

  }

}


namespace ECMA_ScriptSourceFilesWatcher {

  export type InitializationRequirements = Readonly<{
    ecmaScriptLogicProcessingSettingsRepresentative: ECMA_ScriptLogicProcessingSettingsRepresentative;
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
  }>;

}


export default ECMA_ScriptSourceFilesWatcher;
