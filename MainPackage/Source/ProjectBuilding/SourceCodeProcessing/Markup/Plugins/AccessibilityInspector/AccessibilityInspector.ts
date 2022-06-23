/* --- Assets ------------------------------------------------------------------------------------------------------- */
import AccessibilityInspectorLocalization__English from "./AccessibilityInspectorLocalization.english";

/* --- Settings representatives ------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";

/* --- Tasks executors ---------------------------------------------------------------------------------------------- */
import type MarkupProcessor from "@MarkupProcessing/MarkupProcessor";

/* --- Applied utils ------------------------------------------------------------------------------------------------ */
import AccessibilityCheckingService from "access-sniff";
import NodeNotifier from "node-notifier";
import getExpectedToBeNonNullStringifiedContentOfVinylFile from "@Utils/getExpectedToBeNonNullStringifiedContentOfVinylFile";
import isCompiledHTML_ContentEmpty from "@Utils/isCompiledHTML_ContentEmpty";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import { Logger } from "@yamato-daiwa/es-extensions";
import type {
  Log,
  InfoLog,
  WarningLog,
  SuccessLog
} from "@yamato-daiwa/es-extensions";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";
import Stopwatch from "@UtilsIncubator/Stopwatch";


class AccessibilityInspector {

  public static localization: AccessibilityInspector.Localization = AccessibilityInspectorLocalization__English;


  public static inspectAccessibility(
    compiledHTML_File: MarkupProcessor.MarkupVinylFile,
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): void {

    const extractedHTML_Code: string = getExpectedToBeNonNullStringifiedContentOfVinylFile(compiledHTML_File);
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

    /* [ Theory ]
     * 1. With '{ verbose: true }' (default) it will be a lot of recommendations which never disappear. The output pollution.
     * 2. In `import AccessSniff, { reports } from 'access-sniff';`, the 'reports' are 'undefined',
     * 3. In 'then(function(report) {}}', the 'report' is an empty object. */
    AccessibilityCheckingService(
      getExpectedToBeNonNullStringifiedContentOfVinylFile(compiledHTML_File),
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
          formattedErrors: formattedErrors.join("\n\n")
        }));
      });
  }
}


namespace AccessibilityInspector {

  export type Localization = Readonly<{

    generateFileIsEmptyWarningLog: (namedParameters: Localization.FileIsEmptyWarningLog.NamedParameters) => WarningLog;

    generateInspectionStartedInfoLog: (namedParameters: Localization.InspectionStartedInfoLog.NamedParameters) => InfoLog;

    generateInspectionFinishedWithNoIssuesFoundSuccessLog: (
      namedParameters: Localization.InspectionFinishedWithNoIssuesFoundSuccessLog.NamedParameters
    ) => SuccessLog;


    issuesFoundNotification: Readonly<{ title: string; message: string; }>;

    generateIssueOccurrenceLocationIndication: (
      namedParameters: Localization.IssueOccurrenceLocationIndication.NamedParameters
    ) => string;

    generateIssuesFoundErrorLog: (namedParameters: Localization.IssuesFoundErrorLog.NamedParameters) => Log;


    formattedError: Readonly<{
      violatedGuidelineItem: string;
      keyAndValueSeparator: string;
    }>;
  }>;

  export namespace Localization {

    export namespace FileIsEmptyWarningLog {
      export type NamedParameters = Readonly<{ targetFileRelativePath: string; }>;
    }

    export namespace InspectionStartedInfoLog {
      export type NamedParameters = Readonly<{ targetFileRelativePath: string; }>;
    }

    export namespace InspectionFinishedWithNoIssuesFoundSuccessLog {
      export type NamedParameters = Readonly<{
        targetFileRelativePath: string;
        secondsElapsed: number;
      }>;
    }

    export namespace IssueOccurrenceLocationIndication {
      export type NamedParameters = Readonly<{
        lineNumber: number;
        columnNumber: number;
      }>;
    }

    export namespace IssuesFoundErrorLog {
      export type NamedParameters = Readonly<{
        targetFileRelativePath: string;
        formattedErrors: string;
      }>;
    }
  }
}


export default AccessibilityInspector;
