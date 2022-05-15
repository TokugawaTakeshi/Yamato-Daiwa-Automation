import type {
  WarningLog,
  InfoLog,
  SuccessLog,
  Log
} from "@yamato-daiwa/es-extensions";

import type AccessibilityInspectorLocalization from "./AccessibilityInspectorLocalization";


const AccessibilityInspectorLocalization__Japanese: AccessibilityInspectorLocalization.Translations = {

  fileIsEmptyWarningLog: (
      parametersObject: AccessibilityInspectorLocalization.FileIsEmptyWarningLog.ParametersObject
  ): WarningLog => ({
    title: "アクセサビリチ検問中断",
    description: `ファイル：「${ parametersObject.targetFileRelativePath }」は空なので、アクセサビリチ検問を検問する事は意味無い。`
  }),

  validationStartedInfoLog: (
      parametersObject: AccessibilityInspectorLocalization.InspectionStartedInfoLog.ParametersObject
  ): InfoLog => ({
    title: "アクセサビリチ検問開始",
    description: `此れよりファイル「${ parametersObject.targetFileRelativePath }」のアクセサビリチ確認を開始します・・・`
  }),

  inspectionFinishedWithNoIssuesFoundSuccessLog: (
      parametersObject: AccessibilityInspectorLocalization.InspectionFinishedWithNoIssuesFoundSuccessLog.ParametersObject
  ): SuccessLog => ({
    title: "アクセサビリチ検問完了",
    description: `ファイル：「${ parametersObject.targetFileRelativePath }」はアクセサビリチの問題は無い。\n` +
        `秒間経過：${ parametersObject.secondsElapsed }`
  }),

  issuesFoundNotification: {
    title: "アクセサビリチ検問、問題発見",
    message: "詳細はコンソールを御確認下さい"
  },

  issueOccurrenceLocationIndication: (
      parametersObject: AccessibilityInspectorLocalization.IssueOccurrenceLocationIndication.ParametersObject
  ): string => `${ parametersObject.lineNumber }行目　${ parametersObject.columnNumber }列目`,

  issuesFoundErrorLog: (
      parametersObject: AccessibilityInspectorLocalization.IssuesFoundErrorLog.ParametersObject
  ): Log => ({
    customBadgeText: "アクセサビリチ確認不合格",
    title: "アクセサビリチ欠陥発見",
    description: `ファイル：「${ parametersObject.targetFileRelativePath }」は下記の問題を含めている\n\n` +
        `${ parametersObject.formattedErrors }\n\n`
  }),

  formattedError: {
    violatedGuidelineItem: "対象規格条",
    keyAndValueSeparator: "："
  }
};


export default AccessibilityInspectorLocalization__Japanese;
