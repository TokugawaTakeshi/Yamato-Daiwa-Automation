/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import ConsumingProjectBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";

/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import ResourceFilesGroupBuildingModeDependentOutputGenericSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/ResourceFilesGroupBuildingModeDependentOutputGenericSettings__FromFile__RawValid";
import RevisioningSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/RevisioningSettings__FromFile__RawValid";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { RawObjectDataProcessor } from "@yamato-daiwa/es-extensions";


namespace AssetsProcessingSettingsGenericProperties__FromFile__RawValid {

  /* ━━━ Types ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type Common = Readonly<{
    periodBetweenFileUpdatingAndRebuildingStarting__seconds?: number;
  }>;

  export type AssetsGroup = Readonly<{
    sourceFilesTopDirectoryRelativePath: string;
    referenceCustomAliasName?: string;
    buildingModeDependent: Readonly<{
      [projectBuildingMode in ConsumingProjectBuildingModes]: AssetsGroup.BuildingModeDependent;
    }>;
  }>;

  export namespace AssetsGroup {

    export type BuildingModeDependent =
        ResourceFilesGroupBuildingModeDependentOutputGenericSettings__FromFile__RawValid &
        Readonly<{ revisioning?: RevisioningSettings__FromFile__RawValid; }>;

  }


  export type Logging = Readonly<{
    filesPaths?: boolean;
    filesCount?: boolean;
    filesWatcherEvents?: boolean;
  }>;


  /* ━━━ Properties Specification ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export const propertiesSpecification: RawObjectDataProcessor.PropertiesSpecification = {

    $common: {

      newName: "common",
      type: Object,
      isUndefinedForbidden: false,
      mustTransformNullToUndefined: true,

      properties: {

        $periodBetweenFileUpdatingAndRebuildingStarting__seconds: {
          newName: "periodBetweenFileUpdatingAndRebuildingStarting__seconds",
          type: Number,
          isUndefinedForbidden: false,
          isNullForbidden: true,
          numbersSet: RawObjectDataProcessor.NumbersSets.naturalNumber
        }

      }

    },

    $assetsGroups: {

      newName: "assetsGroups",
      type: RawObjectDataProcessor.ValuesTypesIDs.associativeArray,
      isUndefinedForbidden: true,
      isNullForbidden: true,
      areUndefinedTypeValuesForbidden: true,
      areNullTypeValuesForbidden: true,

      value: {

        type: Object,
        properties: {

          $sourceFilesTopDirectoryRelativePath: {
            newName: "sourceFilesTopDirectoryRelativePath",
            type: String,
            isUndefinedForbidden: true,
            isNullForbidden: true,
            minimalCharactersCount: 1
          },

          $sourceFilesTopDirectoryPathAliasForReferencingFromHTML: {
            newName: "sourceFilesTopDirectoryPathAliasForReferencingFromHTML",
            type: String,
            isUndefinedForbidden: false,
            isNullForbidden: true,
            minimalCharactersCount: 1
          },

          $buildingModeDependent: {

            newName: "buildingModeDependent",
            type: RawObjectDataProcessor.ValuesTypesIDs.associativeArray,
            isUndefinedForbidden: true,
            isNullForbidden: true,
            minimalEntriesCount: 1,
            areUndefinedTypeValuesForbidden: true,
            areNullTypeValuesForbidden: true,

            allowedKeys: [
              "$staticPreview",
              "$localDevelopment",
              "$testing",
              "$staging",
              "$production"
            ],

            keysRenamings: {
              $staticPreview: ConsumingProjectBuildingModes.staticPreview,
              $localDevelopment: ConsumingProjectBuildingModes.localDevelopment,
              $testing: ConsumingProjectBuildingModes.testing,
              $staging: ConsumingProjectBuildingModes.staging,
              $production: ConsumingProjectBuildingModes.production
            },

            value: {

              type: Object,
              properties: {

                ...ResourceFilesGroupBuildingModeDependentOutputGenericSettings__FromFile__RawValid.propertiesSpecification,

                $revisioning: {
                  newName: "revisioning",
                  type: Object,
                  isUndefinedForbidden: false,
                  mustTransformNullToUndefined: true,
                  properties: RevisioningSettings__FromFile__RawValid.propertiesSpecification
                }

              }

            }

          }

        }

      }

    },

    $logging: {

      newName: "logging",
      type: Object,
      isUndefinedForbidden: false,
      mustTransformNullToUndefined: true,

      properties: {

        $filesPaths: {
          newName: "filesPaths",
          type: Boolean,
          isUndefinedForbidden: false,
          isNullForbidden: true
        },

        $filesCount: {
          newName: "filesCount",
          type: Boolean,
          isUndefinedForbidden: false,
          isNullForbidden: true
        },

        $filesWatcherEvents: {
          newName: "filesWatcherEvents",
          type: Boolean,
          isUndefinedForbidden: false,
          isNullForbidden: true
        }

      }

    }

  };

}


export default AssetsProcessingSettingsGenericProperties__FromFile__RawValid;
