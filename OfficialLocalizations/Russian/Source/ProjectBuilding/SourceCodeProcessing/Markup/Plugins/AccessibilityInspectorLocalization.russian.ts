import { AccessibilityInspectorLocalization } from "@yamato-daiwa/automation/LocalizationRequirements";


const accessibilityInspectorLocalization__russian: AccessibilityInspectorLocalization = {

  generateFileIsEmptyWarningLog: (
    namedParameters: AccessibilityInspectorLocalization.FileIsEmptyWarningLog.NamedParameters
  ): AccessibilityInspectorLocalization.FileIsEmptyWarningLog => ({
    title: "Проверка HTML кода на доступность прервана",
    description: `Файл '${ namedParameters.targetFileRelativePath }' пуст; проверка HTML кода на доступность не будет ` +
        "выполнена на этот раз."
  }),

  generateInspectionStartedInfoLog: (
    namedParameters: AccessibilityInspectorLocalization.InspectionStartedInfoLog.NamedParameters
  ): AccessibilityInspectorLocalization.InspectionStartedInfoLog => ({
    title: "Начало проверки HTML кода на доступность",
    description: `Проверка HTML кода файла '${ namedParameters.targetFileRelativePath }' на доступность началась ...`
  }),

  generateInspectionFinishedWithNoIssuesFoundSuccessLog: (
    namedParameters: AccessibilityInspectorLocalization.InspectionFinishedWithNoIssuesFoundSuccessLog.NamedParameters
  ): AccessibilityInspectorLocalization.InspectionFinishedWithNoIssuesFoundSuccessLog => ({
    title: "Проверка доступности HTML-кода завершена",
    description: `В HTML коде файла '${ namedParameters.targetFileRelativePath }' проблем с доступность не обнаружено. \n` +
        `Проверка заняла ${ namedParameters.secondsElapsed } секунд.`
  }),

  issuesFoundNotification: {
    title: "Проверка доступности HTML-кода: обнаружены проблемы",
    message: "Обнаружены проблемы доступности HTML-кода в одном или более файла. См. консоль для получения подробной информации."
  },

  generateIssueOccurrenceLocationIndication: (
    namedParameters: AccessibilityInspectorLocalization.IssueOccurrenceLocationIndication.NamedParameters
  ): string => `Строка ${ namedParameters.lineNumber },　колонка ${ namedParameters.columnNumber }`,

  generateIssuesFoundErrorLog: (
    namedParameters: AccessibilityInspectorLocalization.IssuesFoundErrorLog.NamedParameters
  ): AccessibilityInspectorLocalization.IssuesFoundErrorLog => ({
    customBadgeText: "Проверка на доступность HTML кода не пройдена",
    title: "Проверка на доступность HTML-кода, обнаружены проблемы",
    description: `HTML файл '${ namedParameters.targetFileRelativePath }' содержит следующие проблемы доступности HTML-кода:` +
        `\n\n${ namedParameters.formattedErrorsAndWarnings }\n\n`
  }),

  formattedError: {
    violatedGuidelineItem: "Нарушение",
    keyAndValueSeparator: ":"
  }
};


export default accessibilityInspectorLocalization__russian;
