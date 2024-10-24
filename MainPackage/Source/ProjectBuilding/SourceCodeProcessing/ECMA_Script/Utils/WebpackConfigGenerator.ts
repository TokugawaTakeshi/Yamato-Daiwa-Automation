/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import ECMA_ScriptLogicProcessingRestrictions from "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingRestrictions";
import SupportedECMA_ScriptRuntimesTypes = ECMA_ScriptLogicProcessingRestrictions.SupportedECMA_ScriptRuntimesTypes;

/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type ECMA_ScriptLogicProcessingSettings__Normalized from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettings__Normalized";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type ECMA_ScriptLogicProcessingSettingsRepresentative from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettingsRepresentative";

/* ─── Third-party Solutions Specialists ──────────────────────────────────────────────────────────────────────────── */
import WebpackSpecialist from "@ThirdPartySolutionsSpecialists/WebpackSpecialist";
import TypeScriptSpecialist from "@ThirdPartySolutionsSpecialists/TypeScriptSpecialist";

/* ─── Applied Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import Webpack from "webpack";
import type { Configuration as WebpackConfiguration } from "webpack";
import type TypeScript from "typescript";
import { VueLoaderPlugin as VueLoaderWebpackPlugin } from "vue-loader";
import ForkTS_CheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import provideAccessToNodeJS_ExternalDependencies from "webpack-node-externals";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import Path from "path";
import {
  isUndefined,
  isNotUndefined,
  insertSubstringIf,
  removeAllFileNameExtensions,
  Logger,
  UnexpectedEventError
} from "@yamato-daiwa/es-extensions";
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


/* [ Approach ] Because of serious performance impact, the file watching has been delegated to external watcher. */
export default abstract class WebpackConfigGenerator {

  private static readonly cachedTypeScriptConfigurations: {
    [typeScriptConfigurationFileAbsolutePath: string]: TypeScript.CompilerOptions | undefined;
  } = {};

