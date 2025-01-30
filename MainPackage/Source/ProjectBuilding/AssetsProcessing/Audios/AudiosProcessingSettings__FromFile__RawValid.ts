/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
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

  export const propertiesSpecification: RawObjectDataProcessor.PropertiesSpecification =
      AssetsProcessingSettingsGenericProperties__FromFile__RawValid.propertiesSpecification;

}


export default AudiosProcessingSettings__FromFile__RawValid;
