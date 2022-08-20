import type BrowserLiveReloadingSettingsNormalizer from
    "@BrowserLiveReloading/RawSettingsNormalizer/BrowserLiveReloadingSettingsNormalizer";


const BrowserLiveReloadingSettingsNormalizerLocalization__English: BrowserLiveReloadingSettingsNormalizer.Localization = {
  generateUndefinedBrowserLiveReloadingSetupID_Message: (
    namedParameters: BrowserLiveReloadingSettingsNormalizer.Localization.UndefinedBrowserLiveReloadingSetupID_Log.NamedParameters
  ): string => `The specified browser setup ID '${ namedParameters.selectedBrowserLiveReloadingSetupID }' is not defined ` +
      "in configuration file. Below setups IDs has been defined:\n" +
      `${ namedParameters.stringifiedAvailableBrowserLiveReloadingSetupsIDs }`
};


export default BrowserLiveReloadingSettingsNormalizerLocalization__English;
