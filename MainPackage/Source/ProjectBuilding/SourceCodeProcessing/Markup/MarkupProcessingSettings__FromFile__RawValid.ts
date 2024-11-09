/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import MarkupProcessingRestrictions from "@MarkupProcessing/MarkupProcessingRestrictions";
import ConsumingProjectBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";

/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid from
    "@ProjectBuilding:Common/RawConfig/SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid";
import type ConsumingProjectPreDefinedBuildingModes__Localized from
    "@ProjectBuilding/Common/RawConfig/Enumerations/ConsumingProjectPreDefinedBuildingModes__Localized";
import type LintingSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/LintingSettings__FromFile__RawValid";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { RawObjectDataProcessor, nullToUndefined } from "@yamato-daiwa/es-extensions";


type MarkupProcessingSettings__FromFile__RawValid = Readonly<{
  common?: MarkupProcessingSettings__FromFile__RawValid.Common;
  linting?: MarkupProcessingSettings__FromFile__RawValid.Linting;
  importingFromTypeScript?: MarkupProcessingSettings__FromFile__RawValid.ImportingFromTypeScript;
  staticPreview?: MarkupProcessingSettings__FromFile__RawValid.StaticPreview;
  routing?: MarkupProcessingSettings__FromFile__RawValid.Routing;
  entryPointsGroups: Readonly<{ [groupID: string]: MarkupProcessingSettings__FromFile__RawValid.EntryPointsGroup; }>;
  logging?: MarkupProcessingSettings__FromFile__RawValid.Logging;
}>;


namespace MarkupProcessingSettings__FromFile__RawValid {

  export type Common = Readonly<{
    periodBetweenFileUpdatingAndRebuildingStarting__seconds?: number;
    buildingModeDependent?: Readonly<{ [projectBuildingMode: string]: Common.BuildingModeDependent | undefined; }>;
  }>;

  export namespace Common {
    export type BuildingModeDependent = Readonly<{
      mustResolveResourceReferencesToRelativePaths?: boolean;
    }>;
  }


  export type Linting = LintingSettings__FromFile__RawValid;


  export type ImportingFromTypeScript = Readonly<{
    typeScriptConfigurationFileRelativePath?: string;
    importedNamespace: string;
    sourceFileRelativePath: string;
    nameOfPugBlockToWhichTranspiledTypeScriptMustBeInjected: string;
  }>;


  export type StaticPreview = Readonly<{
    stateDependentPagesVariationsSpecificationFileRelativePath?: string;
    importsFromStaticDataFiles?: ReadonlyArray<StaticPreview.ImportFromStaticDataFile>;
  }>;

  export namespace StaticPreview {

    export type ImportFromStaticDataFile = Readonly<{
      importedVariableName: string;
      fileRelativePath: string;
    }>;

  }


  export type Routing = Readonly<{
    specificationFileRelativePath: string;
    variable: string;
    localizations?: Readonly<{ [locale: string]: Routing.LocalizationFileRelativePath; }>;
  }>;

  export namespace Routing {
    export type LocalizationFileRelativePath = string;
  }


  export type EntryPointsGroup =
      SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.EntryPointsGroup &
      Readonly<{
        outputFormat?: MarkupProcessingRestrictions.OutputFormats;
        HTML_Validation?: EntryPointsGroup.HTML_Validation;
        accessibilityInspection?: EntryPointsGroup.AccessibilityInspection;
        buildingModeDependent: Readonly<{
          [projectBuildingMode in ConsumingProjectBuildingModes]: EntryPointsGroup.BuildingModeDependent;
        }>;
      }>;

  export namespace EntryPointsGroup {

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
        Readonly<{ outputCodeFormatting?: BuildingModeDependent.OutputCodeFormatting; }>;

    export namespace BuildingModeDependent {
      export type OutputCodeFormatting = Readonly<{ disable?: boolean; }>;
    }

  }


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


