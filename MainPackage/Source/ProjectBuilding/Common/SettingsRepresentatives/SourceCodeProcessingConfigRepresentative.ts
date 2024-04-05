import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";

/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type SourceCodeProcessingGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/SourceCodeProcessingGenericProperties__Normalized";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import Path from "path";
import { Logger, UnexpectedEventError } from "@yamato-daiwa/es-extensions";
import { ImprovedGlob, ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


export default abstract class SourceCodeProcessingConfigRepresentative<
  SourceCodeProcessingCommonSettings__Normalized extends SourceCodeProcessingGenericProperties__Normalized.Common,
  EntryPointsGroupSettings__Normalized extends SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup
> {

  /* [ Theory ] Below two fields could be even or not. */
  public abstract readonly supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: ReadonlyArray<string>;
  public abstract readonly actualFileNameExtensionsWithoutLeadingDots: ReadonlyArray<string>;

  public abstract readonly mustLogSourceFilesWatcherEvents: boolean;

  public abstract readonly TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM: string;
  public abstract readonly TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM: string;

  public abstract readonly relevantEntryPointsGroupsSettings: ReadonlyMap<
    SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup.ID, EntryPointsGroupSettings__Normalized
  >;
  protected abstract readonly sourceCodeProcessingCommonSettings: SourceCodeProcessingCommonSettings__Normalized;

  protected projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;

  private cachedInitialRelevantEntryPointsSourceFilesAbsolutePaths?: Array<string>;


  protected constructor(projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative) {
    this.projectBuildingMasterConfigRepresentative = projectBuildingMasterConfigRepresentative;
  }


  public isEntryPoint(targetFileAbsolutePath: string): boolean {

    if (!Path.isAbsolute(targetFileAbsolutePath)) {

      if (__IS_DEVELOPMENT_BUILDING_MODE__) {
        Logger.throwErrorAndLog({
          errorInstance: new UnexpectedEventError(
              "\"sourceCodeProcessingConfigRepresentative.isEntryPoint\" works only with absolute paths while " +
                `the relative path "${ targetFileAbsolutePath }" has been passed.`
          ),
          title: UnexpectedEventError.localization.defaultTitle,
          occurrenceLocation: "sourceCodeProcessingConfigRepresentative.isEntryPoint(targetFileAbsolutePath)"
        });
      }


      /* eslint-disable-next-line no-param-reassign --
      * Yes, basically the parameter reassigning must not be, but here is the emergency measures. */
      targetFileAbsolutePath = ImprovedPath.joinPathSegments(
        [
          this.projectBuildingMasterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath,
          targetFileAbsolutePath
        ],
        { alwaysForwardSlashSeparators: true }
      );

    }


    return Array.from(this.relevantEntryPointsGroupsSettings.values()).
        some(
          (entryPointGroupSettings: EntryPointsGroupSettings__Normalized): boolean => (
              entryPointGroupSettings.isSingeEntryPointGroup ?
                  targetFileAbsolutePath === entryPointGroupSettings.sourceFilesGlobSelectors[0] :
                  ImprovedGlob.isFilePathMatchingWithAllGlobSelectors({
                    filePath: targetFileAbsolutePath,
                    globSelectors: entryPointGroupSettings.sourceFilesGlobSelectors
                  })
          )
        );

  }

  public get actualOutputFilesGlobSelectors(): Array<string> {
    return Array.from(this.relevantEntryPointsGroupsSettings.values()).map(
      (entryPointsGroupNormalizedSettings: EntryPointsGroupSettings__Normalized): string =>
        ImprovedGlob.buildAllFilesInCurrentDirectoryAndBelowGlobSelector({
          basicDirectoryPath: entryPointsGroupNormalizedSettings.
              outputFilesTopDirectoryAbsolutePath,
          fileNamesExtensions: this.sourceCodeProcessingCommonSettings.supportedOutputFileNameExtensionsWithoutLeadingDots
      })
    );
  }

  public get initialRelevantEntryPointsSourceFilesAbsolutePaths(): Array<string> {
    return this.cachedInitialRelevantEntryPointsSourceFilesAbsolutePaths ?? (
      this.cachedInitialRelevantEntryPointsSourceFilesAbsolutePaths =
          Array.from(this.relevantEntryPointsGroupsSettings.values()).
              flatMap(
                (entryPointsGroupNormalizedSettings: EntryPointsGroupSettings__Normalized): Array<string> =>
                    ImprovedGlob.getFilesAbsolutePathsSynchronously(
                      entryPointsGroupNormalizedSettings.sourceFilesGlobSelectors
                    )
              )
    );
  }

}
