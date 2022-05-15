/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type AudiosProcessingSettings__Normalized from "@AudiosProcessing/AudiosProcessingSettings__Normalized";

/* --- Settings representatives ------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type AudiosProcessingSettingsRepresentative from "@AudiosProcessing/AudiosProcessingSettingsRepresentative";

/* --- Tasks executors ---------------------------------------------------------------------------------------------- */
import GulpStreamsBasedAssetsProcessor from "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBasedAssetsProcessor";
import type GulpStreamsBasedTaskExecutor from "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBasedTaskExecutor";

/* --- Applied utils ------------------------------------------------------------------------------------------------ */
import Gulp from "gulp";
import type VinylFile from "vinyl";
import gulpIntercept from "gulp-intercept";
import FileNameRevisionPostfixer from "@Utils/FileNameRevisionPostfixer";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import { PassThrough } from "stream";
import { isUndefined } from "@yamato-daiwa/es-extensions";


class AudiosProcessor extends GulpStreamsBasedAssetsProcessor<
  AudiosProcessingSettings__Normalized.Common,
  AudiosProcessingSettings__Normalized.AssetsGroup,
  AudiosProcessingSettingsRepresentative
> {

  protected readonly TASK_NAME_FOR_LOGGING: string = "録音管理";
  protected readonly SOURCE_FILES_TYPE_LABEL_FOR_LOGGING: string = "録音";

  private readonly audiosProcessingConfigRepresentative: AudiosProcessingSettingsRepresentative;


  public static provideAudiosProcessingIfMust(
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): () => NodeJS.ReadWriteStream {

    const audiosProcessingSettingsRepresentative: AudiosProcessingSettingsRepresentative | undefined =
        masterConfigRepresentative.audiosProcessingSettingsRepresentative;

    if (isUndefined(audiosProcessingSettingsRepresentative)) {
      return (): NodeJS.ReadWriteStream => new PassThrough().end();
    }


    const dataHoldingSelfInstance: AudiosProcessor = new AudiosProcessor(
      masterConfigRepresentative, audiosProcessingSettingsRepresentative
    );

    dataHoldingSelfInstance.initializeOrUpdateSourceFilesWatcher();

    const assetsSourceFilesAbsolutePathsRelevantForCurrentProjectBuildingMode: Array<string> =
        audiosProcessingSettingsRepresentative.actualAssetsSourceFilesAbsolutePaths;

    return dataHoldingSelfInstance.processAssets(assetsSourceFilesAbsolutePathsRelevantForCurrentProjectBuildingMode);
  }


  private constructor(
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative,
    audiosProcessingConfigRepresentative: AudiosProcessingSettingsRepresentative
  ) {
    super(masterConfigRepresentative, audiosProcessingConfigRepresentative);
    this.audiosProcessingConfigRepresentative = audiosProcessingConfigRepresentative;
  }


  protected processAssets(sourceFilesAbsolutePaths: Array<string>): () => NodeJS.ReadWriteStream {

    /* [ Theory ] If to pass the empty array to 'Gulp.src(".")' error will occur but the cause will not be told clearly.
     *    However, the empty array is usual scenario (for example when user declared the configuration but has not added
     *    all files yet).  */
    if (sourceFilesAbsolutePaths.length === 0) {
      return (): NodeJS.ReadWriteStream => Gulp.src(".");
    }


    return (): NodeJS.ReadWriteStream => Gulp.src(sourceFilesAbsolutePaths).

        pipe(super.printProcessedFilesPathsAndQuantity()).
        pipe(super.handleErrorIfItWillOccur()).

        pipe(gulpIntercept(this.addActualSourceCodeProcessingSettingsToVinylFile.bind(this))).

        pipe(gulpIntercept(this.postProcess.bind(this))).

        pipe(
          Gulp.dest((targetFileInFinalState: VinylFile): string =>
              (targetFileInFinalState as AudiosProcessor.AudioVinylFile).outputDirectoryAbsolutePath)
        );

  }


  private addActualSourceCodeProcessingSettingsToVinylFile(fileInInitialState: VinylFile): AudiosProcessor.AudioVinylFile {

    const normalizedAudiosGroupSettingsActualForCurrentFile: AudiosProcessingSettings__Normalized.AssetsGroup =
        this.audiosProcessingConfigRepresentative.
            getAssetsNormalizedSettingsActualForTargetSourceFile(fileInInitialState.path);

    fileInInitialState.processingSettings = normalizedAudiosGroupSettingsActualForCurrentFile;

    /* [ Theory ] The value of 'path' could change during file processing. */
    fileInInitialState.sourceAbsolutePath = fileInInitialState.path;
    fileInInitialState.outputDirectoryAbsolutePath =
        this.audiosProcessingConfigRepresentative.computeActualOutputDirectoryAbsolutePathForTargetSourceFile({
          targetSourceFileAbsolutePath: fileInInitialState.path,
          respectiveAssetsGroupNormalizedSettings: normalizedAudiosGroupSettingsActualForCurrentFile
        });


    return fileInInitialState as AudiosProcessor.AudioVinylFile;
  }

  private postProcess(_processedAudioFile: VinylFile): VinylFile {

    const processedAudioFile: AudiosProcessor.AudioVinylFile = _processedAudioFile as AudiosProcessor.AudioVinylFile;

    if (processedAudioFile.processingSettings.revisioning.mustExecute) {
      FileNameRevisionPostfixer.appendPostfixIfPossible(
        processedAudioFile,
        { contentHashPostfixSeparator: processedAudioFile.processingSettings.revisioning.contentHashPostfixSeparator }
      );
    }

    this.audiosProcessingConfigRepresentative.
        sourceFilesAbsolutePathsAndOutputFilesActualPathsMap.
        set(
          ImprovedPath.replacePathSeparatorsToForwardSlashes(processedAudioFile.sourceAbsolutePath),
          ImprovedPath.joinPathSegments(processedAudioFile.outputDirectoryAbsolutePath, processedAudioFile.basename)
        );

    return processedAudioFile;
  }
}


namespace AudiosProcessor {
  export type AudioVinylFile =
      GulpStreamsBasedTaskExecutor.VinylFileWithCachedNormalizedSettings &
      {
        readonly processingSettings: AudiosProcessingSettings__Normalized.AssetsGroup;
      };
}


export default AudiosProcessor;
