import type HTML_Validator from "@MarkupProcessing/Plugins/HTML_Validator/HTML_Validator";

import type {
  WarningLog,
  InfoLog,
  SuccessLog,
  Log
} from "@yamato-daiwa/es-extensions";


const HTML_ValidatorLocalization__Japanese: HTML_Validator.Localization = {

  generateFileIsEmptyWarningLog: (
    namedParameters: HTML_Validator.Localization.FileIsEmptyWarningLog.NamedParameters
  ): WarningLog =>
      ({
        title: "HTML妥当性検問中断",
        description: `ファイル「${ namedParameters.targetFileRelativePath }」は空なので、HTML妥当性を検問する事は出来ません。`
      }),

  generateValidationStartedInfoLog: (
    namedParameters: HTML_Validator.Localization.ValidationStartedInfoLog.NamedParameters
  ): InfoLog => ({
    title: "HTML妥当性確認開始",
    description: `これよりファイル「${ namedParameters.targetFileRelativePath }」のHTML妥当性確認を開始します・・・`
  }),

  generateValidationFinishedWithNoIssuesFoundSuccessLog: (
    namedParameters: HTML_Validator.Localization.ValidationFinishedWithNoIssuesFoundSuccessLog.NamedParameters
  ): SuccessLog => ({
    title: "HTML妥当性確認完了",
    description: `ファイル「${ namedParameters.targetFileRelativePath }」はW3Cの全規則・推薦を遵守。\n` +
        `秒間経過：${ namedParameters.secondsElapsed }`
  }),

  issuesFoundNotification: {
    title: "HTML妥当性確認、問題発見",
    message: "W3C規格・推薦違反が発見されました。詳細はコンソールを御確認下さい。"
  },

  generateIssueOccurrenceLocationIndication: (
    namedParameters: HTML_Validator.Localization.IssueOccurrenceLocationIndication.NamedParameters
  ): string => `${ namedParameters.lineNumber }行目　` +
      `${ namedParameters.startingColumnNumber }～${ namedParameters.lastColumnNumber }列目`,

  issuesTypesTitles: {
    grossViolation: "HTML規格規格違反",
    recommendationDisregard: "W3C推薦無視",
    other: "其の他の不備",
    keyAndValueSeparator: "："
  },

  generateIssuesFoundErrorLog: (
    namedParameters: HTML_Validator.Localization.IssuesFoundErrorLog.NamedParameters
  ): Log => ({
    customBadgeText: "HTML妥当性確認不合格",
    title: "HTML規格違反・W3C推薦無視が発見",
    description: `ファイル「${ namedParameters.targetFileRelativePath }」は下記の問題を含めています\n\n` +
        `${ namedParameters.formattedErrors }\n\n`
  }),

  validationFailedErrorLog: {
    title: "HTML妥当性確認失敗",
    description: "HTML妥当性確認中不具合が発生した。"
  }
};


export default HTML_ValidatorLocalization__Japanese;
