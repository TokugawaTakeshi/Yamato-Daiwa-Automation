/* --- Task executors ----------------------------------------------------------------------------------------------- */
import GulpStreamsBasedTaskExecutor from "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBased/GulpStreamsBasedTaskExecutor";

/* --- Applied utils ------------------------------------------------------------------------------------------------ */
import Gulp from "gulp";
import type { FSWatcher } from "fs";

/* --- Third-party solutions specialises ---------------------------------------------------------------------------- */
import ChokidarSpecialist from "@ThirdPartySolutionsSpecialists/Chokidar/ChokidarSpecialist";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import Timeout = NodeJS.Timeout;
import { Logger, secondsToMilliseconds } from "@yamato-daiwa/es-extensions";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";


export default abstract class GulpStreamsBasedSourceCodeLinter extends GulpStreamsBasedTaskExecutor {

  private static readonly WAITING_FOR_THE_FILES_OF_SAME_TYPE_WILL_BE_SAVED_PERIOD__SECONDS: number = 1;

  protected abstract targetFilesGlobSelectors: Array<string>;
  protected abstract LINTER_NAME: string;

  private sourceFilesActiveWatcher: FSWatcher | null = null;

  private readonly queueToProcessingOfAbsolutePathsOfFilesWhichStatusHasChanged: Set<string> = new Set();
  private readonly onActualSourceFileHasBeenDeletedEventListeners: Array<() => void> = [];


  protected abstract lint(globSelectorOrAbsolutePathsOfTargetFiles: Array<string>): () => NodeJS.ReadWriteStream;


  protected initializeOrUpdateSourceFilesWatcher(): void {

    let waitingForOtherActualFilesWillBeSavedTimer: Timeout;

    this.sourceFilesActiveWatcher = Gulp.watch(this.targetFilesGlobSelectors).

        on("all", (eventName: string, fileOrDirectoryPath: string): void => {

          Logger.logInfo({
            title: `Files watcher of "${ this.LINTER_NAME }"`,
            description:
                `          Event : ${ ChokidarSpecialist.getEventNameInterpretation(eventName) }` +
                `\n    File path : ${ fileOrDirectoryPath }`
          });


          if (
            eventName === ChokidarSpecialist.EventsNames.directoryAdded ||
            eventName === ChokidarSpecialist.EventsNames.directoryDeleted
          ) {
            return;
          }


          if (
            eventName === ChokidarSpecialist.EventsNames.fileDeleted
          ) {

            for (const onActualSourceFileHasBeenDeletedEventListener of this.onActualSourceFileHasBeenDeletedEventListeners) {
              onActualSourceFileHasBeenDeletedEventListener();
            }

            return;

          }

          clearTimeout(waitingForOtherActualFilesWillBeSavedTimer);

          Logger.logInfo({
            title: `Files watcher of "${ this.LINTER_NAME }"`,
            description: "Waiting for the saving of files of same type..."
          });


          /* [ Theory ] Chokidar does not understand the backslashes path separators. */
          this.queueToProcessingOfAbsolutePathsOfFilesWhichStatusHasChanged.
              add(ImprovedPath.replacePathSeparatorsToForwardSlashes(fileOrDirectoryPath));

          waitingForOtherActualFilesWillBeSavedTimer = setTimeout(
            this.onFilesSetReadyToLinting.bind(this),
            secondsToMilliseconds(
              GulpStreamsBasedSourceCodeLinter.WAITING_FOR_THE_FILES_OF_SAME_TYPE_WILL_BE_SAVED_PERIOD__SECONDS
            )
          );

        });

  }

  protected addOnActualSourceFileHasBeenDeletedEventListener(onActualSourceFileHasBeenDeletedEventListener: () => void): void {
    this.onActualSourceFileHasBeenDeletedEventListeners.push(onActualSourceFileHasBeenDeletedEventListener);
  }


  private onFilesSetReadyToLinting(): void {

    if (this.queueToProcessingOfAbsolutePathsOfFilesWhichStatusHasChanged.size > 0) {
      this.lint(Array.from(this.queueToProcessingOfAbsolutePathsOfFilesWhichStatusHasChanged))();
      this.queueToProcessingOfAbsolutePathsOfFilesWhichStatusHasChanged.clear();
    }

    /* [ Theory ]
     * Even if to assign
     * <code> this.sourceFilesActiveWatcher = null </code>
     * whe watcher is still existing. To utilize it, it's required to close it.
     * <code> this.sourceFilesActiveWatcher.close() </code>
     * But if to close it, the Gulp pipeline will stop. To prevent it, before the utilization it's required to reassign
     * the old watcher.
     */
    let outdatedMarkupFilesWatcher: FSWatcher | null = this.sourceFilesActiveWatcher;
    this.initializeOrUpdateSourceFilesWatcher();

    outdatedMarkupFilesWatcher?.close();
    outdatedMarkupFilesWatcher = null;
  }

}
