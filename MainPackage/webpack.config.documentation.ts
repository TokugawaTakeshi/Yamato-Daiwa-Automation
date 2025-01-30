import Webpack from "webpack";
import Path from "path";

import NodeExternalsPlugin from "webpack-node-externals";


export default function generateConfiguration(): Webpack.Configuration {

  const SOURCE_CODE_ROOT_DIRECTORY_ABSOLUTE_PATH: string = Path.resolve(__dirname, "Source");

  return {

    target: "node",

    context: SOURCE_CODE_ROOT_DIRECTORY_ABSOLUTE_PATH,
    entry: { ForDocumentation: "./ForDocumentation.ts" },

    output: {
      path: __dirname,
      filename: "[name].js",
      library: {
        type: "umd"
      }
    },

    mode: "production",
    optimization: {
      emitOnErrors: true,
      minimize: true
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
        __IS_DEVELOPMENT_BUILDING_MODE__: false,
        __IS_PRODUCTION_BUILDING_MODE__: true
      })
    ]

  };

}
