/* eslint-disable max-classes-per-file -- This limitation should not be applied to the type definitions. */

/* eslint-disable no-underscore-dangle -- This global variable must stand out somehow. */
declare const __IS_DEVELOPMENT_BUILDING_MODE__: boolean;
declare const __IS_PRODUCTION_BUILDING_MODE__: boolean;
/* eslint-enable no-underscore-dangle */


declare module "pug-lint" {

  class PugLint {

    public constructor();

    public configure(config?: PugLint.Config): void;
    public checkFile(filePath: string): Array<PugLint.RawError>;

  }

  namespace PugLint {

    export interface Config {
      excludeFiles?: Array<string>;
    }

    export interface RawError {
      code: string;
      msg: string;
      line: number;
      column?: number;
      filename: string;
      src: string;
      toJSON: () => NormalizedError;
    }

    export interface NormalizedError {
      code: string;
      msg: string;
      line: number;
      column?: number;
      filename: string;
    }
  }

  export default PugLint;
}

declare module "pug-lint/lib/config-file" {

  import type PugLint from "pug-lint";

  export default class ConfigFile {
    public static load(config?: unknown, cwd?: string): PugLint.Config | undefined;
  }

}


declare module "gulp-data" {

  import type VinylFile from "vinyl";
  import ReadWriteStream = NodeJS.ReadWriteStream;

  export default function (
    file: VinylFile |
    ((file: VinylFile) => { [key: string]: unknown; } | null | undefined)
  ): ReadWriteStream;

}

/* Although Stlint has type definitions, is does not match with actual package structure and has TypeScript errors.
*  Below definitions are not full - they include required ports only. */
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


declare module "stream-combiner2" {
  import ReadWriteStream = NodeJS.ReadWriteStream;
  export function obj(...streams: Array<ReadWriteStream>): ReadWriteStream;
}
