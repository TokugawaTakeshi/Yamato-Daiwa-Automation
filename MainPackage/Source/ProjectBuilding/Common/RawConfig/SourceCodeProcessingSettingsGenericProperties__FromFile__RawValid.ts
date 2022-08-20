/* --- General auxiliaries ------------------------------------------------------------------------------------------ */
import type ConsumingProjectPreDefinedBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectPreDefinedBuildingModes";

/* --- General auxiliaries ------------------------------------------------------------------------------------------ */
import {
  RawObjectDataProcessor,
  nullToUndefined,
  isArbitraryObject,
  isNonEmptyString
} from "@yamato-daiwa/es-extensions";


namespace SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid {

  /* === Types ====================================================================================================== */
  export type EntryPointsGroup =
      (
        Readonly<{
          topDirectoryRelativePath: string;
          partialsRecognition?: EntryPointsGroup.EntryPointsRecognitionSettings;
        }> |
        Readonly<{ singleEntryPointRelativePath: string; }>
      ) &
      Readonly<{
        buildingModeDependent: Readonly<{
          [projectBuildingMode in ConsumingProjectPreDefinedBuildingModes]: EntryPointsGroup.BuildingModeDependent;
        }>;
      }>;


  export namespace EntryPointsGroup {

    export type BuildingModeDependent = Readonly<{ outputTopDirectoryRelativePath: string; }>;

    export type EntryPointsRecognitionSettings = Readonly<{
      excludeAllSubdirectories?: boolean;
      excludeSubdirectoriesWithNames?: Array<string> | string;
      excludeSubdirectoriesWithPrefixes?: Array<string> | string;
      excludeFilesWithPrefixes?: Array<string> | string;
    }>;
  }


  /* === Localization =============================================================================================== */
  export type Localization = Readonly<{
    topDirectoryRelativePath: Readonly<{ KEY: string; }>;
    singleEntryPointRelativePath: Readonly<{ KEY: string; REQUIREMENT_CONDITION_DESCRIPTION: string; }>;
    partialsRecognition: Readonly<{
      KEY: string;
      excludeAllSubdirectories: Readonly<{ KEY: string; }>;
      excludeSubdirectoriesWithNames: Readonly<{ KEY: string; }>;
      excludeSubdirectoriesWithPrefixes: Readonly<{ KEY: string; }>;
      excludeFilesWithPrefixes: Readonly<{ KEY: string; }>;
    }>;
  }>;

  export function getLocalizedPropertiesSpecification(
    sourceCodeProcessingSettingsGenericPropertiesLocalization: Localization
  ): RawObjectDataProcessor.PropertiesSpecification {
    return {

      [sourceCodeProcessingSettingsGenericPropertiesLocalization.topDirectoryRelativePath.KEY]: {
        newName: "topDirectoryRelativePath",
        type: String,
        required: false,
        minimalCharactersCount: 1
      },

      [sourceCodeProcessingSettingsGenericPropertiesLocalization.partialsRecognition.KEY]: {
        newName: "partialsRecognition",
        preValidationModifications: nullToUndefined,
        type: Object,
        required: false,
        properties: {

          [sourceCodeProcessingSettingsGenericPropertiesLocalization.partialsRecognition.excludeAllSubdirectories.KEY]: {
            newName: "excludeAllSubdirectories",
            type: Boolean,
            required: false
          },

          [sourceCodeProcessingSettingsGenericPropertiesLocalization.partialsRecognition.excludeSubdirectoriesWithNames.KEY]: {

            newName: "excludeSubdirectoriesWithNames",
            type: RawObjectDataProcessor.ValuesTypesIDs.oneOf,
            required: false,

            alternatives: [
              {
                type: Array,
                minimalElementsCount: 1,
                element: {
                  type: String,
                  minimalCharactersCount: 1
                }
              },
              {
                type: String,
                minimalCharactersCount: 1
              }
            ]
          },

          [
            sourceCodeProcessingSettingsGenericPropertiesLocalization.
                partialsRecognition.excludeSubdirectoriesWithPrefixes.KEY
          ]: {

            newName: "excludeSubdirectoriesWithPrefixes",
            type: RawObjectDataProcessor.ValuesTypesIDs.oneOf,
            required: false,

            alternatives: [
              {
                type: Array,
                minimalElementsCount: 1,
                element: {
                  type: String,
                  minimalCharactersCount: 1
                }
              },
              {
                type: String,
                minimalCharactersCount: 1
              }
            ]
          },

          [sourceCodeProcessingSettingsGenericPropertiesLocalization.partialsRecognition.excludeFilesWithPrefixes.KEY]: {

            newName: "excludeFilesWithPrefixes",
            type: RawObjectDataProcessor.ValuesTypesIDs.oneOf,
            required: false,

            alternatives: [
              {
                type: Array,
                minimalElementsCount: 1,
                element: {
                  type: String
                }
              },
              {
                type: String,
                minimalElementsCount: 1
              }
            ]
          }
        }
      },

      [sourceCodeProcessingSettingsGenericPropertiesLocalization.singleEntryPointRelativePath.KEY]: {
        newName: "singleEntryPointRelativePath",
        type: String,
        requiredIf: {
          predicate(rawObjectOfCurrentDepthLevel: unknown): boolean {

            if (!isArbitraryObject(rawObjectOfCurrentDepthLevel)) {
              return false;
            }


            return !isNonEmptyString(rawObjectOfCurrentDepthLevel.topDirectoryRelativePath);
          },
          descriptionForLogging: sourceCodeProcessingSettingsGenericPropertiesLocalization.singleEntryPointRelativePath.
              REQUIREMENT_CONDITION_DESCRIPTION
        },
        minimalCharactersCount: 1
      }
    };
  }
}


export default SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid;
