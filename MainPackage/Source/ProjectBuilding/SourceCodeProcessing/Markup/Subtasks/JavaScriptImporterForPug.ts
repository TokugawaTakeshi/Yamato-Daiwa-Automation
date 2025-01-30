/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type MarkupProcessingSettings__Normalized from "@MarkupProcessing/MarkupProcessingSettings__Normalized";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type MarkupProcessingSettingsRepresentative from "@MarkupProcessing/MarkupProcessingSettingsRepresentative";

/* ─── Superclass ─────────────────────────────────────────────────────────────────────────────────────────────────── */
import GulpStreamsBasedTaskExecutor from
    "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBased/GulpStreamsBasedTaskExecutor";

/* ─── Shared State ───────────────────────────────────────────────────────────────────────────────────────────────── */
import MarkupProcessingSharedState from "@MarkupProcessing/MarkupProcessingSharedState";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import {
  isUndefined,
  type ArbitraryObject
} from "@yamato-daiwa/es-extensions";
import requireFromString from "require-from-string";
import FileSystem from "fs";


export default class JavaScriptImporterForPug extends GulpStreamsBasedTaskExecutor {

  protected readonly logging: GulpStreamsBasedTaskExecutor.Logging = {
    pathsOfFilesWillBeProcessed: false,
    quantityOfFilesWillBeProcessed: false
  };

  public static provideJavaScriptImportsForMarkupIfMust(
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): (callback: (error?: Error) => void) => void {

    const markupProcessingSettingsRepresentative: MarkupProcessingSettingsRepresentative | undefined =
        projectBuildingMasterConfigRepresentative.markupProcessingSettingsRepresentative;

    if (isUndefined(markupProcessingSettingsRepresentative)) {
      return (callback: () => void): void => { callback(); };
    }


    const importingFromJavaScriptSettings: MarkupProcessingSettings__Normalized.ImportingFromJavaScript | undefined =
        markupProcessingSettingsRepresentative.importingFromJavaScriptSettings;

    if (isUndefined(importingFromJavaScriptSettings)) {
      return (callback: () => void): void => { callback(); };
    }


    const loadedJavaScriptModule: ArbitraryObject = requireFromString(
      FileSystem.readFileSync(
        importingFromJavaScriptSettings.sourceFileAbsolutePath,
        "utf-8"
      )
    );

    MarkupProcessingSharedState.importsFromJavaScript = {
      [importingFromJavaScriptSettings.nameOfGlobalConstantForStoringOfImports]: loadedJavaScriptModule
    };

    return (callback: () => void): void => { callback(); };

  }

}
