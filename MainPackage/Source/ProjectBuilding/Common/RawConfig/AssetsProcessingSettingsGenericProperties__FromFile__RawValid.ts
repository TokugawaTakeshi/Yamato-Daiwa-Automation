/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import ConsumingProjectBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";

/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import type ResourceFilesGroupBuildingModeDependentOutputGenericSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/ResourceFilesGroupBuildingModeDependentOutputGenericSettings__FromFile__RawValid";
import type ConsumingProjectPreDefinedBuildingModes__Localized from
    "@ProjectBuilding/Common/RawConfig/Enumerations/ConsumingProjectPreDefinedBuildingModes__Localized";
import type RevisioningSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/RevisioningSettings__FromFile__RawValid";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { RawObjectDataProcessor, nullToUndefined } from "@yamato-daiwa/es-extensions";


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


  /* ━━━ Localization ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type Localization = {

    common: Readonly<{
      KEY: string;
      periodBetweenFileUpdatingAndRebuildingStarting__seconds: Readonly<{ KEY: string; }>;
    }>;

    assetsGroups: Readonly<{

      KEY: string;

      sourceFilesTopDirectoryRelativePath: Readonly<{ KEY: string; }>;
      referenceCustomAliasName: Readonly<{ KEY: string; }>;

      buildingModeDependent:
          ResourceFilesGroupBuildingModeDependentOutputGenericSettings__FromFile__RawValid.Localization &
          Readonly<{
            revisioning: Readonly<{ KEY: string; }>;
          }>;

    }>;

    logging: Readonly<{
      KEY: string;
      filesPaths: Readonly<{ KEY: string; }>;
      filesCount: Readonly<{ KEY: string; }>;
      filesWatcherEvents: Readonly<{ KEY: string; }>;
    }>;

  };

  export function getLocalizedPropertiesSpecification(
    {
      assetsProcessingSettingsGenericPropertiesLocalization,
      revisioningPropertiesLocalizedSpecification,
      entryPointsGroupBuildingModeDependentOutputGenericSettingsLocalizedPropertiesSpecification,
      consumingProjectLocalizedPreDefinedBuildingModes
    }: Readonly<{
      assetsProcessingSettingsGenericPropertiesLocalization: Localization;
      revisioningPropertiesLocalizedSpecification: RawObjectDataProcessor.PropertiesSpecification;
      entryPointsGroupBuildingModeDependentOutputGenericSettingsLocalizedPropertiesSpecification: RawObjectDataProcessor.
          PropertiesSpecification;
      consumingProjectLocalizedPreDefinedBuildingModes: ConsumingProjectPreDefinedBuildingModes__Localized;
    }>
  ): RawObjectDataProcessor.PropertiesSpecification {

    return {

      [assetsProcessingSettingsGenericPropertiesLocalization.assetsGroups.KEY]: {

        newName: "common",
        preValidationModifications: nullToUndefined,
        type: Object,
        required: true,

        properties: {

          [
            assetsProcessingSettingsGenericPropertiesLocalization.common.
                periodBetweenFileUpdatingAndRebuildingStarting__seconds.KEY
          ]: {
            newName: "periodBetweenFileUpdatingAndRebuildingStarting__seconds",
            type: Number,
            required: false,
            numbersSet: RawObjectDataProcessor.NumbersSets.naturalNumber
          }

        }

      },

      [assetsProcessingSettingsGenericPropertiesLocalization.assetsGroups.KEY]: {

        newName: "assetsGroups",
        preValidationModifications: nullToUndefined,
        type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
        required: true,

        value: {

          type: Object,
          properties: {

            [assetsProcessingSettingsGenericPropertiesLocalization.assetsGroups.sourceFilesTopDirectoryRelativePath.KEY]: {
              newName: "sourceFilesTopDirectoryRelativePath",
              type: String,
              required: true,
              minimalCharactersCount: 1
            },

            [assetsProcessingSettingsGenericPropertiesLocalization.assetsGroups.referenceCustomAliasName.KEY]: {
              newName: "sourceFilesTopDirectoryPathAliasForReferencingFromHTML",
              type: String,
              required: false,
              minimalCharactersCount: 1
            },

            [assetsProcessingSettingsGenericPropertiesLocalization.assetsGroups.buildingModeDependent.KEY]: {

              newName: "buildingModeDependent",
              type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
              required: true,
              minimalEntriesCount: 1,

              keysRenamings: {
                [consumingProjectLocalizedPreDefinedBuildingModes.staticPreview]:
                    ConsumingProjectBuildingModes.staticPreview,
                [consumingProjectLocalizedPreDefinedBuildingModes.localDevelopment]:
                    ConsumingProjectBuildingModes.localDevelopment,
                [consumingProjectLocalizedPreDefinedBuildingModes.testing]:
                    ConsumingProjectBuildingModes.testing,
                [consumingProjectLocalizedPreDefinedBuildingModes.staging]:
                    ConsumingProjectBuildingModes.staging,
                [consumingProjectLocalizedPreDefinedBuildingModes.production]:
                    ConsumingProjectBuildingModes.production
              },

              value: {

                type: Object,
                properties: {

                  ...entryPointsGroupBuildingModeDependentOutputGenericSettingsLocalizedPropertiesSpecification,

                  [assetsProcessingSettingsGenericPropertiesLocalization.assetsGroups.buildingModeDependent.revisioning.KEY]: {
                    newName: "revisioning",
                    type: Object,
                    required: false,
                    preValidationModifications: nullToUndefined,
                    properties: revisioningPropertiesLocalizedSpecification
                  }

                }

              }

            }

          }

        }

      },

      [assetsProcessingSettingsGenericPropertiesLocalization.logging.KEY]: {

        newName: "logging",
        type: Object,
        required: false,
        preValidationModifications: nullToUndefined,

        properties: {

          [assetsProcessingSettingsGenericPropertiesLocalization.logging.filesPaths.KEY]: {
            newName: "filesPaths",
            type: Boolean,
            required: false
          },

          [assetsProcessingSettingsGenericPropertiesLocalization.logging.filesCount.KEY]: {
            newName: "filesCount",
            type: Boolean,
            required: false
          },

          [assetsProcessingSettingsGenericPropertiesLocalization.logging.filesWatcherEvents.KEY]: {
            newName: "filesWatcherEvents",
            type: Boolean,
            required: false
          }

        }

      }

    };

  }

}


export default AssetsProcessingSettingsGenericProperties__FromFile__RawValid;
