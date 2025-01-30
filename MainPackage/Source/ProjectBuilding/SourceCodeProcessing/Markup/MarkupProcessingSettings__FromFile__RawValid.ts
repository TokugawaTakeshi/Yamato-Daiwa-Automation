/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import MarkupProcessingRestrictions from "@MarkupProcessing/MarkupProcessingRestrictions";
import ConsumingProjectBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";

/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid from
    "@ProjectBuilding:Common/RawConfig/SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid";
import LintingSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/LintingSettings__FromFile__RawValid";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import {
  RawObjectDataProcessor,
  LineSeparators,
  splitString,
  getObjectPropertySafely,
  isNotUndefined
} from "@yamato-daiwa/es-extensions";


type MarkupProcessingSettings__FromFile__RawValid = Readonly<{
  common?: MarkupProcessingSettings__FromFile__RawValid.Common;
  staticPreview?: MarkupProcessingSettings__FromFile__RawValid.StaticPreview;
  linting?: MarkupProcessingSettings__FromFile__RawValid.Linting;
  importingFromTypeScript?: MarkupProcessingSettings__FromFile__RawValid.ImportingFromTypeScript;
  importingFromJavaScript?: MarkupProcessingSettings__FromFile__RawValid.ImportingFromJavaScript;
  routing?: MarkupProcessingSettings__FromFile__RawValid.Routing;
  entryPointsGroups: Readonly<{ [groupID: string]: MarkupProcessingSettings__FromFile__RawValid.EntryPointsGroup; }>;
  logging?: MarkupProcessingSettings__FromFile__RawValid.Logging;
}>;


namespace MarkupProcessingSettings__FromFile__RawValid {

  /* ━━━ Reusables ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export namespace Reusables {

    /* ─── Localization ───────────────────────────────────────────────────────────────────────────────────────────── */
    export type Localization = Readonly<{
      stringResourcesFileRelativePath?: string;
      localizedStringResourcesConstantName?: string;
      localeConstantName?: string;
      nameOfConstantForInterpolationToLangHTML_Attribute?: string;
      locales: Readonly<{ [ localeKey: string ]: Localization.LocaleData; }>;
    }>;

    export namespace Localization {

