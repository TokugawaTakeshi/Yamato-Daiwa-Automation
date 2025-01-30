/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type ECMA_ScriptLogicProcessingSettingsRepresentative from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettingsRepresentative";

/* ─── Source Files Watcher ───────────────────────────────────────────────────────────────────────────────────────── */
import ECMA_ScriptSourceFilesWatcher from "@ECMA_ScriptProcessing/ECMA_ScriptSourceFilesWatcher";

/* ─── Superclass ─────────────────────────────────────────────────────────────────────────────────────────────────── */
import LinterLikeTaskExecutor from "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBased/LinterLikeTaskExecutor";

/* ─── Gulp & Plugins ─────────────────────────────────────────────────────────────────────────────────────────────── */
import type VinylFile from "vinyl";

/* ─── Third-party Solutions Specialists ──────────────────────────────────────────────────────────────────────────── */
import ESLintSpecialist from "@ThirdPartySolutionsSpecialists/ESLintSpecialist";

/* ─── Applied Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import { ESLint } from "eslint";
import type { Linter as ESLinter } from "eslint";
import GulpStreamModifier from "@Utils/GulpStreamModifier";
import createImmediatelyEndingEmptyStream from "@Utils/createImmediatelyEndingEmptyStream";
import extractStringifiedContentFromVinylFile from "@Utils/extractStringifiedContentFromVinylFile";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import {
  RawObjectDataProcessor,
  PoliteErrorsMessagesBuilder,
  Logger,
  replaceArrayElementsByIndexesImmutably,
  splitString,
  cropArray,
  cropString,
  isUndefined,
  isNotUndefined,
  isNotNull,
  isNeitherUndefinedNorNull,
  limitMinimalValue,
  limitMaximalValue
} from "@yamato-daiwa/es-extensions";
import { ImprovedGlob, ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";

/* ─── Localization ───────────────────────────────────────────────────────────────────────────────────────────────── */
import ECMA_ScriptSourceCodeLinterLocalization__english from "./ECMA_ScriptSourceCodeLinterLocalization.english";


class ECMA_ScriptSourceCodeLinter extends LinterLikeTaskExecutor<ECMA_ScriptSourceCodeLinter.LintingIssue> {

  public static localization: ECMA_ScriptSourceCodeLinter.Localization = ECMA_ScriptSourceCodeLinterLocalization__english;

  private readonly ESLintInstance: ESLint = new ESLint();


  public static provideLintingIfMust(
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): () => NodeJS.ReadWriteStream {

    const ecmaScriptLogicProcessingSettingsRepresentative: ECMA_ScriptLogicProcessingSettingsRepresentative | undefined =
        projectBuildingMasterConfigRepresentative.ECMA_ScriptLogicProcessingSettingsRepresentative;

    if (isUndefined(ecmaScriptLogicProcessingSettingsRepresentative)) {
      return createImmediatelyEndingEmptyStream();
    }


    const dataHoldingSelfSoleInstance: ECMA_ScriptSourceCodeLinter = new ECMA_ScriptSourceCodeLinter({
      ecmaScriptLogicProcessingSettingsRepresentative,
      projectBuildingMasterConfigRepresentative
    });

    if (projectBuildingMasterConfigRepresentative.mustProvideIncrementalBuilding) {

      ECMA_ScriptSourceFilesWatcher.
          initializeIfRequiredAndGetInstance({
            ecmaScriptLogicProcessingSettingsRepresentative,
            projectBuildingMasterConfigRepresentative
          }).
          addOnAnyRelatedFileAddedEventHandler({
            handlerID: "ON_ANY_ECMA_SCRIPT_LOGIC_FILE_ADDED--BY_ECMA_SCRIPT_SOURCE_CODE_LINTER",
            handler: dataHoldingSelfSoleInstance.onFileHasBeenAddedOrUpdated.bind(dataHoldingSelfSoleInstance)
          }).
          addOnAnyRelatedFileUpdatedEventHandler({
            handlerID: "ON_ANY_ECMA_SCRIPT_LOGIC_FILE_UPDATED--BY_ECMA_SCRIPT_SOURCE_CODE_LINTER",
            handler: dataHoldingSelfSoleInstance.onFileHasBeenAddedOrUpdated.bind(dataHoldingSelfSoleInstance)
          }).
          addOnAnyRelatedFileDeletedEventHandler({
            handlerID: "ON_ANY_ECMA_SCRIPT_LOGIC_FILE_DELETED--BY_ECMA_SCRIPT_SOURCE_CODE_LINTER",
            handler: dataHoldingSelfSoleInstance.onFileHasBeenDeleted.bind(dataHoldingSelfSoleInstance)
          });

    }

    return dataHoldingSelfSoleInstance.checkFiles(dataHoldingSelfSoleInstance.targetFilesGlobSelectors);

  }


