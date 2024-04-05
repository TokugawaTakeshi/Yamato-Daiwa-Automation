/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import ConsumingProjectBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";

/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import type ResourceFilesGroupBuildingModeDependentOutputGenericSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/ResourceFilesGroupBuildingModeDependentOutputGenericSettings__FromFile__RawValid";
import type ConsumingProjectPreDefinedBuildingModes__Localized
  from "@ProjectBuilding/Common/RawConfig/Enumerations/ConsumingProjectPreDefinedBuildingModes__Localized";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { RawObjectDataProcessor, nullToUndefined, isNonEmptyString } from "@yamato-daiwa/es-extensions";
import type { ArbitraryObject } from "@yamato-daiwa/es-extensions";


namespace SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid {

  /* ━━━ Types ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type EntryPointsGroup =

      (
        Readonly<{
          sourceFilesTopDirectoryRelativePath: string;
          sourceFilesTopDirectoryPathAliasName?: string;
          partialsRecognition?: EntryPointsGroup.EntryPointsRecognitionSettings;
        }> |
        Readonly<{
          singleEntryPointSourceFileRelativePath: string;
          singleEntryPointSourceFilePathAliasName?: string;
        }>
      ) &

      Readonly<{
        buildingModeDependent: Readonly<{
          [projectBuildingMode in ConsumingProjectBuildingModes]: EntryPointsGroup.BuildingModeDependent;
        }>;
      }>;

  export namespace EntryPointsGroup {

    export type EntryPointsRecognitionSettings = Readonly<{
      excludeAllSubdirectories?: boolean;
      excludeSubdirectoriesWithNames?: Array<string> | string;
      excludeSubdirectoriesWithPrefixes?: Array<string> | string;
      excludeFilesWithPrefixes?: Array<string> | string;
    }>;

    export type BuildingModeDependent = ResourceFilesGroupBuildingModeDependentOutputGenericSettings__FromFile__RawValid;

  }

  /* ━━━ Localization ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type Localization = Readonly<{

    entryPointsGroups: Readonly<{

      KEY: string;

      sourceFilesTopDirectoryRelativePath: Readonly<{ KEY: string; }>;
      sourceFilesTopDirectoryPathAliasName: Readonly<{ KEY: string; }>;
      singleEntryPointSourceFilePathAliasName: Readonly<{ KEY: string; }>;

      partialsRecognition: Readonly<{
        KEY: string;
        excludeAllSubdirectories: Readonly<{ KEY: string; }>;
        excludeSubdirectoriesWithNames: Readonly<{ KEY: string; }>;
        excludeSubdirectoriesWithPrefixes: Readonly<{ KEY: string; }>;
        excludeFilesWithPrefixes: Readonly<{ KEY: string; }>;
      }>;

      singleEntryPointSourceFileRelativePath: Readonly<{ KEY: string; REQUIREMENT_CONDITION_DESCRIPTION: string; }>;

      buildingModeDependent:
          ResourceFilesGroupBuildingModeDependentOutputGenericSettings__FromFile__RawValid.Localization &
          Readonly<{
            revisioning: Readonly<{ KEY: string; }>;
          }>;

    }>;

  }>;

  export function getLocalizedPropertiesSpecification(
    {
      sourceCodeProcessingSettingsGenericPropertiesLocalization,
      localizedConsumingProjectLocalizedPreDefinedBuildingModes,
      entryPointsGroupBuildingModeIndependentSpecificSettingsLocalizedPropertiesSpecification = {},
      entryPointsGroupBuildingModeDependentOutputGenericSettingsLocalizedPropertiesSpecification,
      entryPointsGroupBuildingModeDependentSpecificSettingsLocalizedPropertiesSpecification = {}
    }: Readonly<{
      sourceCodeProcessingSettingsGenericPropertiesLocalization: Localization;
      localizedConsumingProjectLocalizedPreDefinedBuildingModes: ConsumingProjectPreDefinedBuildingModes__Localized;
      entryPointsGroupBuildingModeIndependentSpecificSettingsLocalizedPropertiesSpecification?:
          RawObjectDataProcessor.PropertiesSpecification;
      entryPointsGroupBuildingModeDependentOutputGenericSettingsLocalizedPropertiesSpecification:
          RawObjectDataProcessor.PropertiesSpecification;
      entryPointsGroupBuildingModeDependentSpecificSettingsLocalizedPropertiesSpecification:
          RawObjectDataProcessor.PropertiesSpecification;
    }>
  ): RawObjectDataProcessor.PropertiesSpecification {
    return {

      [sourceCodeProcessingSettingsGenericPropertiesLocalization.entryPointsGroups.KEY]: {

        newName: "entryPointsGroups",
        preValidationModifications: nullToUndefined,
        type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
        required: true,

        value: {

          type: Object,
          properties: {

            [
              sourceCodeProcessingSettingsGenericPropertiesLocalization.entryPointsGroups.
                  sourceFilesTopDirectoryRelativePath.KEY
            ]: {
              newName: "sourceFilesTopDirectoryRelativePath",
              type: String,
              required: false,
              minimalCharactersCount: 1
            },

            [
              sourceCodeProcessingSettingsGenericPropertiesLocalization.entryPointsGroups.
                sourceFilesTopDirectoryPathAliasName.KEY
            ]: {
              newName: "sourceFilesTopDirectoryPathAliasName",
              type: String,
              required: false,
              minimalCharactersCount: 1
            },

            [sourceCodeProcessingSettingsGenericPropertiesLocalization.entryPointsGroups.partialsRecognition.KEY]: {

              newName: "partialsRecognition",
              preValidationModifications: nullToUndefined,
              type: Object,
              required: false,

              properties: {

                [
                  sourceCodeProcessingSettingsGenericPropertiesLocalization.entryPointsGroups.
                      partialsRecognition.excludeAllSubdirectories.KEY
                ]: {
                  newName: "excludeAllSubdirectories",
                  type: Boolean,
                  required: false
                },

                [
                  sourceCodeProcessingSettingsGenericPropertiesLocalization.entryPointsGroups.
                      partialsRecognition.excludeSubdirectoriesWithNames.KEY
                ]: {

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
                  sourceCodeProcessingSettingsGenericPropertiesLocalization.entryPointsGroups.
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

                [
                  sourceCodeProcessingSettingsGenericPropertiesLocalization.entryPointsGroups.
                      partialsRecognition.excludeFilesWithPrefixes.KEY
                ]: {

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
                      minimalCharactersCount: 1
                    }
                  ]

                }

              }

            },

            [
              sourceCodeProcessingSettingsGenericPropertiesLocalization.entryPointsGroups.
                  singleEntryPointSourceFileRelativePath.KEY
            ]: {
              newName: "singleEntryPointSourceFileRelativePath",
              type: String,
              requiredIf: {
                predicate: (rawObjectOfCurrentDepthLevel: ArbitraryObject): boolean =>
                    !isNonEmptyString(rawObjectOfCurrentDepthLevel.sourceFilesTopDirectoryRelativePath),
                descriptionForLogging: sourceCodeProcessingSettingsGenericPropertiesLocalization.entryPointsGroups.
                    singleEntryPointSourceFileRelativePath.REQUIREMENT_CONDITION_DESCRIPTION
              },
              minimalCharactersCount: 1
            },

            [
              sourceCodeProcessingSettingsGenericPropertiesLocalization.entryPointsGroups.
                  singleEntryPointSourceFilePathAliasName.KEY
            ]: {
              newName: "singleEntryPointSourceFilePathAliasName",
              type: String,
              required: false,
              minimalCharactersCount: 1
            },

            ...entryPointsGroupBuildingModeIndependentSpecificSettingsLocalizedPropertiesSpecification,

            [sourceCodeProcessingSettingsGenericPropertiesLocalization.entryPointsGroups.buildingModeDependent.KEY]: {

              newName: "buildingModeDependent",
              type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
              required: true,
              minimalEntriesCount: 1,

              keysRenamings: {
                [localizedConsumingProjectLocalizedPreDefinedBuildingModes.staticPreview]:
                    ConsumingProjectBuildingModes.staticPreview,
                [localizedConsumingProjectLocalizedPreDefinedBuildingModes.localDevelopment]:
                    ConsumingProjectBuildingModes.localDevelopment,
                [localizedConsumingProjectLocalizedPreDefinedBuildingModes.testing]:
                    ConsumingProjectBuildingModes.testing,
                [localizedConsumingProjectLocalizedPreDefinedBuildingModes.staging]:
                    ConsumingProjectBuildingModes.staging,
                [localizedConsumingProjectLocalizedPreDefinedBuildingModes.production]:
                    ConsumingProjectBuildingModes.production
              },

              value: {
                type: Object,
                properties: {
                  ...entryPointsGroupBuildingModeDependentOutputGenericSettingsLocalizedPropertiesSpecification,
                  ...entryPointsGroupBuildingModeDependentSpecificSettingsLocalizedPropertiesSpecification
                }
              }

            }

          }

        }

      }

    };

  }

}


export default SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid;
