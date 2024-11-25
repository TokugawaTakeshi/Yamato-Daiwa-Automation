import ResourcesPointersResolver from "@ProjectBuilding/Common/Plugins/ResourcesPointersResolver";
import Localization = ResourcesPointersResolver.Localization;


const resourcesReferencesResolverForHTML_Localization__english: Localization = {

  generateUnknownResourcesGroupWarningLog: (
    {
      fileType__pluralForm,
      pickedPathOfTargetResourceFile,
      firstPathSegment,
      formattedSourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap
    }: Localization.UnknownResourcesGroupPointerWarningLog.TemplateVariables
  ): Localization.NoOutputFileExistingForSpecifiedSourceFilePathWarningLog => ({
    title: "Unknown Resources Group Alias in Resource Pointer",
    description:
        `Unknown resources group alias found at "${ pickedPathOfTargetResourceFile }" resource pointer in the file ` +
          `"".` +
        `Make sure that it refers on one of existing ${ fileType__pluralForm } resources group\n:` +
            formattedSourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap
  }),

  generateNoMatchesForAliasedFilePathWithoutFilenameExtensionWarningLog: (
    {

    }: Localization.NoMatchesForAliasedFilePathWithoutFilenameExtensionWarningLog.TemplateVariables
  ): Localization.NoMatchesForAliasedFilePathWithoutFilenameExtensionWarningLog => ({
    title: "",
    description: ""
  }),

  generateNoOutputFileExistingForSpecifiedSourceFilePathWarningLog: (
    {

    }: Localization.NoOutputFileExistingForSpecifiedSourceFilePathWarningLog.TemplateVariables
  ): Localization.NoOutputFileExistingForSpecifiedSourceFilePathWarningLog => ({
    title: "",
    description: ""
  })

};


export default resourcesReferencesResolverForHTML_Localization__english;
