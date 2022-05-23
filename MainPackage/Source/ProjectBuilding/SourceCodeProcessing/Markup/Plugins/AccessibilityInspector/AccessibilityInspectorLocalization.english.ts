import type AccessibilityInspector from "@MarkupProcessing/Plugins/AccessibilityInspector/AccessibilityInspector";

import type {
  WarningLog,
  InfoLog,
  SuccessLog,
  Log
} from "@yamato-daiwa/es-extensions";


const AccessibilityInspectorLocalization__English: AccessibilityInspector.Localization = {

  generateFileIsEmptyWarningLog: (
    namedParameters: AccessibilityInspector.Localization.FileIsEmptyWarningLog.NamedParameters
  ): WarningLog => ({
    title: "Accessibility inspection terminated",
    description: `File '${ namedParameters.targetFileRelativePath }' is empty, no HTML to inspect.`
  }),

  generateInspectionStartedInfoLog: (
    namedParameters: AccessibilityInspector.Localization.InspectionStartedInfoLog.NamedParameters
  ): InfoLog => ({
    title: "Accessibility inspection started",
    description: `Begin the inspection of file '${ namedParameters.targetFileRelativePath }' ...`
  }),

  generateInspectionFinishedWithNoIssuesFoundSuccessLog: (
    namedParameters: AccessibilityInspector.Localization.InspectionFinishedWithNoIssuesFoundSuccessLog.NamedParameters
  ): SuccessLog => ({
    title: "HTML validation finished",
    description: `File '${ namedParameters.targetFileRelativePath }' is has not the accessibility issues.\n` +
        `${ namedParameters.secondsElapsed } seconds elapsed.`
  }),

  issuesFoundNotification: {
    title: "Accessibility validation, issue(s) found",
    message: "Accessibility issues detected. Check the console for the details."
  },

  generateIssueOccurrenceLocationIndication: (
    namedParameters: AccessibilityInspector.Localization.IssueOccurrenceLocationIndication.NamedParameters
  ): string => `Line ${ namedParameters.lineNumber },　column ${ namedParameters.columnNumber }`,

  generateIssuesFoundErrorLog: (
    namedParameters: AccessibilityInspector.Localization.IssuesFoundErrorLog.NamedParameters
  ): Log => ({
    customBadgeText: "Accessibility inspection not passed",
    title: "Accessibility inspections, issue(s) found",
    description: `File '${ namedParameters.targetFileRelativePath }' is including the following accessibility issue:\n\n` +
        `${ namedParameters.formattedErrors }\n\n`
  }),

  formattedError: {
    violatedGuidelineItem: "Violated rule",
    keyAndValueSeparator: ":"
  }
};


export default AccessibilityInspectorLocalization__English;
