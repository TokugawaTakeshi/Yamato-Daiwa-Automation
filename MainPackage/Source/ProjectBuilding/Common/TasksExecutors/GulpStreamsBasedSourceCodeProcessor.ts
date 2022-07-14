/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";
import SourceCodeProcessingCommonSettingsGenericProperties = ProjectBuildingConfig__Normalized.
    SourceCodeProcessingCommonSettingsGenericProperties;
import EntryPointsGroupGenericSettings = ProjectBuildingConfig__Normalized.EntryPointsGroupGenericSettings;

/* --- Settings representatives ------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type GulpStreamBasedSourceCodeProcessingConfigRepresentative from
    "@ProjectBuilding/Common/SettingsRepresentatives/GulpStreamBasedSourceCodeProcessingConfigRepresentative";

/* --- Task executors ----------------------------------------------------------------------------------------------- */
import GulpStreamsBasedTaskExecutor from "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBasedTaskExecutor";

/* --- Applied utils ------------------------------------------------------------------------------------------------ */
import type { FSWatcher } from "fs";
import ChokidarSpecialist from "@ThirdPartySolutionsSpecialists/ChokidarSpecialist";
import Gulp from "gulp";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import {
  Logger,
  isNotUndefined,
  addMultipleElementsToSet,
  secondsToMilliseconds
} from "@yamato-daiwa/es-extensions";
import Timeout = NodeJS.Timeout;
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";
import ImprovedGlob from "@UtilsIncubator/ImprovedGlob";


export default abstract class GulpStreamsBasedSourceCodeProcessor<
  SourceCodeProcessorsCommonSettings__Normalized extends SourceCodeProcessingCommonSettingsGenericProperties,
  EntryPointsGroupSettings__Normalized extends EntryPointsGroupGenericSettings,
  AssociatedSourceCodeProcessingConfigRepresentative extends GulpStreamBasedSourceCodeProcessingConfigRepresentative<
      SourceCodeProcessorsCommonSettings__Normalized, EntryPointsGroupSettings__Normalized
  >
