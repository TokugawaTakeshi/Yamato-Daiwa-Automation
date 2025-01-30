/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import MarkupProcessingRestrictions from "@MarkupProcessing/MarkupProcessingRestrictions";
import ConsumingProjectBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";

/* ─── Default Settings ───────────────────────────────────────────────────────────────────────────────────────────── */
import MarkupProcessingSettings__Default from "@MarkupProcessing/MarkupProcessingSettings__Default";

/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import type MarkupProcessingSettings__FromFile__RawValid from
    "@MarkupProcessing/MarkupProcessingSettings__FromFile__RawValid";

/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type MarkupProcessingSettings__Normalized from "@MarkupProcessing/MarkupProcessingSettings__Normalized";
import type SourceCodeProcessingGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/SourceCodeProcessingGenericProperties__Normalized";
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";

/* ─── Settings Normalizers ───────────────────────────────────────────────────────────────────────────────────────── */
import SourceCodeProcessingRawSettingsNormalizer from
    "@ProjectBuilding/Common/RawSettingsNormalizers/SourceCodeProcessingRawSettingsNormalizer";
import RoutingSettingsNormalizer from "@MarkupProcessing/RawSettingsNormalizer/RoutingSettingsNormalizer";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import {
  appendLastFileNameExtension,
  removeAllFileNameExtensions,
  stringifyAndFormatArbitraryValue,
  removeMultipleElementsFromSetByPredicate,
  isArbitraryObject,
  isNonEmptyString,
  isUndefined,
  isNotUndefined,
  Logger,
  FileReadingFailedError,
  InvalidExternalDataError,
  PoliteErrorsMessagesBuilder
} from "@yamato-daiwa/es-extensions";
import type { ArbitraryObject, WarningLog } from "@yamato-daiwa/es-extensions";
import isSubdirectory from "@UtilsIncubator/NodeJS/isSubdirectory";
import { ObjectDataFilesProcessor, ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";

/* ─── Localization ───────────────────────────────────────────────────────────────────────────────────────────────── */
import markupProcessingRawSettingsNormalizerLocalization__english from
    "./MarkupProcessingRawSettingsNormalizerLocalization.english";


class MarkupProcessingRawSettingsNormalizer extends SourceCodeProcessingRawSettingsNormalizer {

  public static localization: MarkupProcessingRawSettingsNormalizer.Localization =
      markupProcessingRawSettingsNormalizerLocalization__english;


  protected supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: ReadonlyArray<string> =
      MarkupProcessingRestrictions.supportedSourceFilesNamesExtensionsWithoutLeadingDots;


  private readonly markupProcessingSettings__fromFile__rawValid: MarkupProcessingSettings__FromFile__RawValid;

  private readonly unusedCommonlyExcludedFromLocalizationEntryPointsSourceFilesAbsolutePaths: Set<string>;

  private commonStringResources?: ArbitraryObject;


  public static normalize(
    {
      markupProcessingSettings__fromFile__rawValid,
      commonSettings__normalized
    }: Readonly<{
      markupProcessingSettings__fromFile__rawValid: MarkupProcessingSettings__FromFile__RawValid;
      commonSettings__normalized: ProjectBuildingCommonSettings__Normalized;
    }>
  ): MarkupProcessingSettings__Normalized {

    const dataHoldingSelfInstance: MarkupProcessingRawSettingsNormalizer =
        new MarkupProcessingRawSettingsNormalizer({
          projectBuildingCommonSettings__normalized: commonSettings__normalized,
          ...isNotUndefined(commonSettings__normalized.tasksAndSourceFilesSelection) ? {
            entryPointsGroupsIDsSelection: commonSettings__normalized.tasksAndSourceFilesSelection.markupProcessing
          } : null,
          markupProcessingSettings__fromFile__rawValid
        });

    return {

      common: {

        supportedSourceFileNameExtensionsWithoutLeadingDots:
            MarkupProcessingRestrictions.supportedSourceFilesNamesExtensionsWithoutLeadingDots,

        supportedOutputFileNameExtensionsWithoutLeadingDots:
            MarkupProcessingRestrictions.supportedOutputFilesNamesExtensionsWithoutLeadingDots,

        mustResolveResourcesReferencesToAbsolutePath: dataHoldingSelfInstance.
            computeMustResolveResourcesReferencesToAbsolutePathPropertyValue(),

        secondsBetweenFileUpdatingAndStartingOfRebuilding:
            dataHoldingSelfInstance.markupProcessingSettings__fromFile__rawValid.
                common?.
                buildingModeDependent?.
                [dataHoldingSelfInstance.consumingProjectBuildingMode]?.
                secondsBetweenFileUpdatingAndStartingOfRebuilding ??
            MarkupProcessingSettings__Default.periodBetweenFileUpdatingAndRebuildingStarting__seconds

      },

      linting: dataHoldingSelfInstance.normalizeLintingSettings(),

      ...isNotUndefined(markupProcessingSettings__fromFile__rawValid.importingFromTypeScript) ?
          {
            importingFromTypeScript: dataHoldingSelfInstance.
                normalizeImportingFromTypeScriptSettings(markupProcessingSettings__fromFile__rawValid.importingFromTypeScript)
          } : null,

      ...isNotUndefined(markupProcessingSettings__fromFile__rawValid.importingFromJavaScript) ?
          {
            importingFromJavaScript: dataHoldingSelfInstance.
                normalizeImportingFromJavaScriptSettings(markupProcessingSettings__fromFile__rawValid.importingFromJavaScript)
          } : null,

      staticPreview: {
        pagesVariations: dataHoldingSelfInstance.normalizeStaticPreviewPagesVariationsSettings(),
        importsFromStaticDataFiles: dataHoldingSelfInstance.normalizeImportsFromStaticDataFiles()
      },

      ...isNotUndefined(markupProcessingSettings__fromFile__rawValid.routing) ? {
        routing: {
          variable: markupProcessingSettings__fromFile__rawValid.routing.variable,
          routes: RoutingSettingsNormalizer.normalize({
            routingSettings__fromFile__rawValid: markupProcessingSettings__fromFile__rawValid.routing,
            projectRootDirectoryAbsolutePath: commonSettings__normalized.projectRootDirectoryAbsolutePath,
            absolutePathsOfSectioningToCache: new Set<string>()
          })
        }
      } : null,

      relevantEntryPointsGroups:
          dataHoldingSelfInstance.createNormalizedEntryPointsGroupsSettings(
            markupProcessingSettings__fromFile__rawValid.entryPointsGroups,
            dataHoldingSelfInstance.
                completeEntryPointsGroupNormalizedSettingsCommonPropertiesUntilMarkupEntryPointsGroupNormalizedSettings.
                bind(dataHoldingSelfInstance)
          ),

      logging: dataHoldingSelfInstance.normalizeLoggingSettings()

    };

  }


  private constructor(
    constructorParameter:
        SourceCodeProcessingRawSettingsNormalizer.ConstructorParameter &
        Readonly<{ markupProcessingSettings__fromFile__rawValid: MarkupProcessingSettings__FromFile__RawValid; }>
  ) {

    super(constructorParameter);

    this.markupProcessingSettings__fromFile__rawValid = constructorParameter.markupProcessingSettings__fromFile__rawValid;

    this.unusedCommonlyExcludedFromLocalizationEntryPointsSourceFilesAbsolutePaths = new Set(
      (
        this.markupProcessingSettings__fromFile__rawValid.
            common?.
            localization?.
            excludedFilesPathsRelativeRelativeToProjectRootDirectory ??
        []
      ).map(
        (excludedFilePathRelativeRelativeToProjectRootDirectory: string): string =>
            ImprovedPath.joinPathSegments(
              [
                constructorParameter.projectBuildingCommonSettings__normalized.projectRootDirectoryAbsolutePath,
                excludedFilePathRelativeRelativeToProjectRootDirectory
              ],
              { alwaysForwardSlashSeparators: true }
            )
      )
    );

  }


  private computeMustResolveResourcesReferencesToAbsolutePathPropertyValue(): boolean {

    const explicitlySpecifiedMustResolveResourceReferencesToRelativePathsPropertyValue: boolean | undefined =
        this.markupProcessingSettings__fromFile__rawValid.common?.
            buildingModeDependent?.[this.consumingProjectBuildingMode]?.
            mustResolveResourcesPointersToRelativePaths;

    if (this.consumingProjectBuildingMode === ConsumingProjectBuildingModes.staticPreview) {

      if (explicitlySpecifiedMustResolveResourceReferencesToRelativePathsPropertyValue === false) {
        Logger.logWarning(
          MarkupProcessingRawSettingsNormalizer.localization.
              noNeedToSetResourcesReferencesResolvingToRelativePathsOnStaticPreviewModeLog
        );
      }

      return false;

    }


    if (isUndefined(explicitlySpecifiedMustResolveResourceReferencesToRelativePathsPropertyValue)) {

      if (isUndefined(this.actualPublicDirectoryAbsolutePath)) {

        Logger.logWarning(
          MarkupProcessingRawSettingsNormalizer.localization.generateUnableToResolveResourcesReferencesToAbsolutePathLog({
            consumingProjectBuildingMode: this.consumingProjectBuildingMode
          })
        );

        return false;

      }


      return true;

    }


    return !explicitlySpecifiedMustResolveResourceReferencesToRelativePathsPropertyValue;

  }

  private normalizeLintingSettings(): MarkupProcessingSettings__Normalized.Linting {

    return isNotUndefined(this.markupProcessingSettings__fromFile__rawValid.linting) ?
        {

          mustExecute: this.markupProcessingSettings__fromFile__rawValid.linting.enable ??
              MarkupProcessingSettings__Default.linting.mustExecute,

          ...isNotUndefined(this.markupProcessingSettings__fromFile__rawValid.linting.presetFileRelativePath) ? {
            presetFileAbsolutePath: ImprovedPath.joinPathSegments(
              [
                this.consumingProjectRootDirectoryAbsolutePath,
                this.markupProcessingSettings__fromFile__rawValid.linting.presetFileRelativePath
              ],
              { alwaysForwardSlashSeparators: true }
            )
          } : null
        } :
        { mustExecute: MarkupProcessingSettings__Default.linting.mustExecute };

  }

  private normalizeImportingFromTypeScriptSettings(
    importingFromTypeScriptSettings__fromFile__rawValid: MarkupProcessingSettings__FromFile__RawValid.ImportingFromTypeScript
  ): MarkupProcessingSettings__Normalized.ImportingFromTypeScript {

    const sourceFileAbsolutePath: string = ImprovedPath.joinPathSegments(
      [
        this.consumingProjectRootDirectoryAbsolutePath,
        importingFromTypeScriptSettings__fromFile__rawValid.sourceFileRelativePath
      ],
      { alwaysForwardSlashSeparators: true }
    );

    return {
      typeScriptConfigurationFileAbsolutePath:
          ImprovedPath.joinPathSegments(
            [
              this.consumingProjectRootDirectoryAbsolutePath,
              isNotUndefined(importingFromTypeScriptSettings__fromFile__rawValid.typeScriptConfigurationFileRelativePath) ?
                  appendLastFileNameExtension({
                    targetPath: importingFromTypeScriptSettings__fromFile__rawValid.typeScriptConfigurationFileRelativePath,
                    targetFileNameExtensionWithOrWithoutLeadingDot: "json",
                    mustAppendDuplicateEvenIfTargetLastFileNameExtensionAlreadyPresentsAtSpecifiedPath: false
                  }) :
                  MarkupProcessingSettings__Default.staticPreview.typeScriptConfigurationFileRelativePath
            ],
            { alwaysForwardSlashSeparators: true }
          ),
      sourceFileAbsolutePath,
      importedNamespace: importingFromTypeScriptSettings__fromFile__rawValid.importedNamespace
    };

  }

  private normalizeImportingFromJavaScriptSettings(
    experimental1Settings__fromFile__rawValid: MarkupProcessingSettings__FromFile__RawValid.ImportingFromJavaScript
  ): MarkupProcessingSettings__Normalized.ImportingFromJavaScript {
    return {
      sourceFileAbsolutePath: ImprovedPath.joinPathSegments(
        [
          this.consumingProjectRootDirectoryAbsolutePath,
          experimental1Settings__fromFile__rawValid.sourceFileRelativePath
        ],
        { alwaysForwardSlashSeparators: true }
      ),
      nameOfGlobalConstantForStoringOfImports: experimental1Settings__fromFile__rawValid.nameOfGlobalConstantForStoringOfImports
    };
  }

  private normalizeStaticPreviewPagesVariationsSettings(): MarkupProcessingSettings__Normalized.StaticPreview.PagesVariations
  /* eslint-disable-next-line @stylistic/brace-style -- In this case, the Allman style more readable. */
  {

    const stateDependentPagesVariationsSettings:
        MarkupProcessingSettings__FromFile__RawValid.StaticPreview.StateDependentPageVariations | undefined =
            this.markupProcessingSettings__fromFile__rawValid.staticPreview?.stateDependentPagesVariations;

    const stateDependentPagesVariationsMetadata: MarkupProcessingSettings__Normalized.StaticPreview.PagesVariations.
        StateDependent = new Map();

    if (
      isUndefined(stateDependentPagesVariationsSettings) ||
      this.consumingProjectBuildingMode !== ConsumingProjectBuildingModes.staticPreview
    ) {
      return { stateDependent: stateDependentPagesVariationsMetadata };
    }


    const variationsByStatesSpecificationFileAbsolutePath: string = ImprovedPath.joinPathSegments(
      [
        this.consumingProjectRootDirectoryAbsolutePath,
        stateDependentPagesVariationsSettings.specificationFileRelativePath
      ],
      { alwaysForwardSlashSeparators: true }
    );

    /* [ Approach ] Currently, the `RawObjectDataProcessor` thus `ObjectDataFilesProcessor` are ignoring and not keep
     *      the data which validation rules has not been specified. In this case, the state dependent object is
     *      such data. */
    let rawPagesStateDependentVariationsSpecification: unknown;

    try {

      rawPagesStateDependentVariationsSpecification = ObjectDataFilesProcessor.processFile({
        filePath: variationsByStatesSpecificationFileAbsolutePath,
        schema: ObjectDataFilesProcessor.SupportedSchemas.YAML,
        synchronously: true
      });

    } catch (error: unknown) {

      Logger.throwErrorAndLog({
        errorInstance: new FileReadingFailedError({
          customMessage: MarkupProcessingRawSettingsNormalizer.localization.
              generateStaticPreviewStateDependentPagesVariationsSpecificationFileReadingFailedMessage({
                staticPreviewStateDependentPagesVariationsSpecificationFileAbsolutePath:
                variationsByStatesSpecificationFileAbsolutePath
              })
        }),
        title: FileReadingFailedError.localization.defaultTitle,
        occurrenceLocation: "MarkupProcessingRawSettingsNormalizer." +
            "normalizeStaticPreviewPagesVariationsSettings()",
        innerError: error
      });

    }

    if (!isArbitraryObject(rawPagesStateDependentVariationsSpecification)) {

      Logger.logError({
        errorType: InvalidExternalDataError.NAME,
        title: InvalidExternalDataError.localization.defaultTitle,
        description: PoliteErrorsMessagesBuilder.buildMessage(
            MarkupProcessingRawSettingsNormalizer.localization.
            generateStaticPreviewStateDependentPagesVariationsSpecificationIsNotTheObjectErrorLog({
              staticPreviewStateDependentPagesVariationsSpecificationFileRelativePath:
                  variationsByStatesSpecificationFileAbsolutePath,
              stringifiedRawData: stringifyAndFormatArbitraryValue(rawPagesStateDependentVariationsSpecification),
              rawDataActualType: typeof rawPagesStateDependentVariationsSpecification
            })
        ),
        occurrenceLocation: "MarkupProcessingRawSettingsNormalizer." +
            "normalizeStaticPreviewPagesVariationsSettings()"
      });

      return {
        stateDependent: stateDependentPagesVariationsMetadata
      };

    }


    for (
      const [ markupEntryPointSourceFileRelativePath__possiblyWithoutExtension, stateDependentPageVariationsData ] of
          Object.entries(rawPagesStateDependentVariationsSpecification)
    ) {

      const markupEntryPointSourceFileRelativePath: string = appendLastFileNameExtension({
        targetPath: markupEntryPointSourceFileRelativePath__possiblyWithoutExtension,
        targetFileNameExtensionWithOrWithoutLeadingDot: "pug",
        mustAppendDuplicateEvenIfTargetLastFileNameExtensionAlreadyPresentsAtSpecifiedPath: false
      });

      if (!isArbitraryObject(stateDependentPageVariationsData)) {
        Logger.throwErrorAndLog({
          errorInstance: new InvalidExternalDataError({
            customMessage: MarkupProcessingRawSettingsNormalizer.localization.
              generateInvalidValueOfStaticPreviewStateDependentPagesVariationsSpecificationAssociativeArrayMessage({
                staticPreviewStateDependentPagesVariationsSpecificationFileRelativePath:
                    stateDependentPagesVariationsSettings.specificationFileRelativePath,
                invalidEntryKey: markupEntryPointSourceFileRelativePath,
                invalidEntryValueType: typeof stateDependentPageVariationsData,
                invalidEntryStringifiedValue: stringifyAndFormatArbitraryValue(stateDependentPageVariationsData)
              })
          }),
          title: InvalidExternalDataError.localization.defaultTitle,
          occurrenceLocation: "MarkupProcessingRawSettingsNormalizer." +
              "normalizeStaticPreviewPagesVariationsSettings()"
        });
      }


      if (!isNonEmptyString(stateDependentPageVariationsData.$stateObjectTypeVariableName)) {
        Logger.throwErrorAndLog({
          errorInstance: new InvalidExternalDataError({
            customMessage: MarkupProcessingRawSettingsNormalizer.localization.generateInvalidPageStateVariableNameMessage({
              targetMarkupFileRelativePath: markupEntryPointSourceFileRelativePath,
              stringifiedValueOfSpecifiedVariableNameProperty:
                  stringifyAndFormatArbitraryValue(stateDependentPageVariationsData.$stateObjectTypeVariableName),
              specifiedTypeOfVariableNameProperty: typeof stateDependentPageVariationsData.$stateObjectTypeVariableName
            })
          }),
          title: InvalidExternalDataError.localization.defaultTitle,
          occurrenceLocation: "MarkupProcessingRawSettingsNormalizer." +
              "normalizeStaticPreviewPagesVariationsSettings()"
        });
      }


      if (!isArbitraryObject(stateDependentPageVariationsData.$stateDependentVariations)) {
        Logger.throwErrorAndLog({
          errorInstance: new InvalidExternalDataError({
            customMessage: MarkupProcessingRawSettingsNormalizer.localization.
            generateInvalidPageStateDependentVariationsSpecificationMessage({
              targetMarkupFileRelativePath: markupEntryPointSourceFileRelativePath,
              actualType: typeof stateDependentPageVariationsData.$stateDependentVariations,
              actualStringifiedValue:
                  stringifyAndFormatArbitraryValue(stateDependentPageVariationsData.$stateDependentVariations)
            })
          }),
          title: InvalidExternalDataError.localization.defaultTitle,
          occurrenceLocation: "MarkupProcessingRawSettingsNormalizer." +
              "normalizeStaticPreviewPagesVariationsSettings()"
        });
      }

      const markupSourceFileFileAbsolutePath: string = ImprovedPath.joinPathSegments(
        [ this.consumingProjectRootDirectoryAbsolutePath, markupEntryPointSourceFileRelativePath ],
        { alwaysForwardSlashSeparators: true }
      );

      const derivedPagesAndStatesMap: Map<
        MarkupProcessingSettings__Normalized.StaticPreview.PagesVariations.StateDependent.DerivedFileAbsolutePath,
        ArbitraryObject
      > = new Map();

      for (
        const [ fineNamePostfix, stateData ] of
            Object.entries(stateDependentPageVariationsData.$stateDependentVariations)
      ) {

        const derivedFileAbsolutePath: string =
            `${ removeAllFileNameExtensions(markupSourceFileFileAbsolutePath) }${ fineNamePostfix }.pug`;

        if (!isArbitraryObject(stateData)) {
          Logger.throwErrorAndLog({
            errorInstance: new InvalidExternalDataError({
              customMessage: MarkupProcessingRawSettingsNormalizer.localization.generateInvalidPageStateVariableMessage({
                targetMarkupFileRelativePath: markupEntryPointSourceFileRelativePath,
                actualStringifiedValue: stringifyAndFormatArbitraryValue(stateData),
                actualType: typeof stateData
              })
            }),
            title: InvalidExternalDataError.localization.defaultTitle,
            occurrenceLocation: "MarkupProcessingRawSettingsNormalizer." +
                "normalizeStaticPreviewPagesVariationsSettings()"
          });
        }

        derivedPagesAndStatesMap.set(derivedFileAbsolutePath, stateData);

      }

      stateDependentPagesVariationsMetadata.set(
        ImprovedPath.joinPathSegments(
          [ this.consumingProjectRootDirectoryAbsolutePath, markupEntryPointSourceFileRelativePath ],
          { alwaysForwardSlashSeparators: true }
        ),
        {
          stateVariableName: stateDependentPageVariationsData.$stateObjectTypeVariableName,
          derivedPagesAndStatesMap
        }
      );

    }


    return {
      stateDependent: stateDependentPagesVariationsMetadata
    };

  }

  private normalizeImportsFromStaticDataFiles(): MarkupProcessingSettings__Normalized.StaticPreview.ImportsFromStaticDataFiles {

    const importsFromStaticDataFiles: { [variableName: string]: unknown; } = {};

    for (
      const importFromStaticDataFile of
          this.markupProcessingSettings__fromFile__rawValid.staticPreview?.importsFromStaticDataFiles ?? []
    ) {

      let importedData: unknown;

      try {

        importedData = ObjectDataFilesProcessor.processFile({
          filePath: ImprovedPath.joinPathSegments([
            this.consumingProjectRootDirectoryAbsolutePath, importFromStaticDataFile.fileRelativePath
          ]),
          synchronously: true
        });

      } catch (error: unknown) {

        Logger.throwErrorAndLog({
          errorInstance: new FileReadingFailedError({
            filePath: importFromStaticDataFile.fileRelativePath
          }),
          title: FileReadingFailedError.localization.defaultTitle,
          occurrenceLocation: "markupProcessingRawSettingsNormalizer.normalizeImportsFromStaticDataFiles()",
          innerError: error
        });

      }

      importsFromStaticDataFiles[importFromStaticDataFile.importedVariableName] = importedData;

    }

    return importsFromStaticDataFiles;

  }

  private completeEntryPointsGroupNormalizedSettingsCommonPropertiesUntilMarkupEntryPointsGroupNormalizedSettings(
    entryPointsGroupGenericSettings__normalized: SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup,
    entryPointsGroupSettings__rawValid: MarkupProcessingSettings__FromFile__RawValid.EntryPointsGroup
  ): MarkupProcessingSettings__Normalized.EntryPointsGroup {

    const settingsActualForCurrentProjectBuildingMode: MarkupProcessingSettings__FromFile__RawValid.
        EntryPointsGroup.BuildingModeDependent =
            entryPointsGroupSettings__rawValid.buildingModeDependent[this.consumingProjectBuildingMode];

    const outputFormat: MarkupProcessingRestrictions.OutputFormats =
        entryPointsGroupSettings__rawValid.outputFormat ??
        MarkupProcessingSettings__Default.outputFormat;

    return {

      ...entryPointsGroupGenericSettings__normalized,

      outputFormat,

      localization: this.normalizeEntryPointsGroupLocalizationsSettings(
        entryPointsGroupGenericSettings__normalized.sourceFilesTopDirectoryAbsolutePath,
        entryPointsGroupSettings__rawValid.localization
      ),

      HTML_Validation: {

        mustExecute: entryPointsGroupSettings__rawValid.HTML_Validation?.disable === true ? false :
            MarkupProcessingSettings__Default.HTML_Validation.mustExecute,

        ignoring: {
          filesAbsolutePaths: (entryPointsGroupSettings__rawValid.HTML_Validation?.ignoring?.files ?? []).
              map(
                (fileRelativePath: string): string => ImprovedPath.joinPathSegments(
                  [
                    this.consumingProjectRootDirectoryAbsolutePath,
                    fileRelativePath
                  ],
                  { alwaysForwardSlashSeparators: true }
                )
              ),
          directoriesAbsolutePaths: (entryPointsGroupSettings__rawValid.HTML_Validation?.ignoring?.directories ?? []).
              map(
                (directoryRelativePath: string): string => ImprovedPath.joinPathSegments(
                  [
                    this.consumingProjectRootDirectoryAbsolutePath,
                    directoryRelativePath
                  ],
                  { alwaysForwardSlashSeparators: true }
                )
              )
        }

      },

      accessibilityInspection: {

        mustExecute: entryPointsGroupSettings__rawValid.accessibilityInspection?.disable === true ? false :
            MarkupProcessingSettings__Default.accessibilityInspection.mustExecute,

        standard: entryPointsGroupSettings__rawValid.accessibilityInspection?.standard ??
            MarkupProcessingSettings__Default.accessibilityInspection.standard,

        ignoring: {
          filesAbsolutePaths: (entryPointsGroupSettings__rawValid.HTML_Validation?.ignoring?.files ?? []).
              map(
                (fileRelativePath: string): string => ImprovedPath.joinPathSegments(
                  [
                    this.consumingProjectRootDirectoryAbsolutePath,
                    fileRelativePath
                  ],
                  { alwaysForwardSlashSeparators: true }
                )
              ),
          directoriesAbsolutePaths: (entryPointsGroupSettings__rawValid.HTML_Validation?.ignoring?.directories ?? []).
              map(
                (directoryRelativePath: string): string => ImprovedPath.joinPathSegments(
                  [
                    this.consumingProjectRootDirectoryAbsolutePath,
                    directoryRelativePath
                  ],
                  { alwaysForwardSlashSeparators: true }
                )
              )
        }

      },

      outputCodeFormatting: {
        mustExecute: settingsActualForCurrentProjectBuildingMode.outputCodeFormatting?.enable === true ?
            true :
            MarkupProcessingSettings__Default.outputCodeFormatting.mustExecute({
              consumingProjectBuildingMode: this.consumingProjectBuildingMode,
              outputFormat
            }),
        indentationString:
            settingsActualForCurrentProjectBuildingMode.outputCodeFormatting?.indentationString ??
            MarkupProcessingSettings__Default.outputCodeFormatting.indentationString,
        lineSeparators:
            settingsActualForCurrentProjectBuildingMode.outputCodeFormatting?.lineSeparators ??
            MarkupProcessingSettings__Default.outputCodeFormatting.lineSeparators,
        mustGuaranteeTrailingEmptyLine:
            settingsActualForCurrentProjectBuildingMode.outputCodeFormatting?.mustGuaranteeTrailingEmptyLine ??
            MarkupProcessingSettings__Default.outputCodeFormatting.mustGuaranteeTrailingEmptyLine,
        mustIndentHeadAndBodyTags:
            settingsActualForCurrentProjectBuildingMode.outputCodeFormatting?.mustIndentHeadAndBodyTags ??
            MarkupProcessingSettings__Default.outputCodeFormatting.mustIndentHeadAndBodyTags
      },

      outputCodeMinifying: {
        mustExecute: settingsActualForCurrentProjectBuildingMode.outputCodeMinifying?.enable === true ?
            true :
            MarkupProcessingSettings__Default.outputCodeMinifying.mustExecute({
              consumingProjectBuildingMode: this.consumingProjectBuildingMode,
              outputFormat
            }),
        attributesExtraWhitespacesCollapsing:
            settingsActualForCurrentProjectBuildingMode.outputCodeMinifying?.attributesExtraWhitespacesCollapsing ??
            MarkupProcessingSettings__Default.outputCodeMinifying.attributesExtraWhitespacesCollapsing,
        attributesValuesDeduplication:
            settingsActualForCurrentProjectBuildingMode.outputCodeMinifying?.attributesValuesDeduplication ??
            MarkupProcessingSettings__Default.outputCodeMinifying.attributesValuesDeduplication,
        commentsRemoving:
            settingsActualForCurrentProjectBuildingMode.outputCodeMinifying?.commentsRemoving ??
            MarkupProcessingSettings__Default.outputCodeMinifying.commentsRemoving
      }

    };

  }

  private normalizeEntryPointsGroupLocalizationsSettings(
    sourceFilesTopDirectoryAbsolutePath: string,
    entryPointGroupLocalizationSettings__rawValid?: MarkupProcessingSettings__FromFile__RawValid.EntryPointsGroup.Localization
  ): MarkupProcessingSettings__Normalized.EntryPointsGroup.Localization {

    const localizedStringResourcesConstantName: string | undefined =
        entryPointGroupLocalizationSettings__rawValid?.localizedStringResourcesConstantName ??
        this.markupProcessingSettings__fromFile__rawValid.common?.localization?.localizedStringResourcesConstantName;

    const localeConstantName: string | undefined =
        entryPointGroupLocalizationSettings__rawValid?.localeConstantName ??
        this.markupProcessingSettings__fromFile__rawValid.common?.localization?.localeConstantName;

    const nameOfConstantForInterpolationToLangHTML_Attribute: string | undefined =
        entryPointGroupLocalizationSettings__rawValid?.nameOfConstantForInterpolationToLangHTML_Attribute ??
        this.markupProcessingSettings__fromFile__rawValid.common?.localization?.
            nameOfConstantForInterpolationToLangHTML_Attribute;

    if (
      isUndefined(this.commonStringResources) &&
          isNotUndefined(this.markupProcessingSettings__fromFile__rawValid.common?.localization?.stringResourcesFileRelativePath)
    ) {
      this.commonStringResources = this.getStringResourcesFromFile(
        this.markupProcessingSettings__fromFile__rawValid.common.localization.stringResourcesFileRelativePath
      );
    }

    const entryPointGroupStringResources: ArbitraryObject | undefined =
        isNotUndefined(entryPointGroupLocalizationSettings__rawValid?.stringResourcesFileRelativePath) ?
            this.getStringResourcesFromFile(entryPointGroupLocalizationSettings__rawValid.stringResourcesFileRelativePath) :
            this.commonStringResources;

    const locales: Map<
      MarkupProcessingSettings__Normalized.EntryPointsGroup.Localization.LocaleKey,
      MarkupProcessingSettings__Normalized.EntryPointsGroup.Localization.LocaleData
    > = new Map();

    for (
      const [
        localeKey,
        {
          outputFileInterimNameExtensionWithoutDot,
          localeConstantValue,
          keyInLocalizedStringResourcesObject,
          valueOfConstantForInterpolationToLangHTML_Attribute
        }
      ] of Object.entries(this.markupProcessingSettings__fromFile__rawValid.common?.localization?.locales ?? {})
    ) {
      locales.set(
        localeKey,
        {
          outputFileInterimNameExtensionWithoutDot,
          ...isNotUndefined(entryPointGroupStringResources) && isNotUndefined(keyInLocalizedStringResourcesObject) ? {
            stringResources: entryPointGroupStringResources[keyInLocalizedStringResourcesObject]
          } : null,
          ...isNotUndefined(localeConstantValue) ? { localeConstantValue } : null,
          ...isNotUndefined(valueOfConstantForInterpolationToLangHTML_Attribute) ?
              { valueOfConstantForInterpolationToLangHTML_Attribute } : null
        }
      );
    }

    for (
      const [
        localeKey,
        {
          outputFileInterimNameExtensionWithoutDot,
          localeConstantValue,
          keyInLocalizedStringResourcesObject,
          valueOfConstantForInterpolationToLangHTML_Attribute
        }
      ] of Object.entries(entryPointGroupLocalizationSettings__rawValid?.locales ?? {})) {

      const normalizedLocaleToOverride:
          MarkupProcessingSettings__Normalized.EntryPointsGroup.Localization.LocaleData | undefined =
              locales.get(localeKey);

      locales.set(
        localeKey,
        {
          ...normalizedLocaleToOverride ?? null,
          outputFileInterimNameExtensionWithoutDot,
          ...isNotUndefined(entryPointGroupStringResources) && isNotUndefined(keyInLocalizedStringResourcesObject) ? {
            stringResources: entryPointGroupStringResources[keyInLocalizedStringResourcesObject]
          } : null,
          ...isNotUndefined(localeConstantValue) ? { localeConstantValue } : null,
          ...isNotUndefined(valueOfConstantForInterpolationToLangHTML_Attribute) ?
              { valueOfConstantForInterpolationToLangHTML_Attribute } : null

        }
      );

    }

    return {

      ...isNotUndefined(localizedStringResourcesConstantName) ? { localizedStringResourcesConstantName } : null,

      ...isNotUndefined(localeConstantName) ? { localeConstantName } : null,

      ...isNotUndefined(nameOfConstantForInterpolationToLangHTML_Attribute) ?
          { nameOfConstantForInterpolationToLangHTML_Attribute } : null,

      locales,

      excludedFilesAbsolutePaths:
          (
            entryPointGroupLocalizationSettings__rawValid?.
            excludedFilesPathsRelativeToSourcesFilesTopDirectory?.
            map(
              (excludedFilePathRelativeRelativeToSourcesFileTopDirectory: string): string => ImprovedPath.joinPathSegments(
                [ sourceFilesTopDirectoryAbsolutePath, excludedFilePathRelativeRelativeToSourcesFileTopDirectory ],
                { alwaysForwardSlashSeparators: true }
              )
            ) ??
            []
          ).

            concat(
              Array.from(
                removeMultipleElementsFromSetByPredicate({
                  targetSet: this.unusedCommonlyExcludedFromLocalizationEntryPointsSourceFilesAbsolutePaths,
                  predicate: (commonlyExcludedFromLocalizationEntryPointsSourceFileAbsolutePath: string): boolean =>
                      isSubdirectory({
                        whichPath: commonlyExcludedFromLocalizationEntryPointsSourceFileAbsolutePath,
                        ofWhichPath: sourceFilesTopDirectoryAbsolutePath
                      })
                }).removedElements
              )
            )

    };

  }

  private getStringResourcesFromFile(stringResourcesFileRelativePath: string): ArbitraryObject {

    const stringResourcesFileAbsolutePath: string = ImprovedPath.joinPathSegments(
      [ this.consumingProjectRootDirectoryAbsolutePath, stringResourcesFileRelativePath ],
      { alwaysForwardSlashSeparators: true }
    );

    let stringResources: unknown;

    try {

      stringResources = ObjectDataFilesProcessor.processFile({
        filePath: stringResourcesFileAbsolutePath,
        synchronously: true
      });

    } catch (error: unknown) {

      Logger.throwErrorAndLog({
        errorInstance: new FileReadingFailedError({
          customMessage: `Unable to read the file with string resources at "${ stringResourcesFileAbsolutePath }".`
        }),
        title: FileReadingFailedError.localization.defaultTitle,
        occurrenceLocation: "markupProcessingRawSettingsNormalizer." +
            "getStringResourcesFromFileIfExist(stringResourcesFileRelativePath)",
        innerError: error
      });

    }

    if (!isArbitraryObject(stringResources)) {
      Logger.throwErrorAndLog({
        errorInstance: new InvalidExternalDataError({
          customMessage: `The content of string resources files "${ stringResourcesFileAbsolutePath }" is not an object.`
        }),
        title: InvalidExternalDataError.localization.defaultTitle,
        occurrenceLocation: "markupProcessingRawSettingsNormalizer." +
            "getStringResourcesFromFileIfExist(stringResourcesFileRelativePath)"
      });
    }


    return stringResources;

  }

  private normalizeLoggingSettings(): MarkupProcessingSettings__Normalized.Logging {
    return {

      filesPaths:
          this.markupProcessingSettings__fromFile__rawValid.logging?.filesPaths ??
          MarkupProcessingSettings__Default.logging.filesPaths,
      filesCount:
          this.markupProcessingSettings__fromFile__rawValid.logging?.filesCount ??
          MarkupProcessingSettings__Default.logging.filesCount,
      partialFilesAndParentEntryPointsCorrespondence:
          this.markupProcessingSettings__fromFile__rawValid.logging?.partialFilesAndParentEntryPointsCorrespondence ??
          MarkupProcessingSettings__Default.logging.partialFilesAndParentEntryPointsCorrespondence,
      filesWatcherEvents:
          this.markupProcessingSettings__fromFile__rawValid.logging?.filesWatcherEvents ??
          MarkupProcessingSettings__Default.logging.filesWatcherEvents,

      linting: {
        starting:
            this.markupProcessingSettings__fromFile__rawValid.logging?.linting.starting ??
            MarkupProcessingSettings__Default.logging.linting.starting,
        completionWithoutIssues:
            this.markupProcessingSettings__fromFile__rawValid.logging?.linting.completionWithoutIssues ??
            MarkupProcessingSettings__Default.logging.linting.completionWithoutIssues
      },

      HTML_Validation: {
        starting:
            this.markupProcessingSettings__fromFile__rawValid.logging?.HTML_Validation?.starting ??
            MarkupProcessingSettings__Default.logging.HTML_Validation.starting,
        completionWithoutIssues:
            this.markupProcessingSettings__fromFile__rawValid.logging?.HTML_Validation?.completionWithoutIssues ??
            MarkupProcessingSettings__Default.logging.HTML_Validation.completionWithoutIssues
      },

      accessibilityChecking: {
        starting:
            this.markupProcessingSettings__fromFile__rawValid.logging?.accessibilityChecking?.starting ??
            MarkupProcessingSettings__Default.logging.accessibilityChecking.starting,
        completionWithoutIssues:
            this.markupProcessingSettings__fromFile__rawValid.logging?.accessibilityChecking?.completionWithoutIssues ??
            MarkupProcessingSettings__Default.logging.accessibilityChecking.completionWithoutIssues
      }

    };
  }

}


namespace MarkupProcessingRawSettingsNormalizer {

  export type Localization = Readonly<{

    noNeedToSetResourcesReferencesResolvingToRelativePathsOnStaticPreviewModeLog: Localization.
        NoNeedToSetResourcesReferencesResolvingToRelativePathsOnStaticPreviewModeLog;

    generateUnableToResolveResourcesReferencesToAbsolutePathLog:
        (
          templateVariables: Localization.UnableToResolveResourcesReferencesToAbsolutePathLog.TemplateVariables
        ) => Localization.UnableToResolveResourcesReferencesToAbsolutePathLog;

    generateStaticPreviewStateDependentPagesVariationsSpecificationFileReadingFailedMessage:
        (
          templateVariables: Localization.
              StaticPreviewStateDependentPagesVariationsSpecificationFileReadingFailedLog.TemplateVariables
        ) => string;

    generateStaticPreviewStateDependentPagesVariationsSpecificationIsNotTheObjectErrorLog:
        (
          templateVariables: Localization.
              StaticPreviewStateDependentPagesVariationsSpecificationIsInvalidLog.TemplateVariables
        ) => Localization.StaticPreviewStateDependentPagesVariationsSpecificationIsInvalidLog;

    generateInvalidValueOfStaticPreviewStateDependentPagesVariationsSpecificationAssociativeArrayMessage:
        (
          templateVariables: Localization.
              InvalidValueOfStaticPreviewStateDependentPagesVariationsSpecificationAssociativeArrayLog.TemplateVariables
        ) => string;

    generateInvalidPageStateVariableNameMessage:
        (templateVariables: Localization.InvalidPageStateVariableNameLog.TemplateVariables) => string;

    generateInvalidPageStateDependentVariationsSpecificationMessage:
        (templateVariables: Localization.InvalidPageStateDependentVariationsSpecificationLog.TemplateVariables) => string;

    generateInvalidPageStateVariableMessage:
        (templateVariables: Localization.InvalidPageStateVariableLog.TemplateVariables) => string;

  }>;

  export namespace Localization {

    export type NoNeedToSetResourcesReferencesResolvingToRelativePathsOnStaticPreviewModeLog =
        Pick<WarningLog, "title" | "description">;


    export type UnableToResolveResourcesReferencesToAbsolutePathLog =
        Pick<WarningLog, "title" | "description">;

    export namespace UnableToResolveResourcesReferencesToAbsolutePathLog {
      export type TemplateVariables = Readonly<{
        consumingProjectBuildingMode: ConsumingProjectBuildingModes;
      }>;
    }


    export namespace StaticPreviewStateDependentPagesVariationsSpecificationFileReadingFailedLog {
      export type TemplateVariables = Readonly<
        { staticPreviewStateDependentPagesVariationsSpecificationFileAbsolutePath: string; }
      >;
    }


    export type StaticPreviewStateDependentPagesVariationsSpecificationIsInvalidLog = Pick<
      PoliteErrorsMessagesBuilder.SourceData, "technicalDetails" | "politeExplanation"
    >;

    export namespace StaticPreviewStateDependentPagesVariationsSpecificationIsInvalidLog {
      export type TemplateVariables = Readonly<{
        staticPreviewStateDependentPagesVariationsSpecificationFileRelativePath: string;
        stringifiedRawData: string;
        rawDataActualType: string;
      }>;

    }

    export namespace InvalidValueOfStaticPreviewStateDependentPagesVariationsSpecificationAssociativeArrayLog {
      export type TemplateVariables = Readonly<{
        staticPreviewStateDependentPagesVariationsSpecificationFileRelativePath: string;
        invalidEntryKey: string;
        invalidEntryStringifiedValue: string;
        invalidEntryValueType: string;
      }>;
    }

    export namespace InvalidPageStateVariableNameLog {
      export type TemplateVariables = Readonly<{
        targetMarkupFileRelativePath: string;
        specifiedTypeOfVariableNameProperty: string;
        stringifiedValueOfSpecifiedVariableNameProperty: string;
      }>;
    }

    export namespace InvalidPageStateDependentVariationsSpecificationLog {
      export type TemplateVariables = Readonly<{
        targetMarkupFileRelativePath: string;
        actualType: string;
        actualStringifiedValue: string;
      }>;
    }

    export namespace InvalidPageStateVariableLog {
      export type TemplateVariables = Readonly<{
        targetMarkupFileRelativePath: string;
        actualType: string;
        actualStringifiedValue: string;
      }>;
    }
  }

}


export default MarkupProcessingRawSettingsNormalizer;


/* It is the only way to extract the child namespace (no need to expose whole AccessibilityInspector for the localization
 * packages). See https://stackoverflow.com/a/73400523/4818123 */
export import MarkupProcessingRawSettingsNormalizerLocalization = MarkupProcessingRawSettingsNormalizer.Localization;
