import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding:Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";
import type MarkupProcessingSettings__Normalized from "@MarkupProcessing/MarkupProcessingSettings__Normalized";
import type StylesProcessingSettings__Normalized from "@StylesProcessing/StylesProcessingSettings__Normalized";
import type ECMA_ScriptLogicProcessingSettings__Normalized from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettings__Normalized";
import type ImagesProcessingSettings__Normalized from "@ImagesProcessing/ImagesProcessingSettings__Normalized";
import type FontsProcessingSettings__Normalized from "@FontsProcessing/FontsProcessingSettings__Normalized";
import type VideosProcessingSettings__Normalized from "@VideosProcessing/VideosProcessingSettings__Normalized";
import type AudiosProcessingSettings__Normalized from "@AudiosProcessing/AudiosProcessingSettings__Normalized";
import type PlainCopyingSettings__Normalized from "@ProjectBuilding/PlainCopying/PlainCopyingSettings__Normalized";
import type BrowserLiveReloadingSettings__Normalized from "@BrowserLiveReloading/BrowserLiveReloadingSettings__Normalized";


type ProjectBuildingConfig__Normalized = Readonly<{

  commonSettings: ProjectBuildingCommonSettings__Normalized;

  markupProcessing?: MarkupProcessingSettings__Normalized;
  stylesProcessing?: StylesProcessingSettings__Normalized;
  ECMA_ScriptLogicProcessing?: ECMA_ScriptLogicProcessingSettings__Normalized;

  imagesProcessing?: ImagesProcessingSettings__Normalized;
  fontsProcessing?: FontsProcessingSettings__Normalized;
  videosProcessing?: VideosProcessingSettings__Normalized;
  audiosProcessing?: AudiosProcessingSettings__Normalized;

  plainCopying?: PlainCopyingSettings__Normalized;

  browserLiveReloading?: BrowserLiveReloadingSettings__Normalized;

}>;


/* eslint-disable-next-line @typescript-eslint/no-redeclare --
 * The merging of type/interface and namespace is completely valid TypeScript,
 * but @typescript-eslint community does not wish to support it.
 * https://github.com/eslint/eslint/issues/15504 */
namespace ProjectBuildingConfig__Normalized {

  export type EntryPointsGroupID = string;

  export type SourceCodeProcessingCommonSettingsGenericProperties = Readonly<{
    supportedSourceFileNameExtensionsWithoutLeadingDots: ReadonlyArray<string>;
    supportedOutputFileNameExtensionsWithoutLeadingDots: ReadonlyArray<string>;
  }>;

  export type EntryPointsGroupGenericSettings = Readonly<{
    ID: EntryPointsGroupID;
    sourceFilesTopDirectoryAbsolutePath: string;
    sourceFilesGlobSelectors: Array<string>;
    isSingeEntryPointGroup: boolean;
    outputFilesTopDirectoryAbsolutePath: string;
  }>;


  export type AssetsGroupID = string;

  export type AssetsProcessingCommonSettingsGenericProperties = Readonly<{
    supportedSourceFilesNamesExtensionsWithoutLeadingDots: ReadonlyArray<string>;
  }>;

  export type AssetsGroupSettingsGenericProperties = Readonly<{
    ID: AssetsGroupID;
    sourceFilesTopDirectoryAbsolutePath: string;
    sourceFilesTopDirectoryPathAlias: string;
    sourceFilesGlobSelector: string;
    outputFilesTopDirectoryAbsolutePath: string;
    outputPathTransformations: Readonly<{
      segmentsWhichMustBeRemoved?: Array<string>;
      segmentsWhichLastDuplicatesMustBeRemoved?: Array<string>;
    }>;
    revisioning: Revisioning;
  }>;


  export type Revisioning = Readonly<{
    mustExecute: boolean;
    contentHashPostfixSeparator: string;
  }>;

}


export default ProjectBuildingConfig__Normalized;
