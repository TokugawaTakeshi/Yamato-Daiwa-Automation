import Webpack from "webpack";
import Path from "path";

import NodeExternalsPlugin from "webpack-node-externals";
import ESLintPlugin from "eslint-webpack-plugin";

import type { ArbitraryObject } from "@yamato-daiwa/es-extensions";


export default function generateConfiguration(
  _environment: ArbitraryObject, commandArguments: ArbitraryObject
): Webpack.Configuration {

  const SOURCE_CODE_ROOT_DIRECTORY_ABSOLUTE_PATH: string = Path.resolve(__dirname, "Source");

  const __IS_DEVELOPMENT_BUILDING_MODE__: boolean = commandArguments.mode === "development";
  const __IS_PRODUCTION_BUILDING_MODE__: boolean = commandArguments.mode === "production";

  return {

    target: "node",

    context: SOURCE_CODE_ROOT_DIRECTORY_ABSOLUTE_PATH,
    entry: { EntryPoint: "./EntryPoint.ts" },

    output: {
      path: __dirname,
      filename: "[name].js",
      library: {
        type: "commonjs"
      }
    },

    /* [ Theory ] Valid non-undefined values are only "development", "production" and "none". */
    mode: __IS_DEVELOPMENT_BUILDING_MODE__ ? "development" : "production",
    watch: __IS_DEVELOPMENT_BUILDING_MODE__,
    optimization: {
      emitOnErrors: __IS_DEVELOPMENT_BUILDING_MODE__,
      minimize: __IS_PRODUCTION_BUILDING_MODE__
    },

    node: {
      __dirname: false
    },

    devtool: false,

    externals: [
      NodeExternalsPlugin({
        allowlist: [ "rev-hash" ]
      })
    ],

    module: {
      rules: [
        {
          test: /\.ts$/u,
          loader: "ts-loader"
        }
      ]
    },

    resolve: {
      extensions: [ ".ts", ".js" ],
      alias: {

        "@ProjectBuilding": Path.resolve(
          SOURCE_CODE_ROOT_DIRECTORY_ABSOLUTE_PATH,
          "ProjectBuilding"
        ),

        "@ProjectBuilding:Common": Path.resolve(
          SOURCE_CODE_ROOT_DIRECTORY_ABSOLUTE_PATH,
          "ProjectBuilding",
          "Common"
        ),

        "@MarkupProcessing": Path.resolve(
          SOURCE_CODE_ROOT_DIRECTORY_ABSOLUTE_PATH,
          "ProjectBuilding",
          "SourceCodeProcessing",
          "Markup"
        ),
        "@StylesProcessing": Path.resolve(
          SOURCE_CODE_ROOT_DIRECTORY_ABSOLUTE_PATH,
          "ProjectBuilding",
          "SourceCodeProcessing",
          "Styles"
        ),
        "@ECMA_ScriptProcessing": Path.resolve(
          SOURCE_CODE_ROOT_DIRECTORY_ABSOLUTE_PATH,
          "ProjectBuilding",
          "SourceCodeProcessing",
          "ECMA_Script"
        ),
        "@ImagesProcessing": Path.resolve(
          SOURCE_CODE_ROOT_DIRECTORY_ABSOLUTE_PATH,
          "ProjectBuilding",
          "AssetsProcessing",
          "Images"
        ),
        "@FontsProcessing": Path.resolve(
          SOURCE_CODE_ROOT_DIRECTORY_ABSOLUTE_PATH,
          "ProjectBuilding",
          "AssetsProcessing",
          "Fonts"
        ),
        "@AudiosProcessing": Path.resolve(
          SOURCE_CODE_ROOT_DIRECTORY_ABSOLUTE_PATH,
          "ProjectBuilding",
          "AssetsProcessing",
          "Audios"
        ),
        "@VideosProcessing": Path.resolve(
          SOURCE_CODE_ROOT_DIRECTORY_ABSOLUTE_PATH,
          "ProjectBuilding",
          "AssetsProcessing",
          "Videos"
        ),
        "@BrowserLiveReloading": Path.resolve(
          SOURCE_CODE_ROOT_DIRECTORY_ABSOLUTE_PATH,
          "ProjectBuilding",
          "BrowserLiveReloading"
        ),

        "@ThirdPartySolutionsSpecialists": Path.resolve(
          SOURCE_CODE_ROOT_DIRECTORY_ABSOLUTE_PATH,
          "ThirdPartySolutionsSpecialists"
        ),
        "@Utils": Path.resolve(SOURCE_CODE_ROOT_DIRECTORY_ABSOLUTE_PATH, "Utils"),
        "@UtilsIncubator": Path.resolve(
          SOURCE_CODE_ROOT_DIRECTORY_ABSOLUTE_PATH,
          "UtilsIncubator"
        )
      }
    },

    plugins: [
      new Webpack.DefinePlugin({
        __IS_DEVELOPMENT_BUILDING_MODE__,
        __IS_PRODUCTION_BUILDING_MODE__
      }),
      new ESLintPlugin({
        configType: "flat",
        extensions: [ "js", "ts" ],
        failOnWarning: __IS_PRODUCTION_BUILDING_MODE__
      })
    ]

  };

}
