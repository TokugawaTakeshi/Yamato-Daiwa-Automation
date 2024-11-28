/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type StylesProcessingSettings__Normalized from "@StylesProcessing/StylesProcessingSettings__Normalized";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import StylesProcessingSettingsRepresentative from "@StylesProcessing/StylesProcessingSettingsRepresentative";

/* ─── Source Files Watcher ───────────────────────────────────────────────────────────────────────────────────────── */
import StylesSourceFilesWatcher from "@StylesProcessing/StylesSourceFilesWatcher";

/* ─── Superclass ─────────────────────────────────────────────────────────────────────────────────────────────────── */
import GulpStreamsBasedTaskExecutor from
    "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBased/GulpStreamsBasedTaskExecutor";

/* ─── Shared State ───────────────────────────────────────────────────────────────────────────────────────────────── */
import StylesProcessingSharedState from "@StylesProcessing/StylesProcessingSharedState";

/* ─── Gulp & Plugins ─────────────────────────────────────────────────────────────────────────────────────────────── */
import Gulp from "gulp";
import type VinylFile from "vinyl";
import gulpIf from "gulp-if";
import gulpSourcemaps from "gulp-sourcemaps";
import gulpStylus from "gulp-stylus";
import gulpPostCSS from "gulp-postcss";
import Autoprefixer from "autoprefixer";
import CSS_Nano from "cssnano";

/* ─── Third-party Solutions Specialists ──────────────────────────────────────────────────────────────────────────── */
import StylusPreProcessorSpecialist from "@ThirdPartySolutionsSpecialists/StylusPreProcessorSpecialist";

