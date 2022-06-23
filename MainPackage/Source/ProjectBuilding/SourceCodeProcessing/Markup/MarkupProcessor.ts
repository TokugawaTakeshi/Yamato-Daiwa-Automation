/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type MarkupProcessingSettings__Normalized from "@MarkupProcessing/MarkupProcessingSettings__Normalized";

/* --- Settings representatives ------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import MarkupProcessingSettingsRepresentative from "@MarkupProcessing/MarkupProcessingSettingsRepresentative";

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
import ResourceFilesPathsAliasesResolverForHTML from
    "@MarkupProcessing/Plugins/AssetsPathsAliasesResolverForHTML/ResourceFilesPathsAliasesResolverForHTML";
import HTML_Validator from
    "@MarkupProcessing/Plugins/HTML_Validator/HTML_Validator";
import AccessibilityInspector from "./Plugins/AccessibilityInspector/AccessibilityInspector";
import removeExtraSpacesFromJapaneseText from "@MarkupProcessing/Plugins/removeExtraSpacesFromJapaneseText";
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

        pipe(gulpPug({
          locals: {
            __IS_DEVELOPMENT_BUILDING_MODE__: this.masterConfigRepresentative.isDevelopmentBuildingMode,
            __IS_TESTING_BUILDING_MODE__: this.masterConfigRepresentative.isTestingBuildingMode,
            __IS_STAGING_BUILDING_MODE__: this.masterConfigRepresentative.isStagingBuildingMode,
            __IS_PRODUCTION_BUILDING_MODE__: this.masterConfigRepresentative.isProductionBuildingMode
          }
        })).

        pipe(gulpIntercept(this.onRawOutputCode.bind(this))).

        pipe(gulpHTML_Prettify({ indent_char: " ", indent_size: 2 })).
        pipe(gulpIntercept(removeExtraSpacesFromJapaneseText)).

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
    fileInInitialState.outputDirectoryAbsolutePath = MarkupProcessingSettingsRepresentative.
        computeRelevantOutputDirectoryAbsolutePathForTargetSourceFile(
          fileInInitialState.path, markupEntryPointsGroupSettingsActualForCurrentFile
        );

    return fileInInitialState as MarkupProcessor.MarkupVinylFile;
  }


  private onRawOutputCode(_compiledHTML_File: VinylFile): VinylFile {

    const compiledHTML_File: MarkupProcessor.MarkupVinylFile = _compiledHTML_File as MarkupProcessor.MarkupVinylFile;

    compiledHTML_File.contents = Buffer.from(
      ResourceFilesPathsAliasesResolverForHTML.resolvePathAliases(compiledHTML_File, this.masterConfigRepresentative)
    );

    return compiledHTML_File;
  }

  private onPostProcessedCode(_compiledHTML_File: VinylFile): VinylFile {

    const compiledHTML_File: MarkupProcessor.MarkupVinylFile = _compiledHTML_File as MarkupProcessor.MarkupVinylFile;

    if (compiledHTML_File.processingSettings.HTML_Validation.mustExecute) {
      HTML_Validator.validateHTML(compiledHTML_File, this.masterConfigRepresentative);
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
