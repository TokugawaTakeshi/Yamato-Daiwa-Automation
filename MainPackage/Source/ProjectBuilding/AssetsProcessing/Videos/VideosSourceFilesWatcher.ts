/* ─── Related Classes ────────────────────────────────────────────────────────────────────────────────────────────── */
import AssetsSourceFilesWatcher from "@ProjectBuilding/FilesWatching/Watchers/AssetsSourceFilesWatcher";
import FilesMasterWatcher from "@ProjectBuilding/FilesWatching/Watchers/FilesMasterWatcher";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type VideosProcessingSettingsRepresentative from "@VideosProcessing/VideosProcessingSettingsRepresentative";
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { isNull } from "@yamato-daiwa/es-extensions";


class VideosSourceFilesWatcher extends AssetsSourceFilesWatcher {

  protected static selfSoleInstance: VideosSourceFilesWatcher | null = null;


  public static initializeIfRequiredAndGetInstance(
    initializationRequirements: VideosSourceFilesWatcher.InitializationRequirements
  ): VideosSourceFilesWatcher {

    if (isNull(VideosSourceFilesWatcher.selfSoleInstance)) {
      VideosSourceFilesWatcher.selfSoleInstance = new VideosSourceFilesWatcher(initializationRequirements);
      FilesMasterWatcher.addPassiveWatcher(VideosSourceFilesWatcher.selfSoleInstance);
    }

    return VideosSourceFilesWatcher.selfSoleInstance;

  }


  private constructor(
    {
      videosProcessingSettingsRepresentative,
      projectBuildingMasterConfigRepresentative
    }: VideosSourceFilesWatcher.InitializationRequirements
  ) {

    super({
      ID: "VIDEOS_SOURCE_FILES_WATCHER",
      mustLogEvents: videosProcessingSettingsRepresentative.loggingSettings.filesWatcherEvents,
      projectBuildingMasterConfigRepresentative,
      targetFilesNamesExtensionsWithoutLeadingDots: videosProcessingSettingsRepresentative.
          supportedSourceFilesNamesExtensionsWithoutLeadingDots,
      outputFilesGlobSelectors: videosProcessingSettingsRepresentative.actualOutputFilesGlobSelectors,
      targetSourceFilesType__singularForm: "Video"
    });

  }

}


namespace VideosSourceFilesWatcher {

  export type InitializationRequirements = Readonly<{
    videosProcessingSettingsRepresentative: VideosProcessingSettingsRepresentative;
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
  }>;

}


export default VideosSourceFilesWatcher;
