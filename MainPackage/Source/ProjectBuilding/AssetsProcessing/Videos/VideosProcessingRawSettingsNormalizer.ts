/* --- Restrictions ------------------------------------------------------------------------------------------------- */
import VideosProcessingRestrictions from "@VideosProcessing/VideosProcessingRestrictions";

/* --- External data ------------------------------------------------------------------------------------------------ */
import type VideosProcessingSettings__FromFile__RawValid from "@VideosProcessing/VideosProcessingSettings__FromFile__RawValid";

/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type ProjectBuildingConfig__Normalized from "../../ProjectBuildingConfig__Normalized";
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding:Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";
import type VideosProcessingSettings__Normalized from "@VideosProcessing/VideosProcessingSettings__Normalized";
import AssetsProcessingRawSettingsNormalizer from
    "@ProjectBuilding/Common/RawSettingsNormalizers/AssetsProcessingRawSettingsNormalizer";

/* --- General auxiliaries ------------------------------------------------------------------------------------------ */
import { isNotUndefined } from "@yamato-daiwa/es-extensions";


export default class VideosProcessingRawSettingsNormalizer extends AssetsProcessingRawSettingsNormalizer {

  protected readonly supportedEntryPointsSourceFilenameExtensionsWithoutLeadingDots: Array<string> =
      VideosProcessingRestrictions.supportedSourceFileNameExtensionsWithoutLeadingDots;

  private readonly videosProcessingSettings__fromFile__rawValid: VideosProcessingSettings__FromFile__RawValid;


  public static normalize(
    {
      videosProcessingSettings__fromFile__rawValid,
      commonSettings__normalized
    }: {
      videosProcessingSettings__fromFile__rawValid: VideosProcessingSettings__FromFile__RawValid;
      commonSettings__normalized: ProjectBuildingCommonSettings__Normalized;
    }
  ): VideosProcessingSettings__Normalized {

    const dataHoldingSelfInstance: VideosProcessingRawSettingsNormalizer =
        new VideosProcessingRawSettingsNormalizer({
          videosProcessingSettings__fromFile__rawValid,
          consumingProjectBuildingMode: commonSettings__normalized.projectBuildingMode,
          consumingProjectRootDirectoryAbsolutePath: commonSettings__normalized.projectRootDirectoryAbsolutePath,
          ...isNotUndefined(commonSettings__normalized.tasksAndSourceFilesSelection) ? {
            assetsGroupsIDsSelection: commonSettings__normalized.tasksAndSourceFilesSelection.imagesProcessing
          } : {}
        });

    return {
      common: {
        supportedSourceFilesNamesExtensionsWithoutLeadingDots: VideosProcessingRestrictions.
            supportedSourceFileNameExtensionsWithoutLeadingDots
      },
      assetsGroups: dataHoldingSelfInstance.createNormalizedAssetsGroupsSettings(
          dataHoldingSelfInstance.videosProcessingSettings__fromFile__rawValid.assetsGroups,
          VideosProcessingRawSettingsNormalizer.
              completeAssetsGroupNormalizedSettingsCommonPropertiesUntilImagesGroupNormalizedSettings
      )
    };
  }


  private constructor(
    namedParameters:
        AssetsProcessingRawSettingsNormalizer.ConstructorParameters & {
          videosProcessingSettings__fromFile__rawValid: VideosProcessingSettings__FromFile__RawValid;
        }
  ) {
    super(namedParameters);
    this.videosProcessingSettings__fromFile__rawValid = namedParameters.videosProcessingSettings__fromFile__rawValid;
  }


  private static completeAssetsGroupNormalizedSettingsCommonPropertiesUntilImagesGroupNormalizedSettings(
    imagesGroupSettings__generalProperties__normalized: ProjectBuildingConfig__Normalized.AssetsGroupSettingsGenericProperties
  ): VideosProcessingSettings__Normalized.AssetsGroup {
    return { ...imagesGroupSettings__generalProperties__normalized };
  }
}
