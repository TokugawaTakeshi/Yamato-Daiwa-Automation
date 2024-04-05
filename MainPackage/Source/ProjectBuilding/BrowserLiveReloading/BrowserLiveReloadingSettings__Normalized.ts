type BrowserLiveReloadingSettings__Normalized = Readonly<{
  setup: BrowserLiveReloadingSettings__Normalized.Setup;
  logging: BrowserLiveReloadingSettings__Normalized.Logging;
}>;


/* eslint-disable-next-line @typescript-eslint/no-redeclare --
 * The merging of type/interface and namespace is completely valid TypeScript,
 * but @typescript-eslint community does not wish to support it.
 * https://github.com/eslint/eslint/issues/15504 */
namespace BrowserLiveReloadingSettings__Normalized {

  export type Setup = Readonly<{
    localServer: Setup.LocalServer;
    proxy?: string;
    targetBrowsers?: ReadonlyArray<string>;
    browserSyncUserInterface: Setup.BrowserSyncUserInterface;
    periodBetweenFileUpdatingAndBrowserReloading__seconds: number;
  }>;

  export namespace Setup {

    export type LocalServer = Readonly<{
      rootDirectoryAbsolutePath: string;
      ignoredFilesAndDirectoriesRelativePaths: ReadonlyArray<string>;
      port?: number;
      startingFileNameWithExtension: string;
      HTTPS?: LocalServer.HTTPS;
      mustUseCORS: boolean;
    }>;

    export namespace LocalServer {

      export type HTTPS = Readonly<{
        keyAbsolutePath: string;
        certificateAbsolutePath: string;
      }>;

    }

    export type BrowserSyncUserInterface = Readonly<{
      enabled: boolean;
      customPort?: number;
    }>;

  }


  export type Logging = Readonly<{
    outputFileChangeDetection: boolean;
    browserTabWillBeReloadedSoon: boolean;
    browsersyncConnection: boolean;
  }>;

}


export default BrowserLiveReloadingSettings__Normalized;
