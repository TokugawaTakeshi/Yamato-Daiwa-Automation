/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type MarkupProcessingSettings__Normalized from "@MarkupProcessing/MarkupProcessingSettings__Normalized";

/* --- Settings representatives ------------------------------------------------------------------------------------- */
import MarkupProcessingSettingsRepresentative from "@MarkupProcessing/MarkupProcessingSettingsRepresentative";

/* --- Vinyl FS ----------------------------------------------------------------------------------------------------- */
import type VinylFile from "vinyl";
import VinylFileClass from "@Utils/VinylFileClass";

/* --- Utils -------------------------------------------------------------------------------------------------------- */
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


export default class MarkupEntryPointVinylFile extends VinylFileClass {

  public readonly sourceAbsolutePath: string;
  public readonly outputDirectoryAbsolutePath: string;
  public readonly actualEntryPointsGroupSettings: MarkupProcessingSettings__Normalized.EntryPointsGroup;

  public constructor(
    initialFile: VinylFile,
    actualEntryPointsGroupSettings: MarkupProcessingSettings__Normalized.EntryPointsGroup
  ) {

    super({
      explicitlySpecifiedPathPart: initialFile.base,
      path: initialFile.path,
      contents: Buffer.isBuffer(initialFile.contents) ? initialFile.contents : Buffer.from("")
    });

    this.sourceAbsolutePath = ImprovedPath.replacePathSeparatorsToForwardSlashes(initialFile.path);
    this.outputDirectoryAbsolutePath = MarkupProcessingSettingsRepresentative.
        computeRelevantOutputDirectoryAbsolutePathForTargetSourceFile(
          initialFile.path, actualEntryPointsGroupSettings
        );

    this.actualEntryPointsGroupSettings = actualEntryPointsGroupSettings;

  }

}
