import type AssetsProcessingSettingsGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/AssetsProcessingSettingsGenericProperties__Normalized";


type VideosProcessingSettings__Normalized = Readonly<{
  common: VideosProcessingSettings__Normalized.Common;
  assetsGroups: ReadonlyMap<
    AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup.ID,
    AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup
  >;
  logging: AssetsProcessingSettingsGenericProperties__Normalized.Logging;
}>;


namespace VideosProcessingSettings__Normalized {

  export type Common = AssetsProcessingSettingsGenericProperties__Normalized.Common;

  export type AssetsGroup = AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup;

  export type Logging = AssetsProcessingSettingsGenericProperties__Normalized.Logging;

}


export default VideosProcessingSettings__Normalized;
