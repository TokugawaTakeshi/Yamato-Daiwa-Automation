type BrowserLiveReloadingSettings__Normalized = {
  readonly targetFilesRootDirectoryAbsolutePath: string;
  readonly startingFilenameWithExtension: string;
  readonly waitingForTheOtherFilesWillUpdateDuration__seconds: number;
  readonly virtualHost?: string;
  readonly useHTTPS?: boolean;
  readonly ports?: {
    readonly main?: number;
    readonly userInterface?: number;
  };
  readonly ignoredFilesAndDirectories: Array<string>;
};


export default BrowserLiveReloadingSettings__Normalized;
