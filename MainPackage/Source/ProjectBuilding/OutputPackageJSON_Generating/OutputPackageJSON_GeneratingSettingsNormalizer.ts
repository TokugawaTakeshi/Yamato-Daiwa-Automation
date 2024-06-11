/* ─── Raw Valid Config ───────────────────────────────────────────────────────────────────────────────────────────── */
import type OutputPackageJSON_GeneratingSettings__FromFile__RawValid from
    "@ProjectBuilding/OutputPackageJSON_Generating/OutputPackageJSON_GeneratingSettings__FromFile__RawValid";

/* ─── Default Settings ───────────────────────────────────────────────────────────────────────────────────────────── */
import OutputPackageJSON_GeneratingSettings__Default from
    "@ProjectBuilding/OutputPackageJSON_Generating/OutputPackageJSON_GeneratingSettings__Default";

/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";
import type OutputPackageJSON_GeneratingSettings__Normalized from
    "@ProjectBuilding/OutputPackageJSON_Generating/OutputPackageJSON_GeneratingSettings__Normalized";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import {
  RawObjectDataProcessor,
  isNotUndefined,
  isUndefined
} from "@yamato-daiwa/es-extensions";
import {
  ImprovedPath,
  ObjectDataFilesProcessor
} from "@yamato-daiwa/es-extensions-nodejs";
import type Mutable from "@UtilsIncubator/Types/Mutable";


class OutputPackageJSON_GeneratingSettingsNormalizer {

