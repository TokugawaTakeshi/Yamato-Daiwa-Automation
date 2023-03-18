/* --- Raw valid settings ------------------------------------------------------------------------------------------- */
import type PlainCopyingSettings__FromFile__RawValid from
      "@ProjectBuilding/PlainCopying/PlainCopyingSettings__FromFile__RawValid";

/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type ProjectBuildingCommonSettings__Normalized from
      "@ProjectBuilding/Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";
import type PlainCopyingSettings__Normalized from "@ProjectBuilding/PlainCopying/PlainCopyingSettings__Normalized";

/* --- Utils -------------------------------------------------------------------------------------------------------- */
import { isNotUndefined, isUndefined } from "@yamato-daiwa/es-extensions";
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";
import type DeepMutable from "@UtilsIncubator/Types/DeepMutable";


export default class PlainCopyingRawSettingsNormalizer {

  public static normalize(
    {
      plainCopyingSettings__fromFile__rawValid,
      commonSettings__normalized
    }: Readonly<{
      plainCopyingSettings__fromFile__rawValid: PlainCopyingSettings__FromFile__RawValid;
      commonSettings__normalized: ProjectBuildingCommonSettings__Normalized;
    }>
  ): PlainCopyingSettings__Normalized {

    const explicitlySpecifiedActualFilesGroupsIDs: ReadonlyArray<string> =
        commonSettings__normalized.tasksAndSourceFilesSelection?.plainCopying ?? [];

    const plainCopyingSettings__normalized: DeepMutable<PlainCopyingSettings__Normalized> = { filesGroups: {} };

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


      const outputTopDirectoryRelativePathForCurrentProjectBuildingMode: string | undefined =
          filesGroup__rawValid__fromFile.
              buildingModeDependent[commonSettings__normalized.projectBuildingMode]?.
              outputTopDirectoryRelativePath;

      if (isUndefined(outputTopDirectoryRelativePathForCurrentProjectBuildingMode)) {
        continue;
      }


      plainCopyingSettings__normalized.filesGroups[filesGroupID] = {

        ..."sourceFileRelativePath" in filesGroup__rawValid__fromFile ?
            {
              sourceFileAbsolutePath: ImprovedPath.joinPathSegments(
                [
                  commonSettings__normalized.projectRootDirectoryAbsolutePath,
                  filesGroup__rawValid__fromFile.sourceFileRelativePath
                ],
                { alwaysForwardSlashSeparators: true }
              )
            } :
            {
              sourceDirectoryAbsolutePath: ImprovedPath.joinPathSegments(
                [
                  commonSettings__normalized.projectRootDirectoryAbsolutePath,
                  filesGroup__rawValid__fromFile.sourceDirectoryRelativePath
                ],
                { alwaysForwardSlashSeparators: true }
              )
            },

        ...isNotUndefined(filesGroup__rawValid__fromFile.referenceName) ? {
          referenceName: filesGroup__rawValid__fromFile.referenceName
        } : null,

        outputTopDirectoryAbsolutePath: ImprovedPath.joinPathSegments(
          [
            commonSettings__normalized.projectRootDirectoryAbsolutePath,
            outputTopDirectoryRelativePathForCurrentProjectBuildingMode
          ],
          { alwaysForwardSlashSeparators: true }
        )

      };

    }

    return plainCopyingSettings__normalized;

  }

}
