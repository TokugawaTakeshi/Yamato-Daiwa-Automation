/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import type ConsumingProjectBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";
import PROCESSABLE_FILE_REFERENCE_ALIAS_PREFIX from
    "@ProjectBuilding/Common/Restrictions/ResourcesReferences/PROCESSABLE_FILE_REFERENCE_ALIAS_PREFIX";

/* ─── Default Settings ───────────────────────────────────────────────────────────────────────────────────────────── */
import AssetsProcessingGenericSettings__Default from
    "@ProjectBuilding/Common/Defaults/AssetsProcessingGenericSettings__Default";

/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import type AssetsProcessingSettingsGenericProperties__FromFile__RawValid from
    "@ProjectBuilding:Common/RawConfig/AssetsProcessingSettingsGenericProperties__FromFile__RawValid";

/* ─── Normalized settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import type AssetsProcessingSettingsGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/AssetsProcessingSettingsGenericProperties__Normalized";

/* ─── Settings normalizers ───────────────────────────────────────────────────────────────────────────────────────── */
import OutputPathTransformationsSettingsNormalizer from
    "@ProjectBuilding/Common/RawSettingsNormalizers/Reusables/OutputPathTransformationsSettingsNormalizer";
import RevisioningSettingsNormalizer from
    "@ProjectBuilding/Common/RawSettingsNormalizers/Reusables/RevisioningSettingsNormalizer";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { isUndefined } from "@yamato-daiwa/es-extensions";
import { ImprovedGlob, ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


abstract class AssetsProcessingRawSettingsNormalizer {

  protected readonly assetsGroupsIDsSelection: ReadonlyArray<string>;
  protected readonly supportedEntryPointsSourceFilenameExtensionsWithoutLeadingDots: ReadonlyArray<string>;
  protected readonly consumingProjectRootDirectoryAbsolutePath: string;
  protected readonly consumingProjectBuildingMode: ConsumingProjectBuildingModes;


  protected constructor(compoundParameter: AssetsProcessingRawSettingsNormalizer.CompoundParameter) {

    this.assetsGroupsIDsSelection = compoundParameter.assetsGroupsIDsSelection ?? [];

    this.supportedEntryPointsSourceFilenameExtensionsWithoutLeadingDots = compoundParameter.
        supportedSourceFilesNamesExtensionsWithoutLeadingDots;

    this.consumingProjectRootDirectoryAbsolutePath = compoundParameter.consumingProjectRootDirectoryAbsolutePath;
    this.consumingProjectBuildingMode = compoundParameter.consumingProjectBuildingMode;

  }


  protected createNormalizedAssetsGroupsSettings<
    AssetsGroupSettings__RawValid extends AssetsProcessingSettingsGenericProperties__FromFile__RawValid.AssetsGroup,
    AssetsGroupSettings__Normalized extends AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup
  >(
    assetsGroupsSettings__rawValid: { [ID: string]: AssetsGroupSettings__RawValid; } | undefined,
    completeAssetsGroupNormalizedSettingsGeneralPropertiesUntilCertainAssetsGroupNormalizedSettings:
        (
          assetsGroupSettings__normalized: AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup,
          assetsGroupSettings__rawValid: AssetsGroupSettings__RawValid
        ) => AssetsGroupSettings__Normalized
  ): ReadonlyMap<AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup.ID, AssetsGroupSettings__Normalized> {

    const assetsGroupsNormalizedSettings: Map<
      AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup.ID, AssetsGroupSettings__Normalized
    > = new Map<AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup.ID, AssetsGroupSettings__Normalized>();

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
          ImprovedPath.extractDirectoryFromFilePath({
            targetPath: ImprovedPath.joinPathSegments(
              [
                this.consumingProjectRootDirectoryAbsolutePath,
                assetsGroupSettings__rawValid.sourceFilesTopDirectoryRelativePath
              ],
              { alwaysForwardSlashSeparators: true }
            ),
            ambiguitiesResolution: {
              mustConsiderLastSegmentStartingWithDotAsDirectory: true,
              mustConsiderLastSegmentWithNonLeadingDotAsDirectory: true,
              mustConsiderLastSegmentWithoutDotsAsFileNameWithoutExtension: false
            },
            alwaysForwardSlashSeparators: true
          });

      const aliasForPathsResolution: string = PROCESSABLE_FILE_REFERENCE_ALIAS_PREFIX +
          (assetsGroupSettings__rawValid.referenceCustomAliasName ?? groupID);

      const outputFilesBaseDirectoryAbsolutePathActualForCurrentProjectBuildingMode: string =
          ImprovedPath.joinPathSegments(
            [
              this.consumingProjectRootDirectoryAbsolutePath,
              assetsGroupSettings__buildingModeDependent__rawValid.outputTopDirectoryRelativePath
            ],
            { alwaysForwardSlashSeparators: true }
          );


      const assetsManagementGroupNormalizedSettingsGenericProperties:
          AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup =

          {
            ID: groupID,
            sourceFilesTopDirectoryAbsolutePath: currentAssetsGroupSourceFilesDirectoryAbsolutePath,
            sourceFilesGlobSelector: ImprovedGlob.buildAllFilesInCurrentDirectoryAndBelowGlobSelector({
              basicDirectoryPath: currentAssetsGroupSourceFilesDirectoryAbsolutePath,
              fileNamesExtensions: this.supportedEntryPointsSourceFilenameExtensionsWithoutLeadingDots
            }),
            sourceFilesTopDirectoryPathAliasName: aliasForPathsResolution,
            outputFilesTopDirectoryAbsolutePath: outputFilesBaseDirectoryAbsolutePathActualForCurrentProjectBuildingMode,
            outputPathTransformations: OutputPathTransformationsSettingsNormalizer.
                normalize(assetsGroupSettings__buildingModeDependent__rawValid.outputPathTransformations),

            revisioning: RevisioningSettingsNormalizer.normalize({
              revisioningSettings__rawValid: assetsGroupSettings__buildingModeDependent__rawValid.revisioning,
              revisioningSettings__default: {
                mustExecute: AssetsProcessingGenericSettings__Default.revisioning.mustExecute,
                contentHashPostfixSeparator: AssetsProcessingGenericSettings__Default.revisioning.contentHashPostfixSeparator
              },
              consumingProjectBuildingMode: this.consumingProjectBuildingMode
            })

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
  export type CompoundParameter = Readonly<{
    consumingProjectRootDirectoryAbsolutePath: string;
    consumingProjectBuildingMode: ConsumingProjectBuildingModes;
    assetsGroupsIDsSelection?: ReadonlyArray<string>;
    supportedSourceFilesNamesExtensionsWithoutLeadingDots: ReadonlyArray<string>;
  }>;
}


export default AssetsProcessingRawSettingsNormalizer;
