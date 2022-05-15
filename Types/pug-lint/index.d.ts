// Type definitions for html-validator 2.6
// Project: https://github.com/pugjs/pug-lint
// Definitions by: Takesi Tokugawa <https://github.com/TokugawaTakesi>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.0

/// <reference types="node" />
/// <reference types="vinyl" />

export as namespace pugLint;


export = PugLint;


declare class PugLint {
    constructor();

    configure(config?: PugLint.Config): void;
    checkFile(file: VinylFile): Array<PugLint.RawError>;
}


declare namespace PugLint {
    export interface Config {}

    export interface RawError {
        code: string;
        msg: string;
        line: number;
        column?: number;
        filename: string;
        src: string;
        toJSON(): NormalizedError;
    }

    export interface NormalizedError {
        code: string;
        msg: string;
        line: number;
        column?: number;
        filename: string;
    }
}
