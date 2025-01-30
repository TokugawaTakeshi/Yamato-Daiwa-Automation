/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import ECMA_ScriptLogicProcessingRestrictions from "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingRestrictions";
import SupportedECMA_ScriptRuntimesTypes = ECMA_ScriptLogicProcessingRestrictions.SupportedECMA_ScriptRuntimesTypes;
import type ConsumingProjectBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";
import LintingSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/LintingSettings__FromFile__RawValid";

/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid from
    "@ProjectBuilding:Common/RawConfig/SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid";
import RevisioningSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/RevisioningSettings__FromFile__RawValid";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { RawObjectDataProcessor } from "@yamato-daiwa/es-extensions";
import type { ArbitraryObject } from "@yamato-daiwa/es-extensions";


type ECMA_ScriptLogicProcessingSettings__FromFile__RawValid = Readonly<{
  linting?: ECMA_ScriptLogicProcessingSettings__FromFile__RawValid.Linting;
  entryPointsGroups: Readonly<{ [groupID: string]: ECMA_ScriptLogicProcessingSettings__FromFile__RawValid.EntryPointsGroup; }>;
  localDevelopmentServerOrchestration?:
      ECMA_ScriptLogicProcessingSettings__FromFile__RawValid.LocalDevelopmentServerOrchestration;
  logging?: ECMA_ScriptLogicProcessingSettings__FromFile__RawValid.Logging;
}>;


namespace ECMA_ScriptLogicProcessingSettings__FromFile__RawValid {

