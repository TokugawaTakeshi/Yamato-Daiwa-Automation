import type { HTMLElement as HTML_Element } from "node-html-parser";


/* [ Theory ] The Pug pre-processor replaces the line break to space inside the text block that is desired
*     behaviour for many alphabetic languages but not ideographic ones.
*     https://github.com/pugjs/pug/issues/3251 */
export default class SpacesNormalizerForCJK_Text {

  /* [ Regular expression fiddle ] https://regex101.com/r/tPn28I/1 */
  private static readonly ANY_CJK_CHARACTER_INCLUDING_PUNCTUATION_ONES: string =
      "[\\u3000-\\u303f\\u3040-\\u309f\\u30a0-\\u30ff\\uff00-\\uffef\\u4e00-\\u9fff\\uac00-\\ud7af]";

  private static readonly extraSpaceSurroundedByCharactersDetectingPatterns: ReadonlyArray<RegExp> = [

    /* [ Regular Expressions Tester ] https://regex101.com/r/oTsJps/2 */
    new RegExp(
      `(${ SpacesNormalizerForCJK_Text.ANY_CJK_CHARACTER_INCLUDING_PUNCTUATION_ONES })\\x20+` +
          `(${ SpacesNormalizerForCJK_Text.ANY_CJK_CHARACTER_INCLUDING_PUNCTUATION_ONES })`,
      "gmu"
    ),

    new RegExp(
      `(${ SpacesNormalizerForCJK_Text.ANY_CJK_CHARACTER_INCLUDING_PUNCTUATION_ONES })\\r?\\n\\x20+` +
          `(${ SpacesNormalizerForCJK_Text.ANY_CJK_CHARACTER_INCLUDING_PUNCTUATION_ONES })`,
      "gmu"
    ),

    /* [ Theory ] This issue is frequently occurred because of HTML beautifying rather than Pug.
     * [ Regular Expressions Tester ] https://regex101.com/r/iaGqag/1 */
    new RegExp(
      `(${ SpacesNormalizerForCJK_Text.ANY_CJK_CHARACTER_INCLUDING_PUNCTUATION_ONES })\\r?\\n\\x20+(<)`,
      "gmu"
    ),

    /* [ Theory ] Occurs when the line ends with interpolation like "#[+Term--YDID ライブラリ]や#[+Term--YDID フレームワーク]".
     * [ Regular Expressions Tester ] https://regex101.com/r/76PkVy/2 */
    new RegExp(
      `(>)\\r?\\n\x20+(${ SpacesNormalizerForCJK_Text.ANY_CJK_CHARACTER_INCLUDING_PUNCTUATION_ONES })`,
      "gmu"
    )

  ];

  private static readonly ATTRIBUTE_NAME_OF_TARGET_HTML_ELEMENTS: string = "data-yda-normalize_spaces_in_cjk";


  public static normalize(rootHTML_Element: HTML_Element): HTML_Element {

    for (
      const DOM_Element of Array.from(
        rootHTML_Element.querySelectorAll(`[${ SpacesNormalizerForCJK_Text.ATTRIBUTE_NAME_OF_TARGET_HTML_ELEMENTS }]`)
      )
    ) {

      let HTML_CodeWorkpiece: string = DOM_Element.innerHTML;

      for (const patten of SpacesNormalizerForCJK_Text.extraSpaceSurroundedByCharactersDetectingPatterns) {
        HTML_CodeWorkpiece = HTML_CodeWorkpiece.replaceAll(patten, "$1$2");
      }

      DOM_Element.removeAttribute(SpacesNormalizerForCJK_Text.ATTRIBUTE_NAME_OF_TARGET_HTML_ELEMENTS);

      DOM_Element.innerHTML = HTML_CodeWorkpiece;

    }

    return rootHTML_Element;

  }

}
