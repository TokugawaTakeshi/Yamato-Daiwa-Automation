namespace MarkupProcessingRestrictions {

  export const supportedSourceFilesNamesExtensionsWithoutLeadingDots: ReadonlyArray<string> = [ "pug" ];
  export const supportedOutputFilesNamesExtensionsWithoutLeadingDots: ReadonlyArray<string> = [ "html" ];

  export enum SupportedAccessibilityStandards {
    WCAG2A = "WCAG2A",
    WCAG2AA = "WCAG2AA",
    WCAG2AAA = "WCAG2AAA"
  }

}


export default MarkupProcessingRestrictions;
