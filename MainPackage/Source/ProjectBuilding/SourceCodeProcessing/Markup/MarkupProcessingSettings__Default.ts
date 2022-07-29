import MarkupProcessingRestrictions from "@MarkupProcessing/MarkupProcessingRestrictions";


const MarkupProcessingSettings__Default: Readonly<{

  waitingForOtherFilesWillBeSavedPeriod__seconds: number;

  linting: Readonly<{
    mustExecute: boolean;
    isDisabledForEntryPointGroups: boolean;
  }>;

  HTML_Validation: Readonly<{
    mustExecute: boolean;
  }>;

  accessibilityInspection: Readonly<{
    mustExecute: boolean;
    standard: MarkupProcessingRestrictions.SupportedAccessibilityStandards;
  }>;

}> = {

  waitingForOtherFilesWillBeSavedPeriod__seconds: 1,

  linting: {
    mustExecute: true,
    isDisabledForEntryPointGroups: false
  },

  HTML_Validation: {
    mustExecute: true
  },

  accessibilityInspection: {
    mustExecute: true,
    standard: MarkupProcessingRestrictions.SupportedAccessibilityStandards.WCAG2AAA
  }

};


export default MarkupProcessingSettings__Default;
