import type MarkupSourceCodeLinter from "@MarkupProcessing/Subtasks/Linting/MarkupSourceCodeLinter";


const markupSourceCodeLinterLocalization__english: MarkupSourceCodeLinter.Localization = {

  pugLintFileNotFoundErrorLog: {
    title: "'pug-lint' configuration file not found",
    pugLintConfigurationFileRequirementExplanation: "Intended to be used for high quality web/native development, " +
        "the markup source code linting is enabled by default. If you can not use it for some reason, disable it."
  },

  invalidCachedLintingResultsDataErrorLog: {
    politeExplanation: "The error has occurred during the parsing of the file with previous (cached) markup linting results. " +
        "Of course the YDA developers has took care about written data matching with expected scheme, however this bug " +
        "occurrence means that some combination of conditions was not taken into account."
  },

  pugLintConfigurationIsInvalid: {
    title: "'pug-lint' configuration is invalid",
    description: "The 'pug-lint' utility has not accepted the specified configuration."
  },

  pugLintingFailedErrorLog: {
    title: "Markup linting error",
    technicalDetails: "The error occurred during execution of 'pugLintInstance.checkFile(filePath)'",
    politeExplanation: "The Pug linter has thrown the error under unknown for YDA developers combination " +
        " of conditions."
  }

};


export default markupSourceCodeLinterLocalization__english;
