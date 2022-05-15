import type { RawObjectDataProcessor } from "@yamato-daiwa/es-extensions";


type RevisioningSettings__FromFile__RawValid = {
  readonly disable?: boolean;
  readonly contentHashPostfixSeparator?: string;
};


/* eslint-disable-next-line @typescript-eslint/no-redeclare --
 * The merging of type/interface and namespace is completely valid TypeScript,
 * but @typescript-eslint community does not wish to support it.
 * https://github.com/eslint/eslint/issues/15504 */
namespace RevisioningSettings__FromFile__RawValid {

  export type Localization = {
    readonly disable: { readonly KEY: string; };
    readonly contentHashPostfixSeparator: { readonly KEY: string; };
  };

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
