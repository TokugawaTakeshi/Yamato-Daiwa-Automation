/* -- Restrictions -------------------------------------------------------------------------------------------------- */
import type ConsumingProjectPreDefinedBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectPreDefinedBuildingModes";

/* -- Raw valid config ---------------------------------------------------------------------------------------------- */
import type SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid from
    "@ProjectBuilding:Common/RawConfig/SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid";

/* -- Normalized config --------------------------------------------------------------------------------------------- */
import type ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";

/* --- Auxiliaries -------------------------------------------------------------------------------------------------- */
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";
import ImprovedGlob from "@UtilsIncubator/ImprovedGlob";
import {
  isUndefined,
  isNotUndefined,
  isNonEmptyArray,
  isString
} from "@yamato-daiwa/es-extensions";


abstract class SourceCodeProcessingRawSettingsNormalizer {

  protected readonly abstract supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: ReadonlyArray<string>;

  protected readonly consumingProjectRootDirectoryAbsolutePath: string;
  protected readonly consumingProjectBuildingMode: ConsumingProjectPreDefinedBuildingModes;

  private readonly entryPointsGroupsIDsSelection?: Array<string>;


  protected constructor(namedParameters: SourceCodeProcessingRawSettingsNormalizer.ConstructorParameters) {

    this.consumingProjectRootDirectoryAbsolutePath = namedParameters.consumingProjectRootDirectoryAbsolutePath;
    this.consumingProjectBuildingMode = namedParameters.consumingProjectBuildingMode;

    if (isNonEmptyArray(namedParameters.entryPointsGroupsIDsSelection)) {
      this.entryPointsGroupsIDsSelection = namedParameters.entryPointsGroupsIDsSelection;
    }
  }


