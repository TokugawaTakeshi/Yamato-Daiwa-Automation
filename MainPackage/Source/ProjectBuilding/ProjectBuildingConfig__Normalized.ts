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
import type FilesWatchingSettings__Normalized from "@ProjectBuilding/FilesWatching/FilesWatchingSettings__Normalized";
import type BrowserLiveReloadingSettings__Normalized from "@BrowserLiveReloading/BrowserLiveReloadingSettings__Normalized";
import type OutputPackageJSON_GeneratingSettings__Normalized from
    "@ProjectBuilding/OutputPackageJSON_Generating/OutputPackageJSON_GeneratingSettings__Normalized";


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

  filesWatching: FilesWatchingSettings__Normalized;
  browserLiveReloading?: BrowserLiveReloadingSettings__Normalized;

  outputPackageJSON_Generating?: OutputPackageJSON_GeneratingSettings__Normalized;

}>;


export default ProjectBuildingConfig__Normalized;
