/* --- Restrictions ------------------------------------------------------------------------------------------------- */
import MarkupProcessingRestrictions from "@MarkupProcessing/MarkupProcessingRestrictions";
import ConsumingProjectPreDefinedBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectPreDefinedBuildingModes";

/* --- Default settings --------------------------------------------------------------------------------------------- */
import MarkupProcessingSettings__Default from "@MarkupProcessing/MarkupProcessingSettings__Default";

/* --- Raw valid settings ------------------------------------------------------------------------------------------- */
import type MarkupProcessingSettings__FromFile__RawValid from
    "@MarkupProcessing/MarkupProcessingSettings__FromFile__RawValid";

/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";
import type MarkupProcessingSettings__Normalized from
    "@MarkupProcessing/MarkupProcessingSettings__Normalized";

/* --- Settings normalizers ----------------------------------------------------------------------------------------- */
import SourceCodeProcessingRawSettingsNormalizer from
    "@ProjectBuilding/Common/RawSettingsNormalizers/SourceCodeProcessingRawSettingsNormalizer";

/* --- Utils -------------------------------------------------------------------------------------------------------- */
import {
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
import type { ArbitraryObject } from "@yamato-daiwa/es-extensions";
import { ObjectDataFilesProcessor } from "@yamato-daiwa/es-extensions-nodejs";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";
import type Mutable from "@UtilsIncubator/Types/Mutable";

/* --- Localization ------------------------------------------------------------------------------------------------- */
import MarkupProcessingRawSettingsNormalizerLocalization__English from
    "./MarkupProcessingRawSettingsNormalizerLocalization.english";


class MarkupProcessingRawSettingsNormalizer extends SourceCodeProcessingRawSettingsNormalizer {

  public static localization: MarkupProcessingRawSettingsNormalizer.Localization =
      MarkupProcessingRawSettingsNormalizerLocalization__English;


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
          consumingProjectBuildingMode: commonSettings__normalized.projectBuildingMode,
          consumingProjectRootDirectoryAbsolutePath: commonSettings__normalized.projectRootDirectoryAbsolutePath,
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

        periodBetweenFileUpdatingAndRebuildingStarting__seconds:
            markupProcessingSettings__fromFile__rawValid.common?.periodBetweenFileUpdatingAndRebuildingStarting__seconds ??
            MarkupProcessingSettings__Default.periodBetweenFileUpdatingAndRebuildingStarting__seconds

      },

      linting: dataHoldingSelfInstance.normalizeLintingSettings(),

      staticPreview: {
        stateDependentPagesVariationsSpecification: dataHoldingSelfInstance.
            normalizeStaticPreviewStateDependentPageVariationsSpecification(),
        importsFromStaticDataFiles: dataHoldingSelfInstance.normalizeImportsFromStaticDataFiles(),
        ...dataHoldingSelfInstance.normalizeImportsFromTypeScriptFiles()
      },

      relevantEntryPointsGroups:
          dataHoldingSelfInstance.createNormalizedEntryPointsGroupsSettings(
            markupProcessingSettings__fromFile__rawValid.entryPointsGroups,
            MarkupProcessingRawSettingsNormalizer.
                completeEntryPointsGroupNormalizedSettingsCommonPropertiesUntilMarkupEntryPointsGroupNormalizedSettings
          ),

      logging: dataHoldingSelfInstance.normalizeLoggingSettings()

    };
  }


  private constructor(
    namedParameters:
        SourceCodeProcessingRawSettingsNormalizer.ConstructorParameters &
        Readonly<{ markupProcessingSettings__fromFile__rawValid: MarkupProcessingSettings__FromFile__RawValid; }>
  ) {
    super(namedParameters);
    this.markupProcessingSettings__fromFile__rawValid = namedParameters.markupProcessingSettings__fromFile__rawValid;
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
              { forwardSlashOnlySeparators: true }
            )
          } : null
        } :
        { mustExecute: MarkupProcessingSettings__Default.linting.mustExecute };

  }


  private normalizeStaticPreviewStateDependentPageVariationsSpecification(): MarkupProcessingSettings__Normalized.StaticPreview.
      StateDependentPagesVariationsSpecification
  /* eslint-disable-next-line @typescript-eslint/brace-style -- In this case, the Allman style more readable. */
  {

    const staticPreviewStateDependentPagesVariationsSpecificationFileRelativePath: string | undefined =
        this.markupProcessingSettings__fromFile__rawValid.staticPreview?.
            stateDependentPagesVariationsSpecificationFileRelativePath;

    if (
      isUndefined(staticPreviewStateDependentPagesVariationsSpecificationFileRelativePath) ||
      this.consumingProjectBuildingMode !== ConsumingProjectPreDefinedBuildingModes.staticPreview
    ) {
      return {};
    }


    const staticPreviewStateDependentPagesVariationsSpecificationFileAbsolutePath: string = ImprovedPath.joinPathSegments(
      [ this.consumingProjectRootDirectoryAbsolutePath, staticPreviewStateDependentPagesVariationsSpecificationFileRelativePath ],
        { forwardSlashOnlySeparators: true }
    );

    /* [ Approach ] Currently, the `RawObjectDataProcessor` thus `ObjectDataFilesProcessor` are ignoring and not keep the
     *      data which validation rules has not been specified. In this case, the state variable is such data. */
    let rawData: unknown;

    try {

      rawData = ObjectDataFilesProcessor.processFile({
        filePath: staticPreviewStateDependentPagesVariationsSpecificationFileAbsolutePath
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
            "normalizeStaticPreviewStateDependentPageVariationsSpecification(namedParameters)",
        wrappableError: error
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
            "normalizeStaticPreviewStateDependentPageVariationsSpecification(namedParameters)"
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

      const markupSourceFileRelativePath: string = ImprovedPath.addFileNameExtensionIfNotPresent({
        targetFilePath: markupSourceFileRelativePath__possiblyWithoutExtension, fileNameExtension: "pug"
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
              "normalizeStaticPreviewStateDependentPageVariationsSpecification(namedParameters)"
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
              "normalizeStaticPreviewStateDependentPageVariationsSpecification(namedParameters)"
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
              "normalizeStaticPreviewStateDependentPageVariationsSpecification(namedParameters)"
        });
      }


      const markupSourceFileFileAbsolutePath: string = ImprovedPath.joinPathSegments(
        [ this.consumingProjectRootDirectoryAbsolutePath, markupSourceFileRelativePath ],
        { forwardSlashOnlySeparators: true }
      );

      const derivedPagesAndStatesMap: { [derivedFileAbsolutePath: string]: ArbitraryObject; } = {};

      for (const [ postfix, state ] of Object.entries(stateDependentPageVariationsData.variations)) {

        const derivedFileAbsolutePath: string =
            `${ ImprovedPath.removeFilenameExtensionFromPath(markupSourceFileFileAbsolutePath) }${ postfix }.pug`;

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
                "normalizeStaticPreviewStateDependentPageVariationsSpecification(namedParameters)"
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
          ])
        });

      } catch (error: unknown) {

        Logger.throwErrorAndLog({
          errorInstance: new FileReadingFailedError({
            filePath: importFromStaticDataFile.fileRelativePath
          }),
          title: FileReadingFailedError.localization.defaultTitle,
          occurrenceLocation: "markupProcessingRawSettingsNormalizer.normalizeImportsFromStaticDataFiles()",
          wrappableError: error
        });

      }

      importsFromStaticDataFiles[importFromStaticDataFile.importedVariableName] = importedData;

    }

    return importsFromStaticDataFiles;

  }

  private normalizeImportsFromTypeScriptFiles(): {
    compiledTypeScriptImporting?: MarkupProcessingSettings__Normalized.StaticPreview.ImportsFromCompiledTypeScript;
  } {

    const importsFromCompiledTypeScriptSettings: MarkupProcessingSettings__FromFile__RawValid.
        StaticPreview.ImportFromCompiledTypeScript | undefined =
            this.markupProcessingSettings__fromFile__rawValid.staticPreview?.importsFromCompiledTypeScript;

    if (isUndefined(importsFromCompiledTypeScriptSettings)) {
      return {};
    }


    return {

      compiledTypeScriptImporting: {

        typeScriptConfigurationFileAbsolutePath:
            ImprovedPath.joinPathSegments(
              [
                this.consumingProjectRootDirectoryAbsolutePath,
                isNotUndefined(importsFromCompiledTypeScriptSettings.typeScriptConfigurationFileRelativePath) ?
                    ImprovedPath.addFileNameExtensionIfNotPresent({
                      targetFilePath: importsFromCompiledTypeScriptSettings.typeScriptConfigurationFileRelativePath,
                      fileNameExtension: "json"
                    }) :
                    MarkupProcessingSettings__Default.staticPreview.typeScriptConfigurationFileRelativePath
              ],
              { forwardSlashOnlySeparators: true }
            ),

        files: importsFromCompiledTypeScriptSettings.files.map(

          (
            importFromCompiledTypescript: MarkupProcessingSettings__FromFile__RawValid.
                StaticPreview.ImportFromCompiledTypeScript.FileMetadata
          ): MarkupProcessingSettings__Normalized.StaticPreview.ImportsFromCompiledTypeScript.FileMetadata => {

            const sourceFileAbsolutePath: string = ImprovedPath.joinPathSegments(
              [ this.consumingProjectRootDirectoryAbsolutePath, importFromCompiledTypescript.sourceFileRelativePath ],
              { forwardSlashOnlySeparators: true }
            );

            return {
              sourceFileAbsolutePath,
              importedNamespace: importFromCompiledTypescript.importedNamespace,
              outputDirectoryAbsolutePath: ImprovedPath.joinPathSegments(
                  [ this.consumingProjectRootDirectoryAbsolutePath, importFromCompiledTypescript.outputDirectoryRelativePath ],
                  { forwardSlashOnlySeparators: true }
              ),
              outputFileNameWithoutExtension: importFromCompiledTypescript.customOutputFileNameWithoutLastExtension ??
                  ImprovedPath.extractFileNameWithoutExtensionFromPath(sourceFileAbsolutePath)
            };

          }

        )

      }

    };

  }

  private normalizeLoggingSettings(): MarkupProcessingSettings__Normalized.Logging {
    return {
      filesPaths: this.markupProcessingSettings__fromFile__rawValid.logging?.filesPaths ??
          MarkupProcessingSettings__Default.logging.filesPaths,
      filesCount: this.markupProcessingSettings__fromFile__rawValid.logging?.filesCount ??
          MarkupProcessingSettings__Default.logging.filesCount,
      partialFilesAndParentEntryPointsCorrespondence: this.markupProcessingSettings__fromFile__rawValid.
          logging?.partialFilesAndParentEntryPointsCorrespondence ??
          MarkupProcessingSettings__Default.logging.partialFilesAndParentEntryPointsCorrespondence
    };
  }


  private static completeEntryPointsGroupNormalizedSettingsCommonPropertiesUntilMarkupEntryPointsGroupNormalizedSettings(
    entryPointsGroupGenericSettings__normalized: ProjectBuildingConfig__Normalized.EntryPointsGroupGenericSettings,
    entryPointsGroupSettings__rawValid: MarkupProcessingSettings__FromFile__RawValid.EntryPointsGroup
  ): MarkupProcessingSettings__Normalized.EntryPointsGroup {

    return {

      ...entryPointsGroupGenericSettings__normalized,

      HTML_Validation: {
        mustExecute: entryPointsGroupSettings__rawValid.HTML_Validation?.disable === true ? false :
            MarkupProcessingSettings__Default.HTML_Validation.mustExecute
      },

      accessibilityInspection: {
        mustExecute: entryPointsGroupSettings__rawValid.accessibilityInspection?.disable === true ? false :
            MarkupProcessingSettings__Default.accessibilityInspection.mustExecute,
        standard: entryPointsGroupSettings__rawValid.accessibilityInspection?.standard ??
            MarkupProcessingSettings__Default.accessibilityInspection.standard
      },

      mustConvertToHandlebarsOnNonStaticPreviewModes: entryPointsGroupSettings__rawValid.
          convertToHandlebarsOnNonStaticPreviewModes ?? false
    };

  }
}


