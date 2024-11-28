/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import type MarkupProcessingRestrictions from "@MarkupProcessing/MarkupProcessingRestrictions";

/* ─── Normalized config ──────────────────────────────────────────────────────────────────────────────────────────── */
import type SourceCodeProcessingGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/SourceCodeProcessingGenericProperties__Normalized";
import type LintingSettings__Normalized from "@ProjectBuilding/Common/NormalizedConfig/LintingSettings__Normalized";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import type { ArbitraryObject, LineSeparators } from "@yamato-daiwa/es-extensions";


type MarkupProcessingSettings__Normalized = Readonly<{
  common: MarkupProcessingSettings__Normalized.Common;
  linting: MarkupProcessingSettings__Normalized.Linting;
  importingFromTypeScript?: MarkupProcessingSettings__Normalized.ImportingFromTypeScript;
  staticPreview: MarkupProcessingSettings__Normalized.StaticPreview;
  routing?: MarkupProcessingSettings__Normalized.Routing;
  relevantEntryPointsGroups: ReadonlyMap<
    SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup.ID,
    MarkupProcessingSettings__Normalized.EntryPointsGroup
  >;
  logging: MarkupProcessingSettings__Normalized.Logging;
}>;


namespace MarkupProcessingSettings__Normalized {

  export type Common =
      SourceCodeProcessingGenericProperties__Normalized.Common &
      Readonly<{
        mustResolveResourcesReferencesToAbsolutePath: boolean;
        secondsBetweenFileUpdatingAndStartingOfRebuilding: number;
      }>;


  export type Linting = LintingSettings__Normalized;


  export type ImportingFromTypeScript = Readonly<{
    typeScriptConfigurationFileAbsolutePath: string;
    sourceFileAbsolutePath: string;
    importedNamespace: string;
    nameOfPugBlockToWhichTranspiledTypeScriptMustBeInjected: string;
  }>;


  export type StaticPreview = Readonly<{
    pagesVariations: StaticPreview.PagesVariations;
    importsFromStaticDataFiles: StaticPreview.ImportsFromStaticDataFiles;
  }>;

  export namespace StaticPreview {

    export type StateDependentPagesVariationsSpecification = Readonly<{
      [entryPointSourceFileAbsolutePath: string]: PagesStateDependentVariationsSpecification.Page | undefined;
    }>;

    export type ImportsFromStaticDataFiles = Readonly<{ [variableName: string]: unknown; }>;

  }


  export type Routing = Readonly<{
    variable: string;
    routes: ArbitraryObject;
  }>;


  export type EntryPointsGroup =
      SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup &
      Readonly<{
        outputFormat: MarkupProcessingRestrictions.OutputFormats;
        HTML_Validation: EntryPointsGroup.HTML_Validation;
        accessibilityInspection: EntryPointsGroup.AccessibilityInspection;
        outputCodeFormatting: EntryPointsGroup.OutputCodeFormatting;
      }>;

  export namespace EntryPointsGroup {

    export type HTML_Validation = Readonly<{
      mustExecute: boolean;
      ignoring: Readonly<{
        filesAbsolutePaths: ReadonlyArray<string>;
        directoriesAbsolutePaths: ReadonlyArray<string>;
      }>;
    }>;

    export type AccessibilityInspection = Readonly<{
      mustExecute: boolean;
      standard: MarkupProcessingRestrictions.SupportedAccessibilityStandards;
      ignoring: Readonly<{
        filesAbsolutePaths: ReadonlyArray<string>;
        directoriesAbsolutePaths: ReadonlyArray<string>;
      }>;
    }>;

    export type OutputCodeFormatting = Readonly<{ mustExecute: boolean; }>;

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

    HTML_Validation: Readonly<{
      starting: boolean;
      completionWithoutIssues: boolean;
    }>;

    accessibilityChecking: Readonly<{
      starting: boolean;
      completionWithoutIssues: boolean;
    }>;

  }>;

}


export default MarkupProcessingSettings__Normalized;
