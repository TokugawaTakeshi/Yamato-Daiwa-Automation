import type BrowserLiveReloadingSettingsNormalizer from
    "@BrowserLiveReloading/RawSettingsNormalizer/BrowserLiveReloadingSettingsNormalizer";


const browserLiveReloadingSettingsNormalizerLocalization__english: BrowserLiveReloadingSettingsNormalizer.Localization = {
  generateUndefinedBrowserLiveReloadingSetupID_Message: (
    {
      selectedBrowserLiveReloadingSetupID,
      stringifiedAvailableBrowserLiveReloadingSetupsIDs
    }: BrowserLiveReloadingSettingsNormalizer.Localization.UndefinedBrowserLiveReloadingSetupID_Log.NamedParameters
  ): string =>
      `The specified browser setup ID "${ selectedBrowserLiveReloadingSetupID }" is not defined ` +
        "in configuration file. " +
      "Below setups IDs has been defined:\n" +
      stringifiedAvailableBrowserLiveReloadingSetupsIDs
};


export default browserLiveReloadingSettingsNormalizerLocalization__english;
