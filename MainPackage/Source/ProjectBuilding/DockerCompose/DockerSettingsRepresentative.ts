import type DockerComposeSettings__Normalized from "@ProjectBuilding/DockerCompose/DockerComposeSettings__Normalized";


export default class DockerSettingsRepresentative {

  public readonly dockerComposeSettings: DockerComposeSettings__Normalized;

  public constructor(dockerComposeSettings: DockerComposeSettings__Normalized) {
    this.dockerComposeSettings = dockerComposeSettings;
  }

}
