/* --- Enumerations ----------------------------------------------------------------------------------------------- */
import ConsumingProjectPreDefinedBuildingModes from "@ProjectBuilding/Common/Defaults/ConsumingProjectPreDefinedBuildingModes";

/* --- Raw valid config --------------------------------------------------------------------------------------------- */
import type ConsumingProjectPreDefinedBuildingModes__Localized from
    "@ProjectBuilding/Common/RawConfig/Enumerations/ConsumingProjectPreDefinedBuildingModes__Localized";
import type RevisioningSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/RevisioningSettings__FromFile__RawValid";

/* --- General auxiliaries ------------------------------------------------------------------------------------------ */
import { RawObjectDataProcessor, nullToUndefined } from "@yamato-daiwa/es-extensions";


namespace AssetsProcessingSettingsGenericProperties__FromFile__RawValid {

  /* === Types ====================================================================================================== */
  export type AssetsGroup = {
    readonly sourceFilesTopDirectoryRelativePath: string;
    readonly sourceFilesTopDirectoryPathAliasForReferencingFromHTML?: string;
    readonly buildingModeDependent: {
      readonly [projectBuildingMode: string]: AssetsGroup.BuildingModeDependent | undefined;
    };
  };

  export namespace AssetsGroup {
    export type BuildingModeDependent = {
      readonly outputBaseDirectoryRelativePath: string;
      readonly revisioning?: RevisioningSettings__FromFile__RawValid;
      readonly outputPathTransformations?: {
        readonly segmentsWhichMustBeRemoved?: Array<string>;
        readonly segmentsWhichLastDuplicatesMustBeRemoved?: Array<string>;
      };
    };
  }


  /* === Localization =============================================================================================== */
  export type Localization = {
    readonly assetsGroups: {
      readonly KEY: string;
      readonly sourceFilesTopDirectoryRelativePath: { KEY: string; };
      readonly sourceFilesTopDirectoryPathAliasForReferencingFromHTML: { KEY: string; };
      readonly buildingModeDependent: {
        readonly KEY: string;
        readonly outputBaseDirectoryRelativePath: { KEY: string; };
        readonly revisioning: { KEY: string; };
        readonly outputPathTransformations: {
          readonly KEY: string;
          readonly segmentsWhichMustBeRemoved: { KEY: string; };
          readonly segmentsWhichLastDuplicatesMustBeRemoved: { KEY: string; };
        };
      };
    };
  };

  export function getLocalizedSpecification(
    {
      assetsProcessingSettingsGenericPropertiesLocalization,
      revisioningPropertiesLocalizedSpecification,
      consumingProjectLocalizedPreDefinedBuildingModes
    }: {
      assetsProcessingSettingsGenericPropertiesLocalization: Localization;
      revisioningPropertiesLocalizedSpecification: RawObjectDataProcessor.PropertiesSpecification;
      consumingProjectLocalizedPreDefinedBuildingModes: ConsumingProjectPreDefinedBuildingModes__Localized;
    }
  ): RawObjectDataProcessor.PropertiesSpecification {

    return {

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

            [
              assetsProcessingSettingsGenericPropertiesLocalization.assetsGroups.
                  sourceFilesTopDirectoryPathAliasForReferencingFromHTML.KEY
            ]: {
              newName: "sourceFilesTopDirectoryPathAliasForReferencingFromHTML",
              type: String,
              required: false,
              minimalCharactersCount: 1
            },

            [assetsProcessingSettingsGenericPropertiesLocalization.assetsGroups.buildingModeDependent.KEY]: {

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

                  [
                    assetsProcessingSettingsGenericPropertiesLocalization.assetsGroups.
                        buildingModeDependent.outputBaseDirectoryRelativePath.KEY
                  ]: {
                    newName: "outputBaseDirectoryRelativePath",
                    type: String,
                    required: true
                  },

                  [assetsProcessingSettingsGenericPropertiesLocalization.assetsGroups.buildingModeDependent.revisioning.KEY]: {
                    newName: "revisioning",
                    type: Object,
                    required: false,
                    preValidationModifications: nullToUndefined,
                    properties: revisioningPropertiesLocalizedSpecification
                  },

                  [
                    assetsProcessingSettingsGenericPropertiesLocalization.assetsGroups.
                        buildingModeDependent.outputPathTransformations.KEY
                  ]: {

                    newName: "outputPathTransformations",
                    type: Object,
                    required: false,
                    properties: {

                      [
                        assetsProcessingSettingsGenericPropertiesLocalization.assetsGroups.
                            buildingModeDependent.outputPathTransformations.segmentsWhichMustBeRemoved.KEY
                      ]: {
                        newName: "segmentsWhichMustBeRemoved",
                        type: Array,
                        required: false,
                        element: {
                          type: String,
                          minimalCharactersCount: 1
                        }
                      },

                      [
                        assetsProcessingSettingsGenericPropertiesLocalization.assetsGroups.
                            buildingModeDependent.outputPathTransformations.segmentsWhichLastDuplicatesMustBeRemoved.KEY
                      ]: {
                        newName: "segmentsWhichLastDuplicatesMustBeRemoved",
                        type: Array,
                        required: false,
                        element: {
                          type: String,
                          minimalCharactersCount: 1
                        }
                      }
                    }
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


export default AssetsProcessingSettingsGenericProperties__FromFile__RawValid;
