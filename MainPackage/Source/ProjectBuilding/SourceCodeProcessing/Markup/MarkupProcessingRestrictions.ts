import addPenultimateFileNameExtension from "@Incubators/@yamato-daiwa/es-extensions/Strings/addPenultimateFileNameExtension";


namespace MarkupProcessingRestrictions {

  export const supportedEntryPointsSourceFilesNamesExtensionsWithoutLeadingDots: ReadonlySet<string> = new Set([ "pug" ]);
  export const supportedAdditionalFilesNamesExtensionsWithoutLeadingDotsOfChildrenFiles: ReadonlySet<string> = new Set([]);

  export const supportedOutputFilesNamesExtensionsWithoutLeadingDots: ReadonlyArray<string> = [ "html" ];

  export enum OutputFormats {
    HTML = "HTML",
    handlebars = "handlebars",
    razor = "razor"
  }

  export enum SupportedAccessibilityStandards {
    WCAG2A = "WCAG2A",
    WCAG2AA = "WCAG2AA",
    WCAG2AAA = "WCAG2AAA"
  }

  export function addLocaleIdentifyingPenultimateFileNameToAbsolutePathOfMarkupEntryPointSourceFile(
    {
      initialAbsolutePathOfMarkupEntryPointSourceFile,
      localeIdentifyingPenultimateFileNameExtensionWithoutLeadingDot
    }: Readonly<{
      initialAbsolutePathOfMarkupEntryPointSourceFile: string;
      localeIdentifyingPenultimateFileNameExtensionWithoutLeadingDot: string;
    }>
  ): string {
    return addPenultimateFileNameExtension({
      targetPath: initialAbsolutePathOfMarkupEntryPointSourceFile,
      targetFileNamePenultimateExtensionWithOrWithoutLeadingDot:
          localeIdentifyingPenultimateFileNameExtensionWithoutLeadingDot,
      mustAppendDuplicateEvenIfTargetPenultimateFileNameExtensionAlreadyExist: true,
      mustAppendLastFileNameExtensionInsteadIfThereIsNoOne: true
    });
  }

  export function computeOutputFileNameWithAllExtensionsForLocalizedMarkupEntryPoint(
    {
      sourceFileNameWithoutLastExtension,
      localeIdentifyingPenultimateFileNameExtensionWithoutLeadingDot,
      outputFileNameWithLastExtensionWithLeadingDot
    }: Readonly<{
      sourceFileNameWithoutLastExtension: string;
      localeIdentifyingPenultimateFileNameExtensionWithoutLeadingDot: string;
      outputFileNameWithLastExtensionWithLeadingDot: string;
    }>
  ): string {
    return [
      sourceFileNameWithoutLastExtension,
      localeIdentifyingPenultimateFileNameExtensionWithoutLeadingDot,
      outputFileNameWithLastExtensionWithLeadingDot
    ].join(".");
  }

}


export default MarkupProcessingRestrictions;
