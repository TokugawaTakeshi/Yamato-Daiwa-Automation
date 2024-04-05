/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type OutputDirectoryPathTransformationsSettings__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/Reusables/OutputDirectoryPathTransformationsSettings__Normalized";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import {
  removeSpecificSegmentsFromURI_Path,
  explodeURI_PathToSegments,
  getIndexesOfArrayElementsWhichSatisfiesThePredicate,
  removeArrayElementsByIndexes,
  isNumber
} from "@yamato-daiwa/es-extensions";


export default abstract class OutputDirectoryPathTransformationsSettingsRepresentative {

  public static transform(
    targetPath: string,
    outputDirectoryPathTransformationsSettings: OutputDirectoryPathTransformationsSettings__Normalized
  ): string {

    let outputPath: string = targetPath;

    if (outputDirectoryPathTransformationsSettings.segmentsWhichMustBeRemoved.length > 0) {
      outputPath = removeSpecificSegmentsFromURI_Path({
        targetPath: outputPath,
        targetSegments: outputDirectoryPathTransformationsSettings.segmentsWhichMustBeRemoved,
        mustOutputAlwaysWithForwardSlashesPathSeparators: true
      });
    }

    if (outputDirectoryPathTransformationsSettings.segmentsWhichLastDuplicatesMustBeRemoved.length > 0) {

      const outputDirectoryAbsolutePathExplodedToSegmentsForTargetSourceFile: Array<string> =
          explodeURI_PathToSegments(outputPath);

      for (
        const pathSegmentWhichLastDuplicateMustBeRemoved of outputDirectoryPathTransformationsSettings.
            segmentsWhichLastDuplicatesMustBeRemoved
      ) {

        const indexesOfDuplicatesOfTargetPathSegment: Array<number> = getIndexesOfArrayElementsWhichSatisfiesThePredicate(
            outputDirectoryAbsolutePathExplodedToSegmentsForTargetSourceFile,
            (outputDirectoryAbsolutePathSegment: string): boolean =>
                outputDirectoryAbsolutePathSegment === pathSegmentWhichLastDuplicateMustBeRemoved
        );

        removeArrayElementsByIndexes({
          targetArray: outputDirectoryAbsolutePathExplodedToSegmentsForTargetSourceFile,
          indexes: indexesOfDuplicatesOfTargetPathSegment[indexesOfDuplicatesOfTargetPathSegment.length - 1],
          mutably: true
        });

        outputPath = outputDirectoryAbsolutePathExplodedToSegmentsForTargetSourceFile.join("/");

      }

    }

    if (isNumber(outputDirectoryPathTransformationsSettings.segmentsCountRelativeToGroupTopDirectoryWhichMustBeRemoved)) {
      outputPath =
          explodeURI_PathToSegments(outputPath).
          slice(0, -outputDirectoryPathTransformationsSettings.segmentsCountRelativeToGroupTopDirectoryWhichMustBeRemoved).
          join("/");
    }

    return outputPath;

  }

}
