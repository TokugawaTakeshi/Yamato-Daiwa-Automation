/* --- Restrictions ------------------------------------------------------------------------------------------------- */
import ECMA_ScriptLogicProcessingRestrictions from "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingRestrictions";
import SupportedECMA_ScriptRuntimesTypes = ECMA_ScriptLogicProcessingRestrictions.SupportedECMA_ScriptRuntimesTypes;

/* --- Default settings --------------------------------------------------------------------------------------------- */
import ConsumingProjectPreDefinedBuildingModes from
    "@ProjectBuilding/Common/Defaults/ConsumingProjectPreDefinedBuildingModes";
import type ConsumingProjectPreDefinedBuildingModes__Localized from
    "@ProjectBuilding/Common/RawConfig/Enumerations/ConsumingProjectPreDefinedBuildingModes__Localized";

/* --- Raw valid config --------------------------------------------------------------------------------------------- */
import type SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid from
    "@ProjectBuilding:Common/RawConfig/SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid";
import type RevisioningSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/RevisioningSettings__FromFile__RawValid";

/* --- General auxiliaries ------------------------------------------------------------------------------------------ */
import type { ArbitraryObject } from "@yamato-daiwa/es-extensions";
import { RawObjectDataProcessor, nullToUndefined } from "@yamato-daiwa/es-extensions";


type ECMA_ScriptLogicProcessingSettings__FromFile__RawValid = {
  readonly common?: ECMA_ScriptLogicProcessingSettings__FromFile__RawValid.Common;
  readonly linting?: ECMA_ScriptLogicProcessingSettings__FromFile__RawValid.Linting;
  readonly entryPointsGroups: {
    readonly [groupID: string]: ECMA_ScriptLogicProcessingSettings__FromFile__RawValid.EntryPointsGroup;
  };
};


/* eslint-disable-next-line @typescript-eslint/no-redeclare --
 * The merging of type/interface and namespace is completely valid TypeScript,
 * but @typescript-eslint community does not wish to support it.
 * https://github.com/eslint/eslint/issues/15504 */
namespace ECMA_ScriptLogicProcessingSettings__FromFile__RawValid {

  /* === Types ====================================================================================================== */
  export type Common = {
    readonly directoriesRelativePathsAliases?: { [directoryAlias: string]: string; };
  };

  export type Linting = {
    readonly presetFileRelativePath?: string;
    readonly disableCompletely?: boolean;
  };

  export type EntryPointsGroup =
      Omit<SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.EntryPointsGroup, "partialsRecognition"> &
      {
        readonly targetRuntime: EntryPointsGroup.Runtime;
        readonly entryPointsSourceFilesTopDirectoryOrSingleFilePathAliasNameForReferencingFromHTML?: string;
        readonly associatedMarkupEntryPointsGroupID_ForModulesDynamicLoadingWithoutDevelopmentServer?: string;
        readonly typeScriptConfigurationFileRelativePath?: string;
        readonly linting?: EntryPointsGroup.Linting;
        readonly distributing?: EntryPointsGroup.Distributing;
        readonly buildingModeDependent: {
          [projectBuildingMode: string]: EntryPointsGroup.EntryPointsGroupBuildingModeDependentSettings;
        };
      };

  export namespace EntryPointsGroup {

    export type Runtime = Runtime.Browser | Runtime.WebWorker | Runtime.NodeJS | Runtime.Pug;

    export namespace Runtime {

      export type Browser = {
        readonly type: SupportedECMA_ScriptRuntimesTypes.browser;
      };

      export type WebWorker = {
        readonly type: SupportedECMA_ScriptRuntimesTypes.webWorker;
      };

      export type NodeJS = {
        readonly type: SupportedECMA_ScriptRuntimesTypes.nodeJS;
        readonly minimalVersion: {
          readonly major: number;
          readonly minor?: number;
        };
      };

      export type Pug = {
        readonly type: SupportedECMA_ScriptRuntimesTypes.pug;
      };
    }

    /* eslint-disable-next-line @typescript-eslint/no-shadow --
     * The declaring of type/interface inside namespace with same name as defined in upper scope
     * is completely valid TypeScript and not desired to be warned by @typescript-eslint. */
    export type Linting = {
      readonly disable?: boolean;
    };


    export type Distributing = {
      readonly exposingOfExportsFromEntryPoints?: Distributing.ExposingOfExportsFromEntryPoints;
      readonly typeScriptTypesDeclarations?: Distributing.TypeScriptTypesDeclarations;
    };

    export namespace Distributing {

      export type ExposingOfExportsFromEntryPoints = {
        readonly mustExpose: boolean;
        readonly namespace?: string;
      };

      export type TypeScriptTypesDeclarations = {
        readonly mustGenerate?: boolean;
        readonly fileNameWithoutExtension?: string;
      };
    }


    export type EntryPointsGroupBuildingModeDependentSettings =
        SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.EntryPointsGroup.BuildingModeDependent &
        {
          readonly revisioning?: RevisioningSettings__FromFile__RawValid;
          readonly dynamicallyLoadedFilesSubdirectory?: string;
          readonly dynamicallyLoadedFilesNamesTemplate?: string;
        };
  }


