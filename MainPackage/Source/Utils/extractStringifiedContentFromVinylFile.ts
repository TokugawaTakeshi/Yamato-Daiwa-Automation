import type VinylFile from "vinyl";


export default function extractStringifiedContentFromVinylFile(targetFile: VinylFile): string {

  if (targetFile.contents === null) {
    return "";
  }


  if (!(targetFile.contents instanceof Buffer)) {
    return "";
  }


  return targetFile.contents.toString();

}
