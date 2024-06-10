import type OutputDirectoryPathTransformationsSettings__FromFile__RawValid from
    "./OutputDirectoryPathTransformationsSettings__FromFile__RawValid";
import type { RawObjectDataProcessor } from "@yamato-daiwa/es-extensions";


type ResourceFilesGroupBuildingModeDependentOutputGenericSettings__FromFile__RawValid = Readonly<{
  outputTopDirectoryRelativePath: string;
  outputPathTransformations?: OutputDirectoryPathTransformationsSettings__FromFile__RawValid;
}>;


namespace ResourceFilesGroupBuildingModeDependentOutputGenericSettings__FromFile__RawValid {

  export type Localization = Readonly<{
    KEY: string;
    outputTopDirectoryRelativePath: Readonly<{ KEY: string; }>;
    outputPathTransformations: Readonly<{ KEY: string; }>;
  }>;

  export function getLocalizedPropertiesSpecification(
    {
      resourceFileOutputBuildingModeDependentSettingsLocalization,
      outputDirectoryPathTransformationsPropertiesLocalizedSpecification
    }: Readonly<{
      resourceFileOutputBuildingModeDependentSettingsLocalization: Localization;
      outputDirectoryPathTransformationsPropertiesLocalizedSpecification: RawObjectDataProcessor.PropertiesSpecification;
    }>

  ): RawObjectDataProcessor.PropertiesSpecification {

    return {

      [resourceFileOutputBuildingModeDependentSettingsLocalization.outputTopDirectoryRelativePath.KEY]: {
        newName: "outputTopDirectoryRelativePath",
        type: String,
        required: true
      },

      [resourceFileOutputBuildingModeDependentSettingsLocalization.outputPathTransformations.KEY]: {
        newName: "outputPathTransformations",
        type: Object,
        required: false,
        properties: outputDirectoryPathTransformationsPropertiesLocalizedSpecification
      }

    };

  }

}


export default ResourceFilesGroupBuildingModeDependentOutputGenericSettings__FromFile__RawValid;
