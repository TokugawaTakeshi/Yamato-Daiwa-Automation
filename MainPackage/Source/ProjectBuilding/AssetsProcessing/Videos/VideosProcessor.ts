/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type VideosProcessingSettings__Normalized from "@VideosProcessing/VideosProcessingSettings__Normalized";

/* --- Settings representatives ------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import VideosProcessingSettingsRepresentative from "@VideosProcessing/VideosProcessingSettingsRepresentative";

/* --- Tasks executor ----------------------------------------------------------------------------------------------- */
import GulpStreamsBasedAssetsProcessor from "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBasedAssetsProcessor";
import type GulpStreamsBasedTaskExecutor from
    "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBased/GulpStreamsBasedTaskExecutor";

/* --- Applied utils ------------------------------------------------------------------------------------------------ */
import Gulp from "gulp";
import gulpIntercept from "gulp-intercept";
import type VinylFile from "vinyl";
import FileNameRevisionPostfixer from "@Utils/FileNameRevisionPostfixer";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import { PassThrough } from "stream";
import { isUndefined } from "@yamato-daiwa/es-extensions";


class VideosProcessor extends GulpStreamsBasedAssetsProcessor<
  VideosProcessingSettings__Normalized.Common,
  VideosProcessingSettings__Normalized.AssetsGroup,
  VideosProcessingSettingsRepresentative
> {

  protected readonly TASK_NAME_FOR_LOGGING: string = "画像管理";
  protected readonly SOURCE_FILES_TYPE_LABEL_FOR_LOGGING: string = "画像";

  private readonly videosProcessingConfigRepresentative: VideosProcessingSettingsRepresentative;


  public static provideVideosProcessingIfMust(
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): () => NodeJS.ReadWriteStream {

    const videosProcessingSettingsRepresentative: VideosProcessingSettingsRepresentative | undefined =
        masterConfigRepresentative.videosProcessingSettingsRepresentative;

    if (isUndefined(videosProcessingSettingsRepresentative)) {
      return (): NodeJS.ReadWriteStream => new PassThrough().end();
    }


    const dataHoldingSelfInstance: VideosProcessor = new VideosProcessor(
      masterConfigRepresentative, videosProcessingSettingsRepresentative
    );

    dataHoldingSelfInstance.initializeOrUpdateSourceFilesWatcherIfMust();

    const assetsSourceFilesAbsolutePathsRelevantForCurrentProjectBuildingMode: Array<string> =
        videosProcessingSettingsRepresentative.actualAssetsSourceFilesAbsolutePaths;

    return dataHoldingSelfInstance.processAssets(assetsSourceFilesAbsolutePathsRelevantForCurrentProjectBuildingMode);
  }


  private constructor(
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative,
    videosProcessingConfigRepresentative: VideosProcessingSettingsRepresentative
  ) {
    super(masterConfigRepresentative, videosProcessingConfigRepresentative);
    this.videosProcessingConfigRepresentative = videosProcessingConfigRepresentative;
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
              /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions --
               * No known simple solution; will be fixed at 2nd generation of VideosProcessor.  */
              (targetFileInFinalState as VideosProcessor.VideoVinylFile).outputDirectoryAbsolutePath)
        );

  }


  private addActualSourceCodeProcessingSettingsToVinylFile(fileInInitialState: VinylFile): VideosProcessor.VideoVinylFile {

    const normalizedVideosGroupSettingsActualForCurrentFile: VideosProcessingSettings__Normalized.AssetsGroup =
        this.videosProcessingConfigRepresentative.
            getAssetsNormalizedSettingsActualForTargetSourceFile(fileInInitialState.path);


    fileInInitialState.processingSettings = normalizedVideosGroupSettingsActualForCurrentFile;

    /* [ Theory ] The value of 'path' could change during file processing. */
    fileInInitialState.sourceAbsolutePath = fileInInitialState.path;
    fileInInitialState.outputDirectoryAbsolutePath = VideosProcessingSettingsRepresentative.
        computeActualOutputDirectoryAbsolutePathForTargetSourceFile({
          targetSourceFileAbsolutePath: fileInInitialState.path,
          respectiveAssetsGroupNormalizedSettings: normalizedVideosGroupSettingsActualForCurrentFile
        });

    /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions --
     * No known simple solution; will be fixed at 2nd generation of VideosProcessor.  */
    return fileInInitialState as VideosProcessor.VideoVinylFile;
  }

  private postProcess(_processedVideoFile: VinylFile): VinylFile {

    /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions --
     * No known simple solution; will be fixed at 2nd generation of VideosProcessor.  */
    const processedVideoFile: VideosProcessor.VideoVinylFile = _processedVideoFile as VideosProcessor.VideoVinylFile;

    if (processedVideoFile.processingSettings.revisioning.mustExecute) {
      FileNameRevisionPostfixer.appendPostfixIfPossible(
        processedVideoFile,
        { contentHashPostfixSeparator: processedVideoFile.processingSettings.revisioning.contentHashPostfixSeparator }
      );
    }

    this.videosProcessingConfigRepresentative.
        sourceFilesAbsolutePathsAndOutputFilesActualPathsMap.
        set(
          ImprovedPath.replacePathSeparatorsToForwardSlashes(processedVideoFile.sourceAbsolutePath),
          ImprovedPath.joinPathSegments(
            [ processedVideoFile.outputDirectoryAbsolutePath, processedVideoFile.basename ],
            { forwardSlashOnlySeparators: true }
          )
        );

    return processedVideoFile;
  }
}


namespace VideosProcessor {
  export type VideoVinylFile =
      GulpStreamsBasedTaskExecutor.VinylFileWithCachedNormalizedSettings &
      {
        readonly processingSettings: VideosProcessingSettings__Normalized.AssetsGroup;
      };
}


export default VideosProcessor;
