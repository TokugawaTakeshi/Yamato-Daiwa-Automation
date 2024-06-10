/* ─── Related Classes ────────────────────────────────────────────────────────────────────────────────────────────── */
import CodeSourceFilesWatcher from "@ProjectBuilding/FilesWatching/Watchers/CodeSourceFilesWatcher";
import FilesMasterWatcher from "@ProjectBuilding/FilesWatching/Watchers/FilesMasterWatcher";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type MarkupProcessingSettingsRepresentative from "@MarkupProcessing/MarkupProcessingSettingsRepresentative";
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { isNull } from "@yamato-daiwa/es-extensions";


class MarkupSourceFilesWatcher extends CodeSourceFilesWatcher {

  protected static selfSoleInstance: MarkupSourceFilesWatcher | null = null;


  protected readonly settingsRepresentative: MarkupProcessingSettingsRepresentative;


  public static initializeIfRequiredAndGetInstance(
    initializationRequirements: MarkupSourceFilesWatcher.InitializationRequirements
  ): MarkupSourceFilesWatcher {

    if (isNull(MarkupSourceFilesWatcher.selfSoleInstance)) {
      MarkupSourceFilesWatcher.selfSoleInstance = new MarkupSourceFilesWatcher(initializationRequirements);
      FilesMasterWatcher.addPassiveWatcher(MarkupSourceFilesWatcher.selfSoleInstance);
    }

    return MarkupSourceFilesWatcher.selfSoleInstance;

  }


  private constructor(
    {
      markupProcessingSettingsRepresentative,
      projectBuildingMasterConfigRepresentative
    }: MarkupSourceFilesWatcher.InitializationRequirements
  ) {

    super({
      ID: "MARKUP_SOURCE_FILES_WATCHER",
      mustLogEvents: markupProcessingSettingsRepresentative.mustLogSourceFilesWatcherEvents,
      projectBuildingMasterConfigRepresentative,
      targetFilesNamesExtensionsWithoutLeadingDots: markupProcessingSettingsRepresentative.
          actualFileNameExtensionsWithoutLeadingDots,
      outputFilesGlobSelectors: markupProcessingSettingsRepresentative.actualOutputFilesGlobSelectors,
      targetSourceFilesType__singularForm: "Markup"
    });

    this.settingsRepresentative = markupProcessingSettingsRepresentative;

  }

}


namespace MarkupSourceFilesWatcher {

  export type InitializationRequirements = Readonly<{
    markupProcessingSettingsRepresentative: MarkupProcessingSettingsRepresentative;
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
  }>;

}


export default MarkupSourceFilesWatcher;
