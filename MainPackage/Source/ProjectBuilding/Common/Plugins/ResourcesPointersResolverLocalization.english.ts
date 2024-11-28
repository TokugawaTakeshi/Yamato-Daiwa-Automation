import ResourcesPointersResolver from "@ProjectBuilding/Common/Plugins/ResourcesPointersResolver";
import Localization = ResourcesPointersResolver.Localization;


const resourcesReferencesResolverForHTML_Localization__english: Localization = {

  generateUnknownResourcesGroupAliasWarningLog: (
    {
      resourcesGroupAlias,
      resourceFileType__singularForm,
      resourcePointer,
      resourceFileType__pluralForm,
      parentFilePathRelativeToConsumingProjectRootDirectory,
      formattedResourcesGroupsAliasesAndCorrespondingAbsolutePathsMap
    }: Localization.UnknownResourcesGroupPointerWarningLog.TemplateVariables
  ): Localization.NoOutputFileExistingForSpecifiedSourceFilePathWarningLog => ({
    title: "Unknown Resources Group Alias in Resource Pointer",
    description:
        `Unknown ${ resourceFileType__pluralForm } resources group alias "${ resourcesGroupAlias }" found in ` +
          `${ resourceFileType__singularForm } resource pointer "${ resourcePointer }" at the file ` +
          `"${ parentFilePathRelativeToConsumingProjectRootDirectory }". ` +
        `The ${ resourceFileType__pluralForm } resources group alias must refer to one of declared ` +
          `${ resourceFileType__pluralForm } resources group\n:` +
          formattedResourcesGroupsAliasesAndCorrespondingAbsolutePathsMap
  }),

  generateNoMatchesForResourceReferenceWihtoutExplicitSupportedFilenameExtensionWarningLog: (
    {
      resourceFileType__singularForm,
      resourcePointer,
      checkedAbsolutePathsOfTargetFilesFormattedList
    }: Localization.NoMatchesForAliasedFilePathWithoutFilenameExtensionWarningLog.TemplateVariables
  ): Localization.NoMatchesForAliasedFilePathWithoutFilenameExtensionWarningLog => ({
    title: "Unknown Resource Pointer",
    description:
        `No ${ resourceFileType__singularForm } file found for ${ resourceFileType__singularForm } resource ` +
          `pointer "${ resourcePointer }" which has no explicit supported file name extension. ` +
        "Tried to search at paths with all supported filenames extensions:\n" +
        checkedAbsolutePathsOfTargetFilesFormattedList
  }),

  generateFileNotFoundForResolvedResourceReferenceWarningLog: (
    {
      resourceFileType__singularForm,
      resourcePointer,
      resolvedFileAbsolutePath
    }: Localization.NoOutputFileExistingForSpecifiedSourceFilePathWarningLog.TemplateVariables
  ): Localization.NoOutputFileExistingForSpecifiedSourceFilePathWarningLog => ({
    title: "Unknown Resource Pointer",
    description:
        `The ${ resourceFileType__singularForm } resource pointer "${ resourcePointer }" has been resolved to ` +
          `absolute path "${ resolvedFileAbsolutePath }", but no output file has been found for this file/`
  })

};


export default resourcesReferencesResolverForHTML_Localization__english;
