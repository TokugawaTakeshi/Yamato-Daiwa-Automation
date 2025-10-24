import type AssetsProcessingSettingsGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/AssetsProcessingSettingsGenericProperties__Normalized";


type ImagesProcessingSettings__Normalized = Readonly<{
  common: ImagesProcessingSettings__Normalized.Common;
  assetsGroups: ReadonlyMap<
    AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup.ID,
    ImagesProcessingSettings__Normalized.AssetsGroup
  >;
  logging: AssetsProcessingSettingsGenericProperties__Normalized.Logging;
}>;


namespace ImagesProcessingSettings__Normalized {

  export type Common =
      AssetsProcessingSettingsGenericProperties__Normalized.Common &
      Readonly<{
        imagesOptimization: Common.ImagesOptimization;
      }>;

  export namespace Common {
    export type ImagesOptimization = Readonly<{
      cachedOptimizedImagesDirectoryAbsolutePath: string;
      ignoresFilesGlobs: ReadonlySet<string>;
    }>;
  }

  export type AssetsGroup =
      AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup &
      Readonly<{
        imagesOptimization: AssetsGroup.ImagesOptimization;
      }>;

  export namespace AssetsGroup {

    export type ImagesOptimization = Readonly<{
      mustOptimize: boolean;
    }>;

  }

  export type Logging = AssetsProcessingSettingsGenericProperties__Normalized.Logging;

}


export default ImagesProcessingSettings__Normalized;
