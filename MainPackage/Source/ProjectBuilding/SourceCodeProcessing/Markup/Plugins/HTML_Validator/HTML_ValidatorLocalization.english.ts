import type HTML_Validator from "@MarkupProcessing/Plugins/HTML_Validator/HTML_Validator";


const HTML_ValidatorLocalization__english: HTML_Validator.Localization = {

  generateFileIsEmptyWarningLog: (
    namedParameters: HTML_Validator.Localization.FileIsEmptyWarningLog.NamedParameters
  ): HTML_Validator.Localization.FileIsEmptyWarningLog =>
      ({
        title: "HTML code validation terminated",
        description: `File '${ namedParameters.targetFileRelativePath }' is empty, no HTML to validate.`
      }),

  generateValidationStartedInfoLog: (
    namedParameters: HTML_Validator.Localization.ValidationStartedInfoLog.NamedParameters
  ): HTML_Validator.Localization.ValidationStartedInfoLog => ({
    title: "HTML code validation started",
    description: `Begin the validation of HTML code in the file '${ namedParameters.targetFileRelativePath }' ...`
  }),

  generateValidationFinishedWithNoIssuesFoundSuccessLog: (
    namedParameters: HTML_Validator.Localization.ValidationFinishedWithNoIssuesFoundSuccessLog.NamedParameters
  ): HTML_Validator.Localization.ValidationFinishedWithNoIssuesFoundSuccessLog => ({
    title: "HTML validation finished",
    description: `File '${ namedParameters.targetFileRelativePath }' is fully obeying to W3C rules and recommendations.\n` +
        `${ namedParameters.secondsElapsed } seconds elapsed.`
  }),

  issuesFoundNotification: {
    title: "HTML validation, issue(s) found",
    message: "W3C rules violations and / or recommendations neglect detected. Check the console for the details."
  },

  generateIssueOccurrenceLocationIndication: (
    namedParameters: HTML_Validator.Localization.IssueOccurrenceLocationIndication.NamedParameters
  ): string => `Line ${ namedParameters.lineNumber }, ` +
      `columns ${ namedParameters.startingColumnNumber }-${ namedParameters.lastColumnNumber }`,

  issuesTypesTitles: {
    grossViolation: "Gross violation",
    recommendationDisregard: "Recommendation disregard",
    other: "Other issue",
    keyAndValueSeparator: ": "
  },

  generateIssuesFoundErrorLog: (
    namedParameters: HTML_Validator.Localization.IssuesFoundErrorLog.NamedParameters
  ): HTML_Validator.Localization.IssuesFoundErrorLog => ({
    customBadgeText: "HTML validation not passed",
    title: "HTML validation, issue(s) found",
    description: `File '${ namedParameters.targetFileRelativePath }' is including the following HTML validity issues:\n\n` +
        `${ namedParameters.formattedErrorsAndWarnings }\n\n`
  }),

  validationFailedErrorLog: {
    title: "HTML validation failed",
    description: "The error occurred during HTML validation"
  }
};


export default HTML_ValidatorLocalization__english;
