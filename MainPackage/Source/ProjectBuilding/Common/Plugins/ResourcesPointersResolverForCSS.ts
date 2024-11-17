/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import PLAIN_COPIED_FILES_POINTER_ALIAS_PREFIX from
    "@ProjectBuilding/Common/Restrictions/ResourcesReferences/PLAIN_COPIED_FILES_POINTER_ALIAS_PREFIX";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type PlainCopyingSettingsRepresentative from "@ProjectBuilding/PlainCopying/PlainCopyingSettingsRepresentative";
import type ImagesProcessingSettingsRepresentative from "@ImagesProcessing/ImagesProcessingSettingsRepresentative";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import {
  replaceMatchesWithRegularExpressionToDynamicValue,
  explodeURI_PathToSegments,
  isNonEmptyString,
  isUndefined,
  isNotUndefined,
  isNull,
  isNotNull,
  type ReplacingOfMatchesWithRegularExpressionToDynamicValue
} from "@yamato-daiwa/es-extensions";
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


abstract class ResourcesPointersResolverForCSS {

  private static readonly aliasedURIsAndOutputImagesFilesAbsolutePathsCorrespondenceMap:
      ResourcesPointersResolverForCSS.AliasedURIsAndOutputFilesAbsolutePathsCorrespondenceMap =
          new Map<ResourcesPointersResolverForCSS.AliasedURI, ResourcesPointersResolverForCSS.OutputFileAbsolutePath>();

  /* [ Theory ]
   * This class designed not only for CSS files but also for the CSS inside HTML fields.
   * That is
   * */
  public static resolve(
    {
      CSS_Code,
      absolutePathOfOutputDirectoryForParentFile,
      projectBuildingMasterConfigRepresentative
    }: Readonly<{
      CSS_Code: string;
      absolutePathOfOutputDirectoryForParentFile: string;
      projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
    }>
  ): string {

    const publicDirectoryAbsolutePath: string | undefined = projectBuildingMasterConfigRepresentative.
        actualPublicDirectoryAbsolutePath;

    const plainCopyingSettingsRepresentative: PlainCopyingSettingsRepresentative | undefined =
        projectBuildingMasterConfigRepresentative.plainCopyingSettingsRepresentative;

    const imagesProcessingSettingsRepresentative: ImagesProcessingSettingsRepresentative | undefined =
        projectBuildingMasterConfigRepresentative.imagesProcessingSettingsRepresentative;

    replaceMatchesWithRegularExpressionToDynamicValue({
      targetString: CSS_Code,
      regularExpressionWithCapturingGroups: /url\(["']?(?<possiblyAliasedPath>.+?)["']?\);?/gu,
      replacer: (
        matching: ReplacingOfMatchesWithRegularExpressionToDynamicValue.Matching<
          Readonly<{ possiblyAliasedPath: string; }>,
          Readonly<{ [1]: string; }>
        >
      ): string | null => {

        const possiblyAliasedPath: string = matching.namedCapturingGroups.possiblyAliasedPath;

        let resolvedAbsolutePath: string | null = ResourcesPointersResolverForCSS.
            aliasedURIsAndOutputImagesFilesAbsolutePathsCorrespondenceMap.
            get(possiblyAliasedPath) ??
            null;

        if (isNotNull(resolvedAbsolutePath)) {
          return `url("${ 
            this.buildResourceFileFinalPath({
              resolvedOutputAbsolutePathOfResourceFile: resolvedAbsolutePath,
              absolutePathOfOutputDirectoryForParentFile,
              publicDirectoryAbsolutePath
            }) 
          }");`;
        }

        const segmentsOfPickedPath: Array<string> = explodeURI_PathToSegments(possiblyAliasedPath);
        const firstSegmentOfPickedPath: string | undefined = segmentsOfPickedPath[0];

        if (!isNonEmptyString(firstSegmentOfPickedPath)) {
          return null;
        }


        if (
          isNotUndefined(plainCopyingSettingsRepresentative) &&
              firstSegmentOfPickedPath.startsWith(PLAIN_COPIED_FILES_POINTER_ALIAS_PREFIX)
        ) {

          resolvedAbsolutePath = plainCopyingSettingsRepresentative.
              getSourceFileAbsolutePathByAliasedPath(segmentsOfPickedPath);

          if (isNull(resolvedAbsolutePath)) {
            return null;
          }


          ResourcesPointersResolverForCSS.
              aliasedURIsAndOutputImagesFilesAbsolutePathsCorrespondenceMap.
              set(possiblyAliasedPath, resolvedAbsolutePath);

          return `url("${ 
            this.buildResourceFileFinalPath({
              resolvedOutputAbsolutePathOfResourceFile: resolvedAbsolutePath,
              absolutePathOfOutputDirectoryForParentFile,
              publicDirectoryAbsolutePath
            }) 
          }");`;

        }


        if (isUndefined(imagesProcessingSettingsRepresentative)) {
          return null;
        }


        if (isNull(resolvedAbsolutePath)) {
          return null;
        }


        ResourcesPointersResolverForCSS.
            aliasedURIsAndOutputImagesFilesAbsolutePathsCorrespondenceMap.
            set(possiblyAliasedPath, resolvedAbsolutePath);

        return `url("${ 
          this.buildResourceFileFinalPath({
            resolvedOutputAbsolutePathOfResourceFile: resolvedAbsolutePath,
            absolutePathOfOutputDirectoryForParentFile,
            publicDirectoryAbsolutePath
          }) 
        }");`;

      }
    });


    return CSS_Code;

  }

  private static buildResourceFileFinalPath(
    {
      publicDirectoryAbsolutePath,
      resolvedOutputAbsolutePathOfResourceFile,
      absolutePathOfOutputDirectoryForParentFile
    }: Readonly<{
      publicDirectoryAbsolutePath?: string;
      resolvedOutputAbsolutePathOfResourceFile: string;
      absolutePathOfOutputDirectoryForParentFile: string;
    }>
  ): string {
    return isNotUndefined(publicDirectoryAbsolutePath) ?
        `/${ 
          ImprovedPath.computeRelativePath({
            basePath: publicDirectoryAbsolutePath,
            comparedPath: resolvedOutputAbsolutePathOfResourceFile,
            alwaysForwardSlashSeparators: true
          })
        }` :
        ImprovedPath.computeRelativePath({
          basePath: absolutePathOfOutputDirectoryForParentFile,
          comparedPath: resolvedOutputAbsolutePathOfResourceFile,
          alwaysForwardSlashSeparators: true
        });
  }

}


namespace ResourcesPointersResolverForCSS {

  export type AliasedURIsAndOutputFilesAbsolutePathsCorrespondenceMap = Map<AliasedURI, OutputFileAbsolutePath>;

  export type AliasedURI = string;
  export type OutputFileAbsolutePath = string;

}


export default ResourcesPointersResolverForCSS;
