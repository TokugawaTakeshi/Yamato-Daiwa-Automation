/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import StylesProcessingRestrictions from "@StylesProcessing/StylesProcessingRestrictions";

/* ─── Default Settings ───────────────────────────────────────────────────────────────────────────────────────────── */
import StylesProcessingSettings__Default from "@StylesProcessing/StylesProcessingSettings__Default";

/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import type StylesProcessingSettings__FromFile__RawValid from
    "@StylesProcessing/StylesProcessingSettings__FromFile__RawValid";

/* ─── Third-party Solutions Specialises ──────────────────────────────────────────────────────────────────────────── */
import StlintLinterSpecialist from "@ThirdPartySolutionsSpecialists/StlintLinterSpecialist";

/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type SourceCodeProcessingGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/SourceCodeProcessingGenericProperties__Normalized";
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding:Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";
import type StylesProcessingSettings__Normalized from "@StylesProcessing/StylesProcessingSettings__Normalized";

/* ─── Settings normalizers ───────────────────────────────────────────────────────────────────────────────────────── */
import SourceCodeProcessingRawSettingsNormalizer from
    "@ProjectBuilding:Common/RawSettingsNormalizers/SourceCodeProcessingRawSettingsNormalizer";
import RevisioningSettingsNormalizer from
    "@ProjectBuilding/Common/RawSettingsNormalizers/Reusables/RevisioningSettingsNormalizer";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { isUndefined, isNotUndefined } from "@yamato-daiwa/es-extensions";
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


export default class StylesProcessingRawSettingsNormalizer extends SourceCodeProcessingRawSettingsNormalizer {

  protected supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: ReadonlyArray<string> =
      StylesProcessingRestrictions.supportedSourceFilesNamesExtensionsWithoutLeadingDots;


  public static normalize(
    {
      stylesProcessingSettings__fromFile__rawValid,
      commonSettings__normalized
    }: Readonly<{
      stylesProcessingSettings__fromFile__rawValid: StylesProcessingSettings__FromFile__RawValid;
      commonSettings__normalized: ProjectBuildingCommonSettings__Normalized;
    }>
  ): StylesProcessingSettings__Normalized {

    const dataHoldingSelfInstance: StylesProcessingRawSettingsNormalizer =
        new StylesProcessingRawSettingsNormalizer({
          projectBuildingCommonSettings__normalized: commonSettings__normalized,
          ...isNotUndefined(commonSettings__normalized.tasksAndSourceFilesSelection) ? {
            entryPointsGroupsIDsSelection: commonSettings__normalized.tasksAndSourceFilesSelection.stylesProcessing
          } : {}
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

      linting: isUndefined(stylesProcessingSettings__fromFile__rawValid.linting) ?
          {
            mustExecute: StylesProcessingSettings__Default.linting.mustExecute
          } :
          {
            mustExecute:
                stylesProcessingSettings__fromFile__rawValid.linting.enable ??
                StylesProcessingSettings__Default.linting.mustExecute,
            ...isNotUndefined(stylesProcessingSettings__fromFile__rawValid.linting.presetFileRelativePath) ? {
              presetFileAbsolutePath: ImprovedPath.joinPathSegments(
                [
                  commonSettings__normalized.projectRootDirectoryAbsolutePath,
                  StlintLinterSpecialist.DEFAULT_CONFIG_FILE_NAME_WITH_EXTENSION
                ],
                { alwaysForwardSlashSeparators: true }
              )
            } : null
          },

      relevantEntryPointsGroups:
          dataHoldingSelfInstance.createNormalizedEntryPointsGroupsSettings(
            stylesProcessingSettings__fromFile__rawValid.entryPointsGroups,
            dataHoldingSelfInstance.
                completeEntryPointsGroupNormalizedSettingsCommonPropertiesUntilStylesEntryPointsGroupNormalizedSettings.
                bind(dataHoldingSelfInstance)
          ),

      logging: {

        filesPaths:
            stylesProcessingSettings__fromFile__rawValid.logging?.filesPaths ??
            StylesProcessingSettings__Default.logging.filesPaths,

        filesCount:
            stylesProcessingSettings__fromFile__rawValid.logging?.filesCount ??
            StylesProcessingSettings__Default.logging.filesCount,

        partialFilesAndParentEntryPointsCorrespondence:
            stylesProcessingSettings__fromFile__rawValid.logging?.partialFilesAndParentEntryPointsCorrespondence ??
            StylesProcessingSettings__Default.logging.partialFilesAndParentEntryPointsCorrespondence,

        filesWatcherEvents:
            stylesProcessingSettings__fromFile__rawValid.logging?.filesWatcherEvents ??
            StylesProcessingSettings__Default.logging.filesWatcherEvents,

        linting: {

          starting:
              stylesProcessingSettings__fromFile__rawValid.logging?.linting.starting ??
              StylesProcessingSettings__Default.logging.linting.starting,

          completionWithoutIssues:
              stylesProcessingSettings__fromFile__rawValid.logging?.linting.completionWithoutIssues ??
              StylesProcessingSettings__Default.logging.linting.completionWithoutIssues

        }

      }

    };

  }


  private constructor(
    constructorParameter: SourceCodeProcessingRawSettingsNormalizer.ConstructorParameter
  ) {
    super(constructorParameter);
  }


  private completeEntryPointsGroupNormalizedSettingsCommonPropertiesUntilStylesEntryPointsGroupNormalizedSettings(
    entryPointsGroupGenericSettings__normalized: SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup,
    entryPointsGroupSettings__rawValid: StylesProcessingSettings__FromFile__RawValid.EntryPointsGroup
  ): StylesProcessingSettings__Normalized.EntryPointsGroup {

    return {

      ...entryPointsGroupGenericSettings__normalized,

      revisioning: RevisioningSettingsNormalizer.normalize({
        revisioningSettings__rawValid: entryPointsGroupSettings__rawValid.
            buildingModeDependent[this.consumingProjectBuildingMode].revisioning,
        revisioningSettings__default: {
          mustExecute: StylesProcessingSettings__Default.revisioning.mustExecute,
          contentHashPostfixSeparator: StylesProcessingSettings__Default.revisioning.contentHashPostfixSeparator
        },
        consumingProjectBuildingMode: this.consumingProjectBuildingMode
      })

    };

  }

}
