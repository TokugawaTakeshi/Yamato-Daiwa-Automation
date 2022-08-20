import type Webpack from "webpack";
import type TypeScript from "typescript";

import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


abstract class WebpackSpecialist {

  public static convertPathsAliasesFromTypeScriptFormatToWebpackFormat(
    {
      typeScriptBasicAbsolutePath,
      typeScriptPathsSettings
    }: Readonly<{
      typeScriptBasicAbsolutePath: string;
      typeScriptPathsSettings: TypeScript.CompilerOptions["paths"];
    }>
  ): { [ alias: string ]: string | Array<string>; } {

    const webpackAliasesConfiguration: { [ alias: string ]: string | Array<string>; } = {};

    for (const [ alias, paths ] of Object.entries(typeScriptPathsSettings ?? {})) {

      const normalizedAlias: string = alias.endsWith("/*") ? alias.slice(0, -"/*".length) : alias;

      webpackAliasesConfiguration[normalizedAlias] = paths.map(
        (path: string): string => ImprovedPath.joinPathSegments(
          [
            typeScriptBasicAbsolutePath,
            ...path.endsWith("/*") ? [ path.slice(0, -"/*".length) ] : [ path ]
          ],
          { alwaysForwardSlashSeparators: true }
        )
      );

    }

    return webpackAliasesConfiguration;

  }

  public static generateLoadersResolvingSettings(
    consumingProjectRootDirectoryAbsolutePath: string
  ): Webpack.Configuration["resolveLoader"] {
    return {
      modules: [

        /* [ Theory ] Actual for normal usage via "npm install" */
        ImprovedPath.joinPathSegments(
          [ consumingProjectRootDirectoryAbsolutePath, "node_modules" ],
          { alwaysForwardSlashSeparators: true }
        ),

        /* [ Theory ] Actual for usage via "npm-link". */
        ImprovedPath.joinPathSegments([ __dirname, "node_modules" ], { alwaysForwardSlashSeparators: true })

      ]
    };
  }

}


namespace WebpackSpecialist {

  /* [ Reference ] https://webpack.js.org/configuration/mode/#usage */
  export enum BuildingModes {
    development = "development",
    production = "production",
    none = "none"
  }

  /* [ Reference ] https://webpack.js.org/configuration/devtool/ */
  export enum BuildInSourceMapsTypes {
    eval = "eval",
    evalCheapSourceMap = "eval-cheap-source-map",
    evalCheapModuleSourceMap = "eval-cheap-module-source-map",
    evalSourceMap = "eval-source-map",
    evalNoSourcesSourceMap = "eval-nosources-source-map",
    evalNoSourcesCheapSourceMap = "eval-nosources-cheap-source-map",
    evalNoSourcesCheapModuleSourceMap = "eval-nosources-cheap-module-source-map",
    cheapSourceMap = "cheap-source-map",
    cheapModuleSourceMap = "cheap-module-source-map",
    inlineCheapSourceMap = "inline-cheap-source-map",
    inlineCheapModuleSourceMap = "inline-cheap-module-source-map",
    inlineSourceMap = "inline-source-map",
    inlineNoSourcesSourceMap = "inline-nosources-source-map",
    inlineNosourcesCheapSourceMap = "inline-nosources-cheap-source-map",
    inlineNoSourcesCheapModuleSourceMap = "inline-nosources-cheap-module-source-map",
    sourceMap = "source-map",
    hiddenSourceMap = "hidden-source-map",
    hiddenNoSourcesSourceMap = "hidden-nosources-source-map",
    hiddenNoSourcesCheapSourceMap = "hidden-nosources-cheap-source-map",
    hiddenNoSourcesCheapModuleSourceMap = "hidden-nosources-cheap-module-source-map",
    hiddenCheapSourceMap = "hidden-cheap-source-map",
    hiddenCheapModuleSourceMap = "hidden-cheap-module-source-map",
    noSourcesSourceMap = "nosources-source-map",
    noSourcesCheapSourceMap = "nosources-cheap-source-map",
    noSourcesCheapModuleSourceMap = "nosources-cheap-module-source-map"
  }

  /* [ Reference ] https://webpack.js.org/configuration/target/ */
  export enum BuildingTargets {
    webBrowser = "web",
    webWorker = "webworker"
  }
}


export default WebpackSpecialist;
