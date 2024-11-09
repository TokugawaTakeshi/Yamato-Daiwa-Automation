/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type MarkupProcessingSettings__Normalized from "@MarkupProcessing/MarkupProcessingSettings__Normalized";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type MarkupProcessingSettingsRepresentative from "@MarkupProcessing/MarkupProcessingSettingsRepresentative";

/* ─── Superclass ─────────────────────────────────────────────────────────────────────────────────────────────────── */
import GulpStreamsBasedTaskExecutor from
    "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBased/GulpStreamsBasedTaskExecutor";

/* ─── Shared State ───────────────────────────────────────────────────────────────────────────────────────────────── */
import MarkupProcessingSharedState from "@MarkupProcessing/MarkupProcessingSharedState";

/* ─── Applied Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import createImmediatelyEndingEmptyStream from "@Utils/createImmediatelyEndingEmptyStream";
import Gulp from "gulp";
import type VinylFile from "vinyl";
import extractStringifiedContentFromVinylFile from "@Utils/extractStringifiedContentFromVinylFile";
import GulpStreamModifier from "@Utils/GulpStreamModifier";
import Webpack from "webpack";
import type { Configuration as WebpackConfiguration } from "webpack";
import WebpackVinylAdapter from "webpack-stream";
import WebpackConfigGenerator from "@ECMA_ScriptProcessing/Utils/WebpackConfigGenerator";
import WebpackSpecialist from "@ThirdPartySolutionsSpecialists/WebpackSpecialist";
import type TypeScript from "typescript";
import TypeScriptSpecialist from "@ThirdPartySolutionsSpecialists/TypeScriptSpecialist";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import FileSystem from "fs";
import {
  Logger,
  isNotUndefined,
  isNeitherUndefinedNorNull,
  isUndefined
} from "@yamato-daiwa/es-extensions";
import { FileNotFoundError, ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


export default class CompiledInlineTypeScriptImporterForPug extends GulpStreamsBasedTaskExecutor {

  protected readonly logging: GulpStreamsBasedTaskExecutor.Logging = {
    pathsOfFilesWillBeProcessed: false,
    quantityOfFilesWillBeProcessed: false
  };

  private readonly webpackConfiguration: WebpackConfiguration;

  private readonly typeScriptSourceFileAbsolutePath: string;
  private readonly importedNamespaceName: string;


  public static provideTypeScriptImportsForMarkupIfMust(
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): (callback: () => void) => NodeJS.ReadWriteStream {

    const markupProcessingSettingsRepresentative: MarkupProcessingSettingsRepresentative | undefined =
        projectBuildingMasterConfigRepresentative.markupProcessingSettingsRepresentative;

    if (isUndefined(markupProcessingSettingsRepresentative)) {
      return createImmediatelyEndingEmptyStream();
    }


    const importingFromTypeScriptSettings: MarkupProcessingSettings__Normalized.ImportingFromTypeScript | undefined =
        markupProcessingSettingsRepresentative.importingFromTypeScriptSettings;

    if (isUndefined(importingFromTypeScriptSettings)) {
      return createImmediatelyEndingEmptyStream();
    }

    const dataHoldingSelfInstance: CompiledInlineTypeScriptImporterForPug = new CompiledInlineTypeScriptImporterForPug(
      projectBuildingMasterConfigRepresentative,
      importingFromTypeScriptSettings
    );

    return (callback: () => void): NodeJS.ReadWriteStream => dataHoldingSelfInstance.provideTypeScriptImports(callback);

  }


  private constructor(
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative,
    compiledTypeScriptImportingSettings: MarkupProcessingSettings__Normalized.ImportingFromTypeScript
  ) {

    super({
      projectBuildingMasterConfigRepresentative,
      taskTitleForLogging: "Exporting of TypeScript to Pug"
    });

    const typeScriptCompilerOptions: TypeScript.CompilerOptions = TypeScriptSpecialist.
        readTypeScriptConfigurationFileAndGetCompilerOptions(
          compiledTypeScriptImportingSettings.typeScriptConfigurationFileAbsolutePath
        );

    const webpackAliasesConfiguration: { [ alias: string ]: string | Array<string>; } = WebpackSpecialist.
        convertPathsAliasesFromTypeScriptFormatToWebpackFormat({
          typeScriptPathsSettings: typeScriptCompilerOptions.paths,
          typeScriptBasicAbsolutePath:
              typeScriptCompilerOptions.baseUrl ??
              ImprovedPath.extractDirectoryFromFilePath({
                targetPath: compiledTypeScriptImportingSettings.typeScriptConfigurationFileAbsolutePath,
                alwaysForwardSlashSeparators: true,
                ambiguitiesResolution: {
                  mustConsiderLastSegmentStartingWithDotAsDirectory: false,
                  mustConsiderLastSegmentWithNonLeadingDotAsDirectory: false,
                  mustConsiderLastSegmentWithoutDotsAsFileNameWithoutExtension: false
                }
              })
          });

    if (!FileSystem.existsSync(compiledTypeScriptImportingSettings.sourceFileAbsolutePath)) {
      Logger.throwErrorAndLog({
        errorInstance: new FileNotFoundError({
          customMessage:
              `The TypeScript file "${ compiledTypeScriptImportingSettings.sourceFileAbsolutePath }" for ` +
                "the exporting to Pug was found. " +
              "Please create this file and provide some exports from it."
        }),
        title: FileNotFoundError.localization.defaultTitle,
        occurrenceLocation: "compiledInlineTypeScriptImporterForPug.constructor(...parameters)"
      });
    }

    /** @see https://webpack.js.org/configuration/entry-context/#entry */
    const webpackEntryPointDefinition: Webpack.EntryObject =
        WebpackConfigGenerator.getWebpackEntryObjectRespectiveToExistingEntryPoints({
          entryPointsSourceFilesAbsolutePaths: [ compiledTypeScriptImportingSettings.sourceFileAbsolutePath ],
          webpackContext: projectBuildingMasterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath
        });

    this.webpackConfiguration = CompiledInlineTypeScriptImporterForPug.
        getWebpackEntryObjectRespectiveToSpecifiedEntryPointsGroupSettings({
          webpackEntryPointDefinition,
          compiledTypeScriptImportingSettings,
          projectBuildingMasterConfigRepresentative,
          webpackAliasesConfiguration
        });

    this.typeScriptSourceFileAbsolutePath = compiledTypeScriptImportingSettings.sourceFileAbsolutePath;
    this.importedNamespaceName = compiledTypeScriptImportingSettings.importedNamespace;

  }

  /* [ Theory ]
   * This Gulp task has callback and also returns the stream. Both measures signalize about completion.
   * The main measure is the callback, but if error will occur on first building, the callback will not be called,
   * but the "handleErrorIfItWillOccur" will generate the `on.("end")` event. */
  private provideTypeScriptImports(callback: () => void): NodeJS.ReadWriteStream {

    return Gulp.

        src(this.typeScriptSourceFileAbsolutePath).

        pipe(super.handleErrorIfItWillOccur()).
        pipe(super.logProcessedFilesIfMust()).

        pipe(

          WebpackVinylAdapter(

            this.webpackConfiguration,

            /* @ts-ignore: TS2345 The null as second argument is obeying to README of "webpack-stream" package. */
            null,
            this.onBuildHasCompleted.bind(this)

          )

        ).

        pipe(
          GulpStreamModifier.modify({
            onStreamStartedEventCommonHandler: async (vinylFile: VinylFile): Promise<GulpStreamModifier.CompletionSignals> => {

              const outputJavaScriptCode: string = extractStringifiedContentFromVinylFile(vinylFile);

              MarkupProcessingSharedState.importingFromTypeScriptPugCodeGenerator =
                  (
                    {
                      indentString,
                      lineSeparator,
                      initialIndentationDepth__numerationFrom0
                    }: MarkupProcessingSharedState.ImportingFromTypeScriptPugCodeGenerator.CompoundParameter
                  ): string =>
                      `${ indentString.repeat(initialIndentationDepth__numerationFrom0) }-${ lineSeparator.repeat(2) }` +
                      indentString.repeat(initialIndentationDepth__numerationFrom0 + 1) +
                      `${ outputJavaScriptCode }${ lineSeparator.repeat(2) }` +
                      indentString.repeat(initialIndentationDepth__numerationFrom0 + 1) +
                      `const ${ this.importedNamespaceName } = global.${ this.importedNamespaceName }.default;`;

              /* [ Theory ] The subsequent invocation of the callback will be ignored. */
              callback();

              return Promise.resolve(GulpStreamModifier.CompletionSignals.REMOVING_FILE_FROM_STREAM);

            }
          })
        );

  }


  private onBuildHasCompleted(hardError?: Error | null, statistics?: Webpack.MultiStats): void {

    if (isNeitherUndefinedNorNull(hardError)) {

      /* [ Theory ] In this case, error will be emitted by "webpack-stream". */
      return;

    }


    if (isNotUndefined(statistics)) {

      Logger.logSuccess({
        title: "Injection of transpiled TypeScript to Pug successful",
        description:
            "The TypeScript file has been transpiled and injected to Pug. " +
            `The exported entity stored to "${ this.importedNamespaceName }" variable.`
      });

      process.stdout.write(`${ statistics.toString({ colors: true }) }\n`);

    }

  }


  private static getWebpackEntryObjectRespectiveToSpecifiedEntryPointsGroupSettings(
    {
      webpackEntryPointDefinition,
      compiledTypeScriptImportingSettings,
      projectBuildingMasterConfigRepresentative,
      webpackAliasesConfiguration
    }: Readonly<{
      webpackEntryPointDefinition: Webpack.EntryObject;
      compiledTypeScriptImportingSettings: MarkupProcessingSettings__Normalized.ImportingFromTypeScript;
      projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
      webpackAliasesConfiguration: Readonly<{ [ alias: string ]: string | Array<string>; }>;
    }>
  ): WebpackConfiguration {

    return {

      entry: webpackEntryPointDefinition,

      output: {
        library: {
          type: "umd",
          name: compiledTypeScriptImportingSettings.importedNamespace
        },
        globalObject: "globalThis"
      },

      watch: projectBuildingMasterConfigRepresentative.mustProvideIncrementalBuilding,
      mode: "production",
      optimization: { minimize: true },

      module: {
        rules: [
          {
            test: /\.ts$/u,
            loader: "ts-loader",
            options: {
              transpileOnly: true
            }
          }
        ]
      },

      resolve: {
        extensions: [ ".ts", ".js" ],
        alias: webpackAliasesConfiguration
      },

      resolveLoader: WebpackSpecialist.
          generateLoadersResolvingSettings(projectBuildingMasterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath),

      plugins: [
        new Webpack.DefinePlugin({
          __IS_LOCAL_DEVELOPMENT_BUILDING_MODE__: projectBuildingMasterConfigRepresentative.isLocalDevelopmentBuildingMode,
          __IS_TESTING_BUILDING_MODE__: projectBuildingMasterConfigRepresentative.isTestingBuildingMode,
          __IS_STAGING_BUILDING_MODE__: projectBuildingMasterConfigRepresentative.isStagingBuildingMode,
          __IS_PRODUCTION_BUILDING_MODE__: projectBuildingMasterConfigRepresentative.isProductionBuildingMode
        })
      ]
    };

  }

}
