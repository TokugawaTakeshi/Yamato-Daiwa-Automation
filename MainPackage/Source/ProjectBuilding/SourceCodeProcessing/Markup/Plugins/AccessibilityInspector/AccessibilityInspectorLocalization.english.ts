import type AccessibilityInspector from "@MarkupProcessing/Plugins/AccessibilityInspector/AccessibilityInspector";


const accessibilityInspectorLocalization__english: AccessibilityInspector.Localization = {

  generateFileIsEmptyWarningLog: (
    namedParameters: AccessibilityInspector.Localization.FileIsEmptyWarningLog.NamedParameters
  ): AccessibilityInspector.Localization.FileIsEmptyWarningLog => ({
    title: "HTML code accessibility inspection terminated",
    description: `File '${ namedParameters.targetFileRelativePath }' is empty, nothing to inspect.`
  }),

  generateInspectionStartedInfoLog: (
    namedParameters: AccessibilityInspector.Localization.InspectionStartedInfoLog.NamedParameters
  ): AccessibilityInspector.Localization.InspectionStartedInfoLog => ({
    title: "HTML code accessibility inspection started",
    description: `Begin the accessibility inspection of HTML code in the file '${ namedParameters.targetFileRelativePath }' ...`
  }),

  generateInspectionFinishedWithNoIssuesFoundSuccessLog: (
    namedParameters: AccessibilityInspector.Localization.InspectionFinishedWithNoIssuesFoundSuccessLog.NamedParameters
  ): AccessibilityInspector.Localization.InspectionFinishedWithNoIssuesFoundSuccessLog => ({
    title: "HTML code accessibility inspection finished",
    description: `The HTML code in file '${ namedParameters.targetFileRelativePath }' has not the accessibility issues.\n` +
        `${ namedParameters.secondsElapsed } seconds elapsed.`
  }),

  issuesFoundNotification: {
    title: "HTML code accessibility inspection, issue(s) found",
    message: "Accessibility issues detected in one or more HTML files. Please check the console for the details."
  },

  generateIssueOccurrenceLocationIndication: (
    namedParameters: AccessibilityInspector.Localization.IssueOccurrenceLocationIndication.NamedParameters
  ): string => `Line ${ namedParameters.lineNumber },　column ${ namedParameters.columnNumber }`,

  generateIssuesFoundErrorLog: (
    namedParameters: AccessibilityInspector.Localization.IssuesFoundErrorLog.NamedParameters
  ): AccessibilityInspector.Localization.IssuesFoundErrorLog => ({
    customBadgeText: "HTML code accessibility inspection not passed",
    title: "HTML code accessibility inspection, issue(s) found",
    description: `HTML file '${ namedParameters.targetFileRelativePath }' is including the following accessibility issues:\n\n` +
        `${ namedParameters.formattedErrorsAndWarnings }\n\n`
  }),

  formattedError: {
    violatedGuidelineItem: "Violated rule",
    keyAndValueSeparator: ":"
  },

  generateAccessSniffBugWarning: (
    namedParameters: AccessibilityInspector.Localization.AccessSniffBugWarningLog.NamedParameters
  ): AccessibilityInspector.Localization.AccessSniffBugWarningLog => ({
    title: "Accessibility inspection, the dependency bug occurred",
    description: "We are sorry, but because of \"access-sniff\" bug the accessibility inspection has not been executed " +
        `for the file "${ namedParameters.targetFileRelativePath }". Would you mind to check the content of this file ` +
        "manually at https://squizlabs.github.io/HTML_CodeSniffer/ ?"
  })

};


export default accessibilityInspectorLocalization__english;