  protected createNormalizedEntryPointsGroupsSettings<
    EntryPointsGroupSettings__RawValid extends SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.EntryPointsGroup,
    EntryPointsGroupSettings__Normalized extends ProjectBuildingConfig__Normalized.EntryPointsGroupGenericSettings
  >(
    entryPointsGroupsSettings__rawValid: { [ID: string]: EntryPointsGroupSettings__RawValid; } | undefined,
    completeEntryPointsGroupNormalizedSettingsGeneralPropertiesUntilSpecificEntryPointsGroupNormalizedSettings:
        (
          entryPointsGroupSettings__normalized: ProjectBuildingConfig__Normalized.EntryPointsGroupGenericSettings,
          entryPointsGroupSettings__rawValid: EntryPointsGroupSettings__RawValid
        ) => EntryPointsGroupSettings__Normalized
  ): Map<ProjectBuildingConfig__Normalized.EntryPointsGroupID, EntryPointsGroupSettings__Normalized> {

    const entryPointsGroupsSettings__normalized: Map<
      ProjectBuildingConfig__Normalized.EntryPointsGroupID, EntryPointsGroupSettings__Normalized
    > = new Map<ProjectBuildingConfig__Normalized.EntryPointsGroupID, EntryPointsGroupSettings__Normalized>();

    /* [ Approach ] This case could be both valid (e.g. if inside the project markup is being declared only inside
        Vue components) or invalid. */
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

      if ("singleEntryPointRelativePath" in entryPointsGroupSettings__rawValid) {

        isSingeEntryPointGroup = true;

        const absolutePathOfSingleEntryPointOfGroup: string = ImprovedPath.joinPathSegments(
          [
            this.consumingProjectRootDirectoryAbsolutePath,
            entryPointsGroupSettings__rawValid.singleEntryPointRelativePath
          ],
          { forwardSlashOnlySeparators: true }
        );

        currentEntryPointsGroupSourceFilesGlobSelectors.push(absolutePathOfSingleEntryPointOfGroup);
        entryPointsGroupSourceFilesTopDirectoryAbsolutePath = ImprovedPath.extractDirectoryFromFilePath(
          absolutePathOfSingleEntryPointOfGroup
        );

      } else {

        isSingeEntryPointGroup = false;

        entryPointsGroupSourceFilesTopDirectoryAbsolutePath = ImprovedPath.extractDirectoryFromFilePath(
          ImprovedPath.joinPathSegments(
            [
              this.consumingProjectRootDirectoryAbsolutePath,
              entryPointsGroupSettings__rawValid.topDirectoryRelativePath
            ],
            { forwardSlashOnlySeparators: true }
          )
        );

        currentEntryPointsGroupSourceFilesGlobSelectors.push(
          ...this.getSourceFilesGlobSelectorsForMultipleEntryPointsGroup({
            entryPointsSourceFilesDirectoryAbsolutePath: entryPointsGroupSourceFilesTopDirectoryAbsolutePath,
            partialsRecognition: entryPointsGroupSettings__rawValid.partialsRecognition
          })
        );
      }


      const entryPointsOutputFilesActualBaseDirectoryAbsolutePath: string =
          ImprovedPath.joinPathSegments(
            [
              this.consumingProjectRootDirectoryAbsolutePath,
              entryPointsGroupSettings__buildingModeDependent__rawValid.outputTopDirectoryRelativePath
            ],
            { forwardSlashOnlySeparators: true }
          );

      const entryPointsGroupNormalizedSettings__commonPropertiesOnly: ProjectBuildingConfig__Normalized.
          EntryPointsGroupGenericSettings =
          {
            ID: groupID,
            sourceFilesTopDirectoryAbsolutePath: entryPointsGroupSourceFilesTopDirectoryAbsolutePath,
            sourceFilesGlobSelectors: currentEntryPointsGroupSourceFilesGlobSelectors,
            isSingeEntryPointGroup,
            outputFilesTopDirectoryAbsolutePath: entryPointsOutputFilesActualBaseDirectoryAbsolutePath
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
   *  Generating of single glob with arbitrary conditions set is very difficult and it's not a fact that it's even possible.
   *  More rational approach is generate the array of globs consisting on main exclusive glob and exclusions.
   * */
  private getSourceFilesGlobSelectorsForMultipleEntryPointsGroup(
    {
      entryPointsSourceFilesDirectoryAbsolutePath,
      partialsRecognition
    }: {
      entryPointsSourceFilesDirectoryAbsolutePath: string;
      partialsRecognition?: SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.EntryPointsGroup.
          EntryPointsRecognitionSettings;
    }
  ): Array<string> {

    const sourceFilesGlobSelectorsForMultipleEntryPointsGroup: Array<string> = [];


    /* [ Specification ] If 'partialsRecognition' has not been specified, all files with filename extensions
     *  'this.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots' below 'entryPointsSourceFilesDirectoryAbsolutePath'
     *  are being considered as entry points. */
    if (isUndefined(partialsRecognition)) {

      sourceFilesGlobSelectorsForMultipleEntryPointsGroup.push(
        ImprovedGlob.buildAllFilesInCurrentDirectoryAndBelowGlobSelector({
          basicDirectoryPath: entryPointsSourceFilesDirectoryAbsolutePath,
          fileNamesExtensions: this.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots
        })
      );

    } else if (partialsRecognition.excludeAllSubdirectories === true) {

      sourceFilesGlobSelectorsForMultipleEntryPointsGroup.push(
        ImprovedGlob.buildAllFilesInCurrentDirectoryButNotBelowGlobSelector({
          basicDirectoryPath: entryPointsSourceFilesDirectoryAbsolutePath,
          fileNamesExtensions: this.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots
        })
      );

    } else {

      const inclusiveMainGlobSelector: string = ImprovedGlob.buildAllFilesInCurrentDirectoryAndBelowGlobSelector({
        basicDirectoryPath: entryPointsSourceFilesDirectoryAbsolutePath,
        fileNamesExtensions: this.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots
      });

      sourceFilesGlobSelectorsForMultipleEntryPointsGroup.push(inclusiveMainGlobSelector);

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
            filenamesExtensions: this.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots
          })
        );
      }
    }

    return sourceFilesGlobSelectorsForMultipleEntryPointsGroup;
  }
}


namespace SourceCodeProcessingRawSettingsNormalizer {
  export type ConstructorParameters = Readonly<{
    consumingProjectRootDirectoryAbsolutePath: string;
    consumingProjectBuildingMode: ConsumingProjectPreDefinedBuildingModes;
    entryPointsGroupsIDsSelection?: Array<string>;
  }>;
}


export default SourceCodeProcessingRawSettingsNormalizer;
