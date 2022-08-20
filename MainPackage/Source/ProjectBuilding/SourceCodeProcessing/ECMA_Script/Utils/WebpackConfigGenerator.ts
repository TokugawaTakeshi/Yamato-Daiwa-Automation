/* --- Restrictions ------------------------------------------------------------------------------------------------- */
import ECMA_ScriptLogicProcessingRestrictions from "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingRestrictions";
import SupportedECMA_ScriptRuntimesTypes = ECMA_ScriptLogicProcessingRestrictions.SupportedECMA_ScriptRuntimesTypes;

/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type ECMA_ScriptLogicProcessingSettings__Normalized from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettings__Normalized";

/* --- Settings representatives ------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type ECMA_ScriptLogicProcessingSettingsRepresentative from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettingsRepresentative";

/* --- Third-party solutions specialises ---------------------------------------------------------------------------- */
import WebpackSpecialist from "@ThirdPartySolutionsSpecialists/WebpackSpecialist";

/* --- Applied utils ------------------------------------------------------------------------------------------------ */
import Webpack from "webpack";
import type { Configuration as WebpackConfiguration } from "webpack";
import { VueLoaderPlugin as VueLoaderWebpackPlugin } from "vue-loader";
import ForkTS_CheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import ES_LintWebpackPlugin from "eslint-webpack-plugin";
import provideAccessToNodeJS_ExternalDependencies from "webpack-node-externals";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import Path from "path";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";
import ImprovedGlob from "@UtilsIncubator/ImprovedGlob";
import {
  isNotUndefined,
  isNull,
  isNotNull,
  insertSubstringIf,
  Logger,
  UnexpectedEventError
} from "@yamato-daiwa/es-extensions";


export default class WebpackConfigGenerator {

  private readonly ECMA_ScriptLogicProcessingConfigRepresentative: ECMA_ScriptLogicProcessingSettingsRepresentative;
  private readonly masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;


  public static generateWebpackConfigurationForEachEntryPointsGroup(
    ECMA_ScriptLogicProcessingConfigRepresentative: ECMA_ScriptLogicProcessingSettingsRepresentative,
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): ReadonlyArray<WebpackConfiguration> {

    const dataHoldingSelfInstance: WebpackConfigGenerator = new WebpackConfigGenerator(
      ECMA_ScriptLogicProcessingConfigRepresentative, masterConfigRepresentative
    );
    const webpackConfigurationForEachEntryPointsGroup: Array<WebpackConfiguration> = [];

    for (
      const ECMA_ScriptLogicEntryPointsGroupSettings of
      dataHoldingSelfInstance.ECMA_ScriptLogicProcessingConfigRepresentative.relevantEntryPointsGroupsSettings.values()
    ) {

      const webpackConfiguration: WebpackConfiguration | null = dataHoldingSelfInstance.
          generateSingleWebpackConfigurationIfAtLeastOneTargetEntryPointFileExists(ECMA_ScriptLogicEntryPointsGroupSettings);

      if (isNotNull(webpackConfiguration)) {
        webpackConfigurationForEachEntryPointsGroup.push(webpackConfiguration);
      }

    }

    return webpackConfigurationForEachEntryPointsGroup;

  }

