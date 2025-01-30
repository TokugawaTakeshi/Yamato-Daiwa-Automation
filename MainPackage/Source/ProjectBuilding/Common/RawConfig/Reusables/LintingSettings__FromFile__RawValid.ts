import type { RawObjectDataProcessor } from "@yamato-daiwa/es-extensions";


type LintingSettings__FromFile__RawValid = Readonly<{
  presetFileRelativePath?: string;
  enable?: boolean;
}>;


namespace LintingSettings__FromFile__RawValid {

  export const propertiesSpecification: RawObjectDataProcessor.PropertiesSpecification = {

    $presetFileRelativePath: {
      newName: "presetFileRelativePath",
      type: String,
      isUndefinedForbidden: false,
      isNullForbidden: true,
      minimalCharactersCount: 1
    },

    $disable: {
      newName: "disable",
      type: Boolean,
      isUndefinedForbidden: false,
      isNullForbidden: true
    }

  };

}


export default LintingSettings__FromFile__RawValid;
