import type { RawObjectDataProcessor } from "@yamato-daiwa/es-extensions";
import { nullToUndefined } from "@yamato-daiwa/es-extensions";


type ProjectBuildingDebuggingSettings__FromFile__RawValid = {
  readonly enabled: boolean;
  readonly partials?: {
    readonly partialFilesAndParentEntryPointAccordance?: boolean;
  };
};


/* eslint-disable-next-line @typescript-eslint/no-redeclare --
 * The merging of type/interface and namespace is completely valid TypeScript,
 * but @typescript-eslint community does not wish to support it.
 * https://github.com/eslint/eslint/issues/15504 */
namespace ProjectBuildingDebuggingSettings__FromFile__RawValid {

  export type Localization = {
    readonly enabled: { KEY: string; };
    readonly partials: {
      readonly KEY: string;
      readonly partialFilesAndParentEntryPointAccordance: { KEY: string; };
    };
  };

  export function getLocalizedPropertiesSpecification(
    debuggingSettingsLocalization: Localization
  ): RawObjectDataProcessor.PropertiesSpecification {

    return {

      [debuggingSettingsLocalization.enabled.KEY]: {
        newName: "enabled",
        type: Boolean,
        required: true
      },

      [debuggingSettingsLocalization.partials.KEY]: {

        newName: "partials",
        preValidationModifications: nullToUndefined,
        type: Object,
        required: false,

        properties: {
          [debuggingSettingsLocalization.partials.partialFilesAndParentEntryPointAccordance.KEY]: {
            newName: "partialFilesAndParentEntryPointAccordance",
            type: Boolean,
            required: false
          }
        }
      }
    };
  }
}


export default ProjectBuildingDebuggingSettings__FromFile__RawValid;
