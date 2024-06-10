/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import AudiosProcessingRestrictions from "@AudiosProcessing/AudiosProcessingRestrictions";

/* ─── Default Settings ───────────────────────────────────────────────────────────────────────────────────────────── */
import AudiosProcessingSettings__Default from "@AudiosProcessing/AudiosProcessingSettings__Default";

/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import type AudiosProcessingSettings__FromFile__RawValid from "@AudiosProcessing/AudiosProcessingSettings__FromFile__RawValid";

/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding:Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";
import type AudiosProcessingSettings__Normalized from "@AudiosProcessing/AudiosProcessingSettings__Normalized";
import type AssetsProcessingSettingsGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/AssetsProcessingSettingsGenericProperties__Normalized";

/* ─── Superclass ─────────────────────────────────────────────────────────────────────────────────────────────────── */
import AssetsProcessingRawSettingsNormalizer from
    "@ProjectBuilding/Common/RawSettingsNormalizers/AssetsProcessingRawSettingsNormalizer";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { isNotUndefined } from "@yamato-daiwa/es-extensions";


export default class AudiosProcessingRawSettingsNormalizer extends AssetsProcessingRawSettingsNormalizer {

  private readonly audiosProcessingSettings__fromFile__rawValid: AudiosProcessingSettings__FromFile__RawValid;


  public static normalize(
    {
      audiosProcessingSettings__fromFile__rawValid,
      commonSettings__normalized
    }: Readonly<{
      audiosProcessingSettings__fromFile__rawValid: AudiosProcessingSettings__FromFile__RawValid;
      commonSettings__normalized: ProjectBuildingCommonSettings__Normalized;
    }>
  ): AudiosProcessingSettings__Normalized {

    const dataHoldingSelfInstance: AudiosProcessingRawSettingsNormalizer =
        new AudiosProcessingRawSettingsNormalizer({

          ...isNotUndefined(commonSettings__normalized.tasksAndSourceFilesSelection) ? {
            assetsGroupsIDsSelection: commonSettings__normalized.tasksAndSourceFilesSelection.imagesProcessing
          } : null,

          supportedSourceFilesNamesExtensionsWithoutLeadingDots: AudiosProcessingRestrictions.
              supportedSourceFilesNamesExtensionsWithoutLeadingDots,

          audiosProcessingSettings__fromFile__rawValid,

          consumingProjectBuildingMode: commonSettings__normalized.projectBuildingMode,
          consumingProjectRootDirectoryAbsolutePath: commonSettings__normalized.projectRootDirectoryAbsolutePath

        });

    return {

      common: {
        supportedSourceFilesNamesExtensionsWithoutLeadingDots: AudiosProcessingRestrictions.
            supportedSourceFilesNamesExtensionsWithoutLeadingDots,
        periodBetweenFileUpdatingAndRebuildingStarting__seconds:
          audiosProcessingSettings__fromFile__rawValid.common?.periodBetweenFileUpdatingAndRebuildingStarting__seconds ??
          AudiosProcessingSettings__Default.periodBetweenFileUpdatingAndRebuildingStarting__seconds
      },

      assetsGroups: dataHoldingSelfInstance.createNormalizedAssetsGroupsSettings(
        dataHoldingSelfInstance.audiosProcessingSettings__fromFile__rawValid.assetsGroups,
        AudiosProcessingRawSettingsNormalizer.
            completeAssetsGroupNormalizedSettingsCommonPropertiesUntilImagesGroupNormalizedSettings
      ),

      logging: {

        filesPaths:
            audiosProcessingSettings__fromFile__rawValid.logging?.filesPaths ??
            AudiosProcessingSettings__Default.logging.filesPaths,

        filesCount:
            audiosProcessingSettings__fromFile__rawValid.logging?.filesCount ??
            AudiosProcessingSettings__Default.logging.filesCount,

        filesWatcherEvents:
            audiosProcessingSettings__fromFile__rawValid.logging?.filesWatcherEvents ??
            AudiosProcessingSettings__Default.logging.filesWatcherEvents

      }

    };

  }


  private constructor(
    compoundParameter:
        AssetsProcessingRawSettingsNormalizer.CompoundParameter &
        Readonly<{ audiosProcessingSettings__fromFile__rawValid: AudiosProcessingSettings__FromFile__RawValid; }>
  ) {
    super(compoundParameter);
    this.audiosProcessingSettings__fromFile__rawValid = compoundParameter.audiosProcessingSettings__fromFile__rawValid;
  }


  private static completeAssetsGroupNormalizedSettingsCommonPropertiesUntilImagesGroupNormalizedSettings(
    imagesGroupSettings__generalProperties__normalized: AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup
  ): AudiosProcessingSettings__Normalized.AssetsGroup {
    return { ...imagesGroupSettings__generalProperties__normalized };
  }

}
