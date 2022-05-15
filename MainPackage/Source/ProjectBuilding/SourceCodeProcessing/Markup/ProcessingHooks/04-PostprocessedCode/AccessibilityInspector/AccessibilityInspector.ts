/* --- Assets ------------------------------------------------------------------------------------------------------- */
import Localization from "./Localization/AccessibilityInspectorLocalization__Japanese";

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
import {
  Logger,
  millisecondsToSeconds
} from "@yamato-daiwa/es-extensions";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";


export default class AccessibilityInspector {

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
      Logger.logWarning(Localization.fileIsEmptyWarningLog({ targetFileRelativePath }));
      return;
    }


    const validationStartedTime__millisecondsSinceEpoch: number = Date.now();

    Logger.logInfo(Localization.validationStartedInfoLog({ targetFileRelativePath }));

    /** 〔 理論 〕
     * 1. { verbose: true }（規定）は検問エラーをログしてはいるが、其れと共にコンソールに全体的にHTMLファイルの内容を出力されている。コンソールの汚染。
     * 2. `import AccessSniff, { reports } from 'access-sniff';` に於ける 'reports'はundefinedである。
     * 3. 'then(function(report) {}}'に於ける'report'は空オブジェクトである。
     * */
    AccessibilityCheckingService(
        extractStringifiedContentFromVinylFile(compiledHTML_File),
        {
          verbose: false,
          accessibilityLevel: compiledHTML_File.processingSettings.accessibilityInspection.standard
        }
    ).

        then((): void => {

          const inspectionPeriod__seconds: number = millisecondsToSeconds(
              Date.now() - validationStartedTime__millisecondsSinceEpoch
          );

          Logger.logSuccess(Localization.inspectionFinishedWithNoIssuesFoundSuccessLog({
            targetFileRelativePath,
            secondsElapsed: inspectionPeriod__seconds
          }));
        }).

        catch((erroredResult: AccessibilityCheckingService.ErroredResult): void => {

          NodeNotifier.notify(Localization.issuesFoundNotification);

          const formattedErrors: Array<string> = [];

          for (const singlePageLog of Object.values(erroredResult.reportLogs)) {
            for (const issueLog of Object.values(singlePageLog.messageLog)) {

              if (issueLog.heading !== "ERROR") {
                continue;
              }


              formattedErrors.push(
                `${ issueLog.element.node }\n` +
                `${ Localization.issueOccurrenceLocationIndication({
                  lineNumber: issueLog.position.lineNumber, columnNumber: issueLog.position.columnNumber
                }) }\n` +
                `${ issueLog.description }\n` +
                `${ Localization.formattedError.violatedGuidelineItem }${ Localization.formattedError.keyAndValueSeparator }` +
                    `${ issueLog.issue }`
              );
            }
          }

        Logger.logErrorLikeMessage(Localization.issuesFoundErrorLog({
            targetFileRelativePath,
            formattedErrors: formattedErrors.join("\n\n")
        }));
      });
  }
}
