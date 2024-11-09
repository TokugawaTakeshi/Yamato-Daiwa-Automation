/* ─── Superclass ─────────────────────────────────────────────────────────────────────────────────────────────────── */
import GulpStreamsBasedTaskExecutor from "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBased/GulpStreamsBasedTaskExecutor";

/* ─── Applied Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import DotYDA_DirectoryManager from "@Utils/DotYDA_DirectoryManager";

/* ─── Gulp & Plugins ─────────────────────────────────────────────────────────────────────────────────────────────── */
import Gulp from "gulp";
import type VinylFile from "vinyl";
import gulpIf from "gulp-if";

/* ─── Applied Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import GulpStreamModifier from "@Utils/GulpStreamModifier";
import { obj as combineObjectStreams } from "stream-combiner2";
import createImmediatelyEndingEmptyStream from "@Utils/createImmediatelyEndingEmptyStream";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import FileSystem from "fs";
import type { RawObjectDataProcessor, ParsedJSON } from "@yamato-daiwa/es-extensions";
import {
  Logger,
  InvalidExternalDataError,
  nullToUndefined,
  secondsToMilliseconds,
  stringifyAndFormatArbitraryValue,
  isUndefined,
  isNotUndefined,
  readonlyArrayToMutableOne
} from "@yamato-daiwa/es-extensions";
import { ImprovedFileSystem, ImprovedPath, ImprovedGlob, ObjectDataFilesProcessor } from "@yamato-daiwa/es-extensions-nodejs";


abstract class LinterLikeTaskExecutor<SourceFileCheckingIssue extends ParsedJSON> extends GulpStreamsBasedTaskExecutor {

  protected static readonly CHECKING_ISSUES_MESSAGES_PROPERTY_NAME_AT_VINYL_FILE_INSTANCE: string = "checkingIssues";

  /* [ Theory ] 120 columns is about the half of the 1920x1080 screen. */
  protected static readonly DISPLAYING_MAXIMAL_COLUMNS_COUNT_IN_LOG: number = 120;

  protected readonly ABSOLUTE_PATH_OF_FILE_WITH_CACHED_RESULTS_OF_SOURCE_FILES_CHECKING: string;
  protected readonly specificationOfFileContentWithCachedResultsOfSourceFilesChecking:
      RawObjectDataProcessor.FixedKeyAndValuesTypeObjectDataSpecification;
  protected readonly sourceFilesCheckingCachedResults: LinterLikeTaskExecutor.CachedCheckingResults<SourceFileCheckingIssue>;

  protected readonly targetFilesGlobSelectors: ReadonlyArray<string>;

  protected readonly DISPLAYING_LINES_COUNT_BEFORE_ISSUED_LINE_IN_CODE_LISTING_OF_REPORT: number = 2;
  protected readonly DISPLAYING_LINES_COUNT_AFTER_ISSUED_LINE_IN_CODE_LISTING_OF_REPORT: number = 1;

  protected readonly logging: LinterLikeTaskExecutor.Logging;

  protected isFirstGulpPipelinePass: boolean = true;
  protected readonly relativePathsOfFoundFilesMentionedInCacheFile: Set<string> = new Set();


  /* ━━━ Constructor ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  protected constructor(constructorParameter: LinterLikeTaskExecutor.ConstructorParameter<SourceFileCheckingIssue>) {

    super(constructorParameter);

    this.ABSOLUTE_PATH_OF_FILE_WITH_CACHED_RESULTS_OF_SOURCE_FILES_CHECKING = ImprovedPath.joinPathSegments(
      [
        DotYDA_DirectoryManager.OPTIMIZATION_FILES_DIRECTORY_ABSOLUTE_PATH,
        constructorParameter.sourceFilesCachedCheckingResults.fileNameWithExtension
      ],
      { alwaysForwardSlashSeparators: true }
    );

    this.specificationOfFileContentWithCachedResultsOfSourceFilesChecking =
        constructorParameter.sourceFilesCachedCheckingResults.contentSpecification;

    if (FileSystem.existsSync(this.ABSOLUTE_PATH_OF_FILE_WITH_CACHED_RESULTS_OF_SOURCE_FILES_CHECKING)) {

      try {

        this.sourceFilesCheckingCachedResults = ObjectDataFilesProcessor.processFile<
          LinterLikeTaskExecutor.CachedCheckingResults<SourceFileCheckingIssue>
        >({
          filePath: this.ABSOLUTE_PATH_OF_FILE_WITH_CACHED_RESULTS_OF_SOURCE_FILES_CHECKING,
          validDataSpecification: this.specificationOfFileContentWithCachedResultsOfSourceFilesChecking,
          synchronously: true
        });

      } catch (error: unknown) {

        Logger.logError({
          mustOutputIf: __IS_DEVELOPMENT_BUILDING_MODE__,
          errorType: InvalidExternalDataError.NAME,
          title: InvalidExternalDataError.localization.defaultTitle,
          description: InvalidExternalDataError.localization.generateDescription({
            mentionToExpectedData: this.specificationOfFileContentWithCachedResultsOfSourceFilesChecking.nameForLogging
          }),
          occurrenceLocation: "LinterLikeTaskExecutor.constructor(constructorParameter)",
          caughtError: error
        });

        this.sourceFilesCheckingCachedResults = constructorParameter.sourceFilesCachedCheckingResults.emptyValue;

      }

    } else {
      this.sourceFilesCheckingCachedResults = constructorParameter.sourceFilesCachedCheckingResults.emptyValue;
    }


    this.targetFilesGlobSelectors = constructorParameter.targetFilesGlobSelectors;

    this.logging = constructorParameter.logging;

  }


  /* ━━━ Abstract methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  protected abstract checkSingleFile(targetFile: VinylFile): Promise<GulpStreamModifier.CompletionSignals>;

  protected abstract formatIssuesOfSingleFile(
    checkingResult: LinterLikeTaskExecutor.CachedCheckingResults.File<SourceFileCheckingIssue>
  ): string;


  /* ━━━ Main method ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  protected checkFiles(globSelectorsOrAbsolutePathsOfTargetFiles: ReadonlyArray<string>): () => NodeJS.ReadWriteStream {

    if (globSelectorsOrAbsolutePathsOfTargetFiles.length === 0) {
      return createImmediatelyEndingEmptyStream();
    }


    return (): NodeJS.ReadWriteStream => Gulp.

        /* [ Theory ] No need to read the files immediately - maybe they have not changed since last modification
        *    thus linting results could be cached. */
        src(readonlyArrayToMutableOne(globSelectorsOrAbsolutePathsOfTargetFiles), { read: false }).

        pipe(super.handleErrorIfItWillOccur()).
        pipe(super.logProcessedFilesIfMust()).

        pipe(
          GulpStreamModifier.modify({
            onStreamStartedEventCommonHandler: this.registerFoundFileMentionedInCache.bind(this)
          })
        ).

        pipe(
          gulpIf(

            this.areUpToDateCheckingResultsForSpecificFilePresentsInCache.bind(this),

            /* [ Theory ] Normally, it is possible only on the cold start herewith linting has been executed previously. */
            GulpStreamModifier.modify({
              onStreamStartedEventCommonHandler: this.pickCheckingResultsForSpecificFileFromCache.bind(this)
            }),

            combineObjectStreams(

              GulpStreamModifier.modify({
                onStreamStartedEventCommonHandler: LinterLikeTaskExecutor.readVinylFileAndInitializeContentsField
              }),

              GulpStreamModifier.modify({
                onStreamStartedEventCommonHandler: this.logFileCheckingStartedEventIfMust.bind(this)
              }),

              GulpStreamModifier.modify({
                onStreamStartedEventCommonHandler: this.checkSingleFile.bind(this)
              }),

              GulpStreamModifier.modify({
                onStreamStartedEventCommonHandler: this.cacheFileCheckingResult.bind(this)
              }),

              GulpStreamModifier.modify({
                onStreamStartedEventCommonHandler: this.logNoIssuesFoundInFileEventIfMust.bind(this)
              })

            )

          )
        ).

        /* [ Approach ]
         * Basically, the `on("end", this.onStreamEnded.bind(this));` should be here.
         * However, the `onStreamEnded` will not be called on the subsequent pipeline pass and the reason and solution
         *   (with `on("end", this.onStreamEnded.bind(this));`) is unknown for the YDA developer.
         * Here are the attempts to investigate.
         * https://stackoverflow.com/q/76087881/4818123
         * https://stackoverflow.com/q/76832415/4818123
         * */
        pipe(
          GulpStreamModifier.modify({
            onStreamEndedEventHandler: async (): Promise<void> => {
              this.onStreamEnded();
              return Promise.resolve();
            }
          })
        );

  }

  /* ━━━  Pipeline methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* eslint-disable @typescript-eslint/member-ordering --
   * The methods are organized according processing order. Most of the methods are instance method, but when `this`
   *    is not used, the methods are static. */

  private async registerFoundFileMentionedInCache(targetFile: VinylFile): Promise<GulpStreamModifier.CompletionSignals> {

    const targetFileRelativePath__alwaysFrowardSlashesPathSeparators: string =
        ImprovedPath.replacePathSeparatorsToForwardSlashes(targetFile.relative);

    if (
      this.isFirstGulpPipelinePass &&
      isNotUndefined(
        this.sourceFilesCheckingCachedResults.files[targetFileRelativePath__alwaysFrowardSlashesPathSeparators]
      )
    ) {
      this.relativePathsOfFoundFilesMentionedInCacheFile.add(targetFileRelativePath__alwaysFrowardSlashesPathSeparators);
    }

    return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);

  }

  private areUpToDateCheckingResultsForSpecificFilePresentsInCache(targetFile: VinylFile): boolean {
    return this.sourceFilesCheckingCachedResults.
        files[ImprovedPath.replacePathSeparatorsToForwardSlashes(targetFile.relative)]?.
        modificationDateTime__ISO_8601 ===
            targetFile.stat?.mtime.toISOString();
  }

  /* [ Theory ] Normally, it is possible only on the cold start herewith linting has been executed previously. */
  private async pickCheckingResultsForSpecificFileFromCache(
    targetFile: VinylFile
  ): Promise<GulpStreamModifier.CompletionSignals> {

    const targetFileRelativePath: string = ImprovedPath.computeRelativePath({
      comparedPath: targetFile.path,
      basePath: this.projectBuildingMasterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath
    });

    targetFile[LinterLikeTaskExecutor.CHECKING_ISSUES_MESSAGES_PROPERTY_NAME_AT_VINYL_FILE_INSTANCE] =
        this.sourceFilesCheckingCachedResults.files[targetFileRelativePath]?.issues;

    return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);

  }

  private static async readVinylFileAndInitializeContentsField(
    targetFile: VinylFile
  ): Promise<GulpStreamModifier.CompletionSignals> {
    targetFile.contents = FileSystem.readFileSync(targetFile.path);
    return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);
  }

  private async logFileCheckingStartedEventIfMust(targetFile: VinylFile): Promise<GulpStreamModifier.CompletionSignals> {

    Logger.logInfo({
      mustOutputIf: this.logging.checkingStart,
      title: `${ this.TASK_TITLE_FOR_LOGGING }, file checking started...`,
      description: `Path: ${ ImprovedPath.replacePathSeparatorsToForwardSlashes(targetFile.relative) }`
    });

    return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);

  }

  private async cacheFileCheckingResult(targetSourceFile: VinylFile): Promise<GulpStreamModifier.CompletionSignals> {

    const fileCheckingIssues: Array<SourceFileCheckingIssue> =
        Array.isArray(targetSourceFile[LinterLikeTaskExecutor.CHECKING_ISSUES_MESSAGES_PROPERTY_NAME_AT_VINYL_FILE_INSTANCE]) ?
            targetSourceFile[LinterLikeTaskExecutor.CHECKING_ISSUES_MESSAGES_PROPERTY_NAME_AT_VINYL_FILE_INSTANCE] :
            [];

    /* [ Theory ]
    * If file has been picked by singular blog, `targetSourceFile.relative` will be even with file name with extension. */
    this.sourceFilesCheckingCachedResults.files[
      ImprovedPath.computeRelativePath({
        comparedPath: targetSourceFile.path,
        basePath: this.projectBuildingMasterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath,
        alwaysForwardSlashSeparators: true
      })
    ] = {
      issues: fileCheckingIssues,
      modificationDateTime__ISO_8601: targetSourceFile.stat?.mtime.toISOString() ?? new Date().toISOString()
    };

    return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);

  }

  private async logNoIssuesFoundInFileEventIfMust(targetSourceFile: VinylFile): Promise<GulpStreamModifier.CompletionSignals> {

    const fileCheckingIssues: Array<LinterLikeTaskExecutor.CachedCheckingResults.File<SourceFileCheckingIssue>> =
        Array.isArray(targetSourceFile.lintingResults) ? targetSourceFile.lintingResults : [];

    Logger.logSuccess({
      mustOutputIf: this.logging.completionWithoutIssues && fileCheckingIssues.length === 0,
      title: `${ this.TASK_TITLE_FOR_LOGGING }, no issues found in the file`,
      description: `Path: ${ ImprovedPath.replacePathSeparatorsToForwardSlashes(targetSourceFile.relative) }`
    });

    return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);

  }

  private reportCheckingIssues(): void {

    const hasAtLeastOneCheckingIssueBeenFound: boolean = Object.values(this.sourceFilesCheckingCachedResults.files).some(
      (
        checkingResult: LinterLikeTaskExecutor.CachedCheckingResults.File<SourceFileCheckingIssue> | undefined
      ): boolean =>
          isNotUndefined(checkingResult) && checkingResult.issues.length > 0
    );

    if (hasAtLeastOneCheckingIssueBeenFound) {

      const issuesFormattedLogs: Array<string> = [];

      for (const [ fileRelativePath, lintingResult ] of Object.entries(this.sourceFilesCheckingCachedResults.files)) {

        if (isUndefined(lintingResult) || lintingResult.issues.length === 0) {
          continue;
        }


        issuesFormattedLogs.push(
          `■ ${ fileRelativePath }: ${ lintingResult.issues.length } issue(s)` +
          `\n${ this.formatIssuesOfSingleFile(lintingResult) }`
        );

      }

      Logger.logErrorLikeMessage({
        title: `${ this.TASK_TITLE_FOR_LOGGING }, issue(s) found`,
        description: `\n${ issuesFormattedLogs.join("\n\n") }`
      });

    }

  }

  private onStreamEnded(): void {

    if (this.isFirstGulpPipelinePass) {

      /* [ Theory ] Some files could be deleted or ignored during YDA has been stopped. */
      this.sourceFilesCheckingCachedResults.files =
          this.relativePathsOfFoundFilesMentionedInCacheFile.size > 0 ?
              Array.from(Object.entries(this.sourceFilesCheckingCachedResults.files)).reduce(
                (
                  actualSourceFilesCheckingResults: LinterLikeTaskExecutor.
                      CachedCheckingResults.Files<SourceFileCheckingIssue>,
                  [ sourceFileRelativePath, cachedLintingResult ]:
                      [ string, LinterLikeTaskExecutor.CachedCheckingResults.File<SourceFileCheckingIssue> | undefined ]
                ): LinterLikeTaskExecutor.CachedCheckingResults.Files<SourceFileCheckingIssue> => {

                  if (this.relativePathsOfFoundFilesMentionedInCacheFile.has(sourceFileRelativePath)) {
                    actualSourceFilesCheckingResults[sourceFileRelativePath] = cachedLintingResult;
                  }

                  return actualSourceFilesCheckingResults;

                },
                {}
              ) :
              this.sourceFilesCheckingCachedResults.files;

      this.relativePathsOfFoundFilesMentionedInCacheFile.clear();

      this.isFirstGulpPipelinePass = false;

    }

    this.reportCheckingIssuesAndOutputCacheToFile();

  }

  private reportCheckingIssuesAndOutputCacheToFile(): void {

    this.reportCheckingIssues();

    ImprovedFileSystem.writeFileToPossiblyNotExistingDirectory({
      filePath: this.ABSOLUTE_PATH_OF_FILE_WITH_CACHED_RESULTS_OF_SOURCE_FILES_CHECKING,
      content: stringifyAndFormatArbitraryValue(this.sourceFilesCheckingCachedResults),
      synchronously: true
    });

  }
  /* eslint-enable @typescript-eslint/member-ordering */


  /* eslint-disable @typescript-eslint/member-ordering --
   *  From now, the members has been organized by semantic groups. */
  /* ━━━ File watcher handlers ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* ─── Adding & updating ────────────────────────────────────────────────────────────────────────────────────────── */
  protected readonly absolutePathsOfAddedOrUpdatedFiles: Set<string> = new Set<string>();
  protected waitingForSubsequentFileWillBeAddedOrUpdatedTimer: NodeJS.Timeout | null = null;
  protected readonly WAITING_FOR_SUBSEQUENT_FILE_WILL_BE_ADDED_OR_UPDATED_PERIOD__SECONDS: number = 1;

  protected onFileHasBeenAddedOrUpdated(targetFileAbsolutePath: string): void {

    if (
      !ImprovedGlob.isFilePathMatchingWithAllGlobSelectors({
        filePath: targetFileAbsolutePath,
        globSelectors: this.targetFilesGlobSelectors
      })
    ) {
      return;
    }


    clearTimeout(
      nullToUndefined(this.waitingForSubsequentFileWillBeAddedOrUpdatedTimer)
    );

    this.absolutePathsOfAddedOrUpdatedFiles.add(targetFileAbsolutePath);

    this.waitingForSubsequentFileWillBeAddedOrUpdatedTimer = setTimeout(
      (): void => {
        this.checkFiles(Array.from(this.absolutePathsOfAddedOrUpdatedFiles))();
        this.absolutePathsOfAddedOrUpdatedFiles.clear();
      },
      secondsToMilliseconds(this.WAITING_FOR_SUBSEQUENT_FILE_WILL_BE_ADDED_OR_UPDATED_PERIOD__SECONDS)
    );

  }


  /* ─── Deleting ─────────────────────────────────────────────────────────────────────────────────────────────────── */
  private readonly relativePathsOfFilesToDelete: Set<string> = new Set<string>();
  private waitingForSubsequentFileWillBeDeletedTimer: NodeJS.Timeout | null = null;
  private static readonly WAITING_FOR_SUBSEQUENT_FILE_WILL_BE_DELETED_PERIOD__SECONDS: number = 1;

  protected onFileHasBeenDeleted(targetFileAbsolutePath: string): void {

    if (
      !ImprovedGlob.isFilePathMatchingWithAllGlobSelectors({
        filePath: targetFileAbsolutePath,
        globSelectors: this.targetFilesGlobSelectors
      })
    ) {
      return;
    }


    clearTimeout(
      nullToUndefined(this.waitingForSubsequentFileWillBeDeletedTimer)
    );


    this.relativePathsOfFilesToDelete.add(
      ImprovedPath.computeRelativePath({
        basePath: this.projectBuildingMasterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath,
        comparedPath: targetFileAbsolutePath,
        alwaysForwardSlashSeparators: true
      })
    );

    this.waitingForSubsequentFileWillBeDeletedTimer = setTimeout(
      (): void => {

        for (const fileRelativePath of this.relativePathsOfFilesToDelete) {

          /* eslint-disable-next-line @typescript-eslint/no-dynamic-delete --
          * The recommended by @typescript-eslint alternative is switching of "cachedLintingResults" to Map.
          * However, the Map could not be converted to JSON what causes the additional routines with reading and
          * writing of linting cache file. */
          delete this.sourceFilesCheckingCachedResults.files[fileRelativePath];

        }

        this.reportCheckingIssuesAndOutputCacheToFile();

      },
      secondsToMilliseconds(LinterLikeTaskExecutor.WAITING_FOR_SUBSEQUENT_FILE_WILL_BE_DELETED_PERIOD__SECONDS)
    );

  }

  /* eslint-enable @typescript-eslint/member-ordering */

}


namespace LinterLikeTaskExecutor {

  export type ConstructorParameter<CheckingIssue extends ParsedJSON> =
      GulpStreamsBasedTaskExecutor.ConstructorParameter &
      Readonly<{
        targetFilesGlobSelectors: ReadonlyArray<string>;
        sourceFilesCachedCheckingResults: Readonly<{
          fileNameWithExtension: string;
          contentSpecification: RawObjectDataProcessor.FixedKeyAndValuesTypeObjectDataSpecification;
          emptyValue: CachedCheckingResults<CheckingIssue>;
        }>;
        logging: Logging;
      }>;

  export type Logging =
      GulpStreamsBasedTaskExecutor.Logging &
      Readonly<{
        checkingStart: boolean;
        completionWithoutIssues: boolean;
      }>;

  export type CachedCheckingResults<Issue extends ParsedJSON> = { files: CachedCheckingResults.Files<Issue>; };

  export namespace CachedCheckingResults {

    export type Files<Issue extends ParsedJSON> = { [relativePath: string]: File<Issue> | undefined; };

    export type File<Issue extends ParsedJSON> = Readonly<{
      issues: Array<Issue>;
      modificationDateTime__ISO_8601: string;
    }>;

  }

}

export default LinterLikeTaskExecutor;
