import { Logger, InvalidParameterValueError } from "@yamato-daiwa/es-extensions";


type Options =
    (
      { startingSymbolNumber__numerationFrom0: number; } |
      { startingSymbolNumber__numerationFrom1: number; }
    ) &
    (
      { lastSymbolNumber__numerationFrom0: number; } |
      { lastSymbolNumber__numerationFrom1: number; } |
      { substringLength: number; }
    ) &
    { fromEnd?: boolean; };


export default function extractSubstring(targetString: string, options: Options): string {

  let startingSymbolNumber__numerationFrom0: number;

  if ("startingSymbolNumber__numerationFrom0" in options) {
    if (options.fromEnd === true) {

      if (!Number.isInteger(options.startingSymbolNumber__numerationFrom0)) {
        Logger.throwErrorAndLog({
          errorInstance: new InvalidParameterValueError({
            customMessage: "'options.startingSymbolNumber__numerationFrom0'は整数であるべきが、実際の値は" +
                `${ options.startingSymbolNumber__numerationFrom0 }と成っている。`
          }),
          occurrenceLocation: "extractSubstring(targetString, options)",
          title: InvalidParameterValueError.localization.defaultTitle
        });
      }

      startingSymbolNumber__numerationFrom0 = targetString.length - options.startingSymbolNumber__numerationFrom0;

    } else {
      startingSymbolNumber__numerationFrom0 = options.startingSymbolNumber__numerationFrom0;
    }
  } else if (options.fromEnd === true) {
    startingSymbolNumber__numerationFrom0 = targetString.length - options.startingSymbolNumber__numerationFrom1 - 1;
  } else {
    startingSymbolNumber__numerationFrom0 = options.startingSymbolNumber__numerationFrom1 - 1;
  }


  let lastSymbolNumber__numerationFrom1: number;

  if ("lastSymbolNumber__numerationFrom1" in options) {
    if (options.fromEnd === true) {
      lastSymbolNumber__numerationFrom1 = targetString.length - options.lastSymbolNumber__numerationFrom1;
    } else {
      lastSymbolNumber__numerationFrom1 = options.lastSymbolNumber__numerationFrom1;
    }
  } else if ("lastSymbolNumber__numerationFrom0" in options) {
    if (options.fromEnd === true) {
      lastSymbolNumber__numerationFrom1 = targetString.length - options.lastSymbolNumber__numerationFrom0 - 1;
    } else {
      lastSymbolNumber__numerationFrom1 = options.lastSymbolNumber__numerationFrom0 + 1;
    }
  } else if (options.fromEnd === true) {
    lastSymbolNumber__numerationFrom1 = startingSymbolNumber__numerationFrom0 - options.substringLength;
  } else {
    lastSymbolNumber__numerationFrom1 = startingSymbolNumber__numerationFrom0 + options.substringLength;
  }


  return Array.from(targetString).
      slice(startingSymbolNumber__numerationFrom0, lastSymbolNumber__numerationFrom1).
      join("");

}
