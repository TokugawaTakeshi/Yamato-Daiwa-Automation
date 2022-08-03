import { HTML_Validator } from "@yamato-daiwa/automation/LocalizationRequirements";


const HTML_ValidatorLocalization__russian: HTML_Validator.Localization = {

  generateFileIsEmptyWarningLog: (
    namedParameters: HTML_Validator.Localization.FileIsEmptyWarningLog.NamedParameters
  ): HTML_Validator.Localization.FileIsEmptyWarningLog =>
      ({
        title: "Валидация HTML кода прервана",
        description: `Файл '${ namedParameters.targetFileRelativePath }' пуст; валидация HTML кода не будет ` +
            "выполнена на этот раз."
      }),

  generateValidationStartedInfoLog: (
    namedParameters: HTML_Validator.Localization.ValidationStartedInfoLog.NamedParameters
  ): HTML_Validator.Localization.ValidationStartedInfoLog => ({
    title: "Начало валидации HTML кода",
    description: `Проверка HTML кода файла '${ namedParameters.targetFileRelativePath }' на доступность началась ...`
  }),

  generateValidationFinishedWithNoIssuesFoundSuccessLog: (
    namedParameters: HTML_Validator.Localization.ValidationFinishedWithNoIssuesFoundSuccessLog.NamedParameters
  ): HTML_Validator.Localization.ValidationFinishedWithNoIssuesFoundSuccessLog => ({
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
    namedParameters: HTML_Validator.Localization.IssueOccurrenceLocationIndication.NamedParameters
  ): string => `Строка ${ namedParameters.lineNumber }, ` +
      `колонки ${ namedParameters.startingColumnNumber }-${ namedParameters.lastColumnNumber }`,

  issuesTypesTitles: {
    grossViolation: "Нарушение стандарта HTML",
    recommendationDisregard: "Пренебрежение рекомендацией W3C",
    other: "Особая проблема",
    keyAndValueSeparator: ":"
  },

  generateIssuesFoundErrorLog: (
    namedParameters: HTML_Validator.Localization.IssuesFoundErrorLog.NamedParameters
  ): HTML_Validator.Localization.IssuesFoundErrorLog => ({
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
