/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import MarkupProcessingRestrictions from "@MarkupProcessing/MarkupProcessingRestrictions";

/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type MarkupProcessingSettings__Normalized from "@MarkupProcessing/MarkupProcessingSettings__Normalized";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import MarkupProcessingSettingsRepresentative from "@MarkupProcessing/MarkupProcessingSettingsRepresentative";

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
import gulpIf from "gulp-if";
import gulpData from "gulp-data";
import gulpPug from "gulp-pug";
import gulpHTML_Prettify from "gulp-html-prettify";

/* ─── Third-party Solutions Specialises ──────────────────────────────────────────────────────────────────────────── */
import PugPreProcessorSpecialist from "@ThirdPartySolutionsSpecialists/PugPreProcessorSpecialist";

/* ─── Applied Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import GulpStreamModifier from "@Utils/GulpStreamModifier";
import createImmediatelyEndingEmptyStream from "@Utils/createImmediatelyEndingEmptyStream";
import MarkupEntryPointVinylFile from "@MarkupProcessing/MarkupEntryPointVinylFile";
import SourceCodeSelectiveReprocessingHelper from "@Utils/SourceCodeSelectiveReprocessingHelper";
import DotYDA_DirectoryManager from "@Utils/DotYDA_DirectoryManager";
import computeContentMD5_Checksum from "rev-hash";
import HTML_Validator from "@MarkupProcessing/Plugins/HTML_Validator/HTML_Validator";
import ResourcesReferencesResolverForHTML from
    "@MarkupProcessing/Plugins/ResourcesReferencesResolverForHTML/ResourcesReferencesResolverForHTML";
import AccessibilityInspector from "@MarkupProcessing/Plugins/AccessibilityInspector/AccessibilityInspector";
import ImagesAspectRatioAffixer from "@MarkupProcessing/Plugins/ImagesAspectRatioAffixer";
import SpacesNormalizerForCJK_Text from "@MarkupProcessing/Plugins/SpacesNormalizerForCJK_Text";
import CodeListingPugFilter from "@MarkupProcessing/PugFilters/CodeListingPugFilter";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import type { ArbitraryObject, LineSeparators } from "@yamato-daiwa/es-extensions";
import {
  secondsToMilliseconds,
  addElementsToArray,
  getIndexOfArrayElementSatisfiesThePredicateIfSuchElementIsExactlyOne,
  isUndefined,
  isNotNull,
  isNull,
  explodeStringToLines,
  getLineSeparatorType,
  extractFileNameWithoutLastExtension
} from "@yamato-daiwa/es-extensions";
import { ImprovedPath, ImprovedGlob } from "@yamato-daiwa/es-extensions-nodejs";
import { parse as parseHTML } from "node-html-parser";
import type { HTMLElement } from "node-html-parser";


export default class MarkupProcessor extends GulpStreamsBasedTaskExecutor {

  private static readonly CACHED_HTML_VALIDATION_RESULTS_DIRECTORY_NAME: string = "HTML_Validation";
  private static readonly CACHED_ACCESSIBILITY_INSPECTION_RESULTS_DIRECTORY_NAME: string = "AccessibilityInspection";
  private static readonly ENTRY_POINTS_AND_PARTIAL_FILES_MAPPING_CACHE_FILE_NAME_WITH_EXTENSION: string =
      "MarkupEntryPointsAndAffiliatedFilesMappingCache.json";

  protected readonly logging: GulpStreamsBasedTaskExecutor.Logging;

  private readonly CACHED_HTML_VALIDATION_RESULTS_DIRECTORY_ABSOLUTE_PATH: string;
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

    dataHoldingSelfInstance.initializeSourceAndOutputFilesAbsolutePathsCorrespondenceMap();

    if (markupProcessingSettingsRepresentative.mustValidateHTML) {
      HTML_Validator.beginInitialization({
        cachedValidationsResultsFileParentDirectoryAbsolutePath: dataHoldingSelfInstance.
            CACHED_HTML_VALIDATION_RESULTS_DIRECTORY_ABSOLUTE_PATH,
        consumingProjectBuildingMode: projectBuildingMasterConfigRepresentative.consumingProjectBuildingMode,
        projectBuildingSelectiveExecutionID: projectBuildingMasterConfigRepresentative.selectiveExecutionID,
        logging: {
          validationStart:
              markupProcessingSettingsRepresentative.loggingSettings.HTML_Validation.starting,
          validationCompletionWithoutIssues:
              markupProcessingSettingsRepresentative.loggingSettings.HTML_Validation.completionWithoutIssues
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
        affiliatedFilesResolutionRules: {
          affiliatedFilesIncludingDeclarationsPatterns: PugPreProcessorSpecialist.partialFilesIncludingDeclarationPatterns,
          implicitFilesNamesExtensionsWithoutLeadingDotsOfAffiliatedFiles: PugPreProcessorSpecialist.
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
      taskTitleForLogging: "Markup processing"
    });

    this.logging = {
      pathsOfFilesWillBeProcessed: markupProcessingSettingsRepresentative.loggingSettings.filesPaths,
      quantityOfFilesWillBeProcessed: markupProcessingSettingsRepresentative.loggingSettings.filesCount
    };

    this.markupProcessingSettingsRepresentative = markupProcessingSettingsRepresentative;

    this.CACHED_HTML_VALIDATION_RESULTS_DIRECTORY_ABSOLUTE_PATH = ImprovedPath.joinPathSegments(
      [
        DotYDA_DirectoryManager.OPTIMIZATION_FILES_DIRECTORY_ABSOLUTE_PATH,
        MarkupProcessor.CACHED_HTML_VALIDATION_RESULTS_DIRECTORY_NAME
      ],
      { alwaysForwardSlashSeparators: true }
    );

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
          GulpStreamModifier.modify({
            onStreamStartedEventCommonHandler: this.replacePlainVinylFileWithMarkupEntryPointVinylFile.bind(this)
          })
        ).

        pipe(
          GulpStreamModifier.modify({
            onStreamStartedEventHandlersForSpecificFileTypes: new Map([
              [ MarkupEntryPointVinylFile, this.injectImportsFromTypeScriptIfAnyToMarkupFile.bind(this) ]
            ])
          })
        ).

        pipe(
          GulpStreamModifier.modify({
            onStreamStartedEventHandlersForSpecificFileTypes: new Map([
              [ MarkupEntryPointVinylFile, MarkupProcessor.createEntryPointsStateDependentVariations ]
            ])
          })
        ).

        pipe(this.logProcessedFilesIfMust()).

        pipe(
          gulpData(
            (vinylFile: VinylFile): ArbitraryObject => ({
              ...vinylFile.pageStateDependentVariationData ?? null,
              ...this.projectBuildingMasterConfigRepresentative.isStaticPreviewBuildingMode ?
                  this.markupProcessingSettingsRepresentative.staticDataForStaticPreview : null
            })
          )
        ).

        pipe(
          gulpPug({
            locals: {
              __IS_STATIC_PREVIEW_BUILDING_MODE__:
                  this.projectBuildingMasterConfigRepresentative.isStaticPreviewBuildingMode,
              __IS_LOCAL_DEVELOPMENT_BUILDING_MODE__:
                  this.projectBuildingMasterConfigRepresentative.isLocalDevelopmentBuildingMode,
              __IS_TESTING_BUILDING_MODE__:
                  this.projectBuildingMasterConfigRepresentative.isTestingBuildingMode,
              __IS_STAGING_BUILDING_MODE__:
                  this.projectBuildingMasterConfigRepresentative.isStagingBuildingMode,
              __IS_PRODUCTION_BUILDING_MODE__:
                  this.projectBuildingMasterConfigRepresentative.isProductionBuildingMode
            },
            filters: {
              html_special_characters_to_html_entities: MarkupProcessor.convertApplicableCharactersToHTML_Entities,
              "code_listing--yda": CodeListingPugFilter.apply
            }
          })
        ).

        pipe(
          gulpIf(
            (markupFile: VinylFile): boolean => markupFile instanceof MarkupEntryPointVinylFile &&
                markupFile.actualEntryPointsGroupSettings.outputCodeFormatting.mustExecute,
            gulpHTML_Prettify({ indent_char: " ", indent_size: 2 })
          )
        ).

        pipe(
          GulpStreamModifier.modify({
            onStreamStartedEventHandlersForSpecificFileTypes: new Map([
              [ MarkupEntryPointVinylFile, this.onOutputHTML_FileReady.bind(this) ]
            ])
          })
        ).

        pipe(
          Gulp.dest(
            (targetFile: VinylFile): string =>
                MarkupEntryPointVinylFile.getOutputDirectoryAbsolutePathOfExpectedToBeSelfInstance(targetFile)
          )
        ).

        on("end", this.onStreamEnded.bind(this));

  }


  /* ━━━ Pipeline methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private async replacePlainVinylFileWithMarkupEntryPointVinylFile(
    plainVinylFile: VinylFile, addNewFileToStream: GulpStreamModifier.NewFilesAdder
  ): Promise<GulpStreamModifier.CompletionSignals> {

    addNewFileToStream(
      new MarkupEntryPointVinylFile({
        initialPlainVinylFile: plainVinylFile,
        actualEntryPointsGroupSettings: this.markupProcessingSettingsRepresentative.
            getExpectedToExistEntryPointsGroupSettingsRelevantForSpecifiedSourceFileAbsolutePath(plainVinylFile.path),
        pageStateDependentVariationsSpecification: this.markupProcessingSettingsRepresentative.
            getStateDependentVariationsForEntryPointWithAbsolutePath(plainVinylFile.path)
      })
    );

    return Promise.resolve(GulpStreamModifier.CompletionSignals.REMOVING_FILE_FROM_STREAM);

  }

  private async injectImportsFromTypeScriptIfAnyToMarkupFile(
    markupEntryPointVinylFile: MarkupEntryPointVinylFile
  ): Promise<GulpStreamModifier.CompletionSignals> {

    if (
      isNull(MarkupProcessingSharedState.importingFromTypeScriptPugCodeGenerator) ||
      isUndefined(this.markupProcessingSettingsRepresentative.importingFromTypeScriptSettings)
    ) {
      return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);
    }


    const pugCode: string = markupEntryPointVinylFile.stringifiedContents;
    const lineSeparator: LineSeparators = getLineSeparatorType(pugCode);

    /* [ Maintainability ] Although this option is not configurable, keep this constant to avoid the magic numbers. */
    const BLANK_LINES_COUNT_AFTER_JAVASCRIPT_CODE_BLOCK: number = 2;

    /* [ Theory ] For the Pug preprocessor, the single indent could be either tab or multiple spaces.
     *   Thus, ident is not always the single character. */
    const indentString: string = PugPreProcessorSpecialist.defineIndentString(pugCode);

    if (!PugPreProcessorSpecialist.isSourceCodeIncludingExtendingDeclaration(pugCode)) {

      markupEntryPointVinylFile.setContents(
        [
          MarkupProcessingSharedState.importingFromTypeScriptPugCodeGenerator({
            indentString,
            lineSeparator,
            initialIndentationDepth__numerationFrom0: 0
          }),
          lineSeparator.repeat(BLANK_LINES_COUNT_AFTER_JAVASCRIPT_CODE_BLOCK + 1),
          markupEntryPointVinylFile.stringifiedContents
        ].join("")
      );

      return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);

    }


    const sourceCodeExplodedToLines: Array<string> = explodeStringToLines({
      targetString: markupEntryPointVinylFile.stringifiedContents,
      mustIgnoreCarriageReturn: false
    });


    /* [ Theory ] If the Pug entry point file has been extended, the JavaScript code block could be injected only inside
     *    th specific block which must be declared in the parent (direct or no) files. It remains to process 2 cases: when
     *    this block has been modified in the entry point file and when this block has not been referred in the entry point. */
    const nameOfPugBlockToWhichTranspiledTypeScriptMustBeInjected: string = this.markupProcessingSettingsRepresentative.
        importingFromTypeScriptSettings.nameOfPugBlockToWhichTranspiledTypeScriptMustBeInjected;

    /* [ Theory ]
     * If the Pug file has been extended from another one, the extending declaration must be first, otherwise error will occur.
     * The only thing is allowed is the unbuffered comments (will not be compiled to HTML comments), thus Pug file could
     * start from the unbuffered comment which could be safely discarded.  */
    const indexOfLineIncludingBlockModifyingDeclaration: number | null =
        getIndexOfArrayElementSatisfiesThePredicateIfSuchElementIsExactlyOne(
          sourceCodeExplodedToLines,
          (sourceCodeLine: string): boolean =>
              PugPreProcessorSpecialist.isSourceCodeLineIncludingSpecificBlockModifyingDeclaration({
                sourceCodeLine, blockName: nameOfPugBlockToWhichTranspiledTypeScriptMustBeInjected
              })
        );

    if (isNotNull(indexOfLineIncludingBlockModifyingDeclaration)) {

      const targetCodeBlockExtractingResult: PugPreProcessorSpecialist.BlockExtractingResult =
          PugPreProcessorSpecialist.extractBlock({
            sourceCodeLines: sourceCodeExplodedToLines,
            startLineIndex: indexOfLineIncludingBlockModifyingDeclaration
          });

      sourceCodeExplodedToLines.splice(
        indexOfLineIncludingBlockModifyingDeclaration,
        targetCodeBlockExtractingResult.codeLines.length,
        ...targetCodeBlockExtractingResult.codeLines,
        MarkupProcessingSharedState.importingFromTypeScriptPugCodeGenerator({
          indentString,
          lineSeparator,
          initialIndentationDepth__numerationFrom0: 1
        }),
        ...Array.from<string>({ length: BLANK_LINES_COUNT_AFTER_JAVASCRIPT_CODE_BLOCK }).fill("")
      );

      markupEntryPointVinylFile.setContents(sourceCodeExplodedToLines.join(lineSeparator));

      return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);

    }


    const indexOfLineContainsExtendingDeclaration: number =
        getIndexOfArrayElementSatisfiesThePredicateIfSuchElementIsExactlyOne(
          sourceCodeExplodedToLines,
            (sourceCodeLine: string): boolean =>
                PugPreProcessorSpecialist.isSourceCodeLineIncludingExtendingDeclaration(sourceCodeLine),
            { mustThrowErrorIfElementNotFoundOrMatchesAreMultiple: true }
        );

    markupEntryPointVinylFile.setContents(
        addElementsToArray({
          targetArray: sourceCodeExplodedToLines,
          toPosition__numerationFrom0: indexOfLineContainsExtendingDeclaration + 1,
          newElements: [
            `\n\nblock append ${ nameOfPugBlockToWhichTranspiledTypeScriptMustBeInjected }\n`,
            MarkupProcessingSharedState.importingFromTypeScriptPugCodeGenerator({
              indentString,
              lineSeparator,
              initialIndentationDepth__numerationFrom0: 1
            })
          ],
          mutably: false
        }).join("\n")
    );

    return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);

  }

  private static async createEntryPointsStateDependentVariations(
    markupEntryPointVinylFile: MarkupEntryPointVinylFile, addNewFilesToStream: GulpStreamModifier.NewFilesAdder
  ): Promise<GulpStreamModifier.CompletionSignals> {
    addNewFilesToStream(markupEntryPointVinylFile.forkStaticPreviewStateDependentVariationsIfAny());
    return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);
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
   *  Static and non-static methods are following by the usage order. */
  private async onOutputHTML_FileReady(
    processedEntryPointVinylFile: MarkupEntryPointVinylFile
  ): Promise<GulpStreamModifier.CompletionSignals> {

    const entryPointFileContentRelativeToConsumingProjectRootDirectory: string = ImprovedPath.computeRelativePath({
      basePath: this.projectBuildingMasterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath,
      comparedPath: processedEntryPointVinylFile.path,
      alwaysForwardSlashSeparators: true
    });

    let entryPointFileContent: string = processedEntryPointVinylFile.stringifiedContents;
    const entryPointFileContentMD5Checksum: string = computeContentMD5_Checksum(entryPointFileContent);

    let rootHTML_Element: HTMLElement = parseHTML(entryPointFileContent);

    rootHTML_Element = ResourcesReferencesResolverForHTML.resolve({
      rootHTML_Element,
      projectBuildingMasterConfigRepresentative: this.projectBuildingMasterConfigRepresentative,
      markupProcessingSettingsRepresentative: this.markupProcessingSettingsRepresentative,
      absolutePathOfOutputDirectoryForTargetHTML_File: processedEntryPointVinylFile.outputDirectoryAbsolutePath
    });

    rootHTML_Element = ImagesAspectRatioAffixer.affix({
      rootHTML_Element,
      publicPath: this.projectBuildingMasterConfigRepresentative.actualPublicDirectoryAbsolutePath,
      consumingProjectRootDirectoryAbsolutePath: this.projectBuildingMasterConfigRepresentative.
          consumingProjectRootDirectoryAbsolutePath,
      absolutePathOfOutputDirectoryForTargetHTML_File: processedEntryPointVinylFile.outputDirectoryAbsolutePath
    });

    rootHTML_Element = SpacesNormalizerForCJK_Text.normalize(rootHTML_Element);

    entryPointFileContent = rootHTML_Element.toString();

    if (
      processedEntryPointVinylFile.actualEntryPointsGroupSettings.outputFormat ===
          MarkupProcessingRestrictions.OutputFormats.handlebars &&
      !this.projectBuildingMasterConfigRepresentative.isStaticPreviewBuildingMode
    ) {

      processedEntryPointVinylFile.setContents(entryPointFileContent);
      processedEntryPointVinylFile.extname = ".hbs";

      return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);

    }

    if (
      processedEntryPointVinylFile.actualEntryPointsGroupSettings.outputFormat ===
          MarkupProcessingRestrictions.OutputFormats.razor
    ) {

      processedEntryPointVinylFile.setContents(entryPointFileContent);
      processedEntryPointVinylFile.extname = ".razor";

      return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);

    }


    if (this.projectBuildingMasterConfigRepresentative.mustProvideIncrementalBuilding) {

      if (processedEntryPointVinylFile.actualEntryPointsGroupSettings.HTML_Validation.mustExecute) {
        HTML_Validator.validateAtBackgroundAndReportImmideatlyWithoutThrowingOfErrors({
          HTML_Code: entryPointFileContent,
          HTML_CodeMD5Checksum: entryPointFileContentMD5Checksum,
          targetHTML_FilePathRelativeToConsumingProjectRootDirectory:
              entryPointFileContentRelativeToConsumingProjectRootDirectory
        });
      }

      if (processedEntryPointVinylFile.actualEntryPointsGroupSettings.accessibilityInspection.mustExecute) {
        AccessibilityInspector.inspectAtBackgroundAndReportImmideatlyWithoutThrowingOfErrors({
          HTML_Code: entryPointFileContent,
          HTML_CodeMD5Checksum: entryPointFileContentMD5Checksum,
          accessibilityStandard: processedEntryPointVinylFile.actualEntryPointsGroupSettings.accessibilityInspection.standard,
          targetHTML_FilePathRelativeToConsumingProjectRootDirectory:
              entryPointFileContentRelativeToConsumingProjectRootDirectory
        });
      }

    } else {

      if (processedEntryPointVinylFile.actualEntryPointsGroupSettings.HTML_Validation.mustExecute) {
        HTML_Validator.validateAtBackgroundWithoutReporting({
          HTML_Code: entryPointFileContent,
          HTML_CodeMD5Checksum: entryPointFileContentMD5Checksum,
          targetHTML_FilePathRelativeToConsumingProjectRootDirectory:
              entryPointFileContentRelativeToConsumingProjectRootDirectory
        });
      }

      if (processedEntryPointVinylFile.actualEntryPointsGroupSettings.accessibilityInspection.mustExecute) {
        AccessibilityInspector.inspectAtBackgroundWithoutReporting({
          HTML_Code: entryPointFileContent,
          HTML_CodeMD5Checksum: entryPointFileContentMD5Checksum,
          accessibilityStandard: processedEntryPointVinylFile.actualEntryPointsGroupSettings.accessibilityInspection.standard,
          targetHTML_FilePathRelativeToConsumingProjectRootDirectory:
              entryPointFileContentRelativeToConsumingProjectRootDirectory
        });
      }

    }

    processedEntryPointVinylFile.setContents(entryPointFileContent);

    return GulpStreamModifier.CompletionSignals.PASSING_ON;

  }

  private onStreamEnded(): void {

    if (!this.projectBuildingMasterConfigRepresentative.mustProvideIncrementalBuilding) {

      if (this.markupProcessingSettingsRepresentative.mustValidateHTML) {
        HTML_Validator.reportCachedValidationsResultsAndFinalize();
      }

      if (this.markupProcessingSettingsRepresentative.mustInspectAccessibility) {
        AccessibilityInspector.reportCachedValidationsResultsAndFinalize();
      }

    }

  }


  /* ━━━ Rebuilding ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private onSourceFilesWatcherEmitsAnyEvent(targetFileAbsolutePath: string): void {

    this.absolutePathOfFilesWaitingForReProcessing.add(targetFileAbsolutePath);

    if (isNotNull(this.subsequentFilesStateChangeTimeout)) {
      clearTimeout(this.subsequentFilesStateChangeTimeout);
    }


    this.subsequentFilesStateChangeTimeout = setTimeout(
      (): void => {

        this.processEntryPoints(
          this.sourceCodeSelectiveReprocessingHelper?.getAbsolutePathsOfEntryPointsWhichMustBeProcessed(
            this.absolutePathOfFilesWaitingForReProcessing
          ) ?? []
        )();

        this.absolutePathOfFilesWaitingForReProcessing.clear();

      },
      secondsToMilliseconds(this.markupProcessingSettingsRepresentative.WAITING_FOR_SUBSEQUENT_FILES_WILL_SAVED_PERIOD__SECONDS)
    );

  }

  private onEntryPointFileAdded(targetEntryPointFileAbsolutePath: string): void {

    const markupEntryPointsGroupSettingsActualForCurrentFile: MarkupProcessingSettings__Normalized.EntryPointsGroup = this.
        markupProcessingSettingsRepresentative.
        getExpectedToExistEntryPointsGroupSettingsRelevantForSpecifiedSourceFileAbsolutePath(targetEntryPointFileAbsolutePath);

    const outputFileNameWithExtensionWithLeadingDot: string = this.
        markupProcessingSettingsRepresentative.
        computeOutputFileNameExtension({
          entryPointsGroupSettingsActualForTargetFile: markupEntryPointsGroupSettingsActualForCurrentFile,
          mustPrependDotToFileNameExtension: false
        });

    MarkupProcessingSharedState.
        entryPointsSourceAndOutputFilesAbsolutePathsCorrespondenceMap.
        set(
          targetEntryPointFileAbsolutePath,
          ImprovedPath.joinPathSegments(
            [
              MarkupProcessingSettingsRepresentative.computeRelevantOutputDirectoryAbsolutePathForTargetSourceFile(
                targetEntryPointFileAbsolutePath, markupEntryPointsGroupSettingsActualForCurrentFile
              ),
              `${ extractFileNameWithoutLastExtension(targetEntryPointFileAbsolutePath) }.` +
                  outputFileNameWithExtensionWithLeadingDot
            ],
            { alwaysForwardSlashSeparators: true }
          )
        );

  }

  private static onEntryPointFileDeleted(targetEntryPointFileAbsolutePath: string): void {
    MarkupProcessingSharedState.
        entryPointsSourceAndOutputFilesAbsolutePathsCorrespondenceMap.
        delete(targetEntryPointFileAbsolutePath);
  }


  /* ━━━ Helpers ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private initializeSourceAndOutputFilesAbsolutePathsCorrespondenceMap(): void {

    for (
      const markupSourceFileAbsolutePath of ImprovedGlob.getFilesAbsolutePathsSynchronously(
        this.markupProcessingSettingsRepresentative.initialRelevantEntryPointsSourceFilesAbsolutePaths,
        { alwaysForwardSlashSeparators: true }
      )
    ) {

      const markupEntryPointsGroupSettingsActualForCurrentFile: MarkupProcessingSettings__Normalized.EntryPointsGroup =
          this.markupProcessingSettingsRepresentative.
              getExpectedToExistEntryPointsGroupSettingsRelevantForSpecifiedSourceFileAbsolutePath(markupSourceFileAbsolutePath);

      const outputFileNameWithLastExtensionWithLeadingDot: string = this.markupProcessingSettingsRepresentative.
          computeOutputFileNameExtension({
            entryPointsGroupSettingsActualForTargetFile: markupEntryPointsGroupSettingsActualForCurrentFile,
            mustPrependDotToFileNameExtension: false
          });

      MarkupProcessingSharedState.
          entryPointsSourceAndOutputFilesAbsolutePathsCorrespondenceMap.
          set(
            markupSourceFileAbsolutePath,
            ImprovedPath.joinPathSegments(
              [
                MarkupProcessingSettingsRepresentative.computeRelevantOutputDirectoryAbsolutePathForTargetSourceFile(
                  markupSourceFileAbsolutePath, markupEntryPointsGroupSettingsActualForCurrentFile
                ),
                `${ extractFileNameWithoutLastExtension(markupSourceFileAbsolutePath) }.` +
                    outputFileNameWithLastExtensionWithLeadingDot
              ],
              { alwaysForwardSlashSeparators: true }
            )
          );

      const entryPointStateDependentVariations: MarkupProcessingSettings__Normalized.StaticPreview.
          PagesStateDependentVariationsSpecification.Page | undefined =
          this.markupProcessingSettingsRepresentative.
              getStateDependentVariationsForEntryPointWithAbsolutePath(markupSourceFileAbsolutePath);

      if (isUndefined(entryPointStateDependentVariations)) {
        continue;
      }


      for (const derivedSourceFileAbsolutePath of Object.keys(entryPointStateDependentVariations.derivedPagesAndStatesMap)) {

        MarkupProcessingSharedState.
            entryPointsSourceAndOutputFilesAbsolutePathsCorrespondenceMap.
            set(
              derivedSourceFileAbsolutePath,
              ImprovedPath.joinPathSegments(
                [
                  MarkupProcessingSettingsRepresentative.
                  computeRelevantOutputDirectoryAbsolutePathForTargetSourceFile(
                    markupSourceFileAbsolutePath, markupEntryPointsGroupSettingsActualForCurrentFile
                  ),
                  `${ extractFileNameWithoutLastExtension(derivedSourceFileAbsolutePath) }.html`
                ],
                { alwaysForwardSlashSeparators: true }
              )
            );

      }

    }

  }

}
