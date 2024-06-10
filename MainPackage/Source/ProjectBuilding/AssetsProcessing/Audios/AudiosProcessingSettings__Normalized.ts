import type AssetsProcessingSettingsGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/AssetsProcessingSettingsGenericProperties__Normalized";


type AudiosProcessingSettings__Normalized = Readonly<{
  common: AudiosProcessingSettings__Normalized.Common;
  assetsGroups: ReadonlyMap<
    AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup.ID,
    AudiosProcessingSettings__Normalized.AssetsGroup
  >;
  logging: AssetsProcessingSettingsGenericProperties__Normalized.Logging;
}>;


namespace AudiosProcessingSettings__Normalized {

  export type Common = AssetsProcessingSettingsGenericProperties__Normalized.Common;

  export type AssetsGroup = AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup;

  export type Logging = AssetsProcessingSettingsGenericProperties__Normalized.Logging;

}


export default AudiosProcessingSettings__Normalized;
