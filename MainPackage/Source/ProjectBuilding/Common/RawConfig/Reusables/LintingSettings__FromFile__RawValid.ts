import type { RawObjectDataProcessor } from "@yamato-daiwa/es-extensions";


type LintingSettings__FromFile__RawValid = Readonly<{
  presetFileRelativePath?: string;
  enable?: boolean;
}>;


namespace LintingSettings__FromFile__RawValid {

  export type Localization = Readonly<{
    presetFileRelativePath: Readonly<{ KEY: string; }>;
    disable: Readonly<{ KEY: string; }>;
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

      [lintingCommonSettingsLocalization.disable.KEY]: {
        newName: "disable",
        type: Boolean,
        required: false
      }

    };
  }

}


export default LintingSettings__FromFile__RawValid;
