/* --- Restrictions ------------------------------------------------------------------------------------------------- */
import FontsProcessingRestrictions from "@FontsProcessing/FontsProcessingRestrictions";

/* --- Raw settings ------------------------------------------------------------------------------------------------- */
import type FontsProcessingSettings__FromFile__RawValid from "@FontsProcessing/FontsProcessingSettings__FromFile__RawValid";

/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding:Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";
import type FontsProcessingSettings__Normalized from "@FontsProcessing/FontsProcessingSettings__Normalized";
import AssetsProcessingRawSettingsNormalizer from
    "@ProjectBuilding/Common/RawSettingsNormalizers/AssetsProcessingRawSettingsNormalizer";

/* --- General auxiliaries ------------------------------------------------------------------------------------------ */
import { isNotUndefined } from "@yamato-daiwa/es-extensions";


export default class FontsProcessingSettingsRawSettingsNormalizer extends AssetsProcessingRawSettingsNormalizer {

  protected readonly supportedEntryPointsSourceFilenameExtensionsWithoutLeadingDots: Array<string> =
      FontsProcessingRestrictions.supportedSourceFileNameExtensionsWithoutLeadingDots;

  private readonly fontsProcessingSettings__fromFile__rawValid: FontsProcessingSettings__FromFile__RawValid;


  public static normalize(
    {
      fontsProcessingSettings__fromFile__rawValid,
      commonSettings__normalized
    }: {
      fontsProcessingSettings__fromFile__rawValid: FontsProcessingSettings__FromFile__RawValid;
      commonSettings__normalized: ProjectBuildingCommonSettings__Normalized;
    }
  ): FontsProcessingSettings__Normalized {

    const dataHoldingSelfInstance: FontsProcessingSettingsRawSettingsNormalizer =
        new FontsProcessingSettingsRawSettingsNormalizer({
          fontsProcessingSettings__fromFile__rawValid,
          consumingProjectBuildingMode: commonSettings__normalized.projectBuildingMode,
          consumingProjectRootDirectoryAbsolutePath: commonSettings__normalized.projectRootDirectoryAbsolutePath,
          ...isNotUndefined(commonSettings__normalized.tasksAndSourceFilesSelection) ? {
            assetsGroupsIDsSelection: commonSettings__normalized.tasksAndSourceFilesSelection.imagesProcessing
          } : {}
        });

    return {
      common: {
        supportedSourceFilesNamesExtensionsWithoutLeadingDots: FontsProcessingRestrictions.
            supportedSourceFileNameExtensionsWithoutLeadingDots
      },
      assetsGroups: dataHoldingSelfInstance.createNormalizedAssetsGroupsSettings(
        dataHoldingSelfInstance.fontsProcessingSettings__fromFile__rawValid.assetsGroups,
        FontsProcessingSettingsRawSettingsNormalizer.
            completeAssetsGroupNormalizedSettingsCommonPropertiesUntilImagesGroupNormalizedSettings
      )
    };
  }


  private constructor(
    namedParameters:
        AssetsProcessingRawSettingsNormalizer.ConstructorParameters & {
          fontsProcessingSettings__fromFile__rawValid: FontsProcessingSettings__FromFile__RawValid;
        }
  ) {
    super(namedParameters);
    this.fontsProcessingSettings__fromFile__rawValid = namedParameters.fontsProcessingSettings__fromFile__rawValid;
  }


  private static completeAssetsGroupNormalizedSettingsCommonPropertiesUntilImagesGroupNormalizedSettings(
    imagesGroupSettings__generalProperties__normalized: ProjectBuildingConfig__Normalized.AssetsGroupSettingsGenericProperties
  ): FontsProcessingSettings__Normalized.AssetsGroup {
    return { ...imagesGroupSettings__generalProperties__normalized };
  }
}
