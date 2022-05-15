export default class PugPreProcessorSpecialist {

  public static readonly supportedFileNamesExtensionsWithoutPrependedDots: Array<string> = [ "pug" ];

  /* [ Fiddle ] https://regex101.com/r/uqO9CT/4 */
  public static readonly partialFilesIncludingDeclarationPatterns: Array<RegExp> = [
    /^ *(?:include|extends) +(?<filePath>(?:\w|-|\.|\/)+) *$/gmu
  ];

  public static readonly implicitFileNamesExtensionsWithoutPrependedDotsOfPartials: Array<string> = [ "pug" ];
}
