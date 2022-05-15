import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding:Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";
import type ProjectBuildingDebuggingSettings__Normalized from
    "./Debugging/ProjectBuildingDebuggingSettings__Normalized";

import type MarkupProcessingSettings__Normalized from "@MarkupProcessing/MarkupProcessingSettings__Normalized";
import type StylesProcessingSettings__Normalized from "@StylesProcessing/StylesProcessingSettings__Normalized";
import type ECMA_ScriptLogicProcessingSettings__Normalized from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettings__Normalized";
import type ImagesProcessingSettings__Normalized from "@ImagesProcessing/ImagesProcessingSettings__Normalized";
import type FontsProcessingSettings__Normalized from "@FontsProcessing/FontsProcessingSettings__Normalized";
import type VideosProcessingSettings__Normalized from "@VideosProcessing/VideosProcessingSettings__Normalized";
import type AudiosProcessingSettings__Normalized from "@AudiosProcessing/AudiosProcessingSettings__Normalized";
import type BrowserLiveReloadingSettings__Normalized from "@BrowserLiveReloading/BrowserLiveReloadingSettings__Normalized";


type ProjectBuildingConfig__Normalized = {

  readonly commonSettings: ProjectBuildingCommonSettings__Normalized;
  readonly debugging: ProjectBuildingDebuggingSettings__Normalized;

  readonly markupProcessing?: MarkupProcessingSettings__Normalized;
  readonly stylesProcessing?: StylesProcessingSettings__Normalized;
  readonly ECMA_ScriptLogicProcessing?: ECMA_ScriptLogicProcessingSettings__Normalized;

  readonly imagesProcessing?: ImagesProcessingSettings__Normalized;
  readonly fontsProcessing?: FontsProcessingSettings__Normalized;
  readonly videosProcessing?: VideosProcessingSettings__Normalized;
  readonly audiosProcessing?: AudiosProcessingSettings__Normalized;

  readonly browserLiveReloading?: BrowserLiveReloadingSettings__Normalized;
};


/* eslint-disable-next-line @typescript-eslint/no-redeclare --
 * The merging of type/interface and namespace is completely valid TypeScript,
 * but @typescript-eslint community does not wish to support it.
 * https://github.com/eslint/eslint/issues/15504 */
namespace ProjectBuildingConfig__Normalized {

  export type EntryPointsGroupID = string;

  export type SourceCodeProcessingCommonSettingsGenericProperties = {
    readonly supportedSourceFileNameExtensionsWithoutLeadingDots: Array<string>;
    readonly supportedOutputFileNameExtensionsWithoutLeadingDots: Array<string>;
  };

  export type EntryPointsGroupGenericSettings = {
    readonly ID: EntryPointsGroupID;
    readonly sourceFilesTopDirectoryAbsolutePath: string;
    readonly sourceFilesGlobSelectors: Array<string>;
    readonly isSingeEntryPointGroup: boolean;
    readonly outputFilesTopDirectoryAbsolutePath: string;
  };


  export type AssetsGroupID = string;

  export type AssetsProcessingCommonSettingsGenericProperties = {
    readonly supportedSourceFilesNamesExtensionsWithoutLeadingDots: Array<string>;
  };

  export type AssetsGroupSettingsGenericProperties = {
    readonly ID: AssetsGroupID;
    readonly sourceFilesTopDirectoryAbsolutePath: string;
    readonly sourceFilesTopDirectoryPathAlias: string;
    readonly sourceFilesGlobSelector: string;
    readonly outputFilesTopDirectoryAbsolutePath: string;
    readonly outputPathTransformations: {
      readonly segmentsWhichMustBeRemoved?: Array<string>;
      readonly segmentsWhichLastDuplicatesMustBeRemoved?: Array<string>;
    };
    readonly revisioning: Revisioning;
  };


  export type Revisioning = {
    readonly mustExecute: boolean;
    readonly contentHashPostfixSeparator: string;
  };
}


export default ProjectBuildingConfig__Normalized;
