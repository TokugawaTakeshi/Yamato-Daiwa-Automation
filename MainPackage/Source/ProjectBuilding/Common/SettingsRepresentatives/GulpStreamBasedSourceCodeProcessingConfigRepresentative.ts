import SourceCodeProcessingConfigRepresentative from "./SourceCodeProcessingConfigRepresentative";
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";

/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";

/* --- Utils -------------------------------------------------------------------------------------------------------- */
import {
  addMultiplePairsToMap,
  isUndefined,
  Logger,
  UnexpectedEventError
} from "@yamato-daiwa/es-extensions";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";
import ImprovedGlob from "@UtilsIncubator/ImprovedGlob";
import PartialsFilesMapper from "@Utils/PartialsFilesMapper";


abstract class GulpStreamBasedSourceCodeProcessingConfigRepresentative<
  SourceCodeProcessorsCommonNormalizedSettings extends ProjectBuildingConfig__Normalized.
      SourceCodeProcessingCommonSettingsGenericProperties,
  EntryPointsGroupNormalizedSettings extends ProjectBuildingConfig__Normalized.EntryPointsGroupGenericSettings
> extends SourceCodeProcessingConfigRepresentative<
  SourceCodeProcessorsCommonNormalizedSettings,
  EntryPointsGroupNormalizedSettings
