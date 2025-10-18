/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type DockerComposeSettings__Normalized from "@ProjectBuilding/DockerCompose/DockerComposeSettings__Normalized";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type DockerSettingsRepresentative from "@ProjectBuilding/DockerCompose/DockerSettingsRepresentative";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import ChildProcess from "child_process";
import { Logger, isUndefined, isNotUndefined, isNotNull } from "@yamato-daiwa/es-extensions";
import { type VoidPromiseReturningFunction, voidPromiseReturningFunction } from "@Utils/VoidPromiseReturningFunction";


export default class DockerComposeLauncher {

  public static launchIfMust(
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): VoidPromiseReturningFunction {

    if (!projectBuildingMasterConfigRepresentative.mustProvideIncrementalBuilding) {
      return voidPromiseReturningFunction;
    }


    const dockerComposeSettingsRepresentative: DockerSettingsRepresentative | undefined =
        projectBuildingMasterConfigRepresentative.dockerComposeSettingsRepresentative;

    if (isUndefined(dockerComposeSettingsRepresentative)) {
      return voidPromiseReturningFunction;
    }


    const { composingOptions, upOptions }: DockerComposeSettings__Normalized =
        dockerComposeSettingsRepresentative.dockerComposeSettings;

    return async (): Promise<void> => new Promise<void>(
      (resolve: () => void): void => {

        ChildProcess.exec(

          [

            /* [ Theory ] Docker Compose Options: https://docs.docker.com/reference/cli/docker/compose/ */
            "docker compose",
            ...isNotUndefined(composingOptions.absolutePathOfCustomEnvironmentFile) ?
                [ `--env-file ${ composingOptions.absolutePathOfCustomEnvironmentFile }` ] : [],
            ...isNotUndefined(composingOptions.absolutePathOfCustomDockerComposeFile) ?
                [ `--file ${ composingOptions.absolutePathOfCustomDockerComposeFile }` ] : [],
            ...isNotUndefined(composingOptions.projectName) ?
                [ `--project-name ${ composingOptions.projectName }` ] : [],

            /* [ Theory ] Docker Compose Up Options: https://docs.docker.com/reference/cli/docker/compose/up/ */
            "up",
            "--detach",
            ...isNotUndefined(upOptions.mustAlwaysBuildImagesBeforeStarting) ? [ "--build" ] : []

          ].join(" "),

          { encoding: "utf-8" },

          /* [ Theory ] Normally `standardOutput` will not be using for the moment of Docker launching. */
          (error: ChildProcess.ExecException | null, _standardOutput: string, standardError: string): void => {

            if (isNotNull(error)) {

              Logger.logError({
                errorType: "CommandExecutionInChildProcessFailureError",
                title: "Command Execution in Child Process Failure",
                description: `The error has occurred during the execution of Docker\n ${ standardError }`,
                occurrenceLocation: "DockerComposeLauncher.launchIfMust(projectBuildingMasterConfigRepresentative)",
                caughtError: error
              });

            }

            resolve();

          }
        );

      }
    );

  }

}
