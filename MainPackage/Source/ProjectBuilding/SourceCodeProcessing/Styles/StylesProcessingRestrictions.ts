namespace StylesProcessingRestrictions {

  export const supportedEntryPointsSourceFilesNamesExtensionsWithoutLeadingDots: ReadonlySet<string> = new Set([
    "styl", "stylus"
  ]);
  export const supportedAdditionalFilesNamesExtensionsWithoutLeadingDotsOfChildrenFiles: ReadonlySet<string> = new Set([]);

  export const supportedOutputFilesNamesExtensionsWithoutLeadingDots: ReadonlyArray<string> = [ "css" ];

}


export default StylesProcessingRestrictions;
