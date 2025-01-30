import type { RawObjectDataProcessor } from "@yamato-daiwa/es-extensions";


type RevisioningSettings__FromFile__RawValid = Readonly<{
  disable?: boolean;
  contentHashPostfixSeparator?: string;
}>;


namespace RevisioningSettings__FromFile__RawValid {

  export const propertiesSpecification: RawObjectDataProcessor.PropertiesSpecification = {

    $disable: {
      newName: "disable",
      type: Boolean,
      isUndefinedForbidden: false,
      isNullForbidden: true
    },

    $contentHashPostfixSeparator: {
      newName: "contentHashPostfixSeparator",
      type: String,
      isUndefinedForbidden: false,
      isNullForbidden: true,
      minimalCharactersCount: 1
    }

  };

}


export default RevisioningSettings__FromFile__RawValid;
