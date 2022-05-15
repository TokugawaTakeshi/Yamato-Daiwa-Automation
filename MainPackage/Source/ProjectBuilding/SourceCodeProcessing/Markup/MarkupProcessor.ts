/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type MarkupProcessingSettings__Normalized from "@MarkupProcessing/MarkupProcessingSettings__Normalized";

/* --- Settings representatives ------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type MarkupProcessingSettingsRepresentative from "@MarkupProcessing/MarkupProcessingSettingsRepresentative";

/* --- Tasks executors ---------------------------------------------------------------------------------------------- */
import GulpStreamsBasedSourceCodeProcessor from "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBasedSourceCodeProcessor";
import type GulpStreamsBasedTaskExecutor from "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBasedTaskExecutor";

/* --- Gulp plugins ------------------------------------------------------------------------------------------------- */
import Gulp from "gulp";
import type VinylFile from "vinyl";
import gulpPug from "gulp-pug";
import gulpIntercept from "gulp-intercept";
import gulpHTML_Prettify from "gulp-html-prettify";

/* --- Applied utils ------------------------------------------------------------------------------------------------ */
import AssetsPathsAliasesResolverForHTML from
    "@MarkupProcessing/ProcessingHooks/03-RawOutputCode/AssetsPathsAliasesResolverForHTML";
import HTML_Validator from
    "@MarkupProcessing/ProcessingHooks/04-PostprocessedCode/HTML_Validator/HTML_Validator";
import AccessibilityInspector from
    "@MarkupProcessing/ProcessingHooks/04-PostprocessedCode/AccessibilityInspector/AccessibilityInspector";
import { PassThrough } from "stream";

/* --- General auxiliaries ------------------------------------------------------------------------------------------ */
import { isUndefined } from "@yamato-daiwa/es-extensions";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";


export class MarkupProcessor extends GulpStreamsBasedSourceCodeProcessor<
  MarkupProcessingSettings__Normalized.Common,
  MarkupProcessingSettings__Normalized.EntryPointsGroup,
  MarkupProcessingSettingsRepresentative
