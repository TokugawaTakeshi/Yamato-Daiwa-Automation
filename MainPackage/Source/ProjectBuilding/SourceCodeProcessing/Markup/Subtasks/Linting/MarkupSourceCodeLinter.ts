/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type MarkupProcessingSettingsRepresentative from "@MarkupProcessing/MarkupProcessingSettingsRepresentative";
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";

/* ─── Source Files Watcher ───────────────────────────────────────────────────────────────────────────────────────── */
import MarkupSourceFilesWatcher from "@MarkupProcessing/MarkupSourceFilesWatcher";

/* ─── Superclass ─────────────────────────────────────────────────────────────────────────────────────────────────── */
import LinterLikeTaskExecutor from "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBased/LinterLikeTaskExecutor";

/* ─── Gulp & Plugins ─────────────────────────────────────────────────────────────────────────────────────────────── */
import type VinylFile from "vinyl";

/* ─── Third-party Solutions Specialists ──────────────────────────────────────────────────────────────────────────── */
import PugPreProcessorSpecialist from "@ThirdPartySolutionsSpecialists/PugPreProcessorSpecialist";

/* ─── Applied Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import PugLint from "pug-lint";
import PugLintConfigFile from "pug-lint/lib/config-file";
import GulpStreamModifier from "@Utils/GulpStreamModifier";
import createImmediatelyEndingEmptyStream from "@Utils/createImmediatelyEndingEmptyStream";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import {
  RawObjectDataProcessor,
  PoliteErrorsMessagesBuilder,
  Logger,
  InvalidConfigError,
  ConfigFileNotFoundError,
  isNonEmptyArray,
  isUndefined,
  insertSubstring,
  cropString,
  limitMinimalValue
} from "@yamato-daiwa/es-extensions";
import type { ErrorLog } from "@yamato-daiwa/es-extensions";
import { ImprovedGlob, ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";

/* ─── Localization ───────────────────────────────────────────────────────────────────────────────────────────────── */
import markupSourceCodeLinterLocalization__english from
    "@MarkupProcessing/Subtasks/Linting/MarkupSourceCodeLinterLocalization.english";


class MarkupSourceCodeLinter extends LinterLikeTaskExecutor<MarkupSourceCodeLinter.LintingIssue> {

  public static localization: MarkupSourceCodeLinter.Localization = markupSourceCodeLinterLocalization__english;

  private readonly pugLintInstance: PugLint = new PugLint();
  private readonly pugLintConfig: PugLint.Config;


  public static provideLintingIfMust(
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): () => NodeJS.ReadWriteStream {

    const markupProcessingSettingsRepresentative: MarkupProcessingSettingsRepresentative | undefined =
        projectBuildingMasterConfigRepresentative.markupProcessingSettingsRepresentative;

    if (isUndefined(markupProcessingSettingsRepresentative)) {
      return createImmediatelyEndingEmptyStream();
    }


    let pugLintConfig: PugLint.Config | undefined;

    try {

      pugLintConfig = PugLintConfigFile.load();

    } catch (error: unknown) {

      Logger.throwErrorAndLog({
        errorInstance: new InvalidConfigError({
          customMessage: "Invalid puglint config."
        }),
        title: InvalidConfigError.localization.defaultTitle,
        occurrenceLocation: "MarkupSourceCodeLinter.provideLintingIfMust(projectBuildingMasterConfigRepresentative)",
        innerError: error
      });

    }


    if (isUndefined(pugLintConfig)) {

      Logger.logError({
        errorType: ConfigFileNotFoundError.NAME,
        title: MarkupSourceCodeLinter.localization.pugLintFileNotFoundErrorLog.title,
        description: ConfigFileNotFoundError.localization.generateDescription({
          targetTechnologyName: "pug-lint",
          configFilePathOrMultipleOfThem: PugPreProcessorSpecialist.linterConfigurationFilesNamesWithExtensions,
          messageSpecificPart: MarkupSourceCodeLinter.localization.pugLintFileNotFoundErrorLog.
              pugLintConfigurationFileRequirementExplanation
        }),
        occurrenceLocation: "MarkupSourceCodeLinter.provideLintingIfMust(projectBuildingMasterConfigRepresentative)"
      });

      return createImmediatelyEndingEmptyStream();

    }


    const dataHoldingSelfSoleInstance: MarkupSourceCodeLinter = new MarkupSourceCodeLinter({
      markupProcessingSettingsRepresentative,
      projectBuildingMasterConfigRepresentative,
      pugLintConfig
    });

    if (projectBuildingMasterConfigRepresentative.mustProvideIncrementalBuilding) {

      MarkupSourceFilesWatcher.
          initializeIfRequiredAndGetInstance({
            markupProcessingSettingsRepresentative,
            projectBuildingMasterConfigRepresentative
          }).
          addOnAnyRelatedFileAddedEventHandler({
            handlerID: "ON_ANY_MARKUP_FILE_ADDED--BY_MARKUP_SOURCE_CODE_LINTER",
            handler: dataHoldingSelfSoleInstance.onFileHasBeenAddedOrUpdated.bind(dataHoldingSelfSoleInstance)
          }).
          addOnAnyRelatedFileUpdatedEventHandler({
            handlerID: "ON_ANY_MARKUP_FILE_UPDATED--BY_MARKUP_SOURCE_CODE_LINTER",
            handler: dataHoldingSelfSoleInstance.onFileHasBeenAddedOrUpdated.bind(dataHoldingSelfSoleInstance)
          }).
          addOnAnyRelatedFileDeletedEventHandler({
            handlerID: "ON_ANY_MARKUP_FILE_DELETED--BY_MARKUP_SOURCE_CODE_LINTER",
            handler: dataHoldingSelfSoleInstance.onFileHasBeenDeleted.bind(dataHoldingSelfSoleInstance)
          });

    }

    return dataHoldingSelfSoleInstance.checkFiles(dataHoldingSelfSoleInstance.targetFilesGlobSelectors);

  }


