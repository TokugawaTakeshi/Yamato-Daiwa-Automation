import type {
  WarningLog,
  InfoLog,
  SuccessLog,
  Log
} from "@yamato-daiwa/es-extensions";


namespace HTML_ValidatorLocalization {

  export namespace FileIsEmptyWarningLog {
    export type ParametersObject = {
      targetFileRelativePath: string;
    };
  }

  export namespace ValidationStartedInfoLog {
    export type ParametersObject = {
      targetFileRelativePath: string;
    };
  }

  export namespace ValidationFinishedWithNoIssuesFoundSuccessLog {
    export type ParametersObject = {
      targetFileRelativePath: string;
      secondsElapsed: number;
    };
  }

  export namespace IssueOccurrenceLocationIndication {
    export type ParametersObject = {
      lineNumber: number;
      startingColumnNumber: number;
      lastColumnNumber: number;
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
type HTML_ValidatorLocalization = {

  fileIsEmptyWarningLog: (parametersObject: HTML_ValidatorLocalization.FileIsEmptyWarningLog.ParametersObject) => WarningLog;

  validationStartedInfoLog: (parametersObject: HTML_ValidatorLocalization.ValidationStartedInfoLog.ParametersObject) => InfoLog;

  validationFinishedWithNoIssuesFoundSuccessLog: (
      parametersObject: HTML_ValidatorLocalization.ValidationFinishedWithNoIssuesFoundSuccessLog.ParametersObject
  ) => SuccessLog;

  issuesFoundNotification: {
    title: string;
    message: string;
  };

  issueOccurrenceLocationIndication: (
      parametersObject: HTML_ValidatorLocalization.IssueOccurrenceLocationIndication.ParametersObject
  ) => string;

  issuesTypesTitles: {
    grossViolation: string;
    recommendationDisregard: string;
    other: string;
    keyAndValueSeparator: string;
  };

  issuesFoundErrorLog: (parametersObject: HTML_ValidatorLocalization.IssuesFoundErrorLog.ParametersObject) => Log;

  validationFailedErrorLog: Log;
};


export default HTML_ValidatorLocalization;