> {

  protected readonly TASK_NAME_FOR_LOGGING: string = "Markup processing";
  protected readonly SOURCE_FILES_TYPE_LABEL_FOR_LOGGING: string = "Markup";

  private readonly markupProcessingConfigRepresentative: MarkupProcessingSettingsRepresentative;


  public static provideMarkupProcessingIfMust(
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): () => NodeJS.ReadWriteStream {

    const markupProcessingSettingsRepresentative: MarkupProcessingSettingsRepresentative | undefined =
        masterConfigRepresentative.markupProcessingSettingsRepresentative;

    if (isUndefined(markupProcessingSettingsRepresentative)) {
      return (): NodeJS.ReadWriteStream => new PassThrough().end();
    }


    const dataHoldingSelfInstance: MarkupProcessor = new MarkupProcessor(
      masterConfigRepresentative, markupProcessingSettingsRepresentative
    );

    if (masterConfigRepresentative.isDevelopmentBuildingMode) {
      dataHoldingSelfInstance.initializeSourceFilesDirectoriesWhichAlwaysWillBeBeingWatchedGlobSelectors();
      dataHoldingSelfInstance.initializeOrUpdateWatchedSourceFilesGlobSelectors();
      dataHoldingSelfInstance.initializeOrUpdateSourceFilesWatcher();
    }

    return dataHoldingSelfInstance.processEntryPoints(
      markupProcessingSettingsRepresentative.relevantEntryPointsSourceFilesAbsolutePaths
    );
  }


  private constructor(
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative,
    markupProcessingConfigRepresentative: MarkupProcessingSettingsRepresentative
  ) {
    super(masterConfigRepresentative, markupProcessingConfigRepresentative);
    this.markupProcessingConfigRepresentative = markupProcessingConfigRepresentative;
  }


  protected processEntryPoints(entryPointsSourceFilesAbsolutePaths: Array<string>): () => NodeJS.ReadWriteStream {

    /* [ Theory ] If to pass the empty array to 'Gulp.src(".")' error will occur but the cause will not be told clearly.
     *    However, the empty array is usual scenario (for example when user declared the configuration but has not added
     *    all files yet).  */
    if (entryPointsSourceFilesAbsolutePaths.length === 0) {
      return (): NodeJS.ReadWriteStream => Gulp.src(".");
    }


    return (): NodeJS.ReadWriteStream => Gulp.src(entryPointsSourceFilesAbsolutePaths).

        pipe(super.printProcessedFilesPathsAndQuantity()).
        pipe(super.handleErrorIfItWillOccur()).

        pipe(gulpIntercept(this.addActualSourceCodeProcessingSettingsToVinylFile.bind(this))).

        pipe(gulpPug({
          /* eslint-disable-next-line id-denylist --
           * The "id-denylist" is not desired to affect to object properties, but the applying to add respective option
           * has been denied. https://github.com/eslint/eslint/issues/15504 */
          data: {}
        })).

        pipe(gulpIntercept(this.onRawOutputCode.bind(this))).

        pipe(gulpHTML_Prettify({ indent_char: " ", indent_size: 2 })).

        pipe(gulpIntercept(this.onPostProcessedCode.bind(this))).

        pipe(
          Gulp.dest((targetFileInFinalState: VinylFile): string =>
              (targetFileInFinalState as MarkupProcessor.MarkupVinylFile).outputDirectoryAbsolutePath)
        );
  }

  private addActualSourceCodeProcessingSettingsToVinylFile(fileInInitialState: VinylFile): MarkupProcessor.MarkupVinylFile {

    const markupEntryPointsGroupSettingsActualForCurrentFile: MarkupProcessingSettings__Normalized.EntryPointsGroup =
        this.markupProcessingConfigRepresentative.
            getEntryPointsGroupSettingsRelevantForSpecifiedSourceFileAbsolutePath(fileInInitialState.path);


    fileInInitialState.processingSettings = markupEntryPointsGroupSettingsActualForCurrentFile;

    /* [ Theory ] The value of 'path' could change during file processing. */
    fileInInitialState.sourceAbsolutePath = ImprovedPath.replacePathSeparatorsToForwardSlashes(fileInInitialState.path);
    fileInInitialState.outputDirectoryAbsolutePath = this.markupProcessingConfigRepresentative.
        computeRelevantOutputDirectoryAbsolutePathForTargetSourceFile(
          fileInInitialState.path, markupEntryPointsGroupSettingsActualForCurrentFile
        );

    return fileInInitialState as MarkupProcessor.MarkupVinylFile;
  }


  private onRawOutputCode(_compiledHTML_File: VinylFile): VinylFile {

    const compiledHTML_File: MarkupProcessor.MarkupVinylFile = _compiledHTML_File as MarkupProcessor.MarkupVinylFile;

    compiledHTML_File.contents = Buffer.from(
      AssetsPathsAliasesResolverForHTML.getHTML_CodeWithResolvedAliases(compiledHTML_File, this.masterConfigRepresentative)
    );

    return compiledHTML_File;
  }

  private onPostProcessedCode(_compiledHTML_File: VinylFile): VinylFile {

    const compiledHTML_File: MarkupProcessor.MarkupVinylFile = _compiledHTML_File as MarkupProcessor.MarkupVinylFile;

    if (compiledHTML_File.processingSettings.HTML_Validation.mustExecute) {
      HTML_Validator.validateHtml(compiledHTML_File, this.masterConfigRepresentative);
    }

    if (compiledHTML_File.processingSettings.accessibilityInspection.mustExecute) {
      AccessibilityInspector.inspectAccessibility(compiledHTML_File, this.masterConfigRepresentative);
    }


    return compiledHTML_File;
  }
}


export namespace MarkupProcessor {
  export type MarkupVinylFile =
      GulpStreamsBasedTaskExecutor.VinylFileWithCachedNormalizedSettings &
      {
        readonly processingSettings: MarkupProcessingSettings__Normalized.EntryPointsGroup;
      };
}


export default MarkupProcessor;
