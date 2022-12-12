/* --- Assets ------------------------------------------------------------------------------------------------------- */
import accessibilityInspectorLocalization__english from "./AccessibilityInspectorLocalization.english";

/* --- Settings representatives ------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";

/* --- Tasks executors ---------------------------------------------------------------------------------------------- */
import type MarkupProcessor from "@MarkupProcessing/MarkupProcessor";

/* --- Applied utils ------------------------------------------------------------------------------------------------ */
import AccessibilityCheckingService from "access-sniff";
import NodeNotifier from "node-notifier";
import extractStringifiedContentFromVinylFile from "@Utils/extractStringifiedContentFromVinylFile";
import isCompiledHTML_ContentEmpty from "@Utils/isCompiledHTML_ContentEmpty";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import type {
  SuccessLog,
  InfoLog,
  WarningLog,
  ErrorLog
} from "@yamato-daiwa/es-extensions";
import { Logger } from "@yamato-daiwa/es-extensions";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";
import Stopwatch from "@UtilsIncubator/Stopwatch";


class AccessibilityInspector {

  public static localization: AccessibilityInspector.Localization = accessibilityInspectorLocalization__english;


  public static inspectAccessibility(
    compiledHTML_File: MarkupProcessor.MarkupVinylFile,
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): void {

    const extractedHTML_Code: string = extractStringifiedContentFromVinylFile(compiledHTML_File);
    const targetFileRelativePath: string = ImprovedPath.computeRelativePath({
      basePath: masterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath,
      comparedPath: compiledHTML_File.path
    });

    if (isCompiledHTML_ContentEmpty(extractedHTML_Code)) {
      Logger.logWarning(AccessibilityInspector.localization.generateFileIsEmptyWarningLog({ targetFileRelativePath }));
      return;
    }


    const inspectionTimeMeasuringStopwatch: Stopwatch = new Stopwatch().startOrRestart();

    Logger.logInfo(AccessibilityInspector.localization.generateInspectionStartedInfoLog({ targetFileRelativePath }));

    try {

      /* [ Theory ]
       * 1. With '{ verbose: true }' (default) it will be a lot of recommendations which never disappear. The output pollution.
       * 2. In `import AccessSniff, { reports } from 'access-sniff';`, the 'reports' are 'undefined',
       * 3. In 'then(function(report) {}}', the 'report' is an empty object. */
      AccessibilityCheckingService(
        extractStringifiedContentFromVinylFile(compiledHTML_File),
        {
          verbose: false,
          accessibilityLevel: compiledHTML_File.processingSettings.accessibilityInspection.standard
        }
      ).

        then((): void => {

          const inspectionPeriod__seconds: number = inspectionTimeMeasuringStopwatch.stop().seconds;

          Logger.logSuccess(AccessibilityInspector.localization.generateInspectionFinishedWithNoIssuesFoundSuccessLog({
            targetFileRelativePath,
            secondsElapsed: inspectionPeriod__seconds
          }));

        }).

        catch((erroredResult: AccessibilityCheckingService.ErroredResult): void => {

          NodeNotifier.notify(AccessibilityInspector.localization.issuesFoundNotification);

          const formattedErrors: Array<string> = [];

          for (const singlePageLog of Object.values(erroredResult.reportLogs)) {
            for (const issueLog of Object.values(singlePageLog.messageLog)) {

              if (issueLog.heading !== "ERROR") {
                continue;
              }


              formattedErrors.push(
                `${ issueLog.element.node }\n` +
                `${ AccessibilityInspector.localization.generateIssueOccurrenceLocationIndication({
                  lineNumber: issueLog.position.lineNumber, columnNumber: issueLog.position.columnNumber
                }) }\n` +
                `${ issueLog.description }\n` +
                `${ AccessibilityInspector.localization.formattedError.violatedGuidelineItem }` +
                `${ AccessibilityInspector.localization.formattedError.keyAndValueSeparator }` +
                `${ issueLog.issue }`
              );
            }
          }

          Logger.logErrorLikeMessage(AccessibilityInspector.localization.generateIssuesFoundErrorLog({
            targetFileRelativePath,
            formattedErrorsAndWarnings: formattedErrors.join("\n\n")
          }));

        });

    } catch (error: unknown) {

      if (error instanceof Error && error.message === "pattern is too long") {

        // https://squizlabs.github.io/HTML_CodeSniffer/
        Logger.logWarning(
          AccessibilityInspector.localization.generateAccessSniffBugWarning({ targetFileRelativePath })
        );

        return;

      }

      throw error;

    }

  }
}


namespace AccessibilityInspector {

  export type Localization = Readonly<{

    generateFileIsEmptyWarningLog: (namedParameters: Localization.FileIsEmptyWarningLog.NamedParameters) =>
        Localization.FileIsEmptyWarningLog;

    generateInspectionStartedInfoLog: (namedParameters: Localization.InspectionStartedInfoLog.NamedParameters) =>
        Localization.InspectionStartedInfoLog;

    generateInspectionFinishedWithNoIssuesFoundSuccessLog: (
      namedParameters: Localization.InspectionFinishedWithNoIssuesFoundSuccessLog.NamedParameters
    ) => Localization.InspectionFinishedWithNoIssuesFoundSuccessLog;

    issuesFoundNotification: Localization.IssuesFoundNotification;

    generateIssueOccurrenceLocationIndication: (
      namedParameters: Localization.IssueOccurrenceLocationIndication.NamedParameters
    ) => string;

    generateIssuesFoundErrorLog: (namedParameters: Localization.IssuesFoundErrorLog.NamedParameters) =>
        Localization.IssuesFoundErrorLog;

    formattedError: Localization.FormattedError;

    generateAccessSniffBugWarning: (namedParameters: Localization.AccessSniffBugWarningLog.NamedParameters) =>
        Localization.AccessSniffBugWarningLog;

  }>;

  export namespace Localization {

    export type FileIsEmptyWarningLog = Readonly<Pick<WarningLog, "title" | "description">>;

    export namespace FileIsEmptyWarningLog {
      export type NamedParameters = Readonly<{ targetFileRelativePath: string; }>;
    }


    export type InspectionStartedInfoLog = Readonly<Pick<InfoLog, "title" | "description">>;

    export namespace InspectionStartedInfoLog {
      export type NamedParameters = Readonly<{ targetFileRelativePath: string; }>;
    }


    export type InspectionFinishedWithNoIssuesFoundSuccessLog = Readonly<Pick<SuccessLog, "title" | "description">>;

    export namespace InspectionFinishedWithNoIssuesFoundSuccessLog {
      export type NamedParameters = Readonly<{
        targetFileRelativePath: string;
        secondsElapsed: number;
      }>;
    }


    export type IssuesFoundNotification = Readonly<{ title: string; message: string; }>;


    export namespace IssueOccurrenceLocationIndication {
      export type NamedParameters = Readonly<{
        lineNumber: number;
        columnNumber: number;
      }>;
    }


    export type IssuesFoundErrorLog = Readonly<Required<Pick<ErrorLog, "customBadgeText" | "title" | "description">>>;

    export namespace IssuesFoundErrorLog {
      export type NamedParameters = Readonly<{
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
      export type NamedParameters = Readonly<{ targetFileRelativePath: string; }>;
    }

  }
}


export default AccessibilityInspector;

/* eslint-disable-next-line @typescript-eslint/no-unused-vars --
 * It is the only way to extract the child namespace (no need to expose whole AccessibilityInspector for the localization
 * packages).
 * https://stackoverflow.com/a/73400523/4818123 */
export import AccessibilityInspectorLocalization = AccessibilityInspector.Localization;
