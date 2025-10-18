namespace ECMA_ScriptLogicProcessingRestrictions {

  export const supportedEntryPointsSourceFilesNamesExtensionsWithoutLeadingDots: ReadonlySet<string> = new Set([
    "js", "mjs", "ts", "mts"
  ]);

  export const supportedAdditionalFilesNamesExtensionsWithoutLeadingDotsOfChildrenFiles: ReadonlySet<string> = new Set([
    "jsx", "tsx", "vue"
  ]);

  export const supportedOutputFilesNamesExtensionsWithoutLeadingDots: ReadonlyArray<string> = [ "js" ];

  export enum SupportedECMA_ScriptRuntimesTypes {
    browser = "BROWSER",
    webWorker = "WEB_WORKER",
    nodeJS = "NODEJS",
    pug = "PUG",
    electronMainProcess = "ELECTRON_MAIN_PROCESS",
    electronRendererProcess = "ELECTRON_RENDERER_PROCESS",
    electronPreload = "ELECTRON_PRELOAD"
  }

}


export default ECMA_ScriptLogicProcessingRestrictions;
