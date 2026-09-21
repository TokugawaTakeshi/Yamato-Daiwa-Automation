/* ━━━ < Imports ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
import AssetVinylFile from "@ProjectBuilding/Common/VinylFiles/AssetVinylFile";

/* ┅┅┅ Normalized Settings ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import type ImagesProcessingSettings__Normalized from "@ImagesProcessing/ImagesProcessingSettings__Normalized";

/* ┅┅┅ Worktypes ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import type ImagesProcessingTypes from "@ImagesProcessing/ImagesProcessingTypes";

/* ┅┅┅ Utils ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import FileSystem from "fs";
import { ImprovedGlob, ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";
/* ━━━ Imports > ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */


class ImageVinyFile extends AssetVinylFile<ImagesProcessingSettings__Normalized.AssetsGroup> {

  public readonly mustBeOptimizedDuringCurrentExecution: boolean;
  public hasBeenOptimizedDuringCurrentExecution: boolean = false;

  /* [ Theory ] Not even with `this.stats.mtime`! */
  public readonly sourceFileLastModificationDateTime__ISO8601: string;
  public optimizedContentRevisionHash?: string;


  public constructor(
    {
      cachedOptimizedImagedMetadata,
      consumingProjectRootDirectoryAbsolutePath,
      cachedOptimizedImagesDirectoryAbsolutePath,
      ...constructorParameter
    }: ImageVinyFile.ConstructorParameter
  ) {

    super(constructorParameter);

    const mustBeOptimizedIfNoAlreadyOptimizedCachedFile: boolean =
        constructorParameter.actualAssetsGroupSettings.imagesOptimization.mustOptimize &&
        (
          constructorParameter.assetsProcessingCommonSettings.imagesOptimization.ignoresFilesGlobs.size === 0 ||
              !ImprovedGlob.isFilePathMatchingWithAtLeastOneGlobSelector({
                filePath: this.sourceAbsolutePath,
                globSelectors: [ ...constructorParameter.assetsProcessingCommonSettings.imagesOptimization.ignoresFilesGlobs ]
              })
        );

    /* [ Theory ]
     * `this.stats` (means the stats of the Vinyl file) is still null here, and even it will become non null,
     *   it will be the date time current to closest one, not the modification datetime of the source file.  */
    this.sourceFileLastModificationDateTime__ISO8601 = FileSystem.statSync(this.sourceAbsolutePath).mtime.toISOString();

    if (mustBeOptimizedIfNoAlreadyOptimizedCachedFile) {

      const sourceFilePathRelativeToConsumingProjectRootDirectory: string =
          ImprovedPath.computeRelativePath({
            basePath: consumingProjectRootDirectoryAbsolutePath,
            comparedPath: this.sourceAbsolutePath,
            alwaysForwardSlashSeparators: true
          });

      const cachedOptimizedImageMetadata: ImagesProcessingTypes.CachedOptimizedImagesMetadata.File | undefined =
          cachedOptimizedImagedMetadata[sourceFilePathRelativeToConsumingProjectRootDirectory];

      if (
        this.sourceFileLastModificationDateTime__ISO8601 ===
            cachedOptimizedImageMetadata?.targetImageLastModificationDateTime__ISO_8601
      ) {

        try {

          /* [ Theory ]
           * Do not set the 2nd parameter of `FileSystem.readFileSync` with "utf-8" or another encoding to preserve
           *  the original encoding (critical for non-SVG files). */
          this.setBufferedContent(
            FileSystem.readFileSync(
              ImprovedPath.joinPathSegments(
                [ cachedOptimizedImagesDirectoryAbsolutePath, cachedOptimizedImageMetadata.cachedImageFileNameWithExtension ]
              )
            )
          );

          this.mustBeOptimizedDuringCurrentExecution = false;

        } catch {

          this.mustBeOptimizedDuringCurrentExecution = true;

        }

      } else {

        this.mustBeOptimizedDuringCurrentExecution = true;

      }

    } else {

      this.mustBeOptimizedDuringCurrentExecution = false;

    }

  }

}


namespace ImageVinyFile {

  export type ConstructorParameter =
      Pick<AssetVinylFile.ConstructorParameter<ImagesProcessingSettings__Normalized.AssetsGroup>, "initialPlainVinylFile"> &
      Readonly<{
        assetsProcessingCommonSettings: ImagesProcessingSettings__Normalized.Common;
        actualAssetsGroupSettings: ImagesProcessingSettings__Normalized.AssetsGroup;
        cachedOptimizedImagedMetadata: ImagesProcessingTypes.CachedOptimizedImagesMetadata;
        consumingProjectRootDirectoryAbsolutePath: string;
        cachedOptimizedImagesDirectoryAbsolutePath: string;
      }>;

}


export default ImageVinyFile;
