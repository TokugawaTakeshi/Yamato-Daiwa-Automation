import { RawObjectDataProcessor, nullToUndefined } from "@yamato-daiwa/es-extensions";


namespace SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid {

  /* === Types ====================================================================================================== */
  export type EntryPointsGroup = {
    readonly entryPointsSourceFilesTopDirectoryOrSingleFileRelativePath: string;
    readonly partialsRecognition?: EntryPointsGroup.EntryPointsRecognitionSettings;
    readonly buildingModeDependent: {
      readonly [projectBuildingMode: string]: EntryPointsGroup.BuildingModeDependent;
    };
  };

  export namespace EntryPointsGroup {

    export type BuildingModeDependent = {
      readonly outputBaseDirectoryRelativePath: string;
    };

    export type EntryPointsRecognitionSettings = {
      readonly excludeAllSubdirectories?: boolean;
      readonly excludeSubdirectoriesWithNames?: Array<string> | string;
      readonly excludeSubdirectoriesWithPrefixes?: Array<string> | string;
      readonly excludeFilesWithPrefixes?: Array<string> | string;
    };
  }


  /* === Localization =============================================================================================== */
  export type Localization = {
    readonly entryPointsSourceFilesTopDirectoryOrSingleFileRelativePath: { KEY: string; };
    readonly partialsRecognition: {
      readonly KEY: string;
      readonly excludeAllSubdirectories: { readonly KEY: string; };
      readonly excludeSubdirectoriesWithNames: { readonly KEY: string; };
      readonly excludeSubdirectoriesWithPrefixes: { readonly KEY: string; };
      readonly excludeFilesWithPrefixes: { readonly KEY: string; };
    };
  };

  export function getLocalizedPropertiesSpecification(
    sourceCodeProcessingSettingsGenericPropertiesLocalization: Localization
  ): RawObjectDataProcessor.PropertiesSpecification {
    return {

      [
        sourceCodeProcessingSettingsGenericPropertiesLocalization.
            entryPointsSourceFilesTopDirectoryOrSingleFileRelativePath.KEY
      ]: {
        newName: "entryPointsSourceFilesTopDirectoryOrSingleFileRelativePath",
        type: String,
        required: true,
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
      }
    };
  }
}


export default SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid;
