import {
  RawObjectDataProcessor,
  convertPotentialStringToIntegerIfPossible,
  Logger,
  InvalidExternalDataError,
  getLineSeparatorType,
  explodeStringToLines,
  isNotUndefined,
  type LineSeparators,
  type ArbitraryObject
} from "@yamato-daiwa/es-extensions";


abstract class CodeListingPugFilter {

  public static optionsSpecification: RawObjectDataProcessor.FixedKeyAndValuesTypeObjectDataSpecification = {
    subtype: RawObjectDataProcessor.ObjectSubtypes.fixedKeyAndValuePairsObject,
    nameForLogging: "CodeListingPugFilerOptions",
    properties: {
      mustAppendEmptyLine: {
        type: Boolean,
        defaultValue: false
      },
      indentationMultiplier: {
        preValidationModifications: convertPotentialStringToIntegerIfPossible,
        type: Number,
        required: false,
        numbersSet: RawObjectDataProcessor.NumbersSets.naturalNumber
      },
      indentationString: {
        type: String,
        requiredIf: {
          predicate: (rawOptions: ArbitraryObject): boolean => isNotUndefined(rawOptions.indentationMultiplier),
          descriptionForLogging: "\"indentationMultiplier\" has been specified"
        },
        minimalCharactersCount: 1
      }
    }
  };

  public static apply(sourcePugCode: string, rawOptions: unknown): string {

    const rawOptionsProcessingResult: RawObjectDataProcessor.ProcessingResult<CodeListingPugFilter.Options> =
        RawObjectDataProcessor.process(rawOptions, CodeListingPugFilter.optionsSpecification);

    if (rawOptionsProcessingResult.rawDataIsInvalid) {
      Logger.throwErrorAndLog({
        errorInstance: new InvalidExternalDataError({
          customMessage: "One or more invalid options found for \"CodeListing\" pug filer.\n" +
              RawObjectDataProcessor.formatValidationErrorsList(rawOptionsProcessingResult.validationErrorsMessages)
        }),
        title: InvalidExternalDataError.localization.defaultTitle,
        occurrenceLocation: "CodeListingPugFilter.apply(sourcePugCode, rawOptions)"
      });
    }


    const {
      mustAppendEmptyLine,
      indentationString,
      indentationMultiplier
    }: CodeListingPugFilter.Options = rawOptionsProcessingResult.processedData;

    const lineSeparator: LineSeparators = getLineSeparatorType(sourcePugCode);

    let outputCodeWorkpiece: string = sourcePugCode;

    if (isNotUndefined(indentationString) && isNotUndefined(indentationMultiplier)) {
      outputCodeWorkpiece = explodeStringToLines({ targetString: outputCodeWorkpiece, mustIgnoreCarriageReturn: true }).
          map(
            (sourceCodeLine: string): string =>
                `${ indentationString.repeat(indentationMultiplier - 1) }${ sourceCodeLine }`
          ).
          join(lineSeparator);
    }

    return [
      ...mustAppendEmptyLine ? [ lineSeparator ] : [],
      outputCodeWorkpiece.
          replace(/&(?!#?[a-z0-9]+;)/gu, "&amp;").
          replace(/</gu, "&lt;").
          replace(/>/gu, "&gt;").
          replace(/"/gu, "&quot;").
          replace(/'/gu, "&apos;")
    ].join("");

  }

}


namespace CodeListingPugFilter {

  export type Options = Readonly<{
    mustAppendEmptyLine: boolean;
    indentationString?: string;
    indentationMultiplier?: number;
  }>;

}


export default CodeListingPugFilter;
