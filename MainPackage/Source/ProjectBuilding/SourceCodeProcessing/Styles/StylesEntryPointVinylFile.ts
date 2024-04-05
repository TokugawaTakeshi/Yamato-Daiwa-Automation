/* ─── Normalized settings ───────────────────────────────────────────────────────────────────────────────────────── */
import type StylesProcessingSettings__Normalized from "@StylesProcessing/StylesProcessingSettings__Normalized";

/* ─── Settings representatives ──────────────────────────────────────────────────────────────────────────────────── */
import StylesProcessingSettingsRepresentative from "@StylesProcessing/StylesProcessingSettingsRepresentative";

/* ─── Vinyl FS ──────────────────────────────────────────────────────────────────────────────────────────────────── */
import type VinylFile from "vinyl";
import VinylFileClass from "@Utils/VinylFileClass";

/* ─── Utils ─────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


class StylesEntryPointVinylFile extends VinylFileClass {

  public readonly sourceAbsolutePath: string;
  public readonly outputDirectoryAbsolutePath: string;
  public readonly actualEntryPointsGroupSettings: StylesProcessingSettings__Normalized.EntryPointsGroup;


  public constructor(
    {
      initialPlainVinylFile,
      actualEntryPointsGroupSettings
    }: StylesEntryPointVinylFile.ConstructorParameter
  ) {

    super({
      explicitlySpecifiedPathPart: initialPlainVinylFile.base,
      path: initialPlainVinylFile.path,
      contents: Buffer.isBuffer(initialPlainVinylFile.contents) ? initialPlainVinylFile.contents : Buffer.from("")
    });

    this.sourceAbsolutePath = ImprovedPath.replacePathSeparatorsToForwardSlashes(initialPlainVinylFile.path);
    this.actualEntryPointsGroupSettings = actualEntryPointsGroupSettings;

    this.outputDirectoryAbsolutePath = StylesProcessingSettingsRepresentative.
        computeRelevantOutputDirectoryAbsolutePathForTargetSourceFile(
          this.sourceAbsolutePath, this.actualEntryPointsGroupSettings
        );

  }

}


namespace StylesEntryPointVinylFile {

  export type ConstructorParameter = Readonly<{
    initialPlainVinylFile: VinylFile;
    actualEntryPointsGroupSettings: StylesProcessingSettings__Normalized.EntryPointsGroup;
  }>;

}


export default StylesEntryPointVinylFile;
