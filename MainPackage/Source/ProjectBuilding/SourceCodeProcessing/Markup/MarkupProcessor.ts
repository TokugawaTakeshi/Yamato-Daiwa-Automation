/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import MarkupProcessingRestrictions from "@MarkupProcessing/MarkupProcessingRestrictions";

/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type MarkupProcessingSettings__Normalized from "@MarkupProcessing/MarkupProcessingSettings__Normalized";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type MarkupProcessingSettingsRepresentative from "@MarkupProcessing/MarkupProcessingSettingsRepresentative";

/* ─── Source Files Watcher ───────────────────────────────────────────────────────────────────────────────────────── */
import MarkupSourceFilesWatcher from "@MarkupProcessing/MarkupSourceFilesWatcher";

/* ─── Superclass ─────────────────────────────────────────────────────────────────────────────────────────────────── */
import GulpStreamsBasedTaskExecutor from
    "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBased/GulpStreamsBasedTaskExecutor";

/* ─── Shared State ───────────────────────────────────────────────────────────────────────────────────────────────── */
import MarkupProcessingSharedState from "@MarkupProcessing/MarkupProcessingSharedState";

/* ─── Gulp & Plugins ─────────────────────────────────────────────────────────────────────────────────────────────── */
import Gulp from "gulp";
import type VinylFile from "vinyl";
import gulpData from "gulp-data";
import gulpPug from "gulp-pug";

/* ─── Third-party Solutions Specialists ──────────────────────────────────────────────────────────────────────────── */
import PugPreProcessorSpecialist from "@ThirdPartySolutionsSpecialists/PugPreProcessorSpecialist";

