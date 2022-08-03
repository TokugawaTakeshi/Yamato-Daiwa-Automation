import type ProjectBuildingConfig__FromFile__RawValid from
    "./Source/ProjectBuilding/ProjectBuildingConfig__FromFile__RawValid";

import type ProjectBuilderRawConfigNormalizer from "./Source/ProjectBuilding/ProjectBuilderRawConfigNormalizer";
import type PoliteErrorsMessagesBuilder from "./Source/Utils/PoliteErrorsMessagesBuilder";

export { default as AccessibilityInspector } from "@MarkupProcessing/Plugins/AccessibilityInspector/AccessibilityInspector";
export { default as HTML_Validator } from "@MarkupProcessing/Plugins/HTML_Validator/HTML_Validator";
export { default as ResourcesReferencesResolverForHTML } from
    "@MarkupProcessing/Plugins/ResourcesReferencesResolverForHTML/ResourcesReferencesResolverForHTML";


export type ProjectBuildingConfigFromFileLocalization = ProjectBuildingConfig__FromFile__RawValid.Localization;

export type ProjectBuilderRawConfigNormalizerLocalization = ProjectBuilderRawConfigNormalizer.Localization;

export type FriendlyErrorsMessagesBuilderLocalization = PoliteErrorsMessagesBuilder.Localization;
