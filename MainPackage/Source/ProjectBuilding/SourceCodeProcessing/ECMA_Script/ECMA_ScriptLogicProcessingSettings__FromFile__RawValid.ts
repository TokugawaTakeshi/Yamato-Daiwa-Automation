/* --- Restrictions ------------------------------------------------------------------------------------------------- */
import ECMA_ScriptLogicProcessingRestrictions from "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingRestrictions";
import SupportedECMA_ScriptRuntimesTypes = ECMA_ScriptLogicProcessingRestrictions.SupportedECMA_ScriptRuntimesTypes;
import ConsumingProjectPreDefinedBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectPreDefinedBuildingModes";
import type ConsumingProjectPreDefinedBuildingModes__Localized from
    "@ProjectBuilding/Common/RawConfig/Enumerations/ConsumingProjectPreDefinedBuildingModes__Localized";

/* --- Raw valid config --------------------------------------------------------------------------------------------- */
import type SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid from
    "@ProjectBuilding:Common/RawConfig/SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid";
import type RevisioningSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/RevisioningSettings__FromFile__RawValid";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import type { ArbitraryObject } from "@yamato-daiwa/es-extensions";
import { RawObjectDataProcessor, nullToUndefined } from "@yamato-daiwa/es-extensions";


type ECMA_ScriptLogicProcessingSettings__FromFile__RawValid = Readonly<{
  linting?: ECMA_ScriptLogicProcessingSettings__FromFile__RawValid.Linting;
  entryPointsGroups: Readonly<{ [groupID: string]: ECMA_ScriptLogicProcessingSettings__FromFile__RawValid.EntryPointsGroup; }>;
}>;


/* eslint-disable-next-line @typescript-eslint/no-redeclare --
 * The merging of type/interface and namespace is completely valid TypeScript,
 * but @typescript-eslint community does not wish to support it.
 * https://github.com/eslint/eslint/issues/15504 */
namespace ECMA_ScriptLogicProcessingSettings__FromFile__RawValid {

  /* === Types ====================================================================================================== */
  export type Linting = Readonly<{
    presetFileRelativePath?: string;
    enable?: boolean;
  }>;

  export type EntryPointsGroup =
      SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.EntryPointsGroup &
      Readonly<{
        targetRuntime: EntryPointsGroup.Runtime;
        customReferenceName?: string;
        associatedMarkupEntryPointsGroupID_ForModulesDynamicLoadingWithoutDevelopmentServer?: string;
        typeScriptConfigurationFileRelativePath?: string;
        distributing?: EntryPointsGroup.Distributing;
        buildingModeDependent: Readonly<{
          [projectBuildingMode in ConsumingProjectPreDefinedBuildingModes]:
              EntryPointsGroup.EntryPointsGroupBuildingModeDependentSettings;
        }>;
      }>;

  export namespace EntryPointsGroup {

    export type Runtime = Runtime.Browser | Runtime.WebWorker | Runtime.NodeJS | Runtime.Pug;

    export namespace Runtime {

      export type Browser = Readonly<{ type: SupportedECMA_ScriptRuntimesTypes.browser; }>;

      export type WebWorker = Readonly<{ type: SupportedECMA_ScriptRuntimesTypes.webWorker; }>;

      export type NodeJS = Readonly<{
        type: SupportedECMA_ScriptRuntimesTypes.nodeJS;
        minimalVersion: Readonly<{
          major: number;
          minor?: number;
        }>;
      }>;

      export type Pug = Readonly<{ type: SupportedECMA_ScriptRuntimesTypes.pug; }>;

    }

    export type Distributing = Readonly<{
      exposingOfExportsFromEntryPoints?: Distributing.ExposingOfExportsFromEntryPoints;
      typeScriptTypesDeclarations?: Distributing.TypeScriptTypesDeclarations;
    }>;

    export namespace Distributing {

      export type ExposingOfExportsFromEntryPoints = Readonly<{
        mustExpose: boolean;
        namespace?: string;
      }>;

      export type TypeScriptTypesDeclarations = Readonly<{
        mustGenerate?: boolean;
        fileNameWithoutExtension?: string;
      }>;

    }


    export type EntryPointsGroupBuildingModeDependentSettings =
        SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.EntryPointsGroup.BuildingModeDependent &
        Readonly<{
          revisioning?: RevisioningSettings__FromFile__RawValid;
          dynamicallyLoadedFilesSubdirectory?: string;
          dynamicallyLoadedFilesNamesTemplate?: string;
        }>;

  }