  private constructor(
    {
      markupProcessingSettingsRepresentative,
      projectBuildingMasterConfigRepresentative,
      pugLintConfig
    }: Readonly<{
      markupProcessingSettingsRepresentative: MarkupProcessingSettingsRepresentative;
      projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
      pugLintConfig: PugLint.Config;
    }>
  ) {

    super({

      projectBuildingMasterConfigRepresentative,

      taskTitleForLogging: "Markup processing / Markup source code linting",

      sourceFilesCachedCheckingResults: {
        fileNameWithExtension: "MarkupLintingCache.json",
        contentSpecification: {
          subtype: RawObjectDataProcessor.ObjectSubtypes.fixedKeyAndValuePairsObject,
          nameForLogging: "CachedMarkupLintingResultsFileContent",
          properties: {
            files: {
              type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
              required: true,
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
                  modificationDateTime__ISO_8601: {
                    type: String,
                    required: true,
                    minimalCharactersCount: 1
                  }
                }
              }
            }
          }
        },
        emptyValue: {
          files: {}
        }
      },

      targetFilesGlobSelectors: [

        ImprovedGlob.buildAllFilesInCurrentDirectoryAndBelowGlobSelector({
          basicDirectoryPath: projectBuildingMasterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath,
          fileNamesExtensions: [ "pug" ]
        }),

        ImprovedGlob.buildExcludingOfDirectoryWithSubdirectoriesGlobSelector(
          ImprovedPath.joinPathSegments(
            [ projectBuildingMasterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath, "node_modules" ]
          )
        ),

        ...isNonEmptyArray(pugLintConfig.excludeFiles) ? pugLintConfig.excludeFiles.map(
          (globSelector: string): string => ImprovedGlob.buildAbsolutePathBasedGlob({
            basicDirectoryPath: projectBuildingMasterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath,
            relativePathBasedGlob: globSelector,
            isExclusive: true
          })
        ) : []

      ],

      logging: {
        pathsOfFilesWillBeProcessed: markupProcessingSettingsRepresentative.loggingSettings.filesPaths,
        quantityOfFilesWillBeProcessed: markupProcessingSettingsRepresentative.loggingSettings.filesCount,
        checkingStart: markupProcessingSettingsRepresentative.loggingSettings.linting.starting,
        completionWithoutIssues: markupProcessingSettingsRepresentative.loggingSettings.linting.completionWithoutIssues
      }

    });

    this.pugLintConfig = pugLintConfig;

    try {

      this.pugLintInstance.configure(this.pugLintConfig);

    } catch (error: unknown) {

      Logger.throwErrorAndLog({
        errorInstance: new InvalidConfigError({
          customMessage: MarkupSourceCodeLinter.localization.pugLintConfigurationIsInvalid.description
        }),
        title: MarkupSourceCodeLinter.localization.pugLintConfigurationIsInvalid.title,
        occurrenceLocation:
            "MarkupSourceCodeLinter.provideLintingIfMust(projectBuildingMasterConfigRepresentative) ->" +
            "constructor(compoundParameter)",
        innerError: error
      });

    }

  }


  /* ━━━  Pipeline methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  protected async checkSingleFile(targetMarkupSourceFile: VinylFile): Promise<GulpStreamModifier.CompletionSignals> {

    try {

      targetMarkupSourceFile[LinterLikeTaskExecutor.CHECKING_ISSUES_MESSAGES_PROPERTY_NAME_AT_VINYL_FILE_INSTANCE] =
          this.pugLintInstance.
              checkFile(targetMarkupSourceFile.path).
              map(
                (error: PugLint.RawError): MarkupSourceCodeLinter.LintingIssue =>
                    ({
                      code: error.code,
                      message: error.msg,
                      sourceListing: error.src,
                      lineNumber: error.line,
                      columnNumber: error.column
                    })
              );

    } catch (error: unknown) {

      Logger.throwErrorAndLog({
        errorType: "MarkupLintingError",
        title: MarkupSourceCodeLinter.localization.lintingFailedErrorLog.title,
        description: PoliteErrorsMessagesBuilder.buildMessage({
          technicalDetails: MarkupSourceCodeLinter.localization.lintingFailedErrorLog.technicalDetails,
          politeExplanation: MarkupSourceCodeLinter.localization.lintingFailedErrorLog.politeExplanation
        }),
        occurrenceLocation: "markupSourceCodeLinter.checkSingleFile()",
        innerError: error
      });

    }

    return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);

  }

  protected formatIssuesOfSingleFile(
    lintingResult: LinterLikeTaskExecutor.CachedCheckingResults.File<MarkupSourceCodeLinter.LintingIssue>
  ): string {
    return lintingResult.issues.map(
        (issue: MarkupSourceCodeLinter.LintingIssue): string =>
            "------------------------------------------------------------------------------------------------------\n" +
            `${ this.createExtractionFromCodeListingWithHighlightedIssueLine(issue) }\n` +
            "------------------------------------------------------------------------------------------------------\n" +
            `${ issue.message } (${ issue.code })\n` +
            `at line ${ issue.lineNumber }` +
            insertSubstring(
              issue.columnNumber,
              { modifier: (stringifiedColumnNumber: string): string => `, column ${ stringifiedColumnNumber }` }
            )
    ).join("\n\n");
  }

  private createExtractionFromCodeListingWithHighlightedIssueLine(
    issue: MarkupSourceCodeLinter.LintingIssue
  ): string {

    const sourceCodeListingExplodedToLines: Array<string> = issue.sourceListing.split("\n");

    if (isUndefined(issue.columnNumber)) {
      sourceCodeListingExplodedToLines[issue.lineNumber - 1] =
          Logger.highlightText(sourceCodeListingExplodedToLines[issue.lineNumber - 1]);
    } else {

      const targetCodeLine: string = sourceCodeListingExplodedToLines[issue.lineNumber - 1];

      /* [ Pug-lint theory ]
      *  Is it the bug it or not, but the "pug-lint" could refer to the empty line.
      *  To prevent the `-1` value for `endingCharacterNumber__numerationFrom0`, `limitMinimalValue` is required.
      *  */
      const codeFragmentPartWhichMustBeHighlighted: string = cropString({
        targetString: targetCodeLine,
        startingCharacterNumber__numerationFrom1: issue.columnNumber,
        endingCharacterNumber__numerationFrom0: limitMinimalValue({
          targetNumber: targetCodeLine.length - 1,
          minimalValue: 0
        }),
        mustThrowErrorIfSpecifiedCharactersNumbersIsOutOfRange: false
      });

      sourceCodeListingExplodedToLines[issue.lineNumber - 1] = targetCodeLine.replace(
        codeFragmentPartWhichMustBeHighlighted,
        Logger.highlightText(codeFragmentPartWhichMustBeHighlighted)
      );
    }


    let firstLineWhichBeExtractedFromCodeListingForLogging: number = issue.lineNumber - 1 -
        this.DISPLAYING_LINES_COUNT_BEFORE_ISSUED_LINE_IN_CODE_LISTING_OF_REPORT;

    if (firstLineWhichBeExtractedFromCodeListingForLogging < 0) {
      firstLineWhichBeExtractedFromCodeListingForLogging = 0;
    }

    let lastLineWhichBeExtractedFromCodeListingForLogging: number = issue.lineNumber +
        this.DISPLAYING_LINES_COUNT_AFTER_ISSUED_LINE_IN_CODE_LISTING_OF_REPORT;

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

  export type CachedLintingResults =
      LinterLikeTaskExecutor.CachedCheckingResults<LintingIssue> &
      Readonly<{ rulesChecksum: string; }>;

  export type LintingIssue = Readonly<{
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

    pugLintConfigurationIsInvalid: Readonly<Pick<ErrorLog, "title" | "description">>;

    lintingFailedErrorLog: Readonly<{
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