      export type LocaleData = Readonly<{
        outputFileInterimNameExtensionWithoutDot: string;
        localeConstantValue?: string;
        keyInLocalizedStringResourcesObject?: string;
        valueOfConstantForInterpolationToLangHTML_Attribute?: string;
      }>;

    }

  }


  /* ━━━ Common ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type Common = Readonly<{
    localization?: Common.Localization;
    buildingModeDependent?: Readonly<{ [projectBuildingMode: string]: Common.BuildingModeDependent | undefined; }>;
  }>;

  export namespace Common {

    export type Localization =
        Reusables.Localization &
        Readonly<{
          excludedFilesPathsRelativeRelativeToProjectRootDirectory: ReadonlyArray<string>;
        }>;

    export type BuildingModeDependent = Readonly<{
      secondsBetweenFileUpdatingAndStartingOfRebuilding?: number;
      mustResolveResourcesPointersToRelativePaths?: boolean;
    }>;

  }


  /* ━━━ Static Preview ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type StaticPreview = Readonly<{
    stateDependentPagesVariations?: StaticPreview.StateDependentPageVariations;
    importsFromStaticDataFiles?: ReadonlyArray<StaticPreview.ImportFromStaticDataFile>;
  }>;

  export namespace StaticPreview {

    export type StateDependentPageVariations = Readonly<{
      specificationFileRelativePath: string;
    }>;

    export type ImportFromStaticDataFile = Readonly<{
      importedVariableName: string;
      fileRelativePath: string;
    }>;

  }


  /* ━━━ Linting ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type Linting = LintingSettings__FromFile__RawValid;


  /* ━━━ Importing from TypeScript ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type ImportingFromTypeScript = Readonly<{
    typeScriptConfigurationFileRelativePath?: string;
    importedNamespace: string;
    sourceFileRelativePath: string;
  }>;


  /* ━━━ Importing from JavaScript ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type ImportingFromJavaScript = Readonly<{
    sourceFileRelativePath: string;
    nameOfGlobalConstantForStoringOfImports: string;
  }>;


  /* ━━━ Routing ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type Routing = Readonly<{
    specificationFileRelativePath: string;
    variable: string;
    localizations?: Readonly<{ [locale: string]: Routing.LocalizationFileRelativePath; }>;
  }>;

  export namespace Routing {
    export type LocalizationFileRelativePath = string;
  }


  /* ━━━ Entry Points Group ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type EntryPointsGroup =
      SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.EntryPointsGroup &
      Readonly<{
        outputFormat?: MarkupProcessingRestrictions.OutputFormats;
        localization?: EntryPointsGroup.Localization;
        HTML_Validation?: EntryPointsGroup.HTML_Validation;
        accessibilityInspection?: EntryPointsGroup.AccessibilityInspection;
        buildingModeDependent: Readonly<{
          [projectBuildingMode in ConsumingProjectBuildingModes]: EntryPointsGroup.BuildingModeDependent;
        }>;
      }>;

  export namespace EntryPointsGroup {

    export type Localization =
        Reusables.Localization &
        Readonly<{
          excludedFilesPathsRelativeToSourcesFilesTopDirectory?: ReadonlyArray<string>;
        }>;

    export type HTML_Validation = Readonly<{
      disable?: boolean;
      ignoring?: Readonly<{
        files: ReadonlyArray<string>;
        directories: ReadonlyArray<string>;
      }>;
    }>;

    export type AccessibilityInspection = Readonly<{
      standard?: MarkupProcessingRestrictions.SupportedAccessibilityStandards;
      disable?: boolean;
      ignoring?: Readonly<{
        files: ReadonlyArray<string>;
        directories: ReadonlyArray<string>;
      }>;
    }>;

    export type BuildingModeDependent =
        SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.EntryPointsGroup.BuildingModeDependent &
        Readonly<{
          outputCodeFormatting?: BuildingModeDependent.OutputCodeFormatting;
          outputCodeMinifying?: BuildingModeDependent.OutputCodeMinifying;
        }>;

    export namespace BuildingModeDependent {

      export type OutputCodeFormatting = Readonly<{
        enable?: boolean;
        indentationString?: string;
        lineSeparators?: LineSeparators;
        mustGuaranteeTrailingEmptyLine?: boolean;
        mustIndentHeadAndBodyTags?: boolean;
      }>;

      export type OutputCodeMinifying = Readonly<{
        enable?: boolean;
        attributesExtraWhitespacesCollapsing?: boolean;
        attributesValuesDeduplication?: boolean;
        commentsRemoving?: boolean;
      }>;

    }

  }


  /* ━━━ Logging ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type Logging = Readonly<{

    filesPaths?: boolean;
    filesCount?: boolean;
    partialFilesAndParentEntryPointsCorrespondence?: boolean;
    filesWatcherEvents?: boolean;

    linting: Readonly<{
      starting?: boolean;
      completionWithoutIssues?: boolean;
    }>;

    HTML_Validation?: Readonly<{
      starting?: boolean;
      completionWithoutIssues?: boolean;
    }>;

    accessibilityChecking?: Readonly<{
      starting?: boolean;
      completionWithoutIssues?: boolean;
    }>;

  }>;


  /* ━━━ Properties Specification ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export function generateLocalizationPropertiesSpecification(
    { forEntryPointsGroups }: Readonly<{ forEntryPointsGroups: boolean; }>
  ): RawObjectDataProcessor.NestedObjectPropertySpecification {

    return {

      newName: "localization",
      type: Object,
      isUndefinedForbidden: false,
      mustTransformNullToUndefined: true,

      properties: {

        $stringResourcesFileRelativePath: {
          newName: "stringResourcesFileRelativePath",
          type: String,
          isUndefinedForbidden: false,
          isNullForbidden: true,
          minimalCharactersCount: 1
        },

        $localizedStringResourcesConstantName: {
          newName: "localizedStringResourcesConstantName",
          type: String,
          isUndefinedForbidden: false,
          isNullForbidden: true,
          minimalCharactersCount: 1
        },

        $localeConstantName: {
          newName: "localeConstantName",
          type: String,
          isUndefinedForbidden: false,
          isNullForbidden: true,
          minimalCharactersCount: 1
        },

        $nameOfConstantForInterpolationToLangHTML_Attribute: {
          newName: "nameOfConstantForInterpolationToLangHTML_Attribute",
          type: String,
          isUndefinedForbidden: false,
          isNullForbidden: true,
          minimalCharactersCount: 1
        },

        $locales: {

          newName: "locales",
          type: RawObjectDataProcessor.ValuesTypesIDs.associativeArray,
          isUndefinedForbidden: true,
          isNullForbidden: true,
          areUndefinedTypeValuesForbidden: true,
          areNullTypeValuesForbidden: true,
          minimalEntriesCount: 1,

          value: {

            type: Object,
            properties: {

              $outputFileInterimNameExtensionWithoutDot: {
                newName: "outputFileInterimNameExtensionWithoutDot",
                type: String,
                isUndefinedForbidden: true,
                isNullForbidden: true,
                minimalCharactersCount: 1
              },

              $localeConstantValue: {
                newName: "localeConstantValue",
                type: String,
                undefinedForbiddenIf: {
                  predicate: (
                    {
                      targetPropertyDotSeparatedPath,
                      rawData__full
                    }: RawObjectDataProcessor.ConditionAssociatedWithProperty.Predicate.Parameter
                  ): boolean =>
                      isNotUndefined(
                        getObjectPropertySafely(
                          rawData__full,
                          [
                            /* eslint-disable-next-line @typescript-eslint/no-magic-numbers --
                             * 3 referees to last three elements in paths like
                             * $projectBuilding.$markupProcessing.$entryPointsGroups.Pages.$localization.
                             *   $locales.english.$localeConstantValue */
                            ...splitString(targetPropertyDotSeparatedPath, ".").slice(0, -3),
                            "$localeConstantName"
                          ]
                        )
                      ),
                  descriptionForLogging:
                      "`$projectBuilding.$markupProcessing." +
                        (forEntryPointsGroups ? "$entryPointsGroups.NNN" : "$common") +
                        ".$localization.$localeConstantName` is defined"
                },
                isNullForbidden: true,
                minimalCharactersCount: 1
              },

              $keyInLocalizedStringResourcesObject: {
                newName: "keyInLocalizedStringResourcesObject",
                type: String,
                undefinedForbiddenIf: {
                  predicate: (
                    {
                      targetPropertyDotSeparatedPath,
                      rawData__full
                    }: RawObjectDataProcessor.ConditionAssociatedWithProperty.Predicate.Parameter
                  ): boolean =>
                      isNotUndefined(
                        getObjectPropertySafely(
                          rawData__full,
                          [
                            /* eslint-disable-next-line @typescript-eslint/no-magic-numbers --
                             * 3 referees to last three elements in paths like
                             * $projectBuilding.$markupProcessing.$entryPointsGroups.Pages.$localization.$locales.
                             *     english.$localeConstantValue */
                            ...splitString(targetPropertyDotSeparatedPath, ".").slice(0, -3),
                            "$stringResourcesFileRelativePath"
                          ]
                        )
                      ),
                  descriptionForLogging:
                      "`$projectBuilding.$markupProcessing." +
                        (forEntryPointsGroups ? "$entryPointsGroups.NNN" : "$common") +
                        ".$localization.$stringResourcesFileRelativePath` is defined"
                },
                isNullForbidden: true,
                minimalCharactersCount: 1
              },

              $valueOfConstantForInterpolationToLangHTML_Attribute: {
                newName: "valueOfConstantForInterpolationToLangHTML_Attribute",
                type: String,
                undefinedForbiddenIf: {
                  predicate: (
                    {
                      targetPropertyDotSeparatedPath,
                      rawData__full
                    }: RawObjectDataProcessor.ConditionAssociatedWithProperty.Predicate.Parameter
                  ): boolean =>
                      isNotUndefined(
                        getObjectPropertySafely(
                          rawData__full,
                          [
                            /* eslint-disable-next-line @typescript-eslint/no-magic-numbers --
                             * 3 referees to last three elements in paths like
                             * $projectBuilding.$markupProcessing.$entryPointsGroups.Pages.$localization.$locales.
                             *     english.$localeConstantValue */
                            ...splitString(targetPropertyDotSeparatedPath, ".").slice(0, -3),
                            "$nameOfConstantForInterpolationToLangHTML_Attribute"
                          ]
                        )
                      ),
                  descriptionForLogging:
                      "`$projectBuilding.$markupProcessing." +
                        (forEntryPointsGroups ? "$entryPointsGroups.NNN" : "$common") +
                        ".$localization.$nameOfConstantForInterpolationToLangHTML_Attribute` is defined"
                },
                isNullForbidden: true,
                minimalCharactersCount: 1
              }

            }

          }

        },

        ...forEntryPointsGroups ?
            {
              $excludedFilesPathsRelativeToSourcesFilesTopDirectory: {

                newName: "excludedFilesPathsRelativeToSourcesFilesTopDirectory",
                type: Array,
                isUndefinedForbidden: false,
                isNullForbidden: true,
                areUndefinedElementsForbidden: true,
                areNullElementsForbidden: true,

                element: {
                  type: String,
                  minimalCharactersCount: 1
                }

              }
            } :
            {
              $excludedFilesPathsRelativeRelativeToProjectRootDirectory: {

                newName: "excludedFilesPathsRelativeRelativeToProjectRootDirectory",
                type: Array,
                isUndefinedForbidden: false,
                isNullForbidden: true,
                areUndefinedElementsForbidden: true,
                areNullElementsForbidden: true,

                element: {
                  type: String,
                  minimalCharactersCount: 1
                }

              }
            }

      }

    };

  }

  export const propertiesSpecification: RawObjectDataProcessor.PropertiesSpecification = {

    /* ━━━ Common ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    $common: {

      newName: "common",
      type: Object,
      isUndefinedForbidden: false,
      mustTransformNullToUndefined: true,

      properties: {

        $localization: generateLocalizationPropertiesSpecification({ forEntryPointsGroups: false }),

        $buildingModeDependent: {

          newName: "buildingModeDependent",

          type: RawObjectDataProcessor.ValuesTypesIDs.associativeArray,

          isUndefinedForbidden: false,
          mustTransformNullToUndefined: true,
          areUndefinedTypeValuesForbidden: true,
          areNullTypeValuesForbidden: true,

          minimalEntriesCount: 1,

          allowedKeys: [
            "$localDevelopment",
            "$testing",
            "$staging",
            "$production"
          ],

          keysRenamings: {
            $localDevelopment: ConsumingProjectBuildingModes.localDevelopment,
            $testing: ConsumingProjectBuildingModes.testing,
            $staging: ConsumingProjectBuildingModes.staging,
            $production: ConsumingProjectBuildingModes.production
          },

          value: {

            type: Object,

            properties: {

              $secondsBetweenFileUpdatingAndStartingOfRebuilding: {
                newName: "secondsBetweenFileUpdatingAndStartingOfRebuilding",
                type: Number,
                numbersSet: RawObjectDataProcessor.NumbersSets.naturalNumber,
                isUndefinedForbidden: false,
                isNullForbidden: true
              },

              $mustResolveResourcesPointersToRelativePaths: {
                newName: "mustResolveResourcesPointersToRelativePaths",
                type: Boolean,
                isUndefinedForbidden: false,
                isNullForbidden: true
              }

            }

          }

        }

      }

    },

    /* ━━━ Static Preview ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    $staticPreview: {

      newName: "staticPreview",
      type: Object,
      isUndefinedForbidden: false,
      mustTransformNullToUndefined: true,

      properties: {

        $stateDependentPagesVariations: {

          newName: "stateDependentPagesVariations",
          type: Object,
          isUndefinedForbidden: false,
          mustTransformNullToUndefined: true,

          properties: {

            $specificationFileRelativePath: {
              newName: "specificationFileRelativePath",
              type: String,
              isUndefinedForbidden: true,
              isNullForbidden: true,
              minimalCharactersCount: 1
            }

          }

        },

        $importsFromStaticDataFiles: {

          newName: "importsFromStaticDataFiles",
          type: Array,
          isUndefinedForbidden: false,
          mustTransformNullToUndefined: true,
          areUndefinedElementsForbidden: true,
          areNullElementsForbidden: true,

          element: {

            type: Object,
            properties: {

              $importedVariableName: {
                newName: "importedVariableName",
                type: String,
                isUndefinedForbidden: true,
                isNullForbidden: true,
                minimalCharactersCount: 1
              },

              $fileRelativePath: {
                newName: "fileRelativePath",
                type: String,
                isUndefinedForbidden: true,
                isNullForbidden: true,
                minimalCharactersCount: 1
              }

            }

          }

        }

      }

    },


    /* ━━━ Linting ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    $linting: {
      newName: "linting",
      type: Object,
      isUndefinedForbidden: false,
      mustTransformNullToUndefined: true,
      properties: LintingSettings__FromFile__RawValid.propertiesSpecification
    },


    /* ━━━ Importing From TypeScript ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    $importingFromTypeScript: {

      newName: "importingFromTypeScript",
      type: Object,
      isUndefinedForbidden: false,
      mustTransformNullToUndefined: true,

      properties: {

        $typeScriptConfigurationFileRelativePath: {
          newName: "typeScriptConfigurationFileRelativePath",
          type: String,
          isUndefinedForbidden: false,
          isNullForbidden: true,
          minimalCharactersCount: 1
        },

        $importedNamespace: {
          newName: "importedNamespace",
          type: String,
          isUndefinedForbidden: true,
          isNullForbidden: true,
          minimalCharactersCount: 1
        },

        $sourceFileRelativePath: {
          newName: "sourceFileRelativePath",
          type: String,
          isUndefinedForbidden: true,
          isNullForbidden: true,
          minimalCharactersCount: 1
        }

      }

    },


    /* ━━━ Importing from JavaScript ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    $importingFromJavaScript: {

      newName: "importingFromJavaScript",
      type: Object,
      isUndefinedForbidden: false,
      mustTransformNullToUndefined: true,

      properties: {

        $sourceFileRelativePath: {
          newName: "sourceFileRelativePath",
          type: String,
          isUndefinedForbidden: true,
          isNullForbidden: true,
          minimalCharactersCount: 1
        },

        $nameOfGlobalConstantForStoringOfImports: {
          newName: "nameOfGlobalConstantForStoringOfImports",
          type: String,
          isUndefinedForbidden: true,
          isNullForbidden: true,
          minimalCharactersCount: 1
        }

      }

    },

    /* ━━━ Routing ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    $routing: {

      newName: "routing",
      type: Object,
      isUndefinedForbidden: false,
      mustTransformNullToUndefined: true,

      properties: {

        $specificationFileRelativePath: {
          newName: "specificationFileRelativePath",
          type: String,
          isUndefinedForbidden: true,
          isNullForbidden: true,
          minimalCharactersCount: 1
        },

        $variable: {
          newName: "variable",
          type: String,
          isUndefinedForbidden: true,
          isNullForbidden: true,
          minimalCharactersCount: 1
        },

        $localizations: {
          newName: "localizations",
          type: RawObjectDataProcessor.ValuesTypesIDs.associativeArray,
          isUndefinedForbidden: false,
          mustTransformNullToUndefined: true,
          areUndefinedTypeValuesForbidden: true,
          areNullTypeValuesForbidden: true,
          value: {
            type: String,
            minimalCharactersCount: 1
          }
        }

      }

    },

    ...SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.generatePropertiesSpecification({

      entryPointsGroupBuildingModeIndependentSpecificSettingsLocalizedPropertiesSpecification: {

        $outputFormat: {
          newName: "outputFormat",
          type: String,
          allowedAlternatives: Object.values(MarkupProcessingRestrictions.OutputFormats),
          isUndefinedForbidden: false,
          isNullForbidden: true
        },

        $localization: generateLocalizationPropertiesSpecification({ forEntryPointsGroups: true }),

        $HTML_Validation: {

          newName: "HTML_Validation",
          type: Object,
          isUndefinedForbidden: false,
          mustTransformNullToUndefined: true,

          properties: {

            $disable: {
              newName: "disable",
              type: Boolean,
              isUndefinedForbidden: false,
              isNullForbidden: true
            },

            $ignoring: {

              newName: "ignoring",
              type: Object,
              isUndefinedForbidden: false,
              mustTransformNullToUndefined: true,

              properties: {

                $files: {
                  newName: "files",
                  type: Array,
                  isUndefinedForbidden: false,
                  isNullForbidden: true,
                  areUndefinedElementsForbidden: true,
                  areNullElementsForbidden: true,
                  element: {
                    type: String,
                    minimalCharactersCount: 1
                  }
                },

                $directories: {
                  newName: "directories",
                  type: Array,
                  isUndefinedForbidden: false,
                  isNullForbidden: true,
                  areUndefinedElementsForbidden: true,
                  areNullElementsForbidden: true,
                  element: {
                    type: String,
                    minimalCharactersCount: 1
                  }
                }

              }

            }

          }

        },

        $accessibilityInspection: {

          newName: "accessibilityInspection",
          type: Object,
          isUndefinedForbidden: false,
          mustTransformNullToUndefined: true,

          properties: {

            $standard: {
              newName: "standard",
              type: String,
              isUndefinedForbidden: false,
              isNullForbidden: true,
              allowedAlternatives: Object.values(MarkupProcessingRestrictions.SupportedAccessibilityStandards)
            },

            $disable: {
              newName: "disable",
              type: Boolean,
              isUndefinedForbidden: false,
              isNullForbidden: true
            },

            $ignoring: {

              newName: "ignoring",
              type: Object,
              isUndefinedForbidden: false,
              mustTransformNullToUndefined: true,

              properties: {

                $files: {
                  newName: "files",
                  type: Array,
                  isUndefinedForbidden: false,
                  isNullForbidden: true,
                  areUndefinedElementsForbidden: true,
                  areNullElementsForbidden: true,
                  element: {
                    type: String,
                    minimalCharactersCount: 1
                  }
                },

                $directories: {
                  newName: "directories",
                  type: Array,
                  isUndefinedForbidden: false,
                  isNullForbidden: true,
                  areUndefinedElementsForbidden: true,
                  areNullElementsForbidden: true,
                  element: {
                    type: String,
                    minimalCharactersCount: 1
                  }
                }

              }

            }

          }

        }

      },

      entryPointsGroupBuildingModeDependentSpecificSettingsLocalizedPropertiesSpecification: {

        $outputCodeFormatting: {

          newName: "outputCodeFormatting",
          type: Object,
          isUndefinedForbidden: false,
          mustTransformNullToUndefined: true,

          properties: {

            $enable: {
              newName: "enable",
              type: Boolean,
              isUndefinedForbidden: false,
              isNullForbidden: true
            },

            $indentationString: {
              newName: "indentationString",
              type: String,
              isUndefinedForbidden: false,
              isNullForbidden: true,
              validValueRegularExpression: /^\s+$/u
            },

            $lineSeparators: {
              newName: "lineSeparators",
              type: String,
              isUndefinedForbidden: false,
              isNullForbidden: true,
              allowedAlternatives: Object.values(LineSeparators)
            },

            $mustGuaranteeTrailingEmptyLine: {
              newName: "mustGuaranteeTrailingEmptyLine",
              type: Boolean,
              isUndefinedForbidden: false,
              isNullForbidden: true
            },

            $mustIndentHeadAndBodyTags: {
              newName: "mustIndentHeadAndBodyTags",
              type: Boolean,
              isUndefinedForbidden: false,
              isNullForbidden: true
            }

          }

        },

        $outputCodeMinifying: {

          newName: "outputCodeMinifying",
          type: Object,
          isUndefinedForbidden: false,
          mustTransformNullToUndefined: true,

          properties: {

            $enable: {
              newName: "enable",
              type: Boolean,
              isUndefinedForbidden: false,
              isNullForbidden: true
            },

            $attributesExtraWhitespacesCollapsing: {
              newName: "attributesExtraWhitespacesCollapsing",
              type: Boolean,
              isUndefinedForbidden: false,
              isNullForbidden: true
            },

            $attributesValuesDeduplication: {
              newName: "attributesValuesDeduplication",
              type: Boolean,
              isUndefinedForbidden: false,
              isNullForbidden: true
            },

            $commentsRemoving: {
              newName: "commentsRemoving",
              type: Boolean,
              isUndefinedForbidden: false,
              isNullForbidden: true
            }

          }

        }

      }

    }),

    $logging: {

      newName: "logging",
      type: Object,
      isUndefinedForbidden: false,
      mustTransformNullToUndefined: true,

      properties: {

        $filesPaths: {
          newName: "filesPaths",
          type: Boolean,
          isUndefinedForbidden: false,
          isNullForbidden: true
        },

        $filesCount: {
          newName: "filesCount",
          type: Boolean,
          isUndefinedForbidden: false,
          isNullForbidden: true
        },

        $partialFilesAndParentEntryPointsCorrespondence: {
          newName: "partialFilesAndParentEntryPointsCorrespondence",
          type: Boolean,
          isUndefinedForbidden: false,
          isNullForbidden: true
        },

        $filesWatcherEvents: {
          newName: "filesWatcherEvents",
          type: Boolean,
          isUndefinedForbidden: false,
          isNullForbidden: true
        },

        $HTML_Validation: {

          newName: "HTML_Validation",
          type: Object,
          isUndefinedForbidden: false,
          mustTransformNullToUndefined: true,

          properties: {

            $starting4: {
              newName: "starting",
              type: Boolean,
              isUndefinedForbidden: false,
              isNullForbidden: true
            },

            $completionWithoutIssues: {
              newName: "completionWithoutIssues",
              type: Boolean,
              isUndefinedForbidden: false,
              isNullForbidden: true
            }

          }

        },

        $accessibilityChecking: {

          newName: "accessibilityChecking",
          type: Object,
          isUndefinedForbidden: false,
          mustTransformNullToUndefined: true,

          properties: {

            $starting: {
              newName: "starting",
              type: Boolean,
              isUndefinedForbidden: false,
              isNullForbidden: true
            },

            $completionWithoutIssues: {
              newName: "completionWithoutIssues",
              type: Boolean,
              isUndefinedForbidden: false,
              isNullForbidden: true
            }

          }

        },

        $linting: {

          newName: "linting",
          type: Object,
          isUndefinedForbidden: false,
          mustTransformNullToUndefined: true,

          properties: {

            $starting: {
              newName: "starting",
              type: Boolean,
              isUndefinedForbidden: false,
              isNullForbidden: true
            },

            $completionWithoutIssues: {
              newName: "completionWithoutIssues",
              type: Boolean,
              isUndefinedForbidden: false,
              isNullForbidden: true
            }

          }

        }

      }

    }

  };

}


export default MarkupProcessingSettings__FromFile__RawValid;
