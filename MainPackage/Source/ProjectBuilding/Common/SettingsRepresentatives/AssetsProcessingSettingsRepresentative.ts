import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";

/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type AssetsProcessingSettingsGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/AssetsProcessingSettingsGenericProperties__Normalized";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import {
  getIndexesOfArrayElementsWhichSatisfiesThePredicate,
  getArrayElementSatisfiesThePredicateIfSuchElementIsExactlyOne,
  removeArrayElementsByIndexes,
  removeSpecificSegmentsFromURI_Path,
  explodeURI_PathToSegments,
  isNumber,
  isNonEmptyArray
} from "@yamato-daiwa/es-extensions";
import { ImprovedGlob, ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


export default abstract class AssetsProcessingSettingsRepresentative<
  SpecificAssetsProcessingCommonSettingsGenericProperties extends AssetsProcessingSettingsGenericProperties__Normalized.Common,
  SpecificAssetsGroupNormalizedSettings extends AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup
> {

  /* ━━━ Public abstract fields ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public abstract readonly relevantSourceFilesGlobSelectors: ReadonlyArray<string>;

  public abstract readonly TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM: string;
  public abstract readonly TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM: string;


  /* ━━━ Public readonly fields ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public readonly assetsProcessingCommonSettings: SpecificAssetsProcessingCommonSettingsGenericProperties;
  public readonly loggingSettings: AssetsProcessingSettingsGenericProperties__Normalized.Logging;

  public readonly relevantAssetsGroupsSettingsMappedByGroupID: ReadonlyMap<
    AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup.ID, SpecificAssetsGroupNormalizedSettings
  >;

  public readonly relevantAssetsGroupsSettingsMappedBySourceFilesTopDirectoryAliasName: ReadonlyMap<
    string, SpecificAssetsGroupNormalizedSettings
  >;

  public readonly hasAtLeastOneActualAssetsGroup: boolean;

  public readonly actualAssetsSourceFilesAbsolutePaths: ReadonlyArray<string>;
  public readonly actualOutputFilesGlobSelectors: ReadonlyArray<string>;

  public readonly supportedSourceFilesNamesExtensionsWithoutLeadingDots: ReadonlyArray<string>;


  /* ━━━ Protected fields ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  protected readonly projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;


  /* ━━━ Public static methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public static computeRelevantOutputDirectoryAbsolutePathForTargetSourceFile(
    {
      targetSourceFileAbsolutePath,
      relevantAssetsGroupNormalizedSettings
    }: Readonly<{
      targetSourceFileAbsolutePath: string;
      relevantAssetsGroupNormalizedSettings: AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup;
    }>
  ): string {

    let outputDirectoryAbsolutePathForTargetSourceFile: string = ImprovedPath.joinPathSegments(
      [
        relevantAssetsGroupNormalizedSettings.outputFilesTopDirectoryAbsolutePath,
        ImprovedPath.computeRelativePath(
          {
            basePath: relevantAssetsGroupNormalizedSettings.sourceFilesTopDirectoryAbsolutePath,
            comparedPath: ImprovedPath.extractDirectoryFromFilePath({
              targetPath: targetSourceFileAbsolutePath,
              ambiguitiesResolution: {
                mustConsiderLastSegmentWithNonLeadingDotAsDirectory: false,
                mustConsiderLastSegmentStartingWithDotAsDirectory: false,
                mustConsiderLastSegmentWihtoutDotsAsFileNameWithoutExtension: true
              },
              alwaysForwardSlashSeparators: true
            })
          }
        )
      ],
      { alwaysForwardSlashSeparators: true }
    );

    if (isNonEmptyArray(relevantAssetsGroupNormalizedSettings.outputPathTransformations.segmentsWhichMustBeRemoved)) {
      outputDirectoryAbsolutePathForTargetSourceFile = removeSpecificSegmentsFromURI_Path({
        targetPath: outputDirectoryAbsolutePathForTargetSourceFile,
        targetSegments: relevantAssetsGroupNormalizedSettings.outputPathTransformations.segmentsWhichMustBeRemoved,
        mustOutputAlwaysWithForwardSlashesPathSeparators: true
      });
    }


    if (
      isNonEmptyArray(relevantAssetsGroupNormalizedSettings.outputPathTransformations.segmentsWhichLastDuplicatesMustBeRemoved)
    ) {

      const outputDirectoryAbsolutePathExplodedToSegmentsForTargetSourceFile: Array<string> =
          explodeURI_PathToSegments(outputDirectoryAbsolutePathForTargetSourceFile);

      for (
        const pathSegmentWhichLastDuplicateMustBeRemoved of
            relevantAssetsGroupNormalizedSettings.outputPathTransformations.segmentsWhichLastDuplicatesMustBeRemoved
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

        outputDirectoryAbsolutePathForTargetSourceFile =
            outputDirectoryAbsolutePathExplodedToSegmentsForTargetSourceFile.join("/");

      }

    }

    if (
      isNumber(
        relevantAssetsGroupNormalizedSettings.outputPathTransformations.
            segmentsCountRelativeToGroupTopDirectoryWhichMustBeRemoved
      )
    ) {
      outputDirectoryAbsolutePathForTargetSourceFile =
          explodeURI_PathToSegments(outputDirectoryAbsolutePathForTargetSourceFile).
          slice(
            0,
            -relevantAssetsGroupNormalizedSettings.outputPathTransformations.
                segmentsCountRelativeToGroupTopDirectoryWhichMustBeRemoved
          ).
          join("/");
    }

    return outputDirectoryAbsolutePathForTargetSourceFile;

  }


  /* ━━━ Constructor ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  protected constructor(
    {
      projectBuildingMasterConfigRepresentative,
      assetsProcessingCommonSettings,
      loggingSettings,
      relevantAssetsGroupsSettingsMappedByGroupID
    }: Readonly<{
      projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
      assetsProcessingCommonSettings: SpecificAssetsProcessingCommonSettingsGenericProperties;
      loggingSettings: AssetsProcessingSettingsGenericProperties__Normalized.Logging;
      relevantAssetsGroupsSettingsMappedByGroupID: ReadonlyMap<
        AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup.ID, SpecificAssetsGroupNormalizedSettings
      >;
    }>
  ) {

    this.projectBuildingMasterConfigRepresentative = projectBuildingMasterConfigRepresentative;

    this.assetsProcessingCommonSettings = assetsProcessingCommonSettings;
    this.loggingSettings = loggingSettings;

    this.relevantAssetsGroupsSettingsMappedByGroupID = relevantAssetsGroupsSettingsMappedByGroupID;

    this.relevantAssetsGroupsSettingsMappedBySourceFilesTopDirectoryAliasName =
      new Map<string, SpecificAssetsGroupNormalizedSettings>(
        Array.from(this.relevantAssetsGroupsSettingsMappedByGroupID.values()).
            map(
              (
                assetsGroupNormalizedSettings: SpecificAssetsGroupNormalizedSettings
              ): [ string, SpecificAssetsGroupNormalizedSettings ] =>
                  [
                    assetsGroupNormalizedSettings.sourceFilesTopDirectoryPathAliasName,
                    assetsGroupNormalizedSettings
                  ]
            )
      );

    this.hasAtLeastOneActualAssetsGroup = this.relevantAssetsGroupsSettingsMappedByGroupID.size > 0;

    this.actualAssetsSourceFilesAbsolutePaths = Array.from(this.relevantAssetsGroupsSettingsMappedByGroupID.values()).
        flatMap(
          (assetsGroupSettings: SpecificAssetsGroupNormalizedSettings): ReadonlyArray<string> =>
              ImprovedGlob.getFilesAbsolutePathsSynchronously([ assetsGroupSettings.sourceFilesGlobSelector ])
        );

    this.actualOutputFilesGlobSelectors = Array.from(this.relevantAssetsGroupsSettingsMappedByGroupID.values()).
        map(
          (assetsGroupSettings__normalized: SpecificAssetsGroupNormalizedSettings): string =>
              ImprovedGlob.buildAllFilesInCurrentDirectoryAndBelowGlobSelector({
                basicDirectoryPath: assetsGroupSettings__normalized.outputFilesTopDirectoryAbsolutePath,
                fileNamesExtensions: this.supportedSourceFilesNamesExtensionsWithoutLeadingDots
              })
        );

    this.supportedSourceFilesNamesExtensionsWithoutLeadingDots = this.assetsProcessingCommonSettings.
        supportedSourceFilesNamesExtensionsWithoutLeadingDots;

  }


  /* ━━━ Public instance methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public getAssetsNormalizedSettingsActualForTargetSourceFile(
    targetSourceFileAbsolutePath: string
  ): SpecificAssetsGroupNormalizedSettings {
    return getArrayElementSatisfiesThePredicateIfSuchElementIsExactlyOne(
      Array.from(this.relevantAssetsGroupsSettingsMappedByGroupID.values()),
      (assetsGroupNormalizedSettings: SpecificAssetsGroupNormalizedSettings): boolean =>
          ImprovedGlob.isFilePathMatchingWithGlobSelector({
            filePath: targetSourceFileAbsolutePath,
            globSelector: assetsGroupNormalizedSettings.sourceFilesGlobSelector
          }),
      { mustThrowErrorIfElementNotFoundOrMatchesAreMultiple: true }
    );
  }

}