  public static getWebpackEntryObjectRespectiveToSpecifiedEntryPointsGroupSettings(
    {
      sourceFilesGlobSelectors,
      entryPointsGroupID,
      webpackContext
    }: {
      entryPointsGroupID: string;
      sourceFilesGlobSelectors: ReadonlyArray<string>;
      webpackContext: string;
    }
  ): Webpack.EntryObject | null {

    /* [ Reference ] https://webpack.js.org/configuration/entry-context/#entry */
    const webpackEntryPoints__objectSyntax: Webpack.EntryObject = {};
    const targetEntryPointsSourceFilesAbsolutePaths: Array<string> = ImprovedGlob.
        getFilesAbsolutePathsSynchronously(sourceFilesGlobSelectors);

    if (targetEntryPointsSourceFilesAbsolutePaths.length === 0) {

      Logger.logWarning({
        title: "Restarting may required",
        description: `No files has been found for the ECMAScript entry points group with id '${ entryPointsGroupID }'. ` +
            "Please restart the building once these files will be added"
      });

      return null;

    }

    WebpackConfigGenerator.
        checkForFilesWithSameDirectoryAndFileNameButDifferentExtensions(targetEntryPointsSourceFilesAbsolutePaths);

    for (const entryPointSourceFileAbsolutePath of targetEntryPointsSourceFilesAbsolutePaths) {

      const targetSourceFilePathRelativeToSourceEntryPointsTopDirectory: string = ImprovedPath.
      computeRelativePath({
        comparedPath: entryPointSourceFileAbsolutePath,
        basePath: webpackContext
      });

      const outputFilePathWithoutFilenameExtensionRelativeToBaseOutputDirectory: string = ImprovedPath.
          removeFilenameExtensionFromPath(targetSourceFilePathRelativeToSourceEntryPointsTopDirectory);

      /* [ Webpack theory ] The key must be the output path without filename extension relative to 'output.path'.
       *    The value must the source file path (relative or absolute), for example
       * { 'HikariFrontend/StarterPugTemplate/StarterPugTemplate':
       *      'D:/PhpStorm/InHouseDevelopment/hikari-documentation/0-Source/HikariFrontend/StarterPugTemplate.ts',
       *   'Minimal': 'D:/PhpStorm/InHouseDevelopment/hikari-documentation/0-Source/Minimal.ts',
       *   'TopPage': 'D:/PhpStorm/InHouseDevelopment/hikari-documentation/0-Source/TopPage.ts'
       * } */
      webpackEntryPoints__objectSyntax[
        outputFilePathWithoutFilenameExtensionRelativeToBaseOutputDirectory
      ] = entryPointSourceFileAbsolutePath;

    }

    return webpackEntryPoints__objectSyntax;

  }


  private constructor(
    ECMA_ScriptLogicProcessingConfigRepresentative: ECMA_ScriptLogicProcessingSettingsRepresentative,
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ) {
    this.ECMA_ScriptLogicProcessingConfigRepresentative = ECMA_ScriptLogicProcessingConfigRepresentative;
    this.masterConfigRepresentative = masterConfigRepresentative;
  }

