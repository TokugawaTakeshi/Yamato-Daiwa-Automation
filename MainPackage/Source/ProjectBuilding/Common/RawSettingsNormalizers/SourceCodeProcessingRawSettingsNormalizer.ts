/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import type ConsumingProjectBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";

/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import type SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid from
    "@ProjectBuilding:Common/RawConfig/SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid";
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";

/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type SourceCodeProcessingGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/SourceCodeProcessingGenericProperties__Normalized";

/* ─── Settings normalizers ───────────────────────────────────────────────────────────────────────────────────────── */
import OutputPathTransformationsSettingsNormalizer from
    "@ProjectBuilding/Common/RawSettingsNormalizers/Reusables/OutputPathTransformationsSettingsNormalizer";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import {
  isUndefined,
  isNotUndefined,
  isNonEmptyArray,
  isString
} from "@yamato-daiwa/es-extensions";
import { ImprovedPath, ImprovedGlob } from "@yamato-daiwa/es-extensions-nodejs";


abstract class SourceCodeProcessingRawSettingsNormalizer {

  protected readonly abstract supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: ReadonlySet<string>;

  protected readonly projectBuildingCommonSettings__normalized: ProjectBuildingCommonSettings__Normalized;

  private readonly entryPointsGroupsIDsSelection?: ReadonlyArray<string>;


  protected constructor(
    constructorParameter: SourceCodeProcessingRawSettingsNormalizer.ConstructorParameter
  ) {

    this.projectBuildingCommonSettings__normalized = constructorParameter.projectBuildingCommonSettings__normalized;

    if (isNonEmptyArray(constructorParameter.entryPointsGroupsIDsSelection)) {
      this.entryPointsGroupsIDsSelection = constructorParameter.entryPointsGroupsIDsSelection;
    }

  }


