namespace ECMA_ScriptLogicProcessingRestrictions {

  export const supportedSourceFileNameExtensionsWithoutLeadingDots: Array<string> = [ "mjs", "js", "ts" ];
  export const supportedOutputFileNameExtensionsWithoutLeadingDots: Array<string> = [ "js" ];

  export enum SupportedECMA_ScriptRuntimesTypes {
    browser = "BROWSER",
    webWorker = "WEB_WORKER",
    nodeJS = "NODEJS"
  }
}


export default ECMA_ScriptLogicProcessingRestrictions;
