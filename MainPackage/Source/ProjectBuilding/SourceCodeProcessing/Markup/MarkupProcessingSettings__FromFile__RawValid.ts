/* --- Restrictions ------------------------------------------------------------------------------------------------- */
import MarkupProcessingRestrictions from "@MarkupProcessing/MarkupProcessingRestrictions";
import ConsumingProjectPreDefinedBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectPreDefinedBuildingModes";

/* --- Raw valid settings ------------------------------------------------------------------------------------------- */
import type SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid from
    "@ProjectBuilding:Common/RawConfig/SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid";
import type ConsumingProjectPreDefinedBuildingModes__Localized from
    "@ProjectBuilding/Common/RawConfig/Enumerations/ConsumingProjectPreDefinedBuildingModes__Localized";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import { RawObjectDataProcessor, nullToUndefined } from "@yamato-daiwa/es-extensions";


type MarkupProcessingSettings__FromFile__RawValid = Readonly<{
  common?: MarkupProcessingSettings__FromFile__RawValid.Common;
  linting?: MarkupProcessingSettings__FromFile__RawValid.Linting;
  staticPreview?: MarkupProcessingSettings__FromFile__RawValid.StaticPreview;
  entryPointsGroups: Readonly<{ [groupID: string]: MarkupProcessingSettings__FromFile__RawValid.EntryPointsGroup; }>;
  logging?: MarkupProcessingSettings__FromFile__RawValid.Logging;
}>;


/* eslint-disable-next-line @typescript-eslint/no-redeclare --
 * The merging of type/interface and namespace is completely valid TypeScript,
 * but @typescript-eslint community does not wish to support it.
 * https://github.com/eslint/eslint/issues/15504 */
namespace MarkupProcessingSettings__FromFile__RawValid {

  /* === Types ====================================================================================================== */
  export type Common = Readonly<{
    periodBetweenFileUpdatingAndRebuildingStarting__seconds?: number;
    buildingModeDependent?: Readonly<{ [projectBuildingMode: string]: Common.BuildingModeDependent | undefined; }>;
  }>;

  export namespace Common {
    export type BuildingModeDependent = Readonly<{
      mustResolveResourceReferencesToRelativePaths?: boolean;
    }>;
  }


  export type Linting = Readonly<{
    presetFileRelativePath?: string;
    enable?: boolean;
  }>;


  export type StaticPreview = Readonly<{
    stateDependentPagesVariationsSpecificationFileRelativePath?: string;
    importsFromStaticDataFiles?: ReadonlyArray<StaticPreview.ImportFromStaticDataFile>;
    importsFromCompiledTypeScript?: Readonly<StaticPreview.ImportFromCompiledTypeScript>;
  }>;

  export namespace StaticPreview {

    export type ImportFromStaticDataFile = Readonly<{
      importedVariableName: string;
      fileRelativePath: string;
    }>;


    export type ImportFromCompiledTypeScript = Readonly<{
      typeScriptConfigurationFileRelativePath?: string;
      files: ReadonlyArray<ImportFromCompiledTypeScript.FileMetadata>;
    }>;

    export namespace ImportFromCompiledTypeScript {

      export type FileMetadata = Readonly<{
        importedNamespace: string;
        sourceFileRelativePath: string;
        outputDirectoryRelativePath: string;
        customOutputFileNameWithoutLastExtension?: string;
      }>;

    }

  }

  export type EntryPointsGroup =
      SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.EntryPointsGroup &
      Readonly<{
        HTML_Validation?: EntryPointsGroup.HTML_Validation;
        accessibilityInspection?: EntryPointsGroup.AccessibilityInspection;
        convertToHandlebarsOnNonStaticPreviewModes?: boolean;
        buildingModeDependent: Readonly<{ [projectBuildingMode: string]: EntryPointsGroup.BuildingModeDependent; }>;
      }>;

  export namespace EntryPointsGroup {

    export type BuildingModeDependent = SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.
        EntryPointsGroup.BuildingModeDependent;

    export type HTML_Validation = Readonly<{ disable?: boolean; }>;

    export type AccessibilityInspection = Readonly<{
      standard?: MarkupProcessingRestrictions.SupportedAccessibilityStandards;
      disable?: boolean;
    }>;
  }


  export type Logging = Readonly<{
    filesPaths?: boolean;
    filesCount?: boolean;
    partialFilesAndParentEntryPointsCorrespondence?: boolean;
  }>;


