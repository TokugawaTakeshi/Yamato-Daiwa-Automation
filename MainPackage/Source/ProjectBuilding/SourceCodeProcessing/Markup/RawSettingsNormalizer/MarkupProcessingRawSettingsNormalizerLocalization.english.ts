import type MarkupProcessingRawSettingsNormalizer from
    "@MarkupProcessing/RawSettingsNormalizer/MarkupProcessingRawSettingsNormalizer";


const MarkupProcessingRawSettingsNormalizerLocalization__English: MarkupProcessingRawSettingsNormalizer.Localization = {

  generateStaticPreviewStateDependentPagesVariationsSpecificationFileReadingFailedMessage:
      (
        namedParameters: MarkupProcessingRawSettingsNormalizer.Localization.
            StaticPreviewStateDependentPagesVariationsSpecificationFileReadingFailedLog.NamedParameters
      ): string => "Failed to read the static preview state dependent pages variations specification file at " +
          `'${ namedParameters.staticPreviewStateDependentPagesVariationsSpecificationFileAbsolutePath }'.`,

  generateStaticPreviewStateDependentPagesVariationsSpecificationIsNotTheObjectErrorLog:
      (
        namedParameters: MarkupProcessingRawSettingsNormalizer.Localization.
            StaticPreviewStateDependentPagesVariationsSpecificationIsInvalidLog.NamedParameters
      ): MarkupProcessingRawSettingsNormalizer.Localization.StaticPreviewStateDependentPagesVariationsSpecificationIsInvalidLog =>
          ({
            technicalDetails: "The parsed YAML from static preview state dependent pages variations specification file " +
                "'[ ProjectDirectory ]" +
                `${ namedParameters.staticPreviewStateDependentPagesVariationsSpecificationFileRelativePath }'` +
                `is not an ECMAScript 'object' and actually has type '${ namedParameters.rawDataActualType }' and value:` +
                `${ namedParameters.stringifiedRawData }\n This data will be ignored.`,
            politeExplanation: "Reading and parsing of static preview state dependent pages variations specification file, " +
                "we are expected it will has the object type as parsed YAML, the superset of JSON. Contrary to expectations, " +
                `it has the '${ namedParameters.stringifiedRawData }' type. We need to investigate it. ` +
                "We will keep the YDA running however we are sorry, but currently we are unable to inject above data " +
                "to Pug files."
          }),

  generateInvalidValueOfStaticPreviewStateDependentPagesVariationsSpecificationAssociativeArrayMessage:
      (
        namedParameters: MarkupProcessingRawSettingsNormalizer.Localization.
            InvalidValueOfStaticPreviewStateDependentPagesVariationsSpecificationAssociativeArrayLog.NamedParameters
      ): string =>
          "The static preview state dependent pages variations specification file " +
          `${ namedParameters.staticPreviewStateDependentPagesVariationsSpecificationFileRelativePath }` +
          "is including the associative array with invalid value. The value respective to key " +
          `'${ namedParameters.invalidEntryKey }' must be the object with 'stateObjectTypeVariableName' and 'variations' ` +
          `properties while actually has type ${ namedParameters.invalidEntryValueType } ` +
          `and value ${ namedParameters.invalidEntryStringifiedValue }`,

  generateInvalidPageStateVariableNameMessage:
      (
        namedParameters: MarkupProcessingRawSettingsNormalizer.Localization.InvalidPageStateVariableNameLog.NamedParameters
      ): string =>
          "Invalid page state variable name ('stateObjectTypeVariableName') has been specified for the markup file " +
          `'${ namedParameters.targetMarkupFileRelativePath }' in static preview state dependent pages variations ` +
          "specification file. This variable name must the non-empty string while actually has type " +
          `'${ namedParameters.specifiedTypeOfVariableNameProperty }' and value:\n ` +
          `${ namedParameters.stringifiedValueOfSpecifiedVariableNameProperty }`,

  generateInvalidPageStateDependentVariationsSpecificationMessage:
      (
        namedParameters: MarkupProcessingRawSettingsNormalizer.Localization.
            InvalidPageStateDependentVariationsSpecificationLog.NamedParameters
      ): string =>
          "Invalid state dependent page variations has been specified for the markup file " +
          `'${ namedParameters.targetMarkupFileRelativePath }'. It must be the associative array like object while ` +
          `actually has type '${ namedParameters.actualType }' and value: ${ namedParameters.actualStringifiedValue }`,

  generateInvalidPageStateVariableMessage:
      (
        namedParameters: MarkupProcessingRawSettingsNormalizer.Localization.InvalidPageStateVariableLog.NamedParameters
      ): string =>
          "Invalid page state variable has been specified for the markup file " +
          `'${ namedParameters.targetMarkupFileRelativePath }'. It must be the object while actually has type ` +
          `'${ namedParameters.actualType }' and value: ${ namedParameters.actualStringifiedValue }`
};


export default MarkupProcessingRawSettingsNormalizerLocalization__English;