> {

  static #localization: GulpStreamBasedSourceCodeProcessingConfigRepresentative.Localization =
      GulpStreamBasedSourceCodeProcessingConfigRepresentative.getDefaultLocalization();


  public abstract readonly waitingForTheOtherFilesWillBeSavedPeriod__seconds: number;


  public readonly partialFilesAndEntryPointsRelationsMap: PartialsFilesMapper.
      PartialFilesAndParentEntryPointsRelationsMap = new Map();
  public readonly mustLogPartialFilesAndEntryPointsRelationsMap: boolean;


  /* === Static helpers ============================================================================================= */
  public static computeRelevantOutputDirectoryAbsolutePathForTargetSourceFile<
    EntryPointsGroupNormalizedSettings extends ProjectBuildingConfig__Normalized.EntryPointsGroupGenericSettings
  >(
    targetSourceFileAbsolutePath: string,
    respectiveEntryPointsGroupSettings: EntryPointsGroupNormalizedSettings
  ): string {

    if (respectiveEntryPointsGroupSettings.isSingeEntryPointGroup) {
      return respectiveEntryPointsGroupSettings.outputFilesTopDirectoryAbsolutePath;
    }


    return ImprovedPath.joinPathSegments(
      [
        respectiveEntryPointsGroupSettings.outputFilesTopDirectoryAbsolutePath,
        ImprovedPath.computeRelativePath({
          basePath: respectiveEntryPointsGroupSettings.sourceFilesTopDirectoryAbsolutePath,
          comparedPath: ImprovedPath.extractDirectoryFromFilePath(targetSourceFileAbsolutePath)
        })
      ],
      { forwardSlashOnlySeparators: true }
    );
  }

  public static setLocalization(newLocalization: GulpStreamBasedSourceCodeProcessingConfigRepresentative.Localization): void {
    this.#localization = newLocalization;
  }


  protected constructor(namedParameters: GulpStreamBasedSourceCodeProcessingConfigRepresentative.ConstructorNamedParameters) {
    super(namedParameters.masterConfigRepresentative);
    this.mustLogPartialFilesAndEntryPointsRelationsMap = namedParameters.mustLogPartialFilesAndEntryPointsRelationsMap;
  }


  public get hasAtLeastOneRelevantEntryPointsGroup(): boolean {
    return this.relevantEntryPointsGroupsSettings.size > 0;
  }

  public get relevantEntryPointsSourceFilesAbsolutePaths(): Array<string> {

    const entryPointsSourceFilesAbsolutePathsRelevantForCurrentProjectBuildingMode: Array<string> = [];

    this.relevantEntryPointsGroupsSettings.forEach(
      (entryPointsGroupNormalizedSettings: EntryPointsGroupNormalizedSettings): void => {
        entryPointsSourceFilesAbsolutePathsRelevantForCurrentProjectBuildingMode.push(
          ...ImprovedGlob.getFilesAbsolutePathsSynchronously(entryPointsGroupNormalizedSettings.sourceFilesGlobSelectors)
        );
      }
    );

    return entryPointsSourceFilesAbsolutePathsRelevantForCurrentProjectBuildingMode;
  }

  public get relevantEntryPointsSourceDirectoriesAbsolutePaths(): Array<string> {
    return Array.from(this.relevantEntryPointsGroupsSettings.values()).map(
      (entryPointsGroupNormalizedSettings: EntryPointsGroupNormalizedSettings): string =>
          entryPointsGroupNormalizedSettings.sourceFilesTopDirectoryAbsolutePath
    );
  }

  public getExpectedToExistEntryPointsGroupSettingsRelevantForSpecifiedSourceFileAbsolutePath(
    targetSourceFileAbsolutePath: string
  ): EntryPointsGroupNormalizedSettings {

    let entryPointsGroupsNormalizedSettingsRelevantForTargetSourceFile: EntryPointsGroupNormalizedSettings | undefined;

    for (const entryPointsGroupNormalizedSettings of this.relevantEntryPointsGroupsSettings.values()) {
      if (
        ImprovedGlob.isFileMatchingWithAllGlobSelectors({
          filePath: targetSourceFileAbsolutePath,
          globSelectors: entryPointsGroupNormalizedSettings.sourceFilesGlobSelectors
        })
      ) {
        entryPointsGroupsNormalizedSettingsRelevantForTargetSourceFile = entryPointsGroupNormalizedSettings;
        break;
      }
    }


    if (isUndefined(entryPointsGroupsNormalizedSettingsRelevantForTargetSourceFile)) {
      Logger.throwErrorAndLog({
        errorInstance: new UnexpectedEventError(
          GulpStreamBasedSourceCodeProcessingConfigRepresentative.
              #localization.generateEntryPointsGroupNormalizedSettingsNotFoundForSpecifiedFilePath({
                targetSourceFileAbsolutePath
              })
        ),
        title: UnexpectedEventError.localization.defaultTitle,
        occurrenceLocation: "GulpStreamBasedSourceCodeProcessingConfigRepresentative(Inheritor)." +
            "getEntryPointsGroupSettingsRelevantForSpecifiedSourceFileAbsolutePath(targetSourceFileAbsolutePath)"
      });
    }

    return entryPointsGroupsNormalizedSettingsRelevantForTargetSourceFile;
  }


  /* === Partial files and entry points relations map  =============================================================  */
  public initializeOrUpdatePartialFilesAndEntryPointsRelationsMap(): void {

    this.partialFilesAndEntryPointsRelationsMap.clear();

    addMultiplePairsToMap(
      this.partialFilesAndEntryPointsRelationsMap,
      PartialsFilesMapper.getPartialFilesAndParentEntryPointsRelationsMap({
        targetEntryPointsFilesAbsolutePaths: this.relevantEntryPointsSourceFilesAbsolutePaths,
        sourceFilesTypeLabelForLogging: this.TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM,
        masterConfigRepresentative: this.masterConfigRepresentative,
        loggingIsEnabled: this.mustLogPartialFilesAndEntryPointsRelationsMap
      })
    );
  }


  /* === Localization =============================================================================================== */
  private static getDefaultLocalization(): GulpStreamBasedSourceCodeProcessingConfigRepresentative.Localization {
    return {
      generateEntryPointsGroupNormalizedSettingsNotFoundForSpecifiedFilePath: (
        { targetSourceFileAbsolutePath }: { targetSourceFileAbsolutePath: string; }
      ): string => `No normalized config found for file '${ targetSourceFileAbsolutePath }'.'`
    };
  }
}


namespace GulpStreamBasedSourceCodeProcessingConfigRepresentative {

  export type ConstructorNamedParameters = Readonly<{
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
    mustLogPartialFilesAndEntryPointsRelationsMap: boolean;
  }>;

  export type Localization = Readonly<{
    generateEntryPointsGroupNormalizedSettingsNotFoundForSpecifiedFilePath: (
      parametersObject: { targetSourceFileAbsolutePath: string; }
    ) => string;
  }>;

}


export default GulpStreamBasedSourceCodeProcessingConfigRepresentative;