namespace MarkupProcessingRawSettingsNormalizer {

  export type Localization = Readonly<{

    generateStaticPreviewStateDependentPagesVariationsSpecificationFileReadingFailedMessage:
        (
          namedParameters: Localization.StaticPreviewStateDependentPagesVariationsSpecificationFileReadingFailedLog.
              NamedParameters
        ) => string;

    generateStaticPreviewStateDependentPagesVariationsSpecificationIsNotTheObjectErrorLog:
        (
          namedParameters: Localization.StaticPreviewStateDependentPagesVariationsSpecificationIsInvalidLog.NamedParameters
        ) => Localization.StaticPreviewStateDependentPagesVariationsSpecificationIsInvalidLog;

    generateInvalidValueOfStaticPreviewStateDependentPagesVariationsSpecificationAssociativeArrayMessage:
        (
          namedParameters: Localization.InvalidValueOfStaticPreviewStateDependentPagesVariationsSpecificationAssociativeArrayLog.
              NamedParameters
        ) => string;

    generateInvalidPageStateVariableNameMessage:
        (namedParameters: Localization.InvalidPageStateVariableNameLog.NamedParameters) => string;

    generateInvalidPageStateDependentVariationsSpecificationMessage:
        (namedParameters: Localization.InvalidPageStateDependentVariationsSpecificationLog.NamedParameters) => string;

    generateInvalidPageStateVariableMessage:
        (namedParameters: Localization.InvalidPageStateVariableLog.NamedParameters) => string;

  }>;

