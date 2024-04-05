/* ─── Normalized settings ───────────────────────────────────────────────────────────────────────────────────────── */
import type AssetsProcessingSettingsGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/AssetsProcessingSettingsGenericProperties__Normalized";

/* ─── Settings representatives ──────────────────────────────────────────────────────────────────────────────────── */
import AssetsProcessingSettingsRepresentative from
    "@ProjectBuilding/Common/SettingsRepresentatives/AssetsProcessingSettingsRepresentative";

/* ─── Vinyl FS ──────────────────────────────────────────────────────────────────────────────────────────────────── */
import type VinylFile from "vinyl";
import VinylFileClass from "@Utils/VinylFileClass";

/* ─── Utils ─────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


class AssetVinylFile extends VinylFileClass {

  public readonly sourceAbsolutePath: string;
  public readonly outputDirectoryAbsolutePath: string;
  public readonly actualAssetsGroupSettings: AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup;


  public constructor(
    {
      initialPlainVinylFile,
      actualAssetsGroupSettings
    }: AssetVinylFile.ConstructorParameter
  ) {

    super({
      explicitlySpecifiedPathPart: initialPlainVinylFile.base,
      path: initialPlainVinylFile.path,
      contents: Buffer.isBuffer(initialPlainVinylFile.contents) ? initialPlainVinylFile.contents : Buffer.from("")
    });

    this.sourceAbsolutePath = ImprovedPath.replacePathSeparatorsToForwardSlashes(initialPlainVinylFile.path);
    this.actualAssetsGroupSettings = actualAssetsGroupSettings;

    this.outputDirectoryAbsolutePath = AssetsProcessingSettingsRepresentative.
        computeRelevantOutputDirectoryAbsolutePathForTargetSourceFile({
          targetSourceFileAbsolutePath: this.sourceAbsolutePath,
          relevantAssetsGroupNormalizedSettings: this.actualAssetsGroupSettings
        });

  }

}


namespace AssetVinylFile {

  export type ConstructorParameter = Readonly<{
    initialPlainVinylFile: VinylFile;
    actualAssetsGroupSettings: AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup;
  }>;

}


export default AssetVinylFile;
