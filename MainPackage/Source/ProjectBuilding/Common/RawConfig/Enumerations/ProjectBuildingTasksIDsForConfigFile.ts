import type { InheritEnumerationKeys } from "@yamato-daiwa/es-extensions";


export enum ProjectBuildingTasksIDsForConfigFile {
  markupProcessing = "markupProcessing",
  stylesProcessing = "stylesProcessing",
  ECMA_ScriptLogicProcessing = "ECMA_ScriptLogicProcessing",
  imagesProcessing = "imagesProcessing",
  fontsProcessing = "fontsProcessing",
  audiosProcessing = "audiosProcessing",
  videosProcessing = "videosProcessing",
  browserLiveReloading = "browserLiveReloading",
  plainCopying = "plainCopying",
  filesWatching = "filesWatching",
  outputPackageJSON_Generating = "outputPackageJSON_Generating"
}


export type ProjectBuildingTasksIDsForConfigFile__Localized =
    InheritEnumerationKeys<typeof ProjectBuildingTasksIDsForConfigFile, string>;
