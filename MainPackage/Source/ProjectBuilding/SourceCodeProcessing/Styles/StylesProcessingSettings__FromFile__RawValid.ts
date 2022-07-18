/* --- Enumerations ------------------------------------------------------------------------------------------------- */
import ConsumingProjectPreDefinedBuildingModes from "@ProjectBuilding/Common/Defaults/ConsumingProjectPreDefinedBuildingModes";

/* --- Raw valid config --------------------------------------------------------------------------------------------- */
import type SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid from
    "@ProjectBuilding:Common/RawConfig/SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid";
import type ConsumingProjectPreDefinedBuildingModes__Localized from
    "@ProjectBuilding/Common/RawConfig/Enumerations/ConsumingProjectPreDefinedBuildingModes__Localized";
import type RevisioningSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/RevisioningSettings__FromFile__RawValid";

/* --- General auxiliaries ------------------------------------------------------------------------------------------ */
import { RawObjectDataProcessor, nullToUndefined } from "@yamato-daiwa/es-extensions";


type StylesProcessingSettings__FromFile__RawValid = {
  readonly common?: StylesProcessingSettings__FromFile__RawValid.Common;
  readonly linting?: StylesProcessingSettings__FromFile__RawValid.Linting;
  readonly entryPointsGroups: { [groupID: string]: StylesProcessingSettings__FromFile__RawValid.EntryPointsGroup; };
};


/* eslint-disable-next-line @typescript-eslint/no-redeclare --
 * The merging of type/interface and namespace is completely valid TypeScript,
 * but @typescript-eslint community does not wish to support it.
 * https://github.com/eslint/eslint/issues/15504 */
namespace StylesProcessingSettings__FromFile__RawValid {

  /* === Types ====================================================================================================== */
  export type Common = {
    readonly waitingForSubsequentFilesWillBeSavedPeriod__seconds?: number;
  };

  export type Linting = {
    readonly presetFileRelativePath?: string;
    readonly disableCompletely?: boolean;
  };

  export type EntryPointsGroup =
      SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.EntryPointsGroup &
      {
        readonly entryPointsSourceFilesTopDirectoryOrSingleFilePathAliasNameForReferencingFromHTML?: string;
        readonly linting?: EntryPointsGroup.Linting;
        readonly buildingModeDependent: {
          readonly [projectBuildingMode: string]: EntryPointsGroup.BuildingModeDependent;
        };
      };

  export namespace EntryPointsGroup {

    /* eslint-disable-next-line @typescript-eslint/no-shadow --
    * The declaring of type/interface inside namespace with same name as defined in upper scope
    * is completely valid TypeScript and not desired to be warned by @typescript-eslint. */
    export type Linting = {
      readonly disable?: boolean;
    };

    export type BuildingModeDependent =
        SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.EntryPointsGroup.BuildingModeDependent &
        {
          readonly revisioning?: RevisioningSettings__FromFile__RawValid;
        };
  }


  /* === Localization =============================================================================================== */
  export type Localization = {

    readonly common: {
      readonly KEY: string;
      readonly waitingForSubsequentFilesWillBeSavedPeriod__seconds: { KEY: string; };
    };

    readonly linting: {
      readonly KEY: string;
    };

    readonly entryPointsGroups: {

      readonly KEY: string;

      readonly entryPointsSourceFilesTopDirectoryOrSingleFilePathAliasNameForReferencingFromHTML: { KEY: string; };

      readonly linting: {
        readonly KEY: string;
        readonly disable: { KEY: string; };
      };

      readonly buildingModeDependent: {
        readonly KEY: string;
        readonly outputBaseDirectoryRelativePath: { KEY: string; };
        readonly revisioning: { KEY: string; };
      };
    };
  };

  export function getLocalizedPropertiesSpecification(
    {
      stylesProcessingLocalization,
      sourceCodeProcessingSettingsGenericPropertiesLocalizedSpecification,
      consumingProjectLocalizedPreDefinedBuildingModes,
      revisioningPropertiesLocalizedSpecification,
      lintingCommonSettingsLocalizedPropertiesSpecification
    }: {
      readonly stylesProcessingLocalization: Localization;
      readonly sourceCodeProcessingSettingsGenericPropertiesLocalizedSpecification:
          RawObjectDataProcessor.PropertiesSpecification;
      readonly consumingProjectLocalizedPreDefinedBuildingModes: ConsumingProjectPreDefinedBuildingModes__Localized;
      readonly revisioningPropertiesLocalizedSpecification: RawObjectDataProcessor.PropertiesSpecification;
      readonly lintingCommonSettingsLocalizedPropertiesSpecification: RawObjectDataProcessor.PropertiesSpecification;
    }
  ): RawObjectDataProcessor.PropertiesSpecification {

    return {

      [stylesProcessingLocalization.common.KEY]: {

        newName: "common",
        preValidationModifications: nullToUndefined,
        type: Object,
        required: false,

        properties: {
          [stylesProcessingLocalization.common.waitingForSubsequentFilesWillBeSavedPeriod__seconds.KEY]: {
            newName: "waitingForSubsequentFilesWillBeSavedPeriod__seconds",
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

            [
              stylesProcessingLocalization.entryPointsGroups.
                  entryPointsSourceFilesTopDirectoryOrSingleFilePathAliasNameForReferencingFromHTML.KEY
            ]: {
              newName: "entryPointsSourceFilesTopDirectoryOrSingleFilePathAliasNameForReferencingFromHTML",
              type: String,
              required: false,
              minimalCharactersCount: 1
            },

            [stylesProcessingLocalization.entryPointsGroups.linting.KEY]: {
              newName: "linting",
              preValidationModifications: nullToUndefined,
              type: Object,
              required: false,
              properties: {
                [stylesProcessingLocalization.entryPointsGroups.linting.disable.KEY]: {
                  newName: "disable",
                  type: Boolean,
                  required: false
                }
              }
            },

            [stylesProcessingLocalization.entryPointsGroups.buildingModeDependent.KEY]: {

              newName: "buildingModeDependent",
              preValidationModifications: nullToUndefined,
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

                  [stylesProcessingLocalization.entryPointsGroups.buildingModeDependent.outputBaseDirectoryRelativePath.KEY]: {
                    newName: "outputBaseDirectoryRelativePath",
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
