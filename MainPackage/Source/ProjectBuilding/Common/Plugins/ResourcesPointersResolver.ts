/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import PROCESSABLE_FILES_POINTER_ALIAS_PREFIX from
    "@ProjectBuilding/Common/Restrictions/ResourcesReferences/PROCESSABLE_FILES_POINTER_ALIAS_PREFIX";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import {
  appendFragmentToURI,
  appendLastFileNameExtension,
  explodeURI_PathToSegments,
  extractLastExtensionOfFileName,
  filterMap,
  getURI_Fragment,
  getURI_PartWithoutFragment,
  isNull,
  isUndefined,
  Logger,
  stringifyAndFormatArbitraryValue,
  type WarningLog
} from "@yamato-daiwa/es-extensions";
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";

/* ─── Localization ───────────────────────────────────────────────────────────────────────────────────────────────── */
import resourcesPointersResolverLocalization__english from "./ResourcesPointersResolverLocalization.english";


abstract class ResourcesPointersResolver {

  public static localization: ResourcesPointersResolver.Localization = resourcesPointersResolverLocalization__english;

  protected static resolveOutputResourceFileAbsolutePathIfPossible(
    {
      pickedPathOfTargetResourceFile,
      sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap,
      supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots,
      sourceAndOutputFilesAbsolutePathsCorrespondenceMap,
      fileTypeForLogging__singularForm,
      fileTypeForLogging__pluralForm
    }: Readonly<{
      pickedPathOfTargetResourceFile: string;
      sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: ReadonlyMap<string, string>;
      supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: ReadonlyArray<string>;
      sourceAndOutputFilesAbsolutePathsCorrespondenceMap: ReadonlyMap<string, string>;
      fileTypeForLogging__singularForm: string;
      fileTypeForLogging__pluralForm: string;
    }>
  ): string | null {

    const segmentsOfPickedPath: ReadonlyArray<string> = explodeURI_PathToSegments(pickedPathOfTargetResourceFile);
    const firstSegmentOfPickedPath: string | undefined = segmentsOfPickedPath[0];

    if (isUndefined(firstSegmentOfPickedPath)) {
      return null;
    }


    if (firstSegmentOfPickedPath.startsWith(PROCESSABLE_FILES_POINTER_ALIAS_PREFIX)) {

      const sourceFilesTopDirectoryAbsolutePathOfCurrentAlias: string | undefined =
          sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap.get(firstSegmentOfPickedPath);

      if (isUndefined(sourceFilesTopDirectoryAbsolutePathOfCurrentAlias)) {

        Logger.logWarning(
          ResourcesPointersResolver.localization.generateUnknownResourcesGroupAliasWarningLog({
            resourcesGroupAlias: firstSegmentOfPickedPath,
            resourceFileType__singularForm: fileTypeForLogging__singularForm,
            resourcePointer: pickedPathOfTargetResourceFile,
            resourceFileType__pluralForm: fileTypeForLogging__pluralForm,
            parentFilePathRelativeToConsumingProjectRootDirectory: "", // TODO
            formattedResourcesGroupsAliasesAndCorrespondingAbsolutePathsMap: stringifyAndFormatArbitraryValue(
              Array.from(sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap.entries())
            ) // TODO Improve the formatting
          })
        );

        return null;

      }


      const sourceFileComputedAbsolutePathPossiblyWithoutFileNameExtension: string = ImprovedPath.joinPathSegments(
        [ sourceFilesTopDirectoryAbsolutePathOfCurrentAlias, ...segmentsOfPickedPath.slice(1) ],
        { alwaysForwardSlashSeparators: true }
      );

      const explicitlySpecifiedLastFileNameExtensionWithoutDotOfSourceFile: string | null =
          extractLastExtensionOfFileName({
            targetPath: sourceFileComputedAbsolutePathPossiblyWithoutFileNameExtension,
            withLeadingDot: false
          });

      if (
        isNull(explicitlySpecifiedLastFileNameExtensionWithoutDotOfSourceFile) ||
        !supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots.
            includes(explicitlySpecifiedLastFileNameExtensionWithoutDotOfSourceFile)
      ) {

        const possibleAbsolutePathsOfTargetSourceFileWithoutFragment: Array<string> =
            supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots.map(
              (supportedStylesheetFileNameExtensionWithoutLeadingDot: string): string =>
                  getURI_PartWithoutFragment(
                    appendLastFileNameExtension({
                      targetPath: sourceFileComputedAbsolutePathPossiblyWithoutFileNameExtension,
                      targetFileNameExtensionWithOrWithoutLeadingDot: supportedStylesheetFileNameExtensionWithoutLeadingDot,
                      mustAppendDuplicateEvenIfTargetLastFileNameExtensionAlreadyPresentsAtSpecifiedPath: false
                    })
                  )
            );

        const searchingResultsInSourceFilesAbsolutePathsAndOutputFilesActualPathsMap: Map<string, string> = filterMap(
          sourceAndOutputFilesAbsolutePathsCorrespondenceMap,
          (sourceFileAbsolutePath: string): boolean =>
              possibleAbsolutePathsOfTargetSourceFileWithoutFragment.includes(sourceFileAbsolutePath)
        );

        if (searchingResultsInSourceFilesAbsolutePathsAndOutputFilesActualPathsMap.size === 0) {

          Logger.logWarning(
            ResourcesPointersResolver.localization.
                generateNoMatchesForResourceReferenceWihtoutExplicitSupportedFilenameExtensionWarningLog({
                  resourcePointer: pickedPathOfTargetResourceFile,
                  checkedAbsolutePathsOfTargetFilesFormattedList: stringifyAndFormatArbitraryValue(
                    possibleAbsolutePathsOfTargetSourceFileWithoutFragment
                  ),
                  resourceFileType__singularForm: fileTypeForLogging__singularForm
                }) // TODO Improve the formatting
          );

          return null;

        }


        return appendFragmentToURI({
          targetURI: Array.from(searchingResultsInSourceFilesAbsolutePathsAndOutputFilesActualPathsMap.values())[0],
          targetFragmentWithOrWithoutLeadingHash: getURI_Fragment({
            targetURI: sourceFileComputedAbsolutePathPossiblyWithoutFileNameExtension,
            withLeadingHash: false
          }),
          mustReplaceFragmentIfThereIsOneAlready: false
        });

      }

      const resolvedFileOutputAbsolutePath: string | undefined = sourceAndOutputFilesAbsolutePathsCorrespondenceMap.
          get(sourceFileComputedAbsolutePathPossiblyWithoutFileNameExtension);

      if (isUndefined(resolvedFileOutputAbsolutePath)) {

        Logger.logWarning(
          ResourcesPointersResolver.localization.generateFileNotFoundForResolvedResourceReferenceWarningLog({
            resourcePointer: pickedPathOfTargetResourceFile,
            resourceFileType__singularForm: fileTypeForLogging__singularForm,
            resolvedFileAbsolutePath: sourceFileComputedAbsolutePathPossiblyWithoutFileNameExtension
          })
        );

        return null;

      }


      return resolvedFileOutputAbsolutePath;

    }


    return null;

  }

}


