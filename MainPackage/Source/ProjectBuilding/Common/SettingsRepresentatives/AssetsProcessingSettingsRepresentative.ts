/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";
import AssetsProcessingCommonSettingsGenericProperties = ProjectBuildingConfig__Normalized.
    AssetsProcessingCommonSettingsGenericProperties;
import AssetsGroupSettingsGenericProperties = ProjectBuildingConfig__Normalized.
    AssetsGroupSettingsGenericProperties;

/* --- Settings representatives ------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";

/* --- Utils -------------------------------------------------------------------------------------------------------- */
import {
  Logger,
  UnexpectedEventError,
  getIndexesOfArrayElementsWhichSatisfiesThePredicate,
  stringifyAndFormatArbitraryValue,
  removeArrayElementsByIndexes,
  isUndefined,
  isNonEmptyArray
} from "@yamato-daiwa/es-extensions";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";
import ImprovedGlob from "@UtilsIncubator/ImprovedGlob";


export default abstract class AssetsProcessingSettingsRepresentative<
  SpecificAssetsProcessingCommonSettingsGenericProperties extends AssetsProcessingCommonSettingsGenericProperties,
  SpecificAssetsGroupNormalizedSettings extends AssetsGroupSettingsGenericProperties
> {

  public abstract readonly TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM: string;

  protected abstract assetsProcessingCommonSettings: SpecificAssetsProcessingCommonSettingsGenericProperties;
  protected abstract actualAssetsGroupsSettings: Map<
    ProjectBuildingConfig__Normalized.AssetsGroupID, SpecificAssetsGroupNormalizedSettings
  >;

  public readonly sourceFilesAbsolutePathsAndOutputFilesActualPathsMap: Map<string, string> = new Map<string, string>();
  public readonly filePathAliasPrefix: string = "@";

  protected masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;


  public constructor(masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative) {
    this.masterConfigRepresentative = masterConfigRepresentative;
  }


  public get supportedSourceFilesNamesExtensionsWithoutLeadingDots(): Array<string> {
    return this.assetsProcessingCommonSettings.supportedSourceFilesNamesExtensionsWithoutLeadingDots;
  }

  public get hasAtLeastOneActualAssetsGroup(): boolean {
    return this.actualAssetsGroupsSettings.size > 0;
  }

  public get actualAssetsSourceFilesAbsolutePaths(): Array<string> {

    const assetsSourceFilesAbsolutePaths: Array<string> = [];

    this.actualAssetsGroupsSettings.forEach(
      (assetsGroupSettings: SpecificAssetsGroupNormalizedSettings): void => {
        assetsSourceFilesAbsolutePaths.push(
          ...ImprovedGlob.getFilesAbsolutePathsSynchronously([
            assetsGroupSettings.sourceFilesGlobSelector
          ])
        );
      }
    );

    return assetsSourceFilesAbsolutePaths;
  }

  public computeActualOutputDirectoryAbsolutePathForTargetSourceFile(
    {
      targetSourceFileAbsolutePath,
      respectiveAssetsGroupNormalizedSettings
    }: {
      targetSourceFileAbsolutePath: string;
      respectiveAssetsGroupNormalizedSettings: AssetsGroupSettingsGenericProperties;
    }
  ): string {

    let outputDirectoryAbsolutePathForCurrentSourceFile: string = ImprovedPath.buildAbsolutePath(
      [
        respectiveAssetsGroupNormalizedSettings.outputFilesTopDirectoryAbsolutePath,
        ImprovedPath.computeRelativePath(
          {
            basePath: respectiveAssetsGroupNormalizedSettings.sourceFilesTopDirectoryAbsolutePath,
            comparedPath: ImprovedPath.extractDirectoryFromFilePath(targetSourceFileAbsolutePath)
          }
        )
      ],
      { forwardSlashOnlySeparators: true }
    );

    if (isNonEmptyArray(respectiveAssetsGroupNormalizedSettings.outputPathTransformations.segmentsWhichMustBeRemoved)) {
      outputDirectoryAbsolutePathForCurrentSourceFile = ImprovedPath.removeSegmentsFromPath(
        outputDirectoryAbsolutePathForCurrentSourceFile,
        respectiveAssetsGroupNormalizedSettings.outputPathTransformations.segmentsWhichMustBeRemoved
      );
    }


    if (isNonEmptyArray(
      respectiveAssetsGroupNormalizedSettings.outputPathTransformations.segmentsWhichLastDuplicatesMustBeRemoved
    )) {

      const outputDirectoryAbsolutePathForCurrentSourceFile__explodedToSegments: Array<string> =
          ImprovedPath.splitPathToSegments(outputDirectoryAbsolutePathForCurrentSourceFile);

      respectiveAssetsGroupNormalizedSettings.
          outputPathTransformations.
          segmentsWhichLastDuplicatesMustBeRemoved.
          forEach((segmentWhichLastDuplicatesMustBeRemoved: string): void => {
            const indexesOfDuplicates: Array<number> = getIndexesOfArrayElementsWhichSatisfiesThePredicate(
                outputDirectoryAbsolutePathForCurrentSourceFile__explodedToSegments,
                (outputDirectoryAbsolutePathSegment: string): boolean =>
                    outputDirectoryAbsolutePathSegment === segmentWhichLastDuplicatesMustBeRemoved
            );
            removeArrayElementsByIndexes({
              targetArray: outputDirectoryAbsolutePathForCurrentSourceFile__explodedToSegments,
              indexes: indexesOfDuplicates[indexesOfDuplicates.length - 1],
              mutably: true
            });
          });

      outputDirectoryAbsolutePathForCurrentSourceFile = ImprovedPath.joinPathSegments(
        ...outputDirectoryAbsolutePathForCurrentSourceFile__explodedToSegments
      );
    }

    return outputDirectoryAbsolutePathForCurrentSourceFile;
  }

  public getAssetsNormalizedSettingsActualForTargetSourceFile(
    targetSourceFileAbsolutePath: string
  ): SpecificAssetsGroupNormalizedSettings {

    const assetsNormalizedSettingsActualForTargetSourceFile: SpecificAssetsGroupNormalizedSettings | undefined =
        Array.from(this.actualAssetsGroupsSettings.values()).
          find(
              (assetsGroupNormalizedSettings: SpecificAssetsGroupNormalizedSettings): boolean =>
                  ImprovedGlob.isFileMatchingWithGlobSelector({
                    filePath: targetSourceFileAbsolutePath,
                    globSelector: assetsGroupNormalizedSettings.sourceFilesGlobSelector
                  })
          );

    if (isUndefined(assetsNormalizedSettingsActualForTargetSourceFile)) {
      Logger.throwErrorAndLog({
        errorInstance: new UnexpectedEventError(
            `ファイル：「${ targetSourceFileAbsolutePath }」に適切な設定が発見されず。設定通りファイルファイルを回収には下記のGlob正規表示が建てられたが、` +
            "逆に、当ファイルに何方のGlob正規表現とも合っていない。\n" +
            `${ stringifyAndFormatArbitraryValue(Array.from(this.actualAssetsGroupsSettings.values()).map(
                (assetsGroupNormalizedSettings: SpecificAssetsGroupNormalizedSettings): string =>
                    assetsGroupNormalizedSettings.sourceFilesGlobSelector
            )) }`
        ),
        occurrenceLocation: "AssetsProcessingSettingsRepresentative." +
            "getAssetsNormalizedSettingsActualForTargetSourceFile(targetSourceFileAbsolutePath: string)",
        title: UnexpectedEventError.localization.defaultTitle
      });
    }


    return assetsNormalizedSettingsActualForTargetSourceFile;
  }

  public get actualOutputFilesGlobSelectors(): Array<string> {
    return Array.from(this.actualAssetsGroupsSettings.values()).map(
        (assetsGroupSettings__normalized: SpecificAssetsGroupNormalizedSettings): string =>
            ImprovedGlob.buildAllFilesInCurrentDirectoryAndBelowGlobSelector({
              basicDirectoryPath: assetsGroupSettings__normalized.outputFilesTopDirectoryAbsolutePath,
              fileNamesExtensions: this.supportedSourceFilesNamesExtensionsWithoutLeadingDots
            })
    );
  }

  public get assetsGroupsNormalizedSettingsMappedByAssetAliases(): Map<string, SpecificAssetsGroupNormalizedSettings> {

    const assetsGroupsNormalizedSettingsMappedByAssetAliases: Map<string, SpecificAssetsGroupNormalizedSettings> =
        new Map<string, SpecificAssetsGroupNormalizedSettings>();

    this.actualAssetsGroupsSettings.
        forEach((assetsGroupNormalizedSettings: SpecificAssetsGroupNormalizedSettings): void => {
          assetsGroupsNormalizedSettingsMappedByAssetAliases.set(
              assetsGroupNormalizedSettings.sourceFilesTopDirectoryPathAlias,
              assetsGroupNormalizedSettings
          );
        });

    return assetsGroupsNormalizedSettingsMappedByAssetAliases;
  }
}
