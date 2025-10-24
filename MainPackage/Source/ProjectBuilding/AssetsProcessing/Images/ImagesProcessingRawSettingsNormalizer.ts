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
import DotYDA_DirectoryManager from "@Utils/DotYDA_DirectoryManager";
import { isNotUndefined } from "@yamato-daiwa/es-extensions";
import { ImprovedPath, ImprovedGlob } from "@yamato-daiwa/es-extensions-nodejs";


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

        supportedSourceFilesNamesExtensionsWithoutLeadingDots:
            ImagesProcessingRestrictions.supportedSourceFilesNamesExtensionsWithoutLeadingDots,

        periodBetweenFileUpdatingAndRebuildingStarting__seconds:
            imagesProcessingSettings__fromFile__rawValid.common?.periodBetweenFileUpdatingAndRebuildingStarting__seconds ??
            ImagesProcessingSettings__Default.periodBetweenFileUpdatingAndRebuildingStarting__seconds,

        imagesOptimization:
            ImagesProcessingRawSettingsNormalizer.normalizeImagesOptimizationCommonSettings(
              commonSettings__normalized,
              imagesProcessingSettings__fromFile__rawValid.common?.imagesOptimization
            )

      },

      assetsGroups:
          dataHoldingSelfInstance.createNormalizedAssetsGroupsSettings(
            dataHoldingSelfInstance.imagesProcessingSettings__fromFile__rawValid.assetsGroups,
            dataHoldingSelfInstance.completeAssetsGroupNormalizedSettingsCommonPropertiesUntilImagesGroupNormalizedSettings.
                bind(dataHoldingSelfInstance)
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
        AssetsProcessingRawSettingsNormalizer.CompoundParameter &
        Readonly<{ imagesProcessingSettings__fromFile__rawValid: ImagesProcessingSettings__FromFile__RawValid; }>
  ) {
    super(compoundParameter);
    this.imagesProcessingSettings__fromFile__rawValid = compoundParameter.imagesProcessingSettings__fromFile__rawValid;
  }


  private completeAssetsGroupNormalizedSettingsCommonPropertiesUntilImagesGroupNormalizedSettings(
    imagesGroupSettings__generalProperties__normalized: AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup,
    imagesGroupSettings__fromFile__rawValid: ImagesProcessingSettings__FromFile__RawValid.AssetsGroup
  ): ImagesProcessingSettings__Normalized.AssetsGroup {
    return {

      ...imagesGroupSettings__generalProperties__normalized,

      imagesOptimization: {
        mustOptimize:
            imagesGroupSettings__fromFile__rawValid.imagesOptimization?.enabled ??
            ImagesProcessingSettings__Default.mustOptimize(this.consumingProjectBuildingMode)
      }

    };
  }

  private static normalizeImagesOptimizationCommonSettings(
    commonSettings__normalized: ProjectBuildingCommonSettings__Normalized,
    imagesOptimizationCommonSettings__rawValid__fromFile?: ImagesProcessingSettings__FromFile__RawValid.Common.ImagesOptimization
  ): ImagesProcessingSettings__Normalized.Common.ImagesOptimization {

    return {

      cachedOptimizedImagesDirectoryAbsolutePath:

          ImprovedPath.joinPathSegments(
            [
              ...isNotUndefined(
                imagesOptimizationCommonSettings__rawValid__fromFile?.cachedOptimizedImagesDirectoryRelativePath
              ) ?
                  [
                    commonSettings__normalized.projectRootDirectoryAbsolutePath,
                    imagesOptimizationCommonSettings__rawValid__fromFile.cachedOptimizedImagesDirectoryRelativePath
                  ] :
                  [
                    DotYDA_DirectoryManager.OPTIMIZATION_FILES_DIRECTORY_ABSOLUTE_PATH,
                    "Images"
                  ]
            ],
            { alwaysForwardSlashSeparators: true }
          ),

      ignoresFilesGlobs:

          new Set([

            ...(imagesOptimizationCommonSettings__rawValid__fromFile?.relativePathsOfIgnoredFiles ?? []).
                map(
                  (relativePathsOfIgnoredFile: string): string =>
                      ImprovedPath.joinPathSegments(
                        [
                          commonSettings__normalized.projectRootDirectoryAbsolutePath,
                          relativePathsOfIgnoredFile
                        ],
                        { alwaysForwardSlashSeparators: true }
                      )
                ),

            ...(imagesOptimizationCommonSettings__rawValid__fromFile?.relativePathsOfIgnoredDirectories ?? []).
                map(
                  (relativePathsOfIgnoredDirectory: string): string =>
                      ImprovedGlob.buildExcludingOfDirectoryWithSubdirectoriesGlobSelector({
                        targetDirectoryPath:
                            ImprovedPath.joinPathSegments(
                              [
                                commonSettings__normalized.projectRootDirectoryAbsolutePath,
                                relativePathsOfIgnoredDirectory
                              ],
                              { alwaysForwardSlashSeparators: true }
                            )
                      })
                )

          ])

    };

  }

}
