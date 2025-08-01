type DockerComposeSettings__Normalized = Readonly<{
  composingOptions: DockerComposeSettings__Normalized.ComposingOptions;
  upOptions: DockerComposeSettings__Normalized.UpOptions;
}>;


namespace DockerComposeSettings__Normalized {

  export type ComposingOptions = Readonly<{
    projectName?: string;
    absolutePathOfCustomDockerComposeFile?: string;
    absolutePathOfCustomEnvironmentFile?: string;
  }>;

  export type UpOptions = Readonly<{
    mustAlwaysBuildImagesBeforeStarting: boolean;
  }>;

}


export default DockerComposeSettings__Normalized;
