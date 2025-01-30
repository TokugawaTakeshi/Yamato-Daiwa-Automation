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
  importingFromJavaScript?: MarkupProcessingSettings__Normalized.ImportingFromJavaScript;
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
  }>;

  export type ImportingFromJavaScript = Readonly<{
    sourceFileAbsolutePath: string;
    nameOfGlobalConstantForStoringOfImports: string;
  }>;


  export type StaticPreview = Readonly<{
    pagesVariations: StaticPreview.PagesVariations;
    importsFromStaticDataFiles: StaticPreview.ImportsFromStaticDataFiles;
  }>;

  export namespace StaticPreview {

    export type PagesVariations = Readonly<{
      stateDependent: PagesVariations.StateDependent;
    }>;

    export namespace PagesVariations {

      export type StateDependent = Map<StateDependent.EntryPointSourceFileAbsolutePath, StateDependent.Page>;

      export namespace StateDependent {

        export type EntryPointSourceFileAbsolutePath = string;
        export type DerivedFileAbsolutePath = string;

        export type Page = Readonly<{
          stateVariableName: string;
          derivedPagesAndStatesMap: ReadonlyMap<DerivedFileAbsolutePath, ArbitraryObject>;
        }>;

      }

    }

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
        localization: EntryPointsGroup.Localization;
        HTML_Validation: EntryPointsGroup.HTML_Validation;
        accessibilityInspection: EntryPointsGroup.AccessibilityInspection;
        outputCodeFormatting: EntryPointsGroup.OutputCodeFormatting;
        outputCodeMinifying: EntryPointsGroup.OutputCodeMinifying;
      }>;

  export namespace EntryPointsGroup {

    export type Localization = Readonly<{
      localizedStringResourcesConstantName?: string;
      localeConstantName?: string;
      nameOfConstantForInterpolationToLangHTML_Attribute?: string;
      locales: Localization.Locales;
      excludedFilesAbsolutePaths: ReadonlyArray<string>;
    }>;

    export namespace Localization {

      export type Locales = ReadonlyMap<LocaleKey, LocaleData>;

      export type LocaleKey = string;

      export type LocaleData = Readonly<{
        outputFileInterimNameExtensionWithoutDot: string;
        stringResources?: unknown;
        localeConstantValue?: string;
        valueOfConstantForInterpolationToLangHTML_Attribute?: string;
      }>;

    }

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

    export type OutputCodeFormatting = Readonly<{
      mustExecute: boolean;
      indentationString: string;
      lineSeparators: LineSeparators;
      mustGuaranteeTrailingEmptyLine: boolean;
      mustIndentHeadAndBodyTags: boolean;
    }>;

    export type OutputCodeMinifying = Readonly<{
      mustExecute: boolean;
      attributesExtraWhitespacesCollapsing: boolean;
      attributesValuesDeduplication: boolean;
      commentsRemoving: boolean;
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
