/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type FontsProcessingSettings__Normalized from "@FontsProcessing/FontsProcessingSettings__Normalized";

/* --- Settings representatives ------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import FontsProcessingSettingsRepresentative from "@FontsProcessing/FontsProcessingSettingsRepresentative";

/* --- Tasks executor ----------------------------------------------------------------------------------------------- */
import GulpStreamsBasedAssetsProcessor from "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBasedAssetsProcessor";
import type GulpStreamsBasedTaskExecutor from
    "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBased/GulpStreamsBasedTaskExecutor";

/* --- Applied utils ------------------------------------------------------------------------------------------------ */
import Gulp from "gulp";
import type VinylFile from "vinyl";
import gulpIntercept from "gulp-intercept";
import FileNameRevisionPostfixer from "@Utils/FileNameRevisionPostfixer";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import { PassThrough } from "stream";
import { isUndefined } from "@yamato-daiwa/es-extensions";


class FontsProcessor extends GulpStreamsBasedAssetsProcessor<
  FontsProcessingSettings__Normalized.Common,
  FontsProcessingSettings__Normalized.AssetsGroup,
  FontsProcessingSettingsRepresentative
> {

  public readonly fontsProcessorConfigRepresentative: FontsProcessingSettingsRepresentative;

  protected readonly TASK_NAME_FOR_LOGGING: string = "活字管理";
  protected readonly SOURCE_FILES_TYPE_LABEL_FOR_LOGGING: string = "活字";


  public static provideFontsProcessingIfMust(
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): () => NodeJS.ReadWriteStream {

    const fontsProcessorSettingsRepresentative: FontsProcessingSettingsRepresentative | undefined =
        masterConfigRepresentative.fontsProcessingSettingsRepresentative;

    if (isUndefined(fontsProcessorSettingsRepresentative)) {
      return (): NodeJS.ReadWriteStream => new PassThrough().end();
    }


    const dataHoldingSelfInstance: FontsProcessor = new FontsProcessor(
      masterConfigRepresentative, fontsProcessorSettingsRepresentative
    );

    dataHoldingSelfInstance.initializeOrUpdateSourceFilesWatcherIfMust();

    const assetsSourceFilesAbsolutePathsRelevantForCurrentProjectBuildingMode: Array<string> =
        fontsProcessorSettingsRepresentative.actualAssetsSourceFilesAbsolutePaths;

    return dataHoldingSelfInstance.processAssets(assetsSourceFilesAbsolutePathsRelevantForCurrentProjectBuildingMode);
  }


  private constructor(
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative,
    fontsProcessorConfigRepresentative: FontsProcessingSettingsRepresentative
  ) {
    super(masterConfigRepresentative, fontsProcessorConfigRepresentative);
    this.fontsProcessorConfigRepresentative = fontsProcessorConfigRepresentative;
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
               * No known simple solution; will be fixed at 2nd generation of FontsProcessor.  */
              (targetFileInFinalState as FontsProcessor.FontVinylFile).outputDirectoryAbsolutePath)
        );

  }


  private addActualSourceCodeProcessingSettingsToVinylFile(fileInInitialState: VinylFile): FontsProcessor.FontVinylFile {

    const normalizedFontsGroupSettingsActualForCurrentFile: FontsProcessingSettings__Normalized.AssetsGroup =
        this.fontsProcessorConfigRepresentative.
            getAssetsNormalizedSettingsActualForTargetSourceFile(fileInInitialState.path);

    fileInInitialState.processingSettings = normalizedFontsGroupSettingsActualForCurrentFile;

    /* [ Theory ] The value of 'path' could change during file processing. */
    fileInInitialState.sourceAbsolutePath = fileInInitialState.path;
    fileInInitialState.outputDirectoryAbsolutePath = FontsProcessingSettingsRepresentative.
        computeActualOutputDirectoryAbsolutePathForTargetSourceFile({
          targetSourceFileAbsolutePath: fileInInitialState.path,
          respectiveAssetsGroupNormalizedSettings: normalizedFontsGroupSettingsActualForCurrentFile
        });

    /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions --
     * No known simple solution; will be fixed at 2nd generation of FontsProcessor.  */
    return fileInInitialState as FontsProcessor.FontVinylFile;
  }

  private postProcess(_processedFontFile: VinylFile): VinylFile {

    /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions --
     * No known simple solution; will be fixed at 2nd generation of FontsProcessor.  */
    const processedFontFile: FontsProcessor.FontVinylFile = _processedFontFile as FontsProcessor.FontVinylFile;

    if (processedFontFile.processingSettings.revisioning.mustExecute) {
      FileNameRevisionPostfixer.appendPostfixIfPossible(
        processedFontFile,
        { contentHashPostfixSeparator: processedFontFile.processingSettings.revisioning.contentHashPostfixSeparator }
      );
    }

    this.fontsProcessorConfigRepresentative.
        sourceFilesAbsolutePathsAndOutputFilesActualPathsMap.
        set(
          ImprovedPath.replacePathSeparatorsToForwardSlashes(processedFontFile.sourceAbsolutePath),
          ImprovedPath.joinPathSegments(
            [ processedFontFile.outputDirectoryAbsolutePath, processedFontFile.basename ],
            { forwardSlashOnlySeparators: true }
          )
        );

    return processedFontFile;
  }
}


namespace FontsProcessor {
  export type FontVinylFile =
      GulpStreamsBasedTaskExecutor.VinylFileWithCachedNormalizedSettings &
      Readonly<{
        processingSettings: FontsProcessingSettings__Normalized.AssetsGroup;
      }>;
}


export default FontsProcessor;
