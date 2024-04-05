/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import ECMA_ScriptLogicProcessingRestrictions from "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingRestrictions";
import SupportedECMA_ScriptRuntimesTypes = ECMA_ScriptLogicProcessingRestrictions.SupportedECMA_ScriptRuntimesTypes;
import type ConsumingProjectBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";
import type ConsumingProjectPreDefinedBuildingModes__Localized from
    "@ProjectBuilding/Common/RawConfig/Enumerations/ConsumingProjectPreDefinedBuildingModes__Localized";
import type LintingSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/LintingSettings__FromFile__RawValid";

/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid from
    "@ProjectBuilding:Common/RawConfig/SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid";
import type RevisioningSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/RevisioningSettings__FromFile__RawValid";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { RawObjectDataProcessor, nullToUndefined } from "@yamato-daiwa/es-extensions";
import type { ArbitraryObject } from "@yamato-daiwa/es-extensions";


type ECMA_ScriptLogicProcessingSettings__FromFile__RawValid = Readonly<{
  linting?: ECMA_ScriptLogicProcessingSettings__FromFile__RawValid.Linting;
  entryPointsGroups: Readonly<{ [groupID: string]: ECMA_ScriptLogicProcessingSettings__FromFile__RawValid.EntryPointsGroup; }>;
  localDevelopmentServerOrchestration?:
      ECMA_ScriptLogicProcessingSettings__FromFile__RawValid.LocalDevelopmentServerOrchestration;
  logging?: ECMA_ScriptLogicProcessingSettings__FromFile__RawValid.Logging;
}>;


namespace ECMA_ScriptLogicProcessingSettings__FromFile__RawValid {

