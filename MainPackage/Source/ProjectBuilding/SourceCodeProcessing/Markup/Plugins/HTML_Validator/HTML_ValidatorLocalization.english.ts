import HTML_Validator from "@MarkupProcessing/Plugins/HTML_Validator/HTML_Validator";
import Localization = HTML_Validator.Localization;
import { isUndefined } from "@yamato-daiwa/es-extensions";


const HTML_ValidatorLocalization__english: HTML_Validator.Localization = {

  generateFileIsEmptyWarningLog: (
    { targetFileRelativePath }: Localization.FileIsEmptyWarningLog.TemplateVariables
  ): Localization.FileIsEmptyWarningLog =>
      ({
        title: "HTML code validation terminated because of empty file",
        description: `File "${ targetFileRelativePath }" is empty, no HTML to validate. ` +
            "Please note that at production-like modes the empty HTML files are being considered as invalid."
      }),

  generateValidationStartedInfoLog: (
    { targetFileRelativePath }: Localization.ValidationStartedInfoLog.TemplateVariables
  ): Localization.ValidationStartedInfoLog =>
      ({
        title: "HTML code validation started",
        description: `Begin the validation of the HTML code in the file "${ targetFileRelativePath }" ...`
      }),

  validationFailedErrorLog: {
    title: "HTML validation failed",
    description: "The error occurred during HTML validation. " +
        "It may be caused by the problems with the internet connection. " +
        "Well, we should not stop the project building because of this. " +
        "We believe that you will check the HTML validity afterwards and fix the issues if they will be."
  },

  generateValidationOfSingleFilesHasFinishedWithNoIssuesFoundSuccessLog: (
    {
      targetFileRelativePath,
      secondsElapsed
    }: Localization.ValidationOfSingleFileHasFinishedWithNoIssuesFoundSuccessLog.TemplateVariables
  ): Localization.ValidationOfSingleFileHasFinishedWithNoIssuesFoundSuccessLog =>
    ({
      title: "HTML validation of single file has finished with no issues found",
      description: `File "${ targetFileRelativePath }" is fully obeying to W3C rules and recommendations.\n` +
          isUndefined(secondsElapsed) ?
              "(Cached result, no changes in output HTML code since last building)" :
              `${ secondsElapsed } seconds taken.`

    }),

  generateIssuesFoundInSingleFileErrorLog: (
    { targetFileRelativePath, formattedErrorsAndWarnings }: Localization.IssuesFoundInSingleFileErrorLog.TemplateVariables
  ): Localization.IssuesFoundInSingleFileErrorLog => ({
    title: "HTML validation, issue(s) found",
    description: `File "${ targetFileRelativePath }" is including the following HTML validity issues:\n\n` +
        `${ formattedErrorsAndWarnings }\n\n`
  }),

  validationOfAllFilesHasFinishedWithNoIssuesFoundSuccessLog: {
    title: "HTML validation, no issues found",
    description: "All files are fully obeying to W3C rules and recommendations."
  },

  issuesFoundToastNotification: {
    title: "HTML validation, issue(s) found",
    message: "W3C rules violations and / or recommendations neglect detected. Check the console for the details."
  },

  generateIssueNumberLabel: ({ issueNumber }: Localization.IssueNumberLabelGenerating.Template): string =>
      ` Issue No. ${ issueNumber } `,

  generateIssueOccurrenceLocationIndication: (
    {
      lineNumber,
      startingColumnNumber,
      lastColumnNumber
    }: Localization.IssueOccurrenceLocationIndication.TemplateVariables
  ): string =>
      `At line ${ lineNumber }, columns ${ startingColumnNumber }-${ lastColumnNumber }`,

  issuesTypesTitles: {
    grossViolation: "Gross violation",
    recommendationDisregard: "Recommendation disregard",
    other: "Other issue"
  },

  issuesFoundInOneOrMultipleFilesErrorLog: {
    title: "HTML validation, issue(s) found",
    description: "The issue(s) has been found in one or more output HTML files. " +
        "Intended to be used for the high quality development, YDA can not accept the invalid HTML code on " +
          "production and production-like modes. " +
        "Its strongly recommended to fix these issue(s) instead of disabling of HTML validation."
  }

};


export default HTML_ValidatorLocalization__english;
