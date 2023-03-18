import MarkupProcessingRestrictions from "@MarkupProcessing/MarkupProcessingRestrictions";


const MarkupProcessingSettings__Default: Readonly<{

  periodBetweenFileUpdatingAndRebuildingStarting__seconds: number;

  staticPreview: Readonly<{
    typeScriptConfigurationFileRelativePath: string;
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

  logging: Readonly<{
    filesPaths: boolean;
    filesCount: boolean;
    partialFilesAndParentEntryPointsCorrespondence: boolean;
  }>;

}> = {

  periodBetweenFileUpdatingAndRebuildingStarting__seconds: 1,

  staticPreview: {
    typeScriptConfigurationFileRelativePath: "tsconfig.json"
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

  logging: {
    filesPaths: true,
    filesCount: true,
    partialFilesAndParentEntryPointsCorrespondence: false
  }

};


export default MarkupProcessingSettings__Default;
