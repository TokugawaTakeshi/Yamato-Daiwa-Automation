import type AssetsPathsAliasesResolverForHTML from
    "@MarkupProcessing/Plugins/AssetsPathsAliasesResolverForHTML/AssetsPathsAliasesResolverForHTML";
import type { WarningLog } from "@yamato-daiwa/es-extensions";


const assetsPathsAliasesResolverForHTML_Localization__english: AssetsPathsAliasesResolverForHTML.Localization = {

  generateUnableToComputeShortenedAbsolutePathWarning: (
    namedParameters: AssetsPathsAliasesResolverForHTML.Localization.UnableToComputeShortenedAbsolutePathWarning.NamedParameters
  ): Pick<WarningLog, "title" | "description"> => ({
    title: `${ namedParameters.filesTypeForLogging } files, unable to generate the absolute path`,
    description: `Unable to generate the shortened absolute path for the ${ namedParameters.filesTypeForLogging } files ` +
        `because no public path has been specified for '${ namedParameters.projectBuildingMode }' mode. Relative path ` +
        "will be generated instead."
  }),

  generateUnknownSourceFileTopDirectoryAliasWarning: (
    namedParameters: AssetsPathsAliasesResolverForHTML.Localization.UnknownSourceFileTopDirectoryAliasWarning.NamedParameters
  ): Pick<WarningLog, "title" | "description"> => ({
    title: `${ namedParameters.fileTypeForLogging } files, unknown path alias`,
    description: `The alias '${ namedParameters.firstPathSegment }' in path '${ namedParameters.pickedPath }' has not been ` +
        "specified neither explicitly nor implicitly. Below aliases are available for usage: \n" +
        `${ namedParameters.formattedSourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap }`
  })
};


export default assetsPathsAliasesResolverForHTML_Localization__english;
