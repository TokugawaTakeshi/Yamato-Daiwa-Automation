import type VinylFile from "vinyl";
import { Logger, UnexpectedEventError } from "@yamato-daiwa/es-extensions";


export default function getExpectedToBeNonNullStringifiedContentOfVinylFile(targetFile: VinylFile): string {

  if (targetFile.contents === null) {
    Logger.throwErrorAndLog({
      errorInstance: new UnexpectedEventError(`目標的Vinylファイル：「${ targetFile.path }」の'contents'プロパティは'null'と成っている。`),
      title: UnexpectedEventError.localization.defaultTitle,
      occurrenceLocation: "extractExpectedToBeNonNullStringifiedContentFromVinylFile(targetFile)",
      additionalData: targetFile
    });
  }


  if (!(targetFile.contents instanceof Buffer)) {
    Logger.throwErrorAndLog({
      errorInstance: new UnexpectedEventError(
        `目標的Vinylファイル：「${ targetFile.path }」の'contents'プロパティは'Buffer'のインスタンスではない為、内容を抽出出来ません。`
      ),
      title: UnexpectedEventError.localization.defaultTitle,
      occurrenceLocation: "extractExpectedToBeNonNullStringifiedContentFromVinylFile(targetFile)",
      additionalData: targetFile
    });
  }


  return targetFile.contents.toString();
}
