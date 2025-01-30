import OutputDirectoryPathTransformationsSettings__FromFile__RawValid from
    "./OutputDirectoryPathTransformationsSettings__FromFile__RawValid";

import type { RawObjectDataProcessor } from "@yamato-daiwa/es-extensions";


type ResourceFilesGroupBuildingModeDependentOutputGenericSettings__FromFile__RawValid = Readonly<{
  outputTopDirectoryRelativePath: string;
  outputPathTransformations?: OutputDirectoryPathTransformationsSettings__FromFile__RawValid;
}>;


namespace ResourceFilesGroupBuildingModeDependentOutputGenericSettings__FromFile__RawValid {

  export const propertiesSpecification: RawObjectDataProcessor.PropertiesSpecification = {

    $outputTopDirectoryRelativePath: {
      newName: "outputTopDirectoryRelativePath",
      type: String,
      isUndefinedForbidden: false,
      isNullForbidden: true
    },

    $outputPathTransformations: {
      newName: "outputPathTransformations",
      type: Object,
      isUndefinedForbidden: false,
      isNullForbidden: true,
      properties: OutputDirectoryPathTransformationsSettings__FromFile__RawValid.propertiesSpecification
    }

  };

}


export default ResourceFilesGroupBuildingModeDependentOutputGenericSettings__FromFile__RawValid;
