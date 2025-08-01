/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import type DockerComposeSettings__FromFile__RawValid from
    "@ProjectBuilding/DockerCompose/DockerComposeSettings__FromFile__RawValid";

/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";
import type DockerComposeSettings__Normalized from "@ProjectBuilding/DockerCompose/DockerComposeSettings__Normalized";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { isNotUndefined, isUndefined } from "@yamato-daiwa/es-extensions";
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


export default abstract class DockerComposeSettingsNormalizer {

  public static normalize(
    {
      dockerComposeSettings__fromFile__rawValid,
      commonSettings__normalized: {
        dockerSetupID,
        projectRootDirectoryAbsolutePath
      }
    }: Readonly<{
      dockerComposeSettings__fromFile__rawValid: DockerComposeSettings__FromFile__RawValid;
      commonSettings__normalized: ProjectBuildingCommonSettings__Normalized;
    }>

  ): DockerComposeSettings__Normalized | null {

    if (isUndefined(dockerSetupID)) {
      return null;
    }


    const actualSetup: DockerComposeSettings__FromFile__RawValid.Setup | undefined =
        dockerComposeSettings__fromFile__rawValid[dockerSetupID];

    if (isUndefined(actualSetup)) {
      return null;
    }


    return {

      composingOptions: {

        projectName: actualSetup.composingOptions.projectName,

        ...isNotUndefined(actualSetup.composingOptions.composeFileNameWithExtension) ?
            {
              absolutePathOfCustomDockerComposeFile: ImprovedPath.joinPathSegments(
                [ projectRootDirectoryAbsolutePath, actualSetup.composingOptions.composeFileNameWithExtension ],
                { alwaysForwardSlashSeparators: true }
              )
            } :
            null,

        ...isNotUndefined(actualSetup.composingOptions.environmentFileNameWithExtensions) ?
            {
              absolutePathOfCustomEnvironmentFile: ImprovedPath.joinPathSegments(
                [ projectRootDirectoryAbsolutePath, actualSetup.composingOptions.environmentFileNameWithExtensions ],
                { alwaysForwardSlashSeparators: true }
              )
            } :
            null

      },


      upOptions: {

        mustAlwaysBuildImagesBeforeStarting: actualSetup.upOptions.mustAlwaysBuildImagesBeforeStarting === true

      }

    };

  }

}
