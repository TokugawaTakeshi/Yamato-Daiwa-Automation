import type VinylFile from "vinyl";


export default abstract class ContainerQueriesSyntaxNormalizerForStylus {

  public static normalizeSyntax(vinylFile: VinylFile): void {

    if (!Buffer.isBuffer(vinylFile.contents)) {
      return;
    }

    vinylFile.contents = Buffer.from(
      vinylFile.
          contents.
          toString().
          replaceAll("@media container and", "@container")
    );

  }

}
