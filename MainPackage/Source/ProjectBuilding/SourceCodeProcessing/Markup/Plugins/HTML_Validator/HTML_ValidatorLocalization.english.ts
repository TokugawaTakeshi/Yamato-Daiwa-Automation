import HTML_Validator from "./HTML_Validator";
import Localization = HTML_Validator.Localization;


const HTML_ValidatorLocalization__english: HTML_Validator.Localization = {

  cachedPreviousValidationsResultsDataRetrievingErrorLog: (
    {
      cachedValidationsResultsFileAbsolutePath
    }: Localization.CachedPreviousValidationsResultsDataRetrievingErrorLog.TemplateVariables
  ): Localization.CachedPreviousValidationsResultsDataRetrievingErrorLog =>
      ({
        title: "Cached Previous Validations Data Retrieving Failure",
        description:
          "Unable to read and/or parse the existing HTML validation cache file " +
            `"${ cachedValidationsResultsFileAbsolutePath }".`
      }),

  validationStartedInfoLog: {
    title: "HTML Code Validation Started",
    description: "Validating the output HTML files..."
  },

  validityIssuesDetectedErrorLog: {
    title: "HTML Validation, Issue(s) Detected",
    headings: {
      summary: "Summary",
      details: "Details"
    },
    generateSecondsElapsedSentence: (
      { validationPeriod__seconds }: Localization.ValidityIssuesDetectedErrorLog.TemplateVariables
    ): string =>
        `Seconds elapsed: ${ validationPeriod__seconds }`
  },

  validityIssuesDetectedToastNotification: {
    title: "HTML Validation, Issue(s) Detected",
    message:
        "W3C rules violations and / or recommendations neglect detected. " +
        "Check the console for the details."
  },

  validationFinishedWithoutIssuesSuccessLog: {
    title: "HTML Validation, All Valid",
    generateDescription: (
      {
        validationPeriod__seconds,
        preFormattedErrorsMessages
      }: Localization.ValidationFinishedWithoutIssuesSuccessLog.TemplateVariables
    ): string =>
          "All HTML files (except excluded ones if any) contains valid HTML. " +
          "The following files has been checked:\n" +
          `${ preFormattedErrorsMessages }\n` +
          `Seconds elapsed: ${ validationPeriod__seconds }`
  },

  generateIssueNumberLabel: ({ issueNumber }: Localization.IssueNumberLabelGenerating.Template): string =>
      `Issue No. ${ issueNumber }`,

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
  }

};


export default HTML_ValidatorLocalization__english;
