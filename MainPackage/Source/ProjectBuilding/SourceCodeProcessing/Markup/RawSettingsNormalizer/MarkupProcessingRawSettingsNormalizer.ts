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
import type SourceCodeProcessingGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/SourceCodeProcessingGenericProperties__Normalized";
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";
import type MarkupProcessingSettings__Normalized from
    "@MarkupProcessing/MarkupProcessingSettings__Normalized";

/* ─── Settings normalizers ───────────────────────────────────────────────────────────────────────────────────────── */
import SourceCodeProcessingRawSettingsNormalizer from
    "@ProjectBuilding/Common/RawSettingsNormalizers/SourceCodeProcessingRawSettingsNormalizer";
import RoutingSettingsNormalizer from "@MarkupProcessing/RawSettingsNormalizer/RoutingSettingsNormalizer";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import {
  appendLastFileNameExtension,
  removeAllFileNameExtensions,
  stringifyAndFormatArbitraryValue,
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
import { ObjectDataFilesProcessor, ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";
import type Mutable from "@UtilsIncubator/Types/Mutable";

/* ─── Localization ───────────────────────────────────────────────────────────────────────────────────────────────── */
import markupProcessingRawSettingsNormalizerLocalization__english from
    "./MarkupProcessingRawSettingsNormalizerLocalization.english";


class MarkupProcessingRawSettingsNormalizer extends SourceCodeProcessingRawSettingsNormalizer {

  public static localization: MarkupProcessingRawSettingsNormalizer.Localization =
      markupProcessingRawSettingsNormalizerLocalization__english;


  protected supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: ReadonlyArray<string> =
      MarkupProcessingRestrictions.supportedSourceFilesNamesExtensionsWithoutLeadingDots;


  private readonly markupProcessingSettings__fromFile__rawValid: MarkupProcessingSettings__FromFile__RawValid;


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

        periodBetweenFileUpdatingAndRebuildingStarting__seconds:
            markupProcessingSettings__fromFile__rawValid.common?.periodBetweenFileUpdatingAndRebuildingStarting__seconds ??
            MarkupProcessingSettings__Default.periodBetweenFileUpdatingAndRebuildingStarting__seconds

      },

      linting: dataHoldingSelfInstance.normalizeLintingSettings(),

      ...isNotUndefined(markupProcessingSettings__fromFile__rawValid.importingFromTypeScript) ?
          {
            importingFromTypeScript: dataHoldingSelfInstance.
                normalizeImportingFromTypeScriptSettings(markupProcessingSettings__fromFile__rawValid.importingFromTypeScript)
          } : null,

      staticPreview: {
        stateDependentPagesVariationsSpecification: dataHoldingSelfInstance.
            normalizeStaticPreviewStateDependentPageVariationsSpecification(),
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
  }


  private computeMustResolveResourcesReferencesToAbsolutePathPropertyValue(): boolean {

    const explicitlySpecifiedMustResolveResourceReferencesToRelativePathsPropertyValue: boolean | undefined =
        this.markupProcessingSettings__fromFile__rawValid.common?.
          buildingModeDependent?.[this.consumingProjectBuildingMode]?.
          mustResolveResourceReferencesToRelativePaths;

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
      importedNamespace: importingFromTypeScriptSettings__fromFile__rawValid.importedNamespace,
      nameOfPugBlockToWhichTranspiledTypeScriptMustBeInjected:
          importingFromTypeScriptSettings__fromFile__rawValid.nameOfPugBlockToWhichTranspiledTypeScriptMustBeInjected
    };
  }

  private normalizeStaticPreviewStateDependentPageVariationsSpecification(): MarkupProcessingSettings__Normalized.
      StaticPreview.StateDependentPagesVariationsSpecification
  /* eslint-disable-next-line @stylistic/brace-style -- In this case, the Allman style more readable. */
  {

    const staticPreviewStateDependentPagesVariationsSpecificationFileRelativePath: string | undefined =
        this.markupProcessingSettings__fromFile__rawValid.staticPreview?.
            stateDependentPagesVariationsSpecificationFileRelativePath;

    if (
      isUndefined(staticPreviewStateDependentPagesVariationsSpecificationFileRelativePath) ||
      this.consumingProjectBuildingMode !== ConsumingProjectBuildingModes.staticPreview
    ) {
      return {};
    }


    const staticPreviewStateDependentPagesVariationsSpecificationFileAbsolutePath: string = ImprovedPath.joinPathSegments(
      [ this.consumingProjectRootDirectoryAbsolutePath, staticPreviewStateDependentPagesVariationsSpecificationFileRelativePath ],
      { alwaysForwardSlashSeparators: true }
    );

    /* [ Approach ] Currently, the `RawObjectDataProcessor` thus `ObjectDataFilesProcessor` are ignoring and not keep the
     *      data which validation rules has not been specified. In this case, the state variable is such data. */
    let rawData: unknown;

    try {

      rawData = ObjectDataFilesProcessor.processFile({
        filePath: staticPreviewStateDependentPagesVariationsSpecificationFileAbsolutePath,
        synchronously: true
      });

    } catch (error: unknown) {

      Logger.throwErrorAndLog({
        errorInstance: new FileReadingFailedError({
          customMessage: MarkupProcessingRawSettingsNormalizer.localization.
              generateStaticPreviewStateDependentPagesVariationsSpecificationFileReadingFailedMessage({
                staticPreviewStateDependentPagesVariationsSpecificationFileAbsolutePath
              })
        }),
        title: FileReadingFailedError.localization.defaultTitle,
        occurrenceLocation: "MarkupProcessingRawSettingsNormalizer." +
            "normalizeStaticPreviewStateDependentPageVariationsSpecification()",
        innerError: error
      });

    }


    if (!isArbitraryObject(rawData)) {

      Logger.logError({
        errorType: InvalidExternalDataError.NAME,
        title: InvalidExternalDataError.localization.defaultTitle,
        description: PoliteErrorsMessagesBuilder.buildMessage(
          MarkupProcessingRawSettingsNormalizer.localization.
              generateStaticPreviewStateDependentPagesVariationsSpecificationIsNotTheObjectErrorLog({
                staticPreviewStateDependentPagesVariationsSpecificationFileRelativePath,
                stringifiedRawData: stringifyAndFormatArbitraryValue(rawData),
                rawDataActualType: typeof rawData
              })
        ),
        occurrenceLocation: "MarkupProcessingRawSettingsNormalizer." +
            "normalizeStaticPreviewStateDependentPageVariationsSpecification()"
      });

      return {};

    }


    const staticPreviewStateDependentPageVariationsData: Mutable<
      MarkupProcessingSettings__Normalized.StaticPreview.StateDependentPagesVariationsSpecification
    > = {};

    for (
      const [ markupSourceFileRelativePath__possiblyWithoutExtension, stateDependentPageVariationsData ] of
      Object.entries(rawData)
    ) {

      const markupSourceFileRelativePath: string = appendLastFileNameExtension({
        targetPath: markupSourceFileRelativePath__possiblyWithoutExtension,
        targetFileNameExtensionWithOrWithoutLeadingDot: "pug",
        mustAppendDuplicateEvenIfTargetLastFileNameExtensionAlreadyPresentsAtSpecifiedPath: false
      });

      if (!isArbitraryObject(stateDependentPageVariationsData)) {
        Logger.throwErrorAndLog({
          errorInstance: new InvalidExternalDataError({
            customMessage: MarkupProcessingRawSettingsNormalizer.localization.
              generateInvalidValueOfStaticPreviewStateDependentPagesVariationsSpecificationAssociativeArrayMessage({
                staticPreviewStateDependentPagesVariationsSpecificationFileRelativePath,
                invalidEntryKey: markupSourceFileRelativePath,
                invalidEntryValueType: typeof stateDependentPageVariationsData,
                invalidEntryStringifiedValue: stringifyAndFormatArbitraryValue(stateDependentPageVariationsData)
              })
          }),
          title: InvalidExternalDataError.localization.defaultTitle,
          occurrenceLocation: "MarkupProcessingRawSettingsNormalizer." +
              "normalizeStaticPreviewStateDependentPageVariationsSpecification()"
        });
      }


      if (!isNonEmptyString(stateDependentPageVariationsData.stateObjectTypeVariableName)) {
        Logger.throwErrorAndLog({
          errorInstance: new InvalidExternalDataError({
            customMessage: MarkupProcessingRawSettingsNormalizer.localization.generateInvalidPageStateVariableNameMessage({
              targetMarkupFileRelativePath: markupSourceFileRelativePath,
              stringifiedValueOfSpecifiedVariableNameProperty:
                  stringifyAndFormatArbitraryValue(stateDependentPageVariationsData.stateObjectTypeVariableName),
              specifiedTypeOfVariableNameProperty: typeof stateDependentPageVariationsData.stateObjectTypeVariableName
            })
          }),
          title: InvalidExternalDataError.localization.defaultTitle,
          occurrenceLocation: "MarkupProcessingRawSettingsNormalizer." +
              "normalizeStaticPreviewStateDependentPageVariationsSpecification()"
        });
      }


      if (!isArbitraryObject(stateDependentPageVariationsData.variations)) {
        Logger.throwErrorAndLog({
          errorInstance: new InvalidExternalDataError({
            customMessage: MarkupProcessingRawSettingsNormalizer.localization.
                generateInvalidPageStateDependentVariationsSpecificationMessage({
                  targetMarkupFileRelativePath: markupSourceFileRelativePath,
                  actualType: typeof stateDependentPageVariationsData.variations,
                  actualStringifiedValue: stringifyAndFormatArbitraryValue(stateDependentPageVariationsData.variations)
                })
          }),
          title: InvalidExternalDataError.localization.defaultTitle,
          occurrenceLocation: "MarkupProcessingRawSettingsNormalizer." +
              "normalizeStaticPreviewStateDependentPageVariationsSpecification()"
        });
      }


      const markupSourceFileFileAbsolutePath: string = ImprovedPath.joinPathSegments(
        [ this.consumingProjectRootDirectoryAbsolutePath, markupSourceFileRelativePath ],
        { alwaysForwardSlashSeparators: true }
      );

      const derivedPagesAndStatesMap: { [derivedFileAbsolutePath: string]: ArbitraryObject; } = {};

      for (const [ postfix, state ] of Object.entries(stateDependentPageVariationsData.variations)) {

        const derivedFileAbsolutePath: string =
            `${ removeAllFileNameExtensions(markupSourceFileFileAbsolutePath) }${ postfix }.pug`;

        if (!isArbitraryObject(state)) {
          Logger.throwErrorAndLog({
            errorInstance: new InvalidExternalDataError({
              customMessage: MarkupProcessingRawSettingsNormalizer.localization.generateInvalidPageStateVariableMessage({
                targetMarkupFileRelativePath: markupSourceFileRelativePath,
                actualStringifiedValue: stringifyAndFormatArbitraryValue(state),
                actualType: typeof state
              })
            }),
            title: InvalidExternalDataError.localization.defaultTitle,
            occurrenceLocation: "MarkupProcessingRawSettingsNormalizer." +
                "normalizeStaticPreviewStateDependentPageVariationsSpecification()"
          });
        }

        derivedPagesAndStatesMap[derivedFileAbsolutePath] = state;

      }

      staticPreviewStateDependentPageVariationsData[markupSourceFileFileAbsolutePath] = {
        stateVariableName: stateDependentPageVariationsData.stateObjectTypeVariableName,
        derivedPagesAndStatesMap
      };

    }

    return staticPreviewStateDependentPageVariationsData;

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

    return {

      ...entryPointsGroupGenericSettings__normalized,

      outputFormat: entryPointsGroupSettings__rawValid.outputFormat ?? MarkupProcessingSettings__Default.outputFormat,

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
        mustExecute: settingsActualForCurrentProjectBuildingMode.outputCodeFormatting?.disable === true ? false :
          MarkupProcessingSettings__Default.outputCodeFormatting.mustExecute(this.consumingProjectBuildingMode)
      }

    };

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

/* eslint-disable-next-line @typescript-eslint/no-unused-vars --
 * It is the only way to extract the child namespace (no need to expose whole MarkupProcessingRawSettingsNormalizer
 * for the localization packages).
 * https://stackoverflow.com/a/73400523/4818123 */
export import MarkupProcessingRawSettingsNormalizerLocalization = MarkupProcessingRawSettingsNormalizer.Localization;
