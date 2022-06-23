/* --- Assets ------------------------------------------------------------------------------------------------------- */
import HTML_ValidatorLocalization__English from "./HTML_ValidatorLocalization.english";

/* --- Settings representatives ------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";

/* --- Applied utils ------------------------------------------------------------------------------------------------ */
import HTML_ValidationService from "html-validator";
import type VinylFile from "vinyl";
import getExpectedToBeNonNullStringifiedContentOfVinylFile from "@Utils/getExpectedToBeNonNullStringifiedContentOfVinylFile";
import isCompiledHTML_ContentEmpty from "@Utils/isCompiledHTML_ContentEmpty";
import NodeNotifier from "node-notifier";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import {
  Logger,
  DataRetrievingFailedError,
  isNotUndefined,
  removeArrayElementsByPredicates,
  isArbitraryObject
} from "@yamato-daiwa/es-extensions";
import type {
  Log,
  InfoLog,
  WarningLog,
  SuccessLog
} from "@yamato-daiwa/es-extensions";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";
import Stopwatch from "@UtilsIncubator/Stopwatch";


class HTML_Validator {

  public static localization: HTML_Validator.Localization = HTML_ValidatorLocalization__English;


  public static validateHTML(
    compiledHTML_File: VinylFile,
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): void {

    const extractedHTML_Code: string = getExpectedToBeNonNullStringifiedContentOfVinylFile(compiledHTML_File);
    const targetFileRelativePath: string = ImprovedPath.computeRelativePath({
      basePath: masterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath,
      comparedPath: compiledHTML_File.path
    });

    if (isCompiledHTML_ContentEmpty(extractedHTML_Code)) {
      Logger.logWarning(HTML_Validator.localization.generateFileIsEmptyWarningLog({ targetFileRelativePath }));
      return;
    }


    const validationTimeMeasuringStopwatch: Stopwatch = new Stopwatch().startOrRestart();

    Logger.logInfo(HTML_Validator.localization.generateValidationStartedInfoLog({ targetFileRelativePath }));

    HTML_ValidationService({
      /* eslint-disable-next-line id-denylist --
       * From the viewpoint of TypeScript, the property name does not conflict with imported names.
       * ESLint community has declined to fix this.
       * https://github.com/eslint/eslint/issues/15504 */
      data: extractedHTML_Code,
      format: "json"
    }).

        then((validationResults: HTML_ValidationService.ParsedJsonAsValidationResults): void => {

          const validationPeriod__seconds: number = validationTimeMeasuringStopwatch.stop().seconds;

          const filteredIssues: Array<HTML_ValidationService.ValidationMessageObject> = removeArrayElementsByPredicates({
            targetArray: validationResults.messages,
            predicates: HTML_Validator.getPredicatesForHTML_ValidationIssuesFiltering(),
            mutably: false
          }).updatedArray;

          if (filteredIssues.length === 0) {
            Logger.logSuccess(HTML_Validator.localization.generateValidationFinishedWithNoIssuesFoundSuccessLog({
              targetFileRelativePath,
              secondsElapsed: validationPeriod__seconds
            }));
            return;
          }


          NodeNotifier.notify(HTML_Validator.localization.issuesFoundNotification);

          const formattedErrors: Array<string> = [];

          for (const issue of filteredIssues) {

            let accumulatingFormattedError: string = "";

            if (HTML_Validator.isValidationMessageLocationObject(issue)) {

              const codeFragmentPartWhichMustBeHighlighted: string = issue.extract.substring(
                issue.hiliteStart, issue.hiliteStart + issue.hiliteLength
              );


              accumulatingFormattedError = `${ issue.extract.replace(
                codeFragmentPartWhichMustBeHighlighted,
                Logger.highlightText(codeFragmentPartWhichMustBeHighlighted)
              ) }\n${ HTML_Validator.localization.generateIssueOccurrenceLocationIndication({ 
                lineNumber: issue.lastLine, startingColumnNumber: issue.firstColumn, lastColumnNumber: issue.lastColumn 
              }) }\n`;
            }

            switch (issue.type) {

              case "error": {
                accumulatingFormattedError = `${ accumulatingFormattedError }` +
                    `${ HTML_Validator.localization.issuesTypesTitles.grossViolation }` +
                    `${ HTML_Validator.localization.issuesTypesTitles.keyAndValueSeparator }`;
                break;
              }

              case "info": {
                accumulatingFormattedError =
                    `${ accumulatingFormattedError }` +
                    `${ HTML_Validator.localization.issuesTypesTitles.recommendationDisregard }` +
                    `${ HTML_Validator.localization.issuesTypesTitles.keyAndValueSeparator }`;
                break;
              }

              default: {
                accumulatingFormattedError = `${ accumulatingFormattedError }` +
                    `${ HTML_Validator.localization.issuesTypesTitles.other }` +
                    `${ HTML_Validator.localization.issuesTypesTitles.keyAndValueSeparator }`;
                break;
              }
            }

            accumulatingFormattedError = `${ accumulatingFormattedError }${ issue.message }`;

            formattedErrors.push(accumulatingFormattedError);
          }

          Logger.logErrorLikeMessage(
            HTML_Validator.localization.generateIssuesFoundErrorLog({
              targetFileRelativePath,
              formattedErrors: formattedErrors.join("\n\n")
            })
          );
        }).


        catch((error: Error): void => {
          Logger.logError({
            errorType: DataRetrievingFailedError.localization.defaultTitle,
            ...HTML_Validator.localization.validationFailedErrorLog,
            occurrenceLocation: "HTML_Validator.validateHTML(...parameters)",
            caughtError: error
          });
        });
  }


