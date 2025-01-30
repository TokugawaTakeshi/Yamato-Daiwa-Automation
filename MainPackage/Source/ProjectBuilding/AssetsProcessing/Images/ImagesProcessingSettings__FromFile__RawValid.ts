/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import AssetsProcessingSettingsGenericProperties__FromFile__RawValid from
    "@ProjectBuilding:Common/RawConfig/AssetsProcessingSettingsGenericProperties__FromFile__RawValid";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import type { RawObjectDataProcessor } from "@yamato-daiwa/es-extensions";


type ImagesProcessingSettings__FromFile__RawValid = Readonly<{
  common?: ImagesProcessingSettings__FromFile__RawValid.Common;
  assetsGroups: Readonly<{ [groupID: string]: ImagesProcessingSettings__FromFile__RawValid.AssetsGroupSettings; }>;
  logging?: ImagesProcessingSettings__FromFile__RawValid.Logging;
}>;


namespace ImagesProcessingSettings__FromFile__RawValid {

  export type Common = AssetsProcessingSettingsGenericProperties__FromFile__RawValid.Common;

  export type AssetsGroupSettings = AssetsProcessingSettingsGenericProperties__FromFile__RawValid.AssetsGroup;

  export type Logging = AssetsProcessingSettingsGenericProperties__FromFile__RawValid.Logging;

  export const propertiesSpecification: RawObjectDataProcessor.PropertiesSpecification =
      AssetsProcessingSettingsGenericProperties__FromFile__RawValid.propertiesSpecification;

}


export default ImagesProcessingSettings__FromFile__RawValid;
