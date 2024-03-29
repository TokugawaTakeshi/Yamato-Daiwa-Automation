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
import { isUndefined, isNotUndefined } from "@yamato-daiwa/es-extensions";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";


export default class StylesProcessingRawSettingsNormalizer extends SourceCodeProcessingRawSettingsNormalizer {

  protected supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: ReadonlyArray<string> = StylesProcessingRestrictions.
      supportedSourceFilesNamesExtensionsWithoutLeadingDots;


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
              isCompletelyDisabled: stylesProcessingSettings__fromFile__rawValid.linting.enable === true ?
                  true : !StylesProcessingSettings__Default.linting.mustExecute,
              ...isNotUndefined(stylesProcessingSettings__fromFile__rawValid.linting.presetFileRelativePath) ? {
                presetFileAbsolutePath: ImprovedPath.joinPathSegments(
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
          projectBuildingCommonSettings__normalized: commonSettings__normalized,
          ...isNotUndefined(commonSettings__normalized.tasksAndSourceFilesSelection) ? {
            entryPointsGroupsIDsSelection: commonSettings__normalized.tasksAndSourceFilesSelection.stylesProcessing
          } : {},
          lintingCommonSettings
        });

    return {
      common: {
        supportedSourceFileNameExtensionsWithoutLeadingDots:
            StylesProcessingRestrictions.supportedSourceFilesNamesExtensionsWithoutLeadingDots,
        supportedOutputFileNameExtensionsWithoutLeadingDots:
            StylesProcessingRestrictions.supportedOutputFilesNamesExtensionsWithoutLeadingDots,
        waitingForSubsequentFilesWillBeSavedPeriod__seconds:
          stylesProcessingSettings__fromFile__rawValid.common?.periodBetweenFileUpdatingAndRebuildingStarting__seconds ??
          StylesProcessingSettings__Default.periodBetweenFileUpdatingAndRebuildingStarting__seconds
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
  }


  private completeEntryPointsGroupNormalizedSettingsCommonPropertiesUntilStylesEntryPointsGroupNormalizedSettings(
    entryPointsGroupGenericSettings__normalized: ProjectBuildingConfig__Normalized.EntryPointsGroupGenericSettings,
    entryPointsGroupSettings__rawValid: StylesProcessingSettings__FromFile__RawValid.EntryPointsGroup
  ): StylesProcessingSettings__Normalized.EntryPointsGroup {

    return {

      ...entryPointsGroupGenericSettings__normalized,

      entryPointsSourceFilesTopDirectoryOrSingleFilePathAliasForReferencingFromHTML:
          `${ StylesProcessingSettings__Default.entryPointsGroupReferencePrefix }` +
          `${ entryPointsGroupSettings__rawValid.customReferenceName ?? entryPointsGroupGenericSettings__normalized.ID }`,

      revisioning: {

        mustExecute:
            entryPointsGroupSettings__rawValid.buildingModeDependent[this.consumingProjectBuildingMode].
                revisioning?.disable === true ?
                    false : StylesProcessingSettings__Default.revisioning.mustExecute({
                      consumingProjectBuildingMode: this.consumingProjectBuildingMode
                    }),
        contentHashPostfixSeparator:
            entryPointsGroupSettings__rawValid.buildingModeDependent[this.consumingProjectBuildingMode].
                revisioning?.contentHashPostfixSeparator ??
            StylesProcessingSettings__Default.revisioning.contentHashPostfixSeparator
      }
    };

  }
}
