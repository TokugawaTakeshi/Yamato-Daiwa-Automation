/* --- Restrictions ------------------------------------------------------------------------------------------------- */
import ImagesProcessingRestrictions from "@ImagesProcessing/ImagesProcessingRestrictions";

/* --- Raw settings ------------------------------------------------------------------------------------------------- */
import type ImagesProcessingSettings__FromFile__RawValid from "@ImagesProcessing/ImagesProcessingSettings__FromFile__RawValid";

/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding:Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";
import type ImagesProcessingSettings__Normalized from "@ImagesProcessing/ImagesProcessingSettings__Normalized";
import AssetsProcessingRawSettingsNormalizer from
    "@ProjectBuilding/Common/RawSettingsNormalizers/AssetsProcessingRawSettingsNormalizer";

/* --- General auxiliaries ------------------------------------------------------------------------------------------ */
import { isNotUndefined } from "@yamato-daiwa/es-extensions";


export default class ImagesProcessingRawSettingsNormalizer extends AssetsProcessingRawSettingsNormalizer {

  protected readonly supportedEntryPointsSourceFilenameExtensionsWithoutLeadingDots: Array<string> =
      ImagesProcessingRestrictions.supportedSourceFileNameExtensionsWithoutLeadingDots;

  private readonly imagesProcessingSettings__fromFile__rawValid: ImagesProcessingSettings__FromFile__RawValid;


  public static normalize(
    {
      imagesProcessingSettings__fromFile__rawValid,
      commonSettings__normalized
    }: {
      imagesProcessingSettings__fromFile__rawValid: ImagesProcessingSettings__FromFile__RawValid;
      commonSettings__normalized: ProjectBuildingCommonSettings__Normalized;
    }
  ): ImagesProcessingSettings__Normalized {

    const dataHoldingSelfInstance: ImagesProcessingRawSettingsNormalizer =
        new ImagesProcessingRawSettingsNormalizer({
          imagesProcessingSettings__fromFile__rawValid,
          consumingProjectBuildingMode: commonSettings__normalized.projectBuildingMode,
          consumingProjectRootDirectoryAbsolutePath: commonSettings__normalized.projectRootDirectoryAbsolutePath,
          ...isNotUndefined(commonSettings__normalized.tasksAndSourceFilesSelection) ? {
            assetsGroupsIDsSelection: commonSettings__normalized.tasksAndSourceFilesSelection.imagesProcessing
          } : {}
        });

    return {
      common: {
        supportedSourceFilesNamesExtensionsWithoutLeadingDots: ImagesProcessingRestrictions.
            supportedSourceFileNameExtensionsWithoutLeadingDots
      },
      assetsGroups: dataHoldingSelfInstance.createNormalizedAssetsGroupsSettings(
          dataHoldingSelfInstance.imagesProcessingSettings__fromFile__rawValid.assetsGroups,
          ImagesProcessingRawSettingsNormalizer.
              completeAssetsGroupNormalizedSettingsCommonPropertiesUntilImagesGroupNormalizedSettings
      )
    };
  }


  private constructor(
    namedParameters:
        AssetsProcessingRawSettingsNormalizer.ConstructorParameters & {
          imagesProcessingSettings__fromFile__rawValid: ImagesProcessingSettings__FromFile__RawValid;
        }
  ) {
    super(namedParameters);
    this.imagesProcessingSettings__fromFile__rawValid = namedParameters.imagesProcessingSettings__fromFile__rawValid;
  }


  private static completeAssetsGroupNormalizedSettingsCommonPropertiesUntilImagesGroupNormalizedSettings(
    imagesGroupSettings__generalProperties__normalized: ProjectBuildingConfig__Normalized.AssetsGroupSettingsGenericProperties
  ): ImagesProcessingSettings__Normalized.AssetsGroup {
    return { ...imagesGroupSettings__generalProperties__normalized };
  }
}
