/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type AssetsProcessingSettingsGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/AssetsProcessingSettingsGenericProperties__Normalized";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import AssetsProcessingSettingsRepresentative from
    "@ProjectBuilding/Common/SettingsRepresentatives/AssetsProcessingSettingsRepresentative";

/* ─── Vinyl FS ───────────────────────────────────────────────────────────────────────────────────────────────────── */
import type VinylFile from "vinyl";
import VinylFileClass from "@Utils/VinylFileClass";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


class AssetVinylFile<
  /* eslint-disable-next-line @stylistic/type-generic-spacing -- False positive */
  ActualAssetsGroupSettings extends AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup =
      AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup
> extends VinylFileClass {

  public readonly sourceAbsolutePath: string;
  public readonly outputDirectoryAbsolutePath: string;
  public readonly actualAssetsGroupSettings: ActualAssetsGroupSettings;


  public constructor(
    {
      initialPlainVinylFile,
      actualAssetsGroupSettings
    }: AssetVinylFile.ConstructorParameter<ActualAssetsGroupSettings>
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

  export type ConstructorParameter<
    ActualAssetsGroupSettings extends AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup
  > =
    Readonly<{
      initialPlainVinylFile: VinylFile;
      actualAssetsGroupSettings: ActualAssetsGroupSettings;
    }>;

}


export default AssetVinylFile;
