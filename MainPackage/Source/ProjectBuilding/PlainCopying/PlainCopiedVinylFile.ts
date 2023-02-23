/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type PlainCopyingSettings__Normalized from "@ProjectBuilding/PlainCopying/PlainCopyingSettings__Normalized";

/* --- Settings representative -------------------------------------------------------------------------------------- */
import PlainCopyingSettingsRepresentative from "@ProjectBuilding/PlainCopying/PlainCopyingSettingsRepresentative";

/* --- Vinyl file --------------------------------------------------------------------------------------------------- */
import type VinylFile from "vinyl";
import VinylFileClass from "@Utils/VinylFileClass";

/* --- Utils -------------------------------------------------------------------------------------------------------- */
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


export default class PlainCopiedVinylFile extends VinylFileClass {

  public readonly sourceAbsolutePath: string;
  public readonly outputDirectoryAbsolutePath: string;

  protected associatedFilesGroupSettings: PlainCopyingSettings__Normalized.FilesGroup;


  public constructor(
    initialFile: VinylFile,
    associatedFilesGroupSettings: PlainCopyingSettings__Normalized.FilesGroup
  ) {

    super({
      explicitlySpecifiedPathPart: initialFile.base,
      path: initialFile.path,
      contents: Buffer.isBuffer(initialFile.contents) ? initialFile.contents : Buffer.from("")
    });

    this.sourceAbsolutePath = ImprovedPath.replacePathSeparatorsToForwardSlashes(initialFile.path);
    this.outputDirectoryAbsolutePath = PlainCopyingSettingsRepresentative.
        computeRelevantOutputDirectoryAbsolutePathForTargetSourceFile(initialFile.path, associatedFilesGroupSettings);

    this.associatedFilesGroupSettings = associatedFilesGroupSettings;

  }


  public static get outputDirectoryCalculatorForSpecificFile(): (targetFile: VinylFile) => string {
    return (targetFile: VinylFile): string => VinylFileClass.getOutputDirectoryAbsolutePathOfExpectedToBeSelfInstance(targetFile);
  }

}
