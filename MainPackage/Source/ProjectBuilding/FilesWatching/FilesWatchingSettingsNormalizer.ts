/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import FilesWatchingRestrictions from "@ProjectBuilding/FilesWatching/FilesWatchingRestrictions";

/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import type FilesWatchingSettings__FromFile__RawValid from
    "@ProjectBuilding/FilesWatching/FilesWatchingSettings__FromFile__RawValid";

/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type FilesWatchingSettings__Normalized from "@ProjectBuilding/FilesWatching/FilesWatchingSettings__Normalized";
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


export default class FilesWatchingSettingsNormalizer {

  public static normalize(
    {
      filesWatchingSettings__fromFile__rawValid,
      projectBuilderCommonSettings__normalized
    }: Readonly<{
      projectBuilderCommonSettings__normalized: ProjectBuildingCommonSettings__Normalized;
      filesWatchingSettings__fromFile__rawValid?: FilesWatchingSettings__FromFile__RawValid;
    }>
  ): FilesWatchingSettings__Normalized {
    return {
      excludedFilesGlobSelectors: new Set(
        [
          ...FilesWatchingRestrictions.relativePathsOfExcludeFiles,
          ...filesWatchingSettings__fromFile__rawValid?.relativePathsOfExcludeFiles ?? []
        ].
            map(
              (directoryRelativePath: string): string =>
                  ImprovedPath.joinPathSegments(
                    [ projectBuilderCommonSettings__normalized.projectRootDirectoryAbsolutePath, directoryRelativePath ],
                    { alwaysForwardSlashSeparators: true }
                  )
            )
      ),
      excludedDirectoriesGlobSelectors: new Set(
        [
          ...FilesWatchingRestrictions.relativePathsOfExcludeDirectories,
          ...filesWatchingSettings__fromFile__rawValid?.relativePathsOfExcludeDirectories ?? []
        ].
            map(
              (directoryRelativePath: string): string =>
                  ImprovedPath.joinPathSegments(
                    [ projectBuilderCommonSettings__normalized.projectRootDirectoryAbsolutePath, directoryRelativePath ],
                    { alwaysForwardSlashSeparators: true }
                  )
            )
      )
    };
  }

}
