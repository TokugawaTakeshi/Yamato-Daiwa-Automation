import type AssetsPathsAliasesResolverForHTML from
    "@MarkupProcessing/Plugins/AssetsPathsAliasesResolverForHTML/AssetsPathsAliasesResolverForHTML";
import type { WarningLog } from "@yamato-daiwa/es-extensions";


const assetsPathsAliasesResolverForHTML_Localization__japanese: AssetsPathsAliasesResolverForHTML.Localization = {

  generateUnableToComputeShortenedAbsolutePathWarning: (
    namedParameters: AssetsPathsAliasesResolverForHTML.Localization.UnableToComputeShortenedAbsolutePathWarning.NamedParameters
  ): Pick<WarningLog, "title" | "description"> => ({
    title: `${ namedParameters.filesTypeForLogging }ファイル、諸略絶対パス算出不可能`,
    description: `プロジェクト構成モード「${ namedParameters.projectBuildingMode }」に該当する公開パスが指定されていない為、` +
        `${ namedParameters.filesTypeForLogging }の絶対パスの算出は不可能。代わりに相対パスを代入。`
  }),

  generateUnknownSourceFileTopDirectoryAliasWarning: (
    namedParameters: AssetsPathsAliasesResolverForHTML.Localization.UnknownSourceFileTopDirectoryAliasWarning.NamedParameters
  ): Pick<WarningLog, "title" | "description"> => ({
    title: `${ namedParameters.fileTypeForLogging }ファイル、不明パスアリアス`,
    description: `${ namedParameters.fileTypeForLogging }ファイルの指定されたパス「${ namedParameters.pickedPath }」に在るアリアス` +
        `「${ namedParameters.firstPathSegment }」明示的・暗黙的定義されていない。利用可能なアリアスは\n` +
        `${ namedParameters.formattedSourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap }`
  })
};


export default assetsPathsAliasesResolverForHTML_Localization__japanese;
