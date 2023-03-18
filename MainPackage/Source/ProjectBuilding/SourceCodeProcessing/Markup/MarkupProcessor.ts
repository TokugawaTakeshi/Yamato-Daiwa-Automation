/* --- Normalized config -------------------------------------------------------------------------------------------- */
import type MarkupProcessingSettings__Normalized from "@MarkupProcessing/MarkupProcessingSettings__Normalized";

/* --- Settings representatives ------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import MarkupProcessingSettingsRepresentative from "@MarkupProcessing/MarkupProcessingSettingsRepresentative";

/* --- Tasks executors ---------------------------------------------------------------------------------------------- */
import GulpStreamsBasedSourceCodeProcessor from "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBasedSourceCodeProcessor";
import type GulpStreamsBasedTaskExecutor from
    "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBased/GulpStreamsBasedTaskExecutor";

/* --- Gulp plugins ------------------------------------------------------------------------------------------------- */
import Gulp from "gulp";
import type VinylFile from "vinyl";
import gulpData from "gulp-data";
import gulpPug from "gulp-pug";
import gulpIntercept from "gulp-intercept";
import gulpHTML_Prettify from "gulp-html-prettify";

/* --- Applied utils ------------------------------------------------------------------------------------------------ */
import ResourcesReferencesResolverForHTML from
    "@MarkupProcessing/Plugins/ResourcesReferencesResolverForHTML/ResourcesReferencesResolverForHTML";
import HTML_Validator from
    "@MarkupProcessing/Plugins/HTML_Validator/HTML_Validator";