  /* ━━━ Localization ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type Localization = Readonly<{

    common: Readonly<{

      KEY: string;

      periodBetweenFileUpdatingAndRebuildingStarting__seconds: Readonly<{ KEY: string; }>;

      buildingModeDependent: Readonly<{
        KEY: string;
        mustResolveResourceReferencesToRelativePaths: Readonly<{ KEY: string; }>;
      }>;

    }>;

    linting: Readonly<{ KEY: string; }>;

    importingFromTypeScript: Readonly<{
      KEY: string;
      typeScriptConfigurationFileRelativePath: Readonly<{ KEY: string; }>;
      importedNamespace: Readonly<{ KEY: string; }>;
      sourceFileRelativePath: Readonly<{ KEY: string; }>;
      nameOfPugBlockToWhichTranspiledTypeScriptMustBeInjected: Readonly<{ KEY: string; }>;
    }>;

    staticPreview: Readonly<{

      KEY: string;

      stateDependentPagesVariationsSpecificationFileRelativePath: Readonly<{ KEY: string; }>;

      importsFromStaticDataFiles: {
        KEY: string;
        importedVariableName: Readonly<{ KEY: string; }>;
        fileRelativePath: Readonly<{ KEY: string; }>;
      };

    }>;

    entryPointsGroups: Readonly<{

      KEY: string;

      HTML_Validation: Readonly<{
        KEY: string;
        disable: Readonly<{ KEY: string; }>;
        ignoring: Readonly<{
          KEY: string;
          files: Readonly<{ KEY: string; }>;
          directories: Readonly<{ KEY: string; }>;
        }>;
      }>;

      accessibilityInspection: Readonly<{
        KEY: string;
        standard: Readonly<{ KEY: string; }>;
        disable: Readonly<{ KEY: string; }>;
        ignoring: Readonly<{
          KEY: string;
          files: Readonly<{ KEY: string; }>;
          directories: Readonly<{ KEY: string; }>;
        }>;
      }>;

      outputFormat: { KEY: string; };

      buildingModeDependent: Readonly<{
        KEY: string;
        outputTopDirectoryRelativePath: Readonly<{ KEY: string; }>;
        outputCodeFormatting: Readonly<{
          KEY: string;
          disable: Readonly<{ KEY: string; }>;
        }>;
      }>;

    }>;

    logging: Readonly<{

      KEY: string;

      filesPaths: Readonly<{ KEY: string; }>;
      filesCount: Readonly<{ KEY: string; }>;
      partialFilesAndParentEntryPointsCorrespondence: Readonly<{ KEY: string; }>;
      filesWatcherEvents: Readonly<{ KEY: string; }>;

      linting: Readonly<{
        KEY: string;
        starting: Readonly<{ KEY: string; }>;
        completionWithoutIssues: Readonly<{ KEY: string; }>;
      }>;

      HTML_Validation: Readonly<{
        KEY: string;
        starting: Readonly<{ KEY: string; }>;
        completionWithoutIssues: Readonly<{ KEY: string; }>;
      }>;

      accessibilityChecking: Readonly<{
        KEY: string;
        starting: Readonly<{ KEY: string; }>;
        completionWithoutIssues: Readonly<{ KEY: string; }>;
      }>;

    }>;

  }>;


  export function getLocalizedPropertiesSpecification(
    {
      markupProcessingPropertiesLocalization,
      localizedConsumingProjectLocalizedPreDefinedBuildingModes,
      lintingSettingsLocalizedPropertiesSpecification,
      sourceCodeProcessingSettingsGenericPropertiesLocalization,
      entryPointsGroupBuildingModeDependentOutputGenericSettingsLocalizedPropertiesSpecification
    }: Readonly<{
      markupProcessingPropertiesLocalization: Localization;
      localizedConsumingProjectLocalizedPreDefinedBuildingModes: ConsumingProjectPreDefinedBuildingModes__Localized;
      lintingSettingsLocalizedPropertiesSpecification: RawObjectDataProcessor.PropertiesSpecification;
      sourceCodeProcessingSettingsGenericPropertiesLocalization:
          SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.Localization;
      entryPointsGroupBuildingModeDependentOutputGenericSettingsLocalizedPropertiesSpecification: RawObjectDataProcessor.
          PropertiesSpecification;
    }>
  ): RawObjectDataProcessor.PropertiesSpecification {

    return {

      $common: {

        newName: "common",
        preValidationModifications: nullToUndefined,
        type: Object,
        required: false,

        properties: {

          $periodBetweenFileUpdatingAndRebuildingStarting__seconds: {
            newName: "periodBetweenFileUpdatingAndRebuildingStarting__seconds",
            type: Number,
            numbersSet: RawObjectDataProcessor.NumbersSets.naturalNumber,
            required: false
          },
          // ━━━ TODO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          $buildingModeDependent: {

            newName: "buildingModeDependent",
            type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
            required: false,
            allowedKeys: Object.values(ConsumingProjectBuildingModes),
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
                [
                  markupProcessingPropertiesLocalization.common.buildingModeDependent.
                      mustResolveResourceReferencesToRelativePaths.KEY
                ]: {
                  newName: "mustResolveResourceReferencesToRelativePaths",
                  type: Boolean,
                  required: false
                }
              }
            }

          }

        }

      },

      [markupProcessingPropertiesLocalization.linting.KEY]: {
        newName: "linting",
        preValidationModifications: nullToUndefined,
        type: Object,
        required: false,
        properties: lintingSettingsLocalizedPropertiesSpecification
      },

      [markupProcessingPropertiesLocalization.importingFromTypeScript.KEY]: {

        newName: "importingFromTypeScript",
        preValidationModifications: nullToUndefined,
        type: Object,
        required: false,

        properties: {

          [markupProcessingPropertiesLocalization.importingFromTypeScript.typeScriptConfigurationFileRelativePath.KEY]: {
            newName: "typeScriptConfigurationFileRelativePath",
            type: String,
            required: false,
            minimalCharactersCount: 1
          },

          [markupProcessingPropertiesLocalization.importingFromTypeScript.importedNamespace.KEY]: {
            newName: "importedNamespace",
            type: String,
            required: true,
            minimalCharactersCount: 1
          },

          [markupProcessingPropertiesLocalization.importingFromTypeScript.sourceFileRelativePath.KEY]: {
            newName: "sourceFileRelativePath",
            type: String,
            required: true,
            minimalCharactersCount: 1
          },

          [
            markupProcessingPropertiesLocalization.importingFromTypeScript.
              nameOfPugBlockToWhichTranspiledTypeScriptMustBeInjected.KEY
          ]: {
            newName: "nameOfPugBlockToWhichTranspiledTypeScriptMustBeInjected",
            type: String,
            required: true,
            minimalCharactersCount: 1
          }

        }

      },

      [markupProcessingPropertiesLocalization.staticPreview.KEY]: {

        newName: "staticPreview",
        preValidationModifications: nullToUndefined,
        type: Object,
        required: false,

        properties: {

          [markupProcessingPropertiesLocalization.staticPreview.stateDependentPagesVariationsSpecificationFileRelativePath.KEY]: {
            newName: "stateDependentPagesVariationsSpecificationFileRelativePath",
            type: String,
            required: false,
            minimalCharactersCount: 1
          },

          [markupProcessingPropertiesLocalization.staticPreview.importsFromStaticDataFiles.KEY]: {

            newName: "importsFromStaticDataFiles",
            preValidationModifications: nullToUndefined,
            type: Array,
            required: false,

            element: {

              type: Object,
              properties: {

                [markupProcessingPropertiesLocalization.staticPreview.importsFromStaticDataFiles.importedVariableName.KEY]: {
                  newName: "importedVariableName",
                  type: String,
                  required: true,
                  minimalCharactersCount: 1
                },

                [markupProcessingPropertiesLocalization.staticPreview.importsFromStaticDataFiles.fileRelativePath.KEY]: {
                  newName: "fileRelativePath",
                  type: String,
                  required: true,
                  minimalCharactersCount: 1
                }

              }

            }

          }

        }

      },

      routing: {

        type: Object,
        required: false,
        preValidationModifications: nullToUndefined,

        properties: {

          $specificationFileRelativePath: {
            newName: "specificationFileRelativePath",
            type: String,
            required: true,
            minimalCharactersCount: 1
          },

          $variable: {
            newName: "variable",
            type: String,
            required: true,
            minimalCharactersCount: 1
          },

          $localizations: {
            newName: "localizations",
            type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
            required: false,
            preValidationModifications: nullToUndefined,
            value: {
              type: String,
              minimalCharactersCount: 1
            }
          }

        }

      },

      ...SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.getLocalizedPropertiesSpecification({

        sourceCodeProcessingSettingsGenericPropertiesLocalization,

        localizedConsumingProjectLocalizedPreDefinedBuildingModes,

        entryPointsGroupBuildingModeIndependentSpecificSettingsLocalizedPropertiesSpecification: {

          [markupProcessingPropertiesLocalization.entryPointsGroups.outputFormat.KEY]: {
            newName: "outputFormat",
            type: String,
            allowedAlternatives: Object.values(MarkupProcessingRestrictions.OutputFormats),
            required: false
          },

          [markupProcessingPropertiesLocalization.entryPointsGroups.HTML_Validation.KEY]: {

            newName: "HTML_Validation",
            preValidationModifications: nullToUndefined,
            type: Object,
            required: false,

            properties: {

              [markupProcessingPropertiesLocalization.entryPointsGroups.HTML_Validation.disable.KEY]: {
                newName: "disable",
                type: Boolean,
                required: false
              },

              [markupProcessingPropertiesLocalization.entryPointsGroups.HTML_Validation.ignoring.KEY]: {

                newName: "ignoring",
                preValidationModifications: nullToUndefined,
                type: Object,
                required: false,

                properties: {

                  [markupProcessingPropertiesLocalization.entryPointsGroups.HTML_Validation.ignoring.files.KEY]: {
                    newName: "files",
                    type: Array,
                    required: false,
                    element: {
                      type: String,
                      minimalCharactersCount: 1
                    }
                  },

                  [markupProcessingPropertiesLocalization.entryPointsGroups.HTML_Validation.ignoring.directories.KEY]: {
                    newName: "directories",
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

          },

          [markupProcessingPropertiesLocalization.entryPointsGroups.accessibilityInspection.KEY]: {

            newName: "accessibilityInspection",
            preValidationModifications: nullToUndefined,
            type: Object,
            required: false,

            properties: {

              [markupProcessingPropertiesLocalization.entryPointsGroups.accessibilityInspection.standard.KEY]: {
                newName: "standard",
                type: String,
                required: false,
                allowedAlternatives: Object.values(MarkupProcessingRestrictions.SupportedAccessibilityStandards)
              },

              [markupProcessingPropertiesLocalization.entryPointsGroups.accessibilityInspection.disable.KEY]: {
                newName: "disable",
                type: Boolean,
                required: false
              },

              [markupProcessingPropertiesLocalization.entryPointsGroups.accessibilityInspection.ignoring.KEY]: {

                newName: "ignoring",
                preValidationModifications: nullToUndefined,
                type: Object,
                required: false,

                properties: {

                  [markupProcessingPropertiesLocalization.entryPointsGroups.accessibilityInspection.ignoring.files.KEY]: {
                    newName: "files",
                    type: Array,
                    required: false,
                    element: {
                      type: String,
                      minimalCharactersCount: 1
                    }
                  },

                  [markupProcessingPropertiesLocalization.entryPointsGroups.accessibilityInspection.ignoring.directories.KEY]: {
                    newName: "directories",
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

        },

        entryPointsGroupBuildingModeDependentOutputGenericSettingsLocalizedPropertiesSpecification,

        entryPointsGroupBuildingModeDependentSpecificSettingsLocalizedPropertiesSpecification: {

          [markupProcessingPropertiesLocalization.entryPointsGroups.buildingModeDependent.outputCodeFormatting.KEY]: {

            newName: "outputCodeFormatting",
            type: Object,
            required: false,
            preValidationModifications: nullToUndefined,

            properties: {
              disable: {
                newName: "disable",
                type: Boolean,
                required: false
              }
            }

          }

        }

      }),

      [markupProcessingPropertiesLocalization.logging.KEY]: {

        newName: "logging",
        type: Object,
        required: false,
        preValidationModifications: nullToUndefined,

        properties: {

          [markupProcessingPropertiesLocalization.logging.filesPaths.KEY]: {
            newName: "filesPaths",
            type: Boolean,
            required: false
          },

          [markupProcessingPropertiesLocalization.logging.filesCount.KEY]: {
            newName: "filesCount",
            type: Boolean,
            required: false
          },

          [markupProcessingPropertiesLocalization.logging.partialFilesAndParentEntryPointsCorrespondence.KEY]: {
            newName: "partialFilesAndParentEntryPointsCorrespondence",
            type: Boolean,
            required: false
          },

          [markupProcessingPropertiesLocalization.logging.filesWatcherEvents.KEY]: {
            newName: "filesWatcherEvents",
            type: Boolean,
            required: false
          },

          [markupProcessingPropertiesLocalization.logging.HTML_Validation.KEY]: {

            newName: "HTML_Validation",
            type: Object,
            required: false,
            preValidationModifications: nullToUndefined,

            properties: {

              [markupProcessingPropertiesLocalization.logging.HTML_Validation.starting.KEY]: {
                newName: "starting",
                type: Boolean,
                required: false
              },

              [markupProcessingPropertiesLocalization.logging.HTML_Validation.completionWithoutIssues.KEY]: {
                newName: "completionWithoutIssues",
                type: Boolean,
                required: false
              }

            }

          },

          [markupProcessingPropertiesLocalization.logging.accessibilityChecking.KEY]: {

            newName: "accessibilityChecking",
            type: Object,
            required: false,
            preValidationModifications: nullToUndefined,

            properties: {

              [markupProcessingPropertiesLocalization.logging.accessibilityChecking.starting.KEY]: {
                newName: "starting",
                type: Boolean,
                required: false
              },

              [markupProcessingPropertiesLocalization.logging.accessibilityChecking.completionWithoutIssues.KEY]: {
                newName: "completionWithoutIssues",
                type: Boolean,
                required: false
              }

            }

          },

          [markupProcessingPropertiesLocalization.logging.linting.KEY]: {

            newName: "linting",
            type: Object,
            required: false,
            preValidationModifications: nullToUndefined,

            properties: {

              [markupProcessingPropertiesLocalization.logging.linting.starting.KEY]: {
                newName: "starting",
                type: Boolean,
                required: false
              },

              [markupProcessingPropertiesLocalization.logging.linting.completionWithoutIssues.KEY]: {
                newName: "completionWithoutIssues",
                type: Boolean,
                required: false
              }

            }

          }

        }

      }

    };

  }

}


export default MarkupProcessingSettings__FromFile__RawValid;
