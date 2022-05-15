/* --- Raw valid config --------------------------------------------------------------------------------------------- */
import type ConsumingProjectPreDefinedBuildingModes__Localized from
    "@ProjectBuilding/Common/RawConfig/Enumerations/ConsumingProjectPreDefinedBuildingModes__Localized";
import AssetsProcessingSettingsGenericProperties__FromFile__RawValid from
    "@ProjectBuilding:Common/RawConfig/AssetsProcessingSettingsGenericProperties__FromFile__RawValid";

/* --- Utils -------------------------------------------------------------------------------------------------------- */
import type { RawObjectDataProcessor } from "@yamato-daiwa/es-extensions";


type FontsProcessingSettings__FromFile__RawValid = {
  readonly assetsGroups: { readonly [groupID: string]: FontsProcessingSettings__FromFile__RawValid.AssetsGroupSettings; };
};


/* eslint-disable-next-line @typescript-eslint/no-redeclare --
 * The merging of type/interface and namespace is completely valid TypeScript,
 * but @typescript-eslint community does not wish to support it.
 * https://github.com/eslint/eslint/issues/15504 */
namespace FontsProcessingSettings__FromFile__RawValid {

  export type AssetsGroupSettings = AssetsProcessingSettingsGenericProperties__FromFile__RawValid.AssetsGroup;

  export type Localization = AssetsProcessingSettingsGenericProperties__FromFile__RawValid.Localization;

  export function getLocalizedPropertiesSpecification(
    namedParameters: {
      readonly fontsProcessingLocalization: Localization;
      readonly revisioningPropertiesLocalizedSpecification: RawObjectDataProcessor.PropertiesSpecification;
      readonly consumingProjectLocalizedPreDefinedBuildingModes: ConsumingProjectPreDefinedBuildingModes__Localized;
    }
  ): RawObjectDataProcessor.PropertiesSpecification {
    return AssetsProcessingSettingsGenericProperties__FromFile__RawValid.getLocalizedSpecification({
      ...namedParameters,
      assetsProcessingSettingsGenericPropertiesLocalization: namedParameters.fontsProcessingLocalization
    });
  }
}


export default FontsProcessingSettings__FromFile__RawValid;