  public static normalizeIfThereAreActualOnes(
    {
      outputPackageJSON_GeneratingSettings__fromFile__rawValid,
      commonSettings__normalized
    }: Readonly<{
      outputPackageJSON_GeneratingSettings__fromFile__rawValid?: OutputPackageJSON_GeneratingSettings__FromFile__RawValid;
      commonSettings__normalized: ProjectBuildingCommonSettings__Normalized;
    }>
  ): OutputPackageJSON_GeneratingSettings__Normalized | null {

    if (isUndefined(outputPackageJSON_GeneratingSettings__fromFile__rawValid)) {
      return null;
    }


    if (
      isNotUndefined(commonSettings__normalized.tasksAndSourceFilesSelection) &&
      !commonSettings__normalized.mustGenerateOutputPackageJSON
    ) {
      return null;
    }


    const outputPackageJSON_GeneratingSettingsActualForCurrentProjectBuildingMode__fromFile__rawValid:
        OutputPackageJSON_GeneratingSettings__FromFile__RawValid.BuildingModeDependent | undefined =
            outputPackageJSON_GeneratingSettings__fromFile__rawValid.
                buildingModeDependent[commonSettings__normalized.projectBuildingMode];


    if (isUndefined(outputPackageJSON_GeneratingSettingsActualForCurrentProjectBuildingMode__fromFile__rawValid)) {
      return null;
    }

    const extractionFromPackageJSON_OfConsumingProject: OutputPackageJSON_GeneratingSettingsNormalizer.
        ActualFieldsOfPackageJSON_OfConsumingProject =
            ObjectDataFilesProcessor.processFile<
              OutputPackageJSON_GeneratingSettingsNormalizer.ActualFieldsOfPackageJSON_OfConsumingProject
            >({
              filePath: ImprovedPath.joinPathSegments(
                [ commonSettings__normalized.projectRootDirectoryAbsolutePath, "package.json" ],
                { alwaysForwardSlashSeparators: true }
              ),
              validDataSpecification: {
                subtype: RawObjectDataProcessor.ObjectSubtypes.fixedKeyAndValuePairsObject,
                nameForLogging: "PackageJSON_OfConsumingProject",
                properties: {
                  scripts: {
                    type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
                    defaultValue: {},
                    value: {
                      type: String
                    }
                  },
                  dependencies: {
                    type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
                    defaultValue: {},
                    value: {
                      type: String
                    }
                  },
                  devDependencies: {
                    type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
                    defaultValue: {},
                    value: {
                      type: String
                    }
                  }
                }
              },
              synchronously: true
            });


    return {

      dependencies: Object.entries(extractionFromPackageJSON_OfConsumingProject.dependencies).reduce(
        (
          packagesIDsAndVersionsCorrespondence: Mutable<
            OutputPackageJSON_GeneratingSettings__Normalized.PackagesIDsAndVersionsCorrespondence
          >,
          [ packageID, packageVersion ]: [ string, string ]
        ): OutputPackageJSON_GeneratingSettings__Normalized.PackagesIDsAndVersionsCorrespondence => {

          if (
            outputPackageJSON_GeneratingSettings__fromFile__rawValid.inheritedDependencies?.
                includes(packageID) === true
          ) {
            packagesIDsAndVersionsCorrespondence[packageID] = packageVersion;
          }

          return packagesIDsAndVersionsCorrespondence;

        },
        {}
      ),

      developmentDependencies: Object.entries(extractionFromPackageJSON_OfConsumingProject.devDependencies).reduce(
        (
          packagesIDsAndVersionsCorrespondence: Mutable<
            OutputPackageJSON_GeneratingSettings__Normalized.PackagesIDsAndVersionsCorrespondence
          >,
          [ packageID, packageVersion ]: [ string, string ]
        ): OutputPackageJSON_GeneratingSettings__Normalized.PackagesIDsAndVersionsCorrespondence => {

          if (
            outputPackageJSON_GeneratingSettings__fromFile__rawValid.inheritedDevelopmentDependencies?.
                includes(packageID) === true
          ) {
            packagesIDsAndVersionsCorrespondence[packageID] = packageVersion;
          }

          return packagesIDsAndVersionsCorrespondence;

        },
        {}
      ),

      scripts: Object.entries(extractionFromPackageJSON_OfConsumingProject.devDependencies).reduce(
        (
          npmScript: Mutable<OutputPackageJSON_GeneratingSettings__Normalized.NPM_Scripts>,
          [ command, script ]: [ string, string ]
        ): OutputPackageJSON_GeneratingSettings__Normalized.PackagesIDsAndVersionsCorrespondence => {

          if (
            outputPackageJSON_GeneratingSettings__fromFile__rawValid.inheritedNPM_Scripts?.
                includes(command) === true
          ) {
            npmScript[command] = script;
          }

          return npmScript;

        },
        outputPackageJSON_GeneratingSettings__fromFile__rawValid.newNPM_Scripts ?? {}
      ),

      indentString:
          outputPackageJSON_GeneratingSettingsActualForCurrentProjectBuildingMode__fromFile__rawValid.indentString ??
          outputPackageJSON_GeneratingSettings__fromFile__rawValid.indentString ??
          OutputPackageJSON_GeneratingSettings__Default.indentString,

      linesSeparator:
          outputPackageJSON_GeneratingSettingsActualForCurrentProjectBuildingMode__fromFile__rawValid.linesSeparator ??
          outputPackageJSON_GeneratingSettings__fromFile__rawValid.linesSeparator ??
          OutputPackageJSON_GeneratingSettings__Default.linesSeparator,

      outputFileAbsolutePath: ImprovedPath.joinPathSegments(
        [
          commonSettings__normalized.projectRootDirectoryAbsolutePath,
          outputPackageJSON_GeneratingSettingsActualForCurrentProjectBuildingMode__fromFile__rawValid.
              outputDirectoryRelativePath,
          "package.json"
        ],
        { alwaysForwardSlashSeparators: true }
      )

    };

  }

}


namespace OutputPackageJSON_GeneratingSettingsNormalizer {

  export type ActualFieldsOfPackageJSON_OfConsumingProject = Readonly<{
    scripts: Readonly<{ [command: string]: string; }>;
    dependencies: Readonly<{ [packageID: string]: string; }>;
    devDependencies: Readonly<{ [packageID: string]: string; }>;
  }>;

}


export default OutputPackageJSON_GeneratingSettingsNormalizer;
