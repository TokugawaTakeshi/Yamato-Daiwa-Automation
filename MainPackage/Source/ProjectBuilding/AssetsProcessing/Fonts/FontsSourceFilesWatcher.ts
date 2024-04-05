/* ─── Related Classes ────────────────────────────────────────────────────────────────────────────────────────────── */
import AssetsSourceFilesWatcher from "@ProjectBuilding/FilesWatching/Watchers/AssetsSourceFilesWatcher";
import FilesMasterWatcher from "@ProjectBuilding/FilesWatching/Watchers/FilesMasterWatcher";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type FontsProcessingSettingsRepresentative from "@FontsProcessing/FontsProcessingSettingsRepresentative";
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { isNull } from "@yamato-daiwa/es-extensions";


class FontsSourceFilesWatcher extends AssetsSourceFilesWatcher {

  protected static selfSoleInstance: FontsSourceFilesWatcher | null = null;


  public static initializeIfRequiredAndGetInstance(
    initializationRequirements: FontsSourceFilesWatcher.InitializationRequirements
  ): FontsSourceFilesWatcher {

    if (isNull(FontsSourceFilesWatcher.selfSoleInstance)) {
      FontsSourceFilesWatcher.selfSoleInstance = new FontsSourceFilesWatcher(initializationRequirements);
      FilesMasterWatcher.addPassiveWatcher(FontsSourceFilesWatcher.selfSoleInstance);
    }

    return FontsSourceFilesWatcher.selfSoleInstance;

  }


  private constructor(
    {
      fontsProcessingSettingsRepresentative,
      projectBuildingMasterConfigRepresentative
    }: FontsSourceFilesWatcher.InitializationRequirements
  ) {

    super({
      ID: "FONTS_SOURCE_FILES_WATCHER",
      mustLogEvents: fontsProcessingSettingsRepresentative.loggingSettings.filesWatcherEvents,
      projectBuildingMasterConfigRepresentative,
      targetFilesNamesExtensionsWithoutLeadingDots: fontsProcessingSettingsRepresentative.
          supportedSourceFilesNamesExtensionsWithoutLeadingDots,
      outputFilesGlobSelectors: fontsProcessingSettingsRepresentative.actualOutputFilesGlobSelectors,
      targetSourceFilesType__singularForm: "Video"
    });

  }

}


namespace FontsSourceFilesWatcher {

  export type InitializationRequirements = Readonly<{
    fontsProcessingSettingsRepresentative: FontsProcessingSettingsRepresentative;
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
  }>;

}


export default FontsSourceFilesWatcher;
