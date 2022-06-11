/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type StylesProcessingSettings__Normalized from "@StylesProcessing/StylesProcessingSettings__Normalized";

/* --- Settings representatives ------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import StylesProcessingSettingsRepresentative from "@StylesProcessing/StylesProcessingSettingsRepresentative";

/* --- Tasks executors ---------------------------------------------------------------------------------------------- */
import GulpStreamsBasedSourceCodeProcessor from "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBasedSourceCodeProcessor";
import type GulpStreamsBasedTaskExecutor from "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBasedTaskExecutor";

/* --- Gulp plugins ------------------------------------------------------------------------------------------------- */
import Gulp from "gulp";
import type VinylFile from "vinyl";
import gulpIf from "gulp-if";
import gulpIntercept from "gulp-intercept";
import gulpSourcemaps from "gulp-sourcemaps";
import gulpStylus from "gulp-stylus";
import gulpPostCSS from "gulp-postcss";
import Autoprefixer from "autoprefixer";
import CSS_Nano from "cssnano";

/* --- Applied utils ------------------------------------------------------------------------------------------------ */
import FileNameRevisionPostfixer from "@Utils/FileNameRevisionPostfixer";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import { PassThrough } from "stream";
import { isUndefined } from "@yamato-daiwa/es-extensions";


export class StylesProcessor extends GulpStreamsBasedSourceCodeProcessor<
  StylesProcessingSettings__Normalized.Common,
  StylesProcessingSettings__Normalized.EntryPointsGroup,
  StylesProcessingSettingsRepresentative
