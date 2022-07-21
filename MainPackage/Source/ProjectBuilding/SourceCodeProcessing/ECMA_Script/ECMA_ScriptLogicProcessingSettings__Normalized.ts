/* --- Restrictions ------------------------------------------------------------------------------------------------- */
import type ECMA_ScriptLogicProcessingRestrictions from "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingRestrictions";

/* --- Normalized config -------------------------------------------------------------------------------------------- */
import type ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";


type ECMA_ScriptLogicProcessingSettings__Normalized = {
  readonly common: ECMA_ScriptLogicProcessingSettings__Normalized.Common;
  readonly linting: ECMA_ScriptLogicProcessingSettings__Normalized.Linting;
  readonly entryPointsGroups: Map<
    ProjectBuildingConfig__Normalized.EntryPointsGroupID, ECMA_ScriptLogicProcessingSettings__Normalized.EntryPointsGroup
  >;
};


/* eslint-disable-next-line @typescript-eslint/no-redeclare --
 * The merging of type/interface and namespace is completely valid TypeScript,
 * but @typescript-eslint community does not wish to support it.
 * https://github.com/eslint/eslint/issues/15504 */
namespace ECMA_ScriptLogicProcessingSettings__Normalized {

  export type Common =
      ProjectBuildingConfig__Normalized.SourceCodeProcessingCommonSettingsGenericProperties &
      {
        readonly directoriesAliasesAbsolutePaths?: { [directoryAlias: string]: string | undefined; };
        readonly directoriesAliasesRelativePaths?: { [directoryAlias: string]: string | undefined; };
      };

  export type Linting = {
    readonly presetFileAbsolutePath?: string;
    readonly isCompletelyDisabled: boolean;
  };

  export type EntryPointsGroup =
      ProjectBuildingConfig__Normalized.EntryPointsGroupGenericSettings &
      {
        readonly targetRuntime: EntryPointsGroup.Runtime;
        readonly entryPointsSourceFilesTopDirectoryOrSingleFilePathAliasForReferencingFromHTML: string;
        readonly associatedMarkupEntryPointsGroupID_ForModulesDynamicLoadingWithoutDevelopmentServer?: string;
        readonly typeScriptConfigurationFileAbsolutePath?: string;
        readonly revisioning: ProjectBuildingConfig__Normalized.Revisioning;
        readonly distributing?: EntryPointsGroup.Distributing;
      };

  export namespace EntryPointsGroup {

    export type Runtime = Runtime.Browser | Runtime.WebWorker | Runtime.NodeJS | Runtime.Pug;

    export namespace Runtime {

      export type Browser = {
        readonly type: ECMA_ScriptLogicProcessingRestrictions.SupportedECMA_ScriptRuntimesTypes.browser;
      };

      export type WebWorker = {
        readonly type: ECMA_ScriptLogicProcessingRestrictions.SupportedECMA_ScriptRuntimesTypes.webWorker;
      };

      export type NodeJS = {
        readonly type: ECMA_ScriptLogicProcessingRestrictions.SupportedECMA_ScriptRuntimesTypes.nodeJS;
        readonly minimalVersion: {
          readonly major: number;
          readonly minor?: number;
        };
      };

      export type Pug = {
        readonly type: ECMA_ScriptLogicProcessingRestrictions.SupportedECMA_ScriptRuntimesTypes.pug;
      };
    }

    export type Distributing = {
      readonly exposingOfExportsFromEntryPoints: Distributing.ExposingOfExportsFromEntryPoints;
      readonly typeScriptTypesDeclarations: Distributing.TypeScriptTypesDeclarations;
    };

    export namespace Distributing {

      export type ExposingOfExportsFromEntryPoints = {
        readonly mustExpose: boolean;
        readonly namespace?: string;
      };

      export type TypeScriptTypesDeclarations = {
        readonly mustGenerate: boolean;
        readonly fileNameWithoutExtension: string;
      };
    }
  }
}


export default ECMA_ScriptLogicProcessingSettings__Normalized;
