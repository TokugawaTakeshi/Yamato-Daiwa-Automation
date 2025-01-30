import ConsumingProjectBuildingModes from "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";
import { RawObjectDataProcessor, LineSeparators } from "@yamato-daiwa/es-extensions";


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
  export const propertiesSpecification: RawObjectDataProcessor.PropertiesSpecification = {

    $inheritedDependencies: {

      newName: "inheritedDependencies",
      type: Array,
      isUndefinedForbidden: false,
      isNullForbidden: true,
      areUndefinedElementsForbidden: true,
      areNullElementsForbidden: true,
      minimalElementsCount: 1,

      element: {
        type: String,
        minimalCharactersCount: 1
      }

    },

    $inheritedDevelopmentDependencies: {

      newName: "inheritedDevelopmentDependencies",
      type: Array,
      isUndefinedForbidden: false,
      isNullForbidden: true,
      areUndefinedElementsForbidden: true,
      areNullElementsForbidden: true,
      minimalElementsCount: 1,

      element: {
        type: String,
        minimalCharactersCount: 1
      }

    },

    $inheritedNPM_Scripts: {

      newName: "inheritedNPM_Scripts",
      type: Array,
      isUndefinedForbidden: false,
      isNullForbidden: true,
      areUndefinedElementsForbidden: true,
      areNullElementsForbidden: true,
      minimalElementsCount: 1,

      element: {
        type: String,
        minimalCharactersCount: 1
      }

    },

    $newNPM_Scripts: {

      newName: "newNPM_Scripts",
      type: RawObjectDataProcessor.ValuesTypesIDs.associativeArray,
      isUndefinedForbidden: false,
      mustTransformNullToUndefined: true,
      areUndefinedTypeValuesForbidden: true,
      areNullTypeValuesForbidden: true,
      minimalEntriesCount: 1,

      value: {
        type: String,
        minimalCharactersCount: 1
      }

    },

    $indentString: {

      newName: "indentString",
      type: String,
      isUndefinedForbidden: false,
      isNullForbidden: true,
      minimalCharactersCount: 1

    },

    $linesSeparator: {

      newName: "linesSeparator",
      type: String,
      isUndefinedForbidden: false,
      isNullForbidden: true,
      allowedAlternatives: Object.values(LineSeparators.lineFeed)

    },

    $buildingModeDependent: {

      newName: "buildingModeDependent",
      type: RawObjectDataProcessor.ValuesTypesIDs.associativeArray,
      isUndefinedForbidden: true,
      isNullForbidden: true,
      areUndefinedTypeValuesForbidden: true,
      areNullTypeValuesForbidden: true,
      minimalEntriesCount: 1,

      allowedKeys: [
        "$staticPreview",
        "$localDevelopment",
        "$testing",
        "$staging",
        "$production"
      ],

      keysRenamings: {
        $staticPreview: ConsumingProjectBuildingModes.staticPreview,
        $localDevelopment: ConsumingProjectBuildingModes.localDevelopment,
        $testing: ConsumingProjectBuildingModes.testing,
        $staging: ConsumingProjectBuildingModes.staging,
        $production: ConsumingProjectBuildingModes.production
      },

      value: {

        type: Object,

        properties: {

          $outputDirectoryRelativePath: {
            newName: "outputDirectoryRelativePath",
            type: String,
            isUndefinedForbidden: true,
            isNullForbidden: true,
            minimalCharactersCount: 1
          },

          $indentString: {
            newName: "indentString",
            type: String,
            isUndefinedForbidden: false,
            isNullForbidden: true,
            minimalCharactersCount: 1
          },

          $linesSeparator: {
            newName: "linesSeparator",
            type: String,
            isUndefinedForbidden: false,
            isNullForbidden: true,
            allowedAlternatives: Object.values(LineSeparators.lineFeed)
          }

        }

      }

    }

  };

}


export default OutputPackageJSON_GeneratingSettings__FromFile__RawValid;
