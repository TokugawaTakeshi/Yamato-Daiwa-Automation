// /* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
// import PROCESSABLE_FILES_POINTER_ALIAS_PREFIX from
//     "@ProjectBuilding/Common/Restrictions/ResourcesReferences/PROCESSABLE_FILES_POINTER_ALIAS_PREFIX";
//
// /* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
// import {
//   appendLastFileNameExtension,
//   explodeURI_PathToSegments, extractLastExtensionOfFileName, getURI_PartWithoutFragment, isNull,
//   isUndefined,
//   Logger, stringifyAndFormatArbitraryValue,
//   type WarningLog
// } from "@yamato-daiwa/es-extensions";
// import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";
//
//
// abstract class ResourcesPointersResolver {
//
//   private static resolveOutputResourceFileAbsolutePathIfPossible(
//     {
//       pickedPathOfTargetResourceFile,
//       sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap,
//       supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots,
//       sourceAndOutputFilesAbsolutePathsCorrespondenceMap,
//       fileTypeForLogging__pluralForm
//     }: Readonly<{
//       pickedPathOfTargetResourceFile: string;
//       sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: ReadonlyMap<string, string>;
//       supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: ReadonlyArray<string>;
//       sourceAndOutputFilesAbsolutePathsCorrespondenceMap: ReadonlyMap<string, string>;
//       fileTypeForLogging__singularForm: string;
//       fileTypeForLogging__pluralForm: string;
//     }>
//   ): string | null {
//
//     const segmentsOfPickedPath: ReadonlyArray<string> = explodeURI_PathToSegments(pickedPathOfTargetResourceFile);
//     const firstSegmentOfPickedPath: string | undefined = segmentsOfPickedPath[0];
//
//     if (isUndefined(firstSegmentOfPickedPath)) {
//       return null;
//     }
//
//
//     if (firstSegmentOfPickedPath.startsWith(PROCESSABLE_FILES_POINTER_ALIAS_PREFIX)) {
//
//       const sourceFilesTopDirectoryAbsolutePathOfCurrentAlias: string | undefined =
//           sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap.get(firstSegmentOfPickedPath);
//
//       if (isUndefined(sourceFilesTopDirectoryAbsolutePathOfCurrentAlias)) {
//
//         Logger.logWarning(
//           PointersReferencesResolverForHTML.localization.generateUnknownResourceGroupReferenceWarningLog({
//             fileType__pluralForm: fileTypeForLogging__pluralForm,
//             firstPathSegment: firstSegmentOfPickedPath,
//             pickedPathOfTargetResourceFile,
//             formattedSourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: stringifyAndFormatArbitraryValue(
//                 Array.from(sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap.entries())
//             )
//           })
//         );
//
//         return null;
//
//       }
//
//
//       const sourceFileComputedAbsolutePathPossiblyWithoutFileNameExtension: string = ImprovedPath.joinPathSegments(
//         [ sourceFilesTopDirectoryAbsolutePathOfCurrentAlias, ...segmentsOfPickedPath.slice(1) ],
//         { alwaysForwardSlashSeparators: true }
//       );
//
//       const explicitlySpecifiedLastFileNameExtensionWithoutDotOfSourceFile: string | null =
//           extractLastExtensionOfFileName({
//             targetPath: sourceFileComputedAbsolutePathPossiblyWithoutFileNameExtension,
//             withLeadingDot: false
//           });
//
//       if (
//         isNull(explicitlySpecifiedLastFileNameExtensionWithoutDotOfSourceFile) ||
//         !supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots.
//             includes(explicitlySpecifiedLastFileNameExtensionWithoutDotOfSourceFile)
//       ) {
//
//         const possibleAbsolutePathsOfTargetSourceFileWithoutFragment: Array<string> =
//             supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots.map(
//               (supportedStylesheetFileNameExtensionWithoutLeadingDot: string): string =>
//                   getURI_PartWithoutFragment(
//                     appendLastFileNameExtension({
//                       targetPath: sourceFileComputedAbsolutePathPossiblyWithoutFileNameExtension,
//                       targetFileNameExtensionWithOrWithoutLeadingDot: supportedStylesheetFileNameExtensionWithoutLeadingDot,
//                       mustAppendDuplicateEvenIfTargetLastFileNameExtensionAlreadyPresentsAtSpecifiedPath: false
//                     })
//                   )
//             );
//
//         const searchingResultsInSourceFilesAbsolutePathsAndOutputFilesActualPathsMap: Map<string, string> = filterMap(
//           sourceAndOutputFilesAbsolutePathsCorrespondenceMap,
//           (sourceFileAbsolutePath: string): boolean =>
//               possibleAbsolutePathsOfTargetSourceFileWithoutFragment.includes(sourceFileAbsolutePath)
//         );
//
//         if (searchingResultsInSourceFilesAbsolutePathsAndOutputFilesActualPathsMap.size === 0) {
//
//           Logger.logWarning(
//             PointersReferencesResolverForHTML.localization.
//                 generateNoMatchingsForAliasedFilePathWithoutFilenameExtensionWarningLog({
//                   pickedPathOfTargetResourceFile,
//                   fileType__singularForm: fileTypeForLogging__pluralForm,
//                   checkedAbsolutePaths__formatted: stringifyAndFormatArbitraryValue(
//                     possibleAbsolutePathsOfTargetSourceFileWithoutFragment
//                   )
//                 })
//           );
//
//           return null;
//
//         }
//
//
//         return appendFragmentToURI({
//           targetURI: Array.from(searchingResultsInSourceFilesAbsolutePathsAndOutputFilesActualPathsMap.values())[0],
//           targetFragmentWithOrWithoutLeadingHash: getURI_Fragment({
//             targetURI: sourceFileComputedAbsolutePathPossiblyWithoutFileNameExtension,
//             withLeadingHash: false
//           }),
//           mustReplaceFragmentIfThereIsOneAlready: false
//         });
//
//       }
//
//
//       const resolvedFileOutputAbsolutePath: string | undefined = sourceAndOutputFilesAbsolutePathsCorrespondenceMap.
//           get(sourceFileComputedAbsolutePathPossiblyWithoutFileNameExtension);
//
//       if (isUndefined(resolvedFileOutputAbsolutePath)) {
//
//         Logger.logWarning(
//           PointersReferencesResolverForHTML.localization.generateNoOutputFileExistingForSpecifiedSourceFilePathWarningLog({
//             pickedPathOfTargetResourceFile,
//             fileType__singularForm: fileTypeForLogging__pluralForm
//           })
//         );
//
//         return null;
//
//       }
//
//
//       return resolvedFileOutputAbsolutePath;
//
//     }
//
//
//     return null;
//
//   }
//
// }
//
//
// namespace ResourcesPointersResolver {
//
//   export type Localization = Readonly<{
//
//     generateNoOutputFileExistingForSpecifiedSourceFilePathWarningLog: (
//       templateVariables: Localization.NoOutputFileExistingForSpecifiedSourceFilePathWarningLog.TemplateVariables
//     ) => Localization.NoOutputFileExistingForSpecifiedSourceFilePathWarningLog;
//
//   }>;
//
//   export namespace Localization {
//
//     export type UnknownResourceGroupReferenceWarningLog = Readonly<Pick<WarningLog, "title" | "description">>;
//
//     export type NoOutputFileExistingForSpecifiedSourceFilePathWarningLog = Readonly<Pick<WarningLog, "title" | "description">>;
//
//     export namespace NoOutputFileExistingForSpecifiedSourceFilePathWarningLog {
//       export type TemplateVariables = Readonly<{
//         fileType__singularForm: string;
//         pickedPathOfTargetResourceFile: string;
//       }>;
//     }
//
//   }
//
// }
//
//
// export default ResourcesPointersResolver;
