/* ─── Third-party Solutions Specialists ──────────────────────────────────────────────────────────────────────────── */
import ChokidarSpecialist from "@ThirdPartySolutionsSpecialists/Chokidar/ChokidarSpecialist";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type FilesWatchingSettingsRepresentative from "@ProjectBuilding/FilesWatching/FilesWatchingSettingsRepresentative";

/* ─── Applied Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import type FilesPassiveWatcher from "@ProjectBuilding/FilesWatching/Watchers/FilesPassiveWatcher";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import Gulp from "gulp";
import { ImprovedGlob, ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";
import { isUndefined } from "@yamato-daiwa/es-extensions";


abstract class FilesMasterWatcher {

  private static readonly passiveWatchers: Set<FilesPassiveWatcher> = new Set<FilesPassiveWatcher>();


  public static watchIfMust(
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): (callback: (error?: Error | null) => void) => void {

    const filesWatchingSettingsRepresentative: FilesWatchingSettingsRepresentative | undefined =
        projectBuildingMasterConfigRepresentative.filesWatchingSettingsRepresentative;

    if (isUndefined(filesWatchingSettingsRepresentative) || !filesWatchingSettingsRepresentative.mustProvideFilesWatching) {
      return (callback: () => void): void => { callback(); };
    }


    return (callback: (error?: Error | null) => void): void => {

      Gulp.
          watch([
            ImprovedGlob.buildAllFilesInCurrentDirectoryAndBelowGlobSelector({
              basicDirectoryPath: projectBuildingMasterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath
            }),
            ...filesWatchingSettingsRepresentative.exclusiveGlobsOfExcludedFilesAndDirectories
          ]).
          on("all", FilesMasterWatcher.onAnyChokidarEvent.bind(this));

      callback();

    };

  }

  public static addPassiveWatcher(passiveWatcher: FilesPassiveWatcher): void {
    FilesMasterWatcher.passiveWatchers.add(passiveWatcher);
  }


  /* [ Chokidar theory ] While the globs are absolute path based, the second parameter will be the absolute path too. */
  private static onAnyChokidarEvent(
    chokidarEventName: ChokidarSpecialist.EventsNames,
    targetFileOrDirectoryAbsolutePath__operatingSystemDependentPathSeparators: string
  ): void {

    let eventName: FilesMasterWatcher.EventsNames;

    /* eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check --
     * Only operations with files are actual in this case.  */
    switch (chokidarEventName) {

      case ChokidarSpecialist.EventsNames.fileAdded: {
        eventName = FilesMasterWatcher.EventsNames.fileAdded;
        break;
      }

      case ChokidarSpecialist.EventsNames.fileChanged: {
        eventName = FilesMasterWatcher.EventsNames.fileUpdated;
        break;
      }

      case ChokidarSpecialist.EventsNames.fileDeleted: {
        eventName = FilesMasterWatcher.EventsNames.fileDeleted;
        break;
      }

      default: {
        return;
      }

    }

    const targetFileAbsolutePath__forwardSlashesPathSeparators: string = ImprovedPath.
        replacePathSeparatorsToForwardSlashes(
          targetFileOrDirectoryAbsolutePath__operatingSystemDependentPathSeparators
        );

    for (const passiveWatcher of FilesMasterWatcher.passiveWatchers) {

      if (passiveWatcher.isRelatedFileAbsolutePath(targetFileAbsolutePath__forwardSlashesPathSeparators)) {
        passiveWatcher.notifyAboutRelatedFileStateChange(targetFileAbsolutePath__forwardSlashesPathSeparators, eventName);
      }

    }

  }

}


namespace FilesMasterWatcher {

  export enum EventsNames {
    fileAdded = "FILE_ADDED",
    fileUpdated = "FILE_UPDATED",
    fileDeleted = "FILE_DELETED"
  }

}


export default FilesMasterWatcher;
