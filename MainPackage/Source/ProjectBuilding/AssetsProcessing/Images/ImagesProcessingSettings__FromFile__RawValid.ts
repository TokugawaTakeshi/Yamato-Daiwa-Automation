/* ━━━ < Imports ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* ┅┅┅ Raw Valid Settings ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import AssetsProcessingSettingsGenericProperties__FromFile__RawValid from
    "@ProjectBuilding:Common/RawConfig/AssetsProcessingSettingsGenericProperties__FromFile__RawValid";

/* ┅┅┅ Utils ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import type { RawObjectDataProcessor } from "@yamato-daiwa/es-extensions";
/* ━━━ Imports > ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */


type ImagesProcessingSettings__FromFile__RawValid = Readonly<{
  common?: ImagesProcessingSettings__FromFile__RawValid.Common;
  assetsGroups: Readonly<{ [groupID: string]: ImagesProcessingSettings__FromFile__RawValid.AssetsGroup; }>;
  logging?: ImagesProcessingSettings__FromFile__RawValid.Logging;
}>;


namespace ImagesProcessingSettings__FromFile__RawValid {

  /* ━━━ Types ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* ┅┅┅ Common ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  export type Common =
      AssetsProcessingSettingsGenericProperties__FromFile__RawValid.Common &
      Readonly<{
        imagesOptimization?: Common.ImagesOptimization;
      }>;

  export namespace Common {

    export type ImagesOptimization = Readonly<{
      cachedOptimizedImagesDirectoryRelativePath?: string;
      relativePathsOfIgnoredFiles?: ReadonlyArray<string>;
      relativePathsOfIgnoredDirectories?: ReadonlyArray<string>;
    }>;

  }


  /* ┅┅┅ Assets Group ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  export type AssetsGroup =
      AssetsProcessingSettingsGenericProperties__FromFile__RawValid.AssetsGroup &
      Readonly<{
        imagesOptimization?: AssetsGroup.ImagesOptimization;
      }>;

  export namespace AssetsGroup {
    export type ImagesOptimization = Readonly<{
      enabled?: boolean;
    }>;
  }


  /* ┅┅┅ Logging ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  export type Logging = AssetsProcessingSettingsGenericProperties__FromFile__RawValid.Logging;


  /* ━━━ Properties Specification ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export const propertiesSpecification: RawObjectDataProcessor.PropertiesSpecification = {

    ...AssetsProcessingSettingsGenericProperties__FromFile__RawValid.PropertiesSpecification.Common.generate({

      assetTypeSpecificPropertiesSpecification: {

        $imagesOptimization: {

          newName: "imagesOptimization",
          type: Object,
          isUndefinedForbidden: false,
          mustTransformNullToUndefined: true,

          properties: {

            $cachedOptimizedImagesDirectoryRelativePath: {
              newName: "cachedOptimizedImagesDirectoryRelativePath",
              type: String,
              isUndefinedForbidden: false,
              isNullForbidden: true,
              minimalCharactersCount: 1
            },

            $ignoreFiles: {

              newName: "relativePathsOfIgnoredFiles",
              type: Array,
              isUndefinedForbidden: false,
              isNullForbidden: true,
              areUndefinedElementsForbidden: true,
              areNullElementsForbidden: true,

              element: {
                type: String,
                minimalCharactersCount: 1
              }

            },

            $ignoreDirectories: {

              newName: "relativePathsOfIgnoredDirectories",
              type: Array,
              isUndefinedForbidden: false,
              isNullForbidden: true,
              areUndefinedElementsForbidden: true,
              areNullElementsForbidden: true,

              element: {
                type: String,
                minimalCharactersCount: 1
              }

            }

          }

        }

      }
    }),

    ...AssetsProcessingSettingsGenericProperties__FromFile__RawValid.PropertiesSpecification.AssetsGroups.generate({
      assetTypeSpecificPropertiesSpecification: {
        assetsGroupDependent: {

          $imagesOptimization: {

            newName: "imagesOptimization",
            type: Object,
            isUndefinedForbidden: false,
            mustTransformNullToUndefined: true,

            properties: {

              $enable: {
                newName: "enabled",
                type: Boolean,
                isUndefinedForbidden: true,
                isNullForbidden: true
              }

            }

          }

        }
      }
    })

  };

}


export default ImagesProcessingSettings__FromFile__RawValid;
