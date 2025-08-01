import {
  extractMatchingsWithRegularExpression,
  type ExtractingOfMatchingsWithRegularExpression,
  splitString,
  addElementsToArray,
  removeSpecificCharacterFromCertainPosition
} from "@yamato-daiwa/es-extensions";


export default function addPenultimateFileNameExtension(
  {
    targetPath,
    targetFileNamePenultimateExtensionWithOrWithoutLeadingDot,
    mustAppendDuplicateEvenIfTargetPenultimateFileNameExtensionAlreadyExist
  }: Readonly<{
    targetPath: string;
    targetFileNamePenultimateExtensionWithOrWithoutLeadingDot: string;
    mustAppendDuplicateEvenIfTargetPenultimateFileNameExtensionAlreadyExist: boolean;
    mustAppendLastFileNameExtensionInsteadIfThereIsNoOne: boolean;
  }>
): string {

  const targetFileNamePenultimateExtensionWithoutLeadingDot: string = removeSpecificCharacterFromCertainPosition({
    targetString: targetFileNamePenultimateExtensionWithOrWithoutLeadingDot,
    targetCharacter: ".",
    fromFirstPosition: true
  });

  if (!targetPath.includes(".")) {

      const {
        updatedString: targetPathWihtoutFragment,
        extractedMatching: targetPathFragmentWithLeadingHash
      }: ExtractingOfMatchingsWithRegularExpression.NullableResult = extractMatchingsWithRegularExpression(
        targetPath, /#.+$/u, { mustExpectOneOrZeroMatchings: true }
      );

    return mustAppendDuplicateEvenIfTargetPenultimateFileNameExtensionAlreadyExist ?
        `${ targetPathWihtoutFragment }.${ targetFileNamePenultimateExtensionWithoutLeadingDot }` +
            targetPathFragmentWithLeadingHash :
        targetPath;

  }


  const pathDotSeparatedSegments: Array<string> = splitString(targetPath, ".");

  return addElementsToArray({
    targetArray: pathDotSeparatedSegments,
    newElements: [ targetFileNamePenultimateExtensionWithoutLeadingDot ],
    mutably: true,
    toPosition__numerationFrom1: pathDotSeparatedSegments.length
  }).join(".");

}
