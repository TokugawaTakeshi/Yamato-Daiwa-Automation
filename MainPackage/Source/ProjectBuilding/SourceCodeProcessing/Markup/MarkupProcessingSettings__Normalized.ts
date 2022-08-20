/* --- Restrictions ------------------------------------------------------------------------------------------------- */
import type MarkupProcessingRestrictions from "@MarkupProcessing/MarkupProcessingRestrictions";

/* --- Normalized config -------------------------------------------------------------------------------------------- */
import type ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";

/* --- Utils -------------------------------------------------------------------------------------------------------- */
import type { ArbitraryObject } from "@yamato-daiwa/es-extensions";


type MarkupProcessingSettings__Normalized = Readonly<{
  common: MarkupProcessingSettings__Normalized.Common;
  linting: MarkupProcessingSettings__Normalized.Linting;
  staticPreview: MarkupProcessingSettings__Normalized.StaticPreview;
  relevantEntryPointsGroups: ReadonlyMap<
    ProjectBuildingConfig__Normalized.EntryPointsGroupID, MarkupProcessingSettings__Normalized.EntryPointsGroup
  >;
  logging: MarkupProcessingSettings__Normalized.Logging;
}>;


/* eslint-disable-next-line @typescript-eslint/no-redeclare --
 * The merging of type/interface and namespace is completely valid TypeScript,
 * but @typescript-eslint community does not wish to support it.
 * https://github.com/eslint/eslint/issues/15504 */
namespace MarkupProcessingSettings__Normalized {

  export type Common =
      ProjectBuildingConfig__Normalized.SourceCodeProcessingCommonSettingsGenericProperties &
      Readonly<{ periodBetweenFileUpdatingAndRebuildingStarting__seconds: number; }>;


  export type Linting = Readonly<{
    presetFileAbsolutePath?: string;
    mustExecute: boolean;
  }>;


  export type StaticPreview = Readonly<{
    stateDependentPagesVariationsSpecification: StaticPreview.StateDependentPagesVariationsSpecification;
    importsFromStaticDataFiles: StaticPreview.ImportsFromStaticDataFiles;
    compiledTypeScriptImporting?: StaticPreview.ImportsFromCompiledTypeScript;
  }>;

  export namespace StaticPreview {

    export type StateDependentPagesVariationsSpecification = Readonly<{
      [entryPointSourceFileAbsolutePath: string]: PagesStateDependentVariationsSpecification.Page | undefined;
    }>;

    export type ImportsFromStaticDataFiles = Readonly<{ [variableName: string]: unknown; }>;

    export namespace PagesStateDependentVariationsSpecification {
      export type Page = Readonly<{
        stateVariableName: string;
        derivedPagesAndStatesMap: Readonly<{ [derivedFileAbsolutePath: string]: ArbitraryObject; }>;
      }>;
    }


    export type ImportsFromCompiledTypeScript = Readonly<{
      typeScriptConfigurationFileAbsolutePath: string;
      files: ReadonlyArray<ImportsFromCompiledTypeScript.FileMetadata>;
    }>;

    export namespace ImportsFromCompiledTypeScript {
      export type FileMetadata = Readonly<{
        sourceFileAbsolutePath: string;
        importedNamespace: string;
        outputDirectoryAbsolutePath: string;
        outputFileNameWithoutExtension: string;
      }>;
    }
  }


  export type EntryPointsGroup =
      ProjectBuildingConfig__Normalized.EntryPointsGroupGenericSettings &
      Readonly<{
        HTML_Validation: EntryPointsGroup.HTML_Validation;
        accessibilityInspection: EntryPointsGroup.AccessibilityInspection;
        mustConvertToHandlebarsOnNonStaticPreviewModes: boolean;
      }>;

  export namespace EntryPointsGroup {

    export type HTML_Validation = Readonly<{ mustExecute: boolean; }>;

    export type AccessibilityInspection = Readonly<{
      mustExecute: boolean;
      standard: MarkupProcessingRestrictions.SupportedAccessibilityStandards;
    }>;
  }


  export type Logging = Readonly<{
    filesPaths: boolean;
    filesCount: boolean;
    partialFilesAndParentEntryPointsCorrespondence: boolean;
  }>;
}


export default MarkupProcessingSettings__Normalized;