  private constructor(
    {
      ecmaScriptLogicProcessingSettingsRepresentative,
      projectBuildingMasterConfigRepresentative
    }: Readonly<{
      ecmaScriptLogicProcessingSettingsRepresentative: ECMA_ScriptLogicProcessingSettingsRepresentative;
      projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
    }>
  ) {

    super({

      projectBuildingMasterConfigRepresentative,

      taskTitleForLogging: "ECMAScript logic processing / ECMAScript logic source code linting",

      sourceFilesCachedCheckingResults: {
        fileNameWithExtension: "ECMA_ScriptLintingCache.json",
        contentSpecification: {
          subtype: RawObjectDataProcessor.ObjectSubtypes.fixedSchema,
          nameForLogging: "CachedMarkupLintingResultsFileContent",
          properties: {
            files: {
              type: RawObjectDataProcessor.ValuesTypesIDs.associativeArray,
              isUndefinedForbidden: true,
              isNullForbidden: true,
              areUndefinedTypeValuesForbidden: true,
              areNullTypeValuesForbidden: true,
              value: {
                type: Object,
                properties: {
                  issues: {
                    type: Array,
                    isUndefinedForbidden: true,
                    isNullForbidden: true,
                    areUndefinedElementsForbidden: true,
                    areNullElementsForbidden: true,
                    element: {
                      type: Object,
                      properties: {
                        ruleID: {
                          type: String,
                          isUndefinedForbidden: false,
                          isNullForbidden: true
                        },
                        message: {
                          type: String,
                          isUndefinedForbidden: true,
                          isNullForbidden: true
                        },
                        codeFragment: {
                          type: Object,
                          isUndefinedForbidden: true,
                          isNullForbidden: true,
                          properties: {
                            beforeHighlighting: {
                              type: String,
                              isUndefinedForbidden: true,
                              isNullForbidden: true
                            },
                            highlighted: {
                              type: String,
                              isUndefinedForbidden: true,
                              isNullForbidden: true
                            },
                            afterHighlighting: {
                              type: String,
                              isUndefinedForbidden: true,
                              isNullForbidden: true
                            }
                          }
                        },
                        location: {
                          type: Object,
                          isUndefinedForbidden: true,
                          isNullForbidden: true,
                          properties: {
                            startingLineNumber__numerationFrom1: {
                              type: Number,
                              numbersSet: RawObjectDataProcessor.NumbersSets.naturalNumber,
                              isUndefinedForbidden: false,
                              isNullForbidden: true
                            },
                            endingLineNumber__numerationFrom1: {
                              type: Number,
                              numbersSet: RawObjectDataProcessor.NumbersSets.naturalNumber,
                              isUndefinedForbidden: false,
                              isNullForbidden: true
                            },
                            startingColumnNumber__numerationFrom1: {
                              type: Number,
                              numbersSet: RawObjectDataProcessor.NumbersSets.naturalNumber,
                              isUndefinedForbidden: false,
                              isNullForbidden: true
                            },
                            endingColumnNumber__numerationFrom1: {
                              type: Number,
                              numbersSet: RawObjectDataProcessor.NumbersSets.naturalNumber,
                              isUndefinedForbidden: false,
                              isNullForbidden: true
                            }
                          }
                        }
                      }
                    }
                  },
                  modificationDateTime__ISO_8601: {
                    type: String,
                    isUndefinedForbidden: true,
                    isNullForbidden: true,
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
          fileNamesExtensions: ecmaScriptLogicProcessingSettingsRepresentative.
              supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots
        }),

        ImprovedGlob.buildExcludingOfDirectoryWithSubdirectoriesGlobSelector(
          ImprovedPath.joinPathSegments(
            [ projectBuildingMasterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath, "node_modules" ]
          )
        ),

        /* [ ESLint theory ]
         * In there are files and/or directories ignored in ESLint configuration they also must be excluded from
         *   the Gulp pipelines otherwise ESLint will emit the warning for ignored files. */
        ...ESLintSpecialist.generateExcludingGlobSelectorsOfIgnoredFiles(
          projectBuildingMasterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath
        )

      ],

      logging: {
        pathsOfFilesWillBeProcessed: ecmaScriptLogicProcessingSettingsRepresentative.loggingSettings.filesPaths,
        quantityOfFilesWillBeProcessed: ecmaScriptLogicProcessingSettingsRepresentative.loggingSettings.filesCount,
        checkingStart: ecmaScriptLogicProcessingSettingsRepresentative.loggingSettings.linting.starting,
        completionWithoutIssues: ecmaScriptLogicProcessingSettingsRepresentative.loggingSettings.linting.completionWithoutIssues
      }

    });

    this.ESLintInstance = new ESLint();

  }


  /* ━━━  Pipeline methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  protected async checkSingleFile(targetECMA_ScriptLogicSourceFile: VinylFile): Promise<GulpStreamModifier.CompletionSignals> {

    const sourceCode: string = extractStringifiedContentFromVinylFile(targetECMA_ScriptLogicSourceFile);

    try {

      /* eslint-disable-next-line require-atomic-updates --
      * The is no race condition because if to call this function simultaneously for the multiple Vinyl files, the files
      *   `CHECKING_ISSUES_MESSAGES_PROPERTY_NAME_AT_VINYL_FILE_INSTANCE` of each one will be updated without any conflicts.
      * Also, the calling of this function simultaneously for the same Vinyl file most likely the bug.  */
      targetECMA_ScriptLogicSourceFile[LinterLikeTaskExecutor.CHECKING_ISSUES_MESSAGES_PROPERTY_NAME_AT_VINYL_FILE_INSTANCE] =

          /* [ ESLint theory ]
           * Although the promise payload is the array, it has only one element that is the child array of the objects
           *   in order to keep the interfaces between this and the `eslint.lintFiles()` method similar. */
          (await this.ESLintInstance.lintText(sourceCode, { filePath: targetECMA_ScriptLogicSourceFile.path }))[0].
              messages.
              map(
                (issue: ESLinter.LintMessage): ECMA_ScriptSourceCodeLinter.LintingIssue =>
                    this.normalizeLintingIssues(issue, sourceCode)
              );

    } catch (error: unknown) {

      Logger.throwErrorAndLog({
        errorType: "ECMA_ScriptSourceCodeLinter",
        title: ECMA_ScriptSourceCodeLinter.localization.lintingFailedErrorLog.title,
        description: PoliteErrorsMessagesBuilder.buildMessage({
          technicalDetails: ECMA_ScriptSourceCodeLinter.localization.lintingFailedErrorLog.technicalDetails,
          politeExplanation: ECMA_ScriptSourceCodeLinter.localization.lintingFailedErrorLog.politeExplanation
        }),
        occurrenceLocation: "ecmaScriptSourceCodeLinter.checkSingleFile()",
        innerError: error
      });

    }

    return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);

  }

  /* eslint-disable-next-line @typescript-eslint/class-methods-use-this --
  * Even not using `this`, being the implementation of the abstract method it must be non-static. */
  protected formatIssuesOfSingleFile(
    lintingResult: LinterLikeTaskExecutor.CachedCheckingResults.File<ECMA_ScriptSourceCodeLinter.LintingIssue>
  ): string {
    return lintingResult.issues.map(
      (issue: ECMA_ScriptSourceCodeLinter.LintingIssue): string =>
          [

            `${ "-".repeat(LinterLikeTaskExecutor.DISPLAYING_MAXIMAL_COLUMNS_COUNT_IN_LOG) }\n`,
            issue.codeFragment.beforeHighlighting,
            Logger.highlightText(issue.codeFragment.highlighted),
            issue.codeFragment.afterHighlighting,
            `${ "-".repeat(LinterLikeTaskExecutor.DISPLAYING_MAXIMAL_COLUMNS_COUNT_IN_LOG) }\n`,
            `${ issue.message } (${ issue.ruleID })\n`,

            /* eslint-disable-next-line @stylistic/no-extra-parens --
             *   Without parens, the indentation will not be uniform. */
            ...(
              isNeitherUndefinedNorNull(issue.location.startingLineNumber__numerationFrom1) &&
              isNeitherUndefinedNorNull(issue.location.startingColumnNumber__numerationFrom1) &&
              isNeitherUndefinedNorNull(issue.location.endingLineNumber__numerationFrom1) &&
              isNeitherUndefinedNorNull(issue.location.endingColumnNumber__numerationFrom1)
            ) ? [
              `at ${ issue.location.startingLineNumber__numerationFrom1 }:` +
                  `${ issue.location.startingColumnNumber__numerationFrom1 }-` +
                  `${ issue.location.endingLineNumber__numerationFrom1 }:` +
                  `${ issue.location.endingColumnNumber__numerationFrom1 }`
            ] : []

          ].join("")
    ).join("\n\n");
  }


  private normalizeLintingIssues(
    rawIssue: ESLinter.LintMessage,
    sourceCode: string
  ): ECMA_ScriptSourceCodeLinter.LintingIssue {

    let codeFragmentBeforeHighlighting: string = "";
    let highlightedCodeFragment: string = "";
    let codeFragmentAfterHighlighting: string = "";

    const sourceCodeExplodedToLines: ReadonlyArray<string> = splitString(sourceCode, "\n");

    if (
      isNeitherUndefinedNorNull(rawIssue.line) &&
      isNeitherUndefinedNorNull(rawIssue.endLine) &&
      isNeitherUndefinedNorNull(rawIssue.column) &&
      isNeitherUndefinedNorNull(rawIssue.endColumn)
    ) {

      /* [ Maintainability ] Keep these variables for easier debugging. */
      codeFragmentBeforeHighlighting = cropArray({
        targetArray: replaceArrayElementsByIndexesImmutably({
          targetArray: sourceCodeExplodedToLines,
          index: rawIssue.line - 1,
          newElement: rawIssue.column > 1 ?
            cropString({
              targetString: sourceCodeExplodedToLines[rawIssue.line - 1],
              fromStart: true,
              endingCharacterNumber__numerationFrom1: rawIssue.column - 1,
              mustThrowErrorIfSpecifiedCharactersNumbersIsOutOfRange: true
            }) :
            ""
        }),
        startingElementNumber__numerationFrom1: limitMinimalValue({
          targetNumber: rawIssue.line - this.DISPLAYING_LINES_COUNT_BEFORE_ISSUED_LINE_IN_CODE_LISTING_OF_REPORT,
          minimalValue: 1
        }),
        endingElementNumber__numerationFrom1: rawIssue.line,
        mutably: false,
        mustThrowErrorIfSpecifiedElementsNumbersAreOutOfRange: true
      }).join("\n");

      highlightedCodeFragment = cropArray({
        targetArray: replaceArrayElementsByIndexesImmutably({
          targetArray: sourceCodeExplodedToLines,
          replacements: [
            ...rawIssue.line === rawIssue.endLine ?
              [
                {
                  index: rawIssue.line - 1,
                  newElement: cropString({
                    targetString: sourceCodeExplodedToLines[rawIssue.line - 1],
                    startingCharacterNumber__numerationFrom1: rawIssue.column,
                    endingCharacterNumber__numerationFrom1: rawIssue.column === rawIssue.endColumn ?
                        rawIssue.endColumn : rawIssue.endColumn - 1,
                    mustThrowErrorIfSpecifiedCharactersNumbersIsOutOfRange: true
                  })
                }
              ] : [
                {
                  index: rawIssue.line - 1,
                  newElement: cropString({
                    targetString: sourceCodeExplodedToLines[rawIssue.line - 1],
                    startingCharacterNumber__numerationFrom1: rawIssue.column,
                    untilEnd: true,
                    mustThrowErrorIfSpecifiedCharactersNumbersIsOutOfRange: true
                  })
                },
                ...rawIssue.endColumn > 1 ?
                    [
                      {
                        index: rawIssue.endLine - 1,
                        newElement: cropString({
                          targetString: sourceCodeExplodedToLines[rawIssue.endLine - 1],
                          fromStart: true,
                          endingCharacterNumber__numerationFrom1: rawIssue.column === rawIssue.endColumn ?
                              rawIssue.endColumn : rawIssue.endColumn - 1,
                          mustThrowErrorIfSpecifiedCharactersNumbersIsOutOfRange: true
                        })
                      }
                    ] : []
              ]
          ]
        }),
        startingElementNumber__numerationFrom1: rawIssue.line,
        endingElementNumber__numerationFrom1: rawIssue.endLine,
        mutably: false,
        mustThrowErrorIfSpecifiedElementsNumbersAreOutOfRange: true
      }).join("\n");

      const lastLineOfHighlightedCodeFragment: string = sourceCodeExplodedToLines[rawIssue.endLine - 1];

      codeFragmentAfterHighlighting = cropArray({
        targetArray: replaceArrayElementsByIndexesImmutably({
          targetArray: sourceCodeExplodedToLines,
          index: rawIssue.endLine - 1,
          newElement: lastLineOfHighlightedCodeFragment.length === rawIssue.endColumn ?
              "" :
              cropString({
                targetString: lastLineOfHighlightedCodeFragment,
                startingCharacterNumber__numerationFrom1: rawIssue.endColumn,
                untilEnd: true,
                mustThrowErrorIfSpecifiedCharactersNumbersIsOutOfRange: true
              })
        }),
        startingElementNumber__numerationFrom1: rawIssue.endLine,
        endingElementNumber__numerationFrom1: limitMaximalValue({
          targetNumber: rawIssue.endLine + this.DISPLAYING_LINES_COUNT_AFTER_ISSUED_LINE_IN_CODE_LISTING_OF_REPORT,
          maximalValue: sourceCodeExplodedToLines.length
        }),
        mutably: false,
        mustThrowErrorIfSpecifiedElementsNumbersAreOutOfRange: true
      }).join("\n");

    }


    return {

      ...isNotNull(rawIssue.ruleId) ? { ruleID: rawIssue.ruleId } : null,

      message: rawIssue.message,

      /* [ ESLint theory ]
       * Contrary to TypeScript type definitions, the `issue.line` and/or `issue.column` could be undefined. */
      location: {
        ...isNotUndefined(rawIssue.line) ? { startingLineNumber__numerationFrom1: rawIssue.line } : null,
        ...isNotUndefined(rawIssue.endLine) ? { endingLineNumber__numerationFrom1: rawIssue.endLine } : null,
        ...isNotUndefined(rawIssue.column) ? { startingColumnNumber__numerationFrom1: rawIssue.column } : null,
        ...isNotUndefined(rawIssue.endColumn) ? { endingColumnNumber__numerationFrom1: rawIssue.endColumn } : null
      },
      codeFragment: {
        beforeHighlighting: codeFragmentBeforeHighlighting,
        highlighted: highlightedCodeFragment,
        afterHighlighting: codeFragmentAfterHighlighting
      }

    };

  }

}


namespace ECMA_ScriptSourceCodeLinter {

