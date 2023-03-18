/* --- Settings representative -------------------------------------------------------------------------------------- */
import type MarkupProcessingSettingsRepresentative from "@MarkupProcessing/MarkupProcessingSettingsRepresentative";
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";

/* --- Abstractions ------------------------------------------------------------------------------------------------- */
import GulpStreamsBasedSourceCodeLinter from
    "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBased/SourceCodeLinter/GulpStreamsBasedSourceCodeLinter";

/* --- Applied utils ------------------------------------------------------------------------------------------------ */
import Gulp from "gulp";
import PugLint from "pug-lint";
import PugLintConfigFile from "pug-lint/lib/config-file";
import gulpIf from "gulp-if";
import type VinylFile from "vinyl";
import GulpStreamModifier from "@Utils/GulpStreamModifier";
import createImmediatelyEndingEmptyStream from "@Utils/createImmediatelyEndingEmptyStream";
import { obj as combineObjectStreams } from "stream-combiner2";
import DotYDA_DirectoryManager from "@Utils/DotYDA_DirectoryManager";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import FileSystem from "fs";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";
import ImprovedGlob from "@UtilsIncubator/ImprovedGlob";
import {
  RawObjectDataProcessor,
  PoliteErrorsMessagesBuilder,
  Logger,
  InvalidExternalDataError,
  InvalidConfigError,
  ConfigFileNotFoundError,
  isNonEmptyArray,
  isUndefined,
  isNotUndefined,
  insertSubstring,
  stringifyAndFormatArbitraryValue
} from "@yamato-daiwa/es-extensions";
import extractSubstring from "@UtilsIncubator/extractSubstring";
import type { ErrorLog } from "@yamato-daiwa/es-extensions";
import { ObjectDataFilesProcessor } from "@yamato-daiwa/es-extensions-nodejs";

/* --- Localization ------------------------------------------------------------------------------------------------- */
import markupSourceCodeLinterLocalization__english from
    "@MarkupProcessing/Subtasks/Linting/MarkupSourceCodeLinterLocalization.english";


class MarkupSourceCodeLinter extends GulpStreamsBasedSourceCodeLinter {

  public static localization: MarkupSourceCodeLinter.Localization = markupSourceCodeLinterLocalization__english;

  private static readonly LINTING_OPTIMIZATIONS_FILE_NAME_WITH_EXTENSION: string = "MarkupLintingCache.json";
  private static readonly cachedLintingResultsFileContentSpecification: RawObjectDataProcessor.
      AssociativeArrayOfUniformValuesTypeDataSpecification =
      {
        subtype: RawObjectDataProcessor.ObjectSubtypes.associativeArray,
        nameForLogging: "CachedMarkupLintingResultsFileContent",
        value: {
          type: Object,
          properties: {
            issues: {
              type: Array,
              required: true,
              element: {
                type: Object,
                properties: {
                  code: {
                    type: String,
                    required: true,
                    minimalCharactersCount: 1
                  },
                  message: {
                    type: String,
                    required: true,
                    minimalCharactersCount: 1
                  },
                  sourceListing: {
                    type: String,
                    required: true
                  },
                  lineNumber: {
                    type: Number,
                    required: true,
                    numbersSet: RawObjectDataProcessor.NumbersSets.nonNegativeInteger
                  },
                  columnNumber: {
                    type: Number,
                    required: false,
                    numbersSet: RawObjectDataProcessor.NumbersSets.nonNegativeInteger
                  }
                }
              }
            },
            modificationDatetime__ISO_8601: {
              type: String,
              required: true,
              minimalCharactersCount: 1
            }
          }
        }
      };

  private static readonly DISPLAYING_LINES_COUNT_BEFORE_ISSUE_IN_CODE_LISTING: number = 2;
  private static readonly DISPLAYING_LINES_COUNT_AFTER_ISSUE_IN_CODE_LISTING: number = 1;