  /* [ Approach ] Although the parameter is excessive, its properties are been pre-computed externally for other needs,
   *   so no need to compute them again. */
  public static generateWebpackConfigurationForEntryPointsGroupWithExistingFiles(
    {
      entryPointsSourceFilesAbsolutePaths,
      ECMA_ScriptLogicEntryPointsGroupSettings: entryPointsGroupSettings,
      ECMA_ScriptLogicProcessingConfigRepresentative,
      masterConfigRepresentative,
      mustProvideTypeScriptTypeChecking
    }: Readonly<{
      entryPointsSourceFilesAbsolutePaths: ReadonlyArray<string>;
      ECMA_ScriptLogicEntryPointsGroupSettings: ECMA_ScriptLogicProcessingSettings__Normalized.EntryPointsGroup;
      ECMA_ScriptLogicProcessingConfigRepresentative: ECMA_ScriptLogicProcessingSettingsRepresentative;
      masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
      mustProvideTypeScriptTypeChecking: boolean;
    }>
  ): WebpackConfiguration {

    /* [ Reference ] https://webpack.js.org/configuration/entry-context/#context */
    const sourceFilesTopDirectoryAbsolutePath: string = entryPointsGroupSettings.sourceFilesTopDirectoryAbsolutePath;

    /** @see https://webpack.js.org/configuration/entry-context/#entry */
    const webpackEntryPointsDefinition: Webpack.EntryObject =
        WebpackConfigGenerator.getWebpackEntryObjectRespectiveToExistingEntryPoints(
          { entryPointsSourceFilesAbsolutePaths, webpackContext: sourceFilesTopDirectoryAbsolutePath }
        );

    let typeScriptCompilerOptions: TypeScript.CompilerOptions;
    const cachedTypeScriptCompilerOptions: TypeScript.CompilerOptions | undefined = WebpackConfigGenerator.
        cachedTypeScriptConfigurations[entryPointsGroupSettings.typeScriptConfigurationFileAbsolutePath];

    if (isUndefined(cachedTypeScriptCompilerOptions)) {

      typeScriptCompilerOptions = TypeScriptSpecialist.readTypeScriptConfigurationFileAndGetCompilerOptions(
        entryPointsGroupSettings.typeScriptConfigurationFileAbsolutePath
      );

      this.cachedTypeScriptConfigurations[entryPointsGroupSettings.typeScriptConfigurationFileAbsolutePath] =
          typeScriptCompilerOptions;

    } else {

      typeScriptCompilerOptions = cachedTypeScriptCompilerOptions;

    }


    const webpackPublicPath: string = WebpackConfigGenerator.computePublicPath(
      entryPointsGroupSettings, masterConfigRepresentative
    );

    const willBrowserJS_LibraryBeBuilt: boolean =
        entryPointsGroupSettings.distributing?.exposingOfExportsFromEntryPoints.mustExpose === true &&
        entryPointsGroupSettings.targetRuntime.type === SupportedECMA_ScriptRuntimesTypes.browser;

    const willNodeJS_LibraryBeBuilt: boolean =
        entryPointsGroupSettings.distributing?.exposingOfExportsFromEntryPoints.mustExpose === true &&
        entryPointsGroupSettings.targetRuntime.type === SupportedECMA_ScriptRuntimesTypes.nodeJS;

    const willPugLibraryBeBuilt: boolean =
        entryPointsGroupSettings.distributing?.exposingOfExportsFromEntryPoints.mustExpose === true &&
        entryPointsGroupSettings.targetRuntime.type === SupportedECMA_ScriptRuntimesTypes.pug;

    const distributingSettings: ECMA_ScriptLogicProcessingSettings__Normalized.EntryPointsGroup.Distributing | undefined =
        entryPointsGroupSettings.distributing;

    // TODO Is entryPointsGroupSettings.directoriesAliasesAndCorrespondingAbsolutePathsMap related
    return {

      name: entryPointsGroupSettings.ID,

      /* [ Webpack theory ] In this case, path separators must be operating system dependent, otherwise following error
       *    will be thrown: `configuration[0].context: The provided value "D:/OSPanel/../01_Open" is not an absolute path!` */
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
                insertSubstringIf(
                  `.${ entryPointsGroupSettings.targetRuntime.minimalVersion.minor }`,
                  isNotUndefined(entryPointsGroupSettings.targetRuntime.minimalVersion.minor)
                );
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

                case SupportedECMA_ScriptRuntimesTypes.browser:
                  return entryPointsGroupSettings.distributing.exposingOfExportsFromEntryPoints.mustAssignToWindowObject ?
                      "window" : "module";

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

      ...isNotUndefined(distributingSettings) && distributingSettings.externalizingDependencies.length > 0 ? {
        externals: distributingSettings.externalizingDependencies.
            reduce(
              (
                accumulatingObject: { [packageName: string]: string; }, packageName: string
              ): { [packageName: string]: string; } => {
                accumulatingObject[packageName] = packageName;
                return accumulatingObject;
              },
              {}
            )
      } : null,

      ...willBrowserJS_LibraryBeBuilt ? { experiments: { outputModule: true } } : null,

      mode: masterConfigRepresentative.mustProvideIncrementalBuilding ?
              "development" : "production",

      /* [ Theory ] Although "cheap-module-source-map" causes both slow first building and slow rebuilding,
       *   faster alternatives including "eval" could cause the errors related with security.
       *   See https://stackoverflow.com/a/49100966. */
      devtool: masterConfigRepresentative.mustProvideIncrementalBuilding ? "cheap-module-source-map" : false,

      ...entryPointsGroupSettings.targetRuntime.type === SupportedECMA_ScriptRuntimesTypes.nodeJS ? {
        node: {
          __dirname: true,
          __filename: true
        }
      } : null,

      module: {
        rules: [

          /* ━━━ Logic ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
          {
            test: /\.tsx?$/u,
            loader: "ts-loader",
            options: {

              configFile: entryPointsGroupSettings.typeScriptConfigurationFileAbsolutePath,

              /* [ Theory ] This option allows TypeScript to process the code extracted from a single file component.
               * [ Reference ] https://github.com/Microsoft/TypeScript-Vue-Starter#single-file-components */
              appendTsSuffixTo: [ /\.vue$/u ]

            }
          },

          {
            test: /\.vue$/u,
            loader: "vue-loader"
          },


          /* ━━━ Data ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
          {
            test: /\.json5$/u,
            loader: "json5-loader"
          },

          {
            test: /\.(?:yml|yaml)$/u,
            use: [ "yaml-loader" ]
          },


          /* ━━━ Markup ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
          {
            test: /\.pug$/u,
            oneOf: [

              {
                resourceQuery: /^\?vue/u,
                loader: "@webdiscus/pug-loader",
                options: { mode: "html" }
              },

              {
                test: /\.renderer\.pug$/u,
                loader: "@webdiscus/pug-loader",
                options: { mode: "compile" }
              },

              {
                test: /\.ydfr\.pug$/u,
                loader: "pug3-ast-loader"
              },

              {
                loader: "@webdiscus/pug-loader",
                options: { mode: "render" }
              }

            ]
          },


          /* ━━━ Styles ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
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

        extensions: ECMA_ScriptLogicProcessingConfigRepresentative.
            supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots.
            map((fileNameExtensionWithoutDot: string): string => `.${ fileNameExtensionWithoutDot }`),

        alias: {
          ...WebpackSpecialist.convertPathsAliasesFromTypeScriptFormatToWebpackFormat({
            typeScriptPathsSettings: typeScriptCompilerOptions.paths,
            typeScriptBasicAbsolutePath:
                typeScriptCompilerOptions.baseUrl ??
                ImprovedPath.extractDirectoryFromFilePath({
                  targetPath: entryPointsGroupSettings.typeScriptConfigurationFileAbsolutePath,
                  ambiguitiesResolution: {
                    mustConsiderLastSegmentStartingWithDotAsDirectory: false,
                    mustConsiderLastSegmentWithNonLeadingDotAsDirectory: false,
                    mustConsiderLastSegmentWihtoutDotsAsFileNameWithoutExtension: true
                  },
                  alwaysForwardSlashSeparators: true
                })
          }),
          ...entryPointsGroupSettings.targetRuntime.type === SupportedECMA_ScriptRuntimesTypes.browser ?
              { vue: "vue/dist/vue.esm-bundler.js" } : null
        }
      },

      resolveLoader: WebpackSpecialist.
          generateLoadersResolvingSettings(masterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath),

      ...entryPointsGroupSettings.targetRuntime.type === SupportedECMA_ScriptRuntimesTypes.nodeJS ? {
        externals: [ provideAccessToNodeJS_ExternalDependencies() ]
      } : null,

      plugins: [

        new Webpack.DefinePlugin({

          __IS_LOCAL_DEVELOPMENT_BUILDING_MODE__: masterConfigRepresentative.isLocalDevelopmentBuildingMode,
          __IS_TESTING_BUILDING_MODE__: masterConfigRepresentative.isTestingBuildingMode,
          __IS_STAGING_BUILDING_MODE__: masterConfigRepresentative.isStagingBuildingMode,
          __IS_PRODUCTION_BUILDING_MODE__: masterConfigRepresentative.isProductionBuildingMode,

          /* [ Theory ] Settings for the Vue 3 which must be defined explicitly.
          * https://github.com/vuejs/core/tree/main/packages/vue#bundler-build-feature-flags */
          ...entryPointsGroupSettings.targetRuntime.type === SupportedECMA_ScriptRuntimesTypes.browser ? {
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: false,
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
          } : null

        }),

