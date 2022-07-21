import ConsumingProjectPreDefinedBuildingModes from
    "@ProjectBuilding:Common/Defaults/ConsumingProjectPreDefinedBuildingModes";
import ECMA_ScriptLogicProcessingRestrictions from "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingRestrictions";
import SupportedECMA_ScriptRuntimesTypes = ECMA_ScriptLogicProcessingRestrictions.SupportedECMA_ScriptRuntimesTypes;


export default {

  filePathAliasNotation: "@",

  entryPointsGroupDependent: {
    areExportsFromEntryPointsAccessible: false
  },

  revisioning: {

    mustExecute(
      namedParameters: { consumingProjectBuildingMode: string; targetRuntimeType: SupportedECMA_ScriptRuntimesTypes; }
    ): boolean {

      if (
        namedParameters.targetRuntimeType === SupportedECMA_ScriptRuntimesTypes.browser ||
        namedParameters.targetRuntimeType === SupportedECMA_ScriptRuntimesTypes.webWorker
      ) {
        return namedParameters.consumingProjectBuildingMode !== ConsumingProjectPreDefinedBuildingModes.development;
      }


      return false;
    },

    contentHashPostfixSeparator: "--"
  },

  linting: {
    mustExecute: false,
    isDisabledForEntryPointGroups: false
  },

  distributing: {
    exposingOfExportsFromEntryPoints: {
      mustExpose: false
    },
    typeScriptTypesDeclarations: {
      mustGenerate: false,
      fileNameWithoutExtension: "index.d.ts"
    }
  }
};