  /* === Localization =============================================================================================== */
  export type Localization = {

    linting: Readonly<{ KEY: string; }>;

    entryPointsGroups: Readonly<{

      KEY: string;

      targetRuntime: Readonly<{
        KEY: string;
        type: Readonly<{ KEY: string; }>;
        minimalVersion: Readonly<{
          KEY: string;
          REQUIREMENT_CONDITION_DESCRIPTION: string;
          major: Readonly<{ KEY: string; }>;
          minor: Readonly<{ KEY: string; }>;
        }>;
      }>;

      customReferenceName: Readonly<{ KEY: string; }>;
      associatedMarkupEntryPointsGroupID_ForModulesDynamicLoadingWithoutDevelopmentServer: Readonly<{ KEY: string; }>;
      typeScriptConfigurationFileRelativePath: Readonly<{ KEY: string; }>;

      distributing: Readonly<{
        KEY: string;
        exposingOfExportsFromEntryPoints: {
          KEY: string;
          mustExpose: Readonly<{ readonly KEY: string; }>;
          namespace: Readonly<{ readonly KEY: string; }>;
        };
        typeScriptTypesDeclarations: Readonly<{
          KEY: string;
          mustGenerate: Readonly<{ KEY: string; }>;
          fileNameWithoutExtension: Readonly<{ KEY: string; }>;
        }>;
      }>;

      readonly buildingModeDependent: Readonly<{
        KEY: string;
        outputTopDirectoryRelativePath: Readonly<{ KEY: string; }>;
        revisioning: Readonly<{ KEY: string; }>;
        dynamicallyLoadedFilesSubdirectory: Readonly<{ KEY: string; }>;
        dynamicallyLoadedFilesNamesTemplate: Readonly<{ KEY: string; }>;
      }>;
    }>;
  };

