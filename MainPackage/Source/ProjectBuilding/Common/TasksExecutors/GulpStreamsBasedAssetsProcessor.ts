/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";
import AssetsProcessingCommonSettingsGenericProperties = ProjectBuildingConfig__Normalized.
    AssetsProcessingCommonSettingsGenericProperties;
import AssetsGroupSettingsGenericProperties = ProjectBuildingConfig__Normalized.AssetsGroupSettingsGenericProperties;

/* --- Settings representatives ------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type AssetsProcessingSettingsRepresentative from
    "@ProjectBuilding/Common/SettingsRepresentatives/AssetsProcessingSettingsRepresentative";

/* --- Task executors ----------------------------------------------------------------------------------------------- */
import GulpStreamsBasedTaskExecutor from "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBasedTaskExecutor";

/* --- Applied utils ------------------------------------------------------------------------------------------------ */
import Gulp from "gulp";
import ChokidarSpecialist from "@ThirdPartySolutionsSpecialists/ChokidarSpecialist";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import Timeout = NodeJS.Timeout;
import {
  Logger,
  isNotNull,
  secondsToMilliseconds
} from "@yamato-daiwa/es-extensions";


export default abstract class GulpStreamsBasedAssetsProcessor<
  AssetsManagerCommonSettings__Normalized extends AssetsProcessingCommonSettingsGenericProperties,
  AssetsGroupSettings__Normalized extends AssetsGroupSettingsGenericProperties,
  CertainAssetsManagerConfigRepresentative extends AssetsProcessingSettingsRepresentative<
    AssetsManagerCommonSettings__Normalized, AssetsGroupSettings__Normalized
  >
> extends GulpStreamsBasedTaskExecutor {

  private static readonly WAITING_FOR_OTHER_FILES_WILL_BE_SAVED_PERIOD__SECONDS: number = 1;

  protected readonly abstract SOURCE_FILES_TYPE_LABEL_FOR_LOGGING: string;

  protected associatedAssetsProcessingConfigRepresentative: CertainAssetsManagerConfigRepresentative;

  private readonly filesWhichStatusHasBeenChangedAbsolutePathsQueueToProcessing: Set<string> = new Set();
  private waitingForOtherFilesWillBeSavedDuration: Timeout | null = null;


  protected constructor(
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative,
    certainAssetsManagementConfigRepresentative: CertainAssetsManagerConfigRepresentative
  ) {
    super(masterConfigRepresentative);
    this.associatedAssetsProcessingConfigRepresentative = certainAssetsManagementConfigRepresentative;
  }


  protected abstract processAssets(sourceFilesAbsolutePathsOrGlobs: Array<string>): () => NodeJS.ReadWriteStream;


  protected initializeOrUpdateSourceFilesWatcher(): void {

    Gulp.watch(this.associatedAssetsProcessingConfigRepresentative.relevantSourceFilesGlobSelectors).
        on("all", (eventName: string, fileOrDirectoryPath: string): void => {

          Logger.logInfo({
            title: `${ this.SOURCE_FILES_TYPE_LABEL_FOR_LOGGING } files watcher`,
            description:
                `          Event : ${ ChokidarSpecialist.getEventNameInterpretation(eventName) }` +
                `\n        Path : ${ fileOrDirectoryPath }`
          });

          if (
            eventName === ChokidarSpecialist.EventsNames.directoryAdded ||
            eventName === ChokidarSpecialist.EventsNames.directoryDeleted ||
            eventName === ChokidarSpecialist.EventsNames.fileDeleted
          ) {
            return;
          }


          if (isNotNull(this.waitingForOtherFilesWillBeSavedDuration)) {
            clearTimeout(this.waitingForOtherFilesWillBeSavedDuration);
          }

          Logger.logInfo({
            title: `${ this.SOURCE_FILES_TYPE_LABEL_FOR_LOGGING } files watcher`,
            description: "Waiting for the saving of same type files..."
          });

          this.filesWhichStatusHasBeenChangedAbsolutePathsQueueToProcessing.add(fileOrDirectoryPath);

          this.waitingForOtherFilesWillBeSavedDuration = setTimeout((): void => {

            if (this.filesWhichStatusHasBeenChangedAbsolutePathsQueueToProcessing.size > 0) {
              this.processAssets(Array.from(this.filesWhichStatusHasBeenChangedAbsolutePathsQueueToProcessing))();
            }

            this.filesWhichStatusHasBeenChangedAbsolutePathsQueueToProcessing.clear();

          }, secondsToMilliseconds(GulpStreamsBasedAssetsProcessor.WAITING_FOR_OTHER_FILES_WILL_BE_SAVED_PERIOD__SECONDS));
        });
  }
}