  private generateSingleWebpackConfigurationIfAtLeastOneTargetEntryPointFileExists(
    entryPointsGroupSettings: ECMA_ScriptLogicProcessingSettings__Normalized.EntryPointsGroup
  ): WebpackConfiguration | null {

    /* [ Reference ] https://webpack.js.org/configuration/entry-context/#context */
    const sourceFilesTopDirectoryAbsolutePath: string = entryPointsGroupSettings.sourceFilesTopDirectoryAbsolutePath;

    /** @see https://webpack.js.org/configuration/entry-context/#entry */
    const webpackEntryPointsDefinition: Webpack.EntryObject | null =
        WebpackConfigGenerator.getWebpackEntryObjectRespectiveToSpecifiedEntryPointsGroupSettings(
          {
            entryPointsGroupID: entryPointsGroupSettings.ID,
            sourceFilesGlobSelectors: entryPointsGroupSettings.sourceFilesGlobSelectors,
            webpackContext: sourceFilesTopDirectoryAbsolutePath
          }
        );

    if (isNull(webpackEntryPointsDefinition)) {
      Logger.logWarning({
        title: "Empty entry point group",
        description: `No files has been found for the group '${ entryPointsGroupSettings.ID }' of ECMAScript ` +
            "entry points. Please restart the build once new files will be added."
      });
      return null;
    }


    const webpackPublicPath: string | undefined = this.computePublicPathIfPossible(entryPointsGroupSettings);

    const willBrowserJS_LibraryBeBuilt: boolean =
        entryPointsGroupSettings.distributing?.exposingOfExportsFromEntryPoints.mustExpose === true &&
        entryPointsGroupSettings.targetRuntime.type === SupportedECMA_ScriptRuntimesTypes.browser;

    const willNodeJS_LibraryBeBuilt: boolean =
        entryPointsGroupSettings.distributing?.exposingOfExportsFromEntryPoints.mustExpose === true &&
        entryPointsGroupSettings.targetRuntime.type === SupportedECMA_ScriptRuntimesTypes.nodeJS;

    const willPugLibraryBeBuilt: boolean =
        entryPointsGroupSettings.distributing?.exposingOfExportsFromEntryPoints.mustExpose === true &&
        entryPointsGroupSettings.targetRuntime.type === SupportedECMA_ScriptRuntimesTypes.pug;


    return {

      name: entryPointsGroupSettings.ID,

      /* [ Webpack theory ] In this case, path separators must be operating system dependent, otherwise following error
       *    will be thrown: "configuration[0].context: The provided value "D:/OSPanel/../01_Open" is not an absolute path!" */
      context: Path.normalize(sourceFilesTopDirectoryAbsolutePath),

      /* [ Reference ] https://webpack.js.org/configuration/target/ */
      target: ((): WebpackConfiguration["target"] => {

        switch (entryPointsGroupSettings.targetRuntime.type) {

          case SupportedECMA_ScriptRuntimesTypes.browser:
          case SupportedECMA_ScriptRuntimesTypes.pug: {
            return "web";
          }


          case SupportedECMA_ScriptRuntimesTypes.webWorker: {
            return "webworker";
          }


          case SupportedECMA_ScriptRuntimesTypes.nodeJS: {
            return `node${ entryPointsGroupSettings.targetRuntime.minimalVersion.major }` +
                `${ insertSubstringIf(
                  `.${ entryPointsGroupSettings.targetRuntime.minimalVersion.minor }`, 
                  isNotUndefined(entryPointsGroupSettings.targetRuntime.minimalVersion.minor)
                ) }`;
          }
        }
      })(),

      entry: webpackEntryPointsDefinition,

      output: {

        /* [ Webpack theory ] In this case, path separators must be operating system dependent, otherwise below error
         *    will be thrown:
         *   'configuration[0].output.path: The provided value "D:/OSPanel/.../01_Open/scripts" is not an absolute path!' */
        path: Path.normalize(entryPointsGroupSettings.outputFilesTopDirectoryAbsolutePath),

        ...isNotUndefined(webpackPublicPath) ? { publicPath: webpackPublicPath } : {},

        filename: entryPointsGroupSettings.revisioning.mustExecute ?
            `[name]${ entryPointsGroupSettings.revisioning.contentHashPostfixSeparator }[contenthash].js` : "[name].js",

        chunkFilename: entryPointsGroupSettings.revisioning.mustExecute ?
            `[id]${ entryPointsGroupSettings.revisioning.contentHashPostfixSeparator }[contenthash].js` :
            "[id][contenthash].js",

        ...entryPointsGroupSettings.distributing?.exposingOfExportsFromEntryPoints.mustExpose === true ? {
          library: {

            type: ((): string => {

              switch (entryPointsGroupSettings.targetRuntime.type) {

                case SupportedECMA_ScriptRuntimesTypes.browser: return "module";
                case SupportedECMA_ScriptRuntimesTypes.nodeJS: return "commonjs";
                case SupportedECMA_ScriptRuntimesTypes.pug: return "umd";

                default: {

                  Logger.throwErrorAndLog({
                    errorInstance: new UnexpectedEventError(
                      "The web worker could not be the library, while the computing of 'output.library.type' has been " +
                      "requested"
                    ),
                    title: UnexpectedEventError.localization.defaultTitle,
                    occurrenceLocation: "webpackConfigGenerator." +
                        "generateSingleWebpackConfigurationIfAtLeastOneTargetEntryPointFileExists(entryPointsGroupSettings)"
                  });

                }

              }
            })(),

            ...willNodeJS_LibraryBeBuilt || willPugLibraryBeBuilt ? {
              name: entryPointsGroupSettings.distributing.exposingOfExportsFromEntryPoints.namespace
            } : null
          }
        } : null,

        ...willPugLibraryBeBuilt ? { globalObject: "globalThis" } : null
      },

      ...willBrowserJS_LibraryBeBuilt ? { experiments: { outputModule: true } } : null,

      mode: this.masterConfigRepresentative.isStaticPreviewBuildingMode ||
          this.masterConfigRepresentative.isLocalDevelopmentBuildingMode ?
              "development" : "production",

      watch: this.masterConfigRepresentative.isStaticPreviewBuildingMode ||
          this.masterConfigRepresentative.isLocalDevelopmentBuildingMode,

      devtool: this.masterConfigRepresentative.isStaticPreviewBuildingMode ||
          this.masterConfigRepresentative.isLocalDevelopmentBuildingMode ?
              "eval" : false,

      ...entryPointsGroupSettings.targetRuntime.type === SupportedECMA_ScriptRuntimesTypes.nodeJS ? {
        node: {
          __dirname: true,
          __filename: true
        }
      } : null,

      module: {
        rules: [

          /* --- Logic ---------------------------------------------------------------------------------------------- */
          {
            test: /\.tsx?$/u,
            loader: "ts-loader",
            options: {

              ...isNotUndefined(entryPointsGroupSettings.typeScriptConfigurationFileAbsolutePath) ? {
                configFile: entryPointsGroupSettings.typeScriptConfigurationFileAbsolutePath
              } : {},

              /* [ Theory ] This option allows TypeScript to process the code extracted from a single file component.
               * [ Reference ] https://github.com/Microsoft/TypeScript-Vue-Starter#single-file-components */
              appendTsSuffixTo: [ /\.vue$/u ]
            }
          },

          {
            test: /\.vue$/u,
            loader: "vue-loader"
          },


          /* --- Data ----------------------------------------------------------------------------------------------- */
          {
            test: /\.json5$/u,
            loader: "json5-loader"
          },

          {
            test: /\.(?:yml|yaml)$/u,
            use: [ "yaml-loader" ]
          },


          /* --- 構造設計記法 ----------------------------------------------------------------------------------------- */
          {
            test: /\.pug$/u,
            oneOf: [
              {
                resourceQuery: /^\?vue/u,
                use: [ "pug-plain-loader" ]
              },
              {
                use: [
                  {
                    loader: "html-loader",
                    options: {

                      /* [ Theory ] Without this option, all capital cases tags (invalid HTML5 vue normal for the Vue
                       * templates loaded externally) will be converted to lower cased.
                       * [ Reference ] https://stackoverflow.com/q/63164597/4818123 */
                      minimize: {
                        caseSensitive: true
                      }
                    }
                  },
                  "pug-html-loader"
                ]
              }
            ]
          },


          /* --- 意匠設計記法 ----------------------------------------------------------------------------------------- */
          {
            test: /\.css$/u,
            oneOf: [
              {
                resourceQuery: /^\?vue/u,
                use: [
                  "vue-style-loader",
                  {
                    loader: "css-loader",
                    options: {
                      modules: true
                    }
                  }
                ]
              },
              {
                use: [
                  "style-loader",
                  "css-loader"
                ]
              }
            ]
          },

          {
            test: /\.styl(?:us)?$/u,
            oneOf: [
              {
                resourceQuery: /^\?vue/u,
                use: [
                  "vue-style-loader",
                  "css-loader",
                  "stylus-loader"
                ]
              },
              {
                use: [
                  "style-loader",
                  "css-loader",
                  "stylus-loader"
                ]
              }
            ]
          }
        ]
      },

      resolve: {

        extensions: this.ECMA_ScriptLogicProcessingConfigRepresentative.
            supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots.
            map((fileNameExtensionWithoutDot: string): string => `.${ fileNameExtensionWithoutDot }`),

        alias: {
          ...this.ECMA_ScriptLogicProcessingConfigRepresentative.absolutePathsOfAliasesOfDirectories,
          vue: "vue/dist/vue.esm-bundler.js"
        }
      },

      resolveLoader: WebpackSpecialist.
          generateLoadersResolvingSettings(this.masterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath),

      ...entryPointsGroupSettings.targetRuntime.type === SupportedECMA_ScriptRuntimesTypes.nodeJS ? {
        externals: [ provideAccessToNodeJS_ExternalDependencies() ]
      } : null,

      plugins: [

        new Webpack.DefinePlugin({

          /* [ Theory ] Settings for the Vue 3 which must be defined explicitly. */
          __VUE_OPTIONS_API__: true,
          __VUE_PROD_DEVTOOLS__: false

        }),

        new ForkTS_CheckerWebpackPlugin({
          typescript: {

            /* [ Theory ] Webpack's "context" is default, but generally "tsconfig.json" could be not in same directory */
            configFile: ((): string => {

              if (isNotUndefined(entryPointsGroupSettings.typeScriptConfigurationFileAbsolutePath)) {
                return entryPointsGroupSettings.typeScriptConfigurationFileAbsolutePath;
              }


              return ImprovedPath.joinPathSegments(
                [
                  this.masterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath,
                  "tsconfig.json"
                ],
                { forwardSlashOnlySeparators: true }
              );

            })(),

            extensions: {
              vue: {
                enabled: true,
                compiler: "@vue/compiler-sfc"
              }
            }
          }
        }),

        new VueLoaderWebpackPlugin(),

        new ES_LintWebpackPlugin({
          extensions: [ "js", "ts", "jsx", "tsx", "vue" ],
          failOnError: this.masterConfigRepresentative.isStagingBuildingMode ||
              this.masterConfigRepresentative.isProductionBuildingMode,
          failOnWarning: this.masterConfigRepresentative.isStagingBuildingMode ||
              this.masterConfigRepresentative.isProductionBuildingMode
        })
      ],


      optimization: {
        minimize: this.masterConfigRepresentative.isStagingBuildingMode ||
            this.masterConfigRepresentative.isProductionBuildingMode,
        emitOnErrors: this.masterConfigRepresentative.isStaticPreviewBuildingMode ||
            this.masterConfigRepresentative.isLocalDevelopmentBuildingMode
      }
    };
  }


