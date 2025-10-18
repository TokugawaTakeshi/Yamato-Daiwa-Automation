/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type ECMA_ScriptLogicProcessingSettings__Normalized from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettings__Normalized";

/* ─── Files Watchers ─────────────────────────────────────────────────────────────────────────────────────────────── */
import FilesPassiveWatcher from "@ProjectBuilding/FilesWatching/Watchers/FilesPassiveWatcher";
import FilesMasterWatcher from "@ProjectBuilding/FilesWatching/Watchers/FilesMasterWatcher";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { ImprovedGlob } from "@yamato-daiwa/es-extensions-nodejs";


class ElectronFilesWatcher extends FilesPassiveWatcher {

  protected readonly onAnyEventRelatedWithActualFilesHandler: (
    targetFileAbsolutePath__forwardSlashesPathSeparators: string,
    eventName: FilesMasterWatcher.EventsNames
  ) => void;


  public static initialize(
    initializationRequirements: ElectronFilesWatcher.InitializationRequirements
  ): void {
    FilesMasterWatcher.addPassiveWatcher(new ElectronFilesWatcher(initializationRequirements));
  }


  protected constructor(
    {
      electronSettings,
      loggingSettings,
      onAnyEventRelatedWithActualFilesHandler
    }: ElectronFilesWatcher.InitializationRequirements
  ) {

    super({
      ID: "BROWSER_COORDINATOR_RELATED_FILES_WATCHER",
      targetFilesGlobSelectors: [
        ImprovedGlob.buildAllFilesInCurrentDirectoryAndBelowGlobSelector({
          basicDirectoryPath: electronSettings.hotReloadingForLocalDevelopmentMode.rootDirectoryAbsolutePath
        }),
        ...electronSettings.hotReloadingForLocalDevelopmentMode.ignoredFilesAndDirectoriesAbsolutePaths.map(
          (excludedSubdirectoryPathRelativeToAssetsGroupSourceTopDirectory: string): string =>
              ImprovedGlob.buildExcludingOfDirectoryWithSubdirectoriesGlobSelector(
                excludedSubdirectoryPathRelativeToAssetsGroupSourceTopDirectory
              )
        )
      ],
      mustLogEvents: loggingSettings.filesWatcherEvents
    });

    this.onAnyEventRelatedWithActualFilesHandler = onAnyEventRelatedWithActualFilesHandler;

  }


  public notifyAboutRelatedFileStateChange(
    targetFileAbsolutePath__forwardSlashesPathSeparators: string,
    eventName: FilesMasterWatcher.EventsNames
  ): void {
    this.onAnyEventRelatedWithActualFilesHandler(targetFileAbsolutePath__forwardSlashesPathSeparators, eventName);
  }

}


namespace ElectronFilesWatcher {

  export type InitializationRequirements =
      Readonly<{
        electronSettings: ECMA_ScriptLogicProcessingSettings__Normalized.Electron;
        loggingSettings: ECMA_ScriptLogicProcessingSettings__Normalized.Logging;
        onAnyEventRelatedWithActualFilesHandler: (
          targetFileAbsolutePath__forwardSlashesPathSeparators: string,
          eventName: FilesMasterWatcher.EventsNames
        ) => void;
      }>;

}


export default ElectronFilesWatcher;
