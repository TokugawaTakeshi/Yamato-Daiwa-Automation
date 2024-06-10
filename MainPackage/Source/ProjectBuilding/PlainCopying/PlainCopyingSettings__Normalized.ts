type PlainCopyingSettings__Normalized = Readonly<{
  filesGroups: Readonly<{ [groupID: string]: PlainCopyingSettings__Normalized.FilesGroup; }>;
}>;


namespace PlainCopyingSettings__Normalized {

  export type FilesGroup = FilesGroup.Singular | FilesGroup.Plural;

  export namespace FilesGroup {

    export type ID = string;

    export type CommonProperties = Readonly<{
      aliasName: string;
    }>;

    export type Singular =
        CommonProperties &
        Readonly<{
          sourceFileAbsolutePath: string;
          outputFileAbsolutePath: string;
        }>;

    export type Plural =
        CommonProperties &
        Readonly<{
          sourceTopDirectoryAbsolutePath: string;
          outputTopDirectoryAbsolutePath: string;
          sourceAndOutputFilesAbsolutePathsCorrespondenceMap: ReadonlyMap<string, string>;
        }>;

  }

}


export default PlainCopyingSettings__Normalized;
