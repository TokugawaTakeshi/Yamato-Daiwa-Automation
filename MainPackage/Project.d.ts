declare const __IS_DEVELOPMENT_BUILDING_MODE__: boolean;
declare const __IS_PRODUCTION_BUILDING_MODE__: boolean;


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