  /* ━━━ Types ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type Linting = LintingSettings__FromFile__RawValid;

  export type EntryPointsGroup =
      SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.EntryPointsGroup &
      Readonly<{
        targetRuntime: EntryPointsGroup.Runtime;
        associatedMarkupEntryPointsGroupID_ForDynamicModulesLoadingWithoutDevelopmentServer?: string;
        typeScriptConfigurationFileRelativePath?: string;
        distributing?: EntryPointsGroup.Distributing;
        buildingModeDependent: Readonly<{
          [projectBuildingMode in ConsumingProjectBuildingModes]:
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
      externalizingDependencies?: ReadonlyArray<Distributing.ExternalizingDependencies.PackageName>;
      typeScriptTypesDeclarations?: Distributing.TypeScriptTypesDeclarations;
    }>;

    export namespace Distributing {

      export type ExposingOfExportsFromEntryPoints = Readonly<{
        mustExpose: boolean;
        namespace?: string;
        mustAssignToWindowObject?: boolean;
      }>;

      export namespace ExternalizingDependencies {
        export type PackageName = string;
      }

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


  export type LocalDevelopmentServerOrchestration = Readonly<{
    targetSingularEntryPointsGroupID: string;
    arguments?: ReadonlyArray<string>;
    environmentVariables?: Readonly<{ [variableName: string]: string; }>;
  }>;


  export type Logging = Readonly<{

    filesPaths?: boolean;
    filesCount?: boolean;
    partialFilesAndParentEntryPointsCorrespondence?: boolean;
    filesWatcherEvents?: boolean;

    linting: Readonly<{
      starting?: boolean;
      completionWithoutIssues?: boolean;
    }>;

  }>;


  /* ━━━ Localization ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
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

      referenceCustomAliasName: Readonly<{ KEY: string; }>;
      associatedMarkupEntryPointsGroupID_ForDynamicModulesLoadingWithoutDevelopmentServer: Readonly<{ KEY: string; }>;
      typeScriptConfigurationFileRelativePath: Readonly<{ KEY: string; }>;

      distributing: Readonly<{

        KEY: string;

        exposingOfExportsFromEntryPoints: Readonly<{
          KEY: string;
          mustExpose: Readonly<{ readonly KEY: string; }>;
          namespace: Readonly<{ readonly KEY: string; }>;
          mustAssignToWindowObject: Readonly<{ readonly KEY: string; }>;
        }>;

        externalizingDependencies: Readonly<{ KEY: string; }>;

        typeScriptTypesDeclarations: Readonly<{
          KEY: string;
          mustGenerate: Readonly<{ KEY: string; }>;
          fileNameWithoutExtension: Readonly<{ KEY: string; }>;
        }>;

      }>;

      buildingModeDependent: Readonly<{
        KEY: string;
        outputTopDirectoryRelativePath: Readonly<{ KEY: string; }>;
        revisioning: Readonly<{ KEY: string; }>;
        dynamicallyLoadedFilesSubdirectory: Readonly<{ KEY: string; }>;
        dynamicallyLoadedFilesNamesTemplate: Readonly<{ KEY: string; }>;
      }>;

    }>;

    localDevelopmentServerOrchestration: {
      KEY: string;
      targetSingularEntryPointsGroupID: Readonly<{ KEY: string; }>;
      arguments: Readonly<{ KEY: string; }>;
      environmentVariables: Readonly<{ KEY: string; }>;
    };

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

    }>;

  };

  export function getLocalizedPropertiesSpecification(
    {
      ECMA_ScriptProcessingPropertiesLocalization,
      localizedConsumingProjectLocalizedPreDefinedBuildingModes,
      lintingSettingsLocalizedPropertiesSpecification,
      revisioningSettingsLocalizedPropertiesSpecification,
      sourceCodeProcessingSettingsGenericPropertiesLocalization,
      entryPointsGroupBuildingModeDependentOutputGenericSettingsLocalizedPropertiesSpecification
    }: Readonly<{
      ECMA_ScriptProcessingPropertiesLocalization: Localization;
      localizedConsumingProjectLocalizedPreDefinedBuildingModes: ConsumingProjectPreDefinedBuildingModes__Localized;
      lintingSettingsLocalizedPropertiesSpecification: RawObjectDataProcessor.PropertiesSpecification;
      revisioningSettingsLocalizedPropertiesSpecification: RawObjectDataProcessor.PropertiesSpecification;
      sourceCodeProcessingSettingsGenericPropertiesLocalization:
          SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.Localization;
      entryPointsGroupBuildingModeDependentOutputGenericSettingsLocalizedPropertiesSpecification:
          RawObjectDataProcessor.PropertiesSpecification;
    }>
  ): RawObjectDataProcessor.PropertiesSpecification {

    return {

      [ECMA_ScriptProcessingPropertiesLocalization.linting.KEY]: {
        newName: "linting",
        preValidationModifications: nullToUndefined,
        type: Object,
        required: false,
        properties: lintingSettingsLocalizedPropertiesSpecification
      },

      ...SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.getLocalizedPropertiesSpecification({

        sourceCodeProcessingSettingsGenericPropertiesLocalization,

        localizedConsumingProjectLocalizedPreDefinedBuildingModes,

        entryPointsGroupBuildingModeIndependentSpecificSettingsLocalizedPropertiesSpecification: {

          [ECMA_ScriptProcessingPropertiesLocalization.entryPointsGroups.targetRuntime.KEY]: {

            newName: "targetRuntime",
            type: Object,
            required: true,

            properties: {

              [ECMA_ScriptProcessingPropertiesLocalization.entryPointsGroups.targetRuntime.type.KEY]: {
                newName: "type",
                type: String,
                required: true,
                allowedAlternatives: Object.values(SupportedECMA_ScriptRuntimesTypes)
              },

              [ECMA_ScriptProcessingPropertiesLocalization.entryPointsGroups.targetRuntime.minimalVersion.KEY]: {

                newName: "minimalVersion",
                type: Object,
                requiredIf: {
                  predicate: (runtimeConfig: ArbitraryObject): boolean =>
                      runtimeConfig.type === SupportedECMA_ScriptRuntimesTypes.nodeJS,
                  descriptionForLogging: ECMA_ScriptProcessingPropertiesLocalization.entryPointsGroups.targetRuntime.
                      minimalVersion.REQUIREMENT_CONDITION_DESCRIPTION
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
            ECMA_ScriptProcessingPropertiesLocalization.entryPointsGroups.
                associatedMarkupEntryPointsGroupID_ForDynamicModulesLoadingWithoutDevelopmentServer.KEY
          ]: {
            newName: "associatedMarkupEntryPointsGroupID_ForDynamicModulesLoadingWithoutDevelopmentServer",
            type: String,
            required: false,
            minimalCharactersCount: 1
          },

          [ECMA_ScriptProcessingPropertiesLocalization.entryPointsGroups.typeScriptConfigurationFileRelativePath.KEY]: {
            newName: "typeScriptConfigurationFileRelativePath",
            type: String,
            required: false,
            minimalCharactersCount: 1
          },

          [ECMA_ScriptProcessingPropertiesLocalization.entryPointsGroups.distributing.KEY]: {

            newName: "distributing",
            type: Object,
            required: false,
            properties: {

              [
                ECMA_ScriptProcessingPropertiesLocalization.entryPointsGroups.distributing.
                    exposingOfExportsFromEntryPoints.KEY
              ]: {

                newName: "exposingOfExportsFromEntryPoints",
                type: Object,
                required: false,
                properties: {

                  [
                    ECMA_ScriptProcessingPropertiesLocalization.entryPointsGroups.distributing.
                        exposingOfExportsFromEntryPoints.mustExpose.KEY
                  ]: {
                    newName: "mustExpose",
                    type: Boolean,
                    required: true
                  },

                  [
                    ECMA_ScriptProcessingPropertiesLocalization.entryPointsGroups.distributing.
                       exposingOfExportsFromEntryPoints.namespace.KEY
                  ]: {
                    newName: "namespace",
                    type: String,
                    required: false
                  },

                  [
                    ECMA_ScriptProcessingPropertiesLocalization.entryPointsGroups.distributing.
                        exposingOfExportsFromEntryPoints.mustAssignToWindowObject.KEY
                  ]: {
                    newName: "mustAssignToWindowObject",
                    type: String,
                    required: false
                  }

                }

              },

              [ECMA_ScriptProcessingPropertiesLocalization.entryPointsGroups.distributing.externalizingDependencies.KEY]: {
                newName: "externalizingDependencies",
                required: false,
                type: Array,
                preValidationModifications: nullToUndefined,
                element: {
                  type: String,
                  minimalCharactersCount: 1
                }
              },

              [ECMA_ScriptProcessingPropertiesLocalization.entryPointsGroups.distributing.typeScriptTypesDeclarations.KEY]: {

                newName: "typeScriptTypesDeclarations",
                type: Object,
                required: false,

                properties: {
                  [
                    ECMA_ScriptProcessingPropertiesLocalization.entryPointsGroups.distributing.
                        typeScriptTypesDeclarations.mustGenerate.KEY
                  ]: {
                    newName: "mustGenerate",
                    type: Boolean,
                    required: false
                  },
                  [
                    ECMA_ScriptProcessingPropertiesLocalization.entryPointsGroups.distributing.
                        typeScriptTypesDeclarations.fileNameWithoutExtension.KEY
                  ]: {
                    newName: "fileNameWithoutExtension",
                    type: String,
                    required: false
                  }
                }

              }

            }

          }

        },

        entryPointsGroupBuildingModeDependentOutputGenericSettingsLocalizedPropertiesSpecification,

        entryPointsGroupBuildingModeDependentSpecificSettingsLocalizedPropertiesSpecification: {

          [ECMA_ScriptProcessingPropertiesLocalization.entryPointsGroups.buildingModeDependent.revisioning.KEY]: {
            newName: "revisioning",
            type: Object,
            required: false,
            preValidationModifications: nullToUndefined,
            properties: revisioningSettingsLocalizedPropertiesSpecification
          },

          [
            ECMA_ScriptProcessingPropertiesLocalization.entryPointsGroups.buildingModeDependent.
                dynamicallyLoadedFilesSubdirectory.KEY
          ]: {
            newName: "dynamicallyLoadedFilesSubdirectory",
            type: String,
            required: false,
            minimalCharactersCount: 1
          },

          [
            ECMA_ScriptProcessingPropertiesLocalization.entryPointsGroups.buildingModeDependent.
                dynamicallyLoadedFilesNamesTemplate.KEY
          ]: {
            newName: "dynamicallyLoadedFilesNamesTemplate",
            type: String,
            required: false,
            minimalCharactersCount: 1
          }

        }

      }),

      [ECMA_ScriptProcessingPropertiesLocalization.logging.KEY]: {

        newName: "logging",
        type: Object,
        required: false,
        preValidationModifications: nullToUndefined,

        properties: {

          [ECMA_ScriptProcessingPropertiesLocalization.logging.filesPaths.KEY]: {
            newName: "filesPaths",
            type: Boolean,
            required: false
          },

          [ECMA_ScriptProcessingPropertiesLocalization.logging.filesCount.KEY]: {
            newName: "filesCount",
            type: Boolean,
            required: false
          },

          [ECMA_ScriptProcessingPropertiesLocalization.logging.partialFilesAndParentEntryPointsCorrespondence.KEY]: {
            newName: "partialFilesAndParentEntryPointsCorrespondence",
            type: Boolean,
            required: false
          },


          [ECMA_ScriptProcessingPropertiesLocalization.logging.filesWatcherEvents.KEY]: {
            newName: "filesWatcherEvents",
            type: Boolean,
            required: false
          },

          [ECMA_ScriptProcessingPropertiesLocalization.logging.linting.KEY]: {

            newName: "linting",
            type: Object,
            required: false,
            preValidationModifications: nullToUndefined,

            properties: {

              [ECMA_ScriptProcessingPropertiesLocalization.logging.linting.starting.KEY]: {
                newName: "starting",
                type: Boolean,
                required: false
              },

              [ECMA_ScriptProcessingPropertiesLocalization.logging.linting.completionWithoutIssues.KEY]: {
                newName: "completionWithoutIssues",
                type: Boolean,
                required: false
              }

            }

          }

        }

      },

      [ECMA_ScriptProcessingPropertiesLocalization.localDevelopmentServerOrchestration.KEY]: {

        newName: "localDevelopmentServerOrchestration",
        type: Object,
        required: false,
        preValidationModifications: nullToUndefined,

        properties: {

          [
            ECMA_ScriptProcessingPropertiesLocalization.localDevelopmentServerOrchestration.
                targetSingularEntryPointsGroupID.KEY
          ]: {
            type: String,
            required: true,
            minimalCharactersCount: 1
          },

          [ECMA_ScriptProcessingPropertiesLocalization.localDevelopmentServerOrchestration.arguments.KEY]: {
            type: Array,
            required: false,
            element: {
              type: String,
              minimalCharactersCount: 1
            }
          },

          [ECMA_ScriptProcessingPropertiesLocalization.localDevelopmentServerOrchestration.environmentVariables.KEY]: {
            type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
            required: false,
            value: {
              type: String,
              minimalCharactersCount: 1
            }
          }

        }
      }

    };

  }

}


export default ECMA_ScriptLogicProcessingSettings__FromFile__RawValid;
