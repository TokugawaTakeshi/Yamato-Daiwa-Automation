/* --- Default settings --------------------------------------------------------------------------------------------- */
import AssetsProcessingGenericSettings__Default from
    "@ProjectBuilding/Common/Defaults/AssetsProcessingGenericSettings__Default";

/* --- Raw valid settings ------------------------------------------------------------------------------------------- */
import type AssetsProcessingSettingsGenericProperties__FromFile__RawValid from
      "@ProjectBuilding:Common/RawConfig/AssetsProcessingSettingsGenericProperties__FromFile__RawValid";

/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import ProjectBuildingConfig__Normalized from "../../ProjectBuildingConfig__Normalized";
import AssetsGroupID = ProjectBuildingConfig__Normalized.AssetsGroupID;

/* --- General auxiliaries ------------------------------------------------------------------------------------------ */
import {
  isNonEmptyArray,
  isUndefined,
  undefinedToEmptyArray
} from "@yamato-daiwa/es-extensions";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";
import ImprovedGlob from "@UtilsIncubator/ImprovedGlob";


abstract class AssetsProcessingRawSettingsNormalizer {

  protected abstract supportedEntryPointsSourceFilenameExtensionsWithoutLeadingDots: Array<string>;

  protected consumingProjectRootDirectoryAbsolutePath: string;
  protected consumingProjectBuildingMode: string;

  protected readonly assetsGroupsIDsSelection: Array<string>;


  protected constructor(namedParameters: AssetsProcessingRawSettingsNormalizer.ConstructorParameters) {
    this.consumingProjectRootDirectoryAbsolutePath = namedParameters.consumingProjectRootDirectoryAbsolutePath;
    this.consumingProjectBuildingMode = namedParameters.consumingProjectBuildingMode;
    this.assetsGroupsIDsSelection = undefinedToEmptyArray(namedParameters.assetsGroupsIDsSelection);
  }


