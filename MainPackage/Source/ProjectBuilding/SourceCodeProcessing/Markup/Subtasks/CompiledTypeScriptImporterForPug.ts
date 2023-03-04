/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type MarkupProcessingSettings__Normalized from "@MarkupProcessing/MarkupProcessingSettings__Normalized";

/* --- Settings representatives ------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type MarkupProcessingSettingsRepresentative from "@MarkupProcessing/MarkupProcessingSettingsRepresentative";

/* --- Tasks executors ---------------------------------------------------------------------------------------------- */
import GulpStreamsBasedTaskExecutor from
    "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBased/GulpStreamsBasedTaskExecutor";

/* --- Applied utils ------------------------------------------------------------------------------------------------ */
import createImmediatelyEndingEmptyStream from "@Utils/createImmediatelyEndingEmptyStream";
import Gulp from "gulp";
import type VinylFile from "vinyl";
import extractStringifiedContentFromVinylFile from "@Utils/extractStringifiedContentFromVinylFile";
import GulpStreamModifier from "@Utils/GulpStreamModifier";
import type Webpack from "webpack";
import type { Configuration as WebpackConfiguration } from "webpack";
import WebpackVinylAdapter from "webpack-stream";
import WebpackConfigGenerator from "@ECMA_ScriptProcessing/Utils/WebpackConfigGenerator";
import WebpackSpecialist from "@ThirdPartySolutionsSpecialists/WebpackSpecialist";
import ForkTS_CheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import type TypeScript from "typescript";
import TypeScriptSpecialist from "@ThirdPartySolutionsSpecialists/TypeScriptSpecialist";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import {
  isNotNull,
  isNotUndefined,
  isNeitherUndefinedNorNull,
  isNull,
  isUndefined
} from "@yamato-daiwa/es-extensions";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";


export default class CompiledInlineTypeScriptImporterForPug extends GulpStreamsBasedTaskExecutor {

  protected readonly TASK_NAME_FOR_LOGGING: string;
  protected readonly SUBTASK_NAME_FOR_LOGGING: string = "Importing from TypeScript";

  private readonly markupProcessingSettingsRepresentative: MarkupProcessingSettingsRepresentative;

  private readonly webpackConfigurationForEachTypeScriptFile: Array<WebpackConfiguration>;

  private hasFirstBuildCompleted: boolean = false;


  public static provideTypeScriptImportsForMarkupIfMust(
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): (callback: () => void) => NodeJS.ReadWriteStream {

    if (!masterConfigRepresentative.isStaticPreviewBuildingMode) {
      return createImmediatelyEndingEmptyStream();
    }


    const markupProcessingSettingsRepresentative: MarkupProcessingSettingsRepresentative | undefined =
        masterConfigRepresentative.markupProcessingSettingsRepresentative;

    if (isUndefined(markupProcessingSettingsRepresentative)) {
      return createImmediatelyEndingEmptyStream();
    }


    const compiledTypeScriptImportingSettings: MarkupProcessingSettings__Normalized.StaticPreview.
        ImportsFromCompiledTypeScript | undefined = markupProcessingSettingsRepresentative.compiledTypeScriptImportingSettings;

    if (isUndefined(compiledTypeScriptImportingSettings)) {
      return createImmediatelyEndingEmptyStream();
    }


    const dataHoldingSelfInstance: CompiledInlineTypeScriptImporterForPug = new CompiledInlineTypeScriptImporterForPug(
      masterConfigRepresentative,
      markupProcessingSettingsRepresentative,
      compiledTypeScriptImportingSettings
    );

    return (callback: () => void): NodeJS.ReadWriteStream => dataHoldingSelfInstance.provideTypeScriptImports(callback);

  }


  private constructor(
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative,
    markupProcessingSettingsRepresentative: MarkupProcessingSettingsRepresentative,
    compiledTypeScriptImportingSettings: MarkupProcessingSettings__Normalized.StaticPreview.ImportsFromCompiledTypeScript
  ) {

    super(masterConfigRepresentative);

    this.markupProcessingSettingsRepresentative = markupProcessingSettingsRepresentative;
    this.TASK_NAME_FOR_LOGGING = this.markupProcessingSettingsRepresentative.TASK_NAME_FOR_LOGGING;

    const typeScriptCompilerOptions: TypeScript.CompilerOptions = TypeScriptSpecialist.
        readTypeScriptConfigurationFileAndGetCompilerOptions(
          compiledTypeScriptImportingSettings.typeScriptConfigurationFileAbsolutePath
        );

    const webpackAliasesConfiguration: { [ alias: string ]: string | Array<string>; } = WebpackSpecialist.
        convertPathsAliasesFromTypeScriptFormatToWebpackFormat({
          typeScriptPathsSettings: typeScriptCompilerOptions.paths,
          typeScriptBasicAbsolutePath:
              typeScriptCompilerOptions.baseUrl ??
              ImprovedPath.extractDirectoryFromFilePath(
                compiledTypeScriptImportingSettings.typeScriptConfigurationFileAbsolutePath
              )
          });

    const webpackConfigurationForEachTypeScriptFile: Array<WebpackConfiguration> = [];

    for (const importFromCompiledTypeScriptFileSettings of compiledTypeScriptImportingSettings.files) {

      const webpackConfigurationForCurrentTypeScriptFile: WebpackConfiguration | null =
          CompiledInlineTypeScriptImporterForPug.getWebpackEntryObjectRespectiveToSpecifiedEntryPointsGroupSettings({
            importFromCompiledTypeScriptFileSettings,
            consumingProjectRootDirectoryAbsolutePath: this.masterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath,
            webpackAliasesConfiguration
          });

      if (isNotNull(webpackConfigurationForCurrentTypeScriptFile)) {
        webpackConfigurationForEachTypeScriptFile.push(webpackConfigurationForCurrentTypeScriptFile);
      }

    }

    this.webpackConfigurationForEachTypeScriptFile = webpackConfigurationForEachTypeScriptFile;

  }

