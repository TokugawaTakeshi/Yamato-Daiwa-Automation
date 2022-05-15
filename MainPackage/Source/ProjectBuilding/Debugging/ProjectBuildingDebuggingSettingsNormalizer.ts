/* --- Default settings --------------------------------------------------------------------------------------------- */
import ProjectBuildingDebuggingSettings__Default from
    "@ProjectBuilding/Debugging/ProjectBuildingDebuggingSettings__Default";

/* --- Raw valid config --------------------------------------------------------------------------------------------- */
import type ProjectBuildingDebuggingSettings__FromFile__RawValid from "./ProjectBuildingDebuggingSettings__FromFile__RawValid";

/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type ProjectBuildingDebuggingSettings__Normalized from "./ProjectBuildingDebuggingSettings__Normalized";


export default class ProjectBuildingDebuggingSettingsNormalizer {

  public static normalize(
    projectBuildingDebuggingSettings__fromFile__rawValid?: ProjectBuildingDebuggingSettings__FromFile__RawValid
  ): ProjectBuildingDebuggingSettings__Normalized {
    return {
       enabled: projectBuildingDebuggingSettings__fromFile__rawValid?.enabled ??
           ProjectBuildingDebuggingSettings__Default.enabled,
      partials: {
        partialFilesAndParentEntryPointCorrespondence:
             projectBuildingDebuggingSettings__fromFile__rawValid?.partials?.partialFilesAndParentEntryPointAccordance ??
             ProjectBuildingDebuggingSettings__Default.partials.partialFilesAndParentEntryPointCorrespondence
      }
    };
  }
}
