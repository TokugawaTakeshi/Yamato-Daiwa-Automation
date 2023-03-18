import { ResourcesReferencesResolverForHTML_Localization } from "@yamato-daiwa/automation/LocalizationRequirements";
import Localization = ResourcesReferencesResolverForHTML_Localization;


const resourcesReferencesResolverForHTML_Localization__japanese: ResourcesReferencesResolverForHTML_Localization = {

  generateUnableToResolveShortenedAbsolutePathWarningLog: (
    namedParameters: Localization.UnableToResolveShortenedAbsolutePathWarningLog.TemplateNamedParameters
  ): Localization.UnableToResolveShortenedAbsolutePathWarningLog => ({
    title: `${ namedParameters.filesType__singularForm }ファイル、諸略絶対パス算出不可能`,
    description: `プロジェクト構成モード「${ namedParameters.projectBuildingMode }」に該当する公開パスが指定されていない為、` +
        `${ namedParameters.filesType__singularForm }の絶対パスの算出は不可能。代わりに相対パスを算出。`
  }),

  generateUnknownResourceGroupReferenceWarningLog: (
    namedParameters: Localization.UnknownResourceGroupReferenceWarningLog.TemplateNamedParameters
  ): Localization.UnknownResourceGroupReferenceWarningLog => ({
    title: `「${ namedParameters.fileType__pluralForm }」ファイル、不明群参照`,
    description: `指定されたパス「${ namedParameters.pickedPathOfTargetResourceFile }」に在る群参照` +
        `「${ namedParameters.firstPathSegment }」は不明資源群に参照している。` +
        `「${ namedParameters.fileType__pluralForm }」ファイルにとって下記の群参考を利用可能。\n` +
        `${ namedParameters.formattedSourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap }`
  }),

  generateNoMatchingsForAliasedFilePathWithoutFilenameExtensionWarningLog: (
    namedParameters: Localization.NoMatchingsForAliasedFilePathWithoutFilenameExtensionWarningLog.TemplateNamedParameters
  ): Localization.NoMatchingsForAliasedFilePathWithoutFilenameExtensionWarningLog => ({
    title: `${ namedParameters.fileType__singularForm }ファイルの不明パス`,
    description: `アリアスあり、無ファイル名拡張子パス「${ namedParameters.pickedPathOfTargetResourceFile }」は不明ファイルに参照。` +
        `下記のパスを確認した。${ namedParameters.checkedAbsolutePaths__formatted }.`
  }),

  generateNoOutputFileExistingForSpecifiedSourceFilePathWarningLog: (
    namedParameters: Localization.NoOutputFileExistingForSpecifiedSourceFilePathWarningLog.TemplateNamedParameters
  ): Localization.NoOutputFileExistingForSpecifiedSourceFilePathWarningLog => ({
    title: `${ namedParameters.fileType__singularForm }ファイルの不明パス`,
    description: `パス「${ namedParameters.pickedPathOfTargetResourceFile }」に該当する${ namedParameters.fileType__singularForm }` +
        "出力ファイルが発見されなかった。"
  })
};


export default resourcesReferencesResolverForHTML_Localization__japanese;
