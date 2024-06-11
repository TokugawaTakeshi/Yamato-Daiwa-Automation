/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import ECMA_ScriptLogicProcessingRestrictions from "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingRestrictions";
import SupportedECMA_ScriptRuntimesTypes = ECMA_ScriptLogicProcessingRestrictions.SupportedECMA_ScriptRuntimesTypes;
import ConsumingProjectBuildingModes from "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";

/* ─── Default Settings ───────────────────────────────────────────────────────────────────────────────────────────── */
import ECMA_ScriptLogicProcessingSettings__Default from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettings__Default";

/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import type ECMA_ScriptLogicProcessingSettings__FromFile__RawValid from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettings__FromFile__RawValid";

/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type SourceCodeProcessingGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/SourceCodeProcessingGenericProperties__Normalized";
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding:Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";
import type ECMA_ScriptLogicProcessingSettings__Normalized from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettings__Normalized";

/* ─── Settings Normalizers ───────────────────────────────────────────────────────────────────────────────────────── */
import SourceCodeProcessingRawSettingsNormalizer from
    "@ProjectBuilding:Common/RawSettingsNormalizers/SourceCodeProcessingRawSettingsNormalizer";
import RevisioningSettingsNormalizer from
    "@ProjectBuilding/Common/RawSettingsNormalizers/Reusables/RevisioningSettingsNormalizer";

/* ─── Third-party Solutions Specialists ──────────────────────────────────────────────────────────────────────────── */
import TypeScriptSpecialist from "@ThirdPartySolutionsSpecialists/TypeScriptSpecialist";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import type TypeScript from "typescript";
import { isUndefined, isNotUndefined } from "@yamato-daiwa/es-extensions";
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


export default class ECMA_ScriptLogicProcessingRawSettingsNormalizer extends SourceCodeProcessingRawSettingsNormalizer {

  protected supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: ReadonlyArray<string> =
      ECMA_ScriptLogicProcessingRestrictions.supportedSourceFilesNamesExtensionsWithoutLeadingDots;

  protected readonly cachedTypeScriptConfigurationsFilesRelativePathsAndCorrespondingCompilersOptions:
      Map<string, TypeScript.CompilerOptions> = new Map();