  export type CachedLintingResults =
      LinterLikeTaskExecutor.CachedCheckingResults<LintingIssue> &
      Readonly<{ rulesChecksum: string; }>;

  export type LintingIssue = Readonly<{
    ruleID?: string;
    message: string;
    codeFragment: LintingIssue.CodeFragment;
    location: LintingIssue.Location;
  }>;

  export namespace LintingIssue {

    export type CodeFragment = Readonly<{
      beforeHighlighting: string;
      highlighted: string;
      afterHighlighting: string;
    }>;

    export type Location = Readonly<{
      startingLineNumber__numerationFrom1?: number;
      endingLineNumber__numerationFrom1?: number;
      startingColumnNumber__numerationFrom1?: number;
      endingColumnNumber__numerationFrom1?: number;
    }>;

  }

  export type Localization = Readonly<{

    lintingFailedErrorLog: Readonly<{
      title: string;
      technicalDetails: string;
      politeExplanation: string;
    }>;

  }>;

}


export default ECMA_ScriptSourceCodeLinter;


/* It is the only way to extract the child namespace (no need to expose whole ECMA_ScriptSourceCodeLinter for the localization
 *  packages).
 * https://stackoverflow.com/a/73400523/4818123 */
export import ECMA_ScriptSourceCodeLinterLocalization = ECMA_ScriptSourceCodeLinter.Localization;
