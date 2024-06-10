/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import type ConsumingProjectPreDefinedBuildingModes__Localized from
    "@ProjectBuilding/Common/RawConfig/Enumerations/ConsumingProjectPreDefinedBuildingModes__Localized";
import AssetsProcessingSettingsGenericProperties__FromFile__RawValid from
    "@ProjectBuilding:Common/RawConfig/AssetsProcessingSettingsGenericProperties__FromFile__RawValid";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import type { RawObjectDataProcessor } from "@yamato-daiwa/es-extensions";


type AudiosProcessingSettings__FromFile__RawValid = Readonly<{
  common?: AudiosProcessingSettings__FromFile__RawValid.Common;
  assetsGroups: Readonly<{ [groupID: string]: AudiosProcessingSettings__FromFile__RawValid.AssetsGroup; }>;
  logging?: AudiosProcessingSettings__FromFile__RawValid.Logging;
}>;


namespace AudiosProcessingSettings__FromFile__RawValid {

  export type Common = AssetsProcessingSettingsGenericProperties__FromFile__RawValid.Common;

  export type AssetsGroup = AssetsProcessingSettingsGenericProperties__FromFile__RawValid.AssetsGroup;

  export type Logging = AssetsProcessingSettingsGenericProperties__FromFile__RawValid.Logging;

  export type Localization = AssetsProcessingSettingsGenericProperties__FromFile__RawValid.Localization;

  export function getLocalizedPropertiesSpecification(
    compoundParameter: Readonly<{
      audiosProcessingLocalization: Localization;
      revisioningPropertiesLocalizedSpecification: RawObjectDataProcessor.PropertiesSpecification;
      entryPointsGroupBuildingModeDependentOutputGenericSettingsLocalizedPropertiesSpecification: RawObjectDataProcessor.
          PropertiesSpecification;
      consumingProjectLocalizedPreDefinedBuildingModes: ConsumingProjectPreDefinedBuildingModes__Localized;
    }>
  ): RawObjectDataProcessor.PropertiesSpecification {
    return AssetsProcessingSettingsGenericProperties__FromFile__RawValid.getLocalizedPropertiesSpecification({
      ...compoundParameter,
      assetsProcessingSettingsGenericPropertiesLocalization: compoundParameter.audiosProcessingLocalization
    });
  }

}


export default AudiosProcessingSettings__FromFile__RawValid;