  export namespace Localization {

    export namespace StaticPreviewStateDependentPagesVariationsSpecificationFileReadingFailedLog {
      export type NamedParameters = Readonly<
        { staticPreviewStateDependentPagesVariationsSpecificationFileAbsolutePath: string; }
      >;
    }


    export type StaticPreviewStateDependentPagesVariationsSpecificationIsInvalidLog = Pick<
      PoliteErrorsMessagesBuilder.NamedParameters, "technicalDetails" | "politeExplanation"
    >;

    export namespace StaticPreviewStateDependentPagesVariationsSpecificationIsInvalidLog {
      export type NamedParameters = Readonly<{
        staticPreviewStateDependentPagesVariationsSpecificationFileRelativePath: string;
        stringifiedRawData: string;
        rawDataActualType: string;
      }>;

    }

    export namespace InvalidValueOfStaticPreviewStateDependentPagesVariationsSpecificationAssociativeArrayLog {
      export type NamedParameters = Readonly<{
        staticPreviewStateDependentPagesVariationsSpecificationFileRelativePath: string;
        invalidEntryKey: string;
        invalidEntryStringifiedValue: string;
        invalidEntryValueType: string;
      }>;
    }

    export namespace InvalidPageStateVariableNameLog {
      export type NamedParameters = Readonly<{
        targetMarkupFileRelativePath: string;
        specifiedTypeOfVariableNameProperty: string;
        stringifiedValueOfSpecifiedVariableNameProperty: string;
      }>;
    }

    export namespace InvalidPageStateDependentVariationsSpecificationLog {
      export type NamedParameters = Readonly<{
        targetMarkupFileRelativePath: string;
        actualType: string;
        actualStringifiedValue: string;
      }>;
    }

    export namespace InvalidPageStateVariableLog {
      export type NamedParameters = Readonly<{
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
