/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type MarkupProcessingSettings__Normalized from "@MarkupProcessing/MarkupProcessingSettings__Normalized";
import type ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";

/* --- Settings representatives ------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import GulpStreamBasedSourceCodeProcessingConfigRepresentative from
    "@ProjectBuilding/Common/SettingsRepresentatives/GulpStreamBasedSourceCodeProcessingConfigRepresentative";

/* --- Utils -------------------------------------------------------------------------------------------------------- */
import { getArrayElementSatisfiesThePredicateIfSuchElementIsExactlyOne } from "@yamato-daiwa/es-extensions";
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


export default class MarkupProcessingSettingsRepresentative extends GulpStreamBasedSourceCodeProcessingConfigRepresentative<
  MarkupProcessingSettings__Normalized.Common, MarkupProcessingSettings__Normalized.EntryPointsGroup
> {

  public readonly supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: ReadonlyArray<string>;
  public readonly TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM: string = "Markup";
  public readonly TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM: string = "Markup";
  public readonly TASK_NAME_FOR_LOGGING: string = "Markup processing";
  public readonly prefixOfEntryPointsGroupReference: string = "@";

  public readonly waitingForTheOtherFilesWillBeSavedPeriod__seconds: number;
  public readonly entryPointsGroupsNormalizedSettingsMappedByReferences: Map<
    string, MarkupProcessingSettings__Normalized.EntryPointsGroup
  >;

  public readonly sourceCodeLintingCommonSettings: MarkupProcessingSettings__Normalized.Linting;
  public readonly staticPreviewSettings: MarkupProcessingSettings__Normalized.StaticPreview;
  public readonly sourceAndOutputFilesAbsolutePathsCorrespondenceMap: Map<string, string> = new Map();

  public readonly relevantEntryPointsGroupsSettings: ReadonlyMap<
    ProjectBuildingConfig__Normalized.EntryPointsGroupID, MarkupProcessingSettings__Normalized.EntryPointsGroup
  >;

  protected readonly mustResolveResourcesReferencesToAbsolutePath: boolean;
  protected readonly sourceCodeProcessingCommonSettings: MarkupProcessingSettings__Normalized.Common;


  public constructor(
    normalizedMarkupProcessingSettings: MarkupProcessingSettings__Normalized,
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ) {

    super({
      masterConfigRepresentative: projectBuildingMasterConfigRepresentative,
      mustLogPartialFilesAndEntryPointsRelationsMap: normalizedMarkupProcessingSettings.logging.
          partialFilesAndParentEntryPointsCorrespondence
    });

    this.sourceCodeProcessingCommonSettings = normalizedMarkupProcessingSettings.common;
    this.sourceCodeLintingCommonSettings = normalizedMarkupProcessingSettings.linting;
    this.staticPreviewSettings = normalizedMarkupProcessingSettings.staticPreview;
    this.relevantEntryPointsGroupsSettings = normalizedMarkupProcessingSettings.relevantEntryPointsGroups;

    this.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots = normalizedMarkupProcessingSettings.common.
        supportedSourceFileNameExtensionsWithoutLeadingDots;
    this.waitingForTheOtherFilesWillBeSavedPeriod__seconds = normalizedMarkupProcessingSettings.common.
        periodBetweenFileUpdatingAndRebuildingStarting__seconds;

    this.entryPointsGroupsNormalizedSettingsMappedByReferences = new Map<
      string, MarkupProcessingSettings__Normalized.EntryPointsGroup
    >(
      Array.from(this.relevantEntryPointsGroupsSettings.values()).map(
        (entryPointsGroupSettings: MarkupProcessingSettings__Normalized.EntryPointsGroup):
            [string, MarkupProcessingSettings__Normalized.EntryPointsGroup] =>
                [
                  `${ this.prefixOfEntryPointsGroupReference }${ entryPointsGroupSettings.ID }`,
                  entryPointsGroupSettings
                ]
      )
    );

    this.mustResolveResourcesReferencesToAbsolutePath = normalizedMarkupProcessingSettings.common.
        mustResolveResourcesReferencesToAbsolutePath;

    super.initializeOrUpdatePartialFilesAndEntryPointsRelationsMap();

  }


  /* === Common ===================================================================================================== */
  public getAbsolutePublicPathIfMustToResolveReferencesToAbsolutePath(): string | null {
    return this.mustResolveResourcesReferencesToAbsolutePath ?
        this.masterConfigRepresentative.actualPublicDirectoryAbsolutePath ?? null :
        null;
  }


  /* === Static preview ============================================================================================= */
  public getEntryPointStateDependentVariations(
    targetFileAbsolutePath: string
  ): MarkupProcessingSettings__Normalized.StaticPreview.PagesStateDependentVariationsSpecification.Page | null {
    return this.staticPreviewSettings.stateDependentPagesVariationsSpecification[targetFileAbsolutePath] ?? null;
  }

  public get staticDataForStaticPreview(): MarkupProcessingSettings__Normalized.StaticPreview.ImportsFromStaticDataFiles {
    return this.staticPreviewSettings.importsFromStaticDataFiles;
  }


  /* --- Imports from the TypeScript -------------------------------------------------------------------------------- */
  public get compiledTypeScriptImportingSettings(): MarkupProcessingSettings__Normalized.StaticPreview.
      ImportsFromCompiledTypeScript | undefined {
    return this.staticPreviewSettings.compiledTypeScriptImporting;
  }

  public get importedTypeScriptSourceFilesAbsolutePaths(): Array<string> {
    return (this.compiledTypeScriptImportingSettings?.files ?? []).map(
      (
        importFromCompiledTypeScript: MarkupProcessingSettings__Normalized.StaticPreview.
            ImportsFromCompiledTypeScript.FileMetadata
      ): string => importFromCompiledTypeScript.sourceFileAbsolutePath
    );
  }

  public getTypeScriptImportingSettingsExpectedToExistForSpecificOutputJavaScriptFile(
    targetOutputJavaScriptFilePath: string
  ): MarkupProcessingSettings__Normalized.StaticPreview.ImportsFromCompiledTypeScript.FileMetadata {
    return getArrayElementSatisfiesThePredicateIfSuchElementIsExactlyOne(
      this.staticPreviewSettings.compiledTypeScriptImporting?.files ?? [],
      (arrayElement: MarkupProcessingSettings__Normalized.StaticPreview.ImportsFromCompiledTypeScript.FileMetadata): boolean =>
          ImprovedPath.joinPathSegments([
            arrayElement.outputDirectoryAbsolutePath,
            `${ arrayElement.outputFileNameWithoutExtension }.js`
          ], { alwaysForwardSlashSeparators: true }) === targetOutputJavaScriptFilePath,
      { mustThrowErrorIfElementNotFoundOrMoreThan1: true }
    );
  }

}
