// Type definitions for html-validator 3.2
// Project: https://github.com/yargalot/AccessSniff
// Definitions by: Takesi Tokugawa <https://github.com/TokugawaTakesi>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.0

/// <reference types="node" />

declare function AccessSniff(
    targetFilesPathsOrGlobsOrFileContent: Array<string> | string,
    options?: AccessSniff.Options
): Promise<AccessSniff.Report>;


declare namespace AccessSniff {
    interface Options {
        accessibilityLevel?: 'WCAG2A' | 'WCAG2AA' | 'WCAG2AAA' | 'Section508';
        ignore?: Array<string>;
        verbose?: boolean;
        force?: boolean;
        browser?: boolean;
        maxBuffer?: number;
    }

    interface Report {

    }

    export function report(): void {

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

export = AccessSniff;
