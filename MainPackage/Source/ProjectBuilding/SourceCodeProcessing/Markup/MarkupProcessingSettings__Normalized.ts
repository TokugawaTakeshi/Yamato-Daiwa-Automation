/* --- Restrictions ------------------------------------------------------------------------------------------------ */
import type MarkupProcessingRestrictions from "@MarkupProcessing/MarkupProcessingRestrictions";

/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";


type MarkupProcessingSettings__Normalized = {
  readonly common: MarkupProcessingSettings__Normalized.Common;
  readonly linting: MarkupProcessingSettings__Normalized.Linting;
  readonly entryPointsGroupsActualForCurrentProjectBuildingMode: Map<
    ProjectBuildingConfig__Normalized.EntryPointsGroupID, MarkupProcessingSettings__Normalized.EntryPointsGroup
  >;
};


/* eslint-disable-next-line @typescript-eslint/no-redeclare --
 * The merging of type/interface and namespace is completely valid TypeScript,
 * but @typescript-eslint community does not wish to support it.
 * https://github.com/eslint/eslint/issues/15504 */
namespace MarkupProcessingSettings__Normalized {

  export type Common =
      ProjectBuildingConfig__Normalized.SourceCodeProcessingCommonSettingsGenericProperties &
      {
        readonly waitingForSubsequentFilesWillBeSavedPeriod__seconds: number;
      };

  export type Linting = {
    readonly presetFileAbsolutePath?: string;
    readonly isCompletelyDisabled: boolean;
  };

  export type EntryPointsGroup =
      ProjectBuildingConfig__Normalized.EntryPointsGroupGenericSettings &
      {
        readonly linting: EntryPointsGroup.Linting;
        readonly HTML_Validation: EntryPointsGroup.HTML_Validation;
        readonly accessibilityInspection: EntryPointsGroup.AccessibilityInspection;
      };

  export namespace EntryPointsGroup {

    /* eslint-disable-next-line @typescript-eslint/no-shadow --
     * The declaring of type/interface inside namespace with same name as defined in upper scope
     * is completely valid TypeScript and not desired to be warned by @typescript-eslint. */
    export type Linting = {
      readonly mustExecute: boolean;
    };

    export type HTML_Validation = {
      readonly mustExecute: boolean;
    };

    export type AccessibilityInspection = {
      readonly mustExecute: boolean;
      readonly standard: MarkupProcessingRestrictions.SupportedAccessibilityStandards;
    };
  }
}


export default MarkupProcessingSettings__Normalized;