namespace ResourcesPointersResolver {

  export type Localization = Readonly<{

    generateUnknownResourcesGroupAliasWarningLog: (
      templateVariables: Localization.UnknownResourcesGroupPointerWarningLog.TemplateVariables
    ) => Localization.UnknownResourcesGroupReferenceWarningLog;

    generateNoMatchesForResourceReferenceWihtoutExplicitSupportedFilenameExtensionWarningLog: (
      templateVariables: Localization.NoMatchesForAliasedFilePathWithoutFilenameExtensionWarningLog.TemplateVariables
    ) => Localization.NoMatchesForAliasedFilePathWithoutFilenameExtensionWarningLog;

    generateFileNotFoundForResolvedResourceReferenceWarningLog: (
      templateVariables: Localization.NoOutputFileExistingForSpecifiedSourceFilePathWarningLog.TemplateVariables
    ) => Localization.NoOutputFileExistingForSpecifiedSourceFilePathWarningLog;

  }>;

  export namespace Localization {

    export type UnknownResourcesGroupReferenceWarningLog = Readonly<Pick<WarningLog, "title" | "description">>;

    export namespace UnknownResourcesGroupPointerWarningLog {
      export type TemplateVariables = Readonly<{
        resourcePointer: string;
        resourcesGroupAlias: string;
        resourceFileType__singularForm: string;
        resourceFileType__pluralForm: string;
        parentFilePathRelativeToConsumingProjectRootDirectory: string;
        formattedResourcesGroupsAliasesAndCorrespondingAbsolutePathsMap: string;
      }>;
    }


    export type NoMatchesForAliasedFilePathWithoutFilenameExtensionWarningLog =
        Readonly<Pick<WarningLog, "title" | "description">>;

    export namespace NoMatchesForAliasedFilePathWithoutFilenameExtensionWarningLog {
      export type TemplateVariables = Readonly<{
        resourcePointer: string;
        resourceFileType__singularForm: string;
        checkedAbsolutePathsOfTargetFilesFormattedList: string;
      }>;
    }


    export type NoOutputFileExistingForSpecifiedSourceFilePathWarningLog =
        Readonly<Pick<WarningLog, "title" | "description">>;

    export namespace NoOutputFileExistingForSpecifiedSourceFilePathWarningLog {
      export type TemplateVariables = Readonly<{
        resourcePointer: string;
        resourceFileType__singularForm: string;
        resolvedFileAbsolutePath: string;
      }>;
    }

  }

}


export default ResourcesPointersResolver;
