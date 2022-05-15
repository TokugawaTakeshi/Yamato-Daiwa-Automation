import type VinylFile from "vinyl";
import { UnexpectedEventError, Logger, isNull } from "@yamato-daiwa/es-extensions";
import generateRevisionHash from "rev-hash";


export default class FileNameRevisionPostfixer {

  public static appendPostfixIfPossible(
    targetFile: VinylFile,
    options: { contentHashPostfixSeparator: string; }
  ): void {

    if (isNull(targetFile.contents)) {

      Logger.logWarning({
        title: "Unable to add revision hash",
        description: `The 'content' property of Target Vinyl file '${ targetFile.path }' is null.`
      });

      return;
    }


    if (!(targetFile.contents instanceof Buffer)) {
      Logger.throwErrorAndLog({
        errorInstance: new UnexpectedEventError(
          `The 'contents' property of target Vynil file '${ targetFile.path }' is not an instance of 'Buffer'.` +
          "Because usually it is the instance of Buffer, explorations are required."
        ),
        title: UnexpectedEventError.localization.defaultTitle,
        occurrenceLocation: "FileNameRevisionPostfixer.appendPostfixIfPossible(targetFile, options)",
        additionalData: targetFile
      });
    }


    targetFile.stem = `${ targetFile.stem }${ options.contentHashPostfixSeparator }` +
        `${ generateRevisionHash(targetFile.contents) }`;
  }
}
