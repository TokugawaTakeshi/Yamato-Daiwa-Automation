/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import FontsProcessingRestrictions from "@FontsProcessing/FontsProcessingRestrictions";

/* ─── Default Settings ───────────────────────────────────────────────────────────────────────────────────────────── */
import FontsProcessingSettings__Default from "@FontsProcessing/FontsProcessingSettings__Default";

/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import type FontsProcessingSettings__FromFile__RawValid from "@FontsProcessing/FontsProcessingSettings__FromFile__RawValid";

/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding:Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";
import type FontsProcessingSettings__Normalized from "@FontsProcessing/FontsProcessingSettings__Normalized";
import type AssetsProcessingSettingsGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/AssetsProcessingSettingsGenericProperties__Normalized";

/* ─── Superclass ─────────────────────────────────────────────────────────────────────────────────────────────────── */
import AssetsProcessingRawSettingsNormalizer from
    "@ProjectBuilding/Common/RawSettingsNormalizers/AssetsProcessingRawSettingsNormalizer";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { isNotUndefined } from "@yamato-daiwa/es-extensions";


export default class FontsProcessingSettingsRawSettingsNormalizer extends AssetsProcessingRawSettingsNormalizer {

  private readonly fontsProcessingSettings__fromFile__rawValid: FontsProcessingSettings__FromFile__RawValid;


  public static normalize(
    {
      fontsProcessingSettings__fromFile__rawValid,
      commonSettings__normalized
    }: Readonly<{
      fontsProcessingSettings__fromFile__rawValid: FontsProcessingSettings__FromFile__RawValid;
      commonSettings__normalized: ProjectBuildingCommonSettings__Normalized;
    }>
  ): FontsProcessingSettings__Normalized {

    const dataHoldingSelfInstance: FontsProcessingSettingsRawSettingsNormalizer =
        new FontsProcessingSettingsRawSettingsNormalizer({

          ...isNotUndefined(commonSettings__normalized.tasksAndSourceFilesSelection) ? {
            assetsGroupsIDsSelection: commonSettings__normalized.tasksAndSourceFilesSelection.imagesProcessing
          } : null,

          supportedSourceFilesNamesExtensionsWithoutLeadingDots: FontsProcessingRestrictions.
              supportedSourceFilesNamesExtensionsWithoutLeadingDots,

          fontsProcessingSettings__fromFile__rawValid,

          consumingProjectBuildingMode: commonSettings__normalized.projectBuildingMode,
          consumingProjectRootDirectoryAbsolutePath: commonSettings__normalized.projectRootDirectoryAbsolutePath

        });

    return {

      common: {
        supportedSourceFilesNamesExtensionsWithoutLeadingDots: FontsProcessingRestrictions.
            supportedSourceFilesNamesExtensionsWithoutLeadingDots,
        periodBetweenFileUpdatingAndRebuildingStarting__seconds:
            fontsProcessingSettings__fromFile__rawValid.common?.periodBetweenFileUpdatingAndRebuildingStarting__seconds ??
            FontsProcessingSettings__Default.periodBetweenFileUpdatingAndRebuildingStarting__seconds
      },

      assetsGroups: dataHoldingSelfInstance.createNormalizedAssetsGroupsSettings(
        dataHoldingSelfInstance.fontsProcessingSettings__fromFile__rawValid.assetsGroups,
        FontsProcessingSettingsRawSettingsNormalizer.
            completeAssetsGroupNormalizedSettingsCommonPropertiesUntilImagesGroupNormalizedSettings
      ),

      logging: {

        filesPaths:
            fontsProcessingSettings__fromFile__rawValid.logging?.filesPaths ??
            FontsProcessingSettings__Default.logging.filesPaths,

        filesCount:
            fontsProcessingSettings__fromFile__rawValid.logging?.filesCount ??
            FontsProcessingSettings__Default.logging.filesCount,

        filesWatcherEvents:
            fontsProcessingSettings__fromFile__rawValid.logging?.filesWatcherEvents ??
            FontsProcessingSettings__Default.logging.filesWatcherEvents

      }

    };

  }


  private constructor(
    compoundParameter:
        AssetsProcessingRawSettingsNormalizer.CompoundParameter &
        Readonly<{ fontsProcessingSettings__fromFile__rawValid: FontsProcessingSettings__FromFile__RawValid; }>
  ) {
    super(compoundParameter);
    this.fontsProcessingSettings__fromFile__rawValid = compoundParameter.fontsProcessingSettings__fromFile__rawValid;
  }


  private static completeAssetsGroupNormalizedSettingsCommonPropertiesUntilImagesGroupNormalizedSettings(
    imagesGroupSettings__generalProperties__normalized: AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup
  ): FontsProcessingSettings__Normalized.AssetsGroup {
    return { ...imagesGroupSettings__generalProperties__normalized };
  }

}
