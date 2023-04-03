/* --- Vinyl FS ----------------------------------------------------------------------------------------------------- */
import type VinylFile from "vinyl";
import VinylFileClass from "@Utils/VinylFileClass";

/* --- Utils -------------------------------------------------------------------------------------------------------- */
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


export default class ECMA_ScriptVinylFile extends VinylFileClass {

  public readonly sourceAbsolutePath: string;
  public readonly outputDirectoryAbsolutePath: string;


  public constructor(initialFile: VinylFile) {

    super({
      explicitlySpecifiedPathPart: initialFile.base,
      path: initialFile.path,
      contents: Buffer.isBuffer(initialFile.contents) ? initialFile.contents : Buffer.from("")
    });

    this.sourceAbsolutePath = ImprovedPath.replacePathSeparatorsToForwardSlashes(initialFile.path);
    this.outputDirectoryAbsolutePath = process.cwd();

  }

}
