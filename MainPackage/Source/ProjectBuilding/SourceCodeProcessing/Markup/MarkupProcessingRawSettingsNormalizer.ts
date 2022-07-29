/* --- Restrictions ------------------------------------------------------------------------------------------------- */
import MarkupProcessingRestrictions from "@MarkupProcessing/MarkupProcessingRestrictions";

/* --- Default settings --------------------------------------------------------------------------------------------- */
import MarkupProcessingSettings__Default from "@MarkupProcessing/MarkupProcessingSettings__Default";

/* --- Raw valid config --------------------------------------------------------------------------------------------- */
import type MarkupProcessingSettings__FromFile__RawValid from
    "@MarkupProcessing/MarkupProcessingSettings__FromFile__RawValid";

/* --- Normalized config -------------------------------------------------------------------------------------------- */
import type ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding:Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";
import type MarkupProcessingSettings__Normalized from
    "@MarkupProcessing/MarkupProcessingSettings__Normalized";
import SourceCodeProcessingRawSettingsNormalizer from
    "@ProjectBuilding:Common/RawSettingsNormalizers/SourceCodeProcessingRawSettingsNormalizer";

/* --- Utils -------------------------------------------------------------------------------------------------------- */
import {
  Logger,
  AlgorithmMismatchError,
  isUndefined,
  isNotUndefined,
  isBoolean
} from "@yamato-daiwa/es-extensions";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";


export default class MarkupProcessingRawSettingsNormalizer extends SourceCodeProcessingRawSettingsNormalizer {

  protected supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: Array<string> = MarkupProcessingRestrictions.
      supportedSourceFileNameExtensionsWithoutDots;

  private readonly lintingCommonSettings: MarkupProcessingSettings__Normalized.Linting;


  public static normalize(
    {
      markupProcessingSettings__fromFile__rawValid,
      commonSettings__normalized
    }: Readonly<{
      markupProcessingSettings__fromFile__rawValid: MarkupProcessingSettings__FromFile__RawValid;
      commonSettings__normalized: ProjectBuildingCommonSettings__Normalized;
    }>
  ): MarkupProcessingSettings__Normalized {

    const lintingCommonSettings: MarkupProcessingSettings__Normalized.Linting =
        isUndefined(markupProcessingSettings__fromFile__rawValid.linting) ?
            {
              isCompletelyDisabled: !MarkupProcessingSettings__Default.linting.mustExecute
            } :
            {

              isCompletelyDisabled: markupProcessingSettings__fromFile__rawValid.linting.disableCompletely === true ?
                  true : !MarkupProcessingSettings__Default.linting.mustExecute,

              ...isNotUndefined(markupProcessingSettings__fromFile__rawValid.linting.presetFileRelativePath) ? {
                presetFileAbsolutePath: ImprovedPath.buildAbsolutePath(
                  [
                    commonSettings__normalized.projectRootDirectoryAbsolutePath,
                    markupProcessingSettings__fromFile__rawValid.linting.presetFileRelativePath
                  ],
                  { forwardSlashOnlySeparators: true }
                )
              } : null
            };

    const dataHoldingSelfInstance: MarkupProcessingRawSettingsNormalizer =
        new MarkupProcessingRawSettingsNormalizer({
          consumingProjectBuildingMode: commonSettings__normalized.projectBuildingMode,
          consumingProjectRootDirectoryAbsolutePath: commonSettings__normalized.projectRootDirectoryAbsolutePath,
          ...isNotUndefined(commonSettings__normalized.tasksAndSourceFilesSelection) ? {
            entryPointsGroupsIDsSelection: commonSettings__normalized.tasksAndSourceFilesSelection.markupProcessing
          } : {},
          markupProcessingSettings__fromFile__rawValid,
          lintingCommonSettings
        });

    return {

      common: {
        supportedSourceFileNameExtensionsWithoutLeadingDots:
            MarkupProcessingRestrictions.supportedSourceFileNameExtensionsWithoutDots,
        supportedOutputFileNameExtensionsWithoutLeadingDots:
            MarkupProcessingRestrictions.supportedOutputFileNameExtensionsWithoutDots,
        waitingForSubsequentFilesWillBeSavedPeriod__seconds:
            markupProcessingSettings__fromFile__rawValid.common?.waitingForSubsequentFilesWillBeSavedPeriod__seconds ??
            MarkupProcessingSettings__Default.waitingForOtherFilesWillBeSavedPeriod__seconds
      },

      linting: lintingCommonSettings,

      entryPointsGroupsActualForCurrentProjectBuildingMode:
          dataHoldingSelfInstance.createNormalizedEntryPointsGroupsSettings(
              markupProcessingSettings__fromFile__rawValid.entryPointsGroups,
              dataHoldingSelfInstance.
                  completeEntryPointsGroupNormalizedSettingsCommonPropertiesUntilMarkupEntryPointsGroupNormalizedSettings.
                  bind(dataHoldingSelfInstance)
          )
    };
  }