/* ─── Applied Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import GulpStreamModifier from "@Utils/GulpStreamModifier";
import createImmediatelyEndingEmptyStream from "@Utils/createImmediatelyEndingEmptyStream";
import SourceCodeSelectiveReprocessingHelper from "@Utils/SourceCodeSelectiveReprocessingHelper";
import DotYDA_DirectoryManager from "@Utils/DotYDA_DirectoryManager";
import StylesEntryPointVinylFile from "@StylesProcessing/StylesEntryPointVinylFile";
import FileNameRevisionPostfixer from "@Utils/FileNameRevisionPostfixer";
import ContainerQueriesSyntaxNormalizerForStylus from
    "@StylesProcessing/Plugins/ContainerQueriesSyntaxNormalizerForStylus/ContainerQueriesSyntaxNormalizerForStylus";
import ResourcesPointersResolverForCSS from "@ProjectBuilding/Common/Plugins/ResourcesPointersResolverForCSS";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import {
  extractFileNameWithoutLastExtension,
  isNotNull,
  isUndefined,
  secondsToMilliseconds
} from "@yamato-daiwa/es-extensions";
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


export default class StylesProcessor extends GulpStreamsBasedTaskExecutor {

  private static readonly ENTRY_POINTS_AND_PARTIAL_FILES_MAPPING_CACHE_FILE_NAME_WITH_EXTENSION: string =
      "StylusEntryPointsAndAffiliatedFilesMappingCache.json";

  protected readonly logging: GulpStreamsBasedTaskExecutor.Logging;

  private readonly stylesProcessingConfigRepresentative: StylesProcessingSettingsRepresentative;

  private readonly absolutePathOfFilesWaitingForReProcessing: Set<string> = new Set<string>();
  private sourceCodeSelectiveReprocessingHelper: SourceCodeSelectiveReprocessingHelper | null = null;

  private subsequentFilesStateChangeTimeout: NodeJS.Timeout | null = null;


  public static provideStylesProcessingIfMust(
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): () => NodeJS.ReadWriteStream {

    const stylesProcessingSettingsRepresentative: StylesProcessingSettingsRepresentative | undefined =
        projectBuildingMasterConfigRepresentative.stylesProcessingSettingsRepresentative;

    if (isUndefined(stylesProcessingSettingsRepresentative)) {
      return createImmediatelyEndingEmptyStream();
    }


    const dataHoldingSelfInstance: StylesProcessor = new StylesProcessor(
      stylesProcessingSettingsRepresentative, projectBuildingMasterConfigRepresentative
    );

    if (projectBuildingMasterConfigRepresentative.mustProvideIncrementalBuilding) {

      dataHoldingSelfInstance.sourceCodeSelectiveReprocessingHelper = new SourceCodeSelectiveReprocessingHelper({
        initialEntryPointsSourceFilesAbsolutePaths: stylesProcessingSettingsRepresentative.
            initialRelevantEntryPointsSourceFilesAbsolutePaths,
        childrenFilesResolutionRules: {
          childrenFilesIncludingDeclarationsPatterns: StylusPreProcessorSpecialist.partialFilesIncludingDeclarationPatterns,
          implicitFilesNamesExtensionsWithoutLeadingDotsOfChildrenFiles: StylusPreProcessorSpecialist.
              implicitFilesNamesExtensionsWithoutLeadingDotsOfPartials
        },
        isEntryPoint: stylesProcessingSettingsRepresentative.isEntryPoint.bind(stylesProcessingSettingsRepresentative),
        logging: {
          mustEnable: stylesProcessingSettingsRepresentative.loggingSettings.partialFilesAndParentEntryPointsCorrespondence,
          targetFilesTypeInSingularForm: stylesProcessingSettingsRepresentative.TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM
        },
        consumingProjectRootDirectoryAbsolutePath: projectBuildingMasterConfigRepresentative.
            consumingProjectRootDirectoryAbsolutePath,
        cacheFileAbsolutePath: ImprovedPath.joinPathSegments(
          [
            DotYDA_DirectoryManager.OPTIMIZATION_FILES_DIRECTORY_ABSOLUTE_PATH,
            StylesProcessor.ENTRY_POINTS_AND_PARTIAL_FILES_MAPPING_CACHE_FILE_NAME_WITH_EXTENSION
          ]
        )
      });

      StylesSourceFilesWatcher.
          initializeIfRequiredAndGetInstance({
            stylesProcessingSettingsRepresentative,
            projectBuildingMasterConfigRepresentative
          }).
          addOnAnyEventRelatedWithActualFilesHandler({
            handlerID: "ON_ANY_EVENT_WITH_STYLES_SOURCE_CODE_FILE--BY_STYLED_PROCESSOR",
            handler: dataHoldingSelfInstance.onSourceFilesWatcherEmitsAnyEvent.bind(dataHoldingSelfInstance)
          }).
          addOnEntryPointFileAddedEventHandler({
            handlerID: "ON_STYLES_ENTRY_POINT_FILE_ADDED--BY_STYLES_PROCESSOR",
            handler: dataHoldingSelfInstance.onEntryPointFileAdded.bind(dataHoldingSelfInstance)
          }).
          addOnEntryPointFileDeletedEventHandler({
            handlerID: "ON_STYLES_ENTRY_POINT_FILE_DELETED--BY_STYLES_PROCESSOR",
            handler: StylesProcessor.onEntryPointFileDeleted
          });

    }

    return dataHoldingSelfInstance.processEntryPoints(
      stylesProcessingSettingsRepresentative.initialRelevantEntryPointsSourceFilesAbsolutePaths
    );

  }


  private constructor(
    stylesProcessingSettingsRepresentative: StylesProcessingSettingsRepresentative,
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ) {

    super({
      projectBuildingMasterConfigRepresentative,
      taskTitleForLogging: "Styles processing"
    });

    this.logging = {
      pathsOfFilesWillBeProcessed: stylesProcessingSettingsRepresentative.loggingSettings.filesPaths,
      quantityOfFilesWillBeProcessed: stylesProcessingSettingsRepresentative.loggingSettings.filesCount
    };

    this.stylesProcessingConfigRepresentative = stylesProcessingSettingsRepresentative;

  }


  protected processEntryPoints(entryPointsSourceFilesAbsolutePaths: Array<string>): () => NodeJS.ReadWriteStream {

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
            onStreamStartedEventCommonHandler: this.replacePlainVinylFileWithStylesEntryPointVinylFile.bind(this)
          })
        ).

        pipe(
          gulpIf(
            this.projectBuildingMasterConfigRepresentative.isStaticPreviewBuildingMode ||
                this.projectBuildingMasterConfigRepresentative.isLocalDevelopmentBuildingMode,
            gulpSourcemaps.init()
          )
        ).

        pipe(this.logProcessedFilesIfMust()).

        pipe(
          gulpStylus({

            /* [ Theory ] Allows to "@include XXX.css" which is critical for third-party libraries' usage. */
            "include css": true

          })
        ).

        pipe(
          GulpStreamModifier.modify({
            async onStreamStartedEventCommonHandler(stylesheet: VinylFile): Promise<GulpStreamModifier.CompletionSignals> {
              ContainerQueriesSyntaxNormalizerForStylus.normalizeSyntax(stylesheet);
              return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);
            }
          })
        ).

        pipe(
          gulpPostCSS(
            (): { plugins: Array<unknown>; } => ({
              plugins: [
                Autoprefixer,
                CSS_Nano({
                  preset: [
                    "default",
                    {
                      normalizeWhitespace: !this.projectBuildingMasterConfigRepresentative.isStaticPreviewBuildingMode &&
                          !this.projectBuildingMasterConfigRepresentative.isLocalDevelopmentBuildingMode,
                      discardComments: !this.projectBuildingMasterConfigRepresentative.isStaticPreviewBuildingMode &&
                          !this.projectBuildingMasterConfigRepresentative.isLocalDevelopmentBuildingMode
                    }
                  ]
                })
              ]
            })
          )
        ).

        pipe(
          gulpIf(
            this.projectBuildingMasterConfigRepresentative.isStaticPreviewBuildingMode ||
                this.projectBuildingMasterConfigRepresentative.isLocalDevelopmentBuildingMode,
            gulpSourcemaps.write()
          )
        ).

        pipe(
          GulpStreamModifier.modify({
            onStreamStartedEventHandlersForSpecificFileTypes: new Map([
              [ StylesEntryPointVinylFile, this.onOutputCSS_FileReady.bind(this) ]
            ])
          })
        ).

        pipe(
          Gulp.dest(
            (targetFile: VinylFile): string =>
                StylesEntryPointVinylFile.getOutputDirectoryAbsolutePathOfExpectedToBeSelfInstance(targetFile)
          )
        );

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
      secondsToMilliseconds(this.stylesProcessingConfigRepresentative.WAITING_FOR_SUBSEQUENT_FILES_WILL_SAVED_PERIOD__SECONDS)
    );

  }

  private onEntryPointFileAdded(targetEntryPointFileAbsolutePath: string): void {

    const stylesEntryPointsGroupSettingsActualForCurrentFile: StylesProcessingSettings__Normalized.EntryPointsGroup = this.
        stylesProcessingConfigRepresentative.
        getExpectedToExistEntryPointsGroupSettingsRelevantForSpecifiedSourceFileAbsolutePath(targetEntryPointFileAbsolutePath);

    StylesProcessingSharedState.
        entryPointsSourceAndOutputFilesAbsolutePathsCorrespondenceMap.
        set(
          targetEntryPointFileAbsolutePath,
          ImprovedPath.joinPathSegments(
            [
              StylesProcessingSettingsRepresentative.computeRelevantOutputDirectoryAbsolutePathForTargetSourceFile(
                targetEntryPointFileAbsolutePath, stylesEntryPointsGroupSettingsActualForCurrentFile
              ),
              `${ extractFileNameWithoutLastExtension(targetEntryPointFileAbsolutePath) }.css`
            ],
            { alwaysForwardSlashSeparators: true }
          )
        );

  }

  private static onEntryPointFileDeleted(targetEntryPointFileAbsolutePath: string): void {
    StylesProcessingSharedState.
        entryPointsSourceAndOutputFilesAbsolutePathsCorrespondenceMap.
        delete(targetEntryPointFileAbsolutePath);
  }


  /* ━━━ Pipeline methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* eslint-disable @typescript-eslint/member-ordering --
   * From now, static and non-static methods are following by the usage order. */
  private async replacePlainVinylFileWithStylesEntryPointVinylFile(
    plainVinylFile: VinylFile, addNewFileToStream: GulpStreamModifier.NewFilesAdder
  ): Promise<GulpStreamModifier.CompletionSignals> {

    addNewFileToStream(
      new StylesEntryPointVinylFile({
        initialPlainVinylFile: plainVinylFile,
        actualEntryPointsGroupSettings: this.stylesProcessingConfigRepresentative.
            getExpectedToExistEntryPointsGroupSettingsRelevantForSpecifiedSourceFileAbsolutePath(plainVinylFile.path)
      })
    );

    return Promise.resolve(GulpStreamModifier.CompletionSignals.REMOVING_FILE_FROM_STREAM);

  }

  private async onOutputCSS_FileReady(
    processedEntryPointVinylFile: StylesEntryPointVinylFile
  ): Promise<GulpStreamModifier.CompletionSignals> {

    if (processedEntryPointVinylFile.actualEntryPointsGroupSettings.revisioning.mustExecute) {
      FileNameRevisionPostfixer.appendPostfixIfPossible(
        processedEntryPointVinylFile,
        {
          contentHashPostfixSeparator: processedEntryPointVinylFile.actualEntryPointsGroupSettings.revisioning.
              contentHashPostfixSeparator
        }
      );
    }

    StylesProcessingSharedState.
        entryPointsSourceAndOutputFilesAbsolutePathsCorrespondenceMap.
        set(
          processedEntryPointVinylFile.sourceAbsolutePath,
          ImprovedPath.joinPathSegments(
            [ processedEntryPointVinylFile.outputDirectoryAbsolutePath, processedEntryPointVinylFile.basename ],
            { alwaysForwardSlashSeparators: true }
          )
        );

    let entryPointFileContent: string = processedEntryPointVinylFile.stringifiedContents;

    entryPointFileContent = ResourcesPointersResolverForCSS.resolve({
      CSS_Code: entryPointFileContent,
      absolutePathOfOutputDirectoryForParentFile: processedEntryPointVinylFile.outputDirectoryAbsolutePath,
      projectBuildingMasterConfigRepresentative: this.projectBuildingMasterConfigRepresentative,
      logging: {
        parentFileAbsolutePath: ImprovedPath.joinPathSegments(
          [
            processedEntryPointVinylFile.outputDirectoryAbsolutePath,
            processedEntryPointVinylFile.basename
          ],
          { alwaysForwardSlashSeparators: true }
        )
      }
    });

    processedEntryPointVinylFile.setContents(entryPointFileContent);

    return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);

  }
  /* eslint-enable @typescript-eslint/member-ordering */

}
