/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import type PlainCopyingSettings__FromFile__RawValid from
    "@ProjectBuilding/PlainCopying/PlainCopyingSettings__FromFile__RawValid";

/* ─── Default Settings ───────────────────────────────────────────────────────────────────────────────────────────── */
import PlainCopyingSettings__Default from "@ProjectBuilding/PlainCopying/PlainCopyingSettings__Default";

/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";
import type PlainCopyingSettings__Normalized from "@ProjectBuilding/PlainCopying/PlainCopyingSettings__Normalized";

/* ─── Settings normalizers ───────────────────────────────────────────────────────────────────────────────────────── */
import OutputPathTransformationsSettingsNormalizer from
    "@ProjectBuilding/Common/RawSettingsNormalizers/Reusables/OutputPathTransformationsSettingsNormalizer";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import OutputDirectoryPathTransformationsSettingsRepresentative from
    "@ProjectBuilding/Common/SettingsRepresentatives/OutputDirectoryPathTransformationsSettingsRepresentative";

/* ─── Data stores ────────────────────────────────────────────────────────────────────────────────────────────────── */
import PlainCopyingSharedState from "@ProjectBuilding/PlainCopying/PlainCopyingSharedState";

/* ─── Applied Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import generateRevisionHash from "rev-hash";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import FileSystem from "fs";
import {
  removeAllFileNameExtensions,
  extractAllFileNameExtensions,
  addEntriesToMap,
  extractFileNameWithAllExtensionsFromPath,
  isNotUndefined,
  isUndefined
} from "@yamato-daiwa/es-extensions";
import {
  ImprovedGlob,
  ImprovedPath
} from "@yamato-daiwa/es-extensions-nodejs";


export default class PlainCopyingRawSettingsNormalizer {

  public static normalize(
    {
      plainCopyingSettings__fromFile__rawValid,
      commonSettings__normalized: {
        tasksAndSourceFilesSelection,
        projectRootDirectoryAbsolutePath,
        projectBuildingMode
      }
    }: Readonly<{
      plainCopyingSettings__fromFile__rawValid: PlainCopyingSettings__FromFile__RawValid;
      commonSettings__normalized: ProjectBuildingCommonSettings__Normalized;
    }>
  ): PlainCopyingSettings__Normalized {

    const explicitlySpecifiedActualFilesGroupsIDs: ReadonlyArray<string> = tasksAndSourceFilesSelection?.plainCopying ?? [];


    const filesGroups: { [groupID: string]: PlainCopyingSettings__Normalized.FilesGroup; } = {};

    for (
      const [ filesGroupID, filesGroup__rawValid__fromFile ] of
          Object.entries(plainCopyingSettings__fromFile__rawValid.filesGroups)
    ) {

      if (
        explicitlySpecifiedActualFilesGroupsIDs.length > 0 &&
            !explicitlySpecifiedActualFilesGroupsIDs.includes(filesGroupID)
      ) {
        continue;
      }


      const aliasName: string = filesGroup__rawValid__fromFile.aliasName ?? filesGroupID;

      if ("sourceFileRelativePath" in filesGroup__rawValid__fromFile) {

        const filesSingularGroupSettingsActualForCurrentProjectBuildingMode__rawValid__fromFile:
            PlainCopyingSettings__FromFile__RawValid.FilesGroup.Singular.BuildingModeDependent | undefined =
            filesGroup__rawValid__fromFile.buildingModeDependent[projectBuildingMode];

        if (isUndefined(filesSingularGroupSettingsActualForCurrentProjectBuildingMode__rawValid__fromFile)) {
          continue;
        }


        filesGroups[filesGroupID] = PlainCopyingRawSettingsNormalizer.normalizeFilesSingularGroupSettings({
          projectRootDirectoryAbsolutePath,
          sourceFileRelativePath: filesGroup__rawValid__fromFile.sourceFileRelativePath,
          aliasName,
          filesSingularGroupSettingsActualForCurrentProjectBuildingMode__rawValid__fromFile
        });

      } else {

        const filesPluralGroupSettingsActualForCurrentProjectBuildingMode__rawValid__fromFile:
            PlainCopyingSettings__FromFile__RawValid.FilesGroup.Plural.BuildingModeDependent | undefined =
            filesGroup__rawValid__fromFile.buildingModeDependent[projectBuildingMode];

        if (isUndefined(filesPluralGroupSettingsActualForCurrentProjectBuildingMode__rawValid__fromFile)) {
          continue;
        }


        filesGroups[filesGroupID] = PlainCopyingRawSettingsNormalizer.normalizeFilesPluralGroupSettings({
            projectRootDirectoryAbsolutePath,
            sourceTopDirectoryRelativePath: filesGroup__rawValid__fromFile.sourceTopDirectoryRelativePath,
            fileNameLastExtensions: filesGroup__rawValid__fromFile.fileNameLastExtensions,
            aliasName,
            excludedSubdirectoriesPathsRelativeToAssetsGroupSourceTopDirectory:
                filesGroup__rawValid__fromFile.excludeSubdirectoriesRelativePaths,
            excludedFilesPathsRelativeToAssetsGroupSourceTopDirectory:
                filesGroup__rawValid__fromFile.excludeFilesRelativePaths,
            filesPluralGroupSettingsActualForCurrentProjectBuildingMode__rawValid__fromFile
          });

      }

    }

    return { filesGroups };

  }


  private static normalizeFilesSingularGroupSettings(
    {
      aliasName,
      projectRootDirectoryAbsolutePath,
      sourceFileRelativePath,
      filesSingularGroupSettingsActualForCurrentProjectBuildingMode__rawValid__fromFile
    }: Readonly<{
      aliasName: string;
      projectRootDirectoryAbsolutePath: string;
      sourceFileRelativePath: string;
      filesSingularGroupSettingsActualForCurrentProjectBuildingMode__rawValid__fromFile:
          PlainCopyingSettings__FromFile__RawValid.FilesGroup.Singular.BuildingModeDependent;
    }>
  ): PlainCopyingSettings__Normalized.FilesGroup.Singular {

    const sourceFileAbsolutePath: string = ImprovedPath.joinPathSegments(
      [ projectRootDirectoryAbsolutePath, sourceFileRelativePath ],
      { alwaysForwardSlashSeparators: true }
    );

    const initialFileNameWithExtensions: string = extractFileNameWithAllExtensionsFromPath({
      targetPath: sourceFileAbsolutePath,
      mustThrowErrorIfLastPathSegmentHasNoDots: true
    });

    const outputFileNameWithExtensions: string = PlainCopyingRawSettingsNormalizer.computeOutputFileNameWithExtensions({
      initialFileNameWithExtensions,
      sourceFileAbsolutePath,
      revisioningSettings: filesSingularGroupSettingsActualForCurrentProjectBuildingMode__rawValid__fromFile.revisioning,
      ...isNotUndefined(
        filesSingularGroupSettingsActualForCurrentProjectBuildingMode__rawValid__fromFile.newFileNameWithExtension
      ) ?
        {
          fileRenamings: [
            {
              pathRelativeToSourceDirectory: initialFileNameWithExtensions,
              newFileNameWithExtension:
                  filesSingularGroupSettingsActualForCurrentProjectBuildingMode__rawValid__fromFile.newFileNameWithExtension
            }
          ]
        } :
        null
    });

    const outputFileAbsolutePath: string = ImprovedPath.joinPathSegments(
      [
        projectRootDirectoryAbsolutePath,
        filesSingularGroupSettingsActualForCurrentProjectBuildingMode__rawValid__fromFile.outputDirectoryRelativePath,
        outputFileNameWithExtensions
      ],
      { alwaysForwardSlashSeparators: true }
    );

    PlainCopyingSharedState.
        sourceFilesAbsolutePathsAndRespectiveFilesGroupSettingsCorrespondenceMap.
        set(sourceFileAbsolutePath, outputFileAbsolutePath);

    return {
      aliasName,
      sourceFileAbsolutePath,
      outputFileAbsolutePath
    };

  }

  private static normalizeFilesPluralGroupSettings(
    {
      projectRootDirectoryAbsolutePath,
      sourceTopDirectoryRelativePath,
      fileNameLastExtensions,
      excludedSubdirectoriesPathsRelativeToAssetsGroupSourceTopDirectory = [],
      excludedFilesPathsRelativeToAssetsGroupSourceTopDirectory = [],
      aliasName,
      filesPluralGroupSettingsActualForCurrentProjectBuildingMode__rawValid__fromFile
    }: Readonly<{
      projectRootDirectoryAbsolutePath: string;
      sourceTopDirectoryRelativePath: string;
      fileNameLastExtensions?: ReadonlyArray<string>;
      excludedSubdirectoriesPathsRelativeToAssetsGroupSourceTopDirectory?: ReadonlyArray<string>;
      excludedFilesPathsRelativeToAssetsGroupSourceTopDirectory?: ReadonlyArray<string>;
      aliasName: string;
      filesPluralGroupSettingsActualForCurrentProjectBuildingMode__rawValid__fromFile:
          PlainCopyingSettings__FromFile__RawValid.FilesGroup.Plural.BuildingModeDependent;
    }>

  ): PlainCopyingSettings__Normalized.FilesGroup.Plural {

    const sourceTopDirectoryAbsolutePath: string = ImprovedPath.joinPathSegments(
      [ projectRootDirectoryAbsolutePath, sourceTopDirectoryRelativePath ],
      { alwaysForwardSlashSeparators: true }
    );

    const outputTopDirectoryAbsolutePath: string = ImprovedPath.joinPathSegments(
      [
        projectRootDirectoryAbsolutePath,
        filesPluralGroupSettingsActualForCurrentProjectBuildingMode__rawValid__fromFile.outputTopDirectoryRelativePath
      ],
      { alwaysForwardSlashSeparators: true }
    );

    const sourceAndOutputFilesAbsolutePathsCorrespondenceMapForCurrentGroup: Map<string, string> = new Map<string, string>();

    for (
      const sourceFileAbsolutePath of
          ImprovedGlob.getFilesAbsolutePathsSynchronously(
            [
              ImprovedGlob.buildAllFilesInCurrentDirectoryAndBelowGlobSelector({
                basicDirectoryPath: sourceTopDirectoryAbsolutePath,
                fileNamesExtensions: fileNameLastExtensions
              }),
              ...excludedSubdirectoriesPathsRelativeToAssetsGroupSourceTopDirectory.map(
                (excludedSubdirectoryPathRelativeToAssetsGroupSourceTopDirectory: string): string =>
                    ImprovedGlob.buildExcludingOfDirectoryWithSubdirectoriesGlobSelector(
                      ImprovedPath.joinPathSegments(
                        [ sourceTopDirectoryAbsolutePath, excludedSubdirectoryPathRelativeToAssetsGroupSourceTopDirectory ],
                        { alwaysForwardSlashSeparators: true }
                      )
                    )
              ),
              ...excludedFilesPathsRelativeToAssetsGroupSourceTopDirectory.map(
                (excludedFilePathRelativeToAssetsGroupSourceTopDirectory: string): string =>
                  ImprovedGlob.includingGlobSelectorToExcludingOne(
                    ImprovedPath.joinPathSegments(
                      [ sourceTopDirectoryAbsolutePath, excludedFilePathRelativeToAssetsGroupSourceTopDirectory ],
                      { alwaysForwardSlashSeparators: true }
                    )
                  )
              )
            ],
            { alwaysForwardSlashSeparators: true }
          )
    ) {


      const outputDirectoryAbsolutePath: string = OutputDirectoryPathTransformationsSettingsRepresentative.transform(
        ImprovedPath.joinPathSegments(
          [
            outputTopDirectoryAbsolutePath,
            ImprovedPath.computeRelativePath({
              basePath: sourceTopDirectoryAbsolutePath,
              comparedPath: ImprovedPath.extractDirectoryFromFilePath({
                targetPath: sourceFileAbsolutePath,
                ambiguitiesResolution: {
                  mustConsiderLastSegmentStartingWithDotAsDirectory: false,
                  mustConsiderLastSegmentWithNonLeadingDotAsDirectory: false,
                  mustConsiderLastSegmentWithoutDotsAsFileNameWithoutExtension: false
                }
              })
            })
          ],
          { alwaysForwardSlashSeparators: true }
        ),
        OutputPathTransformationsSettingsNormalizer.normalize(
          filesPluralGroupSettingsActualForCurrentProjectBuildingMode__rawValid__fromFile.outputDirectoryPathTransformations
        )
      );

      const outputFileNameWithExtensions: string = PlainCopyingRawSettingsNormalizer.computeOutputFileNameWithExtensions({
        initialFileNameWithExtensions: extractFileNameWithAllExtensionsFromPath({
          targetPath: sourceFileAbsolutePath,
          mustThrowErrorIfLastPathSegmentHasNoDots: false
        }),
        sourceTopDirectoryAbsolutePath,
        sourceFileAbsolutePath,
        revisioningSettings: filesPluralGroupSettingsActualForCurrentProjectBuildingMode__rawValid__fromFile.revisioning,
        fileRenamings: filesPluralGroupSettingsActualForCurrentProjectBuildingMode__rawValid__fromFile.filesRenamings
      });

      const outputFileAbsolutePath: string = ImprovedPath.joinPathSegments(
        [
          outputDirectoryAbsolutePath,
          outputFileNameWithExtensions
        ],
        { alwaysForwardSlashSeparators: true }
      );

      sourceAndOutputFilesAbsolutePathsCorrespondenceMapForCurrentGroup.set(
        sourceFileAbsolutePath, outputFileAbsolutePath
      );

    }

    addEntriesToMap({
      targetMap: PlainCopyingSharedState.sourceFilesAbsolutePathsAndRespectiveFilesGroupSettingsCorrespondenceMap,
      newEntries: sourceAndOutputFilesAbsolutePathsCorrespondenceMapForCurrentGroup,
      mutably: true
    });

    return {

      aliasName,

      sourceTopDirectoryAbsolutePath,

      outputTopDirectoryAbsolutePath,

      sourceAndOutputFilesAbsolutePathsCorrespondenceMap:
          sourceAndOutputFilesAbsolutePathsCorrespondenceMapForCurrentGroup

    };

  }

  private static computeOutputFileNameWithExtensions(
    {
      initialFileNameWithExtensions,
      sourceTopDirectoryAbsolutePath,
      sourceFileAbsolutePath,
      revisioningSettings,
      fileRenamings = []
    }: Readonly<{
      initialFileNameWithExtensions: string;
      sourceTopDirectoryAbsolutePath?: string;
      sourceFileAbsolutePath: string;
      revisioningSettings?: PlainCopyingSettings__FromFile__RawValid.FilesGroup.CommonProperties.
          BuildingModeDependent.Revisioning;
      fileRenamings?: ReadonlyArray<PlainCopyingSettings__FromFile__RawValid.FilesGroup.Plural.FileRenaming>;
    }>
  ): string {

    let finalOutputFileNameWithExtensions: string = initialFileNameWithExtensions;

    for (const fileRenaming of fileRenamings) {

      if (
        fileRenaming.pathRelativeToSourceDirectory ===
            (
              isUndefined(sourceTopDirectoryAbsolutePath) ?
                  sourceFileAbsolutePath :
                  ImprovedPath.computeRelativePath({
                    basePath: sourceTopDirectoryAbsolutePath,
                    comparedPath: sourceFileAbsolutePath,
                    alwaysForwardSlashSeparators: true
                  })
            )
      ) {
        finalOutputFileNameWithExtensions = fileRenaming.newFileNameWithExtension;
        break;
      }

    }

    const mustAppendContentHashPostfixSeparator: boolean =
          revisioningSettings?.enable === true ||
          PlainCopyingSettings__Default.revisioning.mustExecute;

    if (mustAppendContentHashPostfixSeparator) {

      const fileContent: string = FileSystem.readFileSync(sourceFileAbsolutePath, "utf-8");
      const fileNameWihtoutExtensions: string = removeAllFileNameExtensions(finalOutputFileNameWithExtensions);

      finalOutputFileNameWithExtensions = [
        fileNameWihtoutExtensions,
        revisioningSettings?.contentHashPostfixSeparator ?? PlainCopyingSettings__Default.revisioning.contentHashPostfixSeparator,
        generateRevisionHash(fileContent),
        `.${ extractAllFileNameExtensions({ targetPath: finalOutputFileNameWithExtensions, withLeadingDots: false }).join(".") }`
      ].join("");

    }

    return finalOutputFileNameWithExtensions;

  }

}
