import type BrowserLiveReloadingSettings__Normalized from "./BrowserLiveReloadingSettings__Normalized";


export default class BrowserLiveReloadingSettingsRepresentative {

  private readonly browserLiveReloadingSettings: BrowserLiveReloadingSettings__Normalized;


  public constructor(browserLiveReloadingSettings: BrowserLiveReloadingSettings__Normalized) {
    this.browserLiveReloadingSettings = browserLiveReloadingSettings;
  }


  public get startingFilenameWithExtension(): string {
    return this.browserLiveReloadingSettings.startingFilenameWithExtension;
  }

  public get targetFilesRootDirectoryAbsolutePath(): string | undefined {
    return this.browserLiveReloadingSettings.targetFilesRootDirectoryAbsolutePath;
  }

  public get waitingDurationForSubsequentFilesWillBeUpdatedBeforeBrowserReloading__seconds(): number {
    return this.browserLiveReloadingSettings.waitingForTheOtherFilesWillUpdateDuration__seconds;
  }

  public get customMainPort(): number | null {
    return this.browserLiveReloadingSettings.ports?.main ?? null;
  }

  public get customUserInterfacePort(): number | null {
    return this.browserLiveReloadingSettings.ports?.userInterface ?? null;
  }
}
