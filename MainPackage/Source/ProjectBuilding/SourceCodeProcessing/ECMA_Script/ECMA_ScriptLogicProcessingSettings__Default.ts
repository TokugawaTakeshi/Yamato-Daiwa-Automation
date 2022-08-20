import ConsumingProjectPreDefinedBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectPreDefinedBuildingModes";
import ECMA_ScriptLogicProcessingRestrictions from "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingRestrictions";
import SupportedECMA_ScriptRuntimesTypes = ECMA_ScriptLogicProcessingRestrictions.SupportedECMA_ScriptRuntimesTypes;


const ECMA_ScriptLogicProcessingSettings__Default: Readonly<{

  entryPointsGroupReferencePrefix: string;

  typeScriptConfigurationFileRelativePath: string;

  entryPointsGroupDependent: Readonly<{
    areExportsFromEntryPointsAccessible: boolean;
  }>;

  revisioning: Readonly<{
    mustExecute: (
      namedParameters: Readonly<{ consumingProjectBuildingMode: string; targetRuntimeType: SupportedECMA_ScriptRuntimesTypes; }>
    ) => boolean;
    contentHashPostfixSeparator: string;
  }>;

  linting: Readonly<{
    mustExecute: boolean;
  }>;

  distributing: Readonly<{
    exposingOfExportsFromEntryPoints: Readonly<{
      mustExpose: boolean;
    }>;
    typeScriptTypesDeclarations: Readonly<{
      mustGenerate: boolean;
      fileNameWithoutExtension: string;
    }>;
  }>;

}> = {

  entryPointsGroupReferencePrefix: "@",

  typeScriptConfigurationFileRelativePath: "tsconfig.json",

  entryPointsGroupDependent: {
    areExportsFromEntryPointsAccessible: false
  },

  revisioning: {

    mustExecute(
      namedParameters: Readonly<{ consumingProjectBuildingMode: string; targetRuntimeType: SupportedECMA_ScriptRuntimesTypes; }>
    ): boolean {

      if (
        namedParameters.targetRuntimeType === SupportedECMA_ScriptRuntimesTypes.browser ||
        namedParameters.targetRuntimeType === SupportedECMA_ScriptRuntimesTypes.webWorker
      ) {
        return namedParameters.consumingProjectBuildingMode !== ConsumingProjectPreDefinedBuildingModes.staticPreview &&
            namedParameters.consumingProjectBuildingMode !== ConsumingProjectPreDefinedBuildingModes.localDevelopment;
      }


      return false;
    },

    contentHashPostfixSeparator: "--"
  },

  linting: {
    mustExecute: true
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


export default ECMA_ScriptLogicProcessingSettings__Default;
