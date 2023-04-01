import Glob from "glob";
import minimatch from "minimatch";

import {
  Logger,
  InvalidParameterValueError,
  insertSubstringIf,
  replaceDoubleBackslashesWithForwardSlashes,
  removeNthCharacter,
  isNotUndefined
} from "@yamato-daiwa/es-extensions";
import removeSlashes from "./removeSlashes";


export default class ImprovedGlob {

  /** @description Improved 'glob.sync', allows to pass multiple Glob selectors */
  public static getFilesAbsolutePathsSynchronously(globSelectors: ReadonlyArray<string>): Array<string> {

    const inclusiveGlobSelectors: Array<string> = [];
    const exclusiveGlobSelectors: Array<string> = [];

    for (const globSelector of globSelectors) {
      if (ImprovedGlob.isExcludingGlobSelector(globSelector)) {
        exclusiveGlobSelectors.push(replaceDoubleBackslashesWithForwardSlashes(globSelector));
      } else {
        inclusiveGlobSelectors.push(replaceDoubleBackslashesWithForwardSlashes(globSelector));
      }
    }

    const matchingFilesAbsolutePaths: Array<string> = [];

    for (const inclusiveGlobSelector of inclusiveGlobSelectors) {
      matchingFilesAbsolutePaths.push(...Glob.sync(inclusiveGlobSelector, {
        ignore: exclusiveGlobSelectors.map((globSelector: string): string => removeNthCharacter(globSelector, {
          targetCharacterNumber: 1,
          numerationFrom: 1
        }))
      }));
    }

    return matchingFilesAbsolutePaths;
  }


  /** @description The facading of 'minimatch'.　*/
  public static isFilePathMatchingWithGlobSelector(
    parametersObject: { filePath: string; globSelector: string; }
  ): boolean {
    return minimatch(parametersObject.filePath, parametersObject.globSelector);
  }

  public static isFileMatchingWithAllGlobSelectors(
    parametersObject: { filePath: string; globSelectors: Array<string>; }
  ): boolean {

    for (const globSelector of parametersObject.globSelectors) {
      if (!minimatch(parametersObject.filePath, globSelector)) {
        return false;
      }
    }

    return true;
  }

  /* [ Output examples ]
   * C:/Users/.../SomeSPA/00-Source/01-Open/01-Markup/*.+(pug)
   * 〔 実値例 〕 C:/Users/.../SomeSPA/00-Source/01-Open/01-Markup/*.+(pug|haml) */
  public static buildAllFilesInCurrentDirectoryButNotBelowGlobSelector(
    parametersObject: {
      basicDirectoryPath: string;
      fileNamesExtensions: ReadonlyArray<string>;
    }
  ): string {
    return replaceDoubleBackslashesWithForwardSlashes(
        `${ removeSlashes(parametersObject.basicDirectoryPath, { leading: false, trailing: true }) }/*` +
        `${ ImprovedGlob.createMultipleFilenameExtensionsGlobPostfix(parametersObject.fileNamesExtensions) }`
    );
  }

  public static buildAllFilesInCurrentDirectoryAndBelowGlobSelector(
    compoundParameter: {
      basicDirectoryPath: string;
      fileNamesExtensions?: ReadonlyArray<string>;
    }
  ): string {

    const fileNamesExtensions: ReadonlyArray<string> = compoundParameter.fileNamesExtensions ?? [];

    return replaceDoubleBackslashesWithForwardSlashes(
      `${ removeSlashes(compoundParameter.basicDirectoryPath, { leading: false, trailing: true }) }/**/**` +
      `${ 
        insertSubstringIf(
          ImprovedGlob.createMultipleFilenameExtensionsGlobPostfix(fileNamesExtensions),
          fileNamesExtensions.length > 0
        ) 
      }`
    );

  }

  public static buildExcludingOfDirectoryAndSubdirectoriesGlobSelector(targetDirectoryPath: string): string {
    return replaceDoubleBackslashesWithForwardSlashes(
        `!${ removeSlashes(targetDirectoryPath, { leading: false, trailing: true }) }/**/**`
    );
  }


  // [ Output example ] !D:/Project/ExampleProject/Source/Open/Pages/**/@(_)**.@(pug)
  // [ Theory ] '_**.@(pug)' is valid alternative of '@(_)**.@(pug)' but only when excluding prefix is one while
  // We need to scale the solution to n prefixes.
  // [ Output example ] !D:/Project/ExampleProject/Source/Open/Pages/**/@(_|--)**.@(pug)
  // [ Output example ] !D:/Project/ExampleProject/Source/Open/Pages/**/@(_)**.@(pug|haml)
  public static buildExcludingOfFilesWithSpecificPrefixesGlobSelector(
    parametersObject: {
      basicDirectoryPath: string;
      filesNamesPrefixes: ReadonlyArray<string>;
      filesNamesExtensions: ReadonlyArray<string>;
    }
  ): string {

    if (parametersObject.filesNamesPrefixes.length === 0) {
      Logger.throwErrorAndLog({
        errorInstance: new InvalidParameterValueError({
          parameterName: "parametersObject.filesNamesPrefixes",
          parameterNumber: 1,
          messageSpecificPart: "If must be define at leas element of 'filesNamesPrefixes'."
        }),
        title: InvalidParameterValueError.localization.defaultTitle,
        occurrenceLocation: "ImprovedGlob.buildExcludingOfFilesWithSpecificPrefixesGlobSelector(parametersObject)"
      });
    }


    if (parametersObject.filesNamesExtensions.length === 0) {
      Logger.throwErrorAndLog({
        errorInstance: new InvalidParameterValueError({
          parameterName: "parametersObject.filesNamesExtensions",
          parameterNumber: 1,
          messageSpecificPart: "If must be define at leas element of 'filesNamesExtensions'."
        }),
        title: InvalidParameterValueError.localization.defaultTitle,
        occurrenceLocation: "ImprovedGlob.buildExcludingOfFilesWithSpecificPrefixesGlobSelector(parametersObject)"
      });
    }


    return replaceDoubleBackslashesWithForwardSlashes(
        `!${ removeSlashes(parametersObject.basicDirectoryPath, { leading: false, trailing: true }) }/**/` +
        `@(${ parametersObject.filesNamesPrefixes.join("|") })**` +
        `${ ImprovedGlob.createMultipleFilenameExtensionsGlobPostfix(parametersObject.filesNamesExtensions) }`
    );
  }

