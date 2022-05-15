/* -- Raw valid config ------------------------------------------------------------------------------------------------ */
import type SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid from
    "@ProjectBuilding:Common/RawConfig/SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid";

/* -- Normalized config --------------------------------------------------------------------------------------------- */
import type ProjectBuildingConfig__Normalized from "../../ProjectBuildingConfig__Normalized";

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

  protected readonly abstract supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: Array<string>;

  protected readonly consumingProjectRootDirectoryAbsolutePath: string;
  protected readonly consumingProjectBuildingMode: string;

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

    /* [ Approach ] This case could be both valid (e. g. if inside the project styles are being declared only inside
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
      const isSingeEntryPointGroup: boolean = ImprovedPath.hasFilenameExtension(
        entryPointsGroupSettings__rawValid.entryPointsSourceFilesTopDirectoryOrSingleFileRelativePath
      );

      if (isSingeEntryPointGroup) {

        const absolutePathOfSingleEntryPointOfGroup: string = ImprovedPath.buildAbsolutePath(
          [
            this.consumingProjectRootDirectoryAbsolutePath,
            entryPointsGroupSettings__rawValid.entryPointsSourceFilesTopDirectoryOrSingleFileRelativePath
          ],
          { forwardSlashOnlySeparators: true }
        );

        currentEntryPointsGroupSourceFilesGlobSelectors.push(absolutePathOfSingleEntryPointOfGroup);
        entryPointsGroupSourceFilesTopDirectoryAbsolutePath = ImprovedPath.extractDirectoryFromFilePath(
          absolutePathOfSingleEntryPointOfGroup
        );

      } else {

        entryPointsGroupSourceFilesTopDirectoryAbsolutePath = ImprovedPath.extractDirectoryFromFilePath(
          ImprovedPath.buildAbsolutePath(
            [
              this.consumingProjectRootDirectoryAbsolutePath,
              entryPointsGroupSettings__rawValid.entryPointsSourceFilesTopDirectoryOrSingleFileRelativePath
            ],
            { forwardSlashOnlySeparators: true }
          )
        );

        currentEntryPointsGroupSourceFilesGlobSelectors.push(
          ...this.getSourceFilesGlobSelectorsForMultipleEntryPointsGroup({
            entryPointsGroupSettings__rawValid,
            entryPointsSourceFilesDirectoryAbsolutePath: entryPointsGroupSourceFilesTopDirectoryAbsolutePath
          })
        );
      }


      const entryPointsOutputFilesActualBaseDirectoryAbsolutePath: string =
          ImprovedPath.buildAbsolutePath(
            [
              this.consumingProjectRootDirectoryAbsolutePath,
              entryPointsGroupSettings__buildingModeDependent__rawValid.outputBaseDirectoryRelativePath
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
  private getSourceFilesGlobSelectorsForMultipleEntryPointsGroup<
    EntryPointsGroupRawSettings extends SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.EntryPointsGroup
  >(
    {
      entryPointsGroupSettings__rawValid,
      entryPointsSourceFilesDirectoryAbsolutePath
    }: {
      entryPointsGroupSettings__rawValid: EntryPointsGroupRawSettings;
      entryPointsSourceFilesDirectoryAbsolutePath: string;
    }
  ): Array<string> {

    const sourceFilesGlobSelectorsForMultipleEntryPointsGroup: Array<string> = [];


    /* [ Specification ] If 'partialsRecognition' has not been specified, all files with filename extensions
     *  'this.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots' below 'entryPointsSourceFilesDirectoryAbsolutePath'
     *  are being considered as entry points. */
    if (isUndefined(entryPointsGroupSettings__rawValid.partialsRecognition)) {

      sourceFilesGlobSelectorsForMultipleEntryPointsGroup.push(
        ImprovedGlob.buildAllFilesInCurrentDirectoryAndBelowGlobSelector({
          basicDirectoryPath: entryPointsSourceFilesDirectoryAbsolutePath,
          fileNamesExtensions: this.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots
        })
      );

    } else if (entryPointsGroupSettings__rawValid.partialsRecognition.excludeAllSubdirectories === true) {

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

      if (Array.isArray(entryPointsGroupSettings__rawValid.partialsRecognition.excludeFilesWithPrefixes)) {
        prefixesOfFilesWhichMustBeExcluded = entryPointsGroupSettings__rawValid.partialsRecognition.excludeFilesWithPrefixes;
      } else if (isString(entryPointsGroupSettings__rawValid.partialsRecognition.excludeFilesWithPrefixes)) {
        prefixesOfFilesWhichMustBeExcluded = [ entryPointsGroupSettings__rawValid.partialsRecognition.excludeFilesWithPrefixes ];
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

      if (Array.isArray(entryPointsGroupSettings__rawValid.partialsRecognition.excludeSubdirectoriesWithPrefixes)) {
        prefixesOfSubdirectoriesInWhichFilesMustBeExcluded = entryPointsGroupSettings__rawValid.
            partialsRecognition.excludeSubdirectoriesWithPrefixes;
      } else if (isString(entryPointsGroupSettings__rawValid.partialsRecognition.excludeSubdirectoriesWithPrefixes)) {
        prefixesOfSubdirectoriesInWhichFilesMustBeExcluded = [
          entryPointsGroupSettings__rawValid.partialsRecognition.excludeSubdirectoriesWithPrefixes
        ];
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

      if (Array.isArray(entryPointsGroupSettings__rawValid.partialsRecognition.excludeSubdirectoriesWithNames)) {
        namesOfSubdirectoriesInWhichFilesMustBeExcluded = entryPointsGroupSettings__rawValid.
            partialsRecognition.excludeSubdirectoriesWithNames;
      } else if (isString(entryPointsGroupSettings__rawValid.partialsRecognition.excludeSubdirectoriesWithNames)) {
        namesOfSubdirectoriesInWhichFilesMustBeExcluded = [
          entryPointsGroupSettings__rawValid.partialsRecognition.excludeSubdirectoriesWithNames
        ];
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
  export type ConstructorParameters = {
    readonly consumingProjectRootDirectoryAbsolutePath: string;
    readonly consumingProjectBuildingMode: string;
    readonly entryPointsGroupsIDsSelection?: Array<string>;
  };
}


export default SourceCodeProcessingRawSettingsNormalizer;
