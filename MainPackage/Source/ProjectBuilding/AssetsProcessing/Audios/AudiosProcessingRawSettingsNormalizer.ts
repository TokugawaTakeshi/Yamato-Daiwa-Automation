/* --- Restrictions ------------------------------------------------------------------------------------------------- */
import AudiosProcessingRestrictions from "@AudiosProcessing/AudiosProcessingRestrictions";

/* --- Raw settings ------------------------------------------------------------------------------------------------- */
import type AudiosProcessingSettings__FromFile__RawValid from "@AudiosProcessing/AudiosProcessingSettings__FromFile__RawValid";

/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding:Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";
import type AudiosProcessingSettings__Normalized from "@AudiosProcessing/AudiosProcessingSettings__Normalized";
import AssetsProcessingRawSettingsNormalizer from
    "@ProjectBuilding/Common/RawSettingsNormalizers/AssetsProcessingRawSettingsNormalizer";

/* --- Utils -------------------------------------------------------------------------------------------------------- */
import { isNotUndefined } from "@yamato-daiwa/es-extensions";


export default class AudiosProcessingRawSettingsNormalizer extends AssetsProcessingRawSettingsNormalizer {

  protected readonly supportedEntryPointsSourceFilenameExtensionsWithoutLeadingDots: Array<string> =
      AudiosProcessingRestrictions.supportedSourceFileNameExtensionsWithoutLeadingDots;

  private readonly audiosProcessingSettings__fromFile__rawValid: AudiosProcessingSettings__FromFile__RawValid;


  public static getNormalizedSettings(
    {
      audiosProcessingSettings__fromFile__rawValid,
      commonSettings__normalized
    }: {
      audiosProcessingSettings__fromFile__rawValid: AudiosProcessingSettings__FromFile__RawValid;
      commonSettings__normalized: ProjectBuildingCommonSettings__Normalized;
    }
  ): AudiosProcessingSettings__Normalized {

    const dataHoldingSelfInstance: AudiosProcessingRawSettingsNormalizer =
        new AudiosProcessingRawSettingsNormalizer({
          audiosProcessingSettings__fromFile__rawValid,
          consumingProjectBuildingMode: commonSettings__normalized.projectBuildingMode,
          consumingProjectRootDirectoryAbsolutePath: commonSettings__normalized.projectRootDirectoryAbsolutePath,
          ...isNotUndefined(commonSettings__normalized.tasksAndSourceFilesSelection) ? {
            assetsGroupsIDsSelection: commonSettings__normalized.tasksAndSourceFilesSelection.imagesProcessing
          } : {}
        });

    return {
      common: {
        supportedSourceFilesNamesExtensionsWithoutLeadingDots: AudiosProcessingRestrictions.
            supportedSourceFileNameExtensionsWithoutLeadingDots
      },
      assetsGroups: dataHoldingSelfInstance.createNormalizedAssetsGroupsSettings(
          dataHoldingSelfInstance.audiosProcessingSettings__fromFile__rawValid.assetsGroups,
          AudiosProcessingRawSettingsNormalizer.
              completeAssetsGroupNormalizedSettingsCommonPropertiesUntilImagesGroupNormalizedSettings
      )
    };
  }


  private constructor(
    namedParameters:
        AssetsProcessingRawSettingsNormalizer.ConstructorParameters & {
          audiosProcessingSettings__fromFile__rawValid: AudiosProcessingSettings__FromFile__RawValid;
        }
  ) {
    super(namedParameters);
    this.audiosProcessingSettings__fromFile__rawValid = namedParameters.audiosProcessingSettings__fromFile__rawValid;
  }


  private static completeAssetsGroupNormalizedSettingsCommonPropertiesUntilImagesGroupNormalizedSettings(
    imagesGroupSettings__generalProperties__normalized: ProjectBuildingConfig__Normalized.AssetsGroupSettingsGenericProperties
  ): AudiosProcessingSettings__Normalized.AssetsGroup {
    return { ...imagesGroupSettings__generalProperties__normalized };
  }
}
