import type FilesMasterWatcher from "@ProjectBuilding/FilesWatching/Watchers/FilesMasterWatcher";
import { ImprovedGlob } from "@yamato-daiwa/es-extensions-nodejs";


abstract class FilesPassiveWatcher {

  public readonly ID: string;

  protected mustLogEvents: boolean;
  protected targetFilesGlobSelectors: Array<string>;


  protected constructor(
    {
      ID,
      targetFilesGlobSelectors,
      mustLogEvents
    }: FilesPassiveWatcher.InitializationRequirements
  ) {
    this.ID = ID;
    this.targetFilesGlobSelectors = targetFilesGlobSelectors;
    this.mustLogEvents = mustLogEvents;
  }


  public abstract notifyAboutRelatedFileStateChange(
    targetFileAbsolutePath__forwardSlashesPathSeparators: string,
    eventName: FilesMasterWatcher.EventsNames
  ): void;


  public isRelatedFileAbsolutePath(targetFilePath: string): boolean {
    return ImprovedGlob.isFilePathMatchingWithAllGlobSelectors({
      filePath: targetFilePath, globSelectors: this.targetFilesGlobSelectors
    });
  }

}


namespace FilesPassiveWatcher {

  export type InitializationRequirements = Readonly<{
    ID: string;
    targetFilesGlobSelectors: Array<string>;
    mustLogEvents: boolean;
  }>;

}


export default FilesPassiveWatcher;
