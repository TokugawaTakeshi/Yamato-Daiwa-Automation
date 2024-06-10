/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type PlainCopyingSettings__Normalized from "@ProjectBuilding/PlainCopying/PlainCopyingSettings__Normalized";

/* ─── Shared State ───────────────────────────────────────────────────────────────────────────────────────────────── */
import PlainCopyingSharedState from "@ProjectBuilding/PlainCopying/PlainCopyingSharedState";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";
import { isUndefined } from "@yamato-daiwa/es-extensions";


export default class PlainCopyingSettingsRepresentative {

  public readonly singularGroupsMappedByAliases: Map<string, PlainCopyingSettings__Normalized.FilesGroup.Singular> = new Map();
  public readonly pluralGroupsMappedByAliases: Map<string, PlainCopyingSettings__Normalized.FilesGroup.Plural> = new Map();

  public readonly filesGroups: Readonly<{ [groupID: string]: PlainCopyingSettings__Normalized.FilesGroup; }>;


  public constructor(plainCopyingSettings__normalized: PlainCopyingSettings__Normalized) {
    this.filesGroups = plainCopyingSettings__normalized.filesGroups;

    for (const filesGroup of Object.values(plainCopyingSettings__normalized.filesGroups)) {

      if ("sourceFileAbsolutePath" in filesGroup) {
        this.singularGroupsMappedByAliases.set(`$${ filesGroup.aliasName }`, filesGroup);
      } else {
        this.pluralGroupsMappedByAliases.set(`$${ filesGroup.aliasName }`, filesGroup);
      }

    }

  }


  public getSourceFileAbsolutePathByAliasedPath(segmentsOfPickedPath: ReadonlyArray<string>): string | null {

    if (segmentsOfPickedPath.length === 1) {

      const sourceFileAbsolutePath: string | undefined = this.singularGroupsMappedByAliases.
          get(segmentsOfPickedPath[0])?.sourceFileAbsolutePath;

      if (isUndefined(sourceFileAbsolutePath)) {
        return null;
      }


      return PlainCopyingSharedState.
          sourceFilesAbsolutePathsAndRespectiveFilesGroupSettingsCorrespondenceMap.
          get(sourceFileAbsolutePath) ??
          null;

    }


    const sourceDirectoryAbsolutePath: string | undefined = this.pluralGroupsMappedByAliases.
        get(segmentsOfPickedPath[0])?.sourceTopDirectoryAbsolutePath;

    if (isUndefined(sourceDirectoryAbsolutePath)) {
      return null;
    }


    return PlainCopyingSharedState.
        sourceFilesAbsolutePathsAndRespectiveFilesGroupSettingsCorrespondenceMap.
        get(
            ImprovedPath.joinPathSegments(
                [
                  sourceDirectoryAbsolutePath,
                  ...segmentsOfPickedPath.slice(1)
                ],
                { alwaysForwardSlashSeparators: true }
            )
        ) ??
        null;

  }

}
