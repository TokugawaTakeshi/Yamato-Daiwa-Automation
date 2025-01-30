/* eslint-disable @typescript-eslint/member-ordering -- Sorted by semantic categories. */

/* ─── Assets ────────────────────────────────────────────────────────────────────────────────────────────────────── */
import HTML_ValidatorLocalization__english from "./HTML_ValidatorLocalization.english";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";

/* ─── Applied Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import NuHTML_Checker from "vnu-jar";
import DotYDA_DirectoryManager from "@Utils/DotYDA_DirectoryManager";

/* ─── Generals Utils ─────────────────────────────────────────────────────────────────────────────────────────────── */
import ChildProcess from "node:child_process";
import NativeToastMessageService from "node-notifier";
import {
  RawObjectDataProcessor,
  Logger,
  ClassRequiredInitializationHasNotBeenExecutedError,
  ClassRedundantSubsequentInitializationError,
  UnexpectedEventError,
  toLowerCamelCase,
  cropArray,
  cropString,
  limitMinimalValue,
  limitMaximalValue,
  surroundLabelByOrnament,
  isUndefined,
  isNotUndefined,
  isNotNull,
  splitString,
  getExpectedToBeNonUndefinedMapValue,
  type Log,
  type InfoLog,
  type ErrorLog
} from "@yamato-daiwa/es-extensions";
import {
  ImprovedPath,
  ImprovedFileSystem,
  ObjectDataFilesProcessor,
  FileNotFoundError
} from "@yamato-daiwa/es-extensions-nodejs";
import { nanoid as generateNanoID } from "nanoid";
import Stopwatch from "@UtilsIncubator/Stopwatch";


class HTML_Validator {

  /* ━━━ Fields ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private static selfSingleInstance: HTML_Validator | null = null;


  /* ─── Work Variables ───────────────────────────────────────────────────────────────────────────────────────────── */
  /* [ Approach ]
   * Although "queue" usually means the order, here is order does not matter unlike the files' uniqueness that is why
   *   set instead of simple Array used. */
  private readonly queuedFilesMetadata: Set<HTML_Validator.QueuedFileMetadata> = new Set();
  private readonly consumingProjectRootDirectoryAbsolutePath: string;


  /* ─── Raw Validations Results Specification (Third-party Library Dependent) ────────────────────────────────────── */
  /** @description
   * + The NuChecker output could change with new versions. The validation of output objects allows to be notified about
   *    them soon.
   * + Being defined in the third-parry solution, the following properties could not be renamed to more clear ones during
   *    data reading & parsing.
   * + The order of properties has been matched with the output of parsed JSON to console. */
  private static readonly validationsResultsSpecification: RawObjectDataProcessor.
      FixedSchemaObjectTypeDataSpecification =
          {
            nameForLogging: "Nu HTML Checker (v.Nu) Output",
            subtype: RawObjectDataProcessor.ObjectSubtypes.fixedSchema,
            properties: {
              messages: {
                type: Array,
                isUndefinedForbidden: true,
                isNullForbidden: true,
                areUndefinedElementsForbidden: true,
                areNullElementsForbidden: true,
                element: {
                  type: Object,
                  properties: {
                    type: {
                      type: String,
                      isUndefinedForbidden: true,
                      isNullForbidden: true,
                      allowedAlternatives: [ "info", "error", "non-document-error", "network-error" ]
                    },
                    url: {
                      type: String,
                      isUndefinedForbidden: true,
                      isNullForbidden: true,
                      minimalCharactersCount: 7
                    },
                    lastLine: {
                      type: Number,
                      isUndefinedForbidden: false,
                      isNullForbidden: true,
                      numbersSet: RawObjectDataProcessor.NumbersSets.naturalNumber
                    },
                    lastColumn: {
                      type: Number,
                      isUndefinedForbidden: false,
                      isNullForbidden: true,
                      numbersSet: RawObjectDataProcessor.NumbersSets.naturalNumber
                    },
                    firstColumn: {
                      type: Number,
                      isUndefinedForbidden: false,
                      isNullForbidden: true,
                      numbersSet: RawObjectDataProcessor.NumbersSets.naturalNumber
                    },
                    subType: {
                      type: String,
                      isUndefinedForbidden: false,
                      isNullForbidden: true,
                      allowedAlternatives: [ "warning", "fatal", "io", "schema", "internal" ]
                    },
                    message: {
                      type: String,
                      isUndefinedForbidden: true,
                      isNullForbidden: true,
                      minimalCharactersCount: 1
                    },
                    extract: {
                      type: String,
                      isUndefinedForbidden: false,
                      isNullForbidden: true
                    },
                    hiliteStart: {

                      type: Number,
                      isUndefinedForbidden: false,
                      isNullForbidden: true,

                      /* [ Theory ] The 0 is rare but possible (at least was possible for May 2025). */
                      numbersSet: RawObjectDataProcessor.NumbersSets.positiveIntegerOrZero

                    },
                    hiliteLength: {
                      type: Number,
                      isUndefinedForbidden: false,
                      isNullForbidden: true,
                      numbersSet: RawObjectDataProcessor.NumbersSets.naturalNumber
                    }
                  }
                }
              }
            }
          };


  /* ─── Caching ──────────────────────────────────────────────────────────────────────────────────────────────────── */
  /* [ Theory ]
   * Between 2 project buildings, the content of most HTML files may not change (especially since the project has
   *   become mature). Thanks to checksums, it is possible to detect has page content changes quickly. */

  private static readonly CACHED_VALIDATIONS_RESULTS_FOLDER_NAME: string = "HTML_Validation";
  private static readonly CACHED_VALIDATIONS_RESULTS_FILE_CONSTANT_NAME_PART: string = "HTML_Validation";
  private readonly absolutePathOfParentDirectoryOfCachedValidationsResultsFile: string;
  private readonly absolutePathOfCachedValidationsResultsFile: string;
  private readonly cachedValidationsResults: HTML_Validator.NormalizedValidationsResults;