  protected readonly targetFilesGlobSelectors: Array<string>;
  protected readonly TASK_NAME_FOR_LOGGING: string;
  protected readonly SUBTASK_NAME_FOR_LOGGING: string = "Markup linting";
  protected readonly LINTER_NAME: string = "Markup source files linter";

  private readonly pugLintInstance: PugLint = new PugLint();
  private readonly pugLintConfig: PugLint.Config;

  private readonly CACHED_LINTING_RESULTS_FILE_ABSOLUTE_PATH: string;
  private cachedLintingResults: MarkupSourceCodeLinter.CachedLintingResults;


  public static provideMarkupLintingIfMust(
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): () => NodeJS.ReadWriteStream {

    const markupProcessingSettingsRepresentative: MarkupProcessingSettingsRepresentative | undefined =
        masterConfigRepresentative.markupProcessingSettingsRepresentative;

    if (isUndefined(markupProcessingSettingsRepresentative)) {
      return createImmediatelyEndingEmptyStream();
    }


    const pugLintConfig: PugLint.Config | undefined = PugLintConfigFile.load();

    if (isUndefined(pugLintConfig)) {

      Logger.logError({
        errorType: ConfigFileNotFoundError.NAME,
        title: MarkupSourceCodeLinter.localization.pugLintFileNotFoundErrorLog.title,
        description: ConfigFileNotFoundError.localization.generateDescription({
          targetTechnologyName: "pug-lint",
          configFilePathOrMultipleOfThem: [ ".pug-lintrc", ".pug-lintrc.js", ".pug-lintrc.json", "package.json[pugLintConfig]" ],
          messageSpecificPart: MarkupSourceCodeLinter.localization.pugLintFileNotFoundErrorLog.
              pugLintConfigurationFileRequirementExplanation
        }),
        occurrenceLocation: "MarkupSourceCodeLinter.provideMarkupLintingIfMust(masterConfigRepresentative)"
      });

      return createImmediatelyEndingEmptyStream();

    }


    const dataHoldingSelfInstance: MarkupSourceCodeLinter = new MarkupSourceCodeLinter({
      masterConfigRepresentative,
      markupProcessingSettingsRepresentative,
      pugLintConfig
    });

    return dataHoldingSelfInstance.lint(dataHoldingSelfInstance.targetFilesGlobSelectors);

  }