  /* [ Theory ]
   * This Gulp task has callback and also returns the stream. Both measures signalize about completion.
   * The main measure is the callback, but if error will occur on first building, the callback will not be called,
   * but the "handleErrorIfItWillOccur" will generate the `on.("end")` event. */
  private provideTypeScriptImports(callback: () => void): NodeJS.ReadWriteStream {

    return Gulp.

        src(this.markupProcessingSettingsRepresentative.importedTypeScriptSourceFilesAbsolutePaths).

        pipe(super.printProcessedFilesPathsAndQuantity({ subtaskName: this.SUBTASK_NAME_FOR_LOGGING })).
        pipe(super.handleErrorIfItWillOccur({ subtaskName: this.SUBTASK_NAME_FOR_LOGGING })).

        pipe(

          WebpackVinylAdapter(

            this.webpackConfigurationForEachTypeScriptFile[0],

            /* @ts-ignore: TS2345 The null as second argument is obeys to README of "webpck-stream" package. */
            null,
            this.onFirstBuildHasCompleted.bind(this)

          )

        ).

        pipe(GulpStreamModifier.modify({
          onStreamStartedEventCommonHandler: async (vinylFile: VinylFile): Promise<GulpStreamModifier.CompletionSignals> => {

            /* [ Theory ] In this case, the "vinylFile.path" will be absolute. */
            const importedNamespace: string = this.markupProcessingSettingsRepresentative.
                getTypeScriptImportingSettingsExpectedToExistForSpecificOutputJavaScriptFile(
                  ImprovedPath.replacePathSeparatorsToForwardSlashes(vinylFile.path)
                ).importedNamespace;

            const outputJavaScriptCode: string = extractStringifiedContentFromVinylFile(vinylFile);

            vinylFile.contents = Buffer.from(
              `-\n\t${ outputJavaScriptCode }\n\n` +
              `\tconst ${ importedNamespace } = global.${ importedNamespace }.default;\n`
            );

            vinylFile.extname = ".pug";

            return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);

          }
        })).

        pipe(Gulp.dest(this.masterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath)).

        on("data", (): void => {

          /* [ Theory ] The subsequent invocation of the callback will be ignored. */
          if (this.hasFirstBuildCompleted) {
            callback();
          }

        });

  }


  private onFirstBuildHasCompleted(hardError?: Error | null, statistics?: Webpack.MultiStats): void {

    this.hasFirstBuildCompleted = true;

    if (isNeitherUndefinedNorNull(hardError)) {

      /* [ Theory ] In this case, error will be emitted by "webpack-stream"/ */
      return;

    }


    if (isNotUndefined(statistics)) {
      process.stdout.write(`${ statistics.toString({ colors: true }) }\n`);
    }

  }


  private static getWebpackEntryObjectRespectiveToSpecifiedEntryPointsGroupSettings(
    {
      importFromCompiledTypeScriptFileSettings,
      consumingProjectRootDirectoryAbsolutePath,
      webpackAliasesConfiguration
    }: Readonly<{
      importFromCompiledTypeScriptFileSettings: MarkupProcessingSettings__Normalized.StaticPreview.
          ImportsFromCompiledTypeScript.FileMetadata;
      consumingProjectRootDirectoryAbsolutePath: string;
      webpackAliasesConfiguration: Readonly<{ [ alias: string ]: string | Array<string>; }>;
    }>
  ): WebpackConfiguration | null {

    /** @see https://webpack.js.org/configuration/entry-context/#entry */
    const webpackEntryPointDefinition: Webpack.EntryObject | null =
        WebpackConfigGenerator.getWebpackEntryObjectRespectiveToSpecifiedEntryPointsGroupSettings(
          {
            entryPointsGroupID: importFromCompiledTypeScriptFileSettings.importedNamespace,
            sourceFilesGlobSelectors: [ importFromCompiledTypeScriptFileSettings.sourceFileAbsolutePath ],
            webpackContext: consumingProjectRootDirectoryAbsolutePath
          }
        );

    if (isNull(webpackEntryPointDefinition)) {
      return null;
    }


    return {

      entry: webpackEntryPointDefinition,

      output: {
        library: {
          type: "umd",
          name: importFromCompiledTypeScriptFileSettings.importedNamespace
        },
        globalObject: "globalThis"
      },

      watch: true,
      mode: "production",
      optimization: { minimize: true },

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
        alias: webpackAliasesConfiguration
      },

      resolveLoader: WebpackSpecialist.generateLoadersResolvingSettings(consumingProjectRootDirectoryAbsolutePath),

      plugins: [
        new ForkTS_CheckerWebpackPlugin()
      ]

    };

  }

}
