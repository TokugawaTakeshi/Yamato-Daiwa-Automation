import PointersReferencesResolverForHTML from
    "@MarkupProcessing/Plugins/PointersReferencesResolverForHTML/PointersReferencesResolverForHTML";
import Localization = PointersReferencesResolverForHTML.Localization;


const resourcesReferencesResolverForHTML_Localization__english: Localization = {

  generateUnknownResourceGroupReferenceWarningLog: (
    templateVariables: Localization.UnknownResourceGroupReferenceWarningLog.TemplateVariables
  ): Localization.UnknownResourceGroupReferenceWarningLog => ({
    title: `Unknown reference to ${ templateVariables.fileType__pluralForm } files group`,
    description: `The reference '${ templateVariables.firstPathSegment }' in path ` +
        `'${ templateVariables.pickedPathOfTargetResourceFile }' refers to unknown resources group. ` +
        `Below references are available for ${ templateVariables.fileType__pluralForm } files: \n` +
        templateVariables.formattedSourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap
  }),

  generateNoMatchingsForAliasedFilePathWithoutFilenameExtensionWarningLog: (
    templateVariables: Localization.NoMatchingsForAliasedFilePathWithoutFilenameExtensionWarningLog.TemplateVariables
  ): Localization.NoMatchingsForAliasedFilePathWithoutFilenameExtensionWarningLog => ({
    title: `Unknown path to ${ templateVariables.fileType__singularForm } file`,
    description: `The aliased path '${ templateVariables.pickedPathOfTargetResourceFile }' refers to unknown file. ` +
        "Tried to search at path with all supported filename extensions: " +
        `${ templateVariables.checkedAbsolutePaths__formatted }.`
  }),

  generateNoOutputFileExistingForSpecifiedSourceFilePathWarningLog: (
    templateVariables: Localization.NoOutputFileExistingForSpecifiedSourceFilePathWarningLog.TemplateVariables
  ): Localization.NoOutputFileExistingForSpecifiedSourceFilePathWarningLog => ({
    title: `Unknown path to ${ templateVariables.fileType__singularForm } file`,
    description: `No ${ templateVariables.fileType__singularForm } output file has been found for specified source ` +
      `file path '${ templateVariables.pickedPathOfTargetResourceFile }' including reference.`
  })
};


export default resourcesReferencesResolverForHTML_Localization__english;