  export function getLocalizedPropertiesSpecification(
    {
      ECMA_ScriptProcessingLocalization,
      sourceCodeProcessingSettingsGenericPropertiesLocalizedSpecification,
      consumingProjectLocalizedPreDefinedBuildingModes,
      revisioningPropertiesLocalizedSpecification,
      lintingCommonSettingsLocalizedPropertiesSpecification
    }: Readonly<{
      ECMA_ScriptProcessingLocalization: Localization;
      sourceCodeProcessingSettingsGenericPropertiesLocalizedSpecification:
          RawObjectDataProcessor.PropertiesSpecification;
      consumingProjectLocalizedPreDefinedBuildingModes: ConsumingProjectPreDefinedBuildingModes__Localized;
      revisioningPropertiesLocalizedSpecification: RawObjectDataProcessor.PropertiesSpecification;
      lintingCommonSettingsLocalizedPropertiesSpecification: RawObjectDataProcessor.PropertiesSpecification;
    }>
  ): RawObjectDataProcessor.PropertiesSpecification {

    return {

      [ECMA_ScriptProcessingLocalization.linting.KEY]: {
        newName: "linting",
        preValidationModifications: nullToUndefined,
        type: Object,
        required: false,
        properties: lintingCommonSettingsLocalizedPropertiesSpecification
      },

      [ECMA_ScriptProcessingLocalization.entryPointsGroups.KEY]: {

        newName: "entryPointsGroups",
        type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
        required: true,

        value: {

          type: Object,

          properties: {

            ...sourceCodeProcessingSettingsGenericPropertiesLocalizedSpecification,

            [ECMA_ScriptProcessingLocalization.entryPointsGroups.targetRuntime.KEY]: {
              newName: "targetRuntime",
              type: Object,
              required: true,
              properties: {
                [ECMA_ScriptProcessingLocalization.entryPointsGroups.targetRuntime.type.KEY]: {
                  newName: "type",
                  type: String,
                  required: true,
                  allowedAlternatives: Object.values(SupportedECMA_ScriptRuntimesTypes)
                },
                [ECMA_ScriptProcessingLocalization.entryPointsGroups.targetRuntime.minimalVersion.KEY]: {
                  newName: "minimalVersion",
                  type: Object,
                  requiredIf: {
                    predicate: (runtimeConfig: ArbitraryObject): boolean =>
                        runtimeConfig.type === SupportedECMA_ScriptRuntimesTypes.nodeJS,
                    descriptionForLogging: ECMA_ScriptProcessingLocalization.entryPointsGroups.targetRuntime.minimalVersion.
                        REQUIREMENT_CONDITION_DESCRIPTION
                  },
                  properties: {
                    major: {
                      type: Number,
                      required: true,
                      numbersSet: RawObjectDataProcessor.NumbersSets.naturalNumber
                    },
                    minor: {
                      type: Number,
                      required: false,
                      numbersSet: RawObjectDataProcessor.NumbersSets.naturalNumber
                    }
                  }
                }
              }
            },

            [ECMA_ScriptProcessingLocalization.entryPointsGroups.customReferenceName.KEY]: {
              newName: "customReferenceName",
              type: String,
              required: false,
              minimalCharactersCount: 1
            },

            [
              ECMA_ScriptProcessingLocalization.entryPointsGroups.
                  associatedMarkupEntryPointsGroupID_ForModulesDynamicLoadingWithoutDevelopmentServer.KEY
            ]: {
              newName: "associatedMarkupEntryPointsGroupID_ForModulesDynamicLoadingWithoutDevelopmentServer",
              type: String,
              required: false,
              minimalCharactersCount: 1
            },

            [ECMA_ScriptProcessingLocalization.entryPointsGroups.typeScriptConfigurationFileRelativePath.KEY]: {
              newName: "typeScriptConfigurationFileRelativePath",
              type: String,
              required: false,
              minimalCharactersCount: 1
            },

            [ECMA_ScriptProcessingLocalization.entryPointsGroups.distributing.KEY]: {
              newName: "distributing",
              type: Object,
              required: false,
              properties: {
                [ECMA_ScriptProcessingLocalization.entryPointsGroups.distributing.exposingOfExportsFromEntryPoints.KEY]: {
                  newName: "exposingOfExportsFromEntryPoints",
                  type: Object,
                  required: false,
                  properties: {
                    [
                      ECMA_ScriptProcessingLocalization.entryPointsGroups.distributing.
                          exposingOfExportsFromEntryPoints.mustExpose.KEY
                    ]: {
                      newName: "mustExpose",
                      type: Boolean,
                      required: true
                    },
                    [
                      ECMA_ScriptProcessingLocalization.entryPointsGroups.distributing.
                          exposingOfExportsFromEntryPoints.namespace.KEY
                    ]: {
                      newName: "namespace",
                      type: String,
                      required: false
                    }
                  }
                },
                [ECMA_ScriptProcessingLocalization.entryPointsGroups.distributing.typeScriptTypesDeclarations.KEY]: {
                  newName: "typeScriptTypesDeclarations",
                  type: Object,
                  required: false,
                  properties: {
                    [
                      ECMA_ScriptProcessingLocalization.entryPointsGroups.distributing.
                          typeScriptTypesDeclarations.mustGenerate.KEY
                    ]: {
                      newName: "mustGenerate",
                      type: Boolean,
                      required: false
                    },
                    [
                      ECMA_ScriptProcessingLocalization.entryPointsGroups.distributing.
                          typeScriptTypesDeclarations.fileNameWithoutExtension.KEY
                    ]: {
                      newName: "fileNameWithoutExtension",
                      type: String,
                      required: false
                    }
                  }
                }
              }
            },

            [ECMA_ScriptProcessingLocalization.entryPointsGroups.buildingModeDependent.KEY]: {

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

                  [
                    ECMA_ScriptProcessingLocalization.entryPointsGroups.
                        buildingModeDependent.outputTopDirectoryRelativePath.KEY
                  ]: {
                    newName: "outputTopDirectoryRelativePath",
                    type: String,
                    required: true
                  },

                  [ECMA_ScriptProcessingLocalization.entryPointsGroups.buildingModeDependent.revisioning.KEY]: {
                    newName: "revisioning",
                    type: Object,
                    required: false,
                    properties: revisioningPropertiesLocalizedSpecification
                  },

                  [
                    ECMA_ScriptProcessingLocalization.entryPointsGroups.
                        buildingModeDependent.dynamicallyLoadedFilesSubdirectory.KEY
                  ]: {
                    newName: "dynamicallyLoadedFilesSubdirectory",
                    type: String,
                    required: false,
                    minimalCharactersCount: 1
                  },

                  [
                    ECMA_ScriptProcessingLocalization.entryPointsGroups.
                        buildingModeDependent.dynamicallyLoadedFilesNamesTemplate.KEY
                  ]: {
                    newName: "dynamicallyLoadedFilesNamesTemplate",
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
    };

  }

}


export default ECMA_ScriptLogicProcessingSettings__FromFile__RawValid;
