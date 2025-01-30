/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type FontsProcessingSettings__Normalized from "@FontsProcessing/FontsProcessingSettings__Normalized";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type FontsProcessingSettingsRepresentative from "@FontsProcessing/FontsProcessingSettingsRepresentative";

/* ─── Source Files Watcher ───────────────────────────────────────────────────────────────────────────────────────── */
import FontsSourceFilesWatcher from "@FontsProcessing/FontsSourceFilesWatcher";

/* ─── Superclass ─────────────────────────────────────────────────────────────────────────────────────────────────── */
import GulpStreamsBasedAssetsProcessor from "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBasedAssetsProcessor";

/* ─── Shared State ───────────────────────────────────────────────────────────────────────────────────────────────── */
import FontsProcessingSharedState from "@FontsProcessing/FontsProcessingSharedState";

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


export default class FontsProcessor extends GulpStreamsBasedAssetsProcessor<
  FontsProcessingSettings__Normalized.Common,
  FontsProcessingSettings__Normalized.AssetsGroup,
  FontsProcessingSettingsRepresentative
> {

  public static provideFontsProcessingIfMust(
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): () => NodeJS.ReadWriteStream {

    const fontsProcessingSettingsRepresentative: FontsProcessingSettingsRepresentative | undefined =
        projectBuildingMasterConfigRepresentative.fontsProcessingSettingsRepresentative;

    if (isUndefined(fontsProcessingSettingsRepresentative)) {
      return createImmediatelyEndingEmptyStream();
    }


    const dataHoldingSelfInstance: FontsProcessor = new FontsProcessor(
      projectBuildingMasterConfigRepresentative, fontsProcessingSettingsRepresentative
    );

    if (projectBuildingMasterConfigRepresentative.mustProvideIncrementalBuilding) {

      FontsSourceFilesWatcher.
          initializeIfRequiredAndGetInstance({
            fontsProcessingSettingsRepresentative,
            projectBuildingMasterConfigRepresentative
          }).
          addOnFileAddedEventHandler({
            handlerID: "ON_FONTS_FILE_ADDED--BY_FONTS_PROCESSOR",
            handler: dataHoldingSelfInstance.onSourceFilesWatcherEmittedFileAddingOrUpdatingEvent.bind(dataHoldingSelfInstance)
          }).
          addFileUpdatedEventHandler({
            handlerID: "ON_FONTS_FILE_UPDATED--BY_FONTS_PROCESSOR",
            handler: dataHoldingSelfInstance.onSourceFilesWatcherEmittedFileAddingOrUpdatingEvent.bind(dataHoldingSelfInstance)
          }).
          addOnFileDeletedEventHandler({
            handlerID: "ON_FONTS_FILE_DELETED--BY_FONTS_PROCESSOR",
            handler: dataHoldingSelfInstance.onFontFileDeleted.bind(dataHoldingSelfInstance)
          });

    }

    return dataHoldingSelfInstance.processAssets(fontsProcessingSettingsRepresentative.actualAssetsSourceFilesAbsolutePaths);

  }


  private constructor(
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative,
    fontsProcessingSettingsRepresentative: FontsProcessingSettingsRepresentative
  ) {
    super({
      projectBuildingMasterConfigRepresentative,
      associatedAssetsProcessingSettingsRepresentative: fontsProcessingSettingsRepresentative,
      taskTitleForLogging: "Fonts processing",
      waitingForSubsequentFilesWillSavedPeriod__seconds: fontsProcessingSettingsRepresentative.assetsProcessingCommonSettings.
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
            onStreamStartedEventHandler: FontsProcessor.postProcessFile
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
  private onFontFileDeleted(targetVideoFileAbsolutePath: string): void {
    this.absolutePathOfFilesWaitingForReProcessing.delete(targetVideoFileAbsolutePath);
    FontsProcessingSharedState.sourceFilesAbsolutePathsAndOutputFilesActualPathsMap.delete(targetVideoFileAbsolutePath);
  }


  /* ━━━ Pipeline methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private static async postProcessFile(processedFontFile: AssetVinylFile): Promise<GulpStreamModifier.CompletionSignals> {

    FontsProcessingSharedState.sourceFilesAbsolutePathsAndOutputFilesActualPathsMap.set(
      ImprovedPath.replacePathSeparatorsToForwardSlashes(processedFontFile.sourceAbsolutePath),
        ImprovedPath.joinPathSegments(
          [ processedFontFile.outputDirectoryAbsolutePath, processedFontFile.basename ],
          { alwaysForwardSlashSeparators: true }
        )
    );

    return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);

  }

}
