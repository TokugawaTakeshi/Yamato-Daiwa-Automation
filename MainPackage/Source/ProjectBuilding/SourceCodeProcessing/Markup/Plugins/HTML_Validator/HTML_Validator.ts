/* eslint-disable @typescript-eslint/member-ordering --
*  There is the processing order herewith some methods required the accessing to non-static fields, some - not. */

/* ━━━ Imports ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* ─── Assets ────────────────────────────────────────────────────────────────────────────────────────────────────── */
import HTML_ValidatorLocalization__english from "./HTML_ValidatorLocalization.english";

/* ─── Applied utils ─────────────────────────────────────────────────────────────────────────────────────────────── */
import { w3cHtmlValidator as HTML_ValidationService } from "w3c-html-validator";
import type {
  ValidatorResults as HTML_ValidationRawResults,
  ValidatorResultsMessage as HTML_ValidationRawIssue
} from "w3c-html-validator";

/* ─── Generals utils ────────────────────────────────────────────────────────────────────────────────────────────── */
import {
  RawObjectDataProcessor,
  Logger,
  DataRetrievingFailedError,
  AlgorithmMismatchError,
  ClassRequiredInitializationHasNotBeenExecutedError,
  UnexpectedEventError,
  filterMap,
  insertSubstring,
  toLowerCamelCase,
  secondsToMilliseconds,
  nullToUndefined,
  stringifyAndFormatArbitraryValue,
  splitString,
  cropArray,
  cropString,
  limitMinimalValue,
  limitMaximalValue,
  surroundLabelByOrnament
} from "@yamato-daiwa/es-extensions";
import type {
  Log,
  InfoLog,
  WarningLog,
  SuccessLog
} from "@yamato-daiwa/es-extensions";
import {
  ObjectDataFilesProcessor,
  FileNotFoundError,
  ImprovedPath,
  ImprovedFileSystem
} from "@yamato-daiwa/es-extensions-nodejs";
import Stopwatch from "@UtilsIncubator/Stopwatch";
import NativeToastMessageService from "node-notifier";
import FileSystem from "fs";


class HTML_Validator {

  /* ━━━ Fields ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private readonly relativePathsOfFilesWhichIsBeingValidated: Set<string> = new Set<string>();
  private readonly validationsInProgressForProductionLikeModes: Array<Promise<void>> = [];


  /* ─── Initialization ───────────────────────────────────────────────────────────────────────────────────────────── */
  private static selfSoleInstance: HTML_Validator | null = null;
  private static hasInitializationStarted: boolean = false;
  private static readonly onSelfSoleInstanceReadyEventsHandlers: Set<(selfSoleInstance: HTML_Validator) => void> = new Set();

  /* ─── Caching ──────────────────────────────────────────────────────────────────────────────────────────────────── */
  /* [ Theory ] The caching is very important optimization measure.
   *   Between 2 project buildings, most of HTML files could not change (especially since the project hase become mature).
   *   Without caching, many requests will be submitted to HTML validating service which will be the big performance
   *     impact and also "Too many requests" error risk when the files count is large. */

  private readonly CACHED_VALIDATIONS_RESULTS_FILE_PARENT_DIRECTORY_ABSOLUTE_PATH: string;
  private readonly CACHED_VALIDATIONS_RESULTS_FILE_ABSOLUTE_PATH: string;
  private readonly cachedValidationsResults: HTML_Validator.CachedValidationsResults;
  private readonly relativePathsOfFilesWhichHasBeenValidatedDuringCurrentExecution: Set<string> = new Set<string>();

