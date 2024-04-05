import ConsumingProjectBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";
import ECMA_ScriptLogicProcessingRestrictions from "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingRestrictions";
import SupportedECMA_ScriptRuntimesTypes = ECMA_ScriptLogicProcessingRestrictions.SupportedECMA_ScriptRuntimesTypes;


const ECMA_ScriptLogicProcessingSettings__Default: Readonly<{

  typeScriptConfigurationFileRelativePath: string;

  entryPointsGroupDependent: Readonly<{
    areExportsFromEntryPointsAccessible: boolean;
  }>;

  revisioning: Readonly<{
    mustExecute: (
      compoundParameter: Readonly<{
        consumingProjectBuildingMode: ConsumingProjectBuildingModes;
        targetRuntimeType: SupportedECMA_ScriptRuntimesTypes;
      }>
    ) => boolean;
    contentHashPostfixSeparator: string;
  }>;

  linting: Readonly<{
    mustExecute: boolean;
  }>;

  distributing: Readonly<{

    exposingOfExportsFromEntryPoints: Readonly<{
      mustExpose: boolean;
      mustAssignToWindowObject: boolean;
    }>;

    typeScriptTypesDeclarations: Readonly<{
      mustGenerate: boolean;
      fileNameWithoutExtension: string;
    }>;

  }>;

  logging: {

    filesPaths: boolean;
    filesCount: boolean;
    partialFilesAndParentEntryPointsCorrespondence: boolean;
    filesWatcherEvents: boolean;

    linting: Readonly<{
      starting: boolean;
      completionWithoutIssues: boolean;
    }>;

  };

}> = {

  typeScriptConfigurationFileRelativePath: "tsconfig.json",

  entryPointsGroupDependent: {
    areExportsFromEntryPointsAccessible: false
  },

  revisioning: {

    mustExecute(
      compoundParameter: Readonly<{
        consumingProjectBuildingMode: ConsumingProjectBuildingModes;
        targetRuntimeType: SupportedECMA_ScriptRuntimesTypes;
      }>
    ): boolean {

      if (
        compoundParameter.targetRuntimeType === SupportedECMA_ScriptRuntimesTypes.browser ||
        compoundParameter.targetRuntimeType === SupportedECMA_ScriptRuntimesTypes.webWorker
      ) {
        return compoundParameter.consumingProjectBuildingMode !== ConsumingProjectBuildingModes.staticPreview &&
            compoundParameter.consumingProjectBuildingMode !== ConsumingProjectBuildingModes.localDevelopment;
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
      mustExpose: false,
      mustAssignToWindowObject: false
    },

    typeScriptTypesDeclarations: {
      mustGenerate: false,
      fileNameWithoutExtension: "index.d.ts"
    }

  },

  logging: {

    filesPaths: true,
    filesCount: false,
    partialFilesAndParentEntryPointsCorrespondence: false,
    filesWatcherEvents: true,

    linting: {
      starting: true,
      completionWithoutIssues: true
    }

  }

};


export default ECMA_ScriptLogicProcessingSettings__Default;
