import type MarkupProcessingRawSettingsNormalizer from
    "@MarkupProcessing/RawSettingsNormalizer/MarkupProcessingRawSettingsNormalizer";


const markupProcessingRawSettingsNormalizerLocalization__english: MarkupProcessingRawSettingsNormalizer.Localization = {

  noNeedToSetResourcesReferencesResolvingToRelativePathsOnStaticPreviewModeLog: {
    title: "Redundant configuration detected",
    description: "For the static preview mode, the resources references could be resolved only to relative paths. " +
        "You can safely remove \"projectBuilding.markupProcessing.common.buildingModeDependent." +
        "STATIC_PREVIEW.mustResolveResourceReferencesToRelativePaths\" specifying from the configuration."
  },

  generateUnableToResolveResourcesReferencesToAbsolutePathLog:
      (
        {
          consumingProjectBuildingMode
        }: MarkupProcessingRawSettingsNormalizer.Localization.UnableToResolveResourcesReferencesToAbsolutePathLog.
            TemplateVariables
      ): MarkupProcessingRawSettingsNormalizer.Localization.UnableToResolveResourcesReferencesToAbsolutePathLog =>
          ({
            title: "Unable to resolve the resources references to absolute paths",
            description: "The public directory (\"projectBuilding.commonSettings.publicDirectoriesRelativePaths." +
                "[PROJECT_BUILDING_MODE]\") that requires for resolving of resources references to absolute " +
                `paths has not been specified for the "${ consumingProjectBuildingMode }" building mode. ` +
                "The resources references will be resolved to relative paths instead. " +
                "If you wish these references be resolved to relative path, set \"projectBuilding.markupProcessing.common." +
                "buildingModeDependent.[PROJECT_BUILDING_MODE].mustResolveResourceReferencesToRelativePaths\" " +
                `to true for the "${ consumingProjectBuildingMode }" building mode.`
          }),

  generateStaticPreviewStateDependentPagesVariationsSpecificationFileReadingFailedMessage:
      (
        templateVariables: MarkupProcessingRawSettingsNormalizer.Localization.
            StaticPreviewStateDependentPagesVariationsSpecificationFileReadingFailedLog.TemplateVariables
      ): string => "Failed to read the static preview state dependent pages variations specification file at " +
          `'${ templateVariables.staticPreviewStateDependentPagesVariationsSpecificationFileAbsolutePath }'.`,

  generateStaticPreviewStateDependentPagesVariationsSpecificationIsNotTheObjectErrorLog:
      (
        templateVariables: MarkupProcessingRawSettingsNormalizer.Localization.
            StaticPreviewStateDependentPagesVariationsSpecificationIsInvalidLog.TemplateVariables
      ): MarkupProcessingRawSettingsNormalizer.Localization.StaticPreviewStateDependentPagesVariationsSpecificationIsInvalidLog =>
          ({
            technicalDetails: "The parsed YAML from static preview state dependent pages variations specification file " +
                "'[ ProjectDirectory ]" +
                `${ templateVariables.staticPreviewStateDependentPagesVariationsSpecificationFileRelativePath }'` +
                `is not an ECMAScript 'object' and actually has type '${ templateVariables.rawDataActualType }' and value:` +
                `${ templateVariables.stringifiedRawData }\n This data will be ignored.`,
            politeExplanation: "Reading and parsing of static preview state dependent pages variations specification file, " +
                "we are expected it will has the object type as parsed YAML, the superset of JSON. Contrary to expectations, " +
                `it has the '${ templateVariables.stringifiedRawData }' type. We need to investigate it. ` +
                "We will keep the YDA running however we are sorry, but currently we are unable to inject above data " +
                "to Pug files."
          }),

  generateInvalidValueOfStaticPreviewStateDependentPagesVariationsSpecificationAssociativeArrayMessage:
      (
        templateVariables: MarkupProcessingRawSettingsNormalizer.Localization.
            InvalidValueOfStaticPreviewStateDependentPagesVariationsSpecificationAssociativeArrayLog.TemplateVariables
      ): string =>
          "The static preview state dependent pages variations specification file " +
          templateVariables.staticPreviewStateDependentPagesVariationsSpecificationFileRelativePath +
          "is including the associative array with invalid value. The value respective to key " +
          `'${ templateVariables.invalidEntryKey }' must be the object with 'stateObjectTypeVariableName' and 'variations' ` +
          `properties while actually has type ${ templateVariables.invalidEntryValueType } ` +
          `and value ${ templateVariables.invalidEntryStringifiedValue }`,

  generateInvalidPageStateVariableNameMessage:
      (
        templateVariables: MarkupProcessingRawSettingsNormalizer.Localization.InvalidPageStateVariableNameLog.TemplateVariables
      ): string =>
          "Invalid page state variable name ('stateObjectTypeVariableName') has been specified for the markup file " +
          `'${ templateVariables.targetMarkupFileRelativePath }' in static preview state dependent pages variations ` +
          "specification file. This variable name must the non-empty string while actually has type " +
          `'${ templateVariables.specifiedTypeOfVariableNameProperty }' and value:\n ` +
          templateVariables.stringifiedValueOfSpecifiedVariableNameProperty,

  generateInvalidPageStateDependentVariationsSpecificationMessage:
      (
        templateVariables: MarkupProcessingRawSettingsNormalizer.Localization.
            InvalidPageStateDependentVariationsSpecificationLog.TemplateVariables
      ): string =>
          "Invalid state dependent page variations has been specified for the markup file " +
          `'${ templateVariables.targetMarkupFileRelativePath }'. It must be the associative array like object while ` +
          `actually has type '${ templateVariables.actualType }' and value: ${ templateVariables.actualStringifiedValue }`,

  generateInvalidPageStateVariableMessage:
      (
        templateVariables: MarkupProcessingRawSettingsNormalizer.Localization.InvalidPageStateVariableLog.TemplateVariables
      ): string =>
          "Invalid page state variable has been specified for the markup file " +
          `'${ templateVariables.targetMarkupFileRelativePath }'. It must be the object while actually has type ` +
          `'${ templateVariables.actualType }' and value: ${ templateVariables.actualStringifiedValue }`

};


export default markupProcessingRawSettingsNormalizerLocalization__english;
