/* ━━━ < Imports ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* ┅┅┅ Restrictions ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import type ConsumingProjectBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";

/* ┅┅┅ Normalized Settings ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import type SourceCodeProcessingGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/SourceCodeProcessingGenericProperties__Normalized";
import type AssetsProcessingSettingsGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/AssetsProcessingSettingsGenericProperties__Normalized";
import type PlainCopyingSettings__Normalized from "@ProjectBuilding/PlainCopying/PlainCopyingSettings__Normalized";
/* ━━━ Imports > ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */


type ProjectBuildingCommonSettings__Normalized = Readonly<{
  projectRootDirectoryAbsolutePath: string;
  projectBuildingMode: ConsumingProjectBuildingModes;
  mustProvideIncrementalBuilding: boolean;
  selectiveExecutionID?: string;
  tasksAndSourceFilesSelection?: ProjectBuildingCommonSettings__Normalized.TasksAndSourceFilesSelection;
  filesWatching: ProjectBuildingCommonSettings__Normalized.FilesWatching;
  browserLiveReloadingSetupID?: string;
  mustGenerateOutputPackageJSON: boolean;
  dockerSetupID?: string;
  actualPublicDirectoryAbsolutePath?: string;
  processingOnDemand: ProjectBuildingCommonSettings__Normalized.ProcessingOnDemand;
  CSS_ClassesMinificationOnFly: ProjectBuildingCommonSettings__Normalized.CSS_ClassesMinificationOnFly;
}>;


namespace ProjectBuildingCommonSettings__Normalized {

  export type TasksAndSourceFilesSelection = Readonly<{
    markupProcessing?: ReadonlyArray<SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup.ID>;
    stylesProcessing?: ReadonlyArray<SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup.ID>;
    ECMA_ScriptLogicProcessing?: ReadonlyArray<SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup.ID>;
    imagesProcessing?: ReadonlyArray<AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup.ID>;
    fontsProcessing?: ReadonlyArray<AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup.ID>;
    audiosProcessing?: ReadonlyArray<AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup.ID>;
    videosProcessing?: ReadonlyArray<AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup.ID>;
    plainCopying?: ReadonlyArray<PlainCopyingSettings__Normalized.FilesGroup.ID>;
  }>;

  export type FilesWatching = Readonly<{
    excludedFilesGlobSelectors: ReadonlySet<string>;
    excludedDirectoriesGlobSelectors: ReadonlySet<string>;
  }>;

  export type ProcessingOnDemand = Readonly<{
    enabled: boolean;
    fullInitialBuilding: boolean;
  }>;

  export type CSS_ClassesMinificationOnFly = Readonly<{
    enabled: boolean;
    CSS_ClassesRegularExpressions: ReadonlySet<RegExp>;
    forbiddenMinifiedCSS_ClassesNames: ReadonlySet<string>;
    ignoredCSS_Classes: ReadonlySet<string>;
    generatingInMarkupOfShortCSS_ClassesNotMentionedInStylesheets:
        CSS_ClassesMinificationOnFly.GeneratingInMarkupOfShortCSS_ClassesNotMentionedInStylesheets;
  }>;

  export namespace CSS_ClassesMinificationOnFly {

    export type GeneratingInMarkupOfShortCSS_ClassesNotMentionedInStylesheets = Readonly<{
      enabled: boolean;
      ignoredInitialCSS_Classes: ReadonlySet<string>;
    }>;

  }

}


export default ProjectBuildingCommonSettings__Normalized;
