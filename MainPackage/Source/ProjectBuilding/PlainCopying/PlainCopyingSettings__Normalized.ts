type PlainCopyingSettings__Normalized = Readonly<{
  filesGroups: Readonly<{ [groupID: string]: PlainCopyingSettings__Normalized.FilesGroup; }>;
}>;


namespace PlainCopyingSettings__Normalized {

  export type FilesGroup =
      Readonly<
        (
          { sourceFileAbsolutePath: string; } |
          { sourceDirectoryAbsolutePath: string; }
        ) &
        {
          referenceName?: string;
          outputTopDirectoryAbsolutePath: string;
        }
      >;

  export namespace FilesGroup {
    export type ID = string;
  }

}


export default PlainCopyingSettings__Normalized;
