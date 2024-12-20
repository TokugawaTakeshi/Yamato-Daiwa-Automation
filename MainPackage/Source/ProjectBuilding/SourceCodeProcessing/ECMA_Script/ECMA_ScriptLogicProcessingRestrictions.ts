namespace ECMA_ScriptLogicProcessingRestrictions {

  export const supportedSourceFilesNamesExtensionsWithoutLeadingDots: ReadonlyArray<string> = [ "js", "mjs", "ts", "tsx", "jsx" ];
  export const supportedOutputFilesNamesExtensionsWithoutLeadingDots: ReadonlyArray<string> = [ "js" ];

  export enum SupportedECMA_ScriptRuntimesTypes {
    browser = "BROWSER",
    webWorker = "WEB_WORKER",
    nodeJS = "NODEJS",
    pug = "PUG"
  }

}


export default ECMA_ScriptLogicProcessingRestrictions;
