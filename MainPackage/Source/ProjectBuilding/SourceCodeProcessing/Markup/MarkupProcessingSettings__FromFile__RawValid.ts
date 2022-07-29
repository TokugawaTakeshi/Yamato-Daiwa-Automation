/* --- Enumerations ------------------------------------------------------------------------------------------------- */
import ConsumingProjectPreDefinedBuildingModes from
    "@ProjectBuilding/Common/Defaults/ConsumingProjectPreDefinedBuildingModes";

/* --- Restrictions ------------------------------------------------------------------------------------------------- */
import MarkupProcessingRestrictions from "@MarkupProcessing/MarkupProcessingRestrictions";

/* --- Raw valid settings ------------------------------------------------------------------------------------------- */
import type SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid from
    "@ProjectBuilding:Common/RawConfig/SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid";
import type ConsumingProjectPreDefinedBuildingModes__Localized from
    "@ProjectBuilding/Common/RawConfig/Enumerations/ConsumingProjectPreDefinedBuildingModes__Localized";

/* --- General auxiliaries ------------------------------------------------------------------------------------------ */
import { RawObjectDataProcessor, nullToUndefined } from "@yamato-daiwa/es-extensions";


type MarkupProcessingSettings__FromFile__RawValid = Readonly<{
  common?: MarkupProcessingSettings__FromFile__RawValid.Common;
  linting?: MarkupProcessingSettings__FromFile__RawValid.Linting;
  entryPointsGroups: { [groupID: string]: MarkupProcessingSettings__FromFile__RawValid.EntryPointsGroup; };
}>;


/* eslint-disable-next-line @typescript-eslint/no-redeclare --
 * The merging of type/interface and namespace is completely valid TypeScript,
 * but @typescript-eslint community does not wish to support it.
 * https://github.com/eslint/eslint/issues/15504 */
namespace MarkupProcessingSettings__FromFile__RawValid {

  /* === Types ====================================================================================================== */
  export type Common = Readonly<{ waitingForSubsequentFilesWillBeSavedPeriod__seconds?: number; }>;

  export type Linting = Readonly<{
    presetFileRelativePath?: string;
    disableCompletely?: boolean;
  }>;

  export type EntryPointsGroup =
      SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.EntryPointsGroup &
      Readonly<{
        linting?: EntryPointsGroup.Linting;
        HTML_Validation?: EntryPointsGroup.HTML_Validation;
        accessibilityInspection?: EntryPointsGroup.AccessibilityInspection;
        buildingModeDependent: { [projectBuildingMode: string]: EntryPointsGroup.BuildingModeDependent; };
      }>;

  export namespace EntryPointsGroup {

    /* eslint-disable-next-line @typescript-eslint/no-shadow --
     * The declaring of type/interface inside namespace with same name as defined in upper scope
     * is completely valid TypeScript and not desired to be warned by @typescript-eslint. */
    export type Linting = Readonly<{ disable?: boolean; }>;

    export type BuildingModeDependent = SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.
        EntryPointsGroup.BuildingModeDependent;

    export type HTML_Validation = Readonly<{ disable?: boolean; }>;

    export type AccessibilityInspection = Readonly<{
      disable?: boolean;
      standard?: MarkupProcessingRestrictions.SupportedAccessibilityStandards;
    }>;
  }

  /* === Localization =============================================================================================== */
  export type Localization = Readonly<{

    common: Readonly<{
      KEY: string;
      waitingForSubsequentFilesWillBeSavedPeriod__seconds: Readonly<{ KEY: string; }>;
    }>;

    linting: Readonly<{ KEY: string; }>;

    entryPointsGroups: Readonly<{

      KEY: string;

      linting: Readonly<{
        KEY: string;
        disable: Readonly<{ KEY: string; }>;
      }>;

      HTML_Validation: Readonly<{
        KEY: string;
        disable: Readonly<{ KEY: string; }>;
      }>;

      accessibilityInspection: Readonly<{
        KEY: string;
        standard: Readonly<{ KEY: string; }>;
        disable: Readonly<{ KEY: string; }>;
      }>;

      buildingModeDependent: Readonly<{
        KEY: string;
        outputBaseDirectoryRelativePath: Readonly<{ KEY: string; }>;
      }>;
    }>;
  }>;


