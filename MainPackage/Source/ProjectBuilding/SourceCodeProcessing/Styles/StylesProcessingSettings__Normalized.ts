import type ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";


type StylesProcessingSettings__Normalized = Readonly<{
  common: StylesProcessingSettings__Normalized.Common;
  linting: StylesProcessingSettings__Normalized.Linting;
  entryPointsGroupsActualForCurrentProjectBuildingMode: ReadonlyMap<
    ProjectBuildingConfig__Normalized.EntryPointsGroupID, StylesProcessingSettings__Normalized.EntryPointsGroup
  >;
}>;


/* eslint-disable-next-line @typescript-eslint/no-redeclare --
 * The merging of type/interface and namespace is completely valid TypeScript,
 * but @typescript-eslint community does not wish to support it.
 * https://github.com/eslint/eslint/issues/15504 */
namespace StylesProcessingSettings__Normalized {

  export type Common =
      ProjectBuildingConfig__Normalized.SourceCodeProcessingCommonSettingsGenericProperties &
      Readonly<{
        waitingForSubsequentFilesWillBeSavedPeriod__seconds: number;
      }>;

  export type Linting = Readonly<{
    presetFileAbsolutePath?: string;
    isCompletelyDisabled: boolean;
  }>;

  export type EntryPointsGroup =
      ProjectBuildingConfig__Normalized.EntryPointsGroupGenericSettings &
      Readonly<{
        entryPointsSourceFilesTopDirectoryOrSingleFilePathAliasForReferencingFromHTML: string;
        revisioning: ProjectBuildingConfig__Normalized.Revisioning;
        linting: EntryPointsGroup.Linting;
      }>;

  export namespace EntryPointsGroup {

    /* eslint-disable-next-line @typescript-eslint/no-shadow --
    * The declaring of type/interface inside namespace with same name as defined in upper scope
    * is completely valid TypeScript and not desired to be warned by @typescript-eslint. */
    export type Linting = Readonly<{
      mustExecute: boolean;
    }>;
  }

}


export default StylesProcessingSettings__Normalized;
