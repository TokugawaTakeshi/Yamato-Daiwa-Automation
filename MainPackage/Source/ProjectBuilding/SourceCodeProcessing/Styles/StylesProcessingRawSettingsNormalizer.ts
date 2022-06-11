/* --- Restrictions ------------------------------------------------------------------------------------------------- */
import StylesProcessingRestrictions from "@StylesProcessing/StylesProcessingRestrictions";

/* --- Default settings --------------------------------------------------------------------------------------------- */
import StylesProcessingSettings__Default from "@StylesProcessing/StylesProcessingSettings__Default";

/* --- External data ------------------------------------------------------------------------------------------------ */
import type StylesProcessingSettings__FromFile__RawValid from
    "@StylesProcessing/StylesProcessingSettings__FromFile__RawValid";

/* --- Third-party solution specialists ----------------------------------------------------------------------------- */
import StlintLinterSpecialist from "@ThirdPartySolutionsSpecialists/StlintLinterSpecialist";

/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding:Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";
import type StylesProcessingSettings__Normalized from "@StylesProcessing/StylesProcessingSettings__Normalized";

/* --- Applied auxiliaries ------------------------------------------------------------------------------------------ */
import SourceCodeProcessingRawSettingsNormalizer from
    "@ProjectBuilding:Common/RawSettingsNormalizers/SourceCodeProcessingRawSettingsNormalizer";

/* --- General auxiliaries ------------------------------------------------------------------------------------------ */
import { isUndefined, isBoolean, isNotUndefined } from "@yamato-daiwa/es-extensions";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";


export default class StylesProcessingRawSettingsNormalizer extends SourceCodeProcessingRawSettingsNormalizer {

  protected supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: Array<string> = StylesProcessingRestrictions.
      supportedSourceFileNameExtensionsWithoutLeadingDots;

  private readonly lintingCommonSettings: StylesProcessingSettings__Normalized.Linting;


  public static normalize(
    {
      stylesProcessingSettings__fromFile__rawValid,
      commonSettings__normalized
    }: {
      stylesProcessingSettings__fromFile__rawValid: StylesProcessingSettings__FromFile__RawValid;
      commonSettings__normalized: ProjectBuildingCommonSettings__Normalized;
    }
  ): StylesProcessingSettings__Normalized {

    const lintingCommonSettings: StylesProcessingSettings__Normalized.Linting =
        isUndefined(stylesProcessingSettings__fromFile__rawValid.linting) ?
            {
              isCompletelyDisabled: !StylesProcessingSettings__Default.linting.mustExecute
            } :
            {
              isCompletelyDisabled: stylesProcessingSettings__fromFile__rawValid.linting.disableCompletely === true ?
                  true : !StylesProcessingSettings__Default.linting.mustExecute,
              ...isNotUndefined(stylesProcessingSettings__fromFile__rawValid.linting.presetFileRelativePath) ? {
                presetFileAbsolutePath: ImprovedPath.buildAbsolutePath(
                  [
                    commonSettings__normalized.projectRootDirectoryAbsolutePath,
                    StlintLinterSpecialist.DEFAULT_CONFIG_FILE_NAME_WITH_EXTENSION
                  ],
                  { forwardSlashOnlySeparators: true }
                )
              } : null
            };

    const dataHoldingSelfInstance: StylesProcessingRawSettingsNormalizer =
        new StylesProcessingRawSettingsNormalizer({
          consumingProjectBuildingMode: commonSettings__normalized.projectBuildingMode,
          consumingProjectRootDirectoryAbsolutePath: commonSettings__normalized.projectRootDirectoryAbsolutePath,
          ...isNotUndefined(commonSettings__normalized.tasksAndSourceFilesSelection) ? {
            entryPointsGroupsIDsSelection: commonSettings__normalized.tasksAndSourceFilesSelection.stylesProcessing
          } : {},
          lintingCommonSettings
        });

    return {
      common: {
        supportedSourceFileNameExtensionsWithoutLeadingDots:
            StylesProcessingRestrictions.supportedSourceFileNameExtensionsWithoutLeadingDots,
        supportedOutputFileNameExtensionsWithoutLeadingDots:
            StylesProcessingRestrictions.supportedOutputFileNameExtensionsWithoutLeadingDots,
        waitingForSubsequentFilesWillBeSavedPeriod__seconds:
          stylesProcessingSettings__fromFile__rawValid.common?.waitingForSubsequentFilesWillBeSavedPeriod__seconds ??
          StylesProcessingSettings__Default.waitingForSubsequentFilesWillBeSavedPeriod__seconds
      },
      linting: lintingCommonSettings,
      entryPointsGroupsActualForCurrentProjectBuildingMode:
          dataHoldingSelfInstance.createNormalizedEntryPointsGroupsSettings(
            stylesProcessingSettings__fromFile__rawValid.entryPointsGroups,
            dataHoldingSelfInstance.
                completeEntryPointsGroupNormalizedSettingsCommonPropertiesUntilStylesEntryPointsGroupNormalizedSettings.
                bind(dataHoldingSelfInstance)
          )
    };
  }


  private constructor(
    namedParameters:
        SourceCodeProcessingRawSettingsNormalizer.ConstructorParameters &
        {
          lintingCommonSettings: StylesProcessingSettings__Normalized.Linting;
        }
  ) {

    super(namedParameters);

    this.lintingCommonSettings = namedParameters.lintingCommonSettings;
  }


  private completeEntryPointsGroupNormalizedSettingsCommonPropertiesUntilStylesEntryPointsGroupNormalizedSettings(
    entryPointsGroupGenericSettings__normalized: ProjectBuildingConfig__Normalized.EntryPointsGroupGenericSettings,
    entryPointsGroupSettings__rawValid: StylesProcessingSettings__FromFile__RawValid.EntryPointsGroup
  ): StylesProcessingSettings__Normalized.EntryPointsGroup {

    return {

      ...entryPointsGroupGenericSettings__normalized,

      entryPointsSourceFilesTopDirectoryOrSingleFilePathAliasForReferencingFromHTML:
          `${ StylesProcessingSettings__Default.filePathAliasNotation }` +
          `${
            entryPointsGroupSettings__rawValid.
                entryPointsSourceFilesTopDirectoryOrSingleFilePathAliasNameForReferencingFromHTML ??
            entryPointsGroupGenericSettings__normalized.ID
          }`,

      revisioning: {

        mustExecute:
            entryPointsGroupSettings__rawValid.buildingModeDependent[this.consumingProjectBuildingMode].
                revisioning?.disable === true ?
                    false : StylesProcessingSettings__Default.revisioning.mustExecute(this.consumingProjectBuildingMode),
        contentHashPostfixSeparator:
            entryPointsGroupSettings__rawValid.buildingModeDependent[this.consumingProjectBuildingMode].
                revisioning?.contentHashPostfixSeparator ??
            StylesProcessingSettings__Default.revisioning.contentHashPostfixSeparator
      },

      linting: {
        mustExecute: ((): boolean => {

          if (this.lintingCommonSettings.isCompletelyDisabled) {
            return false;
          }


          if (isUndefined(entryPointsGroupSettings__rawValid.linting)) {
            return StylesProcessingSettings__Default.linting.mustExecute;
          }


          if (isBoolean(entryPointsGroupSettings__rawValid.linting.disable)) {
            return !entryPointsGroupSettings__rawValid.linting.disable;
          }


          return StylesProcessingSettings__Default.linting.mustExecute;
        })()
      }
    };
  }
}
