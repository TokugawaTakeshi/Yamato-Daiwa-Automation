import type { RawObjectDataProcessor } from "@yamato-daiwa/es-extensions";


type LintingCommonSettings__FromFile__RawValid = Readonly<{
  presetFileRelativePath?: string;
  enabled?: boolean;
}>;


/* eslint-disable-next-line @typescript-eslint/no-redeclare --
 * The merging of type/interface and namespace is completely valid TypeScript,
 * but @typescript-eslint community does not wish to support it.
 * https://github.com/eslint/eslint/issues/15504 */
namespace LintingCommonSettings__FromFile__RawValid {

  export type Localization = Readonly<{
    presetFileRelativePath: Readonly<{ KEY: string; }>;
    enabled: Readonly<{ KEY: string; }>;
  }>;

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
      [lintingCommonSettingsLocalization.enabled.KEY]: {
        newName: "enabled",
        type: Boolean,
        required: false
      }
    };
  }
}


export default LintingCommonSettings__FromFile__RawValid;
