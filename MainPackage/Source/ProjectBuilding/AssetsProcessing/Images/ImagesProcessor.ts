/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type ImagesProcessingSettings__Normalized from "@ImagesProcessing/ImagesProcessingSettings__Normalized";

/* --- Settings representatives ------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import ImagesProcessingSettingsRepresentative from "@ImagesProcessing/ImagesProcessingSettingsRepresentative";

/* --- Tasks executor ----------------------------------------------------------------------------------------------- */
import GulpStreamsBasedAssetsProcessor from "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBasedAssetsProcessor";
import type GulpStreamsBasedTaskExecutor from "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBasedTaskExecutor";

/* --- Applied utils ------------------------------------------------------------------------------------------------ */
import Gulp from "gulp";
import gulpIf from "gulp-if";
import type VinylFile from "vinyl";
import gulpIntercept from "gulp-intercept";
import FileNameRevisionPostfixer from "@Utils/FileNameRevisionPostfixer";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";
import gulpImagemin from "gulp-imagemin";
import pngQuant from "imagemin-pngquant";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import { isUndefined } from "@yamato-daiwa/es-extensions";
import { PassThrough } from "stream";


class ImagesProcessor extends GulpStreamsBasedAssetsProcessor<
  ImagesProcessingSettings__Normalized.Common,
  ImagesProcessingSettings__Normalized.AssetsGroup,
  ImagesProcessingSettingsRepresentative
> {

  protected readonly TASK_NAME_FOR_LOGGING: string = "画像管理";
  protected readonly SOURCE_FILES_TYPE_LABEL_FOR_LOGGING: string = "画像";

  private readonly imagesProcessorConfigRepresentative: ImagesProcessingSettingsRepresentative;


  public static provideImagesProcessingIfMust(
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): () => NodeJS.ReadWriteStream {

    const imagesProcessorSettingsRepresentative: ImagesProcessingSettingsRepresentative | undefined =
        masterConfigRepresentative.imagesProcessingSettingsRepresentative;

    if (isUndefined(imagesProcessorSettingsRepresentative)) {
      return (): NodeJS.ReadWriteStream => new PassThrough().end();
    }


    const dataHoldingSelfInstance: ImagesProcessor = new ImagesProcessor(
      masterConfigRepresentative, imagesProcessorSettingsRepresentative
    );

    dataHoldingSelfInstance.initializeOrUpdateSourceFilesWatcher();

    const assetsSourceFilesAbsolutePathsRelevantForCurrentProjectBuildingMode: Array<string> =
        imagesProcessorSettingsRepresentative.actualAssetsSourceFilesAbsolutePaths;

    return dataHoldingSelfInstance.processAssets(assetsSourceFilesAbsolutePathsRelevantForCurrentProjectBuildingMode);
  }


  private constructor(
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative,
    imagesManagementConfigRepresentative: ImagesProcessingSettingsRepresentative
  ) {
    super(masterConfigRepresentative, imagesManagementConfigRepresentative);
    this.imagesProcessorConfigRepresentative = imagesManagementConfigRepresentative;
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

        pipe(gulpIf(
          this.masterConfigRepresentative.isStagingBuildingMode || this.masterConfigRepresentative.isProductionBuildingMode,
          gulpImagemin([
            gulpImagemin.mozjpeg({ progressive: true }),
            gulpImagemin.gifsicle({ interlaced: true }),
            gulpImagemin.svgo({}),
            pngQuant()
          ])
        )).

        pipe(gulpIntercept(this.postProcess.bind(this))).

        pipe(
          Gulp.dest((targetFileInFinalState: VinylFile): string =>
              (targetFileInFinalState as ImagesProcessor.ImageVinylFile).outputDirectoryAbsolutePath)
        );
  }


  private addActualSourceCodeProcessingSettingsToVinylFile(fileInInitialState: VinylFile): ImagesProcessor.ImageVinylFile {

    const normalizedImagesGroupSettingsActualForCurrentFile: ImagesProcessingSettings__Normalized.AssetsGroup =
        this.imagesProcessorConfigRepresentative.
            getAssetsNormalizedSettingsActualForTargetSourceFile(fileInInitialState.path);

    fileInInitialState.processingSettings = normalizedImagesGroupSettingsActualForCurrentFile;

    /* [ Theory ] The value of 'path' could change during file processing. */
    fileInInitialState.sourceAbsolutePath = fileInInitialState.path;
    fileInInitialState.outputDirectoryAbsolutePath = ImagesProcessingSettingsRepresentative.
        computeActualOutputDirectoryAbsolutePathForTargetSourceFile({
          targetSourceFileAbsolutePath: fileInInitialState.path,
          respectiveAssetsGroupNormalizedSettings: normalizedImagesGroupSettingsActualForCurrentFile
        });

    return fileInInitialState as ImagesProcessor.ImageVinylFile;
  }

  private postProcess(_processedImageFile: VinylFile): VinylFile {

    const processedImageFile: ImagesProcessor.ImageVinylFile = _processedImageFile as ImagesProcessor.ImageVinylFile;

    if (processedImageFile.processingSettings.revisioning.mustExecute) {
      FileNameRevisionPostfixer.appendPostfixIfPossible(
        processedImageFile,
        { contentHashPostfixSeparator: processedImageFile.processingSettings.revisioning.contentHashPostfixSeparator }
      );
    }


    this.imagesProcessorConfigRepresentative.
        sourceFilesAbsolutePathsAndOutputFilesActualPathsMap.
        set(
          ImprovedPath.replacePathSeparatorsToForwardSlashes(processedImageFile.sourceAbsolutePath),
          ImprovedPath.joinPathSegments(processedImageFile.outputDirectoryAbsolutePath, processedImageFile.basename)
        );

    return processedImageFile;
  }
}


namespace ImagesProcessor {
  export type ImageVinylFile =
      GulpStreamsBasedTaskExecutor.VinylFileWithCachedNormalizedSettings &
      {
        readonly processingSettings: ImagesProcessingSettings__Normalized.AssetsGroup;
      };
}


export default ImagesProcessor;
