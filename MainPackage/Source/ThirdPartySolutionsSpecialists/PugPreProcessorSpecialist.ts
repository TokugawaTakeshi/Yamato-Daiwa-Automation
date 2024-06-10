import type { LineSeparators } from "@yamato-daiwa/es-extensions";
import {
  getMatchingWithFirstRegularExpressionCapturingGroup,
  isNotNull,
  explodeStringToLines
} from "@yamato-daiwa/es-extensions";


class PugPreProcessorSpecialist {

  /* [ Fiddle ] https://regex101.com/r/uqO9CT/4 */
  public static readonly partialFilesIncludingDeclarationPatterns: ReadonlyArray<RegExp> = [
    /* eslint-disable-next-line prefer-named-capture-group --
     * No simple way to know the capturing group name outside of this file. */
    /^ *(?:include|extends) +((?:\w|-|\.|\/)+) *$/gmu
  ];

  public static readonly implicitFilesNamesExtensionsWithoutLeadingDotsOfPartials: ReadonlyArray<string> = [ "pug" ];

  public static readonly linterConfigurationFilesNamesWithExtensions: ReadonlyArray<string> = [
    ".pug-lintrc", ".pug-lintrc.js", ".pug-lintrc.json", "package.json"
  ];


  /* ━━━ Indentation ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public static defineIndentString(sourceCode: string): string {

    for (const sourceCodeLine of explodeStringToLines({ targetString: sourceCode, mustIgnoreCarriageReturn: true })) {

      /* [ Fiddle ] https://regex101.com/r/yV0TNG/1 */
      const indentString: string | null = getMatchingWithFirstRegularExpressionCapturingGroup({
        targetString: sourceCodeLine,
        regularExpression: /^(?<indent> +|\t)\S/gmu
      });

      if (isNotNull(indentString)) {
        return indentString;
      }

    }


    return "  ";

  }


  /* ━━━ Extending declaration ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* [ Theory ] Basically, "extends" declaration must be the first line of the Pug file but the unbuffered comment (`-//`)
  *     is the only exception.  */
  public static isSourceCodeIncludingExtendingDeclaration(sourceCode: string): boolean {
    return (/^extends/gmu).test(sourceCode);
  }

  public static isSourceCodeLineIncludingExtendingDeclaration(sourceCodeLine: string): boolean {
    return sourceCodeLine.startsWith("extends");
  }


  /* ━━━ Blocks ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public static isSourceCodeLineIncludingSpecificBlockModifyingDeclaration(
    {
      sourceCodeLine,
      blockName
    }: Readonly<{
      sourceCodeLine: string;
      blockName: string;
    }>
  ): boolean {

    /* [ Fiddle ] https://regex101.com/r/teMkqe/1 */
    return new RegExp(`^(?: +|\\t)?block (?:append|prepend)? ${ blockName }`, "u").test(sourceCodeLine);

  }

  public static extractBlock(
    {
      startLineIndex,
      sourceCodeLines
    }: Readonly<{
      startLineIndex: number;
      sourceCodeLines: ReadonlyArray<string>;
    }>
  ): PugPreProcessorSpecialist.BlockExtractingResult {

    let endLineIndex: number | undefined;
    let currentlyIteratedLineIndex: number = startLineIndex + 1;

    for (const sourceCodeLine of sourceCodeLines.slice(currentlyIteratedLineIndex)) {

      if ((/^(?: +|\t)?block/u).test(sourceCodeLine)) {
        endLineIndex = currentlyIteratedLineIndex;
        break;
      }


      currentlyIteratedLineIndex++;

    }


    endLineIndex = endLineIndex ?? sourceCodeLines.length - 1;

    return {
      startLineIndex,
      endLineIndex,
      codeLines: sourceCodeLines.slice(startLineIndex, endLineIndex)
    };

  }

  public static appendCodeToBlock(
    {
      sourceCodeLinesOfTargetBlock,
      newCode,
      lineSeparator
    }: Readonly<{
      sourceCodeLinesOfTargetBlock: ReadonlyArray<string>;
      newCode: string;
      lineSeparator: LineSeparators;
    }>
  ): string {
    return `${ sourceCodeLinesOfTargetBlock.join(lineSeparator) }${ lineSeparator }${ newCode }`;
  }

}


namespace PugPreProcessorSpecialist {

  export type BlockExtractingResult = Readonly<{
    codeLines: ReadonlyArray<string>;
    startLineIndex: number;
    endLineIndex: number;
  }>;

}


export default PugPreProcessorSpecialist;
