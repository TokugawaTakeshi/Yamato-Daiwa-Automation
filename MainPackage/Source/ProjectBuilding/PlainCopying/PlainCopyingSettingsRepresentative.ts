import type PlainCopyingSettings__Normalized from "@ProjectBuilding/PlainCopying/PlainCopyingSettings__Normalized";
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


export default class PlainCopyingSettingsRepresentative {

  public readonly filesGroups: Readonly<{ [groupID: string]: PlainCopyingSettings__Normalized.FilesGroup; }>;


  public static computeRelevantOutputDirectoryAbsolutePathForTargetSourceFile(
    sourceFileAbsolutePath: string, actualFilesGroupSettings: PlainCopyingSettings__Normalized.FilesGroup
  ): string {

    if ("sourceFileAbsolutePath" in actualFilesGroupSettings) {
      return actualFilesGroupSettings.outputTopDirectoryAbsolutePath;
    }


    return ImprovedPath.joinPathSegments(
      [
        actualFilesGroupSettings.outputTopDirectoryAbsolutePath,
        ImprovedPath.computeRelativePath({
          basePath: actualFilesGroupSettings.sourceDirectoryAbsolutePath,
          comparedPath: ImprovedPath.extractDirectoryFromFilePath({
            targetPath: sourceFileAbsolutePath,
            ambiguitiesResolution: {
              mustConsiderLastSegmentStartingWithDotAsDirectory: false,
              mustConsiderLastSegmentWithNonLeadingDotAsDirectory: false,
              mustConsiderLastSegmentWihtoutDotsAsFileNameWithoutExtension: false
            },
            rootDirectoryNotation: ""
          })
        })
      ],
      { alwaysForwardSlashSeparators: true }
    );

  }


  public constructor(plainCopyingSettings__normalized: PlainCopyingSettings__Normalized) {
    this.filesGroups = plainCopyingSettings__normalized.filesGroups;
  }

}