  private constructor(
    {
      masterConfigRepresentative,
      markupProcessingSettingsRepresentative,
      pugLintConfig
    }: Readonly<{
      masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
      markupProcessingSettingsRepresentative: MarkupProcessingSettingsRepresentative;
      pugLintConfig: PugLint.Config;
    }>
  ) {

    super(masterConfigRepresentative);

    this.CACHED_LINTING_RESULTS_FILE_ABSOLUTE_PATH = ImprovedPath.joinPathSegments(
      [
        DotYDA_DirectoryManager.OPTIMIZATION_FILES_DIRECTORY_ABSOLUTE_PATH,
        MarkupSourceCodeLinter.LINTING_OPTIMIZATIONS_FILE_NAME_WITH_EXTENSION
      ],
      { forwardSlashOnlySeparators: true }
    );

    if (FileSystem.existsSync(this.CACHED_LINTING_RESULTS_FILE_ABSOLUTE_PATH)) {

      try {

        this.cachedLintingResults = ObjectDataFilesProcessor.processFile({
          filePath: this.CACHED_LINTING_RESULTS_FILE_ABSOLUTE_PATH,
          validDataSpecification: MarkupSourceCodeLinter.cachedLintingResultsFileContentSpecification
        });

      } catch (error: unknown) {

        Logger.logError({
          errorType: InvalidExternalDataError.NAME,
          title: InvalidExternalDataError.localization.defaultTitle,
          description: PoliteErrorsMessagesBuilder.buildMessage({
            technicalDetails: InvalidExternalDataError.localization.generateDescription({
              mentionToExpectedData: MarkupSourceCodeLinter.cachedLintingResultsFileContentSpecification.nameForLogging
            }),
            politeExplanation: MarkupSourceCodeLinter.localization.invalidCachedLintingResultsDataErrorLog.politeExplanation
          }),
          occurrenceLocation: "MarkupSourceCodeLinter.provideMarkupProcessingIfMust(masterConfigRepresentative)",
          caughtError: error
        });

        this.cachedLintingResults = {};

      }

    } else {
      this.cachedLintingResults = {};
    }

    this.targetFilesGlobSelectors = [

      ImprovedGlob.buildAllFilesInCurrentDirectoryAndBelowGlobSelector({
        basicDirectoryPath: masterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath,
        fileNamesExtensions: [ "pug" ]
      }),

      ...isNonEmptyArray(pugLintConfig.excludeFiles) ? pugLintConfig.excludeFiles.map(
        (globSelector: string): string => ImprovedGlob.buildAbsolutePathBasedGlob({
          isExclusive: true,
          basicDirectoryPath: masterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath,
          relativePathBasedGlob: globSelector
        })
      ) : []

    ];

    this.pugLintConfig = pugLintConfig;

    try {

      this.pugLintInstance.configure(this.pugLintConfig);

    } catch (error: unknown) {

      Logger.throwErrorAndLog({
        errorInstance: new InvalidConfigError({
          customMessage: MarkupSourceCodeLinter.localization.pugLintConfigurationIsInvalid.description
        }),
        title: MarkupSourceCodeLinter.localization.pugLintConfigurationIsInvalid.title,
        occurrenceLocation: "MarkupSourceCodeLinter.provideMarkupProcessingIfMust(masterConfigRepresentative)",
        wrappableError: error
      });

    }


    this.TASK_NAME_FOR_LOGGING = markupProcessingSettingsRepresentative.TASK_NAME_FOR_LOGGING;

  }


