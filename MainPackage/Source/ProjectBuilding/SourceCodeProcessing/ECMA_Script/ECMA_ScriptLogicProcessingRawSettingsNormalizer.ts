/* --- Restrictions ------------------------------------------------------------------------------------------------- */
import ECMA_ScriptLogicProcessingRestrictions from "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingRestrictions";
import SupportedECMA_ScriptRuntimesTypes = ECMA_ScriptLogicProcessingRestrictions.SupportedECMA_ScriptRuntimesTypes;

/* --- Default settings --------------------------------------------------------------------------------------------- */
import ECMA_ScriptLogicProcessingSettings__Default from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettings__Default";

/* --- Raw settings ------------------------------------------------------------------------------------------------- */
import type ECMA_ScriptLogicProcessingSettings__FromFile__RawValid from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettings__FromFile__RawValid";

/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding:Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";
import type ECMA_ScriptLogicProcessingSettings__Normalized from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettings__Normalized";

/* --- Applied auxiliaries ------------------------------------------------------------------------------------------ */
import SourceCodeProcessingRawSettingsNormalizer from
    "@ProjectBuilding:Common/RawSettingsNormalizers/SourceCodeProcessingRawSettingsNormalizer";

/* --- General auxiliaries ------------------------------------------------------------------------------------------ */
import { isNotUndefined } from "@yamato-daiwa/es-extensions";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";


export default class ECMA_ScriptLogicProcessingRawSettingsNormalizer extends SourceCodeProcessingRawSettingsNormalizer {

  protected supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: Array<string> =
      ECMA_ScriptLogicProcessingRestrictions.supportedSourceFileNameExtensionsWithoutLeadingDots;


  public static normalize(
    {
      ECMA_ScriptLogicProcessingSettings__fromFile__rawValid,
      commonSettings__normalized
    }: {
      ECMA_ScriptLogicProcessingSettings__fromFile__rawValid: ECMA_ScriptLogicProcessingSettings__FromFile__RawValid;
      commonSettings__normalized: ProjectBuildingCommonSettings__Normalized;
    }
  ): ECMA_ScriptLogicProcessingSettings__Normalized {

    const dataHoldingSelfInstance: ECMA_ScriptLogicProcessingRawSettingsNormalizer =
        new ECMA_ScriptLogicProcessingRawSettingsNormalizer({
          consumingProjectBuildingMode: commonSettings__normalized.projectBuildingMode,
          consumingProjectRootDirectoryAbsolutePath: commonSettings__normalized.projectRootDirectoryAbsolutePath,
          ...isNotUndefined(commonSettings__normalized.tasksAndSourceFilesSelection) ? {
            entryPointsGroupsIDsSelection: commonSettings__normalized.tasksAndSourceFilesSelection.ECMA_ScriptLogicProcessing
          } : {}
        });

    const lintingSettings__fromFile__rawValid: ECMA_ScriptLogicProcessingSettings__FromFile__RawValid.Linting =
        ECMA_ScriptLogicProcessingSettings__fromFile__rawValid.linting ?? {};


    return {

      common: {

        supportedSourceFileNameExtensionsWithoutLeadingDots:
            ECMA_ScriptLogicProcessingRestrictions.supportedSourceFileNameExtensionsWithoutLeadingDots,

        supportedOutputFileNameExtensionsWithoutLeadingDots:
            ECMA_ScriptLogicProcessingRestrictions.supportedOutputFileNameExtensionsWithoutLeadingDots,

        directoriesAliasesRelativePaths: ECMA_ScriptLogicProcessingSettings__fromFile__rawValid.common?.
            directoriesRelativePathsAliases ?? {},

        directoriesAliasesAbsolutePaths: ((): { [directoryAlias: string]: string; } => {

          const directoriesAliasesAbsolutePaths: { [directoryAlias: string]: string; } = {};

          for (
            const [ directoryAlias, directoryAliasRelativePath ] of
            Object.entries(ECMA_ScriptLogicProcessingSettings__fromFile__rawValid.common?.directoriesRelativePathsAliases ?? {})
          ) {
            directoriesAliasesAbsolutePaths[directoryAlias] = ImprovedPath.buildAbsolutePath(
              [ commonSettings__normalized.projectRootDirectoryAbsolutePath, directoryAliasRelativePath ],
              { forwardSlashOnlySeparators: true }
            );
          }

          return directoriesAliasesAbsolutePaths;
        })()
      },

      linting: {
        ...isNotUndefined(lintingSettings__fromFile__rawValid.presetFileRelativePath) ? {
          presetFileAbsolutePath: ImprovedPath.buildAbsolutePath(
          [
            dataHoldingSelfInstance.consumingProjectRootDirectoryAbsolutePath,
            lintingSettings__fromFile__rawValid.presetFileRelativePath
          ],
          { forwardSlashOnlySeparators: true }
          )
        } : null,
        isCompletelyDisabled: lintingSettings__fromFile__rawValid.disableCompletely === true ?
            true : !ECMA_ScriptLogicProcessingSettings__Default.linting.mustExecute
      },

      entryPointsGroups:
          dataHoldingSelfInstance.createNormalizedEntryPointsGroupsSettings(
            ECMA_ScriptLogicProcessingSettings__fromFile__rawValid.entryPointsGroups,
            dataHoldingSelfInstance.
                /* eslint-disable-next-line max-len -- Unable to split this line to multiple. */
                completeEntryPointsGroupNormalizedSettingsCommonPropertiesUntilECMA_ScriptLogicEntryPointsGroupNormalizedSettings.
                bind(dataHoldingSelfInstance)
          )
    };
  }


