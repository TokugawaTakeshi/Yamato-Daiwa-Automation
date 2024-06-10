import type MarkupSourceCodeLinter from "@MarkupProcessing/Subtasks/Linting/MarkupSourceCodeLinter";


const markupSourceCodeLinterLocalization__english: MarkupSourceCodeLinter.Localization = {

  pugLintFileNotFoundErrorLog: {
    title: "'pug-lint' configuration file not found",
    pugLintConfigurationFileRequirementExplanation: "Intended to be used for high quality web/native development, " +
        "the markup source code linting is enabled by default. If you can not use it for some reason, disable it."
  },

  pugLintConfigurationIsInvalid: {
    title: "'pug-lint' configuration is invalid",
    description: "The 'pug-lint' utility has not accepted the specified configuration."
  },

  lintingFailedErrorLog: {
    title: "Markup linting error",
    technicalDetails: "The error occurred during execution of \"pug-lint\".",
    politeExplanation: "The Pug linter has thrown the error under unknown for YDA developers combination " +
        " of conditions."
  }

};


export default markupSourceCodeLinterLocalization__english;
