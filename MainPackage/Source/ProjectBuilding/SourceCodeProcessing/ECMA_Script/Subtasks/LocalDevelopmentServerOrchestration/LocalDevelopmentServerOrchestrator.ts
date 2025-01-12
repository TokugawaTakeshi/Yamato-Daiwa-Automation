/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type ECMA_ScriptLogicProcessingSettings__Normalized from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettings__Normalized";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type ECMA_ScriptLogicProcessingSettingsRepresentative from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettingsRepresentative";

/* ─── Shared State ───────────────────────────────────────────────────────────────────────────────────────────────── */
import ECMA_ScriptLogicProcessingSharedState from "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSharedState";

/* ─── Gulp & Plugins ─────────────────────────────────────────────────────────────────────────────────────────────── */
import provideServerAutomaticStartingAndRestarting from "gulp-nodemon";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import { getExpectedToBeNonUndefinedMapValue, isNull, isUndefined } from "@yamato-daiwa/es-extensions";


export default class LocalDevelopmentServerOrchestrator {

  public static orchestrateIfMust(
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): (callback: (error?: Error | null) => void) => void {

    const ecmaScriptLogicProcessingSettingsRepresentative: ECMA_ScriptLogicProcessingSettingsRepresentative | null =
        projectBuildingMasterConfigRepresentative.
            getECMA_ScriptLogicProcessingSettingsRepresentativeIfMustOrchestrateLocalDevelopmentServer();

    if (
      isNull(ecmaScriptLogicProcessingSettingsRepresentative) ||
      isUndefined(ecmaScriptLogicProcessingSettingsRepresentative.localDevelopmentServerOrchestrationSettings)
    ) {
      return (callback: () => void): void => { callback(); };
    }


    const localDevelopmentServerOrchestrationSettings: ECMA_ScriptLogicProcessingSettings__Normalized.
        LocalDevelopmentServerOrchestration =
            ecmaScriptLogicProcessingSettingsRepresentative.localDevelopmentServerOrchestrationSettings;

    return (callback: (error?: Error | null) => void): void => {

      const targetFile: string = getExpectedToBeNonUndefinedMapValue(
        ECMA_ScriptLogicProcessingSharedState.sourceFilesAbsolutePathsAndOutputFilesActualPathsMap,
        localDevelopmentServerOrchestrationSettings.targetSourceFileAbsolutePath
      );

      provideServerAutomaticStartingAndRestarting({

        script: targetFile,

        watch: [ targetFile ],

        /* eslint-disable-next-line id-denylist -- Library limitation */
        args: [ ...localDevelopmentServerOrchestrationSettings.arguments ],
        env: localDevelopmentServerOrchestrationSettings.environmentVariables,
        done: callback

      });

      callback();

    };

  }

}