  protected createNormalizedAssetsGroupsSettings<
    AssetsGroupSettings__RawValid extends AssetsProcessingSettingsGenericProperties__FromFile__RawValid.AssetsGroup,
    AssetsGroupSettings__Normalized extends ProjectBuildingConfig__Normalized.AssetsGroupSettingsGenericProperties
  >(
    assetsGroupsSettings__rawValid: { [ID: string]: AssetsGroupSettings__RawValid; } | undefined,
    completeAssetsGroupNormalizedSettingsGeneralPropertiesUntilCertainAssetsGroupNormalizedSettings:
        (
          assetsGroupSettings__normalized: ProjectBuildingConfig__Normalized.AssetsGroupSettingsGenericProperties,
          assetsGroupSettings__rawValid: AssetsGroupSettings__RawValid
        ) => AssetsGroupSettings__Normalized
  ): Map<AssetsGroupID, AssetsGroupSettings__Normalized> {

    const assetsGroupsNormalizedSettings: Map<AssetsGroupID, AssetsGroupSettings__Normalized> =
        new Map<AssetsGroupID, AssetsGroupSettings__Normalized>();

    if (isUndefined(assetsGroupsSettings__rawValid)) {
      return assetsGroupsNormalizedSettings;
    }


    for (const [ groupID, assetsGroupSettings__rawValid ] of Object.entries(assetsGroupsSettings__rawValid)) {

      const assetsGroupSettings__buildingModeDependent__rawValid:
          AssetsProcessingSettingsGenericProperties__FromFile__RawValid.AssetsGroup.BuildingModeDependent | undefined =
          assetsGroupSettings__rawValid.buildingModeDependent[this.consumingProjectBuildingMode];

      if (isUndefined(assetsGroupSettings__buildingModeDependent__rawValid)) {
        continue;
      }

      const currentAssetsGroupSourceFilesDirectoryAbsolutePath: string =
          ImprovedPath.extractDirectoryFromFilePath(
            ImprovedPath.buildAbsolutePath(
              [
                this.consumingProjectRootDirectoryAbsolutePath,
                assetsGroupSettings__rawValid.sourceFilesTopDirectoryRelativePath
              ],
              { forwardSlashOnlySeparators: true }
            )
          );

      const aliasForPathsResolution: string =
        assetsGroupSettings__rawValid.sourceFilesTopDirectoryPathAliasForReferencingFromHTML ?? `@${groupID}`;

      const outputFilesBaseDirectoryAbsolutePathActualForCurrentProjectBuildingMode: string =
          ImprovedPath.buildAbsolutePath(
            [
              this.consumingProjectRootDirectoryAbsolutePath,
              assetsGroupSettings__buildingModeDependent__rawValid.outputBaseDirectoryRelativePath
            ],
            { forwardSlashOnlySeparators: true }
          );

      const assetsManagementGroupNormalizedSettingsGenericProperties:
          ProjectBuildingConfig__Normalized.AssetsGroupSettingsGenericProperties =
          {
            ID: groupID,
            sourceFilesTopDirectoryAbsolutePath: currentAssetsGroupSourceFilesDirectoryAbsolutePath,
            sourceFilesGlobSelector: ImprovedGlob.buildAllFilesInCurrentDirectoryAndBelowGlobSelector({
              basicDirectoryPath: currentAssetsGroupSourceFilesDirectoryAbsolutePath,
              fileNamesExtensions: this.supportedEntryPointsSourceFilenameExtensionsWithoutLeadingDots
            }),
            sourceFilesTopDirectoryPathAlias: aliasForPathsResolution,
            outputFilesTopDirectoryAbsolutePath: outputFilesBaseDirectoryAbsolutePathActualForCurrentProjectBuildingMode,
            outputPathTransformations: {
              ...isNonEmptyArray(
                assetsGroupSettings__buildingModeDependent__rawValid.outputPathTransformations?.segmentsWhichMustBeRemoved
              ) ? {
                segmentsWhichMustBeRemoved: undefinedToEmptyArray(
                   assetsGroupSettings__buildingModeDependent__rawValid.outputPathTransformations?.segmentsWhichMustBeRemoved
                 )
               } : {},
              ...isNonEmptyArray(
                assetsGroupSettings__buildingModeDependent__rawValid.
                    outputPathTransformations?.segmentsWhichLastDuplicatesMustBeRemoved
              ) ? {
                segmentsWhichLastDuplicatesMustBeRemoved: undefinedToEmptyArray(
                  assetsGroupSettings__buildingModeDependent__rawValid.
                     outputPathTransformations?.segmentsWhichLastDuplicatesMustBeRemoved
                )
             } : {}
            },
            revisioning: {

              mustExecute:
                  assetsGroupSettings__buildingModeDependent__rawValid.revisioning?.disable === true ? false :
                      AssetsProcessingGenericSettings__Default.revisioning.mustExecute(this.consumingProjectBuildingMode),
              contentHashPostfixSeparator:
                  assetsGroupSettings__buildingModeDependent__rawValid.revisioning?.contentHashPostfixSeparator ??
                  AssetsProcessingGenericSettings__Default.revisioning.contentHashPostfixSeparator
            }
          };

      assetsGroupsNormalizedSettings.set(
          groupID,
          completeAssetsGroupNormalizedSettingsGeneralPropertiesUntilCertainAssetsGroupNormalizedSettings(
            assetsManagementGroupNormalizedSettingsGenericProperties,
            assetsGroupSettings__rawValid
          )
      );
    }

    return assetsGroupsNormalizedSettings;
  }
}


namespace AssetsProcessingRawSettingsNormalizer {
  export type ConstructorParameters = {
    readonly consumingProjectRootDirectoryAbsolutePath: string;
    readonly consumingProjectBuildingMode: string;
    readonly assetsGroupsIDsSelection?: Array<string>;
  };
}


export default AssetsProcessingRawSettingsNormalizer;