  private constructor(
    namedParameters:
        SourceCodeProcessingRawSettingsNormalizer.ConstructorParameters &
        Readonly<{
          markupProcessingSettings__fromFile__rawValid: MarkupProcessingSettings__FromFile__RawValid;
          lintingCommonSettings: MarkupProcessingSettings__Normalized.Linting;
        }>
  ) {

    super(namedParameters);

    this.lintingCommonSettings = namedParameters.lintingCommonSettings;
  }


  private completeEntryPointsGroupNormalizedSettingsCommonPropertiesUntilMarkupEntryPointsGroupNormalizedSettings(
    entryPointsGroupGenericSettings__normalized: ProjectBuildingConfig__Normalized.EntryPointsGroupGenericSettings,
    entryPointsGroupSettings__rawValid: MarkupProcessingSettings__FromFile__RawValid.EntryPointsGroup
  ): MarkupProcessingSettings__Normalized.EntryPointsGroup {

    const entryPointsGroupSettingsRelevantForCurrentProjectBuildingMode__rawValid:
        MarkupProcessingSettings__FromFile__RawValid.EntryPointsGroup.BuildingModeDependent | undefined =
        entryPointsGroupSettings__rawValid.buildingModeDependent[this.consumingProjectBuildingMode];

    // TODO 局地化
    if (isUndefined(entryPointsGroupSettingsRelevantForCurrentProjectBuildingMode__rawValid)) {
      Logger.throwErrorAndLog({
        errorInstance: new AlgorithmMismatchError(
          `プロジェクト構成モード：「${ this.consumingProjectBuildingMode }」に該当する生入点設定が発見されず。`
        ),
        occurrenceLocation: "MarkupProcessingRawSettingsNormalizer" +
            "completeEntryPointsGroupNormalizedSettingsCommonPropertiesUntilMarkupEntryPointsGroupNormalizedSettings",
        title: AlgorithmMismatchError.localization.defaultTitle
      });
    }


    return {

      ...entryPointsGroupGenericSettings__normalized,

      HTML_Validation: {
        mustExecute: entryPointsGroupSettings__rawValid.HTML_Validation?.disable === true ? false :
            MarkupProcessingSettings__Default.HTML_Validation.mustExecute
      },

      linting: {
        mustExecute: ((): boolean => {

          if (this.lintingCommonSettings.isCompletelyDisabled) {
            return false;
          }


          if (isUndefined(entryPointsGroupSettings__rawValid.linting)) {
            return MarkupProcessingSettings__Default.linting.mustExecute;
          }


          if (isBoolean(entryPointsGroupSettings__rawValid.linting.disable)) {
            return !entryPointsGroupSettings__rawValid.linting.disable;
          }


          return MarkupProcessingSettings__Default.linting.mustExecute;
        })()
      },

      accessibilityInspection: {
        mustExecute: entryPointsGroupSettings__rawValid.accessibilityInspection?.disable === true ? false :
            MarkupProcessingSettings__Default.accessibilityInspection.mustExecute,
        standard: entryPointsGroupSettings__rawValid.accessibilityInspection?.standard ??
            MarkupProcessingSettings__Default.accessibilityInspection.standard
      }
    };
  }
}
