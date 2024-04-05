export default class ECMA_ScriptSpecialist {

  /* [ Fiddle ] https://regex101.com/r/4X0mYk/6 */
  public static readonly partialFilesIncludingDeclarationPatterns: ReadonlyArray<RegExp> = [
    /* eslint-disable-next-line prefer-named-capture-group --
     * No simple way to know the capturing group name outside of this file. */
    /from\s+["']((?:\w|-|\.|\/|:)+)["']/gmu
  ];

}
