import { RawObjectDataProcessor } from "@yamato-daiwa/es-extensions";


type OutputDirectoryPathTransformationsSettings__FromFile__RawValid = Readonly<{
  segmentsWhichMustBeRemoved?: ReadonlyArray<string>;
  segmentsWhichLastDuplicatesMustBeRemoved?: ReadonlyArray<string>;
  segmentsCountRelativeToGroupTopDirectoryWhichMustBeRemoved?: number;
}>;


namespace OutputDirectoryPathTransformationsSettings__FromFile__RawValid {

  export type Localization = Readonly<{
    segmentsWhichMustBeRemoved: Readonly<{ KEY: string; }>;
    segmentsWhichLastDuplicatesMustBeRemoved: Readonly<{ KEY: string; }>;
    segmentsCountRelativeToGroupTopDirectoryWhichMustBeRemoved: Readonly<{ KEY: string; }>;
  }>;

  export function getLocalizedPropertiesSpecification(
    outputDirectoryPathTransformationsSettingsLocalization: Localization
  ): RawObjectDataProcessor.PropertiesSpecification {

    return {

      [outputDirectoryPathTransformationsSettingsLocalization.segmentsWhichMustBeRemoved.KEY]: {
        newName: "segmentsWhichMustBeRemoved",
        type: Array,
        required: false,
        element: {
          type: String,
          minimalCharactersCount: 1
        }
      },

      [outputDirectoryPathTransformationsSettingsLocalization.segmentsWhichLastDuplicatesMustBeRemoved.KEY]: {
        newName: "segmentsWhichLastDuplicatesMustBeRemoved",
        type: Array,
        required: false,
        element: {
          type: String,
          minimalCharactersCount: 1
        }
      },

      [outputDirectoryPathTransformationsSettingsLocalization.segmentsCountRelativeToGroupTopDirectoryWhichMustBeRemoved.KEY]: {
        newName: "segmentsCountRelativeToGroupTopDirectoryWhichMustBeRemoved",
        type: Number,
        numbersSet: RawObjectDataProcessor.NumbersSets.naturalNumber,
        required: false
      }

    };

  }

}


export default OutputDirectoryPathTransformationsSettings__FromFile__RawValid;