/* ─── Applied Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import GulpStreamModifier from "@Utils/GulpStreamModifier";
import createImmediatelyEndingEmptyStream from "@Utils/createImmediatelyEndingEmptyStream";
import MarkupEntryPointVinylFile from "@MarkupProcessing/MarkupEntryPointVinylFile";
import SourceCodeSelectiveReprocessingHelper from "@Utils/SourceCodeSelectiveReprocessingHelper";
import DotYDA_DirectoryManager from "@Utils/DotYDA_DirectoryManager";
import computeContentMD5_Checksum from "rev-hash";
import HTML_Validator from "./Plugins/HTML_Validator/HTML_Validator";
import PointersReferencesResolverForHTML from "./Plugins/ResourcesPointersResolverForHTML/ResourcesPointersResolverForHTML";
import AccessibilityInspector from "@MarkupProcessing/Plugins/AccessibilityInspector/AccessibilityInspector";
import ImagesAspectRatioAffixer from "@MarkupProcessing/Plugins/ImagesAspectRatioAffixer";
import SpacesNormalizerForCJK_Text from "@MarkupProcessing/Plugins/DOM_Based/SpacesNormalizerForCJK_Text";
import CodeListingPugFilter from "@MarkupProcessing/PugFilters/CodeListingPugFilter";
import { html as formatHTML } from "js-beautify";
import HTML_CodeMinifier from "htmlnano";
import CSS_ClassesShortener from "@StylesProcessing/Plugins/CSS_ClassesShortener";
import RazorCodeGenerator from "@MarkupProcessing/Plugins/VinylFileBased/RazorCodeGenerator";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import {
  secondsToMilliseconds,
  isUndefined,
  isNotUndefined,
  isNotNull,
  getExpectedToBeNonUndefinedMapValue,
  removeSpecifiedFileNameExtensionsFromPath,
  Logger,
  UnexpectedEventError,
  type ArbitraryObject
} from "@yamato-daiwa/es-extensions";
import { ImprovedPath, ImprovedGlob } from "@yamato-daiwa/es-extensions-nodejs";
import { parse as parseHTML } from "node-html-parser";
import type { HTMLElement } from "node-html-parser";
import BrowserLiveReloader from "@BrowserLiveReloading/BrowserLiveReloader";


export default class MarkupProcessor extends GulpStreamsBasedTaskExecutor {

  private static readonly CACHED_ACCESSIBILITY_INSPECTION_RESULTS_DIRECTORY_NAME: string = "AccessibilityInspection";
  private static readonly ENTRY_POINTS_AND_PARTIAL_FILES_MAPPING_CACHE_FILE_NAME_WITH_EXTENSION: string =
      "MarkupEntryPointsAndAffiliatedFilesMappingCache.json";

  protected readonly logging: GulpStreamsBasedTaskExecutor.Logging;

  private readonly CACHED_ACCESSIBILITY_INSPECTION_RESULTS_DIRECTORY_ABSOLUTE_PATH: string;

  private readonly markupProcessingSettingsRepresentative: MarkupProcessingSettingsRepresentative;

  private readonly absolutePathOfFilesWaitingForReProcessing: Set<string> = new Set<string>();
  private sourceCodeSelectiveReprocessingHelper: SourceCodeSelectiveReprocessingHelper | null = null;
  private subsequentFilesStateChangeTimeout: NodeJS.Timeout | null = null;


  public static provideMarkupProcessingIfMust(
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): () => NodeJS.ReadWriteStream {

    const markupProcessingSettingsRepresentative: MarkupProcessingSettingsRepresentative | undefined =
        projectBuildingMasterConfigRepresentative.markupProcessingSettingsRepresentative;

    if (isUndefined(markupProcessingSettingsRepresentative)) {
      return createImmediatelyEndingEmptyStream();
    }


    const dataHoldingSelfInstance: MarkupProcessor = new MarkupProcessor(
      markupProcessingSettingsRepresentative, projectBuildingMasterConfigRepresentative
    );

    MarkupProcessingSharedState.pagesVariationsMetadata = markupProcessingSettingsRepresentative.createPagesVariationsMetadata(
      ImprovedGlob.getFilesAbsolutePathsSynchronously(
        markupProcessingSettingsRepresentative.initialRelevantEntryPointsSourceFilesAbsolutePaths,
        { alwaysForwardSlashSeparators: true }
      )
    );

    if (markupProcessingSettingsRepresentative.mustValidateHTML) {

      HTML_Validator.initialize({
        temporaryFilesDirectoryAbsolutePath: DotYDA_DirectoryManager.TEMPORARY_FILES_DIRECTORY_ABSOLUTE_PATH,
        projectBuildingMasterConfigRepresentative,
        logging: {
          validationStart: markupProcessingSettingsRepresentative.loggingSettings.HTML_Validation.starting,
          validationCompletionWithoutIssues: markupProcessingSettingsRepresentative.loggingSettings.HTML_Validation.
            completionWithoutIssues
        }
      });

    }

    if (markupProcessingSettingsRepresentative.mustInspectAccessibility) {
      AccessibilityInspector.beginInitialization({
        cachedInspectionsResultsFileParentDirectoryAbsolutePath: dataHoldingSelfInstance.
            CACHED_ACCESSIBILITY_INSPECTION_RESULTS_DIRECTORY_ABSOLUTE_PATH,
        consumingProjectBuildingMode: projectBuildingMasterConfigRepresentative.consumingProjectBuildingMode,
        projectBuildingSelectiveExecutionID: projectBuildingMasterConfigRepresentative.selectiveExecutionID,
        logging: {
          inspectionStart:
              markupProcessingSettingsRepresentative.loggingSettings.HTML_Validation.starting,
          inspectionCompletionWithoutIssues:
              markupProcessingSettingsRepresentative.loggingSettings.HTML_Validation.completionWithoutIssues
        }
      });
    }

    if (projectBuildingMasterConfigRepresentative.mustProvideIncrementalBuilding) {

      dataHoldingSelfInstance.sourceCodeSelectiveReprocessingHelper = new SourceCodeSelectiveReprocessingHelper({
        initialEntryPointsSourceFilesAbsolutePaths: markupProcessingSettingsRepresentative.
            initialRelevantEntryPointsSourceFilesAbsolutePaths,
        childrenFilesResolutionRules: {
          childrenFilesIncludingDeclarationsPatterns: PugPreProcessorSpecialist.partialFilesIncludingDeclarationPatterns,
          implicitFilesNamesExtensionsWithoutLeadingDotsOfChildrenFiles: PugPreProcessorSpecialist.
              implicitFilesNamesExtensionsWithoutLeadingDotsOfPartials
        },
        isEntryPoint: markupProcessingSettingsRepresentative.isEntryPoint.bind(markupProcessingSettingsRepresentative),
        logging: {
          mustEnable: markupProcessingSettingsRepresentative.loggingSettings.partialFilesAndParentEntryPointsCorrespondence,
          targetFilesTypeInSingularForm: markupProcessingSettingsRepresentative.TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM
        },
        consumingProjectRootDirectoryAbsolutePath: projectBuildingMasterConfigRepresentative.
            consumingProjectRootDirectoryAbsolutePath,
        cacheFileAbsolutePath: ImprovedPath.joinPathSegments(
          [
            DotYDA_DirectoryManager.OPTIMIZATION_FILES_DIRECTORY_ABSOLUTE_PATH,
            MarkupProcessor.ENTRY_POINTS_AND_PARTIAL_FILES_MAPPING_CACHE_FILE_NAME_WITH_EXTENSION
          ]
        )
      });

      MarkupSourceFilesWatcher.
          initializeIfRequiredAndGetInstance({
            markupProcessingSettingsRepresentative,
            projectBuildingMasterConfigRepresentative
          }).
          addOnAnyEventRelatedWithActualFilesHandler({
            handlerID: "ON_ANY_EVENT_WITH_MARKUP_SOURCE_CODE_FILE--BY_MARKUP_PROCESSOR",
            handler: dataHoldingSelfInstance.onSourceFilesWatcherEmitsAnyEvent.bind(dataHoldingSelfInstance)
          }).
          addOnEntryPointFileAddedEventHandler({
            handlerID: "ON_MARKUP_ENTRY_POINT_FILE_ADDED--BY_MARKUP_PROCESSOR",
            handler: dataHoldingSelfInstance.onEntryPointFileAdded.bind(dataHoldingSelfInstance)
          }).
          addOnEntryPointFileDeletedEventHandler({
            handlerID: "ON_MARKUP_ENTRY_POINT_FILE_DELETED--BY_MARKUP_PROCESSOR",
            handler: MarkupProcessor.onEntryPointFileDeleted
          });

      if (projectBuildingMasterConfigRepresentative.processingOnDemandSettings.enabled) {

        BrowserLiveReloader.addOnNewPageOpenedEventHandler({
          handlerID: "ON_PAGE_CHANGE_EVENT_HANDLER--BY_MARKUP_PROCESSOR",
          async handler(
            { relatedSourcePugFileAbsolutePath__forwardSlashSeparators }: BrowserLiveReloader.OnPageChangedEventHandler.Payload
          ): Promise<void> {
            dataHoldingSelfInstance.processEntryPoints([ relatedSourcePugFileAbsolutePath__forwardSlashSeparators ])();
            return Promise.resolve();
          }
        });

        if (!projectBuildingMasterConfigRepresentative.processingOnDemandSettings.fullInitialBuilding) {
          return createImmediatelyEndingEmptyStream();
        }

      }

    }

    return dataHoldingSelfInstance.processEntryPoints(
      markupProcessingSettingsRepresentative.initialRelevantEntryPointsSourceFilesAbsolutePaths
    );

  }


  private constructor(
    markupProcessingSettingsRepresentative: MarkupProcessingSettingsRepresentative,
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ) {

    super({
      projectBuildingMasterConfigRepresentative,
      taskTitleForLogging: markupProcessingSettingsRepresentative.TASK_NAME_FOR_LOGGING
    });

    this.logging = {
      pathsOfFilesWillBeProcessed: markupProcessingSettingsRepresentative.loggingSettings.filesPaths,
      quantityOfFilesWillBeProcessed: markupProcessingSettingsRepresentative.loggingSettings.filesCount
    };

    this.markupProcessingSettingsRepresentative = markupProcessingSettingsRepresentative;

    this.CACHED_ACCESSIBILITY_INSPECTION_RESULTS_DIRECTORY_ABSOLUTE_PATH = ImprovedPath.joinPathSegments(
      [
        DotYDA_DirectoryManager.OPTIMIZATION_FILES_DIRECTORY_ABSOLUTE_PATH,
        MarkupProcessor.CACHED_ACCESSIBILITY_INSPECTION_RESULTS_DIRECTORY_NAME
      ],
      { alwaysForwardSlashSeparators: true }
    );

  }


  private processEntryPoints(entryPointsSourceFilesAbsolutePaths: Array<string>): () => NodeJS.ReadWriteStream {

    /* [ Theory ] If to pass the empty array to 'Gulp.src()' error will occur but the cause will not be told clearly.
     *    However, the empty array is usual scenario (for example when user declared the configuration but has not added
     *    files of specific entry points group yet).  */
    if (entryPointsSourceFilesAbsolutePaths.length === 0) {
      return createImmediatelyEndingEmptyStream();
    }


    return (): NodeJS.ReadWriteStream => Gulp.

        src(entryPointsSourceFilesAbsolutePaths).

        pipe(this.handleErrorIfItWillOccur()).

        pipe(
          GulpStreamModifier.modifyForSingleVinylFileSubtype({
            onStreamStartedEventHandler: this.replacePlainVinylFileWithMarkupEntryPointVinylFile.bind(this)
          })
        ).

        pipe(
          GulpStreamModifier.modifyForSingleVinylFileSubtype({
            onStreamStartedEventHandler: MarkupProcessor.managePageVariations
          })
        ).

        pipe(super.logInputFilesIfMust()).

        pipe(
          gulpData(
            (vinylFile: VinylFile): ArbitraryObject => ({
              ...vinylFile.pageStateDependentVariationData ?? null,
              ...vinylFile.localizationData ?? null,
              ...this.projectBuildingMasterConfigRepresentative.isStaticPreviewBuildingMode ?
                  this.markupProcessingSettingsRepresentative.staticDataForStaticPreview : null,
              ...MarkupProcessingSharedState.importsFromTypeScript,
              ...MarkupProcessingSharedState.importsFromJavaScript
            })
          )
        ).

        pipe(
          gulpPug({
            locals: {
              __IS_STATIC_PREVIEW_BUILDING_MODE__YDA__:
                  this.projectBuildingMasterConfigRepresentative.isStaticPreviewBuildingMode,
              __IS_LOCAL_DEVELOPMENT_BUILDING_MODE__YDA__:
                  this.projectBuildingMasterConfigRepresentative.isLocalDevelopmentBuildingMode,
              __IS_TESTING_BUILDING_MODE__YDA__:
                  this.projectBuildingMasterConfigRepresentative.isTestingBuildingMode,
              __IS_STAGING_BUILDING_MODE__YDA__:
                  this.projectBuildingMasterConfigRepresentative.isStagingBuildingMode,
              __IS_PRODUCTION_BUILDING_MODE__YDA__:
                  this.projectBuildingMasterConfigRepresentative.isProductionBuildingMode,
              ...isNotUndefined(this.markupProcessingSettingsRepresentative.routingSettings) ? {
                  [this.markupProcessingSettingsRepresentative.routingSettings.variable]:
                      this.markupProcessingSettingsRepresentative.routingSettings.routes
              } : null
            },
            filters: {
              html_special_characters_to_html_entities: MarkupProcessor.convertApplicableCharactersToHTML_Entities,
              "code_listing--yda": CodeListingPugFilter.apply
            }
          })
        ).

        pipe(
          GulpStreamModifier.modifyForSingleVinylFileSubtype({
            onStreamStartedEventHandler: this.postProcessHTML_LikeCode.bind(this)
          })
        ).

        pipe(super.logOutputFilesIfMust()).

        pipe(
          Gulp.dest(
            (targetFile: VinylFile): string =>
                MarkupEntryPointVinylFile.getOutputDirectoryAbsolutePathOfExpectedToBeSelfInstance(targetFile)
          )
        ).

        on("end", this.onStreamEnded.bind(this));

  }


  /* ━━━ Pipeline Methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private async replacePlainVinylFileWithMarkupEntryPointVinylFile(
    plainVinylFile: VinylFile, addNewFileToStream: GulpStreamModifier.NewFilesAdder
  ): Promise<GulpStreamModifier.CompletionSignals> {

    addNewFileToStream(
      new MarkupEntryPointVinylFile({
        initialPlainVinylFile: plainVinylFile,
        markupProcessingSettingsRepresentative: this.markupProcessingSettingsRepresentative
      })
    );

    return Promise.resolve(GulpStreamModifier.CompletionSignals.REMOVING_FILE_FROM_STREAM);

  }

  private static async managePageVariations(
    markupEntryPointVinylFile: MarkupEntryPointVinylFile, addNewFilesToStream: GulpStreamModifier.NewFilesAdder
  ): Promise<GulpStreamModifier.CompletionSignals> {

    const {
      newFiles,
      mustInitialFileBeDeleted
    }: MarkupEntryPointVinylFile.VariationsManagement = markupEntryPointVinylFile.manageVariations();

    addNewFilesToStream(newFiles);

    return Promise.resolve(
      mustInitialFileBeDeleted ?
          GulpStreamModifier.CompletionSignals.REMOVING_FILE_FROM_STREAM :
          GulpStreamModifier.CompletionSignals.PASSING_ON
    );

  }


  /* [ Theory ] The ampersand must be escaped first, otherwise the ampersand from which HTML other entities begins
  *    will be escaped too.  */
  private static convertApplicableCharactersToHTML_Entities(pugCode: string): string {
    return pugCode.
        replace(/&/gu, "&amp;").
        replace(/</gu, "&lt;").
        replace(/>/gu, "&gt;").
        replace(/"/gu, "&quot;").
        replace(/'/gu, "&apos;");
  }

  /* eslint-disable @typescript-eslint/member-ordering --
   * The order is logical (pipeline-based), but not all methods need `this` thus should be static. */
  private async postProcessHTML_LikeCode(
    markupEntryPointVinylFile: MarkupEntryPointVinylFile
  ): Promise<GulpStreamModifier.CompletionSignals> {

    let rootHTML_Element: HTMLElement = parseHTML(markupEntryPointVinylFile.stringifiedContents);

    rootHTML_Element = PointersReferencesResolverForHTML.resolve({
      rootHTML_Element,
      projectBuildingMasterConfigRepresentative: this.projectBuildingMasterConfigRepresentative,
      markupProcessingSettingsRepresentative: this.markupProcessingSettingsRepresentative,
      absolutePathOfOutputDirectoryForTargetHTML_File: markupEntryPointVinylFile.outputDirectoryAbsolutePath
    });

    rootHTML_Element = ImagesAspectRatioAffixer.affix({
      rootHTML_Element,
      publicPath: this.projectBuildingMasterConfigRepresentative.actualPublicDirectoryAbsolutePath,
      consumingProjectRootDirectoryAbsolutePath: this.projectBuildingMasterConfigRepresentative.
          consumingProjectRootDirectoryAbsolutePath,
      absolutePathOfOutputDirectoryForTargetHTML_File: markupEntryPointVinylFile.outputDirectoryAbsolutePath
    });

    rootHTML_Element = SpacesNormalizerForCJK_Text.normalize(rootHTML_Element);

    rootHTML_Element =
          CSS_ClassesShortener.
              replaceAllowedCSS_ClassesInMarkupAndSaveCorrespondencesIfMust(
                rootHTML_Element,
                this.projectBuildingMasterConfigRepresentative
              );

    markupEntryPointVinylFile.setContents(rootHTML_Element.toString());
    let formattedHTML_CodeForReports: string | null = null;

    /* [ Approach ]
     * Pug gives neither good formatting nor good minification, thus the `stringifiedContents` is neither of.
     * Depending on the settings, the `stringifiedContents` must be formatted or minified. */
    if (markupEntryPointVinylFile.actualEntryPointsGroupSettings.outputCodeFormatting.mustExecute) {

      switch (markupEntryPointVinylFile.actualEntryPointsGroupSettings.outputFormat) {

        case MarkupProcessingRestrictions.OutputFormats.HTML: {
          markupEntryPointVinylFile.setContents(MarkupProcessor.formatHTML_Code(markupEntryPointVinylFile));
          formattedHTML_CodeForReports = markupEntryPointVinylFile.stringifiedContents;
          break;
        }

        case MarkupProcessingRestrictions.OutputFormats.handlebars: {
          markupEntryPointVinylFile.setContents(MarkupProcessor.formatHandlebarsCode(markupEntryPointVinylFile));
          break;
        }

        case MarkupProcessingRestrictions.OutputFormats.razor: {

          RazorCodeGenerator.generateAndSetContentForVinylFile(markupEntryPointVinylFile);

        }

      }

    } else if (markupEntryPointVinylFile.actualEntryPointsGroupSettings.outputCodeMinifying.mustExecute) {

      markupEntryPointVinylFile.setContents(
        await MarkupProcessor.minifyHTML_Code(markupEntryPointVinylFile)
      );

    }

    if (
      markupEntryPointVinylFile.actualEntryPointsGroupSettings.outputFormat ===
          MarkupProcessingRestrictions.OutputFormats.razor
    ) {

      markupEntryPointVinylFile.basename = removeSpecifiedFileNameExtensionsFromPath({
        filePath: markupEntryPointVinylFile.basename,
        filesNamesExtensions: [ "razor" ],
        mustIgnoreLastOrSingleFileNameExtension: true,
        pathsSeparatorMustBeUsedInOutputPathWhen2_KindsMixedInInitialPaths: "/"
      });

      markupEntryPointVinylFile.extname = ".razor";

      return GulpStreamModifier.CompletionSignals.PASSING_ON;

    }


    if (
      markupEntryPointVinylFile.actualEntryPointsGroupSettings.outputFormat ===
          MarkupProcessingRestrictions.OutputFormats.handlebars &&
              !this.projectBuildingMasterConfigRepresentative.isStaticPreviewBuildingMode
    ) {

      markupEntryPointVinylFile.extname = ".hbs";

      return GulpStreamModifier.CompletionSignals.PASSING_ON;

    }


    const entryPointFileContentRelativeToConsumingProjectRootDirectory__forwardSlashesSeparatorsOnly: string =
        ImprovedPath.computeRelativePath({
          basePath: this.projectBuildingMasterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath,
          comparedPath: markupEntryPointVinylFile.path,
          alwaysForwardSlashSeparators: true
        });

    const MD5_ChecksumOfCompleteHTML_Code: string = computeContentMD5_Checksum(markupEntryPointVinylFile.stringifiedContents);

    if (markupEntryPointVinylFile.actualEntryPointsGroupSettings.HTML_Validation.mustExecute) {

      formattedHTML_CodeForReports =
          formattedHTML_CodeForReports ??
          MarkupProcessor.formatHTML_Code(markupEntryPointVinylFile);

      HTML_Validator.enqueueFileForValidation({
        formattedHTML_Content: formattedHTML_CodeForReports,
        HTML_ContentMD5_Hash: MD5_ChecksumOfCompleteHTML_Code,
        originalHTML_FilePathRelativeToConsumingProjectRoot__forwardSlashesSeparatorsOnly:
            entryPointFileContentRelativeToConsumingProjectRootDirectory__forwardSlashesSeparatorsOnly
      });

    }

    if (markupEntryPointVinylFile.actualEntryPointsGroupSettings.accessibilityInspection.mustExecute) {

      formattedHTML_CodeForReports =
          formattedHTML_CodeForReports ??
          MarkupProcessor.formatHTML_Code(markupEntryPointVinylFile);

      if (this.projectBuildingMasterConfigRepresentative.mustProvideIncrementalBuilding) {

        AccessibilityInspector.inspectAtBackgroundAndReportImmediatelyWithoutThrowingOfErrors({
          HTML_Code: formattedHTML_CodeForReports,
          HTML_CodeMD5Checksum: MD5_ChecksumOfCompleteHTML_Code,
          accessibilityStandard: markupEntryPointVinylFile.actualEntryPointsGroupSettings.accessibilityInspection.standard,
          targetHTML_FilePathRelativeToConsumingProjectRootDirectory:
              entryPointFileContentRelativeToConsumingProjectRootDirectory__forwardSlashesSeparatorsOnly
        });

      } else {

        AccessibilityInspector.inspectAtBackgroundWithoutReporting({
          HTML_Code: formattedHTML_CodeForReports,
          HTML_CodeMD5Checksum: MD5_ChecksumOfCompleteHTML_Code,
          accessibilityStandard: markupEntryPointVinylFile.actualEntryPointsGroupSettings.accessibilityInspection.standard,
          targetHTML_FilePathRelativeToConsumingProjectRootDirectory:
          entryPointFileContentRelativeToConsumingProjectRootDirectory__forwardSlashesSeparatorsOnly
        });

      }

    }

    return GulpStreamModifier.CompletionSignals.PASSING_ON;

  }

  private onStreamEnded(): void {

    if (this.markupProcessingSettingsRepresentative.mustValidateHTML) {
      HTML_Validator.validateQueuedFilesButReportAll();
    }


    if (!this.projectBuildingMasterConfigRepresentative.mustProvideIncrementalBuilding) {

      if (this.markupProcessingSettingsRepresentative.mustInspectAccessibility) {
        AccessibilityInspector.reportCachedValidationsResultsAndFinalize();
      }

    }

    if (this.projectBuildingMasterConfigRepresentative.processingOnDemandSettings.enabled) {

      try {

        BrowserLiveReloader.reload();

      } catch (error: unknown) {

        Logger.logError({
          errorType: UnexpectedEventError.NAME,
          title: UnexpectedEventError.localization.defaultTitle,
          description:
              "The error has occurred during the attempt browser page reloading. " +
              "If the browser page reloading functionality has been set up property, we are sorry but it is the bug.",
          occurrenceLocation: "MarkupProcessor.onStreamEnded",
          caughtError: error
        });

      }

    }

  }


  /* ━━━ Rebuilding ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private onSourceFilesWatcherEmitsAnyEvent(targetFileAbsolutePath__forwardSlashesSeparators: string): void {

    this.absolutePathOfFilesWaitingForReProcessing.add(targetFileAbsolutePath__forwardSlashesSeparators);

    if (isNotNull(this.subsequentFilesStateChangeTimeout)) {
      clearTimeout(this.subsequentFilesStateChangeTimeout);
    }


    this.subsequentFilesStateChangeTimeout = setTimeout(
      this.onSubsequentFilesStateChangeTimeoutExpired.bind(this),
      secondsToMilliseconds(this.markupProcessingSettingsRepresentative.WAITING_FOR_SUBSEQUENT_FILES_WILL_SAVED_PERIOD__SECONDS)
    );

  }

  private onSubsequentFilesStateChangeTimeoutExpired(): void {

    if (this.projectBuildingMasterConfigRepresentative.processingOnDemandSettings.enabled) {

      const currentHTML_FileAbsolutePath__forwardSlashesPathSeparators: string | null =
          BrowserLiveReloader.currentHTML_FileAbsolutePath__forwardSlashesPathSeparators;

      if (isNotNull(currentHTML_FileAbsolutePath__forwardSlashesPathSeparators)) {

        this.processEntryPoints([
          getExpectedToBeNonUndefinedMapValue(
            MarkupProcessingSharedState.outputHTML_FilesAndSourcePugFilesAbsolutePathsCorrespondenceMap,
            currentHTML_FileAbsolutePath__forwardSlashesPathSeparators
          )
        ])();

        this.absolutePathOfFilesWaitingForReProcessing.clear();

        return;

      }

    }


    this.processEntryPoints(
      this.sourceCodeSelectiveReprocessingHelper?.getAbsolutePathsOfEntryPointsWhichMustBeProcessed(
        this.absolutePathOfFilesWaitingForReProcessing
      ) ?? []
    )();

    this.absolutePathOfFilesWaitingForReProcessing.clear();

  }

  private onEntryPointFileAdded(targetFileAbsolutePath__forwardSlashesSeparators: string): void {
    MarkupProcessingSharedState.pagesVariationsMetadata.set(
      targetFileAbsolutePath__forwardSlashesSeparators,
      this.markupProcessingSettingsRepresentative.createPageVariationsMetadata(targetFileAbsolutePath__forwardSlashesSeparators)
    );
  }

  private static onEntryPointFileDeleted(targetFileAbsolutePath__forwardSlashesSeparators: string): void {
    MarkupProcessingSharedState.pagesVariationsMetadata.delete(targetFileAbsolutePath__forwardSlashesSeparators);
  }


  /* ━━━ Helpers ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private static formatHTML_Code(markupVinylFile: MarkupEntryPointVinylFile): string {

    const { outputCodeFormatting: outputCodeFormattingSettings }: MarkupProcessingSettings__Normalized.EntryPointsGroup =
        markupVinylFile.actualEntryPointsGroupSettings;

    /* [ Theory ]
     * + `indent_with_tabs` overrides `indent_size` and `indent_char` so not required.
     * */
    return formatHTML(
      markupVinylFile.stringifiedContents,
      {
        indent_size: 2,
        indent_char: outputCodeFormattingSettings.indentationString,
        eol: outputCodeFormattingSettings.lineSeparators,
        end_with_newline: outputCodeFormattingSettings.mustGuaranteeTrailingEmptyLine,
        indent_body_inner_html: outputCodeFormattingSettings.mustIndentHeadAndBodyTags
      }
    );

  }

  private static formatHandlebarsCode(markupVinylFile: MarkupEntryPointVinylFile): string {

    const { outputCodeFormatting: outputCodeFormattingSettings }: MarkupProcessingSettings__Normalized.EntryPointsGroup =
        markupVinylFile.actualEntryPointsGroupSettings;

    /* [ Theory ]
     * + `indent_with_tabs` overrides `indent_size` and `indent_char` so not required.
     * */
    return formatHTML(
      markupVinylFile.stringifiedContents,
      {
        indent_size: 2,
        indent_char: outputCodeFormattingSettings.indentationString,
        eol: outputCodeFormattingSettings.lineSeparators,
        end_with_newline: outputCodeFormattingSettings.mustGuaranteeTrailingEmptyLine,
        indent_body_inner_html: outputCodeFormattingSettings.mustIndentHeadAndBodyTags,
        templating: [ "handlebars" ]
      }
    );

  }

  private static async minifyHTML_Code(markupVinylFile: MarkupEntryPointVinylFile): Promise<string> {

    const { outputCodeMinifying: outputCodeFormattingSettings }: MarkupProcessingSettings__Normalized.EntryPointsGroup =
        markupVinylFile.actualEntryPointsGroupSettings;

    return (
      await HTML_CodeMinifier.process(
        markupVinylFile.stringifiedContents,
        {

          collapseAttributeWhitespace: outputCodeFormattingSettings.attributesExtraWhitespacesCollapsing,
          deduplicateAttributeValues: outputCodeFormattingSettings.attributesValuesDeduplication,
          collapseWhitespace: "aggressive",
          minifyCss: true,
          minifyJs: true,

          /* [ Theory ] Could cause the errors like #htmlnano fails to minify the svg:Error: Config should be an object#
           *   on which user can not affect */
          minifySvg: false

        }
      )
    ).html;

  }
  /* eslint-enable @typescript-eslint/member-ordering */

}
