import MarkupProcessingRestrictions from "@MarkupProcessing/MarkupProcessingRestrictions";
import type ConsumingProjectBuildingModes from "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";
import { LineSeparators } from "@yamato-daiwa/es-extensions";


const MarkupProcessingSettings__Default: Readonly<{

  periodBetweenFileUpdatingAndRebuildingStarting__seconds: number;

  staticPreview: Readonly<{
    typeScriptConfigurationFileRelativePath: string;
  }>;

  outputCodeFormatting: Readonly<{
    mustExecute: (
      factors: Readonly<{
        consumingProjectBuildingMode: ConsumingProjectBuildingModes;
        outputFormat: MarkupProcessingRestrictions.OutputFormats;
      }>
    ) => boolean;
    indentationString: string;
    lineSeparators: LineSeparators;
    mustGuaranteeTrailingEmptyLine: boolean;
    mustIndentHeadAndBodyTags: boolean;
  }>;

  outputCodeMinifying: Readonly<{
    mustExecute: (
      factors: Readonly<{
        consumingProjectBuildingMode: ConsumingProjectBuildingModes;
        outputFormat: MarkupProcessingRestrictions.OutputFormats;
      }>
    ) => boolean;
    attributesExtraWhitespacesCollapsing: boolean;
    attributesValuesDeduplication: boolean;
    commentsRemoving: boolean;
  }>;

  linting: Readonly<{
    mustExecute: boolean;
  }>;

  HTML_Validation: Readonly<{
    mustExecute: boolean;
  }>;

  accessibilityInspection: Readonly<{
    mustExecute: boolean;
    standard: MarkupProcessingRestrictions.SupportedAccessibilityStandards;
  }>;

  outputFormat: MarkupProcessingRestrictions.OutputFormats;

  logging: Readonly<{

    filesPaths: boolean;
    filesCount: boolean;
    partialFilesAndParentEntryPointsCorrespondence: boolean;
    filesWatcherEvents: boolean;

    linting: Readonly<{
      starting: boolean;
      completionWithoutIssues: boolean;
    }>;

    HTML_Validation: Readonly<{
      starting: boolean;
      completionWithoutIssues: boolean;
    }>;

    accessibilityChecking: Readonly<{
      starting: boolean;
      completionWithoutIssues: boolean;
    }>;

  }>;

}> = {

  periodBetweenFileUpdatingAndRebuildingStarting__seconds: 1,

  staticPreview: {
    typeScriptConfigurationFileRelativePath: "tsconfig.json"
  },

  outputCodeFormatting: {
    mustExecute: (
      {
        outputFormat
      }: Readonly<{
        consumingProjectBuildingMode: ConsumingProjectBuildingModes;
        outputFormat: MarkupProcessingRestrictions.OutputFormats;
      }>
    ): boolean =>
        outputFormat === MarkupProcessingRestrictions.OutputFormats.razor,
    indentationString: "  ",
    lineSeparators: LineSeparators.lineFeed,
    mustGuaranteeTrailingEmptyLine: true,
    mustIndentHeadAndBodyTags: true
  },

  outputCodeMinifying: {
    mustExecute: (
      {
        outputFormat
      }: Readonly<{
        outputFormat: MarkupProcessingRestrictions.OutputFormats;
      }>
    ): boolean =>
        outputFormat === MarkupProcessingRestrictions.OutputFormats.HTML ||
        outputFormat === MarkupProcessingRestrictions.OutputFormats.handlebars,
    attributesExtraWhitespacesCollapsing: true,
    attributesValuesDeduplication: true,
    commentsRemoving: true
  },

  linting: {
    mustExecute: true
  },

  HTML_Validation: {
    mustExecute: true
  },

  accessibilityInspection: {
    mustExecute: true,
    standard: MarkupProcessingRestrictions.SupportedAccessibilityStandards.WCAG2AAA
  },

  outputFormat: MarkupProcessingRestrictions.OutputFormats.HTML,

  logging: {

    filesPaths: true,
    filesCount: false,
    partialFilesAndParentEntryPointsCorrespondence: false,
    filesWatcherEvents: true,

    linting: {
      starting: true,
      completionWithoutIssues: true
    },

    HTML_Validation: {
      starting: true,
      completionWithoutIssues: true
    },

    accessibilityChecking: {
      starting: true,
      completionWithoutIssues: true
    }

  }

};


export default MarkupProcessingSettings__Default;
