import { RawObjectDataProcessor } from "@yamato-daiwa/es-extensions";


type OutputDirectoryPathTransformationsSettings__FromFile__RawValid = Readonly<{
  segmentsWhichMustBeRemoved?: ReadonlyArray<string>;
  segmentsWhichLastDuplicatesMustBeRemoved?: ReadonlyArray<string>;
  segmentsCountRelativeToGroupTopDirectoryWhichMustBeRemoved?: number;
}>;


namespace OutputDirectoryPathTransformationsSettings__FromFile__RawValid {

  export const propertiesSpecification: RawObjectDataProcessor.PropertiesSpecification = {

    $segmentsWhichMustBeRemoved: {
      newName: "segmentsWhichMustBeRemoved",
      type: Array,
      isUndefinedForbidden: false,
      isNullForbidden: true,
      areUndefinedElementsForbidden: true,
      areNullElementsForbidden: true,
      element: {
        type: String,
        minimalCharactersCount: 1
      }
    },

    $segmentsWhichLastDuplicatesMustBeRemoved: {
      newName: "segmentsWhichLastDuplicatesMustBeRemoved",
      type: Array,
      isUndefinedForbidden: false,
      isNullForbidden: true,
      areUndefinedElementsForbidden: true,
      areNullElementsForbidden: true,
      element: {
        type: String,
        minimalCharactersCount: 1
      }
    },

    $segmentsCountRelativeToGroupTopDirectoryWhichMustBeRemoved: {
      newName: "segmentsCountRelativeToGroupTopDirectoryWhichMustBeRemoved",
      type: Number,
      numbersSet: RawObjectDataProcessor.NumbersSets.naturalNumber,
      isUndefinedForbidden: false,
      isNullForbidden: true
    }

  };

}


export default OutputDirectoryPathTransformationsSettings__FromFile__RawValid;