  protected createNormalizedEntryPointsGroupsSettings<
    EntryPointsGroupSettings__RawValid extends SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.EntryPointsGroup,
    EntryPointsGroupSettings__Normalized extends SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup
  >(
    entryPointsGroupsSettings__rawValid: { [ID: string]: EntryPointsGroupSettings__RawValid; } | undefined,
    completeEntryPointsGroupNormalizedSettingsGeneralPropertiesUntilSpecificEntryPointsGroupNormalizedSettings:
        (
          entryPointsGroupSettings__normalized: SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup,
          entryPointsGroupSettings__rawValid: EntryPointsGroupSettings__RawValid
        ) => EntryPointsGroupSettings__Normalized
  ): Map<SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup.ID, EntryPointsGroupSettings__Normalized> {

    const entryPointsGroupsSettings__normalized: Map<
      SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup.ID, EntryPointsGroupSettings__Normalized
    > = new Map<SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup.ID, EntryPointsGroupSettings__Normalized>();

    if (isUndefined(entryPointsGroupsSettings__rawValid)) {
      return entryPointsGroupsSettings__normalized;
    }


    for (const [ groupID, entryPointsGroupSettings__rawValid ] of Object.entries(entryPointsGroupsSettings__rawValid)) {

      if (isNotUndefined(this.entryPointsGroupsIDsSelection) && !this.entryPointsGroupsIDsSelection.includes(groupID)) {
        continue;
      }


      const entryPointsGroupSettings__buildingModeDependent__rawValid:
          SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.EntryPointsGroup.BuildingModeDependent | undefined =
              entryPointsGroupSettings__rawValid.buildingModeDependent[this.consumingProjectBuildingMode];

      if (isUndefined(entryPointsGroupSettings__buildingModeDependent__rawValid)) {
        continue;
      }


      let entryPointsGroupSourceFilesTopDirectoryAbsolutePath: string;
      const currentEntryPointsGroupSourceFilesGlobSelectors: Array<string> = [];
      let isSingeEntryPointGroup: boolean;
      let sourceFilesTopDirectoryPathOrSingleFileAliasName: string | undefined;

      if ("singleEntryPointSourceFileRelativePath" in entryPointsGroupSettings__rawValid) {

        isSingeEntryPointGroup = true;

        const absolutePathOfSingleEntryPointOfGroup: string = ImprovedPath.joinPathSegments(
          [
            this.consumingProjectRootDirectoryAbsolutePath,
            entryPointsGroupSettings__rawValid.singleEntryPointSourceFileRelativePath
          ],
          { alwaysForwardSlashSeparators: true }
        );

        currentEntryPointsGroupSourceFilesGlobSelectors.push(absolutePathOfSingleEntryPointOfGroup);
        entryPointsGroupSourceFilesTopDirectoryAbsolutePath = ImprovedPath.extractDirectoryFromFilePath({
          targetPath: absolutePathOfSingleEntryPointOfGroup,
          alwaysForwardSlashSeparators: true,
          ambiguitiesResolution: {
            mustConsiderLastSegmentStartingWithDotAsDirectory: false,
            mustConsiderLastSegmentWithNonLeadingDotAsDirectory: false,
            mustConsiderLastSegmentWithoutDotsAsFileNameWithoutExtension: true
          }
        });

        sourceFilesTopDirectoryPathOrSingleFileAliasName = entryPointsGroupSettings__rawValid.
            singleEntryPointSourceFilePathAliasName;

      } else {

        isSingeEntryPointGroup = false;

        entryPointsGroupSourceFilesTopDirectoryAbsolutePath = ImprovedPath.extractDirectoryFromFilePath({
          targetPath: ImprovedPath.joinPathSegments(
            [
              this.consumingProjectRootDirectoryAbsolutePath,
              entryPointsGroupSettings__rawValid.sourceFilesTopDirectoryRelativePath
            ],
            { alwaysForwardSlashSeparators: true }
          ),
          alwaysForwardSlashSeparators: true,
          ambiguitiesResolution: {
            mustConsiderLastSegmentStartingWithDotAsDirectory: true,
            mustConsiderLastSegmentWithNonLeadingDotAsDirectory: true,
            mustConsiderLastSegmentWithoutDotsAsFileNameWithoutExtension: false
          }
        });

        currentEntryPointsGroupSourceFilesGlobSelectors.push(
          ...this.getSourceFilesGlobSelectorsForMultipleEntryPointsGroup({
            entryPointsGroupSourceFilesTopDirectoryAbsolutePath,
            sourceFilesSelection: entryPointsGroupSettings__rawValid.sourceFilesSelection
          })
        );

        sourceFilesTopDirectoryPathOrSingleFileAliasName = entryPointsGroupSettings__rawValid.
            sourceFilesTopDirectoryPathAliasName;

      }


      const entryPointsOutputFilesActualBaseDirectoryAbsolutePath: string =
          ImprovedPath.joinPathSegments(
            [
              this.consumingProjectRootDirectoryAbsolutePath,
              entryPointsGroupSettings__buildingModeDependent__rawValid.outputTopDirectoryRelativePath
            ],
            { alwaysForwardSlashSeparators: true }
          );

      const entryPointsGroupNormalizedSettings__commonPropertiesOnly: SourceCodeProcessingGenericProperties__Normalized.
          EntryPointsGroup =
          {
            ID: groupID,
            sourceFilesTopDirectoryAbsolutePath: entryPointsGroupSourceFilesTopDirectoryAbsolutePath,
            sourceFilesTopDirectoryPathOrSingleFileAliasName: sourceFilesTopDirectoryPathOrSingleFileAliasName ?? groupID,
            sourceFilesGlobSelectors: currentEntryPointsGroupSourceFilesGlobSelectors,
            isSingeEntryPointGroup,
            outputFilesTopDirectoryAbsolutePath: entryPointsOutputFilesActualBaseDirectoryAbsolutePath,
            outputPathTransformations: OutputPathTransformationsSettingsNormalizer.
                normalize(entryPointsGroupSettings__buildingModeDependent__rawValid.outputPathTransformations)
          };

      entryPointsGroupsSettings__normalized.set(
        groupID,
        completeEntryPointsGroupNormalizedSettingsGeneralPropertiesUntilSpecificEntryPointsGroupNormalizedSettings(
          entryPointsGroupNormalizedSettings__commonPropertiesOnly,
          entryPointsGroupSettings__rawValid
        )
      );

    }

    return entryPointsGroupsSettings__normalized;

  }


