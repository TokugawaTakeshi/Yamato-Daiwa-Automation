/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type AudiosProcessingSettings__Normalized from "@AudiosProcessing/AudiosProcessingSettings__Normalized";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type AudiosProcessingSettingsRepresentative from "@AudiosProcessing/AudiosProcessingSettingsRepresentative";

/* ─── Source Files Watcher ───────────────────────────────────────────────────────────────────────────────────────── */
import AudiosSourceFilesWatcher from "@AudiosProcessing/AudiosSourceFilesWatcher";

/* ─── Superclass ─────────────────────────────────────────────────────────────────────────────────────────────────── */
import GulpStreamsBasedAssetsProcessor from "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBasedAssetsProcessor";

/* ─── Shared State ───────────────────────────────────────────────────────────────────────────────────────────────── */
import AudiosProcessingSharedState from "@AudiosProcessing/AudiosProcessingSharedState";

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


export default class AudiosProcessor extends GulpStreamsBasedAssetsProcessor<
  AudiosProcessingSettings__Normalized.Common,
  AudiosProcessingSettings__Normalized.AssetsGroup,
  AudiosProcessingSettingsRepresentative
> {

  public static provideAudiosProcessingIfMust(
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): () => NodeJS.ReadWriteStream {

    const audiosProcessingSettingsRepresentative: AudiosProcessingSettingsRepresentative | undefined =
        projectBuildingMasterConfigRepresentative.audiosProcessingSettingsRepresentative;

    if (isUndefined(audiosProcessingSettingsRepresentative)) {
      return createImmediatelyEndingEmptyStream();
    }


    const dataHoldingSelfInstance: AudiosProcessor = new AudiosProcessor(
      projectBuildingMasterConfigRepresentative, audiosProcessingSettingsRepresentative
    );

    if (projectBuildingMasterConfigRepresentative.mustProvideIncrementalBuilding) {

      AudiosSourceFilesWatcher.
          initializeIfRequiredAndGetInstance({
            audiosProcessingSettingsRepresentative,
            projectBuildingMasterConfigRepresentative
          }).
          addOnFileAddedEventHandler({
            handlerID: "ON_AUDIO_FILE_ADDED--BY_AUDIOS_PROCESSOR",
            handler: dataHoldingSelfInstance.onSourceFilesWatcherEmittedFileAddingOrUpdatingEvent.bind(dataHoldingSelfInstance)
          }).
          addFileUpdatedEventHandler({
            handlerID: "ON_AUDIO_FILE_UPDATED--BY_AUDIOS_PROCESSOR",
            handler: dataHoldingSelfInstance.onSourceFilesWatcherEmittedFileAddingOrUpdatingEvent.bind(dataHoldingSelfInstance)
          }).
          addOnFileDeletedEventHandler({
            handlerID: "ON_AUDIO_FILE_DELETED--BY_AUDIOS_PROCESSOR",
            handler: dataHoldingSelfInstance.onAudioFileDeleted.bind(dataHoldingSelfInstance)
          });

    }


    return dataHoldingSelfInstance.processAssets(audiosProcessingSettingsRepresentative.actualAssetsSourceFilesAbsolutePaths);

  }


  private constructor(
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative,
    audiosProcessingSettingsRepresentative: AudiosProcessingSettingsRepresentative
  ) {
    super({
      projectBuildingMasterConfigRepresentative,
      associatedAssetsProcessingSettingsRepresentative: audiosProcessingSettingsRepresentative,
      taskTitleForLogging: "Audios processing",
      waitingForSubsequentFilesWillSavedPeriod__seconds: audiosProcessingSettingsRepresentative.assetsProcessingCommonSettings.
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
          GulpStreamModifier.modifyForSingleVinylFileSubtype({
            onStreamStartedEventHandler: this.replacePlainVinylFileWithAssetVinylFile.bind(this)
          })
        ).

        pipe(
          GulpStreamModifier.modifyForSingleVinylFileSubtype({
            onStreamStartedEventHandler: GulpStreamsBasedAssetsProcessor.addContentHashPostfixToFileNameIfMust
          })
        ).

        pipe(
          GulpStreamModifier.modifyForSingleVinylFileSubtype({
            onStreamStartedEventHandler: AudiosProcessor.postProcessFile
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
  private onAudioFileDeleted(targetAudioFileAbsolutePath: string): void {
    this.absolutePathOfFilesWaitingForReProcessing.delete(targetAudioFileAbsolutePath);
    AudiosProcessingSharedState.sourceFilesAbsolutePathsAndOutputFilesActualPathsMap.delete(targetAudioFileAbsolutePath);
  }


  /* ━━━ Pipeline methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private static async postProcessFile(processedAudioFile: AssetVinylFile): Promise<GulpStreamModifier.CompletionSignals> {

    AudiosProcessingSharedState.sourceFilesAbsolutePathsAndOutputFilesActualPathsMap.set(
      ImprovedPath.replacePathSeparatorsToForwardSlashes(processedAudioFile.sourceAbsolutePath),
        ImprovedPath.joinPathSegments(
          [ processedAudioFile.outputDirectoryAbsolutePath, processedAudioFile.basename ],
          { alwaysForwardSlashSeparators: true }
        )
    );

    return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);

  }

}
