import MarkupProcessingRestrictions from "@MarkupProcessing/MarkupProcessingRestrictions";
import ConsumingProjectBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";


const MarkupProcessingSettings__Default: Readonly<{

  periodBetweenFileUpdatingAndRebuildingStarting__seconds: number;

  staticPreview: Readonly<{
    typeScriptConfigurationFileRelativePath: string;
  }>;

  outputCodeFormatting: Readonly<{
    mustExecute: (consumingProjectBuildingMode: ConsumingProjectBuildingModes) => boolean;
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
    mustExecute: (consumingProjectBuildingMode: ConsumingProjectBuildingModes): boolean =>
        consumingProjectBuildingMode === ConsumingProjectBuildingModes.staticPreview ||
        consumingProjectBuildingMode === ConsumingProjectBuildingModes.localDevelopment
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