  protected lint(globSelectorsOrAbsolutePathsOfTargetFiles: Array<string>): () => NodeJS.ReadWriteStream {

    if (globSelectorsOrAbsolutePathsOfTargetFiles.length === 0) {
      return createImmediatelyEndingEmptyStream();
    }


    return (): NodeJS.ReadWriteStream => Gulp.

        /* [ Theory ] No need to read the files immediately - maybe it has not changed since last modification thus linting
              results could be cached. */
        src(globSelectorsOrAbsolutePathsOfTargetFiles, { read: false }).

        pipe(super.printProcessedFilesPathsAndQuantity({ subtaskName: this.SUBTASK_NAME_FOR_LOGGING })).
        pipe(super.handleErrorIfItWillOccur({ subtaskName: this.SUBTASK_NAME_FOR_LOGGING })).

        pipe(gulpIf(

          (markupSourceFile: VinylFile): boolean =>
              this.hasLintingResultsBeenCachedForSpecificMarkupFile(markupSourceFile),

          GulpStreamModifier.modify({
            onStreamStartedEventCommonHandler:
                async (markupSourceFile: VinylFile): Promise<GulpStreamModifier.CompletionSignals> => {

                  const targetFileRelativePath: string = ImprovedPath.computeRelativePath({
                    comparedPath: markupSourceFile.path,
                    basePath: this.masterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath
                  });

                  markupSourceFile.lintingResults = this.cachedLintingResults[targetFileRelativePath]?.issues;

                  return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);

                }
          }),

          combineObjectStreams(

            GulpStreamModifier.modify({
              async onStreamStartedEventCommonHandler(file: VinylFile): Promise<GulpStreamModifier.CompletionSignals> {
                file.contents = FileSystem.readFileSync(file.path);
                return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);
              }
            }),

            GulpStreamModifier.modify({
              onStreamStartedEventCommonHandler: async (file: VinylFile): Promise<GulpStreamModifier.CompletionSignals> => {

                let lintingIssues: ReadonlyArray<MarkupSourceCodeLinter.NormalizedLintingIssue>;

                try {

                  lintingIssues = this.pugLintInstance.checkFile(file.path).
                      map((error: PugLint.RawError): MarkupSourceCodeLinter.NormalizedLintingIssue =>
                          ({
                            code: error.code,
                            message: error.msg,
                            sourceListing: error.src,
                            lineNumber: error.line,
                            columnNumber: error.column
                          }));

                } catch (error: unknown) {

                  Logger.throwErrorAndLog({
                    errorType: "MarkupLintingError",
                    title: MarkupSourceCodeLinter.localization.pugLintingFailedErrorLog.title,
                    description: PoliteErrorsMessagesBuilder.buildMessage({
                      technicalDetails: MarkupSourceCodeLinter.localization.pugLintingFailedErrorLog.technicalDetails,
                      politeExplanation: MarkupSourceCodeLinter.localization.pugLintingFailedErrorLog.politeExplanation
                    }),
                    occurrenceLocation: "markupSourceCodeLinter.lint()",
                    wrappableError: error
                  });

                }

                file.lintingIssues = lintingIssues;

                return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);

              }
            }),

            GulpStreamModifier.modify({
              onStreamStartedEventCommonHandler: async (file: VinylFile): Promise<GulpStreamModifier.CompletionSignals> => {

                this.cachedLintingResults[ImprovedPath.replacePathSeparatorsToForwardSlashes(file.relative)] = {
                  issues: file.lintingIssues,
                  modificationDatetime__ISO_8601: file.stat?.mtime.toJSON() ?? new Date().toISOString()
                };

                return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);
              }
            })
        )
    )).

    on("end", (): void => {

      const atLeastOneLintingIssueFound: boolean = Object.values(this.cachedLintingResults).some(
          (lintingResult: MarkupSourceCodeLinter.CachedLintingResult | undefined): boolean =>
              isNotUndefined(lintingResult) && lintingResult.issues.length > 0
      );

      if (atLeastOneLintingIssueFound) {

        const issuesFormattedLogs: Array<string> = [];

        for (const [ fileRelativePath, lintingResult ] of Object.entries(this.cachedLintingResults)) {

          if (isUndefined(lintingResult) || lintingResult.issues.length === 0) {
            continue;
          }


          issuesFormattedLogs.push(
            `■ ${ fileRelativePath }: ${ lintingResult.issues.length } issue(s)` +
            `\n${ MarkupSourceCodeLinter.formatIssuesOfSingleFile(lintingResult) }`
          );
        }

        Logger.logErrorLikeMessage({
          title: "Markup linting, issue(s) found",
          description: `\n${ issuesFormattedLogs.join("\n\n") }`
        });
      }


      FileSystem.writeFileSync(
        this.CACHED_LINTING_RESULTS_FILE_ABSOLUTE_PATH,
        stringifyAndFormatArbitraryValue(this.cachedLintingResults)
      );

    });
  }

  private hasLintingResultsBeenCachedForSpecificMarkupFile(targetMarkupSourceFile: VinylFile): boolean {
    return this.cachedLintingResults[ImprovedPath.replacePathSeparatorsToForwardSlashes(targetMarkupSourceFile.relative)]?.
        modificationDatetime__ISO_8601 === targetMarkupSourceFile.stat?.mtime.toJSON();
  }

  private static formatIssuesOfSingleFile(
    lintingResult: MarkupSourceCodeLinter.CachedLintingResult
  ): string {
    return lintingResult.issues.map(
        (issue: MarkupSourceCodeLinter.NormalizedLintingIssue): string =>
            "------------------------------------------------------------------------------------------------------\n" +
            `${ MarkupSourceCodeLinter.createExtractionFromCodeListingWithHighlightedIssueLine(issue) }\n` +
            "------------------------------------------------------------------------------------------------------\n" +
            `${ issue.message } (${ issue.code })\n` +
            `at line ${ issue.lineNumber }` +
            `${
                insertSubstring(issue.columnNumber,
                {
                  modifier: (stringifiedColumnNumber: string): string => `, column ${ stringifiedColumnNumber }`
                })
            }`
    ).join("\n\n");
  }

  private static createExtractionFromCodeListingWithHighlightedIssueLine(
    issue: MarkupSourceCodeLinter.NormalizedLintingIssue
  ): string {

    const sourceCodeListingExplodedToLines: Array<string> = issue.sourceListing.split("\n");

    if (isUndefined(issue.columnNumber)) {
      sourceCodeListingExplodedToLines[issue.lineNumber - 1] =
          Logger.highlightText(sourceCodeListingExplodedToLines[issue.lineNumber - 1]);
    } else {

      const targetCodeLine: string = sourceCodeListingExplodedToLines[issue.lineNumber - 1];
      const codeFragmentPartWhichMustBeHighlighted: string = extractSubstring(targetCodeLine, {
        startingSymbolNumber__numerationFrom1: issue.columnNumber,
        lastSymbolNumber__numerationFrom0: targetCodeLine.length - 1
      });

      sourceCodeListingExplodedToLines[issue.lineNumber - 1] = targetCodeLine.replace(
          codeFragmentPartWhichMustBeHighlighted,
          Logger.highlightText(codeFragmentPartWhichMustBeHighlighted)
      );
    }


    let firstLineWhichBeExtractedFromCodeListingForLogging: number = issue.lineNumber - 1 -
        MarkupSourceCodeLinter.DISPLAYING_LINES_COUNT_BEFORE_ISSUE_IN_CODE_LISTING;

    if (firstLineWhichBeExtractedFromCodeListingForLogging < 0) {
      firstLineWhichBeExtractedFromCodeListingForLogging = 0;
    }

    let lastLineWhichBeExtractedFromCodeListingForLogging: number = issue.lineNumber +
        MarkupSourceCodeLinter.DISPLAYING_LINES_COUNT_AFTER_ISSUE_IN_CODE_LISTING;

    if (lastLineWhichBeExtractedFromCodeListingForLogging > sourceCodeListingExplodedToLines.length) {
      lastLineWhichBeExtractedFromCodeListingForLogging = sourceCodeListingExplodedToLines.length;
    }

    const partialListing: Array<string> = sourceCodeListingExplodedToLines.slice(
        firstLineWhichBeExtractedFromCodeListingForLogging,
        lastLineWhichBeExtractedFromCodeListingForLogging
    );

    return partialListing.join("\n");

  }
}


