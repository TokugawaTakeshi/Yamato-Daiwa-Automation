import type SourceCodeProcessingGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/SourceCodeProcessingGenericProperties__Normalized";
import type LintingSettings__Normalized from "@ProjectBuilding/Common/NormalizedConfig/LintingSettings__Normalized";
import type RevisioningSettings__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/Reusables/RevisioningSettings__Normalized";


type StylesProcessingSettings__Normalized = Readonly<{
  common: StylesProcessingSettings__Normalized.Common;
  linting: StylesProcessingSettings__Normalized.Linting;
  relevantEntryPointsGroups: ReadonlyMap<
    SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup.ID,
    StylesProcessingSettings__Normalized.EntryPointsGroup
  >;
  logging: StylesProcessingSettings__Normalized.Logging;
}>;


namespace StylesProcessingSettings__Normalized {

  export type Common =
      SourceCodeProcessingGenericProperties__Normalized.Common &
      Readonly<{
        secondsBetweenFileUpdatingAndStartingOfRebuilding: number;
      }>;


  export type Linting = LintingSettings__Normalized;


  export type EntryPointsGroup =
      SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup &
      Readonly<{
        revisioning: RevisioningSettings__Normalized;
      }>;

  export namespace EntryPointsGroup {

    /* eslint-disable-next-line @typescript-eslint/no-shadow --
    * The declaring of type/interface inside namespace with same name as defined in upper scope
    * is completely valid TypeScript and not desired to be warned by @typescript-eslint. */
    export type Linting = Readonly<{
      mustExecute: boolean;
    }>;

  }

  export type Logging = Readonly<{

    filesPaths: boolean;
    filesCount: boolean;
    partialFilesAndParentEntryPointsCorrespondence: boolean;
    filesWatcherEvents: boolean;

    linting: Readonly<{
      starting: boolean;
      completionWithoutIssues: boolean;
    }>;

  }>;

}


export default StylesProcessingSettings__Normalized;
