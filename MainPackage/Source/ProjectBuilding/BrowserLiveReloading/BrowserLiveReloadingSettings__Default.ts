const BrowserLiveReloadingSettings__Default: Readonly<{

  setup: Readonly<{

    localServer: Readonly<{
      startingFileNameWithExtension: string;
      HTTPS_Usage: boolean;
      CORS_Usage: boolean;
    }>;

    browserSyncUserInterface: Readonly<{
      enabled: boolean;
    }>;

    periodBetweenFileUpdatingAndBrowserReloading__seconds: number;

  }>;

  logging: Readonly<{
    outputFileChangeDetection: boolean;
    browserTabWillBeReloadedSoon: boolean;
    browsersyncConnection: boolean;
  }>;

}> = {

  setup: {

    localServer: {
      startingFileNameWithExtension: "index.html",
      HTTPS_Usage: false,
      CORS_Usage: false
    },

    browserSyncUserInterface: {
      enabled: true
    },

    periodBetweenFileUpdatingAndBrowserReloading__seconds: 0.5

  },

  logging: {
    outputFileChangeDetection: true,
    browserTabWillBeReloadedSoon: false,
    browsersyncConnection: true
  }

};


export default BrowserLiveReloadingSettings__Default;