  /* [ Webpack theory ] 'publicPath' computing
   *
   * 1. For the production building mode, just "/" is enough.
   *    For the development building mode, everything must work without development server otherwise the customer
   *    could not check the application just by opening the HTML files ("/" will be resolved to the root of current hard drive).
   *    The known solution is the relative path: it is required to match the path where Webpack chunks are being outputted
   *    and the path where Webpack chunks are being searched (initially it could be different paths).

   * 2. Chunks has been outputted to　'output.path'　+　'output.chunkFilename'.
   *    For example, if 'output.path' is
   *    D:\\...\\frontend\\01_DevelopmentBuild\\00_Development\\scripts
   *    and 'chunkFilename' are `scripts\load_on_demand/partial__[id].js`,
   *    chinks will be outputted to
   *    D:\\...\\00_Development\\scripts\\scripts\\load_on_demand
   *
   * 3. Chunks will be searched in
   *       [ path at search string of browser ] + publicPath + chunkFilename
   * */
  private computePublicPathIfPossible(
    ECMA_ScriptLogicEntryPointsGroupSettings__normalized: ECMA_ScriptLogicProcessingSettings__Normalized.EntryPointsGroup
  ): string {

    if (
      !this.masterConfigRepresentative.isStaticPreviewBuildingMode &&
      !this.masterConfigRepresentative.isLocalDevelopmentBuildingMode
    ) {
      return "/";
    }


    return ECMA_ScriptLogicEntryPointsGroupSettings__normalized.ID.replace(
      ECMA_ScriptLogicEntryPointsGroupSettings__normalized.ID, "/"
    );
  }


  private static checkForFilesWithSameDirectoryAndFileNameButDifferentExtensions(
    entryPointsSourceFilesAbsolutePaths: Array<string>
  ): void {

    const entryPointsSourceFiles: Set<string> = new Set<string>();

    for (const entryPointSourceFileAbsolutePath of entryPointsSourceFilesAbsolutePaths) {

      const filePathParsingResult: ImprovedPath.ParsedPath = ImprovedPath.parsePath(entryPointSourceFileAbsolutePath);
      const filePathWithoutFilenameExtension: string =
          `${ filePathParsingResult.directory }/${ filePathParsingResult.getFilenameWithoutExtensionWhichExpectedToBeDefined() }`;

      if (entryPointsSourceFiles.has(filePathWithoutFilenameExtension)) {

        Logger.throwErrorAndLog({
          errorType: "IncompatibleFilesError",
          description: "Incompatible files",
          title: UnexpectedEventError.localization.defaultTitle,
          occurrenceLocation: "WebpackConfigGenerator.checkForFilesWithSameDirectoryAndFileNameButDifferentExtensions" +
              "(entryPointsSourceFilesAbsolutePaths)"
        });

      } else {
        entryPointsSourceFiles.add(filePathWithoutFilenameExtension);
      }
    }
  }
}
