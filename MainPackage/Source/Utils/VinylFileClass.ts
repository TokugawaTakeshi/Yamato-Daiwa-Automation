import VinylFile from "vinyl";
import { Logger, InvalidParameterValueError } from "@yamato-daiwa/es-extensions";


/* eslint-disable-next-line @typescript-eslint/ban-ts-comment --
* The extending of class from the 'VinylFile' is completely valid from the viewpoint of JavaScript what is confirmed
* by the Vinyl documentation (https://github.com/gulpjs/vinyl#extending-vinyl) however, the @types/vinyl are not
* compatible with this conception   */
/* @ts-ignore */
export default abstract class VinylFileClass extends VinylFile {

  public abstract readonly sourceAbsolutePath: string;
  public abstract readonly outputDirectoryAbsolutePath: string;


  public static getOutputDirectoryAbsolutePathOfExpectedToBeSelfInstance(targetVinylFile: VinylFile): string {

    if (!(targetVinylFile instanceof VinylFileClass)) {
      Logger.throwErrorAndLog({
        errorInstance: new InvalidParameterValueError({
          parameterName: "targetVinylFile",
          parameterNumber: 1,
          messageSpecificPart: "The target file is not the instance of \"VinylFileClass\" that is why can not access " +
              "the field storing the output directory absolute path."
        }),
        title: InvalidParameterValueError.localization.defaultTitle,
        occurrenceLocation: "VinylFileClass.getOutputDirectoryAbsolutePathOfExpectedToBeSelfInstance(targetVinylFile"
      });
    }


    return targetVinylFile.outputDirectoryAbsolutePath;

  }


  protected constructor(
    namedParameters: Readonly<{
      contents: Buffer;
      path: string;
      explicitlySpecifiedPathPart: string;
    }>
  ) {
    super({
      contents: namedParameters.contents,
      path: namedParameters.path,
      base: namedParameters.explicitlySpecifiedPathPart
    });
  }

}
