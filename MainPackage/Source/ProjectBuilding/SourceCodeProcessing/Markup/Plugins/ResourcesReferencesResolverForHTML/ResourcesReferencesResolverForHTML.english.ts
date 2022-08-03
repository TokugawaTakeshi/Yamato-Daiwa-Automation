import ResourcesReferencesResolverForHTML from
    "@MarkupProcessing/Plugins/ResourcesReferencesResolverForHTML/ResourcesReferencesResolverForHTML";
import Localization = ResourcesReferencesResolverForHTML.Localization;

import { capitalizeFirstCharacter } from "@yamato-daiwa/es-extensions";


const resourcesReferencesResolverForHTML_Localization__english: ResourcesReferencesResolverForHTML.Localization = {

  generateUnableToResolveShortenedAbsolutePathWarningLog: (
    namedParameters: Localization.UnableToResolveShortenedAbsolutePathWarningLog.TemplateNamedParameters
  ): Localization.UnableToResolveShortenedAbsolutePathWarningLog => ({
    title: `${ capitalizeFirstCharacter(namedParameters.filesType__singularForm) } file, unable to resolve the absolute path`,
    description: `Unable to resolve the shortened absolute path for the ${ namedParameters.filesType__singularForm } file ` +
        `because no public path has been specified for '${ namedParameters.projectBuildingMode }' project building mode. ` +
        "Relative path will be used instead."
  }),

  generateUnknownResourceGroupReferenceWarningLog: (
    namedParameters: Localization.UnknownResourceGroupReferenceWarningLog.TemplateNamedParameters
  ): Localization.UnknownResourceGroupReferenceWarningLog => ({
    title: `Unknown reference to ${ namedParameters.fileType__pluralForm } files group`,
    description: `The reference '${ namedParameters.firstPathSegment }' in path ` +
        `'${ namedParameters.pickedPathOfTargetResourceFile }' refers to unknown resources group. ` +
        `Below references are available for ${ namedParameters.fileType__pluralForm } files: \n` +
        `${ namedParameters.formattedSourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap }`
  }),

  generateNoMatchingsForAliasedFilePathWithoutFilenameExtensionWarningLog: (
    namedParameters: Localization.NoMatchingsForAliasedFilePathWithoutFilenameExtensionWarningLog.TemplateNamedParameters
  ): Localization.NoMatchingsForAliasedFilePathWithoutFilenameExtensionWarningLog => ({
    title: `Unknown path to ${ namedParameters.fileType__singularForm } file`,
    description: `The aliased path '${ namedParameters.pickedPathOfTargetResourceFile }' without filename extension ` +
        "refers to unknown file. Tried to search at path with all supported filename extensions: " +
        `${ namedParameters.checkedAbsolutePaths__formatted }.`
  }),

  generateNoOutputFileExistingForSpecifiedSourceFilePathWarningLog: (
    namedParameters: Localization.NoOutputFileExistingForSpecifiedSourceFilePathWarningLog.TemplateNamedParameters
  ): Localization.NoOutputFileExistingForSpecifiedSourceFilePathWarningLog => ({
    title: `Unknown path to ${ namedParameters.fileType__singularForm } file`,
    description: `No ${ namedParameters.fileType__singularForm } output file has been found for specified source ` +
      `file path '${ namedParameters.pickedPathOfTargetResourceFile }' including reference.`
  })
};


export default resourcesReferencesResolverForHTML_Localization__english;
