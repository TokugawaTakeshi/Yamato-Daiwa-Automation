/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type ImagesProcessingSettings__Normalized from "@ImagesProcessing/ImagesProcessingSettings__Normalized";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type ImagesProcessingSettingsRepresentative from "@ImagesProcessing/ImagesProcessingSettingsRepresentative";

/* ─── Source Files Watcher ───────────────────────────────────────────────────────────────────────────────────────── */
import ImagesSourceFilesWatcher from "@ImagesProcessing/ImagesSourceFilesWatcher";

/* ─── Superclass ─────────────────────────────────────────────────────────────────────────────────────────────────── */
import GulpStreamsBasedAssetsProcessor from "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBasedAssetsProcessor";

/* ─── Shared State ───────────────────────────────────────────────────────────────────────────────────────────────── */
import ImagesProcessingSharedState from "@ImagesProcessing/ImagesProcessingSharedState";

/* ─── Gulp & Plugins ─────────────────────────────────────────────────────────────────────────────────────────────── */
import Gulp from "gulp";
import type VinylFile from "vinyl";
import gulpIf from "gulp-if";
import gulpImagemin from "gulp-imagemin";
import pngQuant from "imagemin-pngquant";

/* ─── Applied Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import GulpStreamModifier from "@Utils/GulpStreamModifier";
import createImmediatelyEndingEmptyStream from "@Utils/createImmediatelyEndingEmptyStream";
import AssetVinylFile from "@ProjectBuilding/Common/VinylFiles/AssetVinylFile";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import { isUndefined, readonlyArrayToMutableOne } from "@yamato-daiwa/es-extensions";
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


export default class ImagesProcessor extends GulpStreamsBasedAssetsProcessor<
  ImagesProcessingSettings__Normalized.Common,
  ImagesProcessingSettings__Normalized.AssetsGroup,
  ImagesProcessingSettingsRepresentative
> {

  public static provideImagesProcessingIfMust(
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): () => NodeJS.ReadWriteStream {

    const imagesProcessingSettingsRepresentative: ImagesProcessingSettingsRepresentative | undefined =
        projectBuildingMasterConfigRepresentative.imagesProcessingSettingsRepresentative;

    if (isUndefined(imagesProcessingSettingsRepresentative)) {
      return createImmediatelyEndingEmptyStream();
    }


    const dataHoldingSelfInstance: ImagesProcessor = new ImagesProcessor(
      projectBuildingMasterConfigRepresentative, imagesProcessingSettingsRepresentative
    );

    if (projectBuildingMasterConfigRepresentative.mustProvideIncrementalBuilding) {

        ImagesSourceFilesWatcher.
            initializeIfRequiredAndGetInstance({
              imagesProcessingSettingsRepresentative,
              projectBuildingMasterConfigRepresentative
            }).
            addOnFileAddedEventHandler({
              handlerID: "ON_IMAGES_FILE_ADDED--BY_IMAGES_PROCESSOR",
              handler: dataHoldingSelfInstance.onSourceFilesWatcherEmittedFileAddingOrUpdatingEvent.bind(dataHoldingSelfInstance)
            }).
            addFileUpdatedEventHandler({
              handlerID: "ON_IMAGES_FILE_UPDATED--BY_IMAGES_PROCESSOR",
              handler: dataHoldingSelfInstance.onSourceFilesWatcherEmittedFileAddingOrUpdatingEvent.bind(dataHoldingSelfInstance)
            }).
            addOnFileDeletedEventHandler({
              handlerID: "ON_IMAGES_FILE_DELETED--BY_IMAGES_PROCESSOR",
              handler: dataHoldingSelfInstance.onImageFileDeleted.bind(dataHoldingSelfInstance)
            });

   }

    return dataHoldingSelfInstance.processAssets(imagesProcessingSettingsRepresentative.actualAssetsSourceFilesAbsolutePaths);

  }


  private constructor(
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative,
    imagesProcessingSettingsRepresentative: ImagesProcessingSettingsRepresentative
  ) {
    super({
      projectBuildingMasterConfigRepresentative,
      associatedAssetsProcessingSettingsRepresentative: imagesProcessingSettingsRepresentative,
      taskTitleForLogging: "Images Processing",
      waitingForSubsequentFilesWillSavedPeriod__seconds: imagesProcessingSettingsRepresentative.assetsProcessingCommonSettings.
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
          gulpIf(
            this.projectBuildingMasterConfigRepresentative.isStagingBuildingMode ||
                this.projectBuildingMasterConfigRepresentative.isProductionBuildingMode,
            gulpImagemin([
              gulpImagemin.mozjpeg({ progressive: true }),
              gulpImagemin.gifsicle({ interlaced: true }),
              gulpImagemin.svgo({}),
              pngQuant()
            ])
          )
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
              [ AssetVinylFile, ImagesProcessor.postProcessFile ]
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
  private onImageFileDeleted(targetVideoFileAbsolutePath: string): void {
    this.absolutePathOfFilesWaitingForReProcessing.delete(targetVideoFileAbsolutePath);
    ImagesProcessingSharedState.sourceFilesAbsolutePathsAndOutputFilesActualPathsMap.delete(targetVideoFileAbsolutePath);
  }


  /* ━━━ Pipeline methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private static async postProcessFile(processedImageFile: AssetVinylFile): Promise<GulpStreamModifier.CompletionSignals> {

    ImagesProcessingSharedState.sourceFilesAbsolutePathsAndOutputFilesActualPathsMap.set(
      ImprovedPath.replacePathSeparatorsToForwardSlashes(processedImageFile.sourceAbsolutePath),
        ImprovedPath.joinPathSegments(
          [ processedImageFile.outputDirectoryAbsolutePath, processedImageFile.basename ],
          { alwaysForwardSlashSeparators: true }
        )
    );

    return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);

  }

}