        /* < === Temporary ========================================================================================== */
        ...mustProvideTypeScriptTypeChecking ?
            [
              new ForkTS_CheckerWebpackPlugin({
                typescript: {

                  /* [ Theory ] Webpack's "context" is default, but generally "tsconfig.json" could be not in same directory */
                  configFile: entryPointsGroupSettings.typeScriptConfigurationFileAbsolutePath,

                  extensions: {
                    vue: {
                      enabled: true,
                      compiler: "@vue/compiler-sfc"
                    }
                  }
                }
              })
            ] :
            [],

        /* === Temporary > ========================================================================================== */

        new VueLoaderWebpackPlugin()

      ],

      optimization: {
        minimize: !masterConfigRepresentative.mustProvideIncrementalBuilding,
        emitOnErrors: masterConfigRepresentative.mustProvideIncrementalBuilding
      }

    };

  }

  public static getWebpackEntryObjectRespectiveToExistingEntryPoints(
    {
      entryPointsSourceFilesAbsolutePaths,
      webpackContext
    }: Readonly<{
      entryPointsSourceFilesAbsolutePaths: ReadonlyArray<string>;
      webpackContext: string;
    }>
  ): Webpack.EntryObject {

    /* [ Reference ] https://webpack.js.org/configuration/entry-context/#entry */
    const webpackEntryPoints__objectSyntax: Webpack.EntryObject = {};

    WebpackConfigGenerator.
        checkForFilesWithSameDirectoryAndFileNameButDifferentExtensions(entryPointsSourceFilesAbsolutePaths);

    for (const entryPointSourceFileAbsolutePath of entryPointsSourceFilesAbsolutePaths) {

      const targetSourceFilePathRelativeToSourceEntryPointsTopDirectory: string = ImprovedPath.
          computeRelativePath({
            comparedPath: entryPointSourceFileAbsolutePath,
            basePath: webpackContext
          });

      const outputFilePathWithoutFilenameExtensionRelativeToBaseOutputDirectory: string =
          removeAllFileNameExtensions(targetSourceFilePathRelativeToSourceEntryPointsTopDirectory);

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


  /* [ Webpack theory ] 'publicPath' computing
   *
   * 1. For the production-like building modes, just "/" is enough.
   *    For the incremental building modes, everything must work without development server otherwise the customer
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
  private static computePublicPath(
    ECMA_ScriptLogicEntryPointsGroupSettings__normalized: ECMA_ScriptLogicProcessingSettings__Normalized.EntryPointsGroup,
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): string {

    return masterConfigRepresentative.mustProvideIncrementalBuilding ?
        ECMA_ScriptLogicEntryPointsGroupSettings__normalized.ID.replace(
          ECMA_ScriptLogicEntryPointsGroupSettings__normalized.ID, "/"
        ) :
        "/";

  }

  private static checkForFilesWithSameDirectoryAndFileNameButDifferentExtensions(
    entryPointsSourceFilesAbsolutePaths: ReadonlyArray<string>
  ): void {

    const entryPointsSourceFiles: Set<string> = new Set<string>();

    for (const entryPointSourceFileAbsolutePath of entryPointsSourceFilesAbsolutePaths) {

      const filePathWithoutFilenameExtension: string = removeAllFileNameExtensions(entryPointSourceFileAbsolutePath);

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
