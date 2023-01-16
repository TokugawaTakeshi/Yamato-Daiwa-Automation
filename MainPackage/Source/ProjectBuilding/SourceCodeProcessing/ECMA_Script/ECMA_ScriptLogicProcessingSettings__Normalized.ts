/* --- Restrictions ------------------------------------------------------------------------------------------------- */
import type ECMA_ScriptLogicProcessingRestrictions from "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingRestrictions";

/* --- Normalized config -------------------------------------------------------------------------------------------- */
import type ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";


type ECMA_ScriptLogicProcessingSettings__Normalized = Readonly<{
  common: ECMA_ScriptLogicProcessingSettings__Normalized.Common;
  linting: ECMA_ScriptLogicProcessingSettings__Normalized.Linting;
  relevantEntryPointsGroups: ReadonlyMap<
    ProjectBuildingConfig__Normalized.EntryPointsGroupID, ECMA_ScriptLogicProcessingSettings__Normalized.EntryPointsGroup
  >;
}>;


/* eslint-disable-next-line @typescript-eslint/no-redeclare --
 * The merging of type/interface and namespace is completely valid TypeScript,
 * but @typescript-eslint community does not wish to support it.
 * https://github.com/eslint/eslint/issues/15504 */
namespace ECMA_ScriptLogicProcessingSettings__Normalized {

  export type Common = ProjectBuildingConfig__Normalized.SourceCodeProcessingCommonSettingsGenericProperties;


  export type Linting = Readonly<{
    presetFileAbsolutePath?: string;
    mustExecute: boolean;
  }>;


  export type EntryPointsGroup =
      ProjectBuildingConfig__Normalized.EntryPointsGroupGenericSettings &
      Readonly<{
        targetRuntime: EntryPointsGroup.Runtime;
        entryPointsSourceFilesTopDirectoryOrSingleFilePathAliasForReferencingFromHTML: string;
        associatedMarkupEntryPointsGroupID_ForModulesDynamicLoadingWithoutDevelopmentServer?: string;
        typeScriptConfigurationFileAbsolutePath: string;
        revisioning: ProjectBuildingConfig__Normalized.Revisioning;
        distributing?: EntryPointsGroup.Distributing;
      }>;

  export namespace EntryPointsGroup {

    export type Runtime = Runtime.Browser | Runtime.WebWorker | Runtime.NodeJS | Runtime.Pug;

    export namespace Runtime {

      export type Browser = Readonly<{
        type: ECMA_ScriptLogicProcessingRestrictions.SupportedECMA_ScriptRuntimesTypes.browser;
      }>;

      export type WebWorker = Readonly<{
        type: ECMA_ScriptLogicProcessingRestrictions.SupportedECMA_ScriptRuntimesTypes.webWorker;
      }>;

      export type NodeJS = Readonly<{
        type: ECMA_ScriptLogicProcessingRestrictions.SupportedECMA_ScriptRuntimesTypes.nodeJS;
        minimalVersion: Readonly<{
          major: number;
          minor?: number;
        }>;
      }>;

      export type Pug = Readonly<{ type: ECMA_ScriptLogicProcessingRestrictions.SupportedECMA_ScriptRuntimesTypes.pug; }>;

    }

    export type Distributing = Readonly<{
      exposingOfExportsFromEntryPoints: Distributing.ExposingOfExportsFromEntryPoints;
      typeScriptTypesDeclarations: Distributing.TypeScriptTypesDeclarations;
    }>;

    export namespace Distributing {

      export type ExposingOfExportsFromEntryPoints = Readonly<{
        mustExpose: boolean;
        namespace?: string;
      }>;

      export type TypeScriptTypesDeclarations = Readonly<{
        mustGenerate: boolean;
        fileNameWithoutExtension: string;
      }>;
    }

  }

}


export default ECMA_ScriptLogicProcessingSettings__Normalized;
