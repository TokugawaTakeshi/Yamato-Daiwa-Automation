import SourceCodeProcessingConfigRepresentative from "./SourceCodeProcessingConfigRepresentative";

/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type SourceCodeProcessingGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/SourceCodeProcessingGenericProperties__Normalized";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import {
  Logger,
  UnexpectedEventError,
  removeSpecificSegmentsFromURI_Path,
  explodeURI_PathToSegments,
  isUndefined,
  isNonEmptyArray,
  getIndexesOfSatisfiesThePredicateArrayElements,
  removeArrayElementsByIndexes,
  isNumber
} from "@yamato-daiwa/es-extensions";
import { ImprovedGlob, ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


export default abstract class GulpStreamBasedSourceCodeProcessingConfigRepresentative<
  SourceCodeProcessorsCommonNormalizedSettings extends SourceCodeProcessingGenericProperties__Normalized.Common,
  EntryPointsGroupNormalizedSettings extends SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup
> extends SourceCodeProcessingConfigRepresentative<
  SourceCodeProcessorsCommonNormalizedSettings,
  EntryPointsGroupNormalizedSettings
> {


  public abstract readonly WAITING_FOR_SUBSEQUENT_FILES_WILL_SAVED_PERIOD__SECONDS: number;


  /* ━━━ Static Helpers ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public static computeRelevantOutputDirectoryAbsolutePathForTargetSourceFile<
    EntryPointsGroupNormalizedSettings extends SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup
  >(
    targetSourceFileAbsolutePath: string,
    relevantEntryPointsGroupSettings: EntryPointsGroupNormalizedSettings
  ): string {

    let outputDirectoryAbsolutePathForTargetSourceFile: string =
        relevantEntryPointsGroupSettings.isSingeEntryPointGroup ?
            relevantEntryPointsGroupSettings.outputFilesTopDirectoryAbsolutePath :
            ImprovedPath.joinPathSegments(
              [
                relevantEntryPointsGroupSettings.outputFilesTopDirectoryAbsolutePath,
                ImprovedPath.computeRelativePath({
                  basePath: relevantEntryPointsGroupSettings.sourceFilesTopDirectoryAbsolutePath,
                  comparedPath: ImprovedPath.extractDirectoryFromFilePath({
                    targetPath: targetSourceFileAbsolutePath,
                    ambiguitiesResolution: {
                      mustConsiderLastSegmentWithNonLeadingDotAsDirectory: false,
                      mustConsiderLastSegmentStartingWithDotAsDirectory: false,
                      mustConsiderLastSegmentWihtoutDotsAsFileNameWithoutExtension: true
                    },
                    alwaysForwardSlashSeparators: true
                  })
                })
              ],
              { alwaysForwardSlashSeparators: true }
            );

    if (isNonEmptyArray(relevantEntryPointsGroupSettings.outputPathTransformations.segmentsWhichMustBeRemoved)) {
      outputDirectoryAbsolutePathForTargetSourceFile = removeSpecificSegmentsFromURI_Path({
        targetPath: outputDirectoryAbsolutePathForTargetSourceFile,
        targetSegments: relevantEntryPointsGroupSettings.outputPathTransformations.segmentsWhichMustBeRemoved,
        mustOutputAlwaysWithForwardSlashesPathSeparators: true
      });
    }

    if (isNonEmptyArray(relevantEntryPointsGroupSettings.outputPathTransformations.segmentsWhichLastDuplicatesMustBeRemoved)) {

      const outputDirectoryAbsolutePathExplodedToSegmentsForTargetSourceFile: Array<string> =
          explodeURI_PathToSegments(outputDirectoryAbsolutePathForTargetSourceFile);

      for (
        const pathSegmentWhichLastDuplicateMustBeRemoved of
            relevantEntryPointsGroupSettings.outputPathTransformations.segmentsWhichLastDuplicatesMustBeRemoved
      ) {

        const indexesOfDuplicatesOfTargetPathSegment: Array<number> = getIndexesOfSatisfiesThePredicateArrayElements(
            outputDirectoryAbsolutePathExplodedToSegmentsForTargetSourceFile,
            (outputDirectoryAbsolutePathSegment: string): boolean =>
                outputDirectoryAbsolutePathSegment === pathSegmentWhichLastDuplicateMustBeRemoved
        );

        removeArrayElementsByIndexes({
          targetArray: outputDirectoryAbsolutePathExplodedToSegmentsForTargetSourceFile,
          indexes: indexesOfDuplicatesOfTargetPathSegment[indexesOfDuplicatesOfTargetPathSegment.length - 1],
          mutably: true
        });

        outputDirectoryAbsolutePathForTargetSourceFile =
            outputDirectoryAbsolutePathExplodedToSegmentsForTargetSourceFile.join("/");

      }

    }

    if (
      isNumber(
        relevantEntryPointsGroupSettings.outputPathTransformations.segmentsCountRelativeToGroupTopDirectoryWhichMustBeRemoved
      )
    ) {
      outputDirectoryAbsolutePathForTargetSourceFile =
          explodeURI_PathToSegments(outputDirectoryAbsolutePathForTargetSourceFile).
          slice(
            0,
            -relevantEntryPointsGroupSettings.outputPathTransformations.
                segmentsCountRelativeToGroupTopDirectoryWhichMustBeRemoved
          ).
          join("/");
    }

    return outputDirectoryAbsolutePathForTargetSourceFile;

  }

  public getExpectedToExistEntryPointsGroupSettingsRelevantForSpecifiedSourceFileAbsolutePath(
    targetSourceFileAbsolutePath: string
  ): EntryPointsGroupNormalizedSettings {

    let entryPointsGroupsNormalizedSettingsRelevantForTargetSourceFile: EntryPointsGroupNormalizedSettings | undefined;

    for (const entryPointsGroupNormalizedSettings of this.relevantEntryPointsGroupsSettings.values()) {
      if (
        ImprovedGlob.isFilePathMatchingWithAllGlobSelectors({
          filePath: targetSourceFileAbsolutePath,
          globSelectors: entryPointsGroupNormalizedSettings.sourceFilesGlobSelectors
        })
      ) {
        entryPointsGroupsNormalizedSettingsRelevantForTargetSourceFile = entryPointsGroupNormalizedSettings;
        break;
      }
    }


    if (isUndefined(entryPointsGroupsNormalizedSettingsRelevantForTargetSourceFile)) {
      Logger.throwErrorAndLog({
        errorInstance: new UnexpectedEventError(
          `No output entry points group has been fond for file of the path:\n${ targetSourceFileAbsolutePath }`
        ),
        title: UnexpectedEventError.localization.defaultTitle,
        occurrenceLocation: "GulpStreamBasedSourceCodeProcessingConfigRepresentative(Inheritor)." +
            "getEntryPointsGroupSettingsRelevantForSpecifiedSourceFileAbsolutePath(targetSourceFileAbsolutePath)"
      });
    }

    return entryPointsGroupsNormalizedSettingsRelevantForTargetSourceFile;
  }


  /* ━━━ Getters ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* [ Theory ] Below getters could not be made to field because `relevantEntryPointsGroupsSettings` could not be accessed
  *    is abstract constructor. Also, `relevantEntryPointsGroupsSettings` could be made non-abstract in the parent class
  *    and passed via constructor, however it will be some problems with typing. */
  public get hasAtLeastOneRelevantEntryPointsGroup(): boolean {
    return this.relevantEntryPointsGroupsSettings.size > 0;
  }

}
