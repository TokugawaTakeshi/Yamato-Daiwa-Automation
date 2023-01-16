/* --- Normalized configuration ------------------------------------------------------------------------------------- */
import type BrowserLiveReloadingSettings__Normalized from "./BrowserLiveReloadingSettings__Normalized";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import { isNotUndefined } from "@yamato-daiwa/es-extensions";


export default class BrowserLiveReloadingSettingsRepresentative {

  private readonly browserLiveReloadingSettings: BrowserLiveReloadingSettings__Normalized;


  public constructor(browserLiveReloadingSettings: BrowserLiveReloadingSettings__Normalized) {
    this.browserLiveReloadingSettings = browserLiveReloadingSettings;
  }


  /* === Setup ====================================================================================================== */
  public get targetFilesRootDirectoryAbsolutePath(): string {
    return this.browserLiveReloadingSettings.setup.localServer.rootDirectoryAbsolutePath;
  }

  public get startingFileNameWithExtension(): string {
    return this.browserLiveReloadingSettings.setup.localServer.startingFileNameWithExtension;
  }

  public get localServerCustomPort(): number | null {
    return this.browserLiveReloadingSettings.setup.localServer.port ?? null;
  }

  public get globSelectorsOfFilesAndDirectoriesWhichWillBeIgnored(): Array<string> {
    return [ ...this.browserLiveReloadingSettings.setup.localServer.ignoredFilesAndDirectoriesRelativePaths ];
  }

  public get mustUseHTTPS(): boolean {
    return this.browserLiveReloadingSettings.setup.localServer.mustUseHTTPS;
  }

  public get mustUseCORS(): boolean {
    return this.browserLiveReloadingSettings.setup.localServer.mustUseCORS;
  }

  public get targetBrowsers(): Array<string> {
    return isNotUndefined(this.browserLiveReloadingSettings.setup.targetBrowsers) ?
        [ ...this.browserLiveReloadingSettings.setup.targetBrowsers ] : [];
  }

  public get proxy(): string | null {
    return this.browserLiveReloadingSettings.setup.proxy ?? null;
  }

  public get periodBetweenFileUpdatingAndBrowserReloading__seconds(): number {
    return this.browserLiveReloadingSettings.setup.periodBetweenFileUpdatingAndBrowserReloading__seconds;
  }

  public get mustEnableBrowsersyncUserInterface(): boolean {
    return this.browserLiveReloadingSettings.setup.browserSyncUserInterface.enabled;
  }

  public get browsersyncUserInterfaceCustomPort(): number | null {
    return this.browserLiveReloadingSettings.setup.browserSyncUserInterface.customPort ?? null;
  }


  /* === Logging ==================================================================================================== */
  public get mustLogOutputFileChangeDetection(): boolean {
    return this.browserLiveReloadingSettings.logging.outputFileChangeDetection;
  }

  public get mustLogBrowserTabWillBeReloadedSoon(): boolean {
    return this.browserLiveReloadingSettings.logging.browserTabWillBeReloadedSoon;
  }

  public get mustDisplayBrowsersyncConnectedPopupInBrowser(): boolean {
    return this.browserLiveReloadingSettings.logging.browsersyncConnection;
  }

}
