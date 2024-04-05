import type OutputDirectoryPathTransformationsSettings__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/Reusables/OutputDirectoryPathTransformationsSettings__Normalized";
import type RevisioningSettings__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/Reusables/RevisioningSettings__Normalized";


namespace AssetsProcessingSettingsGenericProperties__Normalized {

  export type Common = Readonly<{
    supportedSourceFilesNamesExtensionsWithoutLeadingDots: ReadonlyArray<string>;
    periodBetweenFileUpdatingAndRebuildingStarting__seconds: number;
  }>;


  export type AssetsGroup = Readonly<{
    ID: AssetsGroup.ID;
    sourceFilesTopDirectoryAbsolutePath: string;
    sourceFilesTopDirectoryPathAliasName: string;
    sourceFilesGlobSelector: string;
    outputFilesTopDirectoryAbsolutePath: string;
    outputPathTransformations: OutputDirectoryPathTransformationsSettings__Normalized;
    revisioning: RevisioningSettings__Normalized;
  }>;

  export namespace AssetsGroup {
    export type ID = string;
  }


  export type Logging = Readonly<{
    filesPaths: boolean;
    filesCount: boolean;
    filesWatcherEvents: boolean;
  }>;


}


export default AssetsProcessingSettingsGenericProperties__Normalized;