  private completeEntryPointsGroupNormalizedSettingsCommonPropertiesUntilECMA_ScriptLogicEntryPointsGroupNormalizedSettings(
    entryPointsGroupGenericSettings__normalized: ProjectBuildingConfig__Normalized.EntryPointsGroupGenericSettings,
    entryPointsGroupSettings__rawValid: ECMA_ScriptLogicProcessingSettings__FromFile__RawValid.EntryPointsGroup
  ): ECMA_ScriptLogicProcessingSettings__Normalized.EntryPointsGroup {

    return {

      ...entryPointsGroupGenericSettings__normalized,

      targetRuntime: ((): ECMA_ScriptLogicProcessingSettings__Normalized.EntryPointsGroup.Runtime => {

        switch (entryPointsGroupSettings__rawValid.targetRuntime.type) {

          case SupportedECMA_ScriptRuntimesTypes.browser: {
            return {
              type: SupportedECMA_ScriptRuntimesTypes.browser
            };
          }

          case SupportedECMA_ScriptRuntimesTypes.webWorker: {
            return {
              type: SupportedECMA_ScriptRuntimesTypes.webWorker
            };
          }

          case SupportedECMA_ScriptRuntimesTypes.nodeJS: {
            return {
              type: SupportedECMA_ScriptRuntimesTypes.nodeJS,
              minimalVersion: {
                major: entryPointsGroupSettings__rawValid.targetRuntime.minimalVersion.major,
                ...isNotUndefined(entryPointsGroupSettings__rawValid.targetRuntime.minimalVersion.minor) ? {
                  minor: entryPointsGroupSettings__rawValid.targetRuntime.minimalVersion.minor
                } : null
              }
            };
          }
        }

      })(),

      entryPointsSourceFilesTopDirectoryOrSingleFilePathAliasForReferencingFromHTML:
          `${ ECMA_ScriptLogicProcessingSettings__Default.filePathAliasNotation }` +
          `${
            entryPointsGroupSettings__rawValid.
                entryPointsSourceFilesTopDirectoryOrSingleFilePathAliasNameForReferencingFromHTML ??
            entryPointsGroupGenericSettings__normalized.ID
          }`,

      ...isNotUndefined(
        entryPointsGroupSettings__rawValid.
            associatedMarkupEntryPointsGroupID_ForModulesDynamicLoadingWithoutDevelopmentServer
      ) ?
          {
            associatedMarkupEntryPointsGroupID_ForModulesDynamicLoadingWithoutDevelopmentServer:
                entryPointsGroupSettings__rawValid.
                    associatedMarkupEntryPointsGroupID_ForModulesDynamicLoadingWithoutDevelopmentServer
          } : null,

      ...isNotUndefined(entryPointsGroupSettings__rawValid.typeScriptConfigurationFileRelativePath) ? {
        typeScriptConfigurationFileAbsolutePath: ImprovedPath.buildAbsolutePath(
          [
            this.consumingProjectRootDirectoryAbsolutePath,
            entryPointsGroupSettings__rawValid.typeScriptConfigurationFileRelativePath
          ],
          { forwardSlashOnlySeparators: true }
        )
      } : null,

      revisioning: {
        mustExecute:
            entryPointsGroupSettings__rawValid.buildingModeDependent[this.consumingProjectBuildingMode].
                revisioning?.disable === true ?
                false : ECMA_ScriptLogicProcessingSettings__Default.revisioning.mustExecute(this.consumingProjectBuildingMode),
        contentHashPostfixSeparator:
            entryPointsGroupSettings__rawValid.buildingModeDependent[this.consumingProjectBuildingMode].
                revisioning?.contentHashPostfixSeparator ??
            ECMA_ScriptLogicProcessingSettings__Default.revisioning.contentHashPostfixSeparator
      }
    };
  }
}
