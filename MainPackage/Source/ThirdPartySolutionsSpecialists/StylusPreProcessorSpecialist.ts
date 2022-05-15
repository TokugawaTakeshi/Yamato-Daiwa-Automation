export default class StylusPreProcessorSpecialist {

  public static readonly supportedFileNamesExtensionsWithoutPrependedDots: Array<string> = [ "styl", "stylus" ];

  /* [ Fiddle ] https://regex101.com/r/KDM184/3 */
  public static readonly partialFilesIncludingDeclarationPatterns: Array<RegExp> = [
    /^ *@(?:import|require) +['"](?<filePath>(?:\w|-|\.|\/)+?)['"] *;? *$/gmu
  ];

  public static readonly implicitFileNamesExtensionsWithoutPrependedDotsOfPartials: Array<string> = [ "styl", "stylus", "css" ];
}
