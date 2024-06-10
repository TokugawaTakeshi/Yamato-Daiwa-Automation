import type AssetsProcessingSettingsGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/AssetsProcessingSettingsGenericProperties__Normalized";


type FontsProcessingSettings__Normalized = Readonly<{
  common: FontsProcessingSettings__Normalized.Common;
  assetsGroups: ReadonlyMap<
    AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup.ID,
    AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup
  >;
  logging: AssetsProcessingSettingsGenericProperties__Normalized.Logging;
}>;


namespace FontsProcessingSettings__Normalized {

  export type Common = AssetsProcessingSettingsGenericProperties__Normalized.Common;

  export type AssetsGroup = AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup;

  export type Logging = AssetsProcessingSettingsGenericProperties__Normalized.Logging;

}


export default FontsProcessingSettings__Normalized;
