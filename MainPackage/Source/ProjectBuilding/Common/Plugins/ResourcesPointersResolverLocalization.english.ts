import ResourcesPointersResolver from "@ProjectBuilding/Common/Plugins/ResourcesPointersResolver";
import Localization = ResourcesPointersResolver.Localization;


const resourcesReferencesResolverForHTML_Localization__english: Localization = {

  generateUnknownResourcesGroupAliasWarningLog: (
    {
      resourceFileType__pluralForm,
      resourcesGroupAlias,
      resourceFileType__singularForm,
      resourcePointer,
      parentFileAbsolutePath,
      formattedResourcesGroupsAliasesAndCorrespondingAbsolutePathsMap
    }: Localization.UnknownResourcesGroupPointerWarningLog.TemplateVariables
  ): Localization.NoOutputFileExistingForSpecifiedSourceFilePathWarningLog => ({
    title: "Unknown Resources Group Alias in Resource Pointer",
    description:
        `Unknown ${ resourceFileType__pluralForm } resources group alias "${ resourcesGroupAlias }" found in ` +
          `${ resourceFileType__singularForm } resource pointer "${ resourcePointer }" at the file ` +
          `"${ parentFileAbsolutePath }". ` +
        `The ${ resourceFileType__pluralForm } resources group alias be the one of the following declared ones: \n` +
          formattedResourcesGroupsAliasesAndCorrespondingAbsolutePathsMap
  }),

  generateNoMatchesForResourceReferenceWihtoutExplicitSupportedFileNameExtensionWarningLog: (
    {
      resourceFileType__singularForm,
      resourcePointer,
      formattedListOfCheckedAbsolutePathsOfTargetFiles
    }: Localization.NoMatchesForAliasedFilePathWithoutFileNameExtensionWarningLog.TemplateVariables
  ): Localization.NoMatchesForAliasedFilePathWithoutFilenameExtensionWarningLog => ({
    title: "Unknown Resource Pointer",
    description:
        `No file found for ${ resourceFileType__singularForm } resource pointer "${ resourcePointer }" which has ` +
          "no explicit last file name extension among the supported ones. " +
        "Tried to search the file at paths with all supported files names extensions:\n" +
        formattedListOfCheckedAbsolutePathsOfTargetFiles
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
          `absolute path "${ resolvedFileAbsolutePath }", but no corresponding output file has been found for this path.`
  })

};


export default resourcesReferencesResolverForHTML_Localization__english;
