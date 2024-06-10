/* ─── Related Classes ────────────────────────────────────────────────────────────────────────────────────────────── */
import CodeSourceFilesWatcher from "@ProjectBuilding/FilesWatching/Watchers/CodeSourceFilesWatcher";
import FilesMasterWatcher from "@ProjectBuilding/FilesWatching/Watchers/FilesMasterWatcher";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type StylesProcessingSettingsRepresentative from "@StylesProcessing/StylesProcessingSettingsRepresentative";
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { isNull } from "@yamato-daiwa/es-extensions";


class StylesSourceFilesWatcher extends CodeSourceFilesWatcher {

  protected static selfSoleInstance: StylesSourceFilesWatcher | null = null;


  protected readonly settingsRepresentative: StylesProcessingSettingsRepresentative;


  public static initializeIfRequiredAndGetInstance(
    initializationRequirements: StylesSourceFilesWatcher.InitializationRequirements
  ): StylesSourceFilesWatcher {

    if (isNull(StylesSourceFilesWatcher.selfSoleInstance)) {
      StylesSourceFilesWatcher.selfSoleInstance = new StylesSourceFilesWatcher(initializationRequirements);
      FilesMasterWatcher.addPassiveWatcher(StylesSourceFilesWatcher.selfSoleInstance);
    }

    return StylesSourceFilesWatcher.selfSoleInstance;

  }


  private constructor(
    {
      stylesProcessingSettingsRepresentative,
      projectBuildingMasterConfigRepresentative
    }: StylesSourceFilesWatcher.InitializationRequirements
  ) {

    super({
      ID: "STYLES_SOURCE_FILES_WATCHER",
      mustLogEvents: stylesProcessingSettingsRepresentative.mustLogSourceFilesWatcherEvents,
      projectBuildingMasterConfigRepresentative,
      targetFilesNamesExtensionsWithoutLeadingDots: stylesProcessingSettingsRepresentative.
          actualFileNameExtensionsWithoutLeadingDots,
      outputFilesGlobSelectors: stylesProcessingSettingsRepresentative.actualOutputFilesGlobSelectors,
      targetSourceFilesType__singularForm: "Stylesheet"
    });

    this.settingsRepresentative = stylesProcessingSettingsRepresentative;

  }

}


namespace StylesSourceFilesWatcher {

  export type InitializationRequirements = Readonly<{
    stylesProcessingSettingsRepresentative: StylesProcessingSettingsRepresentative;
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
  }>;

}


export default StylesSourceFilesWatcher;
