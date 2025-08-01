import type OutputDirectoryPathTransformationsSettings__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/Reusables/OutputDirectoryPathTransformationsSettings__Normalized";


namespace SourceCodeProcessingGenericProperties__Normalized {

  export type Common = Readonly<{
    supportedEntryPointsSourceFilesNamesExtensionsWithoutLeadingDots: ReadonlySet<string>;
    supportedAdditionalFilesNamesExtensionsWithoutLeadingDotsOfChildrenFiles: ReadonlySet<string>;
    supportedOutputFileNameExtensionsWithoutLeadingDots: ReadonlyArray<string>;
  }>;

  export type EntryPointsGroup = Readonly<{
    ID: EntryPointsGroup.ID;
    sourceFilesTopDirectoryAbsolutePath: string;
    sourceFilesTopDirectoryPathOrSingleFileAliasName: string;
    sourceFilesGlobSelectors: Array<string>;
    isSingeEntryPointGroup: boolean;
    outputFilesTopDirectoryAbsolutePath: string;
    outputPathTransformations: OutputDirectoryPathTransformationsSettings__Normalized;
  }>;

  export namespace EntryPointsGroup {

    export type ID = string;

  }

}


export default SourceCodeProcessingGenericProperties__Normalized;
