type PagesVariationsMetadata = Map<
  PagesVariationsMetadata.SourceFileAbsolutePath__ForwardSlashesPathSeparators,
  PagesVariationsMetadata.Page
>;


namespace PagesVariationsMetadata {

  export type SourceFileAbsolutePath__ForwardSlashesPathSeparators = string;

  export type Page = Readonly<{
    mustInitialFileBeKept: boolean;
    sourceAndOutputAbsolutePathsOfAllVariations: ReadonlyMap<string, string>;
    absoluteSourcePathsOfAllVariations: ReadonlySet<string>;
    dataForPugBySourceFilesAbsolutePaths: ReadonlyMap<
      SourceFileAbsolutePath__ForwardSlashesPathSeparators,
      Readonly<{
        localizationData?: object;
        pageStateDependentVariationData?: object;
      }>
    >;
  }>;

}


export default PagesVariationsMetadata;
