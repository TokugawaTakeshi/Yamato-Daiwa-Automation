/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import type ConsumingProjectPreDefinedBuildingModes__Localized from
    "@ProjectBuilding/Common/RawConfig/Enumerations/ConsumingProjectPreDefinedBuildingModes__Localized";
import AssetsProcessingSettingsGenericProperties__FromFile__RawValid from
    "@ProjectBuilding:Common/RawConfig/AssetsProcessingSettingsGenericProperties__FromFile__RawValid";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import type { RawObjectDataProcessor } from "@yamato-daiwa/es-extensions";


type FontsProcessingSettings__FromFile__RawValid = Readonly<{
  common?: FontsProcessingSettings__FromFile__RawValid.Common;
  assetsGroups: Readonly<{ [groupID: string]: FontsProcessingSettings__FromFile__RawValid.AssetsGroupSettings; }>;
  logging?: FontsProcessingSettings__FromFile__RawValid.Logging;
}>;


namespace FontsProcessingSettings__FromFile__RawValid {

  export type Common = AssetsProcessingSettingsGenericProperties__FromFile__RawValid.Common;

  export type AssetsGroupSettings = AssetsProcessingSettingsGenericProperties__FromFile__RawValid.AssetsGroup;

  export type Logging = AssetsProcessingSettingsGenericProperties__FromFile__RawValid.Logging;

  export type Localization = AssetsProcessingSettingsGenericProperties__FromFile__RawValid.Localization;

  export function getLocalizedPropertiesSpecification(
    compoundParameter: Readonly<{
      fontsProcessingLocalization: Localization;
      revisioningPropertiesLocalizedSpecification: RawObjectDataProcessor.PropertiesSpecification;
      entryPointsGroupBuildingModeDependentOutputGenericSettingsLocalizedPropertiesSpecification: RawObjectDataProcessor.
          PropertiesSpecification;
      consumingProjectLocalizedPreDefinedBuildingModes: ConsumingProjectPreDefinedBuildingModes__Localized;
    }>
  ): RawObjectDataProcessor.PropertiesSpecification {
    return AssetsProcessingSettingsGenericProperties__FromFile__RawValid.getLocalizedPropertiesSpecification({
      ...compoundParameter,
      assetsProcessingSettingsGenericPropertiesLocalization: compoundParameter.fontsProcessingLocalization
    });
  }

}


export default FontsProcessingSettings__FromFile__RawValid;
