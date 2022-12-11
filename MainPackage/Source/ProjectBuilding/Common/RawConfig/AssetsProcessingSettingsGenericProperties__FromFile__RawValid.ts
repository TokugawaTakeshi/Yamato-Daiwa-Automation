/* --- Enumerations ----------------------------------------------------------------------------------------------- */
import ConsumingProjectPreDefinedBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectPreDefinedBuildingModes";

/* --- Raw valid config --------------------------------------------------------------------------------------------- */
import type ConsumingProjectPreDefinedBuildingModes__Localized from
    "@ProjectBuilding/Common/RawConfig/Enumerations/ConsumingProjectPreDefinedBuildingModes__Localized";
import type RevisioningSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/RevisioningSettings__FromFile__RawValid";

/* --- General auxiliaries ------------------------------------------------------------------------------------------ */
import { RawObjectDataProcessor, nullToUndefined } from "@yamato-daiwa/es-extensions";


namespace AssetsProcessingSettingsGenericProperties__FromFile__RawValid {

  /* === Types ====================================================================================================== */
  export type AssetsGroup = Readonly<{
    sourceFilesTopDirectoryRelativePath: string;
    sourceFilesTopDirectoryPathAliasForReferencingFromHTML?: string;
    buildingModeDependent: Readonly<{
      [projectBuildingMode: string]: AssetsGroup.BuildingModeDependent | undefined;
    }>;
  }>;

  export namespace AssetsGroup {
    export type BuildingModeDependent = Readonly<{
      outputTopDirectoryRelativePath: string;
      revisioning?: RevisioningSettings__FromFile__RawValid;
      outputPathTransformations?: Readonly<{
        segmentsWhichMustBeRemoved?: Array<string>;
        segmentsWhichLastDuplicatesMustBeRemoved?: Array<string>;
      }>;
    }>;
  }


  /* === Localization =============================================================================================== */
  export type Localization = {
    assetsGroups: Readonly<{
      KEY: string;
      sourceFilesTopDirectoryRelativePath: Readonly<{ KEY: string; }>;
      sourceFilesTopDirectoryPathAliasForReferencingFromHTML: Readonly<{ KEY: string; }>;
      buildingModeDependent: Readonly<{
        KEY: string;
        outputTopDirectoryRelativePath: Readonly<{ KEY: string; }>;
        revisioning: Readonly<{ KEY: string; }>;
        outputPathTransformations: Readonly<{
          KEY: string;
          segmentsWhichMustBeRemoved: Readonly<{ KEY: string; }>;
          segmentsWhichLastDuplicatesMustBeRemoved: Readonly<{ KEY: string; }>;
        }>;
      }>;
    }>;
  };

  export function getLocalizedSpecification(
    {
      assetsProcessingSettingsGenericPropertiesLocalization,
      revisioningPropertiesLocalizedSpecification,
      consumingProjectLocalizedPreDefinedBuildingModes
    }: Readonly<{
      assetsProcessingSettingsGenericPropertiesLocalization: Localization;
      revisioningPropertiesLocalizedSpecification: RawObjectDataProcessor.PropertiesSpecification;
      consumingProjectLocalizedPreDefinedBuildingModes: ConsumingProjectPreDefinedBuildingModes__Localized;
    }>
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
              minimalEntriesCount: 1,

              keysRenamings: {
                [consumingProjectLocalizedPreDefinedBuildingModes.staticPreview]:
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

                  [
                    assetsProcessingSettingsGenericPropertiesLocalization.assetsGroups.
                        buildingModeDependent.outputTopDirectoryRelativePath.KEY
                  ]: {
                    newName: "outputTopDirectoryRelativePath",
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
