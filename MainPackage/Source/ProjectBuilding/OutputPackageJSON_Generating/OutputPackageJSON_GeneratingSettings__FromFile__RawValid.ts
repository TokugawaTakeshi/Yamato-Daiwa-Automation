import { RawObjectDataProcessor, nullToUndefined, LineSeparators } from "@yamato-daiwa/es-extensions";
import ConsumingProjectBuildingModes from "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";
import type ConsumingProjectPreDefinedBuildingModes__Localized
  from "@ProjectBuilding/Common/RawConfig/Enumerations/ConsumingProjectPreDefinedBuildingModes__Localized";


type OutputPackageJSON_GeneratingSettings__FromFile__RawValid = Readonly<{
  inheritedDependencies?: ReadonlyArray<OutputPackageJSON_GeneratingSettings__FromFile__RawValid.PackageID>;
  inheritedDevelopmentDependencies?: ReadonlyArray<OutputPackageJSON_GeneratingSettings__FromFile__RawValid.PackageID>;
  inheritedNPM_Scripts?: ReadonlyArray<OutputPackageJSON_GeneratingSettings__FromFile__RawValid.NPM_ScriptKey>;
  newNPM_Scripts?: OutputPackageJSON_GeneratingSettings__FromFile__RawValid.NPM_Scripts;
  indentString?: string;
  linesSeparator?: LineSeparators;
  buildingModeDependent: Readonly<{
    [projectBuildingMode: string]: OutputPackageJSON_GeneratingSettings__FromFile__RawValid.BuildingModeDependent | undefined;
  }>;
}>;


namespace OutputPackageJSON_GeneratingSettings__FromFile__RawValid {

  export type PackageID = string;
  export type NPM_ScriptKey = string;

  export type NPM_Scripts = Readonly<{ [scriptID: string]: NPM_Scripts.Command; }>;

  export namespace NPM_Scripts {
    export type Command = string;
  }

  export type BuildingModeDependent = Readonly<{
    outputDirectoryRelativePath: string;
    indentString?: string;
    linesSeparator?: LineSeparators;
  }>;


  /* ━━━ Localization ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type Localization = Readonly<{

    inheritedDependencies: Readonly<{ KEY: string; }>;
    inheritedDevelopmentDependencies: Readonly<{ KEY: string; }>;
    inheritedNPM_Scripts: Readonly<{ KEY: string; }>;
    newNPM_Scripts: Readonly<{ KEY: string; }>;
    indentString: Readonly<{ KEY: string; }>;
    linesSeparator: Readonly<{ KEY: string; }>;

    buildingModeDependent: Readonly<{
      KEY: string;
      outputDirectoryRelativePath: Readonly<{ KEY: string; }>;
      indentString: Readonly<{ KEY: string; }>;
      linesSeparator: Readonly<{ KEY: string; }>;
    }>;

  }>;

  export function getLocalizedPropertiesSpecification(
    {
      outputPackageJSON_GeneratingSettingsLocalization,
      consumingProjectLocalizedPreDefinedBuildingModes
    }: Readonly<{
      outputPackageJSON_GeneratingSettingsLocalization: Localization;
      consumingProjectLocalizedPreDefinedBuildingModes: ConsumingProjectPreDefinedBuildingModes__Localized;
    }>
  ): RawObjectDataProcessor.PropertiesSpecification {

    return {

      [outputPackageJSON_GeneratingSettingsLocalization.inheritedDependencies.KEY]: {

        newName: "inheritedDependencies",
        type: Array,
        required: false,
        minimalElementsCount: 1,

        element: {
          type: String,
          minimalCharactersCount: 1
        }

      },

      [outputPackageJSON_GeneratingSettingsLocalization.inheritedDevelopmentDependencies.KEY]: {

        newName: "inheritedDevelopmentDependencies",
        type: Array,
        required: false,
        minimalElementsCount: 1,

        element: {
          type: String,
          minimalCharactersCount: 1
        }

      },

      [outputPackageJSON_GeneratingSettingsLocalization.inheritedNPM_Scripts.KEY]: {

        newName: "inheritedNPM_Scripts",
        type: Array,
        required: false,
        minimalElementsCount: 1,

        element: {
          type: String,
          minimalCharactersCount: 1
        }

      },

      [outputPackageJSON_GeneratingSettingsLocalization.newNPM_Scripts.KEY]: {

        newName: "newNPM_Scripts",
        type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
        required: false,
        preValidationModifications: nullToUndefined,
        minimalEntriesCount: 1,

        value: {
          type: String,
          minimalCharactersCount: 1
        }

      },

      [outputPackageJSON_GeneratingSettingsLocalization.indentString.KEY]: {

        newName: "indentString",
        type: String,
        required: false,
        minimalCharactersCount: 1

      },

      [outputPackageJSON_GeneratingSettingsLocalization.linesSeparator.KEY]: {

        newName: "linesSeparator",
        type: String,
        required: false,
        allowedAlternatives: Object.values(LineSeparators.lineFeed)

      },

      [outputPackageJSON_GeneratingSettingsLocalization.buildingModeDependent.KEY]: {

        newName: "buildingModeDependent",
        type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
        required: true,
        allowedKeys: Object.values(ConsumingProjectBuildingModes),
        minimalEntriesCount: 1,

        keysRenamings: {
          [consumingProjectLocalizedPreDefinedBuildingModes.staticPreview]:
              ConsumingProjectBuildingModes.staticPreview,
          [consumingProjectLocalizedPreDefinedBuildingModes.localDevelopment]:
              ConsumingProjectBuildingModes.localDevelopment,
          [consumingProjectLocalizedPreDefinedBuildingModes.testing]:
              ConsumingProjectBuildingModes.testing,
          [consumingProjectLocalizedPreDefinedBuildingModes.staging]:
              ConsumingProjectBuildingModes.staging,
          [consumingProjectLocalizedPreDefinedBuildingModes.production]:
              ConsumingProjectBuildingModes.production
        },

        value: {

          type: Object,

          properties: {

            [outputPackageJSON_GeneratingSettingsLocalization.buildingModeDependent.outputDirectoryRelativePath.KEY]: {
              newName: "outputDirectoryRelativePath",
              type: String,
              required: true,
              minimalCharactersCount: 1
            },

            [outputPackageJSON_GeneratingSettingsLocalization.buildingModeDependent.indentString.KEY]: {
              newName: "indentString",
              type: String,
              required: false,
              minimalCharactersCount: 1
            },

            [outputPackageJSON_GeneratingSettingsLocalization.buildingModeDependent.linesSeparator.KEY]: {
              newName: "linesSeparator",
              type: String,
              required: false,
              allowedAlternatives: Object.values(LineSeparators.lineFeed)
            }

          }

        }

      }

    };

  }

}


export default OutputPackageJSON_GeneratingSettings__FromFile__RawValid;
