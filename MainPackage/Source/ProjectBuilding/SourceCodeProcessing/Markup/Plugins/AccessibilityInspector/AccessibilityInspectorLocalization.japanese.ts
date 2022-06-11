import type AccessibilityInspector from "@MarkupProcessing/Plugins/AccessibilityInspector/AccessibilityInspector";

import type {
  WarningLog,
  InfoLog,
  SuccessLog,
  Log
} from "@yamato-daiwa/es-extensions";


const AccessibilityInspectorLocalization__Japanese: AccessibilityInspector.Localization = {

  generateFileIsEmptyWarningLog: (
    namedParameters: AccessibilityInspector.Localization.FileIsEmptyWarningLog.NamedParameters
  ): WarningLog => ({
    title: "アクセサビリチ検問中断",
    description: `ファイル「${ namedParameters.targetFileRelativePath }」は空なので、アクセサビリチを検問する事は出来ません。`
  }),

  generateInspectionStartedInfoLog: (
    namedParameters: AccessibilityInspector.Localization.InspectionStartedInfoLog.NamedParameters
  ): InfoLog => ({
    title: "アクセサビリチ検問開始",
    description: `これよりファイル「${ namedParameters.targetFileRelativePath }」のアクセサビリチ検問を開始します・・・`
  }),

  generateInspectionFinishedWithNoIssuesFoundSuccessLog: (
    namedParameters: AccessibilityInspector.Localization.InspectionFinishedWithNoIssuesFoundSuccessLog.NamedParameters
  ): SuccessLog => ({
    title: "アクセサビリチ検問完了",
    description: `ファイル「${ namedParameters.targetFileRelativePath }」はアクセサビリチの問題はありません。\n` +
        `秒間経過：${ namedParameters.secondsElapsed }`
  }),

  issuesFoundNotification: {
    title: "アクセサビリチ検問、問題発見",
    message: "詳細はコンソールを御確認下さい"
  },

  generateIssueOccurrenceLocationIndication: (
    namedParameters: AccessibilityInspector.Localization.IssueOccurrenceLocationIndication.NamedParameters
): string => `${ namedParameters.lineNumber }行目　${ namedParameters.columnNumber }列目`,

  generateIssuesFoundErrorLog: (
    namedParameters: AccessibilityInspector.Localization.IssuesFoundErrorLog.NamedParameters
  ): Log => ({
    customBadgeText: "アクセサビリチ検問不合格",
    title: "アクセサビリチ問題発見",
    description: `ファイル「${ namedParameters.targetFileRelativePath }」は下記の問題を含めています\n\n` +
        `${ namedParameters.formattedErrors }\n\n`
  }),

  formattedError: {
    violatedGuidelineItem: "対象規格条",
    keyAndValueSeparator: "："
  }
};


export default AccessibilityInspectorLocalization__Japanese;
