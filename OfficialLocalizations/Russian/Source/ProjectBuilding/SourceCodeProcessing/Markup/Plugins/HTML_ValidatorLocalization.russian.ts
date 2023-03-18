import { HTML_ValidatorLocalization } from "@yamato-daiwa/automation/LocalizationRequirements";


const HTML_ValidatorLocalization__russian: HTML_ValidatorLocalization = {

  generateFileIsEmptyWarningLog: (
    namedParameters: HTML_ValidatorLocalization.FileIsEmptyWarningLog.NamedParameters
  ): HTML_ValidatorLocalization.FileIsEmptyWarningLog =>
      ({
        title: "Валидация HTML кода прервана",
        description: `Файл '${ namedParameters.targetFileRelativePath }' пуст; валидация HTML кода не будет ` +
            "выполнена на этот раз."
      }),

  generateValidationStartedInfoLog: (
    namedParameters: HTML_ValidatorLocalization.ValidationStartedInfoLog.NamedParameters
  ): HTML_ValidatorLocalization.ValidationStartedInfoLog => ({
    title: "Начало валидации HTML кода",
    description: `Проверка HTML кода файла '${ namedParameters.targetFileRelativePath }' на доступность началась ...`
  }),

  generateValidationFinishedWithNoIssuesFoundSuccessLog: (
    namedParameters: HTML_ValidatorLocalization.ValidationFinishedWithNoIssuesFoundSuccessLog.NamedParameters
  ): HTML_ValidatorLocalization.ValidationFinishedWithNoIssuesFoundSuccessLog => ({
    title: "Валидация HTML-кода завершена",
    description: `HTML-код файла '${ namedParameters.targetFileRelativePath }' полностью соответствует правилам и ` +
        `рекомендациям W3C\n Валидация заняла ${ namedParameters.secondsElapsed } секунд.`
  }),

  issuesFoundNotification: {
    title: "Валидация HTML-кода: обнаружены проблемы",
    message: "Обнаружены нарушения правил и рекомендаций W3C в одном или более HTML-файлах. " +
        "См. консоль для получения подробной информации."
  },

  generateIssueOccurrenceLocationIndication: (
    namedParameters: HTML_ValidatorLocalization.IssueOccurrenceLocationIndication.NamedParameters
  ): string => `Строка ${ namedParameters.lineNumber }, ` +
      `колонки ${ namedParameters.startingColumnNumber }-${ namedParameters.lastColumnNumber }`,

  issuesTypesTitles: {
    grossViolation: "Нарушение стандарта HTML",
    recommendationDisregard: "Пренебрежение рекомендацией W3C",
    other: "Особая проблема",
    keyAndValueSeparator: ":"
  },

  generateIssuesFoundErrorLog: (
    namedParameters: HTML_ValidatorLocalization.IssuesFoundErrorLog.NamedParameters
  ): HTML_ValidatorLocalization.IssuesFoundErrorLog => ({
    customBadgeText: "Валидация HTML-кода не пройдена",
    title: "Обнаружены нарушения стандарта HTML и/или пренебрежение рекомендациями W3C",
    description: `HTML файл '${ namedParameters.targetFileRelativePath }' содержит следующие проблемы валидности HTML-кода:` +
        `\n\n${ namedParameters.formattedErrorsAndWarnings }\n\n`
  }),

  validationFailedErrorLog: {
    title: "Ошибка валидации HTML-кода",
    description: "Возникла ошибка при валидации HTML-кода"
  }
};


export default HTML_ValidatorLocalization__russian;