  /* [ Theory ]
   *  Generating of a single glob with arbitrary conditions set is very hard, and it's not a fact that it's even possible.
   *  More rational approach is to generate the array of globs consisting of the main exclusive glob and exclusions. */
  private getSourceFilesGlobSelectorsForMultipleEntryPointsGroup(
    {
      entryPointsGroupSourceFilesTopDirectoryAbsolutePath,
      sourceFilesSelection:
        {
          onlyWithPenultimateFileNamesExtensions__withOrWithoutLeadingDots = [],
          mustIgnoreAllSubdirectories = false,
          ...sourceFilesSelection
        } = {}
    }: Readonly<{
      entryPointsGroupSourceFilesTopDirectoryAbsolutePath: string;
      sourceFilesSelection?:
          SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.EntryPointsGroup.SourceFilesSelection;
    }>
  ): Array<string> {

    const inclusiveMainGlobSelector: string = ImprovedGlob.buildAllFilesInCurrentDirectoryAndBelowGlobSelector({
      basicDirectoryPath: entryPointsGroupSourceFilesTopDirectoryAbsolutePath,
      fileNamesExtensions: this.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots,
      penultimateFileNamesExtensions:
          Array.isArray(onlyWithPenultimateFileNamesExtensions__withOrWithoutLeadingDots) ?
              onlyWithPenultimateFileNamesExtensions__withOrWithoutLeadingDots :
              [ onlyWithPenultimateFileNamesExtensions__withOrWithoutLeadingDots ]
    });

    const sourceFilesGlobSelectorsForMultipleEntryPointsGroup: Array<string> = [ inclusiveMainGlobSelector ];

    let penultimateNamesExtensionsOfExcludedFiles__withOrWithoutLeadingDots: ReadonlyArray<string>;

    if (Array.isArray(sourceFilesSelection.penultimateNamesExtensionsOfExcludedFiles__withOrWithoutLeadingDots)) {
      penultimateNamesExtensionsOfExcludedFiles__withOrWithoutLeadingDots =
          sourceFilesSelection.penultimateNamesExtensionsOfExcludedFiles__withOrWithoutLeadingDots;
    } else if (isString(sourceFilesSelection.penultimateNamesExtensionsOfExcludedFiles__withOrWithoutLeadingDots)) {
      penultimateNamesExtensionsOfExcludedFiles__withOrWithoutLeadingDots =
          [ sourceFilesSelection.penultimateNamesExtensionsOfExcludedFiles__withOrWithoutLeadingDots ];
    } else {
      penultimateNamesExtensionsOfExcludedFiles__withOrWithoutLeadingDots = [];
    }

    if (penultimateNamesExtensionsOfExcludedFiles__withOrWithoutLeadingDots.length > 0) {
      sourceFilesGlobSelectorsForMultipleEntryPointsGroup.push(
        ImprovedGlob.buildExcludingOfDirectoryWithSubdirectoriesGlobSelector({
          targetDirectoryPath: entryPointsGroupSourceFilesTopDirectoryAbsolutePath,
          fileNamesExtensions: this.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots,
          penultimateFileNamesExtensions: penultimateNamesExtensionsOfExcludedFiles__withOrWithoutLeadingDots
        })
      );
    }


    let prefixesOfExcludeFiles: ReadonlyArray<string>;

    if (Array.isArray(sourceFilesSelection.prefixesOfExcludeFiles)) {
      prefixesOfExcludeFiles = sourceFilesSelection.prefixesOfExcludeFiles;
    } else if (isString(sourceFilesSelection.prefixesOfExcludeFiles)) {
      prefixesOfExcludeFiles = [ sourceFilesSelection.prefixesOfExcludeFiles ];
    } else {
      prefixesOfExcludeFiles = [];
    }

    if (prefixesOfExcludeFiles.length > 0) {
      sourceFilesGlobSelectorsForMultipleEntryPointsGroup.push(
        ImprovedGlob.buildExcludingOfFilesWithSpecificPrefixesGlobSelector({
          basicDirectoryPath: entryPointsGroupSourceFilesTopDirectoryAbsolutePath,
          filesNamesPrefixes: prefixesOfExcludeFiles,
          filesNamesExtensions: this.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots
        })
      );
    }


    if (mustIgnoreAllSubdirectories) {

      sourceFilesGlobSelectorsForMultipleEntryPointsGroup.push(
        ImprovedGlob.buildAllFilesInCurrentDirectoryButNotBelowGlobSelector({
          basicDirectoryPath: entryPointsGroupSourceFilesTopDirectoryAbsolutePath,
          fileNamesExtensions: this.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots
        })
      );

      return sourceFilesGlobSelectorsForMultipleEntryPointsGroup;

    }


    let namesOfExcludeSubdirectories: ReadonlyArray<string>;

    if (Array.isArray(sourceFilesSelection.namesOfExcludeSubdirectories)) {
      namesOfExcludeSubdirectories = sourceFilesSelection.namesOfExcludeSubdirectories;
    } else if (isString(sourceFilesSelection.namesOfExcludeSubdirectories)) {
      namesOfExcludeSubdirectories = [ sourceFilesSelection.namesOfExcludeSubdirectories ];
    } else {
      namesOfExcludeSubdirectories = [];
    }

    if (namesOfExcludeSubdirectories.length > 0) {
      sourceFilesGlobSelectorsForMultipleEntryPointsGroup.push(
        ImprovedGlob.buildExcludingOfFilesInSpecificSubdirectoriesGlobSelector({
          basicDirectoryPath: entryPointsGroupSourceFilesTopDirectoryAbsolutePath,
          subdirectoriesNames: namesOfExcludeSubdirectories,
          filesNamesExtensions: this.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots
        })
      );
    }


    let prefixesOfExcludedSubdirectories: ReadonlyArray<string>;

    if (Array.isArray(sourceFilesSelection.prefixesOfExcludedSubdirectories)) {
      prefixesOfExcludedSubdirectories = sourceFilesSelection.prefixesOfExcludedSubdirectories;
    } else if (isString(sourceFilesSelection.prefixesOfExcludedSubdirectories)) {
      prefixesOfExcludedSubdirectories = [ sourceFilesSelection.prefixesOfExcludedSubdirectories ];
    } else {
      prefixesOfExcludedSubdirectories = [];
    }

    if (prefixesOfExcludedSubdirectories.length > 0) {
      sourceFilesGlobSelectorsForMultipleEntryPointsGroup.push(
        ImprovedGlob.buildExcludingOfFilesInSubdirectoriesWithSpecificPrefixesGlobSelector({
          basicDirectoryPath: entryPointsGroupSourceFilesTopDirectoryAbsolutePath,
          subdirectoriesPrefixes: prefixesOfExcludedSubdirectories,
          filesNamesExtensions: this.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots
        })
      );
    }


    return sourceFilesGlobSelectorsForMultipleEntryPointsGroup;

  }


  /* ─── Auxiliary getters ────────────────────────────────────────────────────────────────────────────────────────── */
  protected get consumingProjectRootDirectoryAbsolutePath(): string {
    return this.projectBuildingCommonSettings__normalized.projectRootDirectoryAbsolutePath;
  }

  protected get consumingProjectBuildingMode(): ConsumingProjectBuildingModes {
    return this.projectBuildingCommonSettings__normalized.projectBuildingMode;
  }

  protected get actualPublicDirectoryAbsolutePath(): string | undefined {
    return this.projectBuildingCommonSettings__normalized.actualPublicDirectoryAbsolutePath;
  }

}


namespace SourceCodeProcessingRawSettingsNormalizer {

  export type ConstructorParameter = Readonly<{
    projectBuildingCommonSettings__normalized: ProjectBuildingCommonSettings__Normalized;
    entryPointsGroupsIDsSelection?: ReadonlyArray<string>;
  }>;

}


export default SourceCodeProcessingRawSettingsNormalizer;
