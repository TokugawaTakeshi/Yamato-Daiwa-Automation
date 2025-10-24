namespace ImagesProcessingTypes {

  export type CachedOptimizedImagesMetadata =
      {
        [sourceImageRelativePath__forwardSlashesSeparators: string]: CachedOptimizedImagesMetadata.File | undefined;
      };

  export namespace CachedOptimizedImagesMetadata {

    export type File = Readonly<{
      cachedImageFileNameWithExtension: string;
      targetImageLastModificationDateTime__ISO_8601: string;
    }>;

  }

}


export default ImagesProcessingTypes;
