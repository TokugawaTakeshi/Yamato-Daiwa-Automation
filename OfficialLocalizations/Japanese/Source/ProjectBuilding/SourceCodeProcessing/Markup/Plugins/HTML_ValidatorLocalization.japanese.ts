import { HTML_ValidatorLocalization } from "@yamato-daiwa/automation/LocalizationRequirements";


const HTML_ValidatorLocalization__japanese: HTML_ValidatorLocalization = {

  generateFileIsEmptyWarningLog: (
    namedParameters: HTML_ValidatorLocalization.FileIsEmptyWarningLog.NamedParameters
  ): HTML_ValidatorLocalization.FileIsEmptyWarningLog =>
      ({
        title: "HTMLコード妥当性検問中断",
        description: `ファイル「${ namedParameters.targetFileRelativePath }」は空なので、確認対象のHTMはありません。`
      }),

  generateValidationStartedInfoLog: (
    namedParameters: HTML_ValidatorLocalization.ValidationStartedInfoLog.NamedParameters
  ): HTML_ValidatorLocalization.ValidationStartedInfoLog => ({
    title: "HTML妥当性確認開始",
    description: `これよりファイル「${ namedParameters.targetFileRelativePath }」にあるHTMLコードの妥当性検問を開始します・・・`
  }),

  generateValidationFinishedWithNoIssuesFoundSuccessLog: (
    namedParameters: HTML_ValidatorLocalization.ValidationFinishedWithNoIssuesFoundSuccessLog.NamedParameters
  ): HTML_ValidatorLocalization.ValidationFinishedWithNoIssuesFoundSuccessLog => ({
    title: "HTML妥当性確認完了",
    description: `ファイル「${ namedParameters.targetFileRelativePath }」はW3Cの全規則・推薦を遵守。\n` +
        `秒間経過：${ namedParameters.secondsElapsed }`
  }),

  issuesFoundNotification: {
    title: "HTML妥当性確認、問題発見",
    message: "W3C規格・推薦違反が発見されました。詳細はコンソールを御確認下さい。"
  },

  generateIssueOccurrenceLocationIndication: (
    namedParameters: HTML_ValidatorLocalization.IssueOccurrenceLocationIndication.NamedParameters
  ): string => `${ namedParameters.lineNumber }行目　` +
      `${ namedParameters.startingColumnNumber }～${ namedParameters.lastColumnNumber }列目`,

  issuesTypesTitles: {
    grossViolation: "HTML規格規格違反",
    recommendationDisregard: "W3C推薦無視",
    other: "其の他の不備",
    keyAndValueSeparator: "："
  },

  generateIssuesFoundErrorLog: (
    namedParameters: HTML_ValidatorLocalization.IssuesFoundErrorLog.NamedParameters
  ): HTML_ValidatorLocalization.IssuesFoundErrorLog => ({
    customBadgeText: "HTML妥当性確認不合格",
    title: "HTML規格違反・W3C推薦無視が発見",
    description: `ファイル「${ namedParameters.targetFileRelativePath }」は下記の問題を含めています\n\n` +
        `${ namedParameters.formattedErrorsAndWarnings }\n\n`
  }),

  validationFailedErrorLog: {
    title: "HTML妥当性確認失敗",
    description: "HTML妥当性確認中不具合が発生した。"
  }
};


export default HTML_ValidatorLocalization__japanese;