  /* ━━━ Common ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
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


  /* ━━━ Entry Points Group ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
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


  /* ━━━ Local Development Server Orchestration ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type LocalDevelopmentServerOrchestration = Readonly<{
    targetSingularEntryPointsGroupID: string;
    arguments?: ReadonlyArray<string>;
    environmentVariables?: Readonly<{ [variableName: string]: string; }>;
    environmentVariablesFileRelativePath?: string;
  }>;


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

  }>;


  /* ━━━ Localization ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export const propertiesSpecification: RawObjectDataProcessor.PropertiesSpecification = {

    $linting: {
      newName: "linting",
      type: Object,
      isUndefinedForbidden: false,
      mustTransformNullToUndefined: true,
      properties: LintingSettings__FromFile__RawValid.propertiesSpecification
    },

    ...SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.generatePropertiesSpecification({

      entryPointsGroupBuildingModeIndependentSpecificSettingsLocalizedPropertiesSpecification: {

        $targetRuntime: {

          newName: "targetRuntime",
          type: Object,
          isUndefinedForbidden: true,
          isNullForbidden: true,

          properties: {

            $type: {
              newName: "type",
              type: String,
              isUndefinedForbidden: true,
              isNullForbidden: true,
              allowedAlternatives: Object.values(SupportedECMA_ScriptRuntimesTypes)
            },

            $minimalVersion: {

              newName: "minimalVersion",
              type: Object,
              undefinedForbiddenIf: {
                predicate: (runtimeConfig: ArbitraryObject): boolean =>
                    runtimeConfig.type === SupportedECMA_ScriptRuntimesTypes.nodeJS,
                descriptionForLogging: "Target runtime is NodeJS"
              },
              isNullForbidden: true,

              properties: {

                $major: {
                  newName: "major",
                  type: Number,
                  isUndefinedForbidden: true,
                  isNullForbidden: true,
                  numbersSet: RawObjectDataProcessor.NumbersSets.naturalNumber
                },

                $minor: {
                  newName: "minor",
                  type: Number,
                  isUndefinedForbidden: false,
                  isNullForbidden: true,
                  numbersSet: RawObjectDataProcessor.NumbersSets.naturalNumber
                }

              }

            }

          }

        },


        $associatedMarkupEntryPointsGroupID_ForDynamicModulesLoadingWithoutDevelopmentServer: {
          newName: "associatedMarkupEntryPointsGroupID_ForDynamicModulesLoadingWithoutDevelopmentServer",
          type: String,
          isUndefinedForbidden: false,
          isNullForbidden: true,
          minimalCharactersCount: 1
        },

        $typeScriptConfigurationFileRelativePath: {
          newName: "typeScriptConfigurationFileRelativePath",
          type: String,
          isUndefinedForbidden: false,
          isNullForbidden: true,
          minimalCharactersCount: 1
        },

        $distributing: {

          newName: "distributing",
          type: Object,
          isUndefinedForbidden: false,
          isNullForbidden: true,

          properties: {

            $exposingOfExportsFromEntryPoints: {

              newName: "exposingOfExportsFromEntryPoints",
              type: Object,
              isUndefinedForbidden: false,
              isNullForbidden: true,
              properties: {

                $mustExpose: {
                  newName: "mustExpose",
                  type: Boolean,
                  isUndefinedForbidden: true,
                  isNullForbidden: true
                },

                $namespace: {
                  newName: "namespace",
                  type: String,
                  isUndefinedForbidden: false,
                  isNullForbidden: true
                },

                $mustAssignToWindowObject: {
                  newName: "mustAssignToWindowObject",
                  type: String,
                  isUndefinedForbidden: false,
                  isNullForbidden: true
                }

              }

            },

            $externalizingDependencies: {
              newName: "externalizingDependencies",
              isUndefinedForbidden: false,
              mustTransformNullToUndefined: true,
              areUndefinedElementsForbidden: true,
              areNullElementsForbidden: true,
              type: Array,
              element: {
                type: String,
                minimalCharactersCount: 1
              }
            },

            $typeScriptTypesDeclarations: {

              newName: "typeScriptTypesDeclarations",
              type: Object,
              isUndefinedForbidden: false,
              mustTransformNullToUndefined: true,

              properties: {

                $mustGenerate: {
                  newName: "mustGenerate",
                  type: Boolean,
                  isUndefinedForbidden: false,
                  isNullForbidden: true
                },

                $fileNameWithoutExtension: {
                  newName: "fileNameWithoutExtension",
                  type: String,
                  isUndefinedForbidden: false,
                  isNullForbidden: true
                }

              }

            }

          }

        }

      },

      entryPointsGroupBuildingModeDependentSpecificSettingsLocalizedPropertiesSpecification: {

        $revisioning: {
          newName: "revisioning",
          type: Object,
          isUndefinedForbidden: false,
          mustTransformNullToUndefined: true,
          properties: RevisioningSettings__FromFile__RawValid.propertiesSpecification
        },

        $dynamicallyLoadedFilesSubdirectory: {
          newName: "dynamicallyLoadedFilesSubdirectory",
          type: String,
          isUndefinedForbidden: false,
          isNullForbidden: true,
          minimalCharactersCount: 1
        },

        $dynamicallyLoadedFilesNamesTemplate: {
          newName: "dynamicallyLoadedFilesNamesTemplate",
          type: String,
          isUndefinedForbidden: false,
          isNullForbidden: true,
          minimalCharactersCount: 1
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

        $linting: {

          newName: "linting",
          type: Object,
          isUndefinedForbidden: false,
          isNullForbidden: true,

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

    },

    $localDevelopmentServerOrchestration: {

      newName: "localDevelopmentServerOrchestration",
      type: Object,
      isUndefinedForbidden: false,
      mustTransformNullToUndefined: true,

      properties: {

        $targetSingularEntryPointsGroupID: {
          newName: "targetSingularEntryPointsGroupID",
          type: String,
          isUndefinedForbidden: true,
          isNullForbidden: true,
          minimalCharactersCount: 1
        },

        $arguments: {
          newName: "arguments",
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

        $environmentVariables: {
          newName: "environmentVariables",
          type: RawObjectDataProcessor.ValuesTypesIDs.associativeArray,
          isUndefinedForbidden: false,
          isNullForbidden: true,
          areUndefinedTypeValuesForbidden: true,
          areNullTypeValuesForbidden: true,
          value: {
            type: String,
            minimalCharactersCount: 1
          }
        },

        $environmentVariablesFileRelativePath: {
          newName: "environmentVariablesFileRelativePath",
          type: String,
          isUndefinedForbidden: false,
          isNullForbidden: true,
          minimalCharactersCount: 1
        }

      }

    }

  };

}


export default ECMA_ScriptLogicProcessingSettings__FromFile__RawValid;