  export function getLocalizedPropertiesSpecification(
    {
      markupProcessingLocalization,
      sourceCodeProcessingSettingsGenericPropertiesLocalizedSpecification,
      consumingProjectLocalizedPreDefinedBuildingModes,
      lintingCommonSettingsLocalizedPropertiesSpecification
    }: Readonly<{
      markupProcessingLocalization: Localization;
      sourceCodeProcessingSettingsGenericPropertiesLocalizedSpecification: RawObjectDataProcessor.PropertiesSpecification;
      consumingProjectLocalizedPreDefinedBuildingModes: ConsumingProjectPreDefinedBuildingModes__Localized;
      lintingCommonSettingsLocalizedPropertiesSpecification: RawObjectDataProcessor.PropertiesSpecification;
    }>
  ): RawObjectDataProcessor.PropertiesSpecification {

    return {

      [markupProcessingLocalization.common.KEY]: {

        newName: "common",
        preValidationModifications: nullToUndefined,
        type: Object,
        required: false,

        properties: {
          [markupProcessingLocalization.common.waitingForSubsequentFilesWillBeSavedPeriod__seconds.KEY]: {
            newName: "waitingForSubsequentFilesWillBeSavedPeriod__seconds",
            type: Number,
            required: false,
            numbersSet: RawObjectDataProcessor.NumbersSets.naturalNumber
          }
        }
      },

      [markupProcessingLocalization.linting.KEY]: {
        newName: "linting",
        preValidationModifications: nullToUndefined,
        type: Object,
        required: false,
        properties: lintingCommonSettingsLocalizedPropertiesSpecification
      },

      [markupProcessingLocalization.entryPointsGroups.KEY]: {

        newName: "entryPointsGroups",
        type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
        required: true,

        value: {

          type: Object,

          properties: {

            ...sourceCodeProcessingSettingsGenericPropertiesLocalizedSpecification,

            [markupProcessingLocalization.entryPointsGroups.linting.KEY]: {
              newName: "linting",
              preValidationModifications: nullToUndefined,
              type: Object,
              required: false,
              properties: {
                [markupProcessingLocalization.entryPointsGroups.linting.disable.KEY]: {
                  newName: "disable",
                  type: Boolean,
                  required: false
                }
              }
            },

            [markupProcessingLocalization.entryPointsGroups.HTML_Validation.KEY]: {

              newName: "HTML_Validation",
              preValidationModifications: nullToUndefined,
              type: Object,
              required: false,
              properties: {
                [markupProcessingLocalization.entryPointsGroups.HTML_Validation.disable.KEY]: {
                  newName: "disable",
                  type: Boolean,
                  required: false
                }
              }
            },

            [markupProcessingLocalization.entryPointsGroups.accessibilityInspection.KEY]: {

              newName: "accessibilityInspection",
              preValidationModifications: nullToUndefined,
              type: Object,
              required: false,

              properties: {

                [markupProcessingLocalization.entryPointsGroups.accessibilityInspection.standard.KEY]: {
                  newName: "standard",
                  type: String,
                  required: false,
                  allowedAlternatives: Object.values(MarkupProcessingRestrictions.SupportedAccessibilityStandards)
                },

                [markupProcessingLocalization.entryPointsGroups.accessibilityInspection.disable.KEY]: {
                  newName: "disable",
                  type: Boolean,
                  required: false
                }
              }
            },

            [markupProcessingLocalization.entryPointsGroups.buildingModeDependent.KEY]: {

              newName: "buildingModeDependent",
              type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
              required: true,

              oneOfKeysIsRequired: [
                consumingProjectLocalizedPreDefinedBuildingModes.development,
                consumingProjectLocalizedPreDefinedBuildingModes.production
              ],

              keysRenamings: {
                [consumingProjectLocalizedPreDefinedBuildingModes.development]:
                    ConsumingProjectPreDefinedBuildingModes.development,
                [consumingProjectLocalizedPreDefinedBuildingModes.testing]:
                    ConsumingProjectPreDefinedBuildingModes.testing,
                [consumingProjectLocalizedPreDefinedBuildingModes.production]:
                    ConsumingProjectPreDefinedBuildingModes.production
              },

              value: {

                type: Object,

                properties: {
                  [markupProcessingLocalization.entryPointsGroups.buildingModeDependent.outputBaseDirectoryRelativePath.KEY]: {
                    newName: "outputBaseDirectoryRelativePath",
                    type: String,
                    required: true
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


export default MarkupProcessingSettings__FromFile__RawValid;
