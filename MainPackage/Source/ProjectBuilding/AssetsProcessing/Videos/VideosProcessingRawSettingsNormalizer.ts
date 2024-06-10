/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import VideosProcessingRestrictions from "@VideosProcessing/VideosProcessingRestrictions";

/* ─── Default Settings ───────────────────────────────────────────────────────────────────────────────────────────── */
import VideosProcessingSettings__Default from "@VideosProcessing/VideosProcessingSettings__Default";

/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import type VideosProcessingSettings__FromFile__RawValid from "@VideosProcessing/VideosProcessingSettings__FromFile__RawValid";

/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding:Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";
import type VideosProcessingSettings__Normalized from "@VideosProcessing/VideosProcessingSettings__Normalized";
import type AssetsProcessingSettingsGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/AssetsProcessingSettingsGenericProperties__Normalized";

/* ─── Superclass ─────────────────────────────────────────────────────────────────────────────────────────────────── */
import AssetsProcessingRawSettingsNormalizer from
    "@ProjectBuilding/Common/RawSettingsNormalizers/AssetsProcessingRawSettingsNormalizer";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { isNotUndefined } from "@yamato-daiwa/es-extensions";


export default class VideosProcessingRawSettingsNormalizer extends AssetsProcessingRawSettingsNormalizer {

  private readonly videosProcessingSettings__fromFile__rawValid: VideosProcessingSettings__FromFile__RawValid;


  public static normalize(
    {
      videosProcessingSettings__fromFile__rawValid,
      commonSettings__normalized
    }: Readonly<{
      videosProcessingSettings__fromFile__rawValid: VideosProcessingSettings__FromFile__RawValid;
      commonSettings__normalized: ProjectBuildingCommonSettings__Normalized;
    }>
  ): VideosProcessingSettings__Normalized {

    const dataHoldingSelfInstance: VideosProcessingRawSettingsNormalizer =
        new VideosProcessingRawSettingsNormalizer({

          ...isNotUndefined(commonSettings__normalized.tasksAndSourceFilesSelection) ? {
            assetsGroupsIDsSelection: commonSettings__normalized.tasksAndSourceFilesSelection.imagesProcessing
          } : null,

          supportedSourceFilesNamesExtensionsWithoutLeadingDots: VideosProcessingRestrictions.
              supportedSourceFilesNamesExtensionsWithoutLeadingDots,

          videosProcessingSettings__fromFile__rawValid,

          consumingProjectBuildingMode: commonSettings__normalized.projectBuildingMode,
          consumingProjectRootDirectoryAbsolutePath: commonSettings__normalized.projectRootDirectoryAbsolutePath

        });

    return {

      common: {
        supportedSourceFilesNamesExtensionsWithoutLeadingDots: VideosProcessingRestrictions.
            supportedSourceFilesNamesExtensionsWithoutLeadingDots,
        periodBetweenFileUpdatingAndRebuildingStarting__seconds:
            videosProcessingSettings__fromFile__rawValid.common?.periodBetweenFileUpdatingAndRebuildingStarting__seconds ??
            VideosProcessingSettings__Default.periodBetweenFileUpdatingAndRebuildingStarting__seconds
      },

      assetsGroups: dataHoldingSelfInstance.createNormalizedAssetsGroupsSettings(
          dataHoldingSelfInstance.videosProcessingSettings__fromFile__rawValid.assetsGroups,
          VideosProcessingRawSettingsNormalizer.
              completeAssetsGroupNormalizedSettingsCommonPropertiesUntilImagesGroupNormalizedSettings
      ),

      logging: {

        filesPaths:
            videosProcessingSettings__fromFile__rawValid.logging?.filesPaths ??
            VideosProcessingSettings__Default.logging.filesPaths,

        filesCount:
            videosProcessingSettings__fromFile__rawValid.logging?.filesCount ??
            VideosProcessingSettings__Default.logging.filesCount,

        filesWatcherEvents:
            videosProcessingSettings__fromFile__rawValid.logging?.filesWatcherEvents ??
            VideosProcessingSettings__Default.logging.filesWatcherEvents

      }

    };

  }


  private constructor(
    compoundParameter:
        AssetsProcessingRawSettingsNormalizer.CompoundParameter & {
          videosProcessingSettings__fromFile__rawValid: VideosProcessingSettings__FromFile__RawValid;
        }
  ) {
    super(compoundParameter);
    this.videosProcessingSettings__fromFile__rawValid = compoundParameter.videosProcessingSettings__fromFile__rawValid;
  }


  private static completeAssetsGroupNormalizedSettingsCommonPropertiesUntilImagesGroupNormalizedSettings(
    imagesGroupSettings__generalProperties__normalized: AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup
  ): VideosProcessingSettings__Normalized.AssetsGroup {
    return { ...imagesGroupSettings__generalProperties__normalized };
  }

}
