/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import ImagesProcessingRestrictions from "@ImagesProcessing/ImagesProcessingRestrictions";

/* ─── Default Settings ───────────────────────────────────────────────────────────────────────────────────────────── */
import ImagesProcessingSettings__Default from "@ImagesProcessing/ImagesProcessingSettings__Default";

/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import type ImagesProcessingSettings__FromFile__RawValid from "@ImagesProcessing/ImagesProcessingSettings__FromFile__RawValid";

/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding:Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";
import type ImagesProcessingSettings__Normalized from "@ImagesProcessing/ImagesProcessingSettings__Normalized";
import type AssetsProcessingSettingsGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/AssetsProcessingSettingsGenericProperties__Normalized";

/* ─── Superclass ─────────────────────────────────────────────────────────────────────────────────────────────────── */
import AssetsProcessingRawSettingsNormalizer from
      "@ProjectBuilding/Common/RawSettingsNormalizers/AssetsProcessingRawSettingsNormalizer";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { isNotUndefined } from "@yamato-daiwa/es-extensions";


export default class ImagesProcessingRawSettingsNormalizer extends AssetsProcessingRawSettingsNormalizer {

  private readonly imagesProcessingSettings__fromFile__rawValid: ImagesProcessingSettings__FromFile__RawValid;


  public static normalize(
    {
      imagesProcessingSettings__fromFile__rawValid,
      commonSettings__normalized
    }: Readonly<{
      imagesProcessingSettings__fromFile__rawValid: ImagesProcessingSettings__FromFile__RawValid;
      commonSettings__normalized: ProjectBuildingCommonSettings__Normalized;
    }>
  ): ImagesProcessingSettings__Normalized {

    const dataHoldingSelfInstance: ImagesProcessingRawSettingsNormalizer =
        new ImagesProcessingRawSettingsNormalizer({

          ...isNotUndefined(commonSettings__normalized.tasksAndSourceFilesSelection) ? {
            assetsGroupsIDsSelection: commonSettings__normalized.tasksAndSourceFilesSelection.imagesProcessing
          } : null,

          supportedSourceFilesNamesExtensionsWithoutLeadingDots: ImagesProcessingRestrictions.
              supportedSourceFilesNamesExtensionsWithoutLeadingDots,

          imagesProcessingSettings__fromFile__rawValid,

          consumingProjectBuildingMode: commonSettings__normalized.projectBuildingMode,
          consumingProjectRootDirectoryAbsolutePath: commonSettings__normalized.projectRootDirectoryAbsolutePath

        });

    return {

      common: {
        supportedSourceFilesNamesExtensionsWithoutLeadingDots: ImagesProcessingRestrictions.
            supportedSourceFilesNamesExtensionsWithoutLeadingDots,
        periodBetweenFileUpdatingAndRebuildingStarting__seconds:
            imagesProcessingSettings__fromFile__rawValid.common?.periodBetweenFileUpdatingAndRebuildingStarting__seconds ??
            ImagesProcessingSettings__Default.periodBetweenFileUpdatingAndRebuildingStarting__seconds
      },

      assetsGroups: dataHoldingSelfInstance.createNormalizedAssetsGroupsSettings(
        dataHoldingSelfInstance.imagesProcessingSettings__fromFile__rawValid.assetsGroups,
        ImagesProcessingRawSettingsNormalizer.
            completeAssetsGroupNormalizedSettingsCommonPropertiesUntilImagesGroupNormalizedSettings
      ),

      logging: {

        filesPaths:
            imagesProcessingSettings__fromFile__rawValid.logging?.filesPaths ??
            ImagesProcessingSettings__Default.logging.filesPaths,

        filesCount:
            imagesProcessingSettings__fromFile__rawValid.logging?.filesCount ??
            ImagesProcessingSettings__Default.logging.filesCount,

        filesWatcherEvents:
            imagesProcessingSettings__fromFile__rawValid.logging?.filesWatcherEvents ??
            ImagesProcessingSettings__Default.logging.filesWatcherEvents

      }

    };

  }


  private constructor(
    compoundParameter:
        AssetsProcessingRawSettingsNormalizer.CompoundParameter & {
          imagesProcessingSettings__fromFile__rawValid: ImagesProcessingSettings__FromFile__RawValid;
        }
  ) {
    super(compoundParameter);
    this.imagesProcessingSettings__fromFile__rawValid = compoundParameter.imagesProcessingSettings__fromFile__rawValid;
  }


  private static completeAssetsGroupNormalizedSettingsCommonPropertiesUntilImagesGroupNormalizedSettings(
    imagesGroupSettings__generalProperties__normalized: AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup
  ): ImagesProcessingSettings__Normalized.AssetsGroup {
    return { ...imagesGroupSettings__generalProperties__normalized };
  }

}