  public static normalize(
    {
      ECMA_ScriptLogicProcessingSettings__fromFile__rawValid,
      commonSettings__normalized
    }: Readonly<{
      ECMA_ScriptLogicProcessingSettings__fromFile__rawValid: ECMA_ScriptLogicProcessingSettings__FromFile__RawValid;
      commonSettings__normalized: ProjectBuildingCommonSettings__Normalized;
    }>
  ): ECMA_ScriptLogicProcessingSettings__Normalized {

    const dataHoldingSelfInstance: ECMA_ScriptLogicProcessingRawSettingsNormalizer =
        new ECMA_ScriptLogicProcessingRawSettingsNormalizer({
          projectBuildingCommonSettings__normalized: commonSettings__normalized,
          ...isNotUndefined(commonSettings__normalized.tasksAndSourceFilesSelection) ? {
            entryPointsGroupsIDsSelection: commonSettings__normalized.tasksAndSourceFilesSelection.ECMA_ScriptLogicProcessing
          } : null
        });

    const relevantEntryPointsGroups: ReadonlyMap<
      SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup.ID,
      ECMA_ScriptLogicProcessingSettings__Normalized.EntryPointsGroup
    > = dataHoldingSelfInstance.createNormalizedEntryPointsGroupsSettings(
      ECMA_ScriptLogicProcessingSettings__fromFile__rawValid.entryPointsGroups,
      dataHoldingSelfInstance.
          /* eslint-disable-next-line max-len -- Unable to split this line to multiple. */
          completeEntryPointsGroupNormalizedSettingsCommonPropertiesUntilECMA_ScriptLogicEntryPointsGroupNormalizedSettings.
          bind(dataHoldingSelfInstance)
    );

    const lintingSettings__fromFile__rawValid: ECMA_ScriptLogicProcessingSettings__FromFile__RawValid.Linting =
        ECMA_ScriptLogicProcessingSettings__fromFile__rawValid.linting ?? {};


    return {

      common: {

        supportedSourceFileNameExtensionsWithoutLeadingDots:
            ECMA_ScriptLogicProcessingRestrictions.supportedSourceFilesNamesExtensionsWithoutLeadingDots,

        supportedOutputFileNameExtensionsWithoutLeadingDots:
            ECMA_ScriptLogicProcessingRestrictions.supportedOutputFilesNamesExtensionsWithoutLeadingDots

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

      relevantEntryPointsGroups,

      ...dataHoldingSelfInstance.normalizeLocalDevelopmentServerOrchestrationSettingsIfAny(
        relevantEntryPointsGroups,
        ECMA_ScriptLogicProcessingSettings__fromFile__rawValid.localDevelopmentServerOrchestration
      ),

      logging: {

        filesPaths:
            ECMA_ScriptLogicProcessingSettings__fromFile__rawValid.logging?.filesPaths ??
            ECMA_ScriptLogicProcessingSettings__Default.logging.filesPaths,

        filesCount:
            ECMA_ScriptLogicProcessingSettings__fromFile__rawValid.logging?.filesCount ??
            ECMA_ScriptLogicProcessingSettings__Default.logging.filesCount,

        partialFilesAndParentEntryPointsCorrespondence:
            ECMA_ScriptLogicProcessingSettings__fromFile__rawValid.logging?.filesWatcherEvents ??
            ECMA_ScriptLogicProcessingSettings__Default.logging.partialFilesAndParentEntryPointsCorrespondence,

        filesWatcherEvents:
            ECMA_ScriptLogicProcessingSettings__fromFile__rawValid.logging?.filesWatcherEvents ??
            ECMA_ScriptLogicProcessingSettings__Default.logging.filesWatcherEvents,

        linting: {

          starting:
              ECMA_ScriptLogicProcessingSettings__fromFile__rawValid.logging?.linting.starting ??
              ECMA_ScriptLogicProcessingSettings__Default.logging.linting.starting,

          completionWithoutIssues:
              ECMA_ScriptLogicProcessingSettings__fromFile__rawValid.logging?.linting.completionWithoutIssues ??
              ECMA_ScriptLogicProcessingSettings__Default.logging.linting.completionWithoutIssues

        }

      }

    };

  }


  private completeEntryPointsGroupNormalizedSettingsCommonPropertiesUntilECMA_ScriptLogicEntryPointsGroupNormalizedSettings(
    entryPointsGroupGenericSettings__normalized: SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup,
    entryPointsGroupSettings__rawValid: ECMA_ScriptLogicProcessingSettings__FromFile__RawValid.EntryPointsGroup
  ): ECMA_ScriptLogicProcessingSettings__Normalized.EntryPointsGroup {

    const distributingSettings__rawValid: ECMA_ScriptLogicProcessingSettings__FromFile__RawValid.
        EntryPointsGroup.Distributing | undefined =
            entryPointsGroupSettings__rawValid.distributing;

    const typeScriptConfigurationFileRelativePath: string = ImprovedPath.replacePathSeparatorsToForwardSlashes(
      entryPointsGroupSettings__rawValid.typeScriptConfigurationFileRelativePath ??
      ECMA_ScriptLogicProcessingSettings__Default.typeScriptConfigurationFileRelativePath
    );

    const typeScriptConfigurationFileAbsolutePath: string = ImprovedPath.joinPathSegments(
      [ this.consumingProjectRootDirectoryAbsolutePath, typeScriptConfigurationFileRelativePath ],
      { alwaysForwardSlashSeparators: true }
    );

    const typeScriptCompilerOptions: Readonly<TypeScript.CompilerOptions> =
        this.cachedTypeScriptConfigurationsFilesRelativePathsAndCorrespondingCompilersOptions.
            get(typeScriptConfigurationFileRelativePath) ??
        this.readAndCacheTypeScriptCompilerOptions({
          typeScriptConfigurationFileAbsolutePath,
          typeScriptConfigurationFileRelativePath
        });

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

      ...isNotUndefined(
        entryPointsGroupSettings__rawValid.
            associatedMarkupEntryPointsGroupID_ForDynamicModulesLoadingWithoutDevelopmentServer
      ) ?
          {
            associatedMarkupEntryPointsGroupID_ForDynamicModulesLoadingWithoutDevelopmentServer:
                entryPointsGroupSettings__rawValid.
                    associatedMarkupEntryPointsGroupID_ForDynamicModulesLoadingWithoutDevelopmentServer
          } : null,

      typeScriptConfigurationFileAbsolutePath,

      typeScriptCompilerOptions,

      directoriesAliasesAndCorrespondingAbsolutePathsMap: ECMA_ScriptLogicProcessingRawSettingsNormalizer.
          createDirectoriesAliasesAndCorrespondingAbsolutePathsMap(
            typeScriptConfigurationFileAbsolutePath,
            typeScriptCompilerOptions
          ),

      revisioning: RevisioningSettingsNormalizer.normalize({
        revisioningSettings__rawValid: entryPointsGroupSettings__rawValid.
            buildingModeDependent[this.consumingProjectBuildingMode].revisioning,
        revisioningSettings__default: {
          mustExecute: (
            { consumingProjectBuildingMode }: Readonly<{ consumingProjectBuildingMode: ConsumingProjectBuildingModes; }>
          ): boolean =>
              ECMA_ScriptLogicProcessingSettings__Default.revisioning.mustExecute({
                consumingProjectBuildingMode,
                targetRuntimeType: entryPointsGroupSettings__rawValid.targetRuntime.type
              }),
          contentHashPostfixSeparator: ECMA_ScriptLogicProcessingSettings__Default.revisioning.contentHashPostfixSeparator
        },
        consumingProjectBuildingMode: this.consumingProjectBuildingMode
      }),

      ...isNotUndefined(distributingSettings__rawValid) ? {

        distributing: {

          exposingOfExportsFromEntryPoints: {
            mustExpose: distributingSettings__rawValid.exposingOfExportsFromEntryPoints?.mustExpose ??
                ECMA_ScriptLogicProcessingSettings__Default.distributing.exposingOfExportsFromEntryPoints.mustExpose,
            namespace: distributingSettings__rawValid.exposingOfExportsFromEntryPoints?.namespace,
            mustAssignToWindowObject: distributingSettings__rawValid.exposingOfExportsFromEntryPoints?.mustAssignToWindowObject ??
                ECMA_ScriptLogicProcessingSettings__Default.distributing.exposingOfExportsFromEntryPoints.mustAssignToWindowObject
          },

          externalizingDependencies: distributingSettings__rawValid.externalizingDependencies ?? [],

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

  private normalizeLocalDevelopmentServerOrchestrationSettingsIfAny(
    relevantEntryPointsGroups: ReadonlyMap<
      SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup.ID,
      ECMA_ScriptLogicProcessingSettings__Normalized.EntryPointsGroup
    >,
    localDevelopmentServerOrchestrationSettings__rawValid?:
        ECMA_ScriptLogicProcessingSettings__FromFile__RawValid.LocalDevelopmentServerOrchestration
  ): {
    localDevelopmentServerOrchestration: ECMA_ScriptLogicProcessingSettings__Normalized.LocalDevelopmentServerOrchestration;
  } | null {

    if (
      this.projectBuildingCommonSettings__normalized.projectBuildingMode !== ConsumingProjectBuildingModes.localDevelopment ||
      isUndefined(localDevelopmentServerOrchestrationSettings__rawValid)
    ) {
      return null;
    }


    const targetEntryPointsGroup: ECMA_ScriptLogicProcessingSettings__Normalized.EntryPointsGroup | undefined =
        relevantEntryPointsGroups.get(localDevelopmentServerOrchestrationSettings__rawValid.targetSingularEntryPointsGroupID);

    if (isUndefined(targetEntryPointsGroup) || !targetEntryPointsGroup.isSingeEntryPointGroup) {
      return null;
    }


    return {

      localDevelopmentServerOrchestration: {

        targetSourceFileAbsolutePath: targetEntryPointsGroup.sourceFilesGlobSelectors[0],

        arguments: localDevelopmentServerOrchestrationSettings__rawValid.arguments ?? [],

        environmentVariables: localDevelopmentServerOrchestrationSettings__rawValid.environmentVariables ?? {}

      }

    };

  }

  private readAndCacheTypeScriptCompilerOptions(
    {
      typeScriptConfigurationFileAbsolutePath,
      typeScriptConfigurationFileRelativePath
    }: Readonly<{
      typeScriptConfigurationFileAbsolutePath: string;
      typeScriptConfigurationFileRelativePath: string;
    }>

  ): TypeScript.CompilerOptions {

    const typeScriptCompilerOptions: TypeScript.CompilerOptions = TypeScriptSpecialist.
        readTypeScriptConfigurationFileAndGetCompilerOptions(typeScriptConfigurationFileAbsolutePath);

    this.cachedTypeScriptConfigurationsFilesRelativePathsAndCorrespondingCompilersOptions.set(
      typeScriptConfigurationFileRelativePath, typeScriptCompilerOptions
    );

    return typeScriptCompilerOptions;

  }

  private static createDirectoriesAliasesAndCorrespondingAbsolutePathsMap(
    typeScriptConfigurationFileAbsolutePath: string,
    typeScriptCompilerOptions: Readonly<TypeScript.CompilerOptions>
  ): ReadonlyMap<string, ReadonlyArray<string>> {

    /* [ TypeScript theory ] If `baseUrl` has been specified in configuration file, once parsed, it will be the
     +   absolute path herewith forward slashes path separators. */
    const typeScriptBasicAbsolutePath: string =
        typeScriptCompilerOptions.baseUrl ??
        ImprovedPath.extractDirectoryFromFilePath({
          targetPath: typeScriptConfigurationFileAbsolutePath,
          alwaysForwardSlashSeparators: true,
          ambiguitiesResolution: {
            mustConsiderLastSegmentWihtoutDotsAsFileNameWithoutExtension: true,
            mustConsiderLastSegmentStartingWithDotAsDirectory: false,
            mustConsiderLastSegmentWithNonLeadingDotAsDirectory: false
          }
        });

    return new Map<string, ReadonlyArray<string>>(
      Object.entries(typeScriptCompilerOptions.paths ?? {}).map(
        ([ rawAlias, rawPaths ]: [ string, ReadonlyArray<string> ]): [ string, ReadonlyArray<string> ] => [
          rawAlias.endsWith("/*") ? rawAlias.slice(0, -"/*".length) : rawAlias,
          rawPaths.map(
            (rawPath: string): string => ImprovedPath.joinPathSegments(
              [
                typeScriptBasicAbsolutePath,
                ...rawPath.endsWith("/*") ? [ rawPath.slice(0, -"/*".length) ] : [ rawPath ]
              ],
              { alwaysForwardSlashSeparators: true }
            )
          )
        ]
      )
    );

  }

}
