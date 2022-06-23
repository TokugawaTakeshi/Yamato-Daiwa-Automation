import ResourceFilesPathsAliasesResolverForHTML from
    "@MarkupProcessing/Plugins/AssetsPathsAliasesResolverForHTML/ResourceFilesPathsAliasesResolverForHTML";
import Localization = ResourceFilesPathsAliasesResolverForHTML.Localization;

import type { WarningLog } from "@yamato-daiwa/es-extensions";


const assetsPathsAliasesResolverForHTML_Localization__japanese: ResourceFilesPathsAliasesResolverForHTML.Localization = {

  generateUnableToResolveShortenedAbsolutePathWarning: (
    namedParameters: Localization.UnableToResolveShortenedAbsolutePathWarning.TemplateNamedParameters
  ): Pick<WarningLog, "title" | "description"> => ({
    title: `${ namedParameters.filesType__singularForm }ファイル、諸略絶対パス算出不可能`,
    description: `プロジェクト構成モード「${ namedParameters.projectBuildingMode }」に該当する公開パスが指定されていない為、` +
        `${ namedParameters.filesType__singularForm }の絶対パスの算出は不可能。代わりに相対パスを利用。`
  }),

  generateUnknownSourceFileTopDirectoryAliasWarning: (
    namedParameters: Localization.UnknownSourceFileTopDirectoryAliasWarning.TemplateNamedParameters
  ): Pick<WarningLog, "title" | "description"> => ({
    title: `「${ namedParameters.fileType__singularForm }」ファイル、不明ディレクトリ・パス・アリアス`,
    description: `指定されたパス「${ namedParameters.pickedPathOfTargetResourceFile }」に在るアリアス` +
        `「${ namedParameters.firstPathSegment }」明示的も、暗黙的も（群の指定で）定義されていない。下記のアリアスを利用可能。\n` +
        `${ namedParameters.formattedSourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap }`
  }),

  generateNoMatchingsForAliasedFilePathWithoutFilenameExtensionWarning: (
    namedParameters: Localization.NoMatchingsForAliasedFilePathWithoutFilenameExtensionWarning.TemplateNamedParameters
  ): Pick<WarningLog, "title" | "description"> => ({
    title: `${ namedParameters.fileType__singularForm }ファイルの不明パス`,
    description: `アリアスあり、無ファイル名拡張子パス「${ namedParameters.pickedPathOfTargetResourceFile }」は不明ファイルに参照。` +
        `下記のパスを確認した。${ namedParameters.checkedAbsolutePaths__formatted }.`
  }),

  generateNoOutputFileExistingForSpecifiedSourceFilePath: (
    namedParameters: Localization.NoOutputFileExistingForSpecifiedSourceFilePath.TemplateNamedParameters
  ): Pick<WarningLog, "title" | "description"> => ({
    title: `${ namedParameters.fileType__singularForm }ファイルの不明パス`,
    description: `パス「${ namedParameters.pickedPathOfTargetResourceFile }」に該当する${ namedParameters.fileType__singularForm }` +
        "出力ファイルが発見されなかった。"
  })
};


export default assetsPathsAliasesResolverForHTML_Localization__japanese;