  private static readonly cachedValidationsResultsFileContentSpecification: RawObjectDataProcessor.
      AssociativeArrayTypeDataSpecification =
          {
            nameForLogging: "HTML_Validator.CachedValidationResultsFileContentSpecification",
            subtype: RawObjectDataProcessor.ObjectSubtypes.associativeArray,
            areUndefinedTypeValuesForbidden: true,
            areNullTypeValuesForbidden: true,
            value: {
              type: Object,
              properties: {
                contentMD5Checksum: {
                  type: String,
                  isUndefinedForbidden: true,
                  isNullForbidden: true
                },
                issues: {
                  type: Array,
                  isUndefinedForbidden: true,
                  isNullForbidden: true,
                  areUndefinedElementsForbidden: true,
                  areNullElementsForbidden: true,
                  element: {
                    type: Object,
                    properties: {
                      type: {
                        type: String,
                        isUndefinedForbidden: true,
                        isNullForbidden: true,
                        allowedAlternatives: [ "info", "error", "non-document-error", "network-error" ]
                      },
                      subType: {
                        type: String,
                        isUndefinedForbidden: false,
                        isNullForbidden: true,
                        allowedAlternatives: [ "warning", "fatal", "io", "schema", "internal" ]
                      },
                      message: {
                        type: String,
                        isUndefinedForbidden: true,
                        isNullForbidden: true
                      },
                      lineNumber__numerationFrom1: {
                        type: Number,
                        numbersSet: RawObjectDataProcessor.NumbersSets.naturalNumber,
                        isUndefinedForbidden: true,
                        isNullForbidden: true
                      },
                      startingColumnNumber__numerationFrom1: {
                        type: Number,
                        numbersSet: RawObjectDataProcessor.NumbersSets.positiveIntegerOrZero,
                        isUndefinedForbidden: true,
                        isNullForbidden: true
                      },
                      endingColumnNumber__numerationFrom1: {
                        type: Number,
                        numbersSet: RawObjectDataProcessor.NumbersSets.positiveIntegerOrZero,
                        isUndefinedForbidden: true,
                        isNullForbidden: true
                      },
                      codeFragment: {
                        type: Object,
                        isUndefinedForbidden: true,
                        isNullForbidden: true,
                        properties: {
                          beforeHighlighting: {
                            type: String,
                            isUndefinedForbidden: true,
                            isNullForbidden: true
                          },
                          highlighted: {
                            type: String,
                            isUndefinedForbidden: true,
                            isNullForbidden: true
                          },
                          afterHighlighting: {
                            type: String,
                            isUndefinedForbidden: true,
                            isNullForbidden: true
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          };


  /* ─── Logging ──────────────────────────────────────────────────────────────────────────────────────────────────── */
  private readonly logging: HTML_Validator.Logging;

  private static readonly DISPLAYING_LINES_COUNT_BEFORE_ISSUE_IN_CODE_LISTING: number = 2;
  private static readonly DISPLAYING_LINES_COUNT_AFTER_ISSUE_IN_CODE_LISTING: number = 1;

  /* [ Theory ] 120 columns is about the half of the 1920x1080 screen. */
  private static readonly DISPLAYING_MAXIMAL_COLUMNS_COUNT_IN_LOG: number = 120;


  /* ─── Temporary Files ──────────────────────────────────────────────────────────────────────────────────────────── */
  private static readonly TEMPORARY_FORMATTED_HTML_FILES_FOLDER_NAME: string = "HTML_Validation";
  private readonly absolutePathOfParentDirectoryOfTemporaryFormattedHTML_Files: string;
  private readonly pathRelativeToConsumingProjectRootOfParentDirectoryOfTemporaryFormattedHTML_Files: string;


  /* ─── Localization ─────────────────────────────────────────────────────────────────────────────────────────────── */
  public static localization: HTML_Validator.Localization = HTML_ValidatorLocalization__english;


  /* ━━━ Public Static Methods (Facade) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public static initialize(requirements: HTML_Validator.Requirements): void {

    if (isNotNull(HTML_Validator.selfSingleInstance)) {

      Logger.logError({
        errorType: ClassRedundantSubsequentInitializationError.NAME,
        title: ClassRedundantSubsequentInitializationError.localization.defaultTitle,
        description: ClassRedundantSubsequentInitializationError.localization.generateDescription({
          className: "HTML_Validator"
        }),
        occurrenceLocation: "HTML_Validator.initialize(configuration)",
        mustOutputIf: __IS_DEVELOPMENT_BUILDING_MODE__
      });

      return;

    }


    HTML_Validator.selfSingleInstance = new HTML_Validator(requirements);

  }

  /** @description
   * Separate launch of `vnu-jar` per file may cause the performance impact thus it is more efficient to accumulate
   *   the files and validate them at once. */
  public static enqueueFileForValidation(targetFileMetadata: HTML_Validator.QueuedFileMetadata): void {
    HTML_Validator.
        getExpectedToBeInitializedSelfSingleInstance().
        queuedFilesMetadata.
        add(targetFileMetadata);
  }

  public static validateQueuedFilesButReportAll(): void {
    HTML_Validator.
        getExpectedToBeInitializedSelfSingleInstance().
        validateQueuedFilesButReportAll().
        catch(Logger.logPromiseError);
  }


  /* ━━━ Constructor ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private constructor(
    {
      temporaryFileDirectoryAbsolutePath,
      projectBuildingMasterConfigRepresentative,
      logging
    }: HTML_Validator.Requirements
  ) {

    this.consumingProjectRootDirectoryAbsolutePath = projectBuildingMasterConfigRepresentative.
        consumingProjectRootDirectoryAbsolutePath;


    /* ─── Caching ────────────────────────────────────────────────────────────────────────────────────────────────── */
    this.absolutePathOfParentDirectoryOfCachedValidationsResultsFile = ImprovedPath.joinPathSegments(
        [
          DotYDA_DirectoryManager.OPTIMIZATION_FILES_DIRECTORY_ABSOLUTE_PATH,
          HTML_Validator.CACHED_VALIDATIONS_RESULTS_FOLDER_NAME
        ],
        { alwaysForwardSlashSeparators: true }
      );

    this.absolutePathOfCachedValidationsResultsFile = HTML_Validator.
        computeAbsolutePathOfCachedValidationsResultsFileActualForCurrentProjectBuildingMode({
          parentDirectoryAbsolutePath: this.absolutePathOfParentDirectoryOfCachedValidationsResultsFile,
          projectBuildingSelectiveExecutionID: projectBuildingMasterConfigRepresentative.selectiveExecutionID,
          consumingProjectBuildingMode: projectBuildingMasterConfigRepresentative.consumingProjectBuildingMode
        });

    let cachedValidationsResults: HTML_Validator.CachedPastValidationsRawResults | undefined;

    try {

      cachedValidationsResults = ObjectDataFilesProcessor.
          processFile<HTML_Validator.CachedPastValidationsRawResults>({
            filePath: this.absolutePathOfCachedValidationsResultsFile,
            validDataSpecification: HTML_Validator.cachedValidationsResultsFileContentSpecification,
            synchronously: true
          });

    } catch (error: unknown) {

      if (!(error instanceof FileNotFoundError)) {
        Logger.logError({
          errorType: "CachedDataRetrievingFailure",
          ...HTML_Validator.localization.cachedPreviousValidationsResultsDataRetrievingErrorLog({
            cachedValidationsResultsFileAbsolutePath: this.absolutePathOfCachedValidationsResultsFile
          }),
          occurrenceLocation: "HTML_Validator.retrieveCachedPastValidationsResultsFromFileIfItExists" +
            "(cachedValidationsResultsFileAbsolutePath)",
          caughtError: error,
          mustOutputIf: __IS_DEVELOPMENT_BUILDING_MODE__
        });
      }

    }

    this.cachedValidationsResults = new Map(Object.entries(cachedValidationsResults ?? {}));


    /* ─── Logging ────────────────────────────────────────────────────────────────────────────────────────────────── */
    this.logging = logging;


    /* ─── Temporary Files ────────────────────────────────────────────────────────────────────────────────────────── */
    this.absolutePathOfParentDirectoryOfTemporaryFormattedHTML_Files = ImprovedPath.joinPathSegments([
      temporaryFileDirectoryAbsolutePath,
      HTML_Validator.TEMPORARY_FORMATTED_HTML_FILES_FOLDER_NAME
    ]);

    this.pathRelativeToConsumingProjectRootOfParentDirectoryOfTemporaryFormattedHTML_Files = ImprovedPath.
        computeRelativePath({
          basePath: projectBuildingMasterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath,
          comparedPath: this.absolutePathOfParentDirectoryOfTemporaryFormattedHTML_Files,
          alwaysForwardSlashSeparators: true
        });

  }


  /* ━━━ Private Methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* ─── Validation ───────────────────────────────────────────────────────────────────────────────────────────────── */
  private async validateQueuedFilesButReportAll(): Promise<void> {

    /* [ Approach ]
     * To get readable logs with code fragment, the original output HTML files can not be used because they possibly
     *   contains the minified HTML code.
     * The saving of temporary HTML files with formatted HTML code is the solution.
     * Anyway, the Nu HTML Checker does not work with HTML strings — it accepts only relative paths of files saved to
     *   drive. */
    const formattedTemporaryHTML_FilesPathsRelativeToConsumingProjectRoot__forwardSlashesSeparatorsOnly: Array<string> = [];

    /* [ Theory ]
     * Nu HTML Checker can inspect the multiple files at once but returns the single array with issues data for all files.
     * But how to understand for which file Nu HTML Checker emitted the specific issue (array element)?
     * The data of each issue will include the URI like
     * "file:/D:/IntelliJ%20IDEA/SampleProject/.yda/Temporary/HTML_Validation/4834cf5c-253f-4147-b00c-b8ca53922315.html"
     * It is the encoded (`encodeURI()` for ECMAScript) absolute path of temporary formatted HTML file with "file:/" prefix. */
    const temporaryFormattedHTML_FilesEncodedURIsAndOriginalHTML_FilesRelativePathsCorrespondence: Map<
      HTML_Validator.HTML_FilePathRelativeToConsumingProjectRoot__ForwardSlashesSeparatorsOnly,
      HTML_Validator.TemporaryFormattedHTML_FileEncodedURI
    > = new Map();

    /* [ Theory ]
     * Nu HTML Checker will not output the data for valid files while their paths are still required for summary. */
    const relativeToConsumingProjectRootPathsOfOriginalHTML_FilesWillBeValidated__forwardSlashesSeparatorsOnly:
        Set<string> = new Set<string>();

    const MD5_HashesOfHTML_ContentByRelativePathsOfOriginalHTML_Files: Map<HTML_Validator.
      MD5_HashOfHTML_Content,
      HTML_Validator.OriginalHTML_FilePathRelativeToConsumingProjectRoot__ForwardSlashesSeparatorsOnly
    > = new Map();

    const cachedHTML_CodeExplodedToLinesByRelativePathsOfOriginalHTML_Files: Map<
      HTML_Validator.HTML_FilePathRelativeToConsumingProjectRoot__ForwardSlashesSeparatorsOnly,
      Array<HTML_Validator.OriginalHTML_FilePathRelativeToConsumingProjectRoot__ForwardSlashesSeparatorsOnly>
    > = new Map();

    for (
      const {
        originalHTML_FilePathRelativeToConsumingProjectRoot__forwardSlashesSeparatorsOnly,
        formattedHTML_Content,
        HTML_ContentMD5_Hash
      } of this.queuedFilesMetadata
    ) {

      /* [ Approach ]
       * Even there is the cached data for target files, it still must be stored to interim collections for the full report. */
      relativeToConsumingProjectRootPathsOfOriginalHTML_FilesWillBeValidated__forwardSlashesSeparatorsOnly.add(
        originalHTML_FilePathRelativeToConsumingProjectRoot__forwardSlashesSeparatorsOnly
      );

      MD5_HashesOfHTML_ContentByRelativePathsOfOriginalHTML_Files.set(
        originalHTML_FilePathRelativeToConsumingProjectRoot__forwardSlashesSeparatorsOnly,
        HTML_ContentMD5_Hash
      );

      const cachedValidationsResultsForCurrentFile: HTML_Validator.NormalizedValidationsResults.File | undefined =
          this.cachedValidationsResults.get(originalHTML_FilePathRelativeToConsumingProjectRoot__forwardSlashesSeparatorsOnly);

      if (cachedValidationsResultsForCurrentFile?.contentMD5Checksum === HTML_ContentMD5_Hash) {
        continue;
      }


      this.cachedValidationsResults.delete(originalHTML_FilePathRelativeToConsumingProjectRoot__forwardSlashesSeparatorsOnly);

      cachedHTML_CodeExplodedToLinesByRelativePathsOfOriginalHTML_Files.set(
        originalHTML_FilePathRelativeToConsumingProjectRoot__forwardSlashesSeparatorsOnly,
        splitString(formattedHTML_Content, "\n")
      );

      const formattedTemporaryHTML_FilePathRelativeToConsumingProjectRoot__forwardSlashesSeparatorsOnly: string =
          ImprovedPath.joinPathSegments(
            [
              this.pathRelativeToConsumingProjectRootOfParentDirectoryOfTemporaryFormattedHTML_Files,
              `${ generateNanoID() }.html`
            ],
            { alwaysForwardSlashSeparators: true }
          );

      formattedTemporaryHTML_FilesPathsRelativeToConsumingProjectRoot__forwardSlashesSeparatorsOnly.push(
        formattedTemporaryHTML_FilePathRelativeToConsumingProjectRoot__forwardSlashesSeparatorsOnly
      );

      const formattedTemporaryHTML_FileAbsolutePath__forwardSlashesSeparatorsOnly: string =
          ImprovedPath.joinPathSegments(
            [
              this.consumingProjectRootDirectoryAbsolutePath,
              formattedTemporaryHTML_FilePathRelativeToConsumingProjectRoot__forwardSlashesSeparatorsOnly
            ],
            { alwaysForwardSlashSeparators: true }
          );

      temporaryFormattedHTML_FilesEncodedURIsAndOriginalHTML_FilesRelativePathsCorrespondence.set(
        `file:/${ encodeURI(formattedTemporaryHTML_FileAbsolutePath__forwardSlashesSeparatorsOnly) }`,
        originalHTML_FilePathRelativeToConsumingProjectRoot__forwardSlashesSeparatorsOnly
      );

      ImprovedFileSystem.writeFileToPossiblyNotExistingDirectory({
        filePath: formattedTemporaryHTML_FileAbsolutePath__forwardSlashesSeparatorsOnly,
        content: formattedHTML_Content,
        synchronously: true
      });

    }

    if (this.logging.validationStart) {
      Logger.logInfo(HTML_Validator.localization.validationStartedInfoLog);
    }

    /* [ Theory ] If pass no files to Nu HTML Checker, it will fail with the error. */
    if (formattedTemporaryHTML_FilesPathsRelativeToConsumingProjectRoot__forwardSlashesSeparatorsOnly.length === 0) {

      HTML_Validator.reportValidationsResults({
        validationsResults: this.cachedValidationsResults,
        validationPeriod__seconds: 0
      });

      return;

    }


    const validationTimeMeasuringStopwatch: Stopwatch = new Stopwatch().startOrRestart();

    const rawValidationsResults: unknown = await HTML_Validator.getRawValidationsResultsFromNuHTML_Checker(
      formattedTemporaryHTML_FilesPathsRelativeToConsumingProjectRoot__forwardSlashesSeparatorsOnly
    );

    ImprovedFileSystem.removeFilesFromDirectory({
      directoryPath__absoluteOrRelative: this.absolutePathOfParentDirectoryOfTemporaryFormattedHTML_Files,
      synchronously: true
    });

    const rawValidationsResultsInspectionOutput:
        RawObjectDataProcessor.ProcessingResult<HTML_Validator.RawValidationsResults> =
            RawObjectDataProcessor.process<HTML_Validator.RawValidationsResults>(
              rawValidationsResults, HTML_Validator.validationsResultsSpecification
            );

    if (rawValidationsResultsInspectionOutput.isRawDataInvalid) {

      validationTimeMeasuringStopwatch.stop();

      Logger.logError({
        errorType: UnexpectedEventError.NAME,
        title: UnexpectedEventError.localization.defaultTitle,
        description:
            "The Nu HTML Checker does not much with expected one.\n" +
            RawObjectDataProcessor.formatValidationErrorsList(rawValidationsResultsInspectionOutput.validationErrorsMessages),
        occurrenceLocation: "HTML_Validator.validateQueuedFilesButReportAll()",
        mustOutputIf: __IS_DEVELOPMENT_BUILDING_MODE__
      });

      return;

    }


    /* [ Theory ]
     * The ones which called `messages` in Nu HTML Checker are not the messages.
     * The `messages` property is the array of objects each of which has `message` string property.
     * There are could be multiple objects for single file thus sorting by files required first. */
    for (const rawValidationIssue of rawValidationsResultsInspectionOutput.processedData.messages) {

      const originalHTML_FilePathRelativeToConsumingProjectRoot__forwardSlashesSeparatorsOnly: string =
          getExpectedToBeNonUndefinedMapValue(
            temporaryFormattedHTML_FilesEncodedURIsAndOriginalHTML_FilesRelativePathsCorrespondence,
            rawValidationIssue.url
          );

      relativeToConsumingProjectRootPathsOfOriginalHTML_FilesWillBeValidated__forwardSlashesSeparatorsOnly.delete(
        originalHTML_FilePathRelativeToConsumingProjectRoot__forwardSlashesSeparatorsOnly
      );


      /* [ Approach ] In the first pass for each file, the value will be undefined. */
      const issuesOfCurrentFile: Array<HTML_Validator.NormalizedValidationsResults.Issue> | undefined =
          this.cachedValidationsResults.
              get(originalHTML_FilePathRelativeToConsumingProjectRoot__forwardSlashesSeparatorsOnly)?.
              issues;

      if (isUndefined(issuesOfCurrentFile)) {

        this.cachedValidationsResults.set(
          originalHTML_FilePathRelativeToConsumingProjectRoot__forwardSlashesSeparatorsOnly,
          {
            contentMD5Checksum: getExpectedToBeNonUndefinedMapValue(
              MD5_HashesOfHTML_ContentByRelativePathsOfOriginalHTML_Files,
              originalHTML_FilePathRelativeToConsumingProjectRoot__forwardSlashesSeparatorsOnly
            ),
            issues: [
              HTML_Validator.normalizeRawValidationIssue(
                rawValidationIssue,
                getExpectedToBeNonUndefinedMapValue(
                  cachedHTML_CodeExplodedToLinesByRelativePathsOfOriginalHTML_Files,
                  originalHTML_FilePathRelativeToConsumingProjectRoot__forwardSlashesSeparatorsOnly
                )
              )
            ]
          }
        );

        continue;

      }


      issuesOfCurrentFile.push(
        HTML_Validator.normalizeRawValidationIssue(
          rawValidationIssue,
          getExpectedToBeNonUndefinedMapValue(
            cachedHTML_CodeExplodedToLinesByRelativePathsOfOriginalHTML_Files,
            originalHTML_FilePathRelativeToConsumingProjectRoot__forwardSlashesSeparatorsOnly
          )
        )
      );

    }

    for (
      const relativeToConsumingProjectRootPathOfOriginalValidHTML_Files__forwardSlashesSeparatorsOnly of
          relativeToConsumingProjectRootPathsOfOriginalHTML_FilesWillBeValidated__forwardSlashesSeparatorsOnly
    ) {

      this.cachedValidationsResults.set(
        relativeToConsumingProjectRootPathOfOriginalValidHTML_Files__forwardSlashesSeparatorsOnly,
        {
          issues: [],
          contentMD5Checksum: getExpectedToBeNonUndefinedMapValue(
            MD5_HashesOfHTML_ContentByRelativePathsOfOriginalHTML_Files,
            relativeToConsumingProjectRootPathOfOriginalValidHTML_Files__forwardSlashesSeparatorsOnly
          )
        }
      );

    }

    const { seconds: validationPeriod__seconds }: Stopwatch.ElapsedTimeData = validationTimeMeasuringStopwatch.stop();

    HTML_Validator.reportValidationsResults({ validationsResults: this.cachedValidationsResults, validationPeriod__seconds });

    this.writeCacheToFile();
    this.queuedFilesMetadata.clear();

  }

  private static async getRawValidationsResultsFromNuHTML_Checker(
    targetFilesPathRelativeToConsumingProjectRoot__forwardSlashesPathSeparators: ReadonlyArray<string>
  ): Promise<unknown> {
    return new Promise<unknown>(
      (
        resolve: (rawValidationsResults: unknown) => void,
        reject: (error: unknown) => void
      ): void => {

        /* [ Theory ] "vnu-jar" works only with relative paths. Absolute paths will not work with any path separators. */
        ChildProcess.execFile(
          "java",
          [
            "-jar",
            `"${ NuHTML_Checker }"`,
            "--format",
            "json",
            ...targetFilesPathRelativeToConsumingProjectRoot__forwardSlashesPathSeparators
          ],
          { shell: true },
          (_error: ChildProcess.ExecFileException | null, _stdout: string | Buffer, stderr: string | Buffer): void => {

            /* [ Theory ] vnu-jar
             * + All validation errors will be output to `stderr` herewith the first parameter will be non-null.
             * + It is possible to output the validation error to `stdout` instead if to specify the respective option,
             *   but the first parameter will be non-null anyway.
             * + The reaction to non-existing file is completely same as to valid file: the stringified object
             *   `{"messages":[]}` will be returned. */
            const stringifiedOutput: string = Buffer.isBuffer(stderr) ? stderr.toString("utf8") : stderr;

            try {

              resolve(JSON.parse(stringifiedOutput));

            } catch (error: unknown) {

              reject(error);

            }

          }
        );

      }
    );
  }


  /* ─── Raw Issues Normalizing ───────────────────────────────────────────────────────────────────────────────────── */
  private static normalizeRawValidationIssue(
    {
      type,
      subType,
      message,
      lastLine: lineNumberOfActualCodeFragment__numerationFrom1,
      firstColumn,
      lastColumn: numberOfEndingColumnOfHighlightedCodeFragment__numerationFrom1
    }: HTML_Validator.RawValidationResult,
    HTML_CodeSplitToLines: ReadonlyArray<string>
  ): HTML_Validator.NormalizedValidationsResults.Issue {

    if (
      isUndefined(lineNumberOfActualCodeFragment__numerationFrom1) ||
      isUndefined(numberOfEndingColumnOfHighlightedCodeFragment__numerationFrom1)
    ) {
      return {
        type,
        subType,
        message
      };
    }

    const actualLineOfCode: string = HTML_CodeSplitToLines[lineNumberOfActualCodeFragment__numerationFrom1 - 1];

    const numberOfStartingLineWhichWillBeExtractedFromCodeListingForLogging__numerationFrom1: number =
        limitMinimalValue({
          targetNumber: lineNumberOfActualCodeFragment__numerationFrom1 -
              HTML_Validator.DISPLAYING_LINES_COUNT_BEFORE_ISSUE_IN_CODE_LISTING,
          minimalValue: 1
        });

    const numberOfEndingLineWhichWillBeExtractedFromCodeListingForLogging__numerationFrom1: number =
        limitMaximalValue({
          targetNumber: lineNumberOfActualCodeFragment__numerationFrom1 +
              HTML_Validator.DISPLAYING_LINES_COUNT_AFTER_ISSUE_IN_CODE_LISTING,
          maximalValue: HTML_CodeSplitToLines.length
        });

    const numberOfStartingColumnOfHighlightedCodeFragment__numerationFrom1: number =
        firstColumn ?? numberOfEndingColumnOfHighlightedCodeFragment__numerationFrom1;

    /* [ Maintainability ] Keep these variables for easier debugging. */
    const codeFragmentBeforeHighlighting: string =
        `${
          cropArray({
            targetArray: HTML_CodeSplitToLines,
            startingElementNumber__numerationFrom1:
                numberOfStartingLineWhichWillBeExtractedFromCodeListingForLogging__numerationFrom1,
            endingElementNumber__numerationFrom1: limitMinimalValue({
              targetNumber: lineNumberOfActualCodeFragment__numerationFrom1 - 1, minimalValue: 1
            }),
            mustThrowErrorIfSpecifiedElementsNumbersAreOutOfRange: false,
            mutably: false
          }).join("\n")
        }\n` +
        (
          numberOfStartingColumnOfHighlightedCodeFragment__numerationFrom1 > 1 ?
              cropString({
                targetString: actualLineOfCode,
                startingCharacterNumber__numerationFrom1: 1,
                endingCharacterNumber__numerationFrom1: numberOfStartingColumnOfHighlightedCodeFragment__numerationFrom1 - 1,
                mustThrowErrorIfSpecifiedCharactersNumbersIsOutOfRange: false
              }) :
              ""
        );

    const highlightedCodeFragment: string = cropString({
      targetString: actualLineOfCode,
      startingCharacterNumber__numerationFrom1: numberOfStartingColumnOfHighlightedCodeFragment__numerationFrom1,
      endingCharacterNumber__numerationFrom1: numberOfEndingColumnOfHighlightedCodeFragment__numerationFrom1,
      mustThrowErrorIfSpecifiedCharactersNumbersIsOutOfRange: false
    });

    const codeFragmentAfterHighlighting: string =
        `${
          cropString({
            targetString: actualLineOfCode,
            startingCharacterNumber__numerationFrom1:
                numberOfEndingColumnOfHighlightedCodeFragment__numerationFrom1 + 1,
            endingCharacterNumber__numerationFrom1: actualLineOfCode.length,
            mustThrowErrorIfSpecifiedCharactersNumbersIsOutOfRange: false
          })
        }\n` +
        cropArray({
          targetArray: HTML_CodeSplitToLines,
          startingElementNumber__numerationFrom1: lineNumberOfActualCodeFragment__numerationFrom1 + 1,
          endingElementNumber__numerationFrom1:
              numberOfEndingLineWhichWillBeExtractedFromCodeListingForLogging__numerationFrom1,
          mustThrowErrorIfSpecifiedElementsNumbersAreOutOfRange: false,
          mutably: false
        }).join("\n");

    return {
      type,
      subType,
      message,
      lineNumber__numerationFrom1: lineNumberOfActualCodeFragment__numerationFrom1,
      startingColumnNumber__numerationFrom1: numberOfStartingColumnOfHighlightedCodeFragment__numerationFrom1,
      endingColumnNumber__numerationFrom1: numberOfEndingColumnOfHighlightedCodeFragment__numerationFrom1,
      codeFragment: {
        beforeHighlighting: codeFragmentBeforeHighlighting,
        highlighted: highlightedCodeFragment,
        afterHighlighting: codeFragmentAfterHighlighting
      }
    };

  }


  /* ─── Reporting ────────────────────────────────────────────────────────────────────────────────────────────────── */
  private static reportValidationsResults(
    {
      validationsResults,
      validationPeriod__seconds
    }: Readonly<{
      validationsResults: HTML_Validator.NormalizedValidationsResults;
      validationPeriod__seconds: number;
    }>
  ): void {

    const filesPathsRelativeToConsumingProjectRootSortedByAlphabet__forwardPathSeparatorsOnly: ReadonlyArray<string> =
        Array.from(validationsResults.keys()).sort();

    let hasAtLeastOneFileWithInvalidHTML: boolean = false;

    const hasEachFileIssues: Map<
      HTML_Validator.HTML_FilePathRelativeToConsumingProjectRoot__ForwardSlashesSeparatorsOnly, boolean
    > = new Map();

    const formattedIssuesForEachFile: Map<
      HTML_Validator.HTML_FilePathRelativeToConsumingProjectRoot__ForwardSlashesSeparatorsOnly, string
    > = new Map();

    for (
      const [ filePathRelativeToConsumingProjectRoot__forwardPathSeparatorsOnly, { issues } ] of
          validationsResults.entries()
    ) {

      const hasCurrentFileHTML_ValidityIssues: boolean = issues.length > 0;

      hasEachFileIssues.set(
        filePathRelativeToConsumingProjectRoot__forwardPathSeparatorsOnly, hasCurrentFileHTML_ValidityIssues
      );

      if (hasCurrentFileHTML_ValidityIssues) {

        hasAtLeastOneFileWithInvalidHTML = true;

        formattedIssuesForEachFile.set(
          filePathRelativeToConsumingProjectRoot__forwardPathSeparatorsOnly,
          HTML_Validator.formatValidationResultForSingleFile(issues)
        );

      }

    }

    const summary: string =
        `${
          surroundLabelByOrnament({
            label: HTML_Validator.localization.validityIssuesDetectedErrorLog.headings.summary,
            ornamentPatten: "━",
            characterForIndentationAroundLabel: " ",
            prependedPartCharactersCount: 3,
            totalCharactersCount: HTML_Validator.DISPLAYING_MAXIMAL_COLUMNS_COUNT_IN_LOG
          })
        }\n` +
        filesPathsRelativeToConsumingProjectRootSortedByAlphabet__forwardPathSeparatorsOnly.
            map(
              (fileRelativePath__forwardPathSeparatorsOnly: string): string =>
                  `${ 
                    getExpectedToBeNonUndefinedMapValue(hasEachFileIssues, fileRelativePath__forwardPathSeparatorsOnly) ? 
                        "❌" : "✅" 
                  }　` +
                  fileRelativePath__forwardPathSeparatorsOnly
            ).
            join("\n");

    const detailedReport: string =
        `${
          surroundLabelByOrnament({
            label: HTML_Validator.localization.validityIssuesDetectedErrorLog.headings.details,
            ornamentPatten: "━",
            characterForIndentationAroundLabel: " ",
            prependedPartCharactersCount: 3,
            totalCharactersCount: HTML_Validator.DISPLAYING_MAXIMAL_COLUMNS_COUNT_IN_LOG
          })
        }\n` +
        filesPathsRelativeToConsumingProjectRootSortedByAlphabet__forwardPathSeparatorsOnly.
            filter(
              (fileRelativePath__forwardPathSeparatorsOnly: string): boolean =>
                  formattedIssuesForEachFile.has(fileRelativePath__forwardPathSeparatorsOnly)
            ).
            map(
              (fileRelativePath__forwardPathSeparatorsOnly: string): string =>
                  `${
                    surroundLabelByOrnament({
                      label: fileRelativePath__forwardPathSeparatorsOnly,
                      characterForIndentationAroundLabel: "",
                      ornamentPatten: "─",
                      prependedPartCharactersCount: 3,
                      totalCharactersCount: HTML_Validator.DISPLAYING_MAXIMAL_COLUMNS_COUNT_IN_LOG
                    })
                  }\n` +
                  getExpectedToBeNonUndefinedMapValue(formattedIssuesForEachFile, fileRelativePath__forwardPathSeparatorsOnly)
            ).
            join("\n");

    if (hasAtLeastOneFileWithInvalidHTML) {

      Logger.logErrorLikeMessage({
        title: HTML_Validator.localization.validityIssuesDetectedErrorLog.title,
        description:
          `${ summary }\n\n` +
          `${ detailedReport }\n` +
          HTML_Validator.localization.validityIssuesDetectedErrorLog.generateSecondsElapsedSentence({ validationPeriod__seconds })
      });

      NativeToastMessageService.notify(HTML_Validator.localization.validityIssuesDetectedToastNotification);

      return;

    }


    Logger.logSuccess({
      title: HTML_Validator.localization.validationFinishedWithoutIssuesSuccessLog.title,
      description: HTML_Validator.localization.validationFinishedWithoutIssuesSuccessLog.generateDescription({
        validationPeriod__seconds,
        preFormattedErrorsMessages: Array.from(validationsResults.keys()).
            map(
              (fileRelativePath__forwardPathSeparatorsOnly: string): string =>
                `● ${ fileRelativePath__forwardPathSeparatorsOnly }`
            ).
            join("\n")
      })
    });

  }


  /* ─── Formatting ───────────────────────────────────────────────────────────────────────────────────────────────── */
  private static formatValidationResultForSingleFile(
    issues: ReadonlyArray<HTML_Validator.NormalizedValidationsResults.Issue>
  ): string {

    const formattedIssues: Array<string> = [];

    for (const [ index, issue ] of issues.entries()) {

      /* [ Desired Output Example ]

       === Issue No. 5 =================================================================================================
       <div class="NewsFeed"></div><a><span></span><a>Foo<div></div><a>bar</a></a>
       </a><span></span>
       <h1></h1>
       <button></button><span>END</span>
       -----------------------------------------------------------------------------------------------------------------
       Empty heading. (Recommendation disregard)
       At line 16, columns 5-8

       */

      formattedIssues.push([

        `${
          surroundLabelByOrnament({
            label: HTML_Validator.localization.generateIssueNumberLabel({ issueNumber: index + 1 }),
            ornamentPatten: "┄",
            characterForIndentationAroundLabel: " ",
            prependedPartCharactersCount: 3,
            totalCharactersCount: HTML_Validator.DISPLAYING_MAXIMAL_COLUMNS_COUNT_IN_LOG
          })
        }\n`,

        ...isNotUndefined(issue.codeFragment) ?
            [
              issue.codeFragment.beforeHighlighting,
              Logger.highlightText(issue.codeFragment.highlighted),
              `${ issue.codeFragment.afterHighlighting }\n`
            ] :
            [],

        `${ "-".repeat(HTML_Validator.DISPLAYING_MAXIMAL_COLUMNS_COUNT_IN_LOG) }\n`,

        issue.message,
        ` (${
          ((): string => {
            switch (issue.type) {

              case HTML_Validator.NormalizedValidationsResults.Issue.Types.error:
                return HTML_Validator.localization.issuesTypesTitles.grossViolation;

              case HTML_Validator.NormalizedValidationsResults.Issue.Types.info:
                return HTML_Validator.localization.issuesTypesTitles.recommendationDisregard;

            }
          })()
        })\n`,

      ...isNotUndefined(issue.lineNumber__numerationFrom1) &&
        isNotUndefined(issue.startingColumnNumber__numerationFrom1) &&
        isNotUndefined(issue.endingColumnNumber__numerationFrom1) ?
          [
            HTML_Validator.localization.generateIssueOccurrenceLocationIndication({
              lineNumber: issue.lineNumber__numerationFrom1,
              startingColumnNumber: issue.startingColumnNumber__numerationFrom1,
              lastColumnNumber: issue.endingColumnNumber__numerationFrom1
            })
          ] :
          []
      ].join(""));

    }

    return formattedIssues.join("\n\n");

  }


  /* ─── Cached Validations Results File ──────────────────────────────────────────────────────────────────────────── */
  private static computeAbsolutePathOfCachedValidationsResultsFileActualForCurrentProjectBuildingMode(
    {
      parentDirectoryAbsolutePath,
      projectBuildingSelectiveExecutionID,
      consumingProjectBuildingMode
    }: Readonly<{
      parentDirectoryAbsolutePath: string;
      projectBuildingSelectiveExecutionID?: string;
      consumingProjectBuildingMode: string;
    }>
  ): string {
    return ImprovedPath.joinPathSegments([
      parentDirectoryAbsolutePath,
      [
        `${ HTML_Validator.CACHED_VALIDATIONS_RESULTS_FILE_CONSTANT_NAME_PART }.`,
        ...isUndefined(projectBuildingSelectiveExecutionID) ? [] : [ `${ projectBuildingSelectiveExecutionID }.` ],
        `${ toLowerCamelCase(consumingProjectBuildingMode) }.json`
      ].join(".")
    ]);
  }

  private writeCacheToFile(): void {

    /* [ Maintainability ] Keep this variable for easier debugging. */
    const cachedValidationsResultsFileContent: HTML_Validator.CachedPastValidationsRawResults =
        Array.from(this.cachedValidationsResults.entries()).
            reduce(
                (
                  accumulatingValue: HTML_Validator.CachedPastValidationsRawResults,
                  [ filePathRelativeToConsumingProjectRootDirectory, cachedValidationRawResultsForSpecificFile ]:
                      [ string, HTML_Validator.NormalizedValidationsResults.File ]
                ): HTML_Validator.CachedPastValidationsRawResults => {
                  accumulatingValue[filePathRelativeToConsumingProjectRootDirectory] = cachedValidationRawResultsForSpecificFile;
                  return accumulatingValue;
                },
                {}
            );

    ImprovedFileSystem.writeFileToPossiblyNotExistingDirectory({
      filePath: this.absolutePathOfParentDirectoryOfCachedValidationsResultsFile,
      content: JSON.stringify(cachedValidationsResultsFileContent, null, 2),
      synchronously: true
    });

  }


  /* ━━━ Routines ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private static getExpectedToBeInitializedSelfSingleInstance(): HTML_Validator {
    return HTML_Validator.selfSingleInstance ??
        Logger.throwErrorAndLog({
          errorInstance: new ClassRequiredInitializationHasNotBeenExecutedError({
            className: "HTML_Validator",
            initializingMethodName: "initialize"
          }),
          title: ClassRequiredInitializationHasNotBeenExecutedError.localization.defaultTitle,
          occurrenceLocation: "HTML_Validator.getExpectedToBeInitializedSelfSingleInstance()"
        });
  }

}


namespace HTML_Validator {

  /* ━━━ Types ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* ─── Common ───────────────────────────────────────────────────────────────────────────────────────────────────── */
  export type Logging = Readonly<{
    validationStart: boolean;
    validationCompletionWithoutIssues: boolean;
  }>;


  /* ─── Initialization ───────────────────────────────────────────────────────────────────────────────────────────── */
  export type Requirements = Readonly<{
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
    temporaryFileDirectoryAbsolutePath: string;
    logging: Logging;
  }>;


  /* ─── Interim ──────────────────────────────────────────────────────────────────────────────────────────────────── */
  export type QueuedFileMetadata = Readonly<{
    originalHTML_FilePathRelativeToConsumingProjectRoot__forwardSlashesSeparatorsOnly: string;
    formattedHTML_Content: string;
    HTML_ContentMD5_Hash: string;
  }>;

  export type HTML_FilePathRelativeToConsumingProjectRoot__ForwardSlashesSeparatorsOnly = string;
  export type TemporaryFormattedHTML_FileEncodedURI = string;
  export type OriginalHTML_FilePathRelativeToConsumingProjectRoot__ForwardSlashesSeparatorsOnly = string;
  export type MD5_HashOfHTML_Content = string;


  /* ━━━ Raw Validations Results ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type RawValidationsResults = Readonly<{
    messages: ReadonlyArray<RawValidationResult>;
  }>;

  /**
   * @description
   * Third-party library dependent, unable to improve the properties names.
   * The "@types/vnu-jar" only declares the package existence but does not include the type definitions for validations
   *   results. */
  export type RawValidationResult = Readonly<{
    type: NormalizedValidationsResults.Issue.Types;
    url: string;
    lastLine?: number;
    lastColumn?: number;
    firstColumn?: number;
    subType?: NormalizedValidationsResults.Issue.SubTypes;
    message: string;
    extract?: string;
    hiliteStart?: number;
    hiliteLength?: number;
  }>;


  /* ━━━ Normalized Validations Results ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type CachedPastValidationsRawResults = {
    [filePathRelativeToConsumingProjectRootDirectory: string]: NormalizedValidationsResults.File;
  };

  export type NormalizedValidationsResults = Map<
    NormalizedValidationsResults.FilePathRelativeToConsumingProjectRootDirectory,
    NormalizedValidationsResults.File
  >;

  export namespace NormalizedValidationsResults {

    export type FilePathRelativeToConsumingProjectRootDirectory = string;

    export type File = {
      contentMD5Checksum: string;
      issues: Array<Issue>;
    };

    export type Issue = Readonly<{
      type: Issue.Types;
      subType?: Issue.SubTypes;
      message: string;
      lineNumber__numerationFrom1?: number;
      startingColumnNumber__numerationFrom1?: number;
      endingColumnNumber__numerationFrom1?: number;
      codeFragment?: Issue.CodeFragment;
    }>;

    export namespace Issue {

      export enum Types {
        info = "info",
        error = "error"
      }

      export enum SubTypes {
        warning = "warning",
        fatal = "fatal",
        io = "io",
        schema = "schema",
        internal = "internal"
      }

      export type CodeFragment = Readonly<{
        beforeHighlighting: string;
        highlighted: string;
        afterHighlighting: string;
      }>;

    }

  }

  export type Localization = Readonly<{

    cachedPreviousValidationsResultsDataRetrievingErrorLog:
        (templateVariables: Localization.CachedPreviousValidationsResultsDataRetrievingErrorLog.TemplateVariables) =>
            Localization.CachedPreviousValidationsResultsDataRetrievingErrorLog;

    validationStartedInfoLog: Localization.ValidationStartedInfoLog;

    validityIssuesDetectedErrorLog: Localization.ValidityIssuesDetectedErrorLog;

    validityIssuesDetectedToastNotification: Localization.ValidityIssuesDetectedToastNotification;

    validationFinishedWithoutIssuesSuccessLog: Localization.ValidationFinishedWithoutIssuesSuccessLog;

    generateIssueNumberLabel: (
      templateVariables: Localization.IssueNumberLabelGenerating.Template
    ) => string;

    generateIssueOccurrenceLocationIndication: (
      templateVariables: Localization.IssueOccurrenceLocationIndication.TemplateVariables
    ) => string;

    issuesTypesTitles: Localization.IssuesTypesTitles;

  }>;

  export namespace Localization {

    /* ─── Cached Previous Validations Data Retrieving Error Log ──────────────────────────────────────────────────── */
    export type CachedPreviousValidationsResultsDataRetrievingErrorLog = Readonly<Pick<Log, "title" | "description">>;

    export namespace CachedPreviousValidationsResultsDataRetrievingErrorLog {
      export type TemplateVariables = Readonly<{
        cachedValidationsResultsFileAbsolutePath: string;
      }>;
    }


    /* ─── Validation Started Info Log ────────────────────────────────────────────────────────────────────────────── */
    export type ValidationStartedInfoLog = Readonly<Pick<InfoLog, "title" | "description">>;


    /* ─── Validity Issues Detected Error Log ─────────────────────────────────────────────────────────────────────── */
    export type ValidityIssuesDetectedErrorLog = Readonly<
      Pick<ErrorLog, "title"> &
      {
        headings: Readonly<{
          summary: string;
          details: string;
        }>;
        generateSecondsElapsedSentence: (templateVariables: ValidityIssuesDetectedErrorLog.TemplateVariables) => string;
      }
    >;

    export namespace ValidityIssuesDetectedErrorLog {

      export type TemplateVariables = Readonly<{
        validationPeriod__seconds: number;
      }>;

    }


    /* ─── Validity Issues Detected Toast Notification ────────────────────────────────────────────────────────────── */
    export type ValidityIssuesDetectedToastNotification = Readonly<{
      title: string;
      message: string;
    }>;


    /* ─── Validation Finished Without Issues Success Log ─────────────────────────────────────────────────────────── */
    export type ValidationFinishedWithoutIssuesSuccessLog = Readonly<
      Pick<InfoLog, "title"> &
      {
        generateDescription: (templateVariables: ValidationFinishedWithoutIssuesSuccessLog.TemplateVariables) => string;
      }
    >;

    export namespace ValidationFinishedWithoutIssuesSuccessLog {

      export type TemplateVariables = Readonly<{
        validationPeriod__seconds: number;
        preFormattedErrorsMessages: string;
      }>;

    }

    export namespace IssueNumberLabelGenerating {
      export type Template = Readonly<{
        issueNumber: number;
      }>;
    }


    export namespace IssueOccurrenceLocationIndication {
      export type TemplateVariables = Readonly<{
        lineNumber: number;
        startingColumnNumber: number;
        lastColumnNumber: number;
      }>;
    }


    export type IssuesTypesTitles = Readonly<{
      grossViolation: string;
      recommendationDisregard: string;
      other: string;
    }>;

  }

}


export default HTML_Validator;


/* It is the only way to extract the child namespace (no need to expose whole AccessibilityInspector for the localization
 * packages). See https://stackoverflow.com/a/73400523/4818123 */
export import HTML_ValidatorLocalization = HTML_Validator.Localization;
