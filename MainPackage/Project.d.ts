declare const __IS_DEVELOPMENT_BUILDING_MODE__: boolean;
declare const __IS_PRODUCTION_BUILDING_MODE__: boolean;


declare module "access-sniff" {

  function AccessSniff(
    targetFilesPathsOrGlobsOrFileContent: Array<string> | string,
    options?: AccessSniff.Options
  ): Promise<AccessSniff.Report>;

  namespace AccessSniff {

    interface Report {}

    interface Options {
      accessibilityLevel?: "WCAG2A" | "WCAG2AA" | "WCAG2AAA" | "Section508";
      ignore?: Array<string>;
      verbose?: boolean;
      force?: boolean;
      browser?: boolean;
      maxBuffer?: number;
    }

    interface ErroredResult {
      errorMessage: string;
      reportLogs: { [ HTML_Content: string ]: ReportLog };
    }

    interface ReportLog {
      counters: Counters;
      messageLog: Array<MessageLog>;
    }

    interface Counters {
      error: number;
      warning: number;
      notice: number;
    }

    /* Example:
     {
       heading: 'NOTICE',
       issue: 'WCAG2A.Principle2.Guideline2_4.2_4_2.H25.2',
       description: 'Check that the title element describes the document.',
       position: { lineNumber: 5, columnNumber: 2 },
       element: { node: '<title>Minimal HTML page</title>', class: '', id: '' }
     }
     */
    interface MessageLog {
      heading: "NOTICE" | "ERROR" | "WARNING";
      issue: string;
      description: string;
      position: IssuePosition;
      element: IssueOccurrenceDOM_Element;
    }

    interface IssuePosition {
      lineNumber: number;
      columnNumber: number;
    }

    interface IssueOccurrenceDOM_Element {
      node: string;
      class: string;
      id: string;
    }
  }

  export default AccessSniff;
}

/* Although Stlint has type definitions, the does not match with actual package structure and has TypeScript errors.
*  These definitions are not full is exact - they include required parts only. */
declare module "stlint" {

  export class Linter {

    public options: Options;
    public reporter: Reporter;

    public constructor(options?: { [option: string]: unknown; });

    public lint(filePath: string, content?: string | null): void;
  }

  export interface Options {
    extends?: Array<string>;
  }

  export interface Reporter {
    response: {
      passed: boolean;
      errors?: Array<MessagePack>;
    };
  }

  export interface MessagePack {
    message: ErrorMessage;
  }

  export interface ErrorMessage {
    rule: string;
    descr: string;
    path: string;
    line: number;
    endline: number;
    start: number;
    end: number;
  }
}
