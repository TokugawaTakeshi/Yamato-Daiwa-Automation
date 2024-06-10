/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type VideosProcessingSettings__Normalized from "@VideosProcessing/VideosProcessingSettings__Normalized";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type VideosProcessingSettingsRepresentative from "@VideosProcessing/VideosProcessingSettingsRepresentative";

/* ─── Source Files Watcher ───────────────────────────────────────────────────────────────────────────────────────── */
import VideosSourceFilesWatcher from "@VideosProcessing/VideosSourceFilesWatcher";

/* ─── Superclass ─────────────────────────────────────────────────────────────────────────────────────────────────── */
import GulpStreamsBasedAssetsProcessor from "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBasedAssetsProcessor";

/* ─── Shared State ───────────────────────────────────────────────────────────────────────────────────────────────── */
import VideosProcessingSharedState from "@VideosProcessing/VideosProcessingSharedState";

/* ─── Gulp & Plugins ─────────────────────────────────────────────────────────────────────────────────────────────── */
import Gulp from "gulp";
import type VinylFile from "vinyl";

/* ─── Applied Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import GulpStreamModifier from "@Utils/GulpStreamModifier";
import createImmediatelyEndingEmptyStream from "@Utils/createImmediatelyEndingEmptyStream";
import AssetVinylFile from "@ProjectBuilding/Common/VinylFiles/AssetVinylFile";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import { isUndefined, readonlyArrayToMutableOne } from "@yamato-daiwa/es-extensions";
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


export default class VideosProcessor extends GulpStreamsBasedAssetsProcessor<
  VideosProcessingSettings__Normalized.Common,
  VideosProcessingSettings__Normalized.AssetsGroup,
  VideosProcessingSettingsRepresentative
> {

  public static provideVideosProcessingIfMust(
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): () => NodeJS.ReadWriteStream {

    const videosProcessingSettingsRepresentative: VideosProcessingSettingsRepresentative | undefined =
        projectBuildingMasterConfigRepresentative.videosProcessingSettingsRepresentative;

    if (isUndefined(videosProcessingSettingsRepresentative)) {
      return createImmediatelyEndingEmptyStream();
    }


    const dataHoldingSelfInstance: VideosProcessor = new VideosProcessor(
      projectBuildingMasterConfigRepresentative, videosProcessingSettingsRepresentative
    );

    if (projectBuildingMasterConfigRepresentative.mustProvideIncrementalBuilding) {

      VideosSourceFilesWatcher.
          initializeIfRequiredAndGetInstance({
            videosProcessingSettingsRepresentative,
            projectBuildingMasterConfigRepresentative
          }).
          addOnFileAddedEventHandler({
            handlerID: "ON_VIDEO_FILE_ADDED--BY_VIDEOS_PROCESSOR",
            handler: dataHoldingSelfInstance.onSourceFilesWatcherEmittedFileAddingOrUpdatingEvent.bind(dataHoldingSelfInstance)
          }).
          addFileUpdatedEventHandler({
            handlerID: "ON_VIDEO_FILE_UPDATED--BY_VIDEOS_PROCESSOR",
            handler: dataHoldingSelfInstance.onSourceFilesWatcherEmittedFileAddingOrUpdatingEvent.bind(dataHoldingSelfInstance)
          }).
          addOnFileDeletedEventHandler({
            handlerID: "ON_VIDEO_FILE_DELETED--BY_VIDEOS_PROCESSOR",
            handler: dataHoldingSelfInstance.onVideoFileDeleted.bind(dataHoldingSelfInstance)
          });

    }

    return dataHoldingSelfInstance.processAssets(videosProcessingSettingsRepresentative.actualAssetsSourceFilesAbsolutePaths);

  }


  private constructor(
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative,
    videosProcessingConfigRepresentative: VideosProcessingSettingsRepresentative
  ) {
    super({
      projectBuildingMasterConfigRepresentative,
      associatedAssetsProcessingSettingsRepresentative: videosProcessingConfigRepresentative,
      taskTitleForLogging: "Videos processing",
      waitingForSubsequentFilesWillSavedPeriod__seconds: videosProcessingConfigRepresentative.assetsProcessingCommonSettings.
          periodBetweenFileUpdatingAndRebuildingStarting__seconds
    });
  }


  protected processAssets(sourceFilesAbsolutePaths: ReadonlyArray<string>): () => NodeJS.ReadWriteStream {

    /* [ Theory ] If to pass the empty array to 'Gulp.src(".")' error will occur but the cause will not be told clearly.
     *    However, the empty array is usual scenario (for example when user declared the configuration but has not added
     *    all files yet).  */
    if (sourceFilesAbsolutePaths.length === 0) {
      return (): NodeJS.ReadWriteStream => Gulp.src(".");
    }


    return (): NodeJS.ReadWriteStream => Gulp.

        src(readonlyArrayToMutableOne(sourceFilesAbsolutePaths)).

        pipe(super.handleErrorIfItWillOccur()).
        pipe(super.logProcessedFilesIfMust()).

        pipe(
          GulpStreamModifier.modify({
            onStreamStartedEventCommonHandler: this.replacePlainVinylFileWithAssetVinylFile.bind(this)
          })
        ).

        pipe(
          GulpStreamModifier.modify({
            onStreamStartedEventHandlersForSpecificFileTypes: new Map([
              [ AssetVinylFile, GulpStreamsBasedAssetsProcessor.addContentHashPostfixToFileNameIfMust ]
            ])
          })
        ).

        pipe(
          GulpStreamModifier.modify({
            onStreamStartedEventHandlersForSpecificFileTypes: new Map([
              [ AssetVinylFile, VideosProcessor.postProcessFile ]
            ])
          })
        ).

        pipe(
          Gulp.dest(
            (targetFileInFinalState: VinylFile): string =>
                AssetVinylFile.getOutputDirectoryAbsolutePathOfExpectedToBeSelfInstance(targetFileInFinalState)
          )
        );

  }


  /* ━━━ Files watcher handlers ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private onVideoFileDeleted(targetVideoFileAbsolutePath: string): void {
    this.absolutePathOfFilesWaitingForReProcessing.delete(targetVideoFileAbsolutePath);
    VideosProcessingSharedState.sourceFilesAbsolutePathsAndOutputFilesActualPathsMap.delete(targetVideoFileAbsolutePath);
  }


  /* ━━━ Pipeline methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private static async postProcessFile(processedVideoFile: AssetVinylFile): Promise<GulpStreamModifier.CompletionSignals> {

    VideosProcessingSharedState.sourceFilesAbsolutePathsAndOutputFilesActualPathsMap.set(
      ImprovedPath.replacePathSeparatorsToForwardSlashes(processedVideoFile.sourceAbsolutePath),
        ImprovedPath.joinPathSegments(
          [ processedVideoFile.outputDirectoryAbsolutePath, processedVideoFile.basename ],
          { alwaysForwardSlashSeparators: true }
        )
    );

    return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);

  }

}
