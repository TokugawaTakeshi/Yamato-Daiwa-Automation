import type { LineSeparators } from "@yamato-daiwa/es-extensions";


type OutputPackageJSON_GeneratingSettings__Normalized = Readonly<{
  dependencies: OutputPackageJSON_GeneratingSettings__Normalized.PackagesIDsAndVersionsCorrespondence;
  developmentDependencies: OutputPackageJSON_GeneratingSettings__Normalized.PackagesIDsAndVersionsCorrespondence;
  scripts: OutputPackageJSON_GeneratingSettings__Normalized.NPM_Scripts;
  indentString: string;
  linesSeparator: LineSeparators;
  outputFileAbsolutePath: string;
}>;


namespace OutputPackageJSON_GeneratingSettings__Normalized {

  export type PackageVersionCode = string;

  export type PackagesIDsAndVersionsCorrespondence = Readonly<{ [packageID: string]: PackageVersionCode; }>;


  export type NPM_Scripts = Readonly<{ [command: string]: NPM_Scripts.Command; }>;

  export namespace NPM_Scripts {
    export type Command = string;
  }

}


export default OutputPackageJSON_GeneratingSettings__Normalized;
