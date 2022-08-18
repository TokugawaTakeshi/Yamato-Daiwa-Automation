import { AccessibilityInspector } from "@yamato-daiwa/automation/LocalizationRequirements";


const accessibilityInspectorLocalization__japanese: AccessibilityInspector.Localization = {

  generateFileIsEmptyWarningLog: (
    namedParameters: AccessibilityInspector.Localization.FileIsEmptyWarningLog.NamedParameters
  ): AccessibilityInspector.Localization.FileIsEmptyWarningLog => ({
    title: "HTMLコードのアクセサビリチ検問中断",
    description: `ファイル「${ namedParameters.targetFileRelativePath }」は空なので、今回はアクセサビリチの検問は実行されません。`
  }),

  generateInspectionStartedInfoLog: (
    namedParameters: AccessibilityInspector.Localization.InspectionStartedInfoLog.NamedParameters
  ): AccessibilityInspector.Localization.InspectionStartedInfoLog => ({
    title: "HTMLコードのアクセサビリチ検問開始",
    description: `これよりファイル「${ namedParameters.targetFileRelativePath }」にあるHTMLコードのアクセサビリチ検問を開始します・・・`
  }),

  generateInspectionFinishedWithNoIssuesFoundSuccessLog: (
    namedParameters: AccessibilityInspector.Localization.InspectionFinishedWithNoIssuesFoundSuccessLog.NamedParameters
  ): AccessibilityInspector.Localization.InspectionFinishedWithNoIssuesFoundSuccessLog => ({
    title: "アクセサビリチ検問完了",
    description: `ファイル「${ namedParameters.targetFileRelativePath }」にあるHTMLコードはアクセサビリチの問題が有りません。\n` +
        `秒間経過：${ namedParameters.secondsElapsed }`
  }),

  issuesFoundNotification: {
    title: "HTMLアクセサビリチ検問、問題発見",
    message: "一つ以上のHTMLファイルにアクセサビリチ問題が発生しました。詳細はコンソールを御確認下さい。"
  },


  generateIssueOccurrenceLocationIndication: (
    namedParameters: AccessibilityInspector.Localization.IssueOccurrenceLocationIndication.NamedParameters
  ): string => `${ namedParameters.lineNumber }行目　${ namedParameters.columnNumber }列目`,

  generateIssuesFoundErrorLog: (
    namedParameters: AccessibilityInspector.Localization.IssuesFoundErrorLog.NamedParameters
  ): AccessibilityInspector.Localization.IssuesFoundErrorLog => ({
    customBadgeText: "HTMLコードアクセサビリチ検問不合格",
    title: "HTMLコードアクセサビリチ検問、問題発見",
    description: `HTMLファイル「${ namedParameters.targetFileRelativePath }」は下記のアクセサビリチ問題を含めています\n\n` +
        `${ namedParameters.formattedErrorsAndWarnings }\n\n`
  }),

  formattedError: {
    violatedGuidelineItem: "対象規格条",
    keyAndValueSeparator: "："
  }
};


export default accessibilityInspectorLocalization__japanese;