  /* === Localization =============================================================================================== */
  export type Localization = {

    readonly common: {
      readonly KEY: string;
      readonly directoriesRelativePathsAliases: { KEY: string; };
    };

    readonly linting: {
      readonly KEY: string;
    };

    readonly entryPointsGroups: {

      readonly KEY: string;

      readonly targetRuntime: {
        readonly KEY: string;
        readonly type: { KEY: string; };
        readonly minimalVersion: {
          readonly KEY: string;
          readonly REQUIREMENT_CONDITION_DESCRIPTION: string;
          readonly major: { KEY: string; };
          readonly minor: { KEY: string; };
        };
      };

      readonly entryPointsSourceFilesTopDirectoryOrSingleFilePathAliasNameForReferencingFromHTML: { KEY: string; };
      readonly associatedMarkupEntryPointsGroupID_ForModulesDynamicLoadingWithoutDevelopmentServer: { KEY: string; };
      readonly typeScriptConfigurationFileRelativePath: { KEY: string; };

      readonly linting: {
        readonly KEY: string;
        readonly disable: { KEY: string; };
      };

      readonly distributing: {
        readonly KEY: string;
        readonly exposingOfExportsFromEntryPoints: {
          readonly KEY: string;
          readonly mustExpose: { readonly KEY: string; };
          readonly namespace: { readonly KEY: string; };
        };
        readonly typeScriptTypesDeclarations: {
          readonly KEY: string;
          readonly mustGenerate: { readonly KEY: string; };
          readonly fileNameWithoutExtension: { readonly KEY: string; };
        };
      };

      readonly buildingModeDependent: {
        readonly KEY: string;
        readonly outputBaseDirectoryRelativePath: { KEY: string; };
        readonly revisioning: { KEY: string; };
        readonly dynamicallyLoadedFilesSubdirectory: { KEY: string; };
        readonly dynamicallyLoadedFilesNamesTemplate: { KEY: string; };
      };
    };
  };

  export function getLocalizedPropertiesSpecification(
    {
      ECMA_ScriptProcessingLocalization,
      sourceCodeProcessingSettingsGenericPropertiesLocalization,
      sourceCodeProcessingSettingsGenericPropertiesLocalizedSpecification,
      consumingProjectLocalizedPreDefinedBuildingModes,
      revisioningPropertiesLocalizedSpecification,
      lintingCommonSettingsLocalizedPropertiesSpecification
    }: {
      readonly ECMA_ScriptProcessingLocalization: Localization;
      readonly sourceCodeProcessingSettingsGenericPropertiesLocalization:
          SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.Localization;
      readonly sourceCodeProcessingSettingsGenericPropertiesLocalizedSpecification:
          RawObjectDataProcessor.PropertiesSpecification;
      readonly consumingProjectLocalizedPreDefinedBuildingModes: ConsumingProjectPreDefinedBuildingModes__Localized;
      readonly revisioningPropertiesLocalizedSpecification: RawObjectDataProcessor.PropertiesSpecification;
      readonly lintingCommonSettingsLocalizedPropertiesSpecification: RawObjectDataProcessor.PropertiesSpecification;
    }
  ): RawObjectDataProcessor.PropertiesSpecification {

    return {

      [ECMA_ScriptProcessingLocalization.common.KEY]: {

        newName: "common",
        preValidationModifications: nullToUndefined,
        type: Object,
        required: false,

        properties: {

          [ECMA_ScriptProcessingLocalization.common.directoriesRelativePathsAliases.KEY]: {

            newName: "directoriesRelativePathsAliases",
            type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
            required: false,

            value: {
              type: String,
              minimalCharactersCount: 1
            }
          }
        }
      },

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

            [
              sourceCodeProcessingSettingsGenericPropertiesLocalization.
                  entryPointsSourceFilesTopDirectoryOrSingleFileRelativePath.KEY
            ]:
                sourceCodeProcessingSettingsGenericPropertiesLocalizedSpecification[
                  sourceCodeProcessingSettingsGenericPropertiesLocalization.
                      entryPointsSourceFilesTopDirectoryOrSingleFileRelativePath.KEY
                ],

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

            [
              ECMA_ScriptProcessingLocalization.entryPointsGroups.
                  entryPointsSourceFilesTopDirectoryOrSingleFilePathAliasNameForReferencingFromHTML.KEY
            ]: {
              newName: "entryPointsSourceFilesTopDirectoryOrSingleFilePathAliasNameForReferencingFromHTML",
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

            [ECMA_ScriptProcessingLocalization.entryPointsGroups.linting.KEY]: {
              newName: "linting",
              preValidationModifications: nullToUndefined,
              type: Object,
              required: false,
              properties: {
                [ECMA_ScriptProcessingLocalization.entryPointsGroups.linting.disable.KEY]: {
                  newName: "disable",
                  type: Boolean,
                  required: false
                }
              }
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
                    ECMA_ScriptProcessingLocalization.entryPointsGroups.
                        buildingModeDependent.outputBaseDirectoryRelativePath.KEY
                  ]: {
                    newName: "outputBaseDirectoryRelativePath",
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
