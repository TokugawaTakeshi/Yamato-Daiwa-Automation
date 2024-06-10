/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import type ECMA_ScriptLogicProcessingRestrictions from "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingRestrictions";

/* ─── Normalized config ──────────────────────────────────────────────────────────────────────────────────────────── */
import type SourceCodeProcessingGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/SourceCodeProcessingGenericProperties__Normalized";
import type LintingSettings__Normalized from "@ProjectBuilding/Common/NormalizedConfig/LintingSettings__Normalized";
import type RevisioningSettings__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/Reusables/RevisioningSettings__Normalized";


type ECMA_ScriptLogicProcessingSettings__Normalized = Readonly<{
  common: ECMA_ScriptLogicProcessingSettings__Normalized.Common;
  linting: ECMA_ScriptLogicProcessingSettings__Normalized.Linting;
  relevantEntryPointsGroups: ReadonlyMap<
    SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup.ID,
    ECMA_ScriptLogicProcessingSettings__Normalized.EntryPointsGroup
  >;
  localDevelopmentServerOrchestration?: ECMA_ScriptLogicProcessingSettings__Normalized.LocalDevelopmentServerOrchestration;
  logging: ECMA_ScriptLogicProcessingSettings__Normalized.Logging;
}>;


namespace ECMA_ScriptLogicProcessingSettings__Normalized {

  export type Common = SourceCodeProcessingGenericProperties__Normalized.Common;


  export type Linting = LintingSettings__Normalized;


  export type EntryPointsGroup =
      SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup &
      Readonly<{
        targetRuntime: EntryPointsGroup.Runtime;
        associatedMarkupEntryPointsGroupID_ForDynamicModulesLoadingWithoutDevelopmentServer?: string;
        typeScriptConfigurationFileAbsolutePath: string;
        revisioning: RevisioningSettings__Normalized;
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
      externalizingDependencies: ReadonlyArray<Distributing.ExternalizingDependencies.PackageName>;
      typeScriptTypesDeclarations: Distributing.TypeScriptTypesDeclarations;
    }>;

    export namespace Distributing {

      export type ExposingOfExportsFromEntryPoints = Readonly<{
        mustExpose: boolean;
        namespace?: string;
        mustAssignToWindowObject: boolean;
      }>;

      export namespace ExternalizingDependencies {
        export type PackageName = string;
      }

      export type TypeScriptTypesDeclarations = Readonly<{
        mustGenerate: boolean;
        fileNameWithoutExtension: string;
      }>;

    }

  }


  export type LocalDevelopmentServerOrchestration = Readonly<{
    targetSourceFileAbsolutePath: string;
    arguments: ReadonlyArray<string>;
    environmentVariables: Readonly<{ [variableName: string]: string; }>;
  }>;


  export type Logging = Readonly<{

    filesPaths: boolean;
    filesCount: boolean;
    partialFilesAndParentEntryPointsCorrespondence: boolean;
    filesWatcherEvents: boolean;

    linting: Readonly<{
      starting: boolean;
      completionWithoutIssues: boolean;
    }>;

  }>;

}


export default ECMA_ScriptLogicProcessingSettings__Normalized;
