/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import ConsumingProjectBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";

/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import ResourceFilesGroupBuildingModeDependentOutputGenericSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/ResourceFilesGroupBuildingModeDependentOutputGenericSettings__FromFile__RawValid";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { RawObjectDataProcessor, isNonEmptyString, isNotUndefined } from "@yamato-daiwa/es-extensions";


namespace SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid {

  /* ━━━ Types ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type EntryPointsGroup =

      (
        Readonly<{
          sourceFilesTopDirectoryRelativePath: string;
          sourceFilesTopDirectoryPathAliasName?: string;
          sourceFilesSelection: EntryPointsGroup.SourceFilesSelection;
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

    export type SourceFilesSelection = Readonly<{
      onlyWithPenultimateFileNamesExtensions__withOrWithoutLeadingDots?: ReadonlyArray<string> | string;
      penultimateNamesExtensionsOfExcludedFiles__withOrWithoutLeadingDots?: ReadonlyArray<string> | string;
      mustIgnoreAllSubdirectories?: boolean;
      namesOfExcludeSubdirectories?: ReadonlyArray<string> | string;
      prefixesOfExcludedSubdirectories?: ReadonlyArray<string> | string;
      prefixesOfExcludeFiles?: ReadonlyArray<string> | string;
    }>;

    export type BuildingModeDependent = ResourceFilesGroupBuildingModeDependentOutputGenericSettings__FromFile__RawValid;

  }


  /* ━━━ Properties Specification ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export function generatePropertiesSpecification(
    {
      entryPointsGroupBuildingModeIndependentSpecificSettingsLocalizedPropertiesSpecification = {},
      entryPointsGroupBuildingModeDependentSpecificSettingsLocalizedPropertiesSpecification
    }: Readonly<{
      entryPointsGroupBuildingModeIndependentSpecificSettingsLocalizedPropertiesSpecification?:
          RawObjectDataProcessor.PropertiesSpecification;
      entryPointsGroupBuildingModeDependentSpecificSettingsLocalizedPropertiesSpecification:
          RawObjectDataProcessor.PropertiesSpecification;
    }>
  ): RawObjectDataProcessor.PropertiesSpecification {
    return {

      $entryPointsGroups: {

        newName: "entryPointsGroups",
        type: RawObjectDataProcessor.ValuesTypesIDs.associativeArray,
        isUndefinedForbidden: true,
        mustTransformNullToUndefined: true,
        areUndefinedTypeValuesForbidden: true,
        areNullTypeValuesForbidden: true,

        value: {

          type: Object,
          properties: {

            $sourceFilesTopDirectoryRelativePath: {
              newName: "sourceFilesTopDirectoryRelativePath",
              type: String,
              isUndefinedForbidden: false,
              isNullForbidden: true,
              minimalCharactersCount: 1
            },

            $sourceFilesSelection: {

              newName: "sourceFilesSelection",
              type: Object,
              isUndefinedForbidden: false,
              mustTransformNullToUndefined: true,

              properties: {

                $onlyWithPenultimateFileNamesExtensions__withOrWithoutLeadingDots: {

                  newName: "onlyWithPenultimateFileNamesExtensions__withOrWithoutLeadingDots",
                  type: RawObjectDataProcessor.ValuesTypesIDs.polymorphic,
                  isUndefinedForbidden: false,
                  isNullForbidden: true,

                  alternatives: [
                    {
                      type: Array,
                      areUndefinedElementsForbidden: true,
                      areNullElementsForbidden: true,
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

                $penultimateNamesExtensionsOfExcludedFiles__withOrWithoutLeadingDots: {

                  newName: "penultimateNamesExtensionsOfExcludedFiles__withOrWithoutLeadingDots",
                  type: RawObjectDataProcessor.ValuesTypesIDs.polymorphic,
                  isUndefinedForbidden: false,
                  mustBeUndefinedIf: {
                    predicate:
                      (
                        { rawData__currentObjectDepth: sourceFilesSelection }:
                            RawObjectDataProcessor.ConditionAssociatedWithProperty.Predicate.Parameter
                      ): boolean =>
                          isNotUndefined(sourceFilesSelection.$onlyWithPenultimateFileNamesExtensions),
                    descriptionForLogging: "`$onlyWithPenultimateFileNamesExtensions` has been specified"
                  },
                  isNullForbidden: true,

                  alternatives: [
                    {
                      type: Array,
                      areUndefinedElementsForbidden: true,
                      areNullElementsForbidden: true,
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

                $mustIgnoreAllSubdirectories: {
                  newName: "mustIgnoreAllSubdirectories",
                  type: Boolean,
                  isUndefinedForbidden: false,
                  isNullForbidden: true
                },

                $namesOfExcludeSubdirectories: {

                  newName: "namesOfExcludeSubdirectories",
                  type: RawObjectDataProcessor.ValuesTypesIDs.polymorphic,
                  isUndefinedForbidden: false,
                  mustBeUndefinedIf: {
                    predicate:
                        (
                          { rawData__currentObjectDepth: sourceFilesSelection }:
                              RawObjectDataProcessor.ConditionAssociatedWithProperty.Predicate.Parameter
                        ): boolean =>
                            sourceFilesSelection.$mustIgnoreAllSubdirectories === true,
                    descriptionForLogging: "`$mustIgnoreAllSubdirectories` has been specified with true"
                  },
                  isNullForbidden: true,

                  alternatives: [
                    {
                      type: Array,
                      areUndefinedElementsForbidden: true,
                      areNullElementsForbidden: true,
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

                $prefixesOfExcludedSubdirectories: {

                  newName: "prefixesOfExcludedSubdirectories",
                  type: RawObjectDataProcessor.ValuesTypesIDs.polymorphic,
                  isUndefinedForbidden: false,
                  mustBeUndefinedIf: {
                    predicate:
                        (
                          { rawData__currentObjectDepth: sourceFilesSelection }:
                              RawObjectDataProcessor.ConditionAssociatedWithProperty.Predicate.Parameter
                        ): boolean =>
                            sourceFilesSelection.$mustIgnoreAllSubdirectories === true,
                    descriptionForLogging: "`$mustIgnoreAllSubdirectories` has been specified with true"
                  },
                  isNullForbidden: true,

                  alternatives: [
                    {
                      type: Array,
                      areUndefinedElementsForbidden: true,
                      areNullElementsForbidden: true,
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

                $prefixesOfExcludeFiles: {

                  newName: "prefixesOfExcludeFiles",
                  type: RawObjectDataProcessor.ValuesTypesIDs.polymorphic,
                  isUndefinedForbidden: false,
                  isNullForbidden: true,

                  alternatives: [
                    {
                      type: Array,
                      areUndefinedElementsForbidden: true,
                      areNullElementsForbidden: true,
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

            $sourceFilesTopDirectoryPathAliasName: {
              newName: "sourceFilesTopDirectoryPathAliasName",
              type: String,
              isUndefinedForbidden: false,
              isNullForbidden: true,
              minimalCharactersCount: 1
            },

            $singleEntryPointSourceFileRelativePath: {
              newName: "singleEntryPointSourceFileRelativePath",
              type: String,
              undefinedForbiddenIf: {
                predicate: (
                  { rawData__currentObjectDepth: entryPointsGroup }:
                      RawObjectDataProcessor.ConditionAssociatedWithProperty.Predicate.Parameter
                ): boolean => !isNonEmptyString(entryPointsGroup.$sourceFilesTopDirectoryRelativePath),
                descriptionForLogging: "`$sourceFilesTopDirectoryRelativePath` has not been specified"
              },
              isNullForbidden: true,
              minimalCharactersCount: 1
            },

            $singleEntryPointSourceFilePathAliasName: {
              newName: "singleEntryPointSourceFilePathAliasName",
              type: String,
              isUndefinedForbidden: false,
              isNullForbidden: true,
              minimalCharactersCount: 1
            },

            ...entryPointsGroupBuildingModeIndependentSpecificSettingsLocalizedPropertiesSpecification,

            $buildingModeDependent: {

              newName: "buildingModeDependent",
              type: RawObjectDataProcessor.ValuesTypesIDs.associativeArray,
              isUndefinedForbidden: true,
              isNullForbidden: true,
              areUndefinedTypeValuesForbidden: true,
              areNullTypeValuesForbidden: true,
              minimalEntriesCount: 1,

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