  private static getPredicatesForHTML_ValidationIssuesFiltering(): Array<
    (HTML_ValidationIssue: HTML_ValidationService.ValidationMessageObject) => boolean
  > {
    return [
      (HTML_ValidationIssue: HTML_ValidationService.ValidationMessageObject): boolean =>
          HTML_ValidationIssue.message === "Attribute “webkitdirectory” not allowed on element “input” at this point."
    ];
  }

  private static isValidationMessageLocationObject(
    violation: HTML_ValidationService.ValidationMessageObject
  ): violation is HTML_ValidationService.ValidationMessageLocationObject {
    return isArbitraryObject(violation) &&
        isNotUndefined(violation.extract) &&
        isNotUndefined(violation.lastLine) &&
        isNotUndefined(violation.firstColumn) &&
        isNotUndefined(violation.lastColumn);
  }
}


namespace HTML_Validator {

  export type Localization = Readonly<{

    generateFileIsEmptyWarningLog: (namedParameters: Localization.FileIsEmptyWarningLog.NamedParameters) => WarningLog;

    generateValidationStartedInfoLog: (namedParameters: Localization.ValidationStartedInfoLog.NamedParameters) => InfoLog;

    generateValidationFinishedWithNoIssuesFoundSuccessLog: (
      namedParameters: Localization.ValidationFinishedWithNoIssuesFoundSuccessLog.NamedParameters
    ) => SuccessLog;

    issuesFoundNotification: Readonly<{ title: string; message: string; }>;

    generateIssueOccurrenceLocationIndication: (
      namedParameters: Localization.IssueOccurrenceLocationIndication.NamedParameters
    ) => string;

    issuesTypesTitles: Readonly<{
      grossViolation: string;
      recommendationDisregard: string;
      other: string;
      keyAndValueSeparator: string;
    }>;

    generateIssuesFoundErrorLog: (namedParameters: Localization.IssuesFoundErrorLog.NamedParameters) => Log;

    validationFailedErrorLog: Log;
  }>;

  export namespace Localization {

    export namespace FileIsEmptyWarningLog {
      export type NamedParameters = Readonly<{ targetFileRelativePath: string; }>;
    }

    export namespace ValidationStartedInfoLog {
      export type NamedParameters = Readonly<{ targetFileRelativePath: string; }>;
    }

    export namespace ValidationFinishedWithNoIssuesFoundSuccessLog {
      export type NamedParameters = Readonly<{
        targetFileRelativePath: string;
        secondsElapsed: number;
      }>;
    }

    export namespace IssueOccurrenceLocationIndication {
      export type NamedParameters = Readonly<{
        lineNumber: number;
        startingColumnNumber: number;
        lastColumnNumber: number;
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


export default HTML_Validator;
