import type BrowserLiveReloader from "@BrowserLiveReloading/BrowserLiveReloader";


const BrowserLiveReloaderLocalization__English: BrowserLiveReloader.Localization = {

  generateOutputFileChangeDetectionLog: (
    namedParameters: BrowserLiveReloader.Localization.OutputFileChangeDetectionLog.TemplateNamedParameters
  ): BrowserLiveReloader.Localization.OutputFileChangeDetectionLog =>
      ({
        title: "Browser live reloader, file status changing detected",
        description:
            `\tEvent : ${ namedParameters.eventLocalizedInterpretation }\n` +
            `\t Path : ${ namedParameters.filePath }\n` +
            "Waiting for the changing of other output files' status before reload the browser ..."
      }),

  browserTabWillBeReloadedSoonLog: {
    title: "Browser live reloader, browser will be reloaded soon",
    description: "The waiting period of other files will be saved elapsed. Browser will be reloaded soon."
  }

};


export default BrowserLiveReloaderLocalization__English;