  private static readonly cachedValidationsResultsFileContentSpecification: RawObjectDataProcessor.
      AssociativeArrayOfUniformValuesTypeDataSpecification =
  {
    nameForLogging: "HTML_Validator.CachedValidationResultsFileContentSpecification",
    subtype: RawObjectDataProcessor.ObjectSubtypes.associativeArray,
    value: {
      type: Object,
      properties: {
        contentMD5Checksum: {
          type: String,
          required: true
        },
        issues: {
          type: Array,
          required: true,
          element: {
            type: Object,
            properties: {
              type: {
                type: String,
                required: true,
                allowedAlternatives: [ "info", "error", "non-document-error", "network-error" ]
              },
              subType: {
                type: String,
                required: false,
                allowedAlternatives: [ "warning", "fatal", "io", "schema", "internal" ]
              },
              message: {
                type: String,
                required: true
              },
              lineNumber__numerationFrom1: {
                type: Number,
                numbersSet: RawObjectDataProcessor.NumbersSets.naturalNumber,
                required: true
              },
              startingColumnNumber__numerationFrom1: {
                type: Number,
                numbersSet: RawObjectDataProcessor.NumbersSets.nonNegativeInteger,
                required: true
              },
              endingColumnNumber__numerationFrom1: {
                type: Number,
                numbersSet: RawObjectDataProcessor.NumbersSets.nonNegativeInteger,
                required: true
              },
              codeFragment: {
                type: Object,
                required: true,
                properties: {
                  beforeHighlighting: {
                    type: String,
                    required: true
                  },
                  highlighted: {
                    type: String,
                    required: true
                  },
                  afterHighlighting: {
                    type: String,
                    required: true
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  private waitingForStaringOfWritingOfCacheFileWithValidationsResults: NodeJS.Timeout | null = null;
  private static readonly WAITING_FOR_STARING_OF_WRITING_OF_CACHE_FILE_WITH_VALIDATION_RESULTS_PERIOD__SECONDS: number = 1;


  /* ─── Logging ──────────────────────────────────────────────────────────────────────────────────────────────────── */
  private readonly logging: HTML_Validator.Logging;

  private static readonly DISPLAYING_LINES_COUNT_BEFORE_ISSUE_IN_CODE_LISTING: number = 2;
  private static readonly DISPLAYING_LINES_COUNT_AFTER_ISSUE_IN_CODE_LISTING: number = 1;

  /* [ Theory ] 120 columns is about the half of the 1920x1080 screen. */
  private static readonly DISPLAYING_MAXIMAL_COLUMNS_COUNT_IN_LOG: number = 120;

  /* [ Theory ] The toast notification of each invalid file could be bothersome; it should be the cooling down period. */
  private static readonly SUBSEQUENT_TOAST_NOTIFICATION_PROHIBITION_PERIOD__SECONDS: number = 5;
  private waitingForToastNotificationsWillBePermittedAgain: NodeJS.Timeout | null = null;
  private isToastNotificationPermitted: boolean = true;


  /* ─── Localization ─────────────────────────────────────────────────────────────────────────────────────────────── */
  public static localization: HTML_Validator.Localization = HTML_ValidatorLocalization__english;


  /* ━━━ Public static methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* ─── Initialization ───────────────────────────────────────────────────────────────────────────────────────────── */
  public static beginInitialization(configuration: HTML_Validator.Configuration): void {

    HTML_Validator.hasInitializationStarted = true;

    const cachedValidationsResultsFileAbsolutePath: string = ImprovedPath.joinPathSegments([
      configuration.cachedValidationsResultsFileParentDirectoryAbsolutePath,
      "HTML_Validation." +
          insertSubstring(
            configuration.projectBuildingSelectiveExecutionID,
            { modifier: (projectBuildingSelectiveExecutionID: string): string => `${ projectBuildingSelectiveExecutionID }.` }
          ) +
          `${ toLowerCamelCase(configuration.consumingProjectBuildingMode) }.json`
    ]);

    HTML_Validator.retrieveCachedPastValidationsResultsFromFileIfItExists({
      cachedValidationsResultsFileAbsolutePath,
      cachedValidationsResultsDirectoryAbsolutePath: configuration.cachedValidationsResultsFileParentDirectoryAbsolutePath
    }).

        then((cachedValidationsResults: HTML_Validator.CachedValidationsResults | null): void => {

          HTML_Validator.selfSoleInstance = new HTML_Validator({
            cachedValidationsResults,
            cachedValidationsResultsFileAbsolutePath,
            ...configuration
          });

          HTML_Validator.onSelfSoleInstanceReady(HTML_Validator.selfSoleInstance);

        }).

        catch((error: unknown): void => {

          if (__IS_DEVELOPMENT_BUILDING_MODE__) {
            Logger.logError({
              errorType: AlgorithmMismatchError.NAME,
              title: AlgorithmMismatchError.localization.defaultTitle,
              description: "The error has been caught during the execution of asynchronous method " +
                  "\"retrieveCachedInspectionsResultsFromFileIfItExists\", while expected that all errors " +
                  "has been handled inside this method.",
              occurrenceLocation: "AccessibilityInspector." +
                  "initializeAsynchronousRequirements(cachedValidationsResultsFileAbsolutePath)",
              caughtError: error
            });
          }

    });

  }


  /* ─── Validation ───────────────────────────────────────────────────────────────────────────────────────────────── */
  /** @description Designed for the modes with incremental building. */
  public static validateAtBackgroundAndReportImmideatlyWithoutThrowingOfErrors(
    singleFileHTML_ValidationOrder: HTML_Validator.SingleFileHTML_ValidationOrder
  ): void {

    HTML_Validator.getInstanceOnceReady().

        then(async (selfSoleInstance: HTML_Validator): Promise<void> => {

          clearTimeout(nullToUndefined(selfSoleInstance.waitingForStaringOfWritingOfCacheFileWithValidationsResults));

          return selfSoleInstance.validateSingleFile({
            ...singleFileHTML_ValidationOrder,
            mustLogIssuesImmideatlyAndSaveCacheToFileDuringDowntime: true
          });

        }).

        catch((error: unknown): void => {
          if (__IS_DEVELOPMENT_BUILDING_MODE__) {
            Logger.logError({
              errorType: AlgorithmMismatchError.NAME,
              title: AlgorithmMismatchError.localization.defaultTitle,
              description: "The error has been caught during the execution of asynchronous method \"validateSingleFile\", " +
                  "while expected that all errors has been handled inside this method.",
              occurrenceLocation: "HTML_Validator." +
                  "validateAtBackgroundAndReportImmideatlyWithoutThrowingOfErrors(singleFileHTML_ValidationOrder)",
              caughtError: error
            });
          }
        });

  }

  /** @description Designed for production-like modes. */
  public static validateAtBackgroundWithoutReporting(
    singleFileHTML_ValidationOrder: HTML_Validator.SingleFileHTML_ValidationOrder
  ): void {

    HTML_Validator.getInstanceOnceReady().

        then((selfSoleInstance: HTML_Validator): void => {
          selfSoleInstance.validationsInProgressForProductionLikeModes.push(
            selfSoleInstance.validateSingleFile({
              ...singleFileHTML_ValidationOrder,
              mustLogIssuesImmideatlyAndSaveCacheToFileDuringDowntime: false
            })
          );
        }).

        catch((error: unknown): void => {
          if (__IS_DEVELOPMENT_BUILDING_MODE__) {
            Logger.logError({
              errorType: AlgorithmMismatchError.NAME,
              title: AlgorithmMismatchError.localization.defaultTitle,
              description: "The error has been caught during the execution of asynchronous method \"validateSingleFile\", " +
                  "while expected that all errors has been handled inside this method.",
              occurrenceLocation: "HTML_Validator." +
                  "validateAtBackgroundAndReportImmideatlyWithoutThrowingOfErrors(singleFileHTML_ValidationOrder)",
              caughtError: error
            });
          }
        });

  }

  public static reportCachedValidationsResultsAndFinalize(): void {

    HTML_Validator.

        getInstanceOnceReady().

        then(async (selfSoleInstance: HTML_Validator): Promise<HTML_Validator> => {
          await Promise.all(selfSoleInstance.validationsInProgressForProductionLikeModes);
          return selfSoleInstance;
        }).

        then((selfSoleInstance: HTML_Validator): void => {

          const HTML_ValidityIssuesLogForEachFile: Array<string> = [];

          for (
            const [ filePathRelativeToConsumingProjectRootDirectory, cachedValidationResult ] of
                selfSoleInstance.cachedValidationsResults.entries()
          ) {
            if (cachedValidationResult.issues.length > 0) {
              HTML_ValidityIssuesLogForEachFile.push(
                surroundLabelByOrnament({
                  label: ` ${ filePathRelativeToConsumingProjectRootDirectory } `,
                  ornamentPatten: "─",
                  prependedPartCharactersCount: 3,
                  totalCharactersCount: HTML_Validator.DISPLAYING_MAXIMAL_COLUMNS_COUNT_IN_LOG
                }),
                HTML_Validator.formatValidationResultForSingleFile(cachedValidationResult.issues)
              );
            }
          }

          selfSoleInstance.writeCacheToFile();
          selfSoleInstance.cachedValidationsResults.clear();

          if (HTML_ValidityIssuesLogForEachFile.length === 0 && selfSoleInstance.logging.validationCompletionWithoutIssues) {
            Logger.logSuccess(HTML_Validator.localization.validationOfAllFilesHasFinishedWithNoIssuesFoundSuccessLog);
            return;
          }

          Logger.logErrorLikeMessage({
            title: HTML_Validator.localization.issuesFoundInOneOrMultipleFilesErrorLog.title,
            description: `\n${ HTML_ValidityIssuesLogForEachFile.join("\n") }`
          });

          Logger.throwErrorAndLog({
            errorType: "InvalidHTMLCode_Error",
            ...HTML_Validator.localization.issuesFoundInOneOrMultipleFilesErrorLog,
            occurrenceLocation: "HTML_Validator.reportCachedResultAndWriteItToFile"
          });

      }).

      catch((error: unknown): void => {

        if (error instanceof Error && error.name === "InvalidHTMLCode_Error") {
          throw error;
        }


        Logger.logError({
          errorType: UnexpectedEventError.NAME,
          title: UnexpectedEventError.localization.defaultTitle,
          description: "The error occurred during the HTML validation.",
          occurrenceLocation: "HTML_Validator.reportCachedResultAndWriteItToFile",
          caughtError: error
        });

      });

  }


  /* ━━━ Constructor ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private constructor(
    {
      cachedValidationsResults,
      cachedValidationsResultsFileParentDirectoryAbsolutePath,
      cachedValidationsResultsFileAbsolutePath,
      logging
    }: Readonly<{
      cachedValidationsResults?: HTML_Validator.CachedValidationsResults | null;
      cachedValidationsResultsFileParentDirectoryAbsolutePath: string;
      cachedValidationsResultsFileAbsolutePath: string;
      logging: HTML_Validator.Logging;
    }>
  ) {

    this.cachedValidationsResults = cachedValidationsResults ?? new Map<
      HTML_Validator.CachedValidationsResults.FilePathRelativeToConsumingProjectRootDirectory,
      HTML_Validator.CachedValidationsResults.File
    >();

    this.CACHED_VALIDATIONS_RESULTS_FILE_PARENT_DIRECTORY_ABSOLUTE_PATH = cachedValidationsResultsFileParentDirectoryAbsolutePath;
    this.CACHED_VALIDATIONS_RESULTS_FILE_ABSOLUTE_PATH = cachedValidationsResultsFileAbsolutePath;

    this.logging = logging;

  }


  /* ━━━ Private methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private async validateSingleFile(
    {
      targetHTML_FilePathRelativeToConsumingProjectRootDirectory,
      HTML_Code,
      HTML_CodeMD5Checksum,
      mustLogIssuesImmideatlyAndSaveCacheToFileDuringDowntime
    }:
        HTML_Validator.SingleFileHTML_ValidationOrder &
        Readonly<{
          mustLogIssuesImmideatlyAndSaveCacheToFileDuringDowntime: boolean;
        }>
  ): Promise<void> {

    const cachedValidationsResultsForCurrentFile: HTML_Validator.CachedValidationsResults.File | undefined =
        this.cachedValidationsResults.get(targetHTML_FilePathRelativeToConsumingProjectRootDirectory);

    if (cachedValidationsResultsForCurrentFile?.contentMD5Checksum === HTML_CodeMD5Checksum) {

      this.relativePathsOfFilesWhichHasBeenValidatedDuringCurrentExecution.
          add(targetHTML_FilePathRelativeToConsumingProjectRootDirectory);

      if (mustLogIssuesImmideatlyAndSaveCacheToFileDuringDowntime) {

        this.logValidationResultsForSingleFile({
          targetHTML_FilePathRelativeToConsumingProjectRootDirectory,
          normalizedValidationIssues: cachedValidationsResultsForCurrentFile.issues
        });

        /* [ Theory ] If the cache will be output one at a time, the files reading/writing error could occur. */
        if (this.relativePathsOfFilesWhichIsBeingValidated.size === 0) {
          this.waitingForStaringOfWritingOfCacheFileWithValidationsResults = setTimeout(
            this.writeCacheToFile.bind(this),
            secondsToMilliseconds(
              HTML_Validator.WAITING_FOR_STARING_OF_WRITING_OF_CACHE_FILE_WITH_VALIDATION_RESULTS_PERIOD__SECONDS
            )
          );
        }

      }

      return;

    }


    if (HTML_Code.trim().length === 0) {

      Logger.logWarning(
        HTML_Validator.localization.generateFileIsEmptyWarningLog({
          targetFileRelativePath: targetHTML_FilePathRelativeToConsumingProjectRootDirectory
        })
      );

      return;

    }


    if (this.logging.validationStart) {
      Logger.logInfo(
        HTML_Validator.localization.generateValidationStartedInfoLog({
          targetFileRelativePath: targetHTML_FilePathRelativeToConsumingProjectRootDirectory
        })
      );
    }

    const validationTimeMeasuringStopwatch: Stopwatch = new Stopwatch().startOrRestart();

    if (mustLogIssuesImmideatlyAndSaveCacheToFileDuringDowntime) {
      this.relativePathsOfFilesWhichIsBeingValidated.add(targetHTML_FilePathRelativeToConsumingProjectRootDirectory);
    }


    let validationRawResults: HTML_ValidationRawResults;

    try {

      validationRawResults = await HTML_ValidationService.validate({
        html: HTML_Code,
        output: "json"
      });

    } catch (error: unknown) {

      validationTimeMeasuringStopwatch.stop();

      if (mustLogIssuesImmideatlyAndSaveCacheToFileDuringDowntime) {
        this.relativePathsOfFilesWhichIsBeingValidated.delete(targetHTML_FilePathRelativeToConsumingProjectRootDirectory);
      }

      Logger.logError({
        errorType: DataRetrievingFailedError.localization.defaultTitle,
        ...HTML_Validator.localization.validationFailedErrorLog,
        occurrenceLocation: "htmlValidator.validateSingleFile(compoundParameter)",
        caughtError: error
      });

      return;

    }


    const validationPeriod__seconds: number = validationTimeMeasuringStopwatch.stop().seconds;
    const normalizedValidationIssues: Array<HTML_Validator.CachedValidationsResults.Issue> =
        HTML_Validator.normalizeValidationIssues(validationRawResults.messages ?? [], HTML_Code);

    this.cachedValidationsResults.set(
      targetHTML_FilePathRelativeToConsumingProjectRootDirectory,
      {
        contentMD5Checksum: HTML_CodeMD5Checksum,
        issues: normalizedValidationIssues
      }
    );

    this.relativePathsOfFilesWhichHasBeenValidatedDuringCurrentExecution.
        add(targetHTML_FilePathRelativeToConsumingProjectRootDirectory);

    if (!mustLogIssuesImmideatlyAndSaveCacheToFileDuringDowntime) {
      return;
    }


    this.relativePathsOfFilesWhichIsBeingValidated.delete(targetHTML_FilePathRelativeToConsumingProjectRootDirectory);

    /* [ Theory ] If the cache will be output one at a time, the files reading/writing error could occur. */
    if (this.relativePathsOfFilesWhichIsBeingValidated.size === 0) {
      this.waitingForStaringOfWritingOfCacheFileWithValidationsResults = setTimeout(
        this.writeCacheToFile.bind(this),
        secondsToMilliseconds(
          HTML_Validator.WAITING_FOR_STARING_OF_WRITING_OF_CACHE_FILE_WITH_VALIDATION_RESULTS_PERIOD__SECONDS
        )
      );
    }

    this.logValidationResultsForSingleFile({
      targetHTML_FilePathRelativeToConsumingProjectRootDirectory,
      normalizedValidationIssues,
      validationPeriod__seconds
    });

  }

  private static normalizeValidationIssues(
    rawValidationIssues: ReadonlyArray<HTML_ValidationRawIssue>,
    HTML_Code: string
  ): Array<HTML_Validator.CachedValidationsResults.Issue> {
    return rawValidationIssues.map(
      (rawValidationIssue: HTML_ValidationRawIssue): HTML_Validator.CachedValidationsResults.Issue => {

        const HTML_CodeSplitToLines: ReadonlyArray<string> = splitString(HTML_Code, "\n");

        /* [ W3C validator theory ] The HTML validating service marks only one line of code. */
        const lineNumberOfActualCodeFragment__numerationFrom1: number = rawValidationIssue.lastLine;
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


        /* [ Approach ] Although the W3C validator suggesting the "extract", "hiliteStart" and "hiliteLength" data
         *     for highlighting, here will be the improved highlighting with caching. */
        const numberOfStartingColumnOfHighlightedCodeFragment__numerationFrom1: number =
            /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition --
            * Although according to types for "w3c-html-validator" the `firstColumn` is the required property,
            *   experimentally has been known that it could be omitted. */
            rawValidationIssue?.firstColumn ?? rawValidationIssue.lastColumn;

        const numberOfEndingColumnOfHighlightedCodeFragment__numerationFrom1: number = rawValidationIssue.lastColumn;

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
            cropString({
              targetString: actualLineOfCode,
              startingCharacterNumber__numerationFrom1: 1,
              endingCharacterNumber__numerationFrom1: numberOfStartingColumnOfHighlightedCodeFragment__numerationFrom1 - 1,
              mustThrowErrorIfSpecifiedCharactersNumbersIsOutOfRange: false
            });

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
          type: rawValidationIssue.type,
          subType: rawValidationIssue.subType,
          message: rawValidationIssue.message,
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
    );
  }


  /* ─── Logging ──────────────────────────────────────────────────────────────────────────────────────────────────── */
  private logValidationResultsForSingleFile(
    {
      targetHTML_FilePathRelativeToConsumingProjectRootDirectory,
      normalizedValidationIssues,
      validationPeriod__seconds
    }: Readonly<{
      targetHTML_FilePathRelativeToConsumingProjectRootDirectory: string;
      normalizedValidationIssues: ReadonlyArray<HTML_Validator.CachedValidationsResults.Issue>;
      validationPeriod__seconds?: number;
    }>
  ): void {

    if (normalizedValidationIssues.length > 0) {

      Logger.logErrorLikeMessage(
        HTML_Validator.localization.generateIssuesFoundInSingleFileErrorLog({
          targetFileRelativePath: targetHTML_FilePathRelativeToConsumingProjectRootDirectory,
          formattedErrorsAndWarnings: HTML_Validator.formatValidationResultForSingleFile(normalizedValidationIssues)
        })
      );

      clearTimeout(nullToUndefined(this.waitingForToastNotificationsWillBePermittedAgain));

      if (this.isToastNotificationPermitted) {

        NativeToastMessageService.notify(HTML_Validator.localization.issuesFoundToastNotification);

        this.isToastNotificationPermitted = false;

        this.waitingForToastNotificationsWillBePermittedAgain = setTimeout(
          (): void => { this.isToastNotificationPermitted = true; },
          secondsToMilliseconds(HTML_Validator.SUBSEQUENT_TOAST_NOTIFICATION_PROHIBITION_PERIOD__SECONDS)
        );

      }

    }


    if (this.logging.validationCompletionWithoutIssues) {
      Logger.logSuccess(
        HTML_Validator.localization.generateValidationOfSingleFilesHasFinishedWithNoIssuesFoundSuccessLog({
          targetFileRelativePath: targetHTML_FilePathRelativeToConsumingProjectRootDirectory,
          secondsElapsed: validationPeriod__seconds
        })
      );
    }

  }

  private static formatValidationResultForSingleFile(
    issues: ReadonlyArray<HTML_Validator.CachedValidationsResults.Issue>
  ): string {

    const formattedIssues: Array<string> = [];

    for (const [ index, issue ] of issues.entries()) {

      /* [ Desired output example ]

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
            ornamentPatten: "=",
            prependedPartCharactersCount: 3,
            totalCharactersCount: HTML_Validator.DISPLAYING_MAXIMAL_COLUMNS_COUNT_IN_LOG
          })
        }\n`,

        issue.codeFragment.beforeHighlighting,
        Logger.highlightText(issue.codeFragment.highlighted),
        `${ issue.codeFragment.afterHighlighting }\n`,

        `${ "-".repeat(HTML_Validator.DISPLAYING_MAXIMAL_COLUMNS_COUNT_IN_LOG) }\n`,

        issue.message,
        ` (${
          ((): string => {
            switch (issue.type) {

              case HTML_Validator.CachedValidationsResults.Issue.Types.error:
                return HTML_Validator.localization.issuesTypesTitles.grossViolation;

              case HTML_Validator.CachedValidationsResults.Issue.Types.info:
                return HTML_Validator.localization.issuesTypesTitles.recommendationDisregard;

              default:
                return HTML_Validator.localization.issuesTypesTitles.other;

            }
          })()
        })\n`,
        HTML_Validator.localization.generateIssueOccurrenceLocationIndication({
          lineNumber: issue.lineNumber__numerationFrom1,
          startingColumnNumber: issue.startingColumnNumber__numerationFrom1,
          lastColumnNumber: issue.endingColumnNumber__numerationFrom1
        })

      ].join(""));

    }

    return formattedIssues.join("\n\n");

  }


  /* ─── Cache file ───────────────────────────────────────────────────────────────────────────────────────────────── */
  private static async retrieveCachedPastValidationsResultsFromFileIfItExists(
    {
      cachedValidationsResultsDirectoryAbsolutePath,
      cachedValidationsResultsFileAbsolutePath
    }: Readonly<{
      cachedValidationsResultsDirectoryAbsolutePath: string;
      cachedValidationsResultsFileAbsolutePath: string;
    }>
  ): Promise<HTML_Validator.CachedValidationsResults | null> {

    const isCachedValidationsResultsDirectoryExists: boolean = await ImprovedFileSystem.
        isFileOrDirectoryExists({ targetPath: cachedValidationsResultsDirectoryAbsolutePath, synchronously: false });

    /* [ Theory ] No need to create the directory now because it could be deleted manually any time after has been created. */
    if (!isCachedValidationsResultsDirectoryExists) {
      return null;
    }


    let cachedValidationResults: HTML_Validator.CachedPastValidationsRawResults;

    try {

      cachedValidationResults = await ObjectDataFilesProcessor.processFile<HTML_Validator.CachedPastValidationsRawResults>({
        filePath: cachedValidationsResultsFileAbsolutePath,
        validDataSpecification: HTML_Validator.cachedValidationsResultsFileContentSpecification,
        synchronously: false
      });

    } catch (error: unknown) {

      if (!(error instanceof FileNotFoundError) && __IS_DEVELOPMENT_BUILDING_MODE__) {
        Logger.logError({
          errorType: "CachedDataRetrievingFailure",
          title: "Cached data retrieving failure",
          description: `Unable to read the existing cache file "${ cachedValidationsResultsFileAbsolutePath }".`,
          occurrenceLocation: "HTML_Validator.retrieveCachedPastValidationsResultsFromFileIfItExists" +
              "(cachedValidationsResultsFileAbsolutePath)",
          caughtError: error
        });
      }

      return null;

    }


    return new Map(Object.entries(cachedValidationResults));

  }

  private writeCacheToFile(): void {

    ImprovedFileSystem.createDirectory({
      targetPath: this.CACHED_VALIDATIONS_RESULTS_FILE_PARENT_DIRECTORY_ABSOLUTE_PATH,
      mustThrowErrorIfTargetDirectoryExists: false,
      synchronously: true
    });


    const cachedValidationsResultsFileContent: HTML_Validator.CachedPastValidationsRawResults =
        Array.from(
          filterMap(
            this.cachedValidationsResults,
            (filePathRelativeToConsumingProjectRootDirectory: string): boolean =>
                this.relativePathsOfFilesWhichHasBeenValidatedDuringCurrentExecution.
                    has(filePathRelativeToConsumingProjectRootDirectory)
          ).entries()
        ).
        reduce(
            (
              accumulatingValue: HTML_Validator.CachedPastValidationsRawResults,
              [ filePathRelativeToConsumingProjectRootDirectory, cachedValidationRawResultsForSpecificFile ]:
                  [ string, HTML_Validator.CachedValidationsResults.File ]
            ): HTML_Validator.CachedPastValidationsRawResults => {
              accumulatingValue[filePathRelativeToConsumingProjectRootDirectory] = cachedValidationRawResultsForSpecificFile;
              return accumulatingValue;
            },
            {}
        );

    FileSystem.writeFileSync(
      this.CACHED_VALIDATIONS_RESULTS_FILE_ABSOLUTE_PATH,
      stringifyAndFormatArbitraryValue(cachedValidationsResultsFileContent)
    );

  }


  /* ─── Routines ─────────────────────────────────────────────────────────────────────────────────────────────────── */
  private static onSelfSoleInstanceReady(selfSoleInstance: HTML_Validator): void {

    for (const onSelfSoleInstanceReadyEventsHandler of HTML_Validator.onSelfSoleInstanceReadyEventsHandlers) {
      onSelfSoleInstanceReadyEventsHandler(selfSoleInstance);
    }

    HTML_Validator.onSelfSoleInstanceReadyEventsHandlers.clear();

  }

  private static async getInstanceOnceReady(): Promise<HTML_Validator> {

    if (!HTML_Validator.hasInitializationStarted) {
      Logger.throwErrorAndLog({
        errorInstance: new ClassRequiredInitializationHasNotBeenExecutedError({
          className: "AccessibilityInspector",
          initializingMethodName: "beginInitialization"
        }),
        title: ClassRequiredInitializationHasNotBeenExecutedError.localization.defaultTitle,
        occurrenceLocation: "AccessibilityInspector.getInstanceOnceReady()"
      });
    }


    return HTML_Validator.selfSoleInstance ??
        new Promise<HTML_Validator>((resolve: (htmlValidator: HTML_Validator) => void): void => {
          HTML_Validator.onSelfSoleInstanceReadyEventsHandlers.add(resolve);
        });

  }

}


namespace HTML_Validator {

  export type Configuration = Readonly<{
    cachedValidationsResultsFileParentDirectoryAbsolutePath: string;
    consumingProjectBuildingMode: string;
    projectBuildingSelectiveExecutionID?: string;
    logging: Logging;
  }>;

  export type Logging = Readonly<{
    validationStart: boolean;
    validationCompletionWithoutIssues: boolean;
  }>;

  export type SingleFileHTML_ValidationOrder = Readonly<{
    HTML_Code: string;
    HTML_CodeMD5Checksum: string;
    targetHTML_FilePathRelativeToConsumingProjectRootDirectory: string;
  }>;


  export type CachedPastValidationsRawResults = {
    [filePathRelativeToConsumingProjectRootDirectory: string]: CachedValidationsResults.File;
  };

  export type CachedValidationsResults = Map<
    CachedValidationsResults.FilePathRelativeToConsumingProjectRootDirectory,
    CachedValidationsResults.File
  >;

  export namespace CachedValidationsResults {

    export type FilePathRelativeToConsumingProjectRootDirectory = string;

    export type File = {
      contentMD5Checksum: string;
      issues: Array<Issue>;
    };

    export type Issue = Readonly<{
      type: "info" | "error" | "non-document-error";
      subType?: "warning" | "fatal" | "io" | "schema" | "internal";
      message: string;
      lineNumber__numerationFrom1: number;
      startingColumnNumber__numerationFrom1: number;
      endingColumnNumber__numerationFrom1: number;
      codeFragment: Readonly<{
        beforeHighlighting: string;
        highlighted: string;
        afterHighlighting: string;
      }>;
    }>;

    export namespace Issue {

      export enum Types {
        info = "info",
        error = "error",
        nonDocumentError = "non-document-error",
        networkError = "network-error"
      }

      export enum Subtypes {
        warning = "warning",
        fatal = "fatal",
        io = "io",
        schema = "schema",
        internal = "internal"
      }

    }

  }

  export type Localization = Readonly<{

    generateFileIsEmptyWarningLog: (templateVariables: Localization.FileIsEmptyWarningLog.TemplateVariables) =>
        Localization.FileIsEmptyWarningLog;

    generateValidationStartedInfoLog: (templateVariables: Localization.ValidationStartedInfoLog.TemplateVariables) =>
        Localization.ValidationStartedInfoLog;

    validationFailedErrorLog: Localization.ValidationFailedErrorLog;

    generateValidationOfSingleFilesHasFinishedWithNoIssuesFoundSuccessLog: (
      templateVariables: Localization.ValidationOfSingleFileHasFinishedWithNoIssuesFoundSuccessLog.TemplateVariables
    ) => Localization.ValidationOfSingleFileHasFinishedWithNoIssuesFoundSuccessLog;

    generateIssuesFoundInSingleFileErrorLog: (
      templateVariables: Localization.IssuesFoundInSingleFileErrorLog.TemplateVariables
    ) => Localization.IssuesFoundInSingleFileErrorLog;

    validationOfAllFilesHasFinishedWithNoIssuesFoundSuccessLog: Localization.
        ValidationOfAllFilesHasFinishedWithNoIssuesFoundSuccessLog;

    issuesFoundToastNotification: Localization.IssuesFoundToastNotification;

    generateIssueNumberLabel: (
      templateVariables: Localization.IssueNumberLabelGenerating.Template
    ) => string;

    generateIssueOccurrenceLocationIndication: (
      templateVariables: Localization.IssueOccurrenceLocationIndication.TemplateVariables
    ) => string;

    issuesTypesTitles: Localization.IssuesTypesTitles;

    issuesFoundInOneOrMultipleFilesErrorLog: Localization.IssuesFoundInOneOrMultipleFilesErrorLog;

  }>;

  export namespace Localization {

    export type FileIsEmptyWarningLog = Readonly<Pick<WarningLog, "title" | "description">>;

    export namespace FileIsEmptyWarningLog {
      export type TemplateVariables = Readonly<{ targetFileRelativePath: string; }>;
    }


    export type ValidationStartedInfoLog = Readonly<Pick<InfoLog, "title" | "description">>;

    export namespace ValidationStartedInfoLog {
      export type TemplateVariables = Readonly<{ targetFileRelativePath: string; }>;
    }


    export type ValidationFailedErrorLog = Readonly<Pick<Log, "title" | "description">>;


    export type ValidationOfSingleFileHasFinishedWithNoIssuesFoundSuccessLog =
        Readonly<Pick<SuccessLog, "title" | "description">>;

    export namespace ValidationOfSingleFileHasFinishedWithNoIssuesFoundSuccessLog {
      export type TemplateVariables = Readonly<{
        targetFileRelativePath: string;
        secondsElapsed?: number;
      }>;
    }


    export type IssuesFoundInSingleFileErrorLog = Readonly<Required<Pick<Log, "title" | "description">>>;

    export namespace IssuesFoundInSingleFileErrorLog {
      export type TemplateVariables = Readonly<{
        targetFileRelativePath: string;
        formattedErrorsAndWarnings: string;
      }>;
    }


    export type ValidationOfAllFilesHasFinishedWithNoIssuesFoundSuccessLog = Readonly<Pick<SuccessLog, "title" | "description">>;


    export type IssuesFoundToastNotification = Readonly<{ title: string; message: string; }>;


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


    export type IssuesFoundInOneOrMultipleFilesErrorLog = Readonly<Required<Pick<Log, "title" | "description">>>;

  }
}


export default HTML_Validator;

/* eslint-disable-next-line @typescript-eslint/no-unused-vars --
* It is the only way to extract the child namespace (no need to expose whole HTML_Validator for the localization packages).
* https://stackoverflow.com/a/73400523/4818123 */
export import HTML_ValidatorLocalization = HTML_Validator.Localization;
