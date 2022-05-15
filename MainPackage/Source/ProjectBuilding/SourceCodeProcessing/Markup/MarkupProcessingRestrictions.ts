namespace MarkupProcessingRestrictions {

  export const supportedSourceFileNameExtensionsWithoutDots: Array<string> = [ "pug" ];
  export const supportedOutputFileNameExtensionsWithoutDots: Array<string> = [ "html" ];

  export enum SupportedAccessibilityStandards {
    WCAG2A = "WCAG2A",
    WCAG2AA = "WCAG2AA",
    WCAG2AAA = "WCAG2AAA"
  }
}


export default MarkupProcessingRestrictions;
