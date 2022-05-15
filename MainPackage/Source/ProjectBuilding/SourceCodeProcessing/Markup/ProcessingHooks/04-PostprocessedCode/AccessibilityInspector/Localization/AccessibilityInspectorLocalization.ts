import type {
  WarningLog,
  InfoLog,
  SuccessLog,
  Log
} from "@yamato-daiwa/es-extensions";


namespace AccessibilityInspectorLocalization {

  export type Translations = {
    fileIsEmptyWarningLog: (parametersObject: FileIsEmptyWarningLog.ParametersObject) => WarningLog;
    validationStartedInfoLog: (parametersObject: InspectionStartedInfoLog.ParametersObject) => InfoLog;
    inspectionFinishedWithNoIssuesFoundSuccessLog: (
      parametersObject: InspectionFinishedWithNoIssuesFoundSuccessLog.ParametersObject
    ) => SuccessLog;
    issuesFoundNotification: {
      title: string;
      message: string;
    };
    issueOccurrenceLocationIndication: (parametersObject: IssueOccurrenceLocationIndication.ParametersObject) => string;
    issuesFoundErrorLog: (parametersObject: IssuesFoundErrorLog.ParametersObject) => Log;
    formattedError: {
      violatedGuidelineItem: string;
      keyAndValueSeparator: string;
    };
  };


  export namespace FileIsEmptyWarningLog {
    export type ParametersObject = {
      targetFileRelativePath: string;
    };
  }

  export namespace InspectionStartedInfoLog {
    export type ParametersObject = {
      targetFileRelativePath: string;
    };
  }

  export namespace InspectionFinishedWithNoIssuesFoundSuccessLog {
    export type ParametersObject = {
      targetFileRelativePath: string;
      secondsElapsed: number;
    };
  }

  export namespace IssueOccurrenceLocationIndication {
    export type ParametersObject = {
      lineNumber: number;
      columnNumber: number;
    };
  }

  export namespace IssuesFoundErrorLog {
    export type ParametersObject = {
      targetFileRelativePath: string;
      formattedErrors: string;
    };
  }
}

/* eslint-disable-next-line @typescript-eslint/no-redeclare --
 * The merging of type/interface and namespace is completely valid TypeScript,
 * but @typescript-eslint community does not wish to support it.
 * https://github.com/eslint/eslint/issues/15504 */
type AccessibilityInspectorLocalization = {
  fileIsEmptyWarningLog: (
    parametersObject: AccessibilityInspectorLocalization.FileIsEmptyWarningLog.ParametersObject
  ) => WarningLog;

  validationStartedInfoLog: (
    parametersObject: AccessibilityInspectorLocalization.InspectionStartedInfoLog.ParametersObject
  ) => InfoLog;

  inspectionFinishedWithNoIssuesFoundSuccessLog: (
    parametersObject: AccessibilityInspectorLocalization.InspectionFinishedWithNoIssuesFoundSuccessLog.ParametersObject
  ) => SuccessLog;

  issuesFoundNotification: {
    title: string;
    message: string;
  };

  issueOccurrenceLocationIndication: (
    parametersObject: AccessibilityInspectorLocalization.IssueOccurrenceLocationIndication.ParametersObject
  ) => string;

  issuesFoundErrorLog: (parametersObject: AccessibilityInspectorLocalization.IssuesFoundErrorLog.ParametersObject) => Log;

  formattedError: {
    violatedGuidelineItem: string;
    keyAndValueSeparator: string;
  };
};


export default AccessibilityInspectorLocalization;
