/* --- Restrictions ------------------------------------------------------------------------------------------------- */
import ECMA_ScriptLogicProcessingRestrictions from "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingRestrictions";
import SupportedECMA_ScriptRuntimesTypes = ECMA_ScriptLogicProcessingRestrictions.SupportedECMA_ScriptRuntimesTypes;

/* --- Default settings --------------------------------------------------------------------------------------------- */
import ECMA_ScriptLogicProcessingSettings__Default from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettings__Default";

/* --- Raw valid settings ------------------------------------------------------------------------------------------- */
import type ECMA_ScriptLogicProcessingSettings__FromFile__RawValid from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettings__FromFile__RawValid";

/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding:Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";
import type ECMA_ScriptLogicProcessingSettings__Normalized from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettings__Normalized";

/* --- Settings normalizers ----------------------------------------------------------------------------------------- */
import SourceCodeProcessingRawSettingsNormalizer from
    "@ProjectBuilding:Common/RawSettingsNormalizers/SourceCodeProcessingRawSettingsNormalizer";

/* --- General auxiliaries ------------------------------------------------------------------------------------------ */
import { isNotUndefined } from "@yamato-daiwa/es-extensions";
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


export default class ECMA_ScriptLogicProcessingRawSettingsNormalizer extends SourceCodeProcessingRawSettingsNormalizer {

  protected supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: ReadonlyArray<string> =
      ECMA_ScriptLogicProcessingRestrictions.supportedSourceFilesNamesExtensionsWithoutLeadingDots;


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
          } : null
        });

    const lintingSettings__fromFile__rawValid: ECMA_ScriptLogicProcessingSettings__FromFile__RawValid.Linting =
        ECMA_ScriptLogicProcessingSettings__fromFile__rawValid.linting ?? {};


    return {

      common: {

        supportedSourceFileNameExtensionsWithoutLeadingDots:
            ECMA_ScriptLogicProcessingRestrictions.supportedSourceFilesNamesExtensionsWithoutLeadingDots,

        supportedOutputFileNameExtensionsWithoutLeadingDots:
            ECMA_ScriptLogicProcessingRestrictions.supportedOutputFilesNamesExtensionsWithoutLeadingDots,

        directoriesAliasesRelativePaths: ECMA_ScriptLogicProcessingSettings__fromFile__rawValid.common?.
            directoriesRelativePathsAliases ?? {},

        directoriesAliasesAbsolutePaths: ((): { [directoryAlias: string]: string; } => {

          const directoriesAliasesAbsolutePaths: { [directoryAlias: string]: string; } = {};

          for (
            const [ directoryAlias, directoryAliasRelativePath ] of
            Object.entries(ECMA_ScriptLogicProcessingSettings__fromFile__rawValid.common?.directoriesRelativePathsAliases ?? {})
          ) {
            directoriesAliasesAbsolutePaths[directoryAlias] = ImprovedPath.joinPathSegments(
              [ commonSettings__normalized.projectRootDirectoryAbsolutePath, directoryAliasRelativePath ],
              { alwaysForwardSlashSeparators: true }
            );
          }

          return directoriesAliasesAbsolutePaths;

        })()
      },

      linting: {

        mustExecute: ECMA_ScriptLogicProcessingSettings__fromFile__rawValid.linting?.enable ??
            ECMA_ScriptLogicProcessingSettings__Default.linting.mustExecute,

        ...isNotUndefined(lintingSettings__fromFile__rawValid.presetFileRelativePath) ? {
          presetFileAbsolutePath: ImprovedPath.joinPathSegments(
            [
              dataHoldingSelfInstance.consumingProjectRootDirectoryAbsolutePath,
              lintingSettings__fromFile__rawValid.presetFileRelativePath
            ],
            { alwaysForwardSlashSeparators: true }
          )
        } : null

      },

      relevantEntryPointsGroups:
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

    const distributingSettings__rawValid: ECMA_ScriptLogicProcessingSettings__FromFile__RawValid.EntryPointsGroup
        .Distributing | undefined = entryPointsGroupSettings__rawValid.distributing;

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

          case SupportedECMA_ScriptRuntimesTypes.pug: {
            return {
              type: SupportedECMA_ScriptRuntimesTypes.pug
            };
          }
        }

      })(),

      entryPointsSourceFilesTopDirectoryOrSingleFilePathAliasForReferencingFromHTML:
          `${ ECMA_ScriptLogicProcessingSettings__Default.entryPointsGroupReferencePrefix }` +
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

      typeScriptConfigurationFileAbsolutePath: ImprovedPath.joinPathSegments(
        [
          this.consumingProjectRootDirectoryAbsolutePath,
          entryPointsGroupSettings__rawValid.typeScriptConfigurationFileRelativePath ??
              ECMA_ScriptLogicProcessingSettings__Default.typeScriptConfigurationFileRelativePath
        ],
        { alwaysForwardSlashSeparators: true }
      ),

      revisioning: {
        mustExecute:
            entryPointsGroupSettings__rawValid.buildingModeDependent[this.consumingProjectBuildingMode].
                revisioning?.disable === true ?
                false : ECMA_ScriptLogicProcessingSettings__Default.revisioning.mustExecute({
                  consumingProjectBuildingMode: this.consumingProjectBuildingMode,
                  targetRuntimeType: entryPointsGroupSettings__rawValid.targetRuntime.type
                }),
        contentHashPostfixSeparator:
            entryPointsGroupSettings__rawValid.buildingModeDependent[this.consumingProjectBuildingMode].
                revisioning?.contentHashPostfixSeparator ??
            ECMA_ScriptLogicProcessingSettings__Default.revisioning.contentHashPostfixSeparator
      },

      ...isNotUndefined(distributingSettings__rawValid) ? {

        distributing: {

          exposingOfExportsFromEntryPoints: {
            mustExpose: distributingSettings__rawValid.exposingOfExportsFromEntryPoints?.mustExpose ??
                ECMA_ScriptLogicProcessingSettings__Default.distributing.exposingOfExportsFromEntryPoints.mustExpose,
            namespace: distributingSettings__rawValid.exposingOfExportsFromEntryPoints?.namespace
          },

          typeScriptTypesDeclarations: {
            mustGenerate: distributingSettings__rawValid.typeScriptTypesDeclarations?.mustGenerate ??
                ECMA_ScriptLogicProcessingSettings__Default.distributing.typeScriptTypesDeclarations.mustGenerate,
            fileNameWithoutExtension: distributingSettings__rawValid.typeScriptTypesDeclarations?.fileNameWithoutExtension ??
                ECMA_ScriptLogicProcessingSettings__Default.distributing.typeScriptTypesDeclarations.fileNameWithoutExtension
          }
        }

      } : null
    };
  }
}