  // [ Output Example ] !Open/Pages/@(_|--|test)**/**/**.@(pug|haml)
  // [ Output Example ] !Open/Pages/@(_)**/**/**.@(pug|haml)
  public static buildExcludingOfFilesInSubdirectoriesWithSpecificPrefixesGlobSelector(
    parametersObject: {
      basicDirectoryPath: string;
      subdirectoriesPrefixes: ReadonlyArray<string>;
      filesNamesExtensions?: ReadonlyArray<string>;
    }
  ): string {

    if (parametersObject.subdirectoriesPrefixes.length === 0) {
      Logger.throwErrorAndLog({
        errorInstance: new InvalidParameterValueError({
          parameterName: "parametersObject.subdirectoriesPrefixes",
          parameterNumber: 1,
          messageSpecificPart: "If must be define at leas element of 'subdirectoriesPrefixes'."
        }),
        title: InvalidParameterValueError.localization.defaultTitle,
        occurrenceLocation: "ImprovedGlob.buildExcludingOfFilesInSubdirectoriesWithSpecificPrefixesGlobSelector(parametersObject)"
      });
    }

    return replaceDoubleBackslashesWithForwardSlashes([
      `!${ removeSlashes(parametersObject.basicDirectoryPath, { leading: false, trailing: true }) }/**/`,
      `@(${ parametersObject.subdirectoriesPrefixes.join("|") })**/**/**`,
      ...isNotUndefined(parametersObject.filesNamesExtensions) && parametersObject.filesNamesExtensions.length > 0 ?
          `${ ImprovedGlob.createMultipleFilenameExtensionsGlobPostfix(parametersObject.filesNamesExtensions) }` : []
    ].join(""));
  }

  // [ Output example ] !Open/Pages/@(subdir1|subdir2)**/**.@(pug|haml)
  public static buildExcludingOfFilesInSpecificSubdirectoriesGlobSelector(
    parametersObject: {
      basicDirectoryPath: string;
      subdirectoriesNames: ReadonlyArray<string>;
      filenamesExtensions?: ReadonlyArray<string>;
    }
  ): string {

    if (parametersObject.subdirectoriesNames.length === 0) {
      Logger.throwErrorAndLog({
        errorInstance: new InvalidParameterValueError({
          parameterName: "parametersObject.subdirectoriesNames",
          parameterNumber: 1,
          messageSpecificPart: "If must be define at leas element of 'subdirectoriesNames'."
        }),
        title: InvalidParameterValueError.localization.defaultTitle,
        occurrenceLocation: "ImprovedGlob.buildExcludingOfFilesInSpecificSubdirectoriesGlobSelector(parametersObject)"
      });
    }

    return replaceDoubleBackslashesWithForwardSlashes([
      `!${ removeSlashes(parametersObject.basicDirectoryPath, { leading: false, trailing: true }) }/**/`,
      `@(${ parametersObject.subdirectoriesNames.join("|") })/**/**`,
      ...isNotUndefined(parametersObject.filenamesExtensions) && parametersObject.filenamesExtensions.length > 0 ?
          `${ ImprovedGlob.createMultipleFilenameExtensionsGlobPostfix(parametersObject.filenamesExtensions) }` : []
    ].join(""));
  }


  /* [ Output example ] [ ".js" ] の時： ".+(js)" */
  /* [ Output example ] [ ".js", ".ts" ] の時： ".+(js|ts)" */
  /* [ Output example ] [ ".js", ".ts", ".dart" ] の時： ".+(js|ts|dart)" */
  public static createMultipleFilenameExtensionsGlobPostfix(
    fileNamesExtensions: ReadonlyArray<string>
  ): string {
    return `.@(${ fileNamesExtensions.join("|").replace(/\./gu, "") })`;
  }

  public static buildAbsolutePathBasedGlob(
      namedParameters: Readonly<{
        basicDirectoryPath: string;
        relativePathBasedGlob: string;
        isExclusive?: boolean;
      }>
  ): string {
    return `${ insertSubstringIf("!", namedParameters.isExclusive === true) }` +
        `${ removeSlashes(namedParameters.basicDirectoryPath, { leading: false, trailing: true }) }/` +
        `${ removeSlashes(namedParameters.relativePathBasedGlob, { leading: true, trailing: true }) }`;
  }

  public static isExcludingGlobSelector(globSelector: string): boolean {
    return globSelector.startsWith("!");
  }

}
