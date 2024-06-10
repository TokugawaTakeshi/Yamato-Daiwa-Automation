import FilesPassiveWatcher from "@ProjectBuilding/FilesWatching/Watchers/FilesPassiveWatcher";
import FilesMasterWatcher from "@ProjectBuilding/FilesWatching/Watchers/FilesMasterWatcher";
import { ImprovedGlob } from "@yamato-daiwa/es-extensions-nodejs";
import type BrowserLiveReloadingSettingsRepresentative from
    "@BrowserLiveReloading/BrowserLiveReloadingSettingsRepresentative";


class BrowserCoordinatorRelatedFilesWatcher extends FilesPassiveWatcher {

  protected readonly onAnyEventRelatedWithActualFilesHandler: (
    targetFileAbsolutePath__forwardSlashesPathSeparators: string,
    eventName: FilesMasterWatcher.EventsNames
  ) => void;


  public static initialize(
    initializationRequirements: BrowserCoordinatorRelatedFilesWatcher.InitializationRequirements
  ): void {
    FilesMasterWatcher.addPassiveWatcher(new BrowserCoordinatorRelatedFilesWatcher(initializationRequirements));
  }


  protected constructor(
    {
      browserLiveReloadingSettingsRepresentative,
      onAnyEventRelatedWithActualFilesHandler
    }: BrowserCoordinatorRelatedFilesWatcher.InitializationRequirements
  ) {

    super({
      ID: "BROWSER_COORDINATOR_RELATED_FILES_WATCHER",
      targetFilesGlobSelectors: [
        ImprovedGlob.buildAllFilesInCurrentDirectoryAndBelowGlobSelector({
          basicDirectoryPath: browserLiveReloadingSettingsRepresentative.targetFilesRootDirectoryAbsolutePath
        })
      ],
      mustLogEvents: browserLiveReloadingSettingsRepresentative.mustLogOutputFileChangeDetection
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


namespace BrowserCoordinatorRelatedFilesWatcher {

  export type InitializationRequirements =
      Readonly<{
        browserLiveReloadingSettingsRepresentative: BrowserLiveReloadingSettingsRepresentative;
        onAnyEventRelatedWithActualFilesHandler: (
          targetFileAbsolutePath__forwardSlashesPathSeparators: string,
          eventName: FilesMasterWatcher.EventsNames
        ) => void;
      }>;

}


export default BrowserCoordinatorRelatedFilesWatcher;
