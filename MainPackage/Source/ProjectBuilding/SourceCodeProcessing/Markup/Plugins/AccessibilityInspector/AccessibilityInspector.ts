/* eslint-disable @typescript-eslint/member-ordering --
 *  There is the processing order herewith some methods required the accessing to non-static fields, some - not. */

/* ━━━ Imports ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* ─── Restrictions ──────────────────────────────────────────────────────────────────────────────────────────────── */
import type MarkupProcessingRestrictions from "@MarkupProcessing/MarkupProcessingRestrictions";

/* ─── Assets ────────────────────────────────────────────────────────────────────────────────────────────────────── */
import accessibilityInspectorLocalization__english from "./AccessibilityInspectorLocalization.english";

/* ─── Applied utils ─────────────────────────────────────────────────────────────────────────────────────────────── */
import inspectAccessibility from "pa11y";
import WebBrowserProvider from "puppeteer";
import type { Browser as WebBrowser, Page as WebBrowserPage } from "puppeteer";

/* ─── Generals utils ────────────────────────────────────────────────────────────────────────────────────────────── */
import {
  RawObjectDataProcessor,
  Logger,
  DataRetrievingFailedError,
  AlgorithmMismatchError,
  ClassRequiredInitializationHasNotBeenExecutedError,
  UnexpectedEventError,
  filterMap,
  getIndexOfArrayElementSatisfiesThePredicateIfSuchElementIsExactlyOne,
  insertSubstring,
  toLowerCamelCase,
  secondsToMilliseconds,
  cropArray,
  cropString,
  nullToUndefined,
  stringifyAndFormatArbitraryValue,
  isNonEmptyString,
  isNotUndefined,
  isNull,
  isNotNull,
  splitString,
  surroundLabelByOrnament,
  limitMinimalValue,
  limitMaximalValue
} from "@yamato-daiwa/es-extensions";
import type {
  Log,
  InfoLog,
  WarningLog,
  SuccessLog,
  ErrorLog
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
import { parse as parseHTML } from "node-html-parser";
import type { HTMLElement } from "node-html-parser";


class AccessibilityInspector {

  /* ━━━ Fields ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* [ Theory ] There is no library checking the accessibility by the raw HTML code (not by paths of the HTML files or URI)
   *    while the checking of the HTML code is exactly what is required to inspect the accessibility on fly inside the
   *    Gulp pipelines. The solution is the combination of `pa11y` and `puppeteer` with the certain options. */
  private readonly webBrowser: WebBrowser;
  private readonly relativePathsOfFilesWhichIsBeingInspected: Set<string> = new Set<string>();
  private readonly inspectionsInProgressForProductionLikeModes: Array<Promise<void>> = [];


  /* ─── Initialization ───────────────────────────────────────────────────────────────────────────────────────────── */
  private static selfSoleInstance: AccessibilityInspector | null = null;
  private static hasInitializationStarted: boolean = false;
  private static hasInitializationFailed: boolean = false;
  private static readonly onSelfSoleInstanceReadyEventsHandlers: Set<(selfSoleInstance: AccessibilityInspector) => void> =
      new Set();


  /* ─── Caching ──────────────────────────────────────────────────────────────────────────────────────────────────── */
  /* [ Theory ] The caching is very important optimization measure.
   *   Between 2 project buildings, most of HTML files could not change (especially since the project hase become mature).
   *   Without caching, many requests will be submitted to the accessibility checking service which will be the big
   *   performance impact and also "Too many requests" error risk when the files count is large. */

  private readonly CACHED_INSPECTIONS_RESULTS_FILE_DIRECTORY_ABSOLUTE_PATH: string;
  private readonly CACHED_INSPECTIONS_RESULTS_FILE_ABSOLUTE_PATH: string;
  private readonly cachedInspectionsResults: AccessibilityInspector.CachedInspectionsResults;
  private readonly relativePathsOfFilesWhichHasBeenInspectedCurrentDuringExecution: Set<string> = new Set<string>();

  private static readonly cachedInspectionsResultsFileContentSpecification: RawObjectDataProcessor.
      AssociativeArrayTypeDataSpecification =
          {
            nameForLogging: "AccessibilityInspector.CachedInspectionResultsFileContentSpecification",
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
                      ID: {
                        type: String,
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
                      },
                      message: {
                        type: String,
                        isUndefinedForbidden: true,
                        isNullForbidden: true
                      }
                    }
                  }
                }
              }
            }
          };

  private waitingForStaringOfWritingOfCacheFileWithInspectionsResults: NodeJS.Timeout | null = null;
  private static readonly WAITING_FOR_STARING_OF_WRITING_OF_CACHE_FILE_WITH_VALIDATION_RESULTS_PERIOD__SECONDS: number = 1;


  /* ─── Logging ──────────────────────────────────────────────────────────────────────────────────────────────────── */
  private readonly logging: AccessibilityInspector.Logging;

  private static readonly DISPLAYING_LINES_COUNT_BEFORE_ISSUE_IN_CODE_LISTING: number = 2;
  private static readonly DISPLAYING_LINES_COUNT_AFTER_ISSUE_IN_CODE_LISTING: number = 1;

  /* [ Theory ] 120 columns is about the half of the 1920x1080 screen. */
  private static readonly DISPLAYING_MAXIMAL_COLUMNS_COUNT_IN_LOG: number = 120;

  /* [ Theory ] The toast notification of each invalid file could be bothersome; it should be the cooling down period. */
  private static readonly SUBSEQUENT_TOAST_NOTIFICATION_PROHIBITION_PERIOD__SECONDS: number = 5;
  private waitingForToastNotificationsWillBePermittedAgain: NodeJS.Timeout | null = null;
  private isToastNotificationPermitted: boolean = true;


  /* ─── Localization ─────────────────────────────────────────────────────────────────────────────────────────────── */
  public static localization: AccessibilityInspector.Localization = accessibilityInspectorLocalization__english;


  /* ━━━ Public static methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* ─── Initialization ───────────────────────────────────────────────────────────────────────────────────────────── */

  /* [ Specification ] Could not be async because intended to be used ini non-async methods. */
  public static beginInitialization(configuration: AccessibilityInspector.Configuration): void {

    AccessibilityInspector.hasInitializationStarted = true;

    const cachedInspectionResultsFileAbsolutePath: string = ImprovedPath.joinPathSegments([
      configuration.cachedInspectionsResultsFileParentDirectoryAbsolutePath,
      "AccessibilityInspection." +
          insertSubstring(
            configuration.projectBuildingSelectiveExecutionID,
            { modifier: (projectBuildingSelectiveExecutionID: string): string => `${ projectBuildingSelectiveExecutionID }.` }
          ) +
          toLowerCamelCase(configuration.consumingProjectBuildingMode) +
          ".json"
    ]);

    AccessibilityInspector.initializeAsynchronousRequirements({
      cachedInspectionResultsFileAbsolutePath,
      cachedInspectionsResultsDirectoryAbsolutePath: configuration.cachedInspectionsResultsFileParentDirectoryAbsolutePath
    }).

        then((asynchronousRequirements: AccessibilityInspector.InitializationAsynchronousRequirements): void => {

          AccessibilityInspector.selfSoleInstance = new AccessibilityInspector({
            ...asynchronousRequirements,
            cachedInspectionResultsFileAbsolutePath,
            ...configuration
          });

          AccessibilityInspector.onSelfSoleInstanceReady(AccessibilityInspector.selfSoleInstance);

        }).

        catch((error: unknown): void => {

          AccessibilityInspector.hasInitializationFailed = true;

          Logger.logError({
            errorType: AlgorithmMismatchError.NAME,
            title: AlgorithmMismatchError.localization.defaultTitle,
            description: "The error has occurred during the asynchronous initialization.",
            occurrenceLocation: "HTML_Validator.beginInitialization(configuration)",
            caughtError: error
          });

        });

  }


  /* ─── Inspection ───────────────────────────────────────────────────────────────────────────────────────────────── */
  /** @description Designed for the modes with incremental building. */
  public static inspectAtBackgroundAndReportImmediatelyWithoutThrowingOfErrors(
    singleFileAccessibilityCheckingOrder: AccessibilityInspector.SingleFileAccessibilityCheckingOrder
  ): void {

    AccessibilityInspector.getInstanceOnceReady().

        then(async (selfSoleInstance: AccessibilityInspector): Promise<void> => {

          clearTimeout(nullToUndefined(selfSoleInstance.waitingForStaringOfWritingOfCacheFileWithInspectionsResults));

          return selfSoleInstance.inspectSingleFile({
            ...singleFileAccessibilityCheckingOrder,
            mustLogIssuesImmediatelyAndSaveCacheToFileDuringDowntime: true
          });

        }).

        catch((error: unknown): void => {
          if (__IS_DEVELOPMENT_BUILDING_MODE__) {
            Logger.logError({
              errorType: AlgorithmMismatchError.NAME,
              title: AlgorithmMismatchError.localization.defaultTitle,
              description: "The error has been caught during the execution of asynchronous method \"inspectSingleFile\", " +
                  "while expected that all errors has been handled inside this method.",
              occurrenceLocation: "AccessibilityInspector." +
                  "inspectAtBackgroundAndReportImmediatelyWithoutThrowingOfErrors(singleFileAccessibilityCheckingOrder)",
              caughtError: error
            });
          }
        });

  }

  /** @description Designed for production-like modes. */
  public static inspectAtBackgroundWithoutReporting(
    singleFileAccessibilityCheckingOrder: AccessibilityInspector.SingleFileAccessibilityCheckingOrder
  ): void {

    AccessibilityInspector.getInstanceOnceReady().

        then((selfSoleInstance: AccessibilityInspector): void => {
          selfSoleInstance.inspectionsInProgressForProductionLikeModes.push(
            selfSoleInstance.inspectSingleFile({
              ...singleFileAccessibilityCheckingOrder,
              mustLogIssuesImmediatelyAndSaveCacheToFileDuringDowntime: false
            })
          );
        }).

        catch((error: unknown): void => {
          if (__IS_DEVELOPMENT_BUILDING_MODE__) {
            Logger.logError({
              errorType: AlgorithmMismatchError.NAME,
              title: AlgorithmMismatchError.localization.defaultTitle,
              description: "The error has been caught during the execution of asynchronous method \"inspectSingleFile\", " +
                  "while expected that all errors has been handled inside this method.",
              occurrenceLocation: "AccessibilityInspector." +
                  "inspectAtBackgroundWithoutReporting(singleFileAccessibilityCheckingOrder)",
              caughtError: error
            });
          }
        });

  }

  public static reportCachedValidationsResultsAndFinalize(): void {

    AccessibilityInspector.

        getInstanceOnceReady().

        then(async (selfSoleInstance: AccessibilityInspector): Promise<AccessibilityInspector> => {
          await Promise.all(selfSoleInstance.inspectionsInProgressForProductionLikeModes);
          return selfSoleInstance;
        }).

        then((selfSoleInstance: AccessibilityInspector): void => {

          const accessibilityIssuesLogForEachFile: Array<string> = [];

          for (
            const [ filePathRelativeToConsumingProjectRootDirectory, cachedInspectionResult ] of
              selfSoleInstance.cachedInspectionsResults.entries()
          ) {
            if (cachedInspectionResult.issues.length > 0) {
              accessibilityIssuesLogForEachFile.push(
                surroundLabelByOrnament({
                  label: ` ${ filePathRelativeToConsumingProjectRootDirectory } `,
                  ornamentPatten: "─",
                  prependedPartCharactersCount: 3,
                  totalCharactersCount: AccessibilityInspector.DISPLAYING_MAXIMAL_COLUMNS_COUNT_IN_LOG
                }),
                AccessibilityInspector.formatInspectionResultForSingleFile(cachedInspectionResult.issues)
              );
            }
          }

          selfSoleInstance.writeCacheToFile();
          selfSoleInstance.cachedInspectionsResults.clear();

          selfSoleInstance.webBrowser.
              close().
              catch((error: unknown): void => {
                if (__IS_DEVELOPMENT_BUILDING_MODE__) {
                  Logger.logError({
                    errorType: UnexpectedEventError.NAME,
                    title: UnexpectedEventError.localization.defaultTitle,
                    description: "The error has occurred during the asynchronous closing of the \"Puppeteer\" web browser.",
                    occurrenceLocation: "AccessibilityInspector.reportCachedValidationsResultsAndFinalize()",
                    caughtError: error
                  });
                }
              });

          if (accessibilityIssuesLogForEachFile.length === 0 && selfSoleInstance.logging.inspectionCompletionWithoutIssues) {
            Logger.logSuccess(AccessibilityInspector.localization.inspectionOfAllFilesHasFinishedWithNoIssuesFoundSuccessLog);
            return;
          }

          Logger.logErrorLikeMessage({
            title: AccessibilityInspector.localization.issuesFoundInOneOrMultipleFilesErrorLog.title,
            description: `\n${ accessibilityIssuesLogForEachFile.join("\n") }`
          });

          Logger.throwErrorAndLog({
            errorType: "AccessibilityIssuesFoundError",
            ...AccessibilityInspector.localization.issuesFoundInOneOrMultipleFilesErrorLog,
            occurrenceLocation: "AccessibilityInspector.reportCachedValidationsResultsAndFinalize"
          });

        }).

        catch((error: unknown): void => {

          if (error instanceof Error && error.name === "AccessibilityIssuesFoundError") {
            throw error;
          }


          Logger.logError({
            errorType: UnexpectedEventError.NAME,
            title: UnexpectedEventError.localization.defaultTitle,
            description: "The error occurred during the HTML accessibility inspection.",
            occurrenceLocation: "AccessibilityInspector.reportCachedValidationsResultsAndFinalize",
            caughtError: error
          });

        });

  }


  /* ━━━ Constructor ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private constructor(
    {
      cachedInspectionsResults,
      cachedInspectionsResultsFileParentDirectoryAbsolutePath,
      cachedInspectionResultsFileAbsolutePath,
      webBrowser,
      logging
    }: Readonly<{
      cachedInspectionsResults?: AccessibilityInspector.CachedInspectionsResults;
      cachedInspectionsResultsFileParentDirectoryAbsolutePath: string;
      cachedInspectionResultsFileAbsolutePath: string;
      webBrowser: WebBrowser;
      logging: AccessibilityInspector.Logging;
    }>
  ) {

    this.cachedInspectionsResults = cachedInspectionsResults ?? new Map<
      AccessibilityInspector.CachedInspectionsResults.FilePathRelativeToConsumingProjectRootDirectory,
      AccessibilityInspector.CachedInspectionsResults.File
    >();

    this.CACHED_INSPECTIONS_RESULTS_FILE_DIRECTORY_ABSOLUTE_PATH = cachedInspectionsResultsFileParentDirectoryAbsolutePath;
    this.CACHED_INSPECTIONS_RESULTS_FILE_ABSOLUTE_PATH = cachedInspectionResultsFileAbsolutePath;

    this.webBrowser = webBrowser;

    this.logging = logging;

  }


  /* ━━━ Private methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private async inspectSingleFile(
    {
      HTML_Code,
      HTML_CodeMD5Checksum,
      targetHTML_FilePathRelativeToConsumingProjectRootDirectory,
      accessibilityStandard,
      mustLogIssuesImmediatelyAndSaveCacheToFileDuringDowntime
    }:
        AccessibilityInspector.SingleFileAccessibilityCheckingOrder &
        Readonly<{
          mustLogIssuesImmediatelyAndSaveCacheToFileDuringDowntime: boolean;
        }>
  ): Promise<void> {

    const cachedInspectionsResultsForCurrentFile: AccessibilityInspector.CachedInspectionsResults.File | undefined =
        this.cachedInspectionsResults.get(targetHTML_FilePathRelativeToConsumingProjectRootDirectory);

    if (cachedInspectionsResultsForCurrentFile?.contentMD5Checksum === HTML_CodeMD5Checksum) {

      this.relativePathsOfFilesWhichHasBeenInspectedCurrentDuringExecution.
          add(targetHTML_FilePathRelativeToConsumingProjectRootDirectory);

      if (mustLogIssuesImmediatelyAndSaveCacheToFileDuringDowntime) {

        this.logInspectionResultsForSingleFile({
          targetHTML_FilePathRelativeToConsumingProjectRootDirectory,
          normalizedInspectionIssues: cachedInspectionsResultsForCurrentFile.issues
        });

        /* [ Theory ] If the cache will be output one at a time, the files reading/writing error could occur. */
        if (this.relativePathsOfFilesWhichIsBeingInspected.size === 0) {
          this.waitingForStaringOfWritingOfCacheFileWithInspectionsResults = setTimeout(
            this.writeCacheToFile.bind(this),
            secondsToMilliseconds(
              AccessibilityInspector.WAITING_FOR_STARING_OF_WRITING_OF_CACHE_FILE_WITH_VALIDATION_RESULTS_PERIOD__SECONDS
            )
          );
        }

      }

      return;

    }


    if (HTML_Code.trim().length === 0) {

      Logger.logWarning(
        AccessibilityInspector.localization.generateFileIsEmptyWarningLog({
          targetFileRelativePath: targetHTML_FilePathRelativeToConsumingProjectRootDirectory
        })
      );

      return;

    }


    if (this.logging.inspectionStart) {
      Logger.logInfo(
        AccessibilityInspector.localization.generateInspectionStartedInfoLog({
          targetFileRelativePath: targetHTML_FilePathRelativeToConsumingProjectRootDirectory
        })
      );
    }

    const inspectionTimeMeasuringStopwatch: Stopwatch = new Stopwatch().startOrRestart();

    if (mustLogIssuesImmediatelyAndSaveCacheToFileDuringDowntime) {
      this.relativePathsOfFilesWhichIsBeingInspected.add(targetHTML_FilePathRelativeToConsumingProjectRootDirectory);
    }


    let webBrowserPage: WebBrowserPage;

    try {

      webBrowserPage = await this.webBrowser.newPage();

    } catch (error: unknown) {

      inspectionTimeMeasuringStopwatch.stop();

      Logger.logError({
        errorType: "WebBrowserPageCreatingFailedError",
        title: "Web browser page creating failed",
        description:
            "The error has occurred during the asynchronous creating of the \"Puppeteer\" browser web page for the file " +
              `"${ targetHTML_FilePathRelativeToConsumingProjectRootDirectory }". ` +
            "It makes impossible the accessibility inspection for this file.",
        occurrenceLocation: "AccessibilityInspector.inspectSingleFile(singleFileAccessibilityCheckingOrder)",
        caughtError: error
      });

      if (mustLogIssuesImmediatelyAndSaveCacheToFileDuringDowntime) {
        this.relativePathsOfFilesWhichIsBeingInspected.delete(targetHTML_FilePathRelativeToConsumingProjectRootDirectory);
      }

      return;

    }


    try {

      await webBrowserPage.setContent(HTML_Code, { waitUntil: "domcontentloaded" });

    } catch (error: unknown) {

      inspectionTimeMeasuringStopwatch.stop();

      Logger.logError({
        errorType: "WebBrowserPageContentUpdatingFailedError",
        title: "Web browser pade content updating failed",
        description:
            "The error has occurred during the changing of the web page content to the content of the file " +
            `"${ targetHTML_FilePathRelativeToConsumingProjectRootDirectory }". ` +
            "It makes impossible the accessibility inspection for this file.",
        occurrenceLocation: "AccessibilityInspector.inspectSingleFile(singleFileAccessibilityCheckingOrder)",
        caughtError: error
      });

      if (mustLogIssuesImmediatelyAndSaveCacheToFileDuringDowntime) {
        this.relativePathsOfFilesWhichIsBeingInspected.delete(targetHTML_FilePathRelativeToConsumingProjectRootDirectory);
      }

      return;

    }


    let inspectionRawResults: AccessibilityInspector.InspectionRawResults;

    try {

      inspectionRawResults = await inspectAccessibility(
        webBrowserPage.url(),
        {

          standard: accessibilityStandard,

          page: webBrowserPage,
          browser: this.webBrowser,

          /* [ Reference ] https://stackoverflow.com/a/76537290/4818123 */
          ignoreUrl: true,

          ignore: [

            /* [ Specification ]
             * Being the part of markup processing functionality, the AccessibilityInspector indented to be used only for
             *   inspection of the accessibility of HTML code. The issues like contract ratio could not be simply fixed
             *   because requires the involving of designer and/or customer.. */
            "WCAG2AAA.Principle1.Guideline1_4.1_4_6.G17.Fail"

          ]

        }
      );

    } catch (error: unknown) {

      inspectionTimeMeasuringStopwatch.stop();

      Logger.logError({
        errorType: DataRetrievingFailedError.localization.defaultTitle,
        ...AccessibilityInspector.localization.inspectionFailedErrorLog,
        occurrenceLocation: "AccessibilityInspector.inspectSingleFile(singleFileAccessibilityCheckingOrder)",
        caughtError: error
      });

      if (mustLogIssuesImmediatelyAndSaveCacheToFileDuringDowntime) {
        this.relativePathsOfFilesWhichIsBeingInspected.delete(targetHTML_FilePathRelativeToConsumingProjectRootDirectory);
      }

      webBrowserPage.close().catch((potentialWebBrowserPageClosingError: unknown): void => {

        if (__IS_DEVELOPMENT_BUILDING_MODE__) {
          Logger.logError({
            errorType: "WebBrowserPageClosingFailedError",
            description:
                "The error has occurred during the closing of \"puppeteer\" web page with content of the file " +
                `"${ targetHTML_FilePathRelativeToConsumingProjectRootDirectory }". ` +
                "It already does not affect to the accessibility checking but needs the attention.",
            title: "Web browser page closing failed",
            occurrenceLocation: "AccessibilityInspector.inspectSingleFile(singleFileAccessibilityCheckingOrder)",
            caughtError: potentialWebBrowserPageClosingError
          });
        }

      });

      return;

    }


    const inspectionPeriod__seconds: number = inspectionTimeMeasuringStopwatch.stop().seconds;

    const normalizedInspectionIssues: Array<AccessibilityInspector.CachedInspectionsResults.Issue> =
        AccessibilityInspector.normalizeInspectionIssues(inspectionRawResults.issues, HTML_Code);

    this.cachedInspectionsResults.set(
      targetHTML_FilePathRelativeToConsumingProjectRootDirectory,
      {
        contentMD5Checksum: HTML_CodeMD5Checksum,
        issues: normalizedInspectionIssues
      }
    );

    this.relativePathsOfFilesWhichHasBeenInspectedCurrentDuringExecution.
        add(targetHTML_FilePathRelativeToConsumingProjectRootDirectory);

    if (!mustLogIssuesImmediatelyAndSaveCacheToFileDuringDowntime) {
      return;
    }


    this.relativePathsOfFilesWhichIsBeingInspected.delete(targetHTML_FilePathRelativeToConsumingProjectRootDirectory);

    /* [ Theory ] If the cache will be output one at a time, the files reading/writing error could occur. */
    if (this.relativePathsOfFilesWhichIsBeingInspected.size === 0) {
      this.waitingForStaringOfWritingOfCacheFileWithInspectionsResults = setTimeout(
        this.writeCacheToFile.bind(this),
        secondsToMilliseconds(
          AccessibilityInspector.WAITING_FOR_STARING_OF_WRITING_OF_CACHE_FILE_WITH_VALIDATION_RESULTS_PERIOD__SECONDS
        )
      );
    }

    this.logInspectionResultsForSingleFile({
      targetHTML_FilePathRelativeToConsumingProjectRootDirectory,
      normalizedInspectionIssues,
      inspectionPeriod__seconds
    });

  }

  private static normalizeInspectionIssues(
    rawInspectionIssues: ReadonlyArray<AccessibilityInspector.RawInspectionResults.Issue>,
    HTML_Code: string
  ): Array<AccessibilityInspector.CachedInspectionsResults.Issue> {

    const normalizedInspectionIssues: Array<AccessibilityInspector.CachedInspectionsResults.Issue> = [];

    /* [ `pa11y` theory ] ※
     *  The `pa11y` does not specify the line number and the columns range for each issue.
     *  Just the `AccessibilityInspector.RawInspectionResults.Issue.context` (bad naming, but it includes the outer HTML
     *    of the issued element) and `indexOf` method is not enough to compute the line number and the columns range
     *    because there are duplicated fragments could be.
     * Also, neither `HTML_Code` nor `parsedHTML` could include the `AccessibilityInspector.RawInspectionResults.Issue.context`!
     * For example, the `<div class="NewsFeed"></div><a><span></span><a>Foo<div></div><a>bar</a></a>` does not include
     *    `<a><span></span></a>`, while `pa11y` make it to `context`.
     * */
    const parsedHTML: HTMLElement = parseHTML(HTML_Code);

    for (const [ index, rawInspectionIssue ] of rawInspectionIssues.entries()) {

      const targetElement: HTMLElement | null = parsedHTML.querySelector(rawInspectionIssue.selector);

      /* [ `pa11y` theory ] Is it `pa11y`'s bug or not, but the `null` is possible.
       *    For example, `html > body > main > h1:nth-child(7)` has failed to pick the element for the pa11y@6.2.3. */
      if (isNull(targetElement)) {
        continue;
      }


      targetElement.setAttribute(AccessibilityInspector.generateAccessibilityIssueAuxiliaryHTML_Attribute(index), "");

    }

    const rawHTML_CodeSplitToLines: ReadonlyArray<string> = splitString(HTML_Code, "\n");
    const parsedHTML_CodeSplitToLines: ReadonlyArray<string> = splitString(parsedHTML.outerHTML, "\n");

    for (const [ index, rawInspectionIssue ] of rawInspectionIssues.entries()) {

      const HTML_AttributeForTheLineNumberDetecting: string = AccessibilityInspector.
          generateAccessibilityIssueAuxiliaryHTML_Attribute(index);

      const lineNumberOfActualCodeFragment__numerationFrom0: number | null =
          getIndexOfArrayElementSatisfiesThePredicateIfSuchElementIsExactlyOne(
            parsedHTML_CodeSplitToLines,
            (HTML_CodeLine: string): boolean => HTML_CodeLine.includes(HTML_AttributeForTheLineNumberDetecting)
          );

      if (isNull(lineNumberOfActualCodeFragment__numerationFrom0)) {

        normalizedInspectionIssues.push({
          ID: rawInspectionIssue.code,
          message: rawInspectionIssue.message,
          codeFragment: {
            beforeHighlighting: "",
            highlighted: rawInspectionIssue.context,
            afterHighlighting: ""
          }
        });

        continue;

      }


      const actualLineOfCode: string = rawHTML_CodeSplitToLines[lineNumberOfActualCodeFragment__numerationFrom0];
      const lineNumberOfActualCodeFragment__numerationFrom1: number = lineNumberOfActualCodeFragment__numerationFrom0 + 1;

      const numberOfStartingLineWhichWillBeExtractedFromCodeListingForLogging__numerationFrom1: number =
            limitMinimalValue({
              targetNumber: lineNumberOfActualCodeFragment__numerationFrom1 -
                  AccessibilityInspector.DISPLAYING_LINES_COUNT_BEFORE_ISSUE_IN_CODE_LISTING,
              minimalValue: 1
            });

      const numberOfEndingLineWhichWillBeExtractedFromCodeListingForLogging__numerationFrom1: number =
          limitMaximalValue({
            targetNumber: lineNumberOfActualCodeFragment__numerationFrom1 +
                AccessibilityInspector.DISPLAYING_LINES_COUNT_AFTER_ISSUE_IN_CODE_LISTING,
            maximalValue: rawHTML_CodeSplitToLines.length
          });

      const highlightedCodeFragment: string = rawInspectionIssue.context;


      const indexOfStartingColumnOfHighlightedCodeFragment: number = actualLineOfCode.indexOf(highlightedCodeFragment);

      /* [ `pa11y` theory ] ※ It is possible, see ※. */
      if (indexOfStartingColumnOfHighlightedCodeFragment === -1) {

        normalizedInspectionIssues.push({
          ID: rawInspectionIssue.code,
          message: rawInspectionIssue.message,
          codeFragment: {
            beforeHighlighting: "",
            highlighted: rawInspectionIssue.context,
            afterHighlighting: ""
          }
        });

        continue;

      }

      const numberOfStartingColumnOfHighlightedCodeFragment__numerationFrom1: number =
          actualLineOfCode.indexOf(highlightedCodeFragment) + 1;

      const numberOfEndingColumnOfHighlightedCodeFragment__numerationFrom1: number =
          numberOfStartingColumnOfHighlightedCodeFragment__numerationFrom1 + highlightedCodeFragment.length;


      /* [ Maintainability ] Keep these variables for easy debugging. */
      const codeFragmentBeforeHighlighting: string =
          `${
            cropArray({
              targetArray: rawHTML_CodeSplitToLines,
              startingElementNumber__numerationFrom1:
              numberOfStartingLineWhichWillBeExtractedFromCodeListingForLogging__numerationFrom1,
              endingElementNumber__numerationFrom1: lineNumberOfActualCodeFragment__numerationFrom1 - 1,
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

      const codeFragmentAfterHighlighting: string =
          `${
            cropString({
              targetString: actualLineOfCode,
              startingCharacterNumber__numerationFrom1: numberOfEndingColumnOfHighlightedCodeFragment__numerationFrom1,
              endingCharacterNumber__numerationFrom1: actualLineOfCode.length,
              mustThrowErrorIfSpecifiedCharactersNumbersIsOutOfRange: false
            })
          }\n` +
          cropArray({
            targetArray: rawHTML_CodeSplitToLines,
            startingElementNumber__numerationFrom1: lineNumberOfActualCodeFragment__numerationFrom1 + 1,
            endingElementNumber__numerationFrom1:
                numberOfEndingLineWhichWillBeExtractedFromCodeListingForLogging__numerationFrom1,
            mustThrowErrorIfSpecifiedElementsNumbersAreOutOfRange: false,
            mutably: false
          }).join("\n");

      normalizedInspectionIssues.push({
        ID: rawInspectionIssue.code,
        codeFragment: {
          beforeHighlighting: codeFragmentBeforeHighlighting,
          highlighted: highlightedCodeFragment,
          afterHighlighting: codeFragmentAfterHighlighting,
          location: {
            lineNumber__numerationFrom1: lineNumberOfActualCodeFragment__numerationFrom1,
            startingColumnNumber__numerationFrom1: numberOfStartingColumnOfHighlightedCodeFragment__numerationFrom1,
            endingColumnNumber__numerationFrom1: numberOfEndingColumnOfHighlightedCodeFragment__numerationFrom1
          }
        },
        message: rawInspectionIssue.message
      });

    }

    return normalizedInspectionIssues;

  }


  /* ─── Logging ──────────────────────────────────────────────────────────────────────────────────────────────────── */
  private logInspectionResultsForSingleFile(
    {
      targetHTML_FilePathRelativeToConsumingProjectRootDirectory,
      normalizedInspectionIssues,
      inspectionPeriod__seconds
    }: Readonly<{
      targetHTML_FilePathRelativeToConsumingProjectRootDirectory: string;
      normalizedInspectionIssues: ReadonlyArray<AccessibilityInspector.CachedInspectionsResults.Issue>;
      inspectionPeriod__seconds?: number;
    }>
  ): void {

    if (normalizedInspectionIssues.length > 0) {

      Logger.logErrorLikeMessage(
        AccessibilityInspector.localization.generateIssuesFoundErrorLog({
          targetFileRelativePath: targetHTML_FilePathRelativeToConsumingProjectRootDirectory,
          formattedErrorsAndWarnings: AccessibilityInspector.formatInspectionResultForSingleFile(normalizedInspectionIssues)
        })
      );

      clearTimeout(nullToUndefined(this.waitingForToastNotificationsWillBePermittedAgain));

      if (this.isToastNotificationPermitted) {

        NativeToastMessageService.notify(AccessibilityInspector.localization.issuesFoundNotification);

        this.isToastNotificationPermitted = false;

        this.waitingForToastNotificationsWillBePermittedAgain = setTimeout(
          (): void => { this.isToastNotificationPermitted = true; },
          secondsToMilliseconds(AccessibilityInspector.SUBSEQUENT_TOAST_NOTIFICATION_PROHIBITION_PERIOD__SECONDS)
        );

      }

    }


    if (this.logging.inspectionCompletionWithoutIssues) {
      Logger.logSuccess(
        AccessibilityInspector.localization.generateInspectionOfSingleFilesHasFinishedWithNoIssuesFoundSuccessLog({
          targetFileRelativePath: targetHTML_FilePathRelativeToConsumingProjectRootDirectory,
          secondsElapsed: inspectionPeriod__seconds
        })
      );
    }

  }

  private static formatInspectionResultForSingleFile(
    issues: ReadonlyArray<AccessibilityInspector.CachedInspectionsResults.Issue>
  ): string {

    const formattedIssues: Array<string> = [];

    for (const [ index, issue ] of issues.entries()) {

      /*

       === Issue No. 3 =================================================================================================
       </a><span></span>
       <h1></h1>
       <button></button><span>END</span>
       </main>
       -----------------------------------------------------------------------------------------------------------------
       This button element does not have a name available to an accessibility API. Valid names are: title undefined,
       element content, aria-label undefined, aria-labelledby undefined.
       At line 17, columns 5-22

       */

      formattedIssues.push([

        `${
          surroundLabelByOrnament({
            label: AccessibilityInspector.localization.generateIssueNumberLabel({ issueNumber: index + 1 }),
            ornamentPatten: "=",
            prependedPartCharactersCount: 3,
            totalCharactersCount: AccessibilityInspector.DISPLAYING_MAXIMAL_COLUMNS_COUNT_IN_LOG
          })
        }\n`,

        ...isNonEmptyString(issue.codeFragment.beforeHighlighting) ? [ issue.codeFragment.beforeHighlighting ] : [],
        ...isNonEmptyString(issue.codeFragment.beforeHighlighting) && isNonEmptyString(issue.codeFragment.afterHighlighting) ?
            [ Logger.highlightText(issue.codeFragment.highlighted) ] :
            [ issue.codeFragment.highlighted ],
        ...isNonEmptyString(issue.codeFragment.afterHighlighting) ? [ issue.codeFragment.afterHighlighting ] : [],
        "\n",

        `${ "-".repeat(AccessibilityInspector.DISPLAYING_MAXIMAL_COLUMNS_COUNT_IN_LOG) }\n`,
        `${ issue.message }\n`,
        ...isNotUndefined(issue.codeFragment.location) ? [
          AccessibilityInspector.localization.generateIssueOccurrenceLocationIndication({
            lineNumber: issue.codeFragment.location.lineNumber__numerationFrom1,
            startingColumnNumber: issue.codeFragment.location.startingColumnNumber__numerationFrom1,
            lastColumnNumber: issue.codeFragment.location.endingColumnNumber__numerationFrom1
          })
        ] : []

      ].join(""));

    }

    return formattedIssues.join("\n\n");

  }


  /* ─── Cache file ───────────────────────────────────────────────────────────────────────────────────────────────── */
  private static async retrieveCachedPastInspectionsResultsFromFileIfItExists(
    {
      cachedInspectionsResultsDirectoryAbsolutePath,
      cachedInspectionResultsFileAbsolutePath
    }: Readonly<{
      cachedInspectionsResultsDirectoryAbsolutePath: string;
      cachedInspectionResultsFileAbsolutePath: string;
    }>
  ): Promise<AccessibilityInspector.CachedInspectionsResults | null> {

    const isCachedValidationsResultsDirectoryExists: boolean = await ImprovedFileSystem.
        isFileOrDirectoryExists({ targetPath: cachedInspectionsResultsDirectoryAbsolutePath, synchronously: false });

    /* [ Theory ] No need to create the directory now because it could be deleted manually any time after has been created. */
    if (!isCachedValidationsResultsDirectoryExists) {
      return null;
    }


    let cachedInspectionsResults: AccessibilityInspector.CachedPastInspectionsRawResults;

    try {

      cachedInspectionsResults = await ObjectDataFilesProcessor.
          processFile<AccessibilityInspector.CachedPastInspectionsRawResults>({
            filePath: cachedInspectionResultsFileAbsolutePath,
            validDataSpecification: AccessibilityInspector.cachedInspectionsResultsFileContentSpecification,
            synchronously: false
          });

    } catch (error: unknown) {

      if (!(error instanceof FileNotFoundError) && __IS_DEVELOPMENT_BUILDING_MODE__) {
        Logger.logError({
          errorType: "CachedDataRetrievingFailure",
          title: "Cached data retrieving failure",
          description: `Unable to read the existing cache file "${ cachedInspectionResultsFileAbsolutePath }".`,
          occurrenceLocation: "AccessibilityInspector." +
              "retrieveCachedPastInspectionsResultsFromFileIfItExists(cachedInspectionResultsFileAbsolutePath)",
          caughtError: error
        });
      }

      return null;

    }


    return new Map(Object.entries(cachedInspectionsResults));

  }

  private writeCacheToFile(): void {

    ImprovedFileSystem.createDirectory({
      targetPath: this.CACHED_INSPECTIONS_RESULTS_FILE_DIRECTORY_ABSOLUTE_PATH,
      mustThrowErrorIfTargetDirectoryExists: false,
      synchronously: true
    });

    const cachedInspectionsResultsFileContent: AccessibilityInspector.CachedPastInspectionsRawResults =
        Array.from(
          filterMap(
            this.cachedInspectionsResults,
            (filePathRelativeToConsumingProjectRootDirectory: string): boolean =>
                this.relativePathsOfFilesWhichHasBeenInspectedCurrentDuringExecution.
                    has(filePathRelativeToConsumingProjectRootDirectory)
          ).entries()
        ).
        reduce(
          (
            accumulatingValue: AccessibilityInspector.CachedPastInspectionsRawResults,
            [ filePathRelativeToConsumingProjectRootDirectory, cachedInspectionRawResultsForSpecificFile ]:
                [ string, AccessibilityInspector.CachedInspectionsResults.File ]
          ): AccessibilityInspector.CachedPastInspectionsRawResults => {
            accumulatingValue[filePathRelativeToConsumingProjectRootDirectory] = cachedInspectionRawResultsForSpecificFile;
            return accumulatingValue;
          },
          {}
        );

    FileSystem.writeFileSync(
      this.CACHED_INSPECTIONS_RESULTS_FILE_ABSOLUTE_PATH,
      stringifyAndFormatArbitraryValue(cachedInspectionsResultsFileContent)
    );

  }


  /* ─── Routines ─────────────────────────────────────────────────────────────────────────────────────────────────── */
  private static async initializeAsynchronousRequirements(
    {
      cachedInspectionsResultsDirectoryAbsolutePath,
      cachedInspectionResultsFileAbsolutePath
    }: Readonly<{
      cachedInspectionsResultsDirectoryAbsolutePath: string;
      cachedInspectionResultsFileAbsolutePath: string;
    }>
  ): Promise<AccessibilityInspector.InitializationAsynchronousRequirements> {

    const [ cachedInspectionsResults, webBrowser ]: [ AccessibilityInspector.CachedInspectionsResults | null, WebBrowser ] =
        await Promise.all([

          AccessibilityInspector.
              retrieveCachedPastInspectionsResultsFromFileIfItExists({
                cachedInspectionResultsFileAbsolutePath,
                cachedInspectionsResultsDirectoryAbsolutePath
              }).
              catch((error: unknown): null => {

                if (__IS_DEVELOPMENT_BUILDING_MODE__) {
                  Logger.logError({
                    errorType: AlgorithmMismatchError.NAME,
                    title: AlgorithmMismatchError.localization.defaultTitle,
                    description: "The error has been caught during the execution of asynchronous method " +
                        "\"retrieveCachedPastInspectionsResultsFromFileIfItExists\", while expected that all errors " +
                        "has been handled inside this method.",
                    occurrenceLocation: "AccessibilityInspector." +
                        "initializeAsynchronousRequirements(cachedInspectionResultsFileAbsolutePath)",
                    caughtError: error
                  });
                }

                return null;

              }),

          WebBrowserProvider.launch()

        ]);

    return {
      ...isNotNull(cachedInspectionsResults) ? { cachedInspectionsResults } : null,
      webBrowser
    };

  }

  private static onSelfSoleInstanceReady(selfSoleInstance: AccessibilityInspector): void {

    for (const onSelfSoleInstanceReadyEventsHandler of AccessibilityInspector.onSelfSoleInstanceReadyEventsHandlers) {
      onSelfSoleInstanceReadyEventsHandler(selfSoleInstance);
    }

    AccessibilityInspector.onSelfSoleInstanceReadyEventsHandlers.clear();

  }

  private static async getInstanceOnceReady(): Promise<AccessibilityInspector> {

    if (!AccessibilityInspector.hasInitializationStarted) {
      Logger.throwErrorAndLog({
        errorInstance: new ClassRequiredInitializationHasNotBeenExecutedError({
          className: "AccessibilityInspector",
          initializingMethodName: "beginInitialization"
        }),
        title: ClassRequiredInitializationHasNotBeenExecutedError.localization.defaultTitle,
        occurrenceLocation: "AccessibilityInspector.getInstanceOnceReady()"
      });
    }


    if (AccessibilityInspector.hasInitializationFailed) {
      Logger.throwErrorAndLog({
        errorType: "InitializationFailedError",
        description: "The initialization has failed thus the accessibility checking could not be executed.",
        title: "Initialization failed",
        occurrenceLocation: "AccessibilityInspector.getInstanceOnceReady()"
      });
    }


    return AccessibilityInspector.selfSoleInstance ??
        new Promise<AccessibilityInspector>((resolve: (accessibilityInspector: AccessibilityInspector) => void): void => {
          AccessibilityInspector.onSelfSoleInstanceReadyEventsHandlers.add(resolve);
        });

  }

  private static generateAccessibilityIssueAuxiliaryHTML_Attribute(issueIndex: number): string {
    return `data-accessibility_issue-${ issueIndex }`;
  }

}


namespace AccessibilityInspector {

  export type Configuration = Readonly<{
    cachedInspectionsResultsFileParentDirectoryAbsolutePath: string;
    consumingProjectBuildingMode: string;
    projectBuildingSelectiveExecutionID?: string;
    logging: Logging;
  }>;

  export type InitializationAsynchronousRequirements = Readonly<{
    cachedInspectionsResults?: CachedInspectionsResults;
    webBrowser: WebBrowser;
  }>;

  export type Logging = Readonly<{
    inspectionStart: boolean;
    inspectionCompletionWithoutIssues: boolean;
  }>;

  export type SingleFileAccessibilityCheckingOrder = Readonly<{
    HTML_Code: string;
    HTML_CodeMD5Checksum: string;
    targetHTML_FilePathRelativeToConsumingProjectRootDirectory: string;
    accessibilityStandard: MarkupProcessingRestrictions.SupportedAccessibilityStandards;
  }>;

  export type CachedPastInspectionsRawResults = {
    [filePathRelativeToConsumingProjectRootDirectory: string]: CachedInspectionsResults.File;
  };

  export type CachedInspectionsResults = Map<
    CachedInspectionsResults.FilePathRelativeToConsumingProjectRootDirectory,
    CachedInspectionsResults.File
  >;

  export namespace CachedInspectionsResults {

    export type FilePathRelativeToConsumingProjectRootDirectory = string;

    export type File = {
      contentMD5Checksum: string;
      issues: Array<Issue>;
    };

    export type Issue = Readonly<{
      ID: string;
      codeFragment: Readonly<{
        beforeHighlighting: string;
        highlighted: string;
        afterHighlighting: string;
        location?: Issue.Location;
      }>;
      message: string;
    }>;

    export namespace Issue {

      export type Location = Readonly<{
        lineNumber__numerationFrom1: number;
        startingColumnNumber__numerationFrom1: number;
        endingColumnNumber__numerationFrom1: number;
      }>;

    }

  }


  export type InspectionRawResults = Readonly<{
    issues: ReadonlyArray<RawInspectionResults.Issue>;
  }>;

  /* The types in `@types/pa11y` are not importable.  */
  export namespace RawInspectionResults {

    export type Issue = Readonly<{
      code: string;
      message: string;
      context: string;
      selector: string;
    }>;

  }


  export type Localization = Readonly<{

    generateFileIsEmptyWarningLog: (templateVariables: Localization.FileIsEmptyWarningLog.TemplateVariables) =>
        Localization.FileIsEmptyWarningLog;

    generateInspectionStartedInfoLog: (templateVariables: Localization.InspectionStartedInfoLog.TemplateVariables) =>
        Localization.InspectionStartedInfoLog;

    inspectionFailedErrorLog: Localization.InspectionFailedErrorLog;

    generateInspectionOfSingleFilesHasFinishedWithNoIssuesFoundSuccessLog: (
      templateVariables: Localization.InspectionFinishedWithNoIssuesFoundSuccessLog.TemplateVariables
    ) => Localization.InspectionOfSingleFileHasFinishedWithNoIssuesFoundSuccessLog;

    generateIssuesFoundInSingleFileErrorLog: (
      templateVariables: Localization.IssuesFoundInSingleFileErrorLog.TemplateVariables
    ) => Localization.IssuesFoundInSingleFileErrorLog;

    inspectionOfAllFilesHasFinishedWithNoIssuesFoundSuccessLog: Localization.
        InspectionOfAllFilesHasFinishedWithNoIssuesFoundSuccessLog;

    issuesFoundNotification: Localization.IssuesFoundNotification;

    generateIssueNumberLabel: (
      templateVariables: Localization.IssueNumberLabelGenerating.Template
    ) => string;

    generateIssueOccurrenceLocationIndication: (
      templateVariables: Localization.IssueOccurrenceLocationIndication.TemplateVariables
    ) => string;

    generateIssuesFoundErrorLog: (templateVariables: Localization.IssuesFoundErrorLog.TemplateVariables) =>
        Localization.IssuesFoundErrorLog;

    formattedError: Localization.FormattedError;

    generateAccessSniffBugWarning: (templateVariables: Localization.AccessSniffBugWarningLog.TemplateVariables) =>
        Localization.AccessSniffBugWarningLog;

    issuesFoundInOneOrMultipleFilesErrorLog: Localization.IssuesFoundInOneOrMultipleFilesErrorLog;

  }>;

  export namespace Localization {

    export type FileIsEmptyWarningLog = Readonly<Pick<WarningLog, "title" | "description">>;

    export namespace FileIsEmptyWarningLog {
      export type TemplateVariables = Readonly<{ targetFileRelativePath: string; }>;
    }


    export type InspectionStartedInfoLog = Readonly<Pick<InfoLog, "title" | "description">>;

    export namespace InspectionStartedInfoLog {
      export type TemplateVariables = Readonly<{ targetFileRelativePath: string; }>;
    }


    export type InspectionFailedErrorLog = Readonly<Pick<Log, "title" | "description">>;


    export type InspectionOfSingleFileHasFinishedWithNoIssuesFoundSuccessLog =
        Readonly<Pick<SuccessLog, "title" | "description">>;

    export namespace InspectionFinishedWithNoIssuesFoundSuccessLog {
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


    export type InspectionOfAllFilesHasFinishedWithNoIssuesFoundSuccessLog = Readonly<Pick<SuccessLog, "title" | "description">>;


    export type IssuesFoundNotification = Readonly<{ title: string; message: string; }>;


    export namespace IssueOccurrenceLocationIndication {
      export type TemplateVariables = Readonly<{
        lineNumber: number;
        startingColumnNumber: number;
        lastColumnNumber: number;
      }>;
    }


    export namespace IssueNumberLabelGenerating {
      export type Template = Readonly<{
        issueNumber: number;
      }>;
    }


    export type IssuesFoundErrorLog = Readonly<Required<Pick<ErrorLog, "badge" | "title" | "description">>>;

    export namespace IssuesFoundErrorLog {
      export type TemplateVariables = Readonly<{
        targetFileRelativePath: string;
        formattedErrorsAndWarnings: string;
      }>;
    }


    export type FormattedError = Readonly<{
      violatedGuidelineItem: string;
      keyAndValueSeparator: string;
    }>;


    export type AccessSniffBugWarningLog = Readonly<Pick<InfoLog, "title" | "description">>;

    export namespace AccessSniffBugWarningLog {
      export type TemplateVariables = Readonly<{ targetFileRelativePath: string; }>;
    }


    export type IssuesFoundInOneOrMultipleFilesErrorLog = Readonly<Required<Pick<Log, "title" | "description">>>;

  }
}


export default AccessibilityInspector;


/* It is the only way to extract the child namespace (no need to expose whole AccessibilityInspector for the localization
 * packages). See https://stackoverflow.com/a/73400523/4818123 */
export import AccessibilityInspectorLocalization = AccessibilityInspector.Localization;
