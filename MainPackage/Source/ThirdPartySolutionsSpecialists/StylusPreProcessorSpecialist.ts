export default class StylusPreProcessorSpecialist {

  /* [ Fiddle ] https://regex101.com/r/KDM184/3 */
  public static readonly partialFilesIncludingDeclarationPatterns: Array<RegExp> = [
    /* eslint-disable-next-line prefer-named-capture-group --
   * No simple way to know the capturing group name outside of this file. */
    /^ *@(?:import|require) +['"]((?:\w|-|\.|\/)+?)['"] *;? *$/gmu
  ];

  public static readonly implicitFilesNamesExtensionsWithoutLeadingDotsOfPartials: Array<string> =
      [ "styl", "stylus", "css" ];

}
