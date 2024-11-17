import type ProjectBuildingConfig__FromFile__RawValid from
    "./Source/ProjectBuilding/ProjectBuildingConfig__FromFile__RawValid";

import type ProjectBuilderRawConfigNormalizer from "./Source/ProjectBuilding/ProjectBuilderRawConfigNormalizer";


/* === Markup ======================================================================================================= */
/* eslint-disable-next-line @typescript-eslint/consistent-type-exports --
 * The namespace, not just type must be re-exported.  */
export { MarkupProcessingRawSettingsNormalizerLocalization } from
    "@MarkupProcessing/RawSettingsNormalizer/MarkupProcessingRawSettingsNormalizer";

/* eslint-disable-next-line @typescript-eslint/consistent-type-exports --
 * The namespace, not just type must be re-exported.  */
export { AccessibilityInspectorLocalization } from "@MarkupProcessing/Plugins/AccessibilityInspector/AccessibilityInspector";

/* eslint-disable-next-line @typescript-eslint/consistent-type-exports --
 * The namespace, not just type must be re-exported.  */
export { HTML_ValidatorLocalization } from "@MarkupProcessing/Plugins/HTML_Validator/HTML_Validator";

/* eslint-disable-next-line @typescript-eslint/consistent-type-exports --
 * The namespace, not just type must be re-exported.  */
export { MarkupSourceCodeLinterLocalization } from "@MarkupProcessing/Subtasks/Linting/MarkupSourceCodeLinter";


/* === Browser live reloading ======================================================================================= */
/* eslint-disable-next-line @typescript-eslint/consistent-type-exports --
 * The namespace, not just type must be re-exported.  */
export {
  BrowserLiveReloadingSettingsNormalizerLocalization
} from "@BrowserLiveReloading/RawSettingsNormalizer/BrowserLiveReloadingSettingsNormalizer";

/* eslint-disable-next-line @typescript-eslint/consistent-type-exports --
 * The namespace, not just type must be re-exported.  */
export { BrowserLiveReloaderLocalization } from "@BrowserLiveReloading/BrowserLiveReloader";


/* === Other ======================================================================================================== */
export type ProjectBuildingConfigFromFileLocalization = ProjectBuildingConfig__FromFile__RawValid.Localization;

export type ProjectBuilderRawConfigNormalizerLocalization = ProjectBuilderRawConfigNormalizer.Localization;

export type { ChokidarSpecialistLocalization } from "@ThirdPartySolutionsSpecialists/Chokidar/ChokidarSpecialist";
