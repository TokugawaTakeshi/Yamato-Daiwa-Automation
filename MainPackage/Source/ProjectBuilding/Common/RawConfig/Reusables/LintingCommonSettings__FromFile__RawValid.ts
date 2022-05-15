import type { RawObjectDataProcessor } from "@yamato-daiwa/es-extensions";


type LintingCommonSettings__FromFile__RawValid = {
  readonly presetFileRelativePath?: string;
  readonly disableCompletely?: boolean;
};


/* eslint-disable-next-line @typescript-eslint/no-redeclare --
 * The merging of type/interface and namespace is completely valid TypeScript,
 * but @typescript-eslint community does not wish to support it.
 * https://github.com/eslint/eslint/issues/15504 */
namespace LintingCommonSettings__FromFile__RawValid {

  export type Localization = {
    readonly presetFileRelativePath: { KEY: string; };
    readonly disableCompletely: { KEY: string; };
  };

  export function getLocalizedPropertiesSpecification(
    lintingCommonSettingsLocalization: Localization
  ): RawObjectDataProcessor.PropertiesSpecification {
    return {
      [lintingCommonSettingsLocalization.presetFileRelativePath.KEY]: {
        newName: "presetFileRelativePath",
        type: String,
        required: false,
        minimalCharactersCount: 1
      },
      [lintingCommonSettingsLocalization.disableCompletely.KEY]: {
        newName: "disableCompletely",
        type: Boolean,
        required: false
      }
    };
  }
}


export default LintingCommonSettings__FromFile__RawValid;
