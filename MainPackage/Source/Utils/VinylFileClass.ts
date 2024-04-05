import VinylFile from "vinyl";
import { Logger, InvalidParameterValueError, isNotUndefined, isNull, isArbitraryObject } from "@yamato-daiwa/es-extensions";


/* eslint-disable-next-line @typescript-eslint/ban-ts-comment --
* The extending of class from the 'VinylFile' is completely valid from the viewpoint of JavaScript what is confirmed
* by the Vinyl documentation (https://github.com/gulpjs/vinyl#extending-vinyl) however, the @types/vinyl are not
* compatible with this conception   */
/* @ts-ignore TS2510: Base constructors must all have the same return type. */
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
    properties: Readonly<{
      contents: Buffer;
      path: string;
      explicitlySpecifiedPathPart: string;
      stem?: string;
      extname?: string;
    }>
  ) {
    super({
      contents: properties.contents,
      path: properties.path,
      base: properties.explicitlySpecifiedPathPart,
      ...isNotUndefined(properties.stem) ? { stem: properties.stem } : null,
      ...isNotUndefined(properties.extname) ? { extname: properties.extname } : null
    });
  }


  public setContents(contents: string): void {

    /*  Looks like the TS2322 has been caused by the incompatibility of the types definitions (`@types/vinyl`) with the class.
     *  The `File.NullFile` will be when `contents: null` has been specified in the constructor while here the `contents`
     *    has type `Buffer`. */
    /* @ts-ignore: TS2322 (See above) */
    this.contents = Buffer.from(contents);

  }

  public get stringifiedContents(): string {

    /*  ※ Because of incompatibility of the types definitions (`@types/vinyl`) with the class, TypeScript think that
     *    `this.contents` is either `null` or `never` and even `isArbitraryObject` type guard does not assure TypeScript.  */
    /* @ts-ignore: TS2358 (See above) */
    return isNull(this.contents) || (isArbitraryObject(this.contents) && !(this.contents instanceof Buffer)) ?

        /* eslint-disable @typescript-eslint/no-unsafe-call  */
        /* @ts-ignore: TS2339 (See ※ explanation) */
        "" : this.contents.toString();
        /* eslint-enable @typescript-eslint/no-unsafe-call */

  }

}
