import { ResourcesReferencesResolverForHTML } from "@yamato-daiwa/automation/LocalizationRequirements";
import Localization = ResourcesReferencesResolverForHTML.Localization;


const resourcesReferencesResolverForHTML_Localization__russian: ResourcesReferencesResolverForHTML.Localization = {

  generateUnableToResolveShortenedAbsolutePathWarningLog: (
    namedParameters: Localization.UnableToResolveShortenedAbsolutePathWarningLog.TemplateNamedParameters
  ): Localization.UnableToResolveShortenedAbsolutePathWarningLog => ({
    title: `Невозможно вычислить укороченный абсолютный пункт для файла типа '${ namedParameters.filesType__singularForm }'`,
    description: "Поскольку публичный путь (publicPath) не указан для режима сборки " +
        `'${ namedParameters.projectBuildingMode }', то невозможно вычислить укороченный абсолютный путь файла ` +
        `'${ namedParameters.targetFileAbsolutePath }'. Вместо этого будет вычислен относительный путь.`
  }),

  generateUnknownResourceGroupReferenceWarningLog: (
    namedParameters: Localization.UnknownResourceGroupReferenceWarningLog.TemplateNamedParameters
  ): Localization.UnknownResourceGroupReferenceWarningLog => ({
    title: `Неизвестная ссылка на группу файлов типа '${ namedParameters.fileType__pluralForm }'`,
    description: `Указатель '${ namedParameters.firstPathSegment }' на группу файлов типа ` +
        `'${ namedParameters.fileType__pluralForm }' ссылается на неизвестную группу.` +
        "Для этого типа файлов доступны следующие указатели групп:\n" +
        `${ namedParameters.formattedSourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap }`
  }),

  generateNoMatchingsForAliasedFilePathWithoutFilenameExtensionWarningLog: (
    namedParameters: Localization.NoMatchingsForAliasedFilePathWithoutFilenameExtensionWarningLog.TemplateNamedParameters
  ): Localization.NoMatchingsForAliasedFilePathWithoutFilenameExtensionWarningLog => ({
    title: `Неизвестный путь к файлу типа '${ namedParameters.fileType__singularForm }'`,
    description: `Содержащий указатель на группу файлов путь '${ namedParameters.pickedPathOfTargetResourceFile }' ` +
        "с неявным расширением имени файла ссылается на неизвестный файл. Предприняты попытки искать файл со следующими " +
        `путями:\n ${ namedParameters.checkedAbsolutePaths__formatted }.`
  }),

  generateNoOutputFileExistingForSpecifiedSourceFilePathWarningLog: (
    namedParameters: Localization.NoOutputFileExistingForSpecifiedSourceFilePathWarningLog.TemplateNamedParameters
  ): Localization.NoOutputFileExistingForSpecifiedSourceFilePathWarningLog => ({
    title: `Неизвестный путь к файлу типа '${ namedParameters.fileType__singularForm }'`,
    description: "Не найдено выходного фала, соответствующего исходному файлу пути " +
        `'${ namedParameters.pickedPathOfTargetResourceFile }'.`
  })
};


export default resourcesReferencesResolverForHTML_Localization__russian;
