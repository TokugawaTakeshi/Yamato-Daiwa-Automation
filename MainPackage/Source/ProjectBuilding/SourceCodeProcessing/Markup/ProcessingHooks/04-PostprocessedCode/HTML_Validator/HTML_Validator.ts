/* --- Assets ------------------------------------------------------------------------------------------------------- */
import Localization from "./Localization/HTML_ValidatorLocalization.japanese";

/* --- Settings representatives ------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";

/* --- Applied utils ------------------------------------------------------------------------------------------------ */
import HTML_ValidationService from "html-validator";
import type VinylFile from "vinyl";
import extractStringifiedContentFromVinylFile from "@Utils/extractStringifiedContentFromVinylFile";
import isCompiledHTML_ContentEmpty from "@Utils/isCompiledHTML_ContentEmpty";
import getPredicatesForHTML_ValidationIssuesFiltering from "./getPredicatesForHTML_ValidationIssuesFiltering";
import NodeNotifier from "node-notifier";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import {
  Logger,
  DataRetrievingFailedError,
  isNotUndefined,
  millisecondsToSeconds,
  removeArrayElementsByPredicates,
  isArbitraryObject
} from "@yamato-daiwa/es-extensions";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";


export default abstract class HTML_Validator {

  public static validateHtml(
    compiledHTML_File: VinylFile,
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

    HTML_ValidationService({

      /*  〔 ESLint抑制論証 〕 基本的に"id-denylist"はオブジェクトのプロパティ名に及ばないで欲しいが、オブジェクト・プロパティを除外する機能が実装されていない。
       *   〔 参考 〕 https://github.com/eslint/eslint/issues/7148 */
      /* eslint-disable-next-line id-denylist */
      data: extractedHTML_Code,
      format: "json"
    }).

        then((validationResults: HTML_ValidationService.ParsedJsonAsValidationResults): void => {

          const validationPeriod__seconds: number = millisecondsToSeconds(
              Date.now() - validationStartedTime__millisecondsSinceEpoch
          );

          const filteredIssues: Array<HTML_ValidationService.ValidationMessageObject> = removeArrayElementsByPredicates({
            targetArray: validationResults.messages,
            predicates: getPredicatesForHTML_ValidationIssuesFiltering(),
            mutably: false
          }).updatedArray;

          if (filteredIssues.length === 0) {
            Logger.logSuccess(Localization.validationFinishedWithNoIssuesFoundSuccessLog({
              targetFileRelativePath,
              secondsElapsed: validationPeriod__seconds
            }));
            return;
          }


          NodeNotifier.notify(Localization.issuesFoundNotification);

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
              ) }\n${ Localization.issueOccurrenceLocationIndication({ 
                lineNumber: issue.lastLine, startingColumnNumber: issue.firstColumn, lastColumnNumber: issue.lastColumn 
              }) }\n`;
            }

            switch (issue.type) {
              case "error": {
                accumulatingFormattedError = `${ accumulatingFormattedError }${ Localization.issuesTypesTitles.grossViolation }` +
                    `${ Localization.issuesTypesTitles.keyAndValueSeparator }`;
                break;
              }
              case "info": {
                accumulatingFormattedError =
                    `${ accumulatingFormattedError }${ Localization.issuesTypesTitles.recommendationDisregard }` +
                    `${ Localization.issuesTypesTitles.keyAndValueSeparator }`;
                break;
              }
              default: {
                accumulatingFormattedError = `${ accumulatingFormattedError }${ Localization.issuesTypesTitles.other }` +
                    `${ Localization.issuesTypesTitles.keyAndValueSeparator }`;
                break;
              }
            }

            accumulatingFormattedError = `${ accumulatingFormattedError }${ issue.message }`;

            formattedErrors.push(accumulatingFormattedError);
          }

          Logger.logErrorLikeMessage(
              Localization.issuesFoundErrorLog({
                targetFileRelativePath,
                formattedErrors: formattedErrors.join("\n\n")
              })
          );
        }).


        catch((error: Error): void => {
          Logger.logError({
            errorType: DataRetrievingFailedError.localization.defaultTitle,
            ...Localization.validationFailedErrorLog,
            occurrenceLocation: "HTML_Validator.validateHtml(...parameters)",
            caughtError: error
          });
        });
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