namespace MarkupSourceCodeLinter {

  export type CachedLintingResults = {
    [fileRelativePath: string]: CachedLintingResult | undefined;
  };

  export type CachedLintingResult = {
    issues: Array<NormalizedLintingIssue>;
    modificationDatetime__ISO_8601: string;
  };

  export type NormalizedLintingIssue = Readonly<{
    code: string;
    message: string;
    sourceListing: string;
    lineNumber: number;
    columnNumber?: number;
  }>;

  export type Localization = Readonly<{

    pugLintFileNotFoundErrorLog: Readonly<{
      title: string;
      pugLintConfigurationFileRequirementExplanation: string;
    }>;

    invalidCachedLintingResultsDataErrorLog: Readonly<{ politeExplanation: string; }>;

    pugLintConfigurationIsInvalid: Readonly<Pick<ErrorLog, "title" | "description">>;

    pugLintingFailedErrorLog: Readonly<{
      title: string;
      technicalDetails: string;
      politeExplanation: string;
    }>;

  }>;

  export namespace Localization {

  }

}


export default MarkupSourceCodeLinter;


/* eslint-disable-next-line @typescript-eslint/no-unused-vars --
 * It is the only way to extract the child namespace (no need to expose whole MarkupSourceCodeLinter for the localization
 *  packages).
 * https://stackoverflow.com/a/73400523/4818123 */
export import MarkupSourceCodeLinterLocalization = MarkupSourceCodeLinter.Localization;
