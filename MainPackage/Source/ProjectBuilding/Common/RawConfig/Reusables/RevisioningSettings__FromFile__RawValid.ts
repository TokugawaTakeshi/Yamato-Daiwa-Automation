import type { RawObjectDataProcessor } from "@yamato-daiwa/es-extensions";


type RevisioningSettings__FromFile__RawValid = Readonly<{
  disable?: boolean;
  contentHashPostfixSeparator?: string;
}>;


namespace RevisioningSettings__FromFile__RawValid {

  export type Localization = Readonly<{
    disable: Readonly<{ KEY: string; }>;
    contentHashPostfixSeparator: Readonly<{ KEY: string; }>;
  }>;

  export function getLocalizedPropertiesSpecification(
    revisioningLocalization: Localization
  ): RawObjectDataProcessor.PropertiesSpecification {

    return {

      [revisioningLocalization.disable.KEY]: {
        newName: "disable",
        type: Boolean,
        required: false
      },

      [revisioningLocalization.contentHashPostfixSeparator.KEY]: {
        newName: "contentHashPostfixSeparator",
        type: String,
        required: false,
        minimalCharactersCount: 1
      }

    };

  }

}


export default RevisioningSettings__FromFile__RawValid;
