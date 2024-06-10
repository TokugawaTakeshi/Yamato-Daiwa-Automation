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

  protected readonly abstract supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: ReadonlyArray<string>;

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
            mustConsiderLastSegmentWihtoutDotsAsFileNameWithoutExtension: true
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
            mustConsiderLastSegmentWihtoutDotsAsFileNameWithoutExtension: false
          }
        });

        currentEntryPointsGroupSourceFilesGlobSelectors.push(
          ...this.getSourceFilesGlobSelectorsForMultipleEntryPointsGroup({
            entryPointsSourceFilesDirectoryAbsolutePath: entryPointsGroupSourceFilesTopDirectoryAbsolutePath,
            partialsRecognition: entryPointsGroupSettings__rawValid.partialsRecognition
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
   *  Generating of single glob with arbitrary conditions set is very difficult, and it's not a fact that it's even possible.
   *  More rational approach is generate the array of globs consisting on main exclusive glob and exclusions. */
  private getSourceFilesGlobSelectorsForMultipleEntryPointsGroup(
    {
      entryPointsSourceFilesDirectoryAbsolutePath,
      partialsRecognition
    }: Readonly<{
      entryPointsSourceFilesDirectoryAbsolutePath: string;
      partialsRecognition?: SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.EntryPointsGroup.
          EntryPointsRecognitionSettings;
    }>
  ): Array<string> {

    const inclusiveMainGlobSelector: string = ImprovedGlob.buildAllFilesInCurrentDirectoryAndBelowGlobSelector({
      basicDirectoryPath: entryPointsSourceFilesDirectoryAbsolutePath,
      fileNamesExtensions: this.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots
    });

    if (isUndefined(partialsRecognition)) {
      return [ inclusiveMainGlobSelector ];
    }


    /* [ Specification ]
     * If `partialsRecognition` has not been specified, all files with filename extensions
     *   `this.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots` below `entryPointsSourceFilesDirectoryAbsolutePath`
     *   are being considered as entry points. */
    const sourceFilesGlobSelectorsForMultipleEntryPointsGroup: Array<string> = [ inclusiveMainGlobSelector ];

    let prefixesOfFilesWhichMustBeExcluded: Array<string> | undefined;

    if (Array.isArray(partialsRecognition.excludeFilesWithPrefixes)) {
      prefixesOfFilesWhichMustBeExcluded = partialsRecognition.excludeFilesWithPrefixes;
    } else if (isString(partialsRecognition.excludeFilesWithPrefixes)) {
      prefixesOfFilesWhichMustBeExcluded = [ partialsRecognition.excludeFilesWithPrefixes ];
    }

    if (isNotUndefined(prefixesOfFilesWhichMustBeExcluded)) {
      sourceFilesGlobSelectorsForMultipleEntryPointsGroup.push(
        ImprovedGlob.buildExcludingOfFilesWithSpecificPrefixesGlobSelector({
          basicDirectoryPath: entryPointsSourceFilesDirectoryAbsolutePath,
          filesNamesPrefixes: prefixesOfFilesWhichMustBeExcluded,
          filesNamesExtensions: this.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots
        })
      );
    }


    if (partialsRecognition.excludeAllSubdirectories === true) {

      sourceFilesGlobSelectorsForMultipleEntryPointsGroup.push(
        ImprovedGlob.buildAllFilesInCurrentDirectoryButNotBelowGlobSelector({
          basicDirectoryPath: entryPointsSourceFilesDirectoryAbsolutePath,
          fileNamesExtensions: this.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots
        })
      );

      return sourceFilesGlobSelectorsForMultipleEntryPointsGroup;

    }


    let prefixesOfSubdirectoriesInWhichFilesMustBeExcluded: Array<string> | undefined;

    if (Array.isArray(partialsRecognition.excludeSubdirectoriesWithPrefixes)) {
      prefixesOfSubdirectoriesInWhichFilesMustBeExcluded = partialsRecognition.excludeSubdirectoriesWithPrefixes;
    } else if (isString(partialsRecognition.excludeSubdirectoriesWithPrefixes)) {
      prefixesOfSubdirectoriesInWhichFilesMustBeExcluded = [ partialsRecognition.excludeSubdirectoriesWithPrefixes ];
    }

    if (isNotUndefined(prefixesOfSubdirectoriesInWhichFilesMustBeExcluded)) {
      sourceFilesGlobSelectorsForMultipleEntryPointsGroup.push(
        ImprovedGlob.buildExcludingOfFilesInSubdirectoriesWithSpecificPrefixesGlobSelector({
          basicDirectoryPath: entryPointsSourceFilesDirectoryAbsolutePath,
          subdirectoriesPrefixes: prefixesOfSubdirectoriesInWhichFilesMustBeExcluded,
          filesNamesExtensions: this.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots
        })
      );
    }


    let namesOfSubdirectoriesInWhichFilesMustBeExcluded: Array<string> | undefined;

    if (Array.isArray(partialsRecognition.excludeSubdirectoriesWithNames)) {
      namesOfSubdirectoriesInWhichFilesMustBeExcluded = partialsRecognition.excludeSubdirectoriesWithNames;
    } else if (isString(partialsRecognition.excludeSubdirectoriesWithNames)) {
      namesOfSubdirectoriesInWhichFilesMustBeExcluded = [ partialsRecognition.excludeSubdirectoriesWithNames ];
    }

    if (isNotUndefined(namesOfSubdirectoriesInWhichFilesMustBeExcluded)) {
      sourceFilesGlobSelectorsForMultipleEntryPointsGroup.push(
        ImprovedGlob.buildExcludingOfFilesInSpecificSubdirectoriesGlobSelector({
          basicDirectoryPath: entryPointsSourceFilesDirectoryAbsolutePath,
          subdirectoriesNames: namesOfSubdirectoriesInWhichFilesMustBeExcluded,
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
