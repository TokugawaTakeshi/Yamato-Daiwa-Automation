import AccessibilityInspector from "@MarkupProcessing/Plugins/AccessibilityInspector/AccessibilityInspector";
import Localization = AccessibilityInspector.Localization;
import { isUndefined } from "@yamato-daiwa/es-extensions";


const accessibilityInspectorLocalization__english: AccessibilityInspector.Localization = {

  generateFileIsEmptyWarningLog: (
    { targetFileRelativePath }: Localization.FileIsEmptyWarningLog.TemplateVariables
  ): Localization.FileIsEmptyWarningLog =>
      ({
        title: "HTML code accessibility inspection terminated because of empty file",
        description: `File "${ targetFileRelativePath }" is empty, no HTML to inspect. ` +
            "Please note that at production-like modes the empty HTML files are being considered as invalid."
      }),

  generateInspectionStartedInfoLog: (
    { targetFileRelativePath }: Localization.InspectionStartedInfoLog.TemplateVariables
  ): Localization.InspectionStartedInfoLog =>
      ({
        title: "HTML code accessibility inspection started",
        description: `Begin the accessibility inspection of HTML code in the file "${ targetFileRelativePath }" ...`
      }),

  inspectionFailedErrorLog: {
    title: "HTML conde accessibility checking failed",
    description: "The error occurred during HTML code accessibility checking. " +
        "It may be caused by the problems with the internet connection. " +
        "Well, we should not stop the project building because of this. " +
        "We believe that you will check the HTML accessibility afterwards and fix the issues if they will be."
  },

  generateInspectionOfSingleFilesHasFinishedWithNoIssuesFoundSuccessLog: (
    {
      targetFileRelativePath,
      secondsElapsed
    }: Localization.InspectionFinishedWithNoIssuesFoundSuccessLog.TemplateVariables
  ): Localization.InspectionOfSingleFileHasFinishedWithNoIssuesFoundSuccessLog =>
      ({
        title: "HTML code accessibility cheking of single file has finished with no issues found",
        description: `The HTML code in file "${ targetFileRelativePath }" has no the accessibility issues.\n` +
            `${
              /* eslint-disable-next-line @typescript-eslint/no-useless-template-literals -- 
              * テンプレートリテラルを無くすと、「+」の前の部分が無くなっていまう。 */
              isUndefined(secondsElapsed) ?
                  "(Cached result, no changes in output HTML code since last building)" : 
                  `${ secondsElapsed } seconds taken.`
            }`

      }),

  generateIssuesFoundInSingleFileErrorLog: (
    { targetFileRelativePath, formattedErrorsAndWarnings }: Localization.IssuesFoundInSingleFileErrorLog.TemplateVariables
  ): Localization.IssuesFoundInSingleFileErrorLog => ({
    title: "HTML accessibility inspection, issue(s) found",
    description: `File "${ targetFileRelativePath }" is including the following HTML accessibility issues:\n\n` +
        `${ formattedErrorsAndWarnings }\n\n`
  }),

  inspectionOfAllFilesHasFinishedWithNoIssuesFoundSuccessLog: {
    title: "HTML accessibility inspection, no issues found",
    description: "All files are fully obeying to selected accessibility standard."
  },

  issuesFoundNotification: {
    title: "HTML code accessibility inspection, issue(s) found",
    message: "Accessibility issues detected in one or more HTML files. Please check the console for the details."
  },

  generateIssueNumberLabel: ({ issueNumber }: Localization.IssueNumberLabelGenerating.Template): string =>
      ` Issue No. ${ issueNumber } `,

  generateIssueOccurrenceLocationIndication: (
    {
      lineNumber,
      startingColumnNumber,
      lastColumnNumber
    }: AccessibilityInspector.Localization.IssueOccurrenceLocationIndication.TemplateVariables
  ): string =>
      `At line ${ lineNumber }, columns ${ startingColumnNumber }-${ lastColumnNumber }`,

  generateIssuesFoundErrorLog: (
    {
      targetFileRelativePath,
      formattedErrorsAndWarnings
    }: AccessibilityInspector.Localization.IssuesFoundErrorLog.TemplateVariables
  ): AccessibilityInspector.Localization.IssuesFoundErrorLog => ({
    badge: { customText: "HTML code accessibility inspection not passed" },
    title: "HTML code accessibility inspection, issue(s) found",
    description: `HTML file "${ targetFileRelativePath }" is including the following accessibility issues:\n\n` +
        `${ formattedErrorsAndWarnings }\n\n`
  }),

  formattedError: {
    violatedGuidelineItem: "Violated rule",
    keyAndValueSeparator: ":"
  },

  issuesFoundInOneOrMultipleFilesErrorLog: {
    title: "Accessibility inspection, issue(s) found",
    description: "The issue(s) has been found in one or more output HTML files. " +
        "Intended to be used for the high quality development, YDA can not accept the HTML code with accessibility " +
          "violations on production and production-like modes. " +
        "Its strongly recommended to fix these issue(s) instead of disabling of the accessibility checking."
  },

  generateAccessSniffBugWarning: (
    namedParameters: AccessibilityInspector.Localization.AccessSniffBugWarningLog.TemplateVariables
  ): AccessibilityInspector.Localization.AccessSniffBugWarningLog => ({
    title: "Accessibility inspection, the dependency bug occurred",
    description: "We are sorry, but because of \"access-sniff\" bug the accessibility inspection has not been executed " +
        `for the file "${ namedParameters.targetFileRelativePath }". Would you mind to check the content of this file ` +
        "manually at https://squizlabs.github.io/HTML_CodeSniffer/ ?"
  })

};


export default accessibilityInspectorLocalization__english;