> {

  protected readonly TASK_NAME_FOR_LOGGING: string = "Styles processing";

  private readonly stylesProcessingConfigRepresentative: StylesProcessingSettingsRepresentative;


  public static provideStylesProcessingIfMust(
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): () => NodeJS.ReadWriteStream {

    const stylesProcessingSettingsRepresentative: StylesProcessingSettingsRepresentative | undefined =
        masterConfigRepresentative.stylesProcessingSettingsRepresentative;

    if (isUndefined(stylesProcessingSettingsRepresentative)) {
      return (): NodeJS.ReadWriteStream => new PassThrough().end();
    }


    const dataHoldingSelfInstance: StylesProcessor = new StylesProcessor(
      masterConfigRepresentative, stylesProcessingSettingsRepresentative
    );

    if (masterConfigRepresentative.isDevelopmentBuildingMode) {
      dataHoldingSelfInstance.initializeSourceFilesDirectoriesWhichAlwaysWillBeBeingWatchedGlobSelectors();
      dataHoldingSelfInstance.initializeOrUpdateWatchedSourceFilesGlobSelectors();
      dataHoldingSelfInstance.initializeOrUpdateSourceFilesWatcher();
    }

    return dataHoldingSelfInstance.processEntryPoints(
      stylesProcessingSettingsRepresentative.relevantEntryPointsSourceFilesAbsolutePaths
    );
  }


  private constructor(
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative,
    stylesProcessingConfigRepresentative: StylesProcessingSettingsRepresentative
  ) {
    super(masterConfigRepresentative, stylesProcessingConfigRepresentative);
    this.stylesProcessingConfigRepresentative = stylesProcessingConfigRepresentative;
  }


  protected processEntryPoints(entryPointsSourceFilesAbsolutePaths: Array<string>): () => NodeJS.ReadWriteStream {

    /* [ Theory ] If to pass the empty array to 'Gulp.src()' error will occur but the cause will not be told clearly.
     *    However, the empty array is usual scenario (for example when user declared the configuration but has not added
     *    files of specific entry points group yet).  */
    if (entryPointsSourceFilesAbsolutePaths.length === 0) {
      return (): NodeJS.ReadWriteStream => new PassThrough().end();
    }


    return (): NodeJS.ReadWriteStream => Gulp.src(entryPointsSourceFilesAbsolutePaths).

        pipe(super.printProcessedFilesPathsAndQuantity()).
        pipe(super.handleErrorIfItWillOccur()).

        pipe(gulpIntercept(this.addActualSourceCodeProcessingSettingsToVinylFile.bind(this))).

        pipe(gulpIf(this.masterConfigRepresentative.isDevelopmentBuildingMode, gulpSourcemaps.init())).
        pipe(gulpIf(
          (file: VinylFile): boolean => (file as StylesProcessor.StylesVinylFile).mustBeProcessedByStylus,
          gulpStylus({

            /* [ Theory ] Allows to "@include XXX.css" which is critical for third-party libraries usage. */
            "include css": true
          })
        )).
        pipe(gulpPostCSS((): { plugins: Array<unknown>; } => ({
          plugins: [
            Autoprefixer,
            CSS_Nano({
              preset: [
                "default",
                {
                  normalizeWhitespace: !this.masterConfigRepresentative.isDevelopmentBuildingMode,
                  discardComments: !this.masterConfigRepresentative.isDevelopmentBuildingMode
                }
              ]
            })
          ]
        }))).

        pipe(gulpIf(this.masterConfigRepresentative.isDevelopmentBuildingMode, gulpSourcemaps.write())).

        pipe(gulpIntercept(this.onPostProcessedCode.bind(this))).

        pipe(
          Gulp.dest((targetFileInFinalState: VinylFile): string =>
              (targetFileInFinalState as StylesProcessor.StylesVinylFile).outputDirectoryAbsolutePath)
        );
  }

  private addActualSourceCodeProcessingSettingsToVinylFile(fileInInitialState: VinylFile): StylesProcessor.StylesVinylFile {

    const normalizedStylesEntryPointsGroupSettingsActualForCurrentFile: StylesProcessingSettings__Normalized.EntryPointsGroup =
        this.stylesProcessingConfigRepresentative.
            getEntryPointsGroupSettingsRelevantForSpecifiedSourceFileAbsolutePath(fileInInitialState.path);


    fileInInitialState.processingSettings = normalizedStylesEntryPointsGroupSettingsActualForCurrentFile;

    /* [ Theory ] The value of 'path' could change during file processing. */
    fileInInitialState.sourceAbsolutePath = ImprovedPath.replacePathSeparatorsToForwardSlashes(fileInInitialState.path);
    fileInInitialState.outputDirectoryAbsolutePath = this.stylesProcessingConfigRepresentative.
        computeRelevantOutputDirectoryAbsolutePathForTargetSourceFile(
          fileInInitialState.path, normalizedStylesEntryPointsGroupSettingsActualForCurrentFile
        );

    fileInInitialState.mustBeProcessedByStylus = StylesProcessingSettingsRepresentative.
        mustFileBeProcessedByStylus(fileInInitialState.path);

    return fileInInitialState as StylesProcessor.StylesVinylFile;
  }


  private onPostProcessedCode(_compiledStylesheet: VinylFile): VinylFile {

    const compiledStylesheet: StylesProcessor.StylesVinylFile = _compiledStylesheet as StylesProcessor.StylesVinylFile;

    if (compiledStylesheet.processingSettings.revisioning.mustExecute) {
      FileNameRevisionPostfixer.appendPostfixIfPossible(compiledStylesheet, {
        contentHashPostfixSeparator: compiledStylesheet.processingSettings.revisioning.contentHashPostfixSeparator
      });
    }

    this.stylesProcessingConfigRepresentative.
        sourceAndOutputFilesAbsolutePathsCorrespondenceMap.
        set(
          ImprovedPath.replacePathSeparatorsToForwardSlashes(compiledStylesheet.sourceAbsolutePath),
          ImprovedPath.joinPathSegments(compiledStylesheet.outputDirectoryAbsolutePath, compiledStylesheet.basename)
        );

    return compiledStylesheet;
  }
}


export namespace StylesProcessor {
  export type StylesVinylFile =
      GulpStreamsBasedTaskExecutor.VinylFileWithCachedNormalizedSettings &
      {
        readonly processingSettings: StylesProcessingSettings__Normalized.EntryPointsGroup;
        readonly mustBeProcessedByStylus: boolean;
      };
}


export default StylesProcessor;