  /* === Localization =============================================================================================== */
  export type Localization = Readonly<{

    common: Readonly<{
      KEY: string;
      periodBetweenFileUpdatingAndRebuildingStarting__seconds: Readonly<{ KEY: string; }>;
      buildingModeDependent: Readonly<{
        KEY: string;
        mustResolveResourceReferencesToRelativePaths: Readonly<{ KEY: string; }>;
      }>;
    }>;

    staticPreview: Readonly<{
      KEY: string;
      stateDependentPagesVariationsSpecificationFileRelativePath: Readonly<{ KEY: string; }>;
      importsFromStaticDataFiles: Readonly<{
        KEY: string;
        importedVariableName: Readonly<{ KEY: string; }>;
        fileRelativePath: Readonly<{ KEY: string; }>;
      }>;
      importsFromCompiledTypeScript: Readonly<{
        KEY: string;
        typeScriptConfigurationFileRelativePath: Readonly<{ KEY: string; }>;
        files: Readonly<{
          KEY: string;
          importedNamespace: Readonly<{ KEY: string; }>;
          sourceFileRelativePath: Readonly<{ KEY: string; }>;
          outputDirectoryRelativePath: Readonly<{ KEY: string; }>;
          customOutputFileNameWithoutLastExtension: Readonly<{ KEY: string; }>;
        }>;
      }>;
    }>;

    linting: Readonly<{ KEY: string; }>;

    entryPointsGroups: Readonly<{

      KEY: string;

      HTML_Validation: Readonly<{
        KEY: string;
        disable: Readonly<{ KEY: string; }>;
      }>;

      accessibilityInspection: Readonly<{
        KEY: string;
        standard: Readonly<{ KEY: string; }>;
        disable: Readonly<{ KEY: string; }>;
      }>;

      convertToHandlebarsOnNonStaticPreviewModes: { KEY: string; };

      buildingModeDependent: Readonly<{
        KEY: string;
        outputTopDirectoryRelativePath: Readonly<{ KEY: string; }>;
      }>;
    }>;

    logging: Readonly<{
      filesPaths: Readonly<{ KEY: string; }>;
      filesCount: Readonly<{ KEY: string; }>;
      partialFilesAndParentEntryPointsCorrespondence: Readonly<{ KEY: string; }>;
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

          [markupProcessingLocalization.common.periodBetweenFileUpdatingAndRebuildingStarting__seconds.KEY]: {
            newName: "periodBetweenFileUpdatingAndRebuildingStarting__seconds",
            type: Number,
            required: false,
            numbersSet: RawObjectDataProcessor.NumbersSets.naturalNumber
          },

          [markupProcessingLocalization.common.buildingModeDependent.KEY]: {

            newName: "buildingModeDependent",
            type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
            required: false,
            allowedKeys: Object.values(ConsumingProjectPreDefinedBuildingModes),
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
                [markupProcessingLocalization.common.buildingModeDependent.mustResolveResourceReferencesToRelativePaths.KEY]: {
                  newName: "mustResolveResourceReferencesToRelativePaths",
                  type: Boolean,
                  required: false
                }
              }
            }
          }

        }

      },

      [markupProcessingLocalization.staticPreview.KEY]: {

        newName: "staticPreview",
        preValidationModifications: nullToUndefined,
        type: Object,
        required: false,

        properties: {

          [markupProcessingLocalization.staticPreview.stateDependentPagesVariationsSpecificationFileRelativePath.KEY]: {
            newName: "stateDependentPagesVariationsSpecificationFileRelativePath",
            type: String,
            required: false,
            minimalCharactersCount: 1
          },

          [markupProcessingLocalization.staticPreview.importsFromStaticDataFiles.KEY]: {
            newName: "importsFromStaticDataFiles",
            type: Array,
            required: false,
            minimalElementsCount: 1,
            element: {
              type: Object,
              properties: {
                importedVariableName: {
                  newName: "importedVariableName",
                  type: String,
                  required: true,
                  minimalCharactersCount: 1
                },
                fileRelativePath: {
                  newName: "fileRelativePath",
                  type: String,
                  required: true,
                  minimalCharactersCount: 1
                }
              }
            }
          },

          [markupProcessingLocalization.staticPreview.importsFromCompiledTypeScript.KEY]: {
            newName: "importsFromCompiledTypeScript",
            preValidationModifications: nullToUndefined,
            type: Object,
            required: false,
            properties: {
              typeScriptConfigurationFileRelativePath: {
                newName: "typeScriptConfigurationFileRelativePath",
                type: String,
                required: false,
                minimalCharactersCount: 1
              },
              files: {
                newName: "files",
                type: Array,
                required: false,
                minimalElementsCount: 1,
                element: {
                  type: Object,
                  properties: {
                    importedNamespace: {
                      newName: "importedNamespace",
                      type: String,
                      required: true,
                      minimalCharactersCount: 1
                    },
                    sourceFileRelativePath: {
                      newName: "sourceFileRelativePath",
                      type: String,
                      required: true,
                      minimalCharactersCount: 1
                    },
                    outputDirectoryRelativePath: {
                      newName: "outputDirectoryRelativePath",
                      type: String,
                      required: true,
                      minimalCharactersCount: 1
                    },
                    customOutputFileNameWithoutLastExtension: {
                      newName: "customOutputFileNameWithoutLastExtension",
                      type: String,
                      required: false,
                      minimalCharactersCount: 1
                    }
                  }
                }
              }
            }
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
        minimalEntriesCount: 1,

        value: {

          type: Object,

          properties: {

            ...sourceCodeProcessingSettingsGenericPropertiesLocalizedSpecification,

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

            [markupProcessingLocalization.entryPointsGroups.convertToHandlebarsOnNonStaticPreviewModes.KEY]: {
              newName: "convertToHandlebarsOnNonStaticPreviewModes",
              type: Boolean,
              required: false
            },

            [markupProcessingLocalization.entryPointsGroups.buildingModeDependent.KEY]: {

              newName: "buildingModeDependent",
              type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
              required: true,
              allowedKeys: Object.values(ConsumingProjectPreDefinedBuildingModes),
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
                  [markupProcessingLocalization.entryPointsGroups.buildingModeDependent.outputTopDirectoryRelativePath.KEY]: {
                    newName: "outputTopDirectoryRelativePath",
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
