/* ─── Related Classes ────────────────────────────────────────────────────────────────────────────────────────────── */
import AssetsSourceFilesWatcher from "@ProjectBuilding/FilesWatching/Watchers/AssetsSourceFilesWatcher";
import FilesMasterWatcher from "@ProjectBuilding/FilesWatching/Watchers/FilesMasterWatcher";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type AudiosProcessingSettingsRepresentative from "@AudiosProcessing/AudiosProcessingSettingsRepresentative";
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { isNull } from "@yamato-daiwa/es-extensions";


class AudiosSourceFilesWatcher extends AssetsSourceFilesWatcher {

  protected static selfSoleInstance: AudiosSourceFilesWatcher | null = null;


  public static initializeIfRequiredAndGetInstance(
    initializationRequirements: AudiosSourceFilesWatcher.InitializationRequirements
  ): AudiosSourceFilesWatcher {

    if (isNull(AudiosSourceFilesWatcher.selfSoleInstance)) {
      AudiosSourceFilesWatcher.selfSoleInstance = new AudiosSourceFilesWatcher(initializationRequirements);
      FilesMasterWatcher.addPassiveWatcher(AudiosSourceFilesWatcher.selfSoleInstance);
    }

    return AudiosSourceFilesWatcher.selfSoleInstance;

  }


  private constructor(
    {
      audiosProcessingSettingsRepresentative,
      projectBuildingMasterConfigRepresentative
    }: AudiosSourceFilesWatcher.InitializationRequirements
  ) {

    super({
      ID: "AUDIOS_SOURCE_FILES_WATCHER",
      mustLogEvents: audiosProcessingSettingsRepresentative.loggingSettings.filesWatcherEvents,
      projectBuildingMasterConfigRepresentative,
      targetFilesNamesExtensionsWithoutLeadingDots: audiosProcessingSettingsRepresentative.
          supportedSourceFilesNamesExtensionsWithoutLeadingDots,
      outputFilesGlobSelectors: audiosProcessingSettingsRepresentative.actualOutputFilesGlobSelectors,
      targetSourceFilesType__singularForm: "Audio"
    });

  }

}


namespace AudiosSourceFilesWatcher {

  export type InitializationRequirements = Readonly<{
    audiosProcessingSettingsRepresentative: AudiosProcessingSettingsRepresentative;
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
  }>;

}


export default AudiosSourceFilesWatcher;
