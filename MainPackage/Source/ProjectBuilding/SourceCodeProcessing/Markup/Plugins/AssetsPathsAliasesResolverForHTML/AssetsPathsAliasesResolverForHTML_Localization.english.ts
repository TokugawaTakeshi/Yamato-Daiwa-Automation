import ResourceFilesPathsAliasesResolverForHTML from
    "@MarkupProcessing/Plugins/AssetsPathsAliasesResolverForHTML/ResourceFilesPathsAliasesResolverForHTML";
import Localization = ResourceFilesPathsAliasesResolverForHTML.Localization;

import { capitalizeFirstCharacter } from "@yamato-daiwa/es-extensions";
import type { WarningLog } from "@yamato-daiwa/es-extensions";


const assetsPathsAliasesResolverForHTML_Localization__english: ResourceFilesPathsAliasesResolverForHTML.Localization = {

  generateUnableToResolveShortenedAbsolutePathWarning: (
    namedParameters: Localization.UnableToResolveShortenedAbsolutePathWarning.TemplateNamedParameters
  ): Pick<WarningLog, "title" | "description"> => ({
    title: `${ capitalizeFirstCharacter(namedParameters.filesType__singularForm) } file, unable to resolve the absolute path`,
    description: `Unable to resolve the shortened absolute path for the ${ namedParameters.filesType__singularForm } file ` +
        `because no public path has been specified for '${ namedParameters.projectBuildingMode }' project building mode. ` +
        "Relative path will be used instead."
  }),

  generateUnknownSourceFileTopDirectoryAliasWarning: (
    namedParameters: Localization.UnknownSourceFileTopDirectoryAliasWarning.TemplateNamedParameters
  ): Pick<WarningLog, "title" | "description"> => ({
    title: `${ namedParameters.fileType__singularForm } file, unknown directory path alias`,
    description: `The alias '${ namedParameters.firstPathSegment }' in path ` +
        `'${ namedParameters.pickedPathOfTargetResourceFile }' has not been specified neither explicitly nor implicitly ` +
        "(via resources group name). Below directories paths' aliases are available for usage: \n" +
        `${ namedParameters.formattedSourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap }`
  }),

  generateNoMatchingsForAliasedFilePathWithoutFilenameExtensionWarning: (
    namedParameters: Localization.NoMatchingsForAliasedFilePathWithoutFilenameExtensionWarning.TemplateNamedParameters
  ): Pick<WarningLog, "title" | "description"> => ({
    title: `Unknown path to ${ namedParameters.fileType__singularForm } file`,
    description: `The aliased path '${ namedParameters.pickedPathOfTargetResourceFile }' without filename extension ` +
        "refers to unknown file. Tried to search with all supported filename extensions: " +
        `${ namedParameters.checkedAbsolutePaths__formatted }.`
  }),

  generateNoOutputFileExistingForSpecifiedSourceFilePath: (
    namedParameters: Localization.NoOutputFileExistingForSpecifiedSourceFilePath.TemplateNamedParameters
  ): Pick<WarningLog, "title" | "description"> => ({
    title: `Unknown path to ${ namedParameters.fileType__singularForm } file`,
    description: `No ${ namedParameters.fileType__singularForm } output file has been found for specified aliased source ` +
      `file path '${ namedParameters.pickedPathOfTargetResourceFile }'.`
  })
};


export default assetsPathsAliasesResolverForHTML_Localization__english;
