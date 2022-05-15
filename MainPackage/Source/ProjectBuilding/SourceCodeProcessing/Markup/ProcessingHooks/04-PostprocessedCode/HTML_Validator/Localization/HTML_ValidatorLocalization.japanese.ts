import type {
  WarningLog,
  InfoLog,
  SuccessLog,
  Log
} from "@yamato-daiwa/es-extensions";

import type HTML_ValidatorLocalization from "./HTML_ValidatorLocalization";


const HTML_ValidatorLocalization__Japanese: HTML_ValidatorLocalization = {

  fileIsEmptyWarningLog: (parametersObject: HTML_ValidatorLocalization.FileIsEmptyWarningLog.ParametersObject): WarningLog => ({
    title: "HTML妥当性検問中断",
    description: `ファイル：「${ parametersObject.targetFileRelativePath }」は空なので、HTML妥当性を検問する事は意味無い。`
  }),

  validationStartedInfoLog: (
      parametersObject: HTML_ValidatorLocalization.ValidationStartedInfoLog.ParametersObject
  ): InfoLog => ({
    title: "HTML妥当性確認開始",
    description: `此れよりファイル「${ parametersObject.targetFileRelativePath }」のHTML妥当性確認を開始します・・・`
  }),

  validationFinishedWithNoIssuesFoundSuccessLog: (
      parametersObject: HTML_ValidatorLocalization.ValidationFinishedWithNoIssuesFoundSuccessLog.ParametersObject
  ): SuccessLog => ({
    title: "HTML妥当性確認完了",
    description: `ファイル：「${ parametersObject.targetFileRelativePath }」はW3Cの全規則・推薦を遵守。\n` +
        `秒間経過：${ parametersObject.secondsElapsed }`
  }),

  issuesFoundNotification: {
    title: "HTML妥当性確認：w3c規格・推薦違反発見",
    message: "詳細はコンソールを御確認下さい"
  },

  issueOccurrenceLocationIndication: (
      parametersObject: HTML_ValidatorLocalization.IssueOccurrenceLocationIndication.ParametersObject
  ): string => `${ parametersObject.lineNumber }行目　` +
      `${ parametersObject.startingColumnNumber }～${ parametersObject.lastColumnNumber }列目`,

  issuesTypesTitles: {
    grossViolation: "HTML規格規格違反",
    recommendationDisregard: "W3C推薦無視",
    other: "其の他の不備",
    keyAndValueSeparator: "："
  },

  issuesFoundErrorLog: (
      parametersObject: HTML_ValidatorLocalization.IssuesFoundErrorLog.ParametersObject
  ): Log => ({
    customBadgeText: "HTML妥当性確認不合格",
    title: "HTML規格違反・W3C推薦無視が発見",
    description: `ファイル：「${ parametersObject.targetFileRelativePath }」は下記の問題を含めている\n\n` +
        `${ parametersObject.formattedErrors }\n\n`
  }),

  validationFailedErrorLog: {
    title: "HTML妥当性確認失敗",
    description: "HTML妥当性確認中不具合が発生した。"
  }
};


export default HTML_ValidatorLocalization__Japanese;
