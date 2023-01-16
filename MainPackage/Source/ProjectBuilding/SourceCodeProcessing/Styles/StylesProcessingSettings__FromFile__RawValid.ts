/* --- Restrictions ------------------------------------------------------------------------------------------------- */
import ConsumingProjectPreDefinedBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectPreDefinedBuildingModes";

/* --- Raw valid settings ------------------------------------------------------------------------------------------- */
import type SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid from
    "@ProjectBuilding:Common/RawConfig/SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid";
import type ConsumingProjectPreDefinedBuildingModes__Localized from
    "@ProjectBuilding/Common/RawConfig/Enumerations/ConsumingProjectPreDefinedBuildingModes__Localized";
import type RevisioningSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/RevisioningSettings__FromFile__RawValid";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import { RawObjectDataProcessor, nullToUndefined } from "@yamato-daiwa/es-extensions";


type StylesProcessingSettings__FromFile__RawValid = Readonly<{
  common?: StylesProcessingSettings__FromFile__RawValid.Common;
  linting?: StylesProcessingSettings__FromFile__RawValid.Linting;
  entryPointsGroups: Readonly<{ [groupID: string]: StylesProcessingSettings__FromFile__RawValid.EntryPointsGroup; }>;
}>;


/* eslint-disable-next-line @typescript-eslint/no-redeclare --
 * The merging of type/interface and namespace is completely valid TypeScript,
 * but @typescript-eslint community does not wish to support it.
 * https://github.com/eslint/eslint/issues/15504 */
namespace StylesProcessingSettings__FromFile__RawValid {

  /* === Types ====================================================================================================== */
  export type Common = Readonly<{ periodBetweenFileUpdatingAndRebuildingStarting__seconds?: number; }>;

  export type Linting = Readonly<{
    presetFileRelativePath?: string;
    enable?: boolean;
  }>;

  export type EntryPointsGroup =
      SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.EntryPointsGroup &
      Readonly<{
        customReferenceName?: string;
        buildingModeDependent: Readonly<{
          [projectBuildingMode in ConsumingProjectPreDefinedBuildingModes]: EntryPointsGroup.BuildingModeDependent;
        }>;
      }>;

  export namespace EntryPointsGroup {

    export type BuildingModeDependent =
        SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.EntryPointsGroup.BuildingModeDependent &
        Readonly<{ revisioning?: RevisioningSettings__FromFile__RawValid; }>;

  }


  /* === Localization =============================================================================================== */
  export type Localization = Readonly<{

    common: Readonly<{
      KEY: string;
      periodBetweenFileUpdatingAndRebuildingStarting__seconds: { KEY: string; };
    }>;

    linting: Readonly<{ KEY: string; }>;

    entryPointsGroups: Readonly<{

      KEY: string;

      customReferenceName: Readonly<{ KEY: string; }>;

      buildingModeDependent: Readonly<{
        KEY: string;
        outputTopDirectoryRelativePath: Readonly<{ KEY: string; }>;
        revisioning: Readonly<{ KEY: string; }>;
      }>;
    }>;
  }>;

  export function getLocalizedPropertiesSpecification(
    {
      stylesProcessingLocalization,
      sourceCodeProcessingSettingsGenericPropertiesLocalizedSpecification,
      consumingProjectLocalizedPreDefinedBuildingModes,
      revisioningPropertiesLocalizedSpecification,
      lintingCommonSettingsLocalizedPropertiesSpecification
    }: Readonly<{
      stylesProcessingLocalization: Localization;
      sourceCodeProcessingSettingsGenericPropertiesLocalizedSpecification:
          RawObjectDataProcessor.PropertiesSpecification;
      consumingProjectLocalizedPreDefinedBuildingModes: ConsumingProjectPreDefinedBuildingModes__Localized;
      revisioningPropertiesLocalizedSpecification: RawObjectDataProcessor.PropertiesSpecification;
      lintingCommonSettingsLocalizedPropertiesSpecification: RawObjectDataProcessor.PropertiesSpecification;
    }>
  ): RawObjectDataProcessor.PropertiesSpecification {

    return {

      [stylesProcessingLocalization.common.KEY]: {

        newName: "common",
        preValidationModifications: nullToUndefined,
        type: Object,
        required: false,

        properties: {
          [stylesProcessingLocalization.common.periodBetweenFileUpdatingAndRebuildingStarting__seconds.KEY]: {
            newName: "periodBetweenFileUpdatingAndRebuildingStarting__seconds",
            type: Number,
            required: false,
            numbersSet: RawObjectDataProcessor.NumbersSets.naturalNumber
          }
        }
      },

      [stylesProcessingLocalization.linting.KEY]: {
        newName: "linting",
        preValidationModifications: nullToUndefined,
        type: Object,
        required: false,
        properties: lintingCommonSettingsLocalizedPropertiesSpecification
      },

      [stylesProcessingLocalization.entryPointsGroups.KEY]: {

        newName: "entryPointsGroups",
        type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
        required: true,

        value: {

          type: Object,

          properties: {

            ...sourceCodeProcessingSettingsGenericPropertiesLocalizedSpecification,

            [stylesProcessingLocalization.entryPointsGroups.customReferenceName.KEY]: {
              newName: "customReferenceName",
              type: String,
              required: false,
              minimalCharactersCount: 1
            },

            [stylesProcessingLocalization.entryPointsGroups.buildingModeDependent.KEY]: {

              newName: "buildingModeDependent",
              preValidationModifications: nullToUndefined,
              type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
              required: true,
              allowedKeys: Object.values(ConsumingProjectPreDefinedBuildingModes),
              minimalEntriesCount: 1,

              keysRenamings: {
                [consumingProjectLocalizedPreDefinedBuildingModes.localDevelopment]:
                    ConsumingProjectPreDefinedBuildingModes.staticPreview,
                [consumingProjectLocalizedPreDefinedBuildingModes.localDevelopment]:
                    ConsumingProjectPreDefinedBuildingModes.localDevelopment,
                [consumingProjectLocalizedPreDefinedBuildingModes.testing]:
                    ConsumingProjectPreDefinedBuildingModes.testing,
                [consumingProjectLocalizedPreDefinedBuildingModes.staging]:
                    ConsumingProjectPreDefinedBuildingModes.staging,
                [consumingProjectLocalizedPreDefinedBuildingModes.production]:
                    ConsumingProjectPreDefinedBuildingModes.production
              },

              value: {

                type: Object,

                properties: {

                  [stylesProcessingLocalization.entryPointsGroups.buildingModeDependent.outputTopDirectoryRelativePath.KEY]: {
                    newName: "outputTopDirectoryRelativePath",
                    type: String,
                    required: true
                  },

                  [stylesProcessingLocalization.entryPointsGroups.buildingModeDependent.revisioning.KEY]: {
                    newName: "revisioning",
                    type: Object,
                    required: false,
                    properties: revisioningPropertiesLocalizedSpecification
                  }
                }
              }
            }
          }
        }
      }
    };
  }
}


export default StylesProcessingSettings__FromFile__RawValid;
