import MarkupProcessingRestrictions from "@MarkupProcessing/MarkupProcessingRestrictions";


export default {

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