> extends GulpStreamsBasedTaskExecutor {

  protected readonly globSelectorsOfSourceFilesWithSupportedFilenameExtensionsInEntryPointsGroupRootDirectoryAndBelow:
      Array<string> = [];
  protected mutableGlobSelectorsOfSourceFilesWhichWillBeWatched: Array<string> = [];

  protected associatedSourceCodeProcessingSettingsRepresentative: AssociatedSourceCodeProcessingConfigRepresentative;

  private sourceFilesActiveWatcher: FSWatcher | null = null;
  private readonly queueToProcessingOfAbsolutePathsOfFilesWhichStatusHasChanged: Set<string> = new Set();


  protected constructor(
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative,
    associatedSourceCodeProcessingConfigRepresentative: AssociatedSourceCodeProcessingConfigRepresentative
  ) {
    super(masterConfigRepresentative);
    this.associatedSourceCodeProcessingSettingsRepresentative = associatedSourceCodeProcessingConfigRepresentative;
  }


  protected abstract processEntryPoints(entryPointsSourceFilesAbsolutePaths: Array<string>): () => NodeJS.ReadWriteStream;


  protected initializeSourceFilesDirectoriesWhichAlwaysWillBeBeingWatchedGlobSelectors(): void {
    this.globSelectorsOfSourceFilesWithSupportedFilenameExtensionsInEntryPointsGroupRootDirectoryAndBelow.push(
        ...this.associatedSourceCodeProcessingSettingsRepresentative.
            relevantEntryPointsSourceDirectoriesAbsolutePaths.
            map(
              (entryPointsSourceFilesDirectoryAbsolutePath: string): string =>
                  ImprovedGlob.buildAllFilesInCurrentDirectoryAndBelowGlobSelector({
                    basicDirectoryPath: entryPointsSourceFilesDirectoryAbsolutePath,
                    fileNamesExtensions: this.associatedSourceCodeProcessingSettingsRepresentative.
                        supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots
                  })
            )
    );
  }

  protected initializeOrUpdateWatchedSourceFilesGlobSelectors(): void {

    const partialSourceFilesOutsideOfAllEntryPointsDirectoriesOrWithExtraordinaryFilenameExtension: Array<string> = [];

    for (
      const partialFileAbsolutePath
      of this.associatedSourceCodeProcessingSettingsRepresentative.partialFilesAndEntryPointsRelationsMap.keys()
    ) {

      let isFileInSomeEntryPointsDirectoryOrBelowItAndHasOrdinaryFilenameExtension: boolean = false;

      for (
        const sourceFilesDirectoryThatAlwaysWillBeBeingWatchedGlobSelector
        of this.globSelectorsOfSourceFilesWithSupportedFilenameExtensionsInEntryPointsGroupRootDirectoryAndBelow
      ) {
        if (ImprovedGlob.isFileMatchingWithGlobSelector({
          filePath: partialFileAbsolutePath,
          globSelector: sourceFilesDirectoryThatAlwaysWillBeBeingWatchedGlobSelector
        })) {
          isFileInSomeEntryPointsDirectoryOrBelowItAndHasOrdinaryFilenameExtension = true;
          break;
        }
      }


      if (!isFileInSomeEntryPointsDirectoryOrBelowItAndHasOrdinaryFilenameExtension) {
        partialSourceFilesOutsideOfAllEntryPointsDirectoriesOrWithExtraordinaryFilenameExtension.push(partialFileAbsolutePath);
      }
    }

    this.mutableGlobSelectorsOfSourceFilesWhichWillBeWatched =
        this.globSelectorsOfSourceFilesWithSupportedFilenameExtensionsInEntryPointsGroupRootDirectoryAndBelow.
            concat(partialSourceFilesOutsideOfAllEntryPointsDirectoriesOrWithExtraordinaryFilenameExtension);
  }

  protected initializeOrUpdateSourceFilesWatcher(): void {

    let waitingForOtherFilesWillBeSavedDuration: Timeout;

    this.sourceFilesActiveWatcher = Gulp.watch(this.mutableGlobSelectorsOfSourceFilesWhichWillBeWatched).

        on("all", (eventName: string, fileOrDirectoryPath: string): void => {

          Logger.logInfo({
            title: `${ this.associatedSourceCodeProcessingSettingsRepresentative.TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM } ` +
                "files watcher",
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


          clearTimeout(waitingForOtherFilesWillBeSavedDuration);
          Logger.logInfo({
            title: `${ this.associatedSourceCodeProcessingSettingsRepresentative.TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM } ` +
                "files watcher",
            description: "Waiting for the saving of same type files..."
          });


          /* [ Theory ] Chokidar does not understand the backslashes path separators. */
          this.queueToProcessingOfAbsolutePathsOfFilesWhichStatusHasChanged.
              add(ImprovedPath.replacePathSeparatorsToForwardSlashes(fileOrDirectoryPath));

          waitingForOtherFilesWillBeSavedDuration = setTimeout(
            this.onFilesSetReadyToProcessing.bind(this),
            secondsToMilliseconds(
              this.associatedSourceCodeProcessingSettingsRepresentative.waitingForTheOtherFilesWillBeSavedPeriod__seconds
            )
          );
        });
  }


  private onFilesSetReadyToProcessing(): void {

    this.associatedSourceCodeProcessingSettingsRepresentative.initializeOrUpdatePartialFilesAndEntryPointsRelationsMap();

    const entryPointsWillBeProcessed: Set<string> = new Set();

    for (const fileWithChangedStateAbsolutePath of this.queueToProcessingOfAbsolutePathsOfFilesWhichStatusHasChanged) {

      const targetParentEntryPoints: Set<string> | undefined = this.associatedSourceCodeProcessingSettingsRepresentative.
          partialFilesAndEntryPointsRelationsMap.get(fileWithChangedStateAbsolutePath);

      /* [ Theory ] No need to process the deleted files (the delete event will occur also when file has been moved.) */
      if (isNotUndefined(targetParentEntryPoints)) {
        addMultipleElementsToSet(entryPointsWillBeProcessed, Array.from(targetParentEntryPoints));
      }
    }


    this.queueToProcessingOfAbsolutePathsOfFilesWhichStatusHasChanged.clear();

    if (entryPointsWillBeProcessed.size > 0) {
      this.processEntryPoints(Array.from(entryPointsWillBeProcessed))();
    }

    this.initializeOrUpdateWatchedSourceFilesGlobSelectors();

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