import AccessibilityInspector from "./Plugins/AccessibilityInspector/AccessibilityInspector";
import GulpStreamModifier from "@Utils/GulpStreamModifier";
import createImmediatelyEndingEmptyStream from "@Utils/createImmediatelyEndingEmptyStream";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import { isNull, isUndefined } from "@yamato-daiwa/es-extensions";
import type { ArbitraryObject } from "@yamato-daiwa/es-extensions";
import Path from "path";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";
import ImprovedGlob from "@UtilsIncubator/ImprovedGlob";


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
      return createImmediatelyEndingEmptyStream();
    }


    const dataHoldingSelfInstance: MarkupProcessor = new MarkupProcessor(
      masterConfigRepresentative, markupProcessingSettingsRepresentative
    );

    if (masterConfigRepresentative.isStaticPreviewBuildingMode || masterConfigRepresentative.isLocalDevelopmentBuildingMode) {
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
      return createImmediatelyEndingEmptyStream();
    }


    // === [ Temporary solution ] ======================================================================================
    /*  Inside the pipeline, files are passing one at a time, however to resolve the links inside
    *    file, it is required to know the correspondence of source and output paths of all files. This solution still
    *    not supports the deleting of the files. */
    for (
      const markupSourceFileAbsolutePath of
      ImprovedGlob.getFilesAbsolutePathsSynchronously(entryPointsSourceFilesAbsolutePaths)
    ) {

      if (
        this.markupProcessingConfigRepresentative.sourceAndOutputFilesAbsolutePathsCorrespondenceMap.
            has(markupSourceFileAbsolutePath)
      ) {
        continue;
      }


      const targetFileNameWithoutExtension: string = ImprovedPath.
          extractFileNameWithoutExtensionFromPath(markupSourceFileAbsolutePath);

      const markupEntryPointsGroupSettingsActualForCurrentFile: MarkupProcessingSettings__Normalized.EntryPointsGroup =
          this.markupProcessingConfigRepresentative.
              getExpectedToExistEntryPointsGroupSettingsRelevantForSpecifiedSourceFileAbsolutePath(markupSourceFileAbsolutePath);

      const outputFileNameWithExtensionWithLeadingDot: string =
          markupEntryPointsGroupSettingsActualForCurrentFile.mustConvertToHandlebarsOnNonStaticPreviewModes &&
          !this.masterConfigRepresentative.isStaticPreviewBuildingMode ? ".hbs" : ".html";


      this.markupProcessingConfigRepresentative.
          sourceAndOutputFilesAbsolutePathsCorrespondenceMap.
          set(
            markupSourceFileAbsolutePath,
            ImprovedPath.joinPathSegments(
              [
                MarkupProcessingSettingsRepresentative.
                  computeRelevantOutputDirectoryAbsolutePathForTargetSourceFile(
                    markupSourceFileAbsolutePath, markupEntryPointsGroupSettingsActualForCurrentFile
                  ),
                  `${ targetFileNameWithoutExtension }${ outputFileNameWithExtensionWithLeadingDot }`
                ],
              { forwardSlashOnlySeparators: true }
            )
          );

      const entryPointStateDependentVariations: MarkupProcessingSettings__Normalized.StaticPreview.
          PagesStateDependentVariationsSpecification.Page | null =
            this.markupProcessingConfigRepresentative.getEntryPointStateDependentVariations(markupSourceFileAbsolutePath);

      if (isNull(entryPointStateDependentVariations)) {
        continue;
      }


      for (const derivedSourceFileAbsolutePath of Object.keys(entryPointStateDependentVariations.derivedPagesAndStatesMap)) {

        const derivedSourceFileNameWithoutExtension: string = ImprovedPath.
            extractFileNameWithoutExtensionFromPath(derivedSourceFileAbsolutePath);

        this.markupProcessingConfigRepresentative.
            sourceAndOutputFilesAbsolutePathsCorrespondenceMap.
            set(
              derivedSourceFileAbsolutePath,
              ImprovedPath.joinPathSegments(
                [
                  MarkupProcessingSettingsRepresentative.
                  computeRelevantOutputDirectoryAbsolutePathForTargetSourceFile(
                    markupSourceFileAbsolutePath, markupEntryPointsGroupSettingsActualForCurrentFile
                  ),
                  `${ derivedSourceFileNameWithoutExtension }.html`
                ],
                { forwardSlashOnlySeparators: true }
              )
            );
      }

    }


    return (): NodeJS.ReadWriteStream => Gulp.src(entryPointsSourceFilesAbsolutePaths).

        pipe(super.printProcessedFilesPathsAndQuantity()).
        pipe(super.handleErrorIfItWillOccur()).

        pipe(gulpIntercept(this.addActualSourceCodeProcessingSettingsToVinylFile.bind(this))).

        pipe(GulpStreamModifier.modify({
          onStreamStartedEventCommonHandler: async (
            vinylFile: VinylFile,
            addNewFileToStream: GulpStreamModifier.NewFilesAdder
          ): Promise<GulpStreamModifier.CompletionSignals> => {

            if (!this.masterConfigRepresentative.isStaticPreviewBuildingMode) {
              return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);
            }


            const entryPointStateDependentVariations: MarkupProcessingSettings__Normalized.StaticPreview.
                PagesStateDependentVariationsSpecification.Page | null =
                    this.markupProcessingConfigRepresentative.
                        getEntryPointStateDependentVariations(String(vinylFile.sourceAbsolutePath));

            if (isNull(entryPointStateDependentVariations)) {
              return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);
            }


            /* [ Approach ] This empty object delivers the user from checking for non-null of state variable.  */
            vinylFile.pageStateDependentData = { [entryPointStateDependentVariations.stateVariableName]: {} };

            for (
              const [ derivedFileAbsolutePath, stateDependentData ] of
              Object.entries(entryPointStateDependentVariations.derivedPagesAndStatesMap)
            ) {

              const stateDependentMarkupVinylFileVariation: VinylFile = vinylFile.clone();

              stateDependentMarkupVinylFileVariation.path = Path.normalize(derivedFileAbsolutePath);
              stateDependentMarkupVinylFileVariation.sourceAbsolutePath = derivedFileAbsolutePath;
              stateDependentMarkupVinylFileVariation.pageStateDependentData = {
                [entryPointStateDependentVariations.stateVariableName]: stateDependentData
              };

              addNewFileToStream(stateDependentMarkupVinylFileVariation);
            }

            return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);
          }
        })).

        pipe(gulpData((vinylFile: VinylFile): ArbitraryObject => ({
          ...vinylFile.pageStateDependentData,
          ...this.masterConfigRepresentative.isStaticPreviewBuildingMode ?
              this.markupProcessingConfigRepresentative.staticDataForStaticPreview : null
        }))).

        pipe(gulpPug({
          locals: {
            __IS_STATIC_PREVIEW_BUILDING_MODE__: this.masterConfigRepresentative.isStaticPreviewBuildingMode,
            __IS_LOCAL_DEVELOPMENT_BUILDING_MODE__: this.masterConfigRepresentative.isLocalDevelopmentBuildingMode,
            __IS_TESTING_BUILDING_MODE__: this.masterConfigRepresentative.isTestingBuildingMode,
            __IS_STAGING_BUILDING_MODE__: this.masterConfigRepresentative.isStagingBuildingMode,
            __IS_PRODUCTION_BUILDING_MODE__: this.masterConfigRepresentative.isProductionBuildingMode
          },
          filters: {
            html_special_characters_to_html_entities: MarkupProcessor.escapeHTML_Entities
          }
        })).

        pipe(gulpIntercept(this.onRawOutputCode.bind(this))).

        pipe(gulpHTML_Prettify({ indent_char: " ", indent_size: 2 })).

        pipe(gulpIntercept(this.onPostProcessedCode.bind(this))).

        pipe(
          Gulp.dest((targetFile: VinylFile): string =>
              /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions --
               * No known simple solution; will be fixed at 2nd generation of MarkupProcessor.  */
              (targetFile as MarkupProcessor.MarkupVinylFile).outputDirectoryAbsolutePath)
        );
  }

  private addActualSourceCodeProcessingSettingsToVinylFile(fileInInitialState: VinylFile): MarkupProcessor.MarkupVinylFile {

    const markupEntryPointsGroupSettingsActualForCurrentFile: MarkupProcessingSettings__Normalized.EntryPointsGroup =
        this.markupProcessingConfigRepresentative.
            getExpectedToExistEntryPointsGroupSettingsRelevantForSpecifiedSourceFileAbsolutePath(fileInInitialState.path);


    fileInInitialState.processingSettings = markupEntryPointsGroupSettingsActualForCurrentFile;

    /* [ Theory ] The value of 'path' could change during file processing. */
    fileInInitialState.sourceAbsolutePath = ImprovedPath.replacePathSeparatorsToForwardSlashes(fileInInitialState.path);
    fileInInitialState.outputDirectoryAbsolutePath = MarkupProcessingSettingsRepresentative.
        computeRelevantOutputDirectoryAbsolutePathForTargetSourceFile(
          fileInInitialState.path, markupEntryPointsGroupSettingsActualForCurrentFile
        );

    /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions --
    * No known simple solution; will be fixed at 2nd generation of MarkupProcessor.  */
    return fileInInitialState as MarkupProcessor.MarkupVinylFile;
  }


  private onRawOutputCode(_compiledHTML_File: VinylFile): VinylFile {

    /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions --
     * No known simple solution; will be fixed at 2nd generation of MarkupProcessor.  */
    const compiledHTML_File: MarkupProcessor.MarkupVinylFile = _compiledHTML_File as MarkupProcessor.MarkupVinylFile;

    compiledHTML_File.contents = Buffer.from(
      ResourcesReferencesResolverForHTML.resolve(compiledHTML_File, this.masterConfigRepresentative)
    );

    return compiledHTML_File;
  }

  private onPostProcessedCode(_compiledHTML_File: VinylFile): VinylFile {

    /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions --
     * No known simple solution; will be fixed at 2nd generation of MarkupProcessor.  */
    const compiledHTML_File: MarkupProcessor.MarkupVinylFile = _compiledHTML_File as MarkupProcessor.MarkupVinylFile;

    if (
      compiledHTML_File.processingSettings.mustConvertToHandlebarsOnNonStaticPreviewModes &&
      !this.masterConfigRepresentative.isStaticPreviewBuildingMode
    ) {
      compiledHTML_File.extname = ".hbs";
    } else {

      if (compiledHTML_File.processingSettings.HTML_Validation.mustExecute) {
        HTML_Validator.validateHTML(compiledHTML_File, this.masterConfigRepresentative);
      }

      if (compiledHTML_File.processingSettings.accessibilityInspection.mustExecute) {
        AccessibilityInspector.inspectAccessibility(compiledHTML_File, this.masterConfigRepresentative);
      }
    }

    return compiledHTML_File;
  }


  private static escapeHTML_Entities(pugCode: string): string {

    return pugCode.
        replace(/</gu, "&lt;").
        replace(/>/gu, "&gt;").
        replace(/&/gu, "&amp;").
        replace(/"/gu, "&quot;").
        replace(/'/gu, "&apos;");

  }

}


export namespace MarkupProcessor {
  export type MarkupVinylFile =
      GulpStreamsBasedTaskExecutor.VinylFileWithCachedNormalizedSettings &
      Readonly<{
        processingSettings: MarkupProcessingSettings__Normalized.EntryPointsGroup;
      }>;
}


export default MarkupProcessor;
