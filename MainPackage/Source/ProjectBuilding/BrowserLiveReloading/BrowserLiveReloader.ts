/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type BrowserLiveReloadingSettingsRepresentative from "@BrowserLiveReloading/BrowserLiveReloadingSettingsRepresentative";

/* ─── Applied Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import BrowserSync from "browser-sync";
import BrowserCoordinatorRelatedFilesWatcher from "@BrowserLiveReloading/BrowserCoordinatorRelatedFilesWatcher";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import type HTTP from "http";
import Timeout = NodeJS.Timeout;
import {
  Logger,
  isNull,
  isNotNull,
  isUndefined,
  secondsToMilliseconds
} from "@yamato-daiwa/es-extensions";
import type { InfoLog } from "@yamato-daiwa/es-extensions";
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";

/* ─── Localization ───────────────────────────────────────────────────────────────────────────────────────────────── */
import BrowserLiveReloaderLocalization__English from "@BrowserLiveReloading/BrowserLiveReloaderLocalization.english";


class BrowserLiveReloader {

  public static localization: BrowserLiveReloader.Localization = BrowserLiveReloaderLocalization__English;

  private static readonly onURI_ChangedEventHandlers: Array<BrowserLiveReloader.OnURI_ChangedEventHandler> = [];

  private readonly browserLiveReloadingSettingsRepresentative: BrowserLiveReloadingSettingsRepresentative;

  private waitingForSubsequentFilesWillBeUpdatedCountdown: Timeout | undefined;


  public static provideBrowserLiveReloadingIfMust(
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): (callback: () => void) => void {

    const browserLiveReloadingConfigRepresentative: BrowserLiveReloadingSettingsRepresentative | null =
        masterConfigRepresentative.getBrowserLiveReloadingSettingsRepresentativeIfMustProvideBrowserLiveReloading();

    if (isNull(browserLiveReloadingConfigRepresentative)) {
      return (callback: () => void): void => { callback(); };
    }


    const dataHoldingSelfInstance: BrowserLiveReloader = new BrowserLiveReloader(browserLiveReloadingConfigRepresentative);

    return (callback: () => void): void => {

      BrowserCoordinatorRelatedFilesWatcher.initialize({
        onAnyEventRelatedWithActualFilesHandler: dataHoldingSelfInstance.onAnyChangeInRelatedFiles.
            bind(dataHoldingSelfInstance),
        browserLiveReloadingSettingsRepresentative: browserLiveReloadingConfigRepresentative
      });

      dataHoldingSelfInstance.initializeBrowsersync();

      callback();

    };

  }

  public static addOnURI_ChangedEventHandler(onURI_ChangedEventHandler: BrowserLiveReloader.OnURI_ChangedEventHandler): void {
    this.onURI_ChangedEventHandlers.push(onURI_ChangedEventHandler);
  }


  private constructor(
    browserLiveReloadingConfigRepresentative: BrowserLiveReloadingSettingsRepresentative
  ) {
    this.browserLiveReloadingSettingsRepresentative = browserLiveReloadingConfigRepresentative;
  }


  private initializeBrowsersync(): void {

    BrowserSync.init(

        {

        /* [ Browsersync theory ] Either "server" or "proxy" could be specified but not both. */
        ...isNull(this.browserLiveReloadingSettingsRepresentative.proxy) ? {
          server: {
            baseDir: this.browserLiveReloadingSettingsRepresentative.targetFilesRootDirectoryAbsolutePath,
            index: this.browserLiveReloadingSettingsRepresentative.startingFileNameWithExtension
          }
        } : {
          proxy: this.browserLiveReloadingSettingsRepresentative.proxy
        },

        ...isNotNull(this.browserLiveReloadingSettingsRepresentative.HTTPS) ? {
          https: {
            key: this.browserLiveReloadingSettingsRepresentative.HTTPS.keyAbsolutePath,
            cert: this.browserLiveReloadingSettingsRepresentative.HTTPS.certificateAbsolutePath
          }
        } : null,

        cors: this.browserLiveReloadingSettingsRepresentative.mustUseCORS,

        /* [ Browsersync theory ] When port is undefined, it will be assigned automatically. */
        ...isNotNull(this.browserLiveReloadingSettingsRepresentative.localServerCustomPort) ? {
          port: this.browserLiveReloadingSettingsRepresentative.localServerCustomPort
        } : null,

        ignore: this.browserLiveReloadingSettingsRepresentative.globSelectorsOfFilesAndDirectoriesWhichWillBeIgnored,

        /* [ Browsersync theory ] When value is empty array, no browsers will be opened. */
        ...this.browserLiveReloadingSettingsRepresentative.targetBrowsers.length > 0 ? {
          browser: this.browserLiveReloadingSettingsRepresentative.targetBrowsers
        } : null,

        ui: this.browserLiveReloadingSettingsRepresentative.mustEnableBrowsersyncUserInterface ? {

          /* [ Browsersync theory ] When port is undefined, it will be assigned automatically. */
          ...isNotNull(this.browserLiveReloadingSettingsRepresentative.browsersyncUserInterfaceCustomPort) ? {
            port: this.browserLiveReloadingSettingsRepresentative.browsersyncUserInterfaceCustomPort
          } : null

        } : false,

        logLevel: "warn",
        notify: this.browserLiveReloadingSettingsRepresentative.mustDisplayBrowsersyncConnectedPopupInBrowser,

        middleware: this.onRequest.bind(this)

      }

    );

  }

  private onAnyChangeInRelatedFiles(): void {

    clearTimeout(this.waitingForSubsequentFilesWillBeUpdatedCountdown);

    this.waitingForSubsequentFilesWillBeUpdatedCountdown = setTimeout(
      (): void => {

        Logger.logInfo({
          mustOutputIf: this.browserLiveReloadingSettingsRepresentative.mustLogBrowserTabWillBeReloadedSoon,
          ...BrowserLiveReloader.localization.browserTabWillBeReloadedSoonLog
        });

        BrowserSync.reload();

      },
      secondsToMilliseconds(
        this.browserLiveReloadingSettingsRepresentative.periodBetweenFileUpdatingAndBrowserReloading__seconds
      )
    );

  }

  private onRequest(request: HTTP.IncomingMessage, _response: HTTP.ServerResponse, letPass: () => void): void {

    if (isUndefined(request.url)) {
      letPass();
      return;
    }


    const targetHTML_FileAbsolutePath: string = request.url === "/" ?
        ImprovedPath.joinPathSegments(
          [
            this.browserLiveReloadingSettingsRepresentative.targetFilesRootDirectoryAbsolutePath,
            this.browserLiveReloadingSettingsRepresentative.startingFileNameWithExtension
          ],
          { alwaysForwardSlashSeparators: true }
        ) :
        ImprovedPath.joinPathSegments(
          [ this.browserLiveReloadingSettingsRepresentative.targetFilesRootDirectoryAbsolutePath, request.url ],
          { alwaysForwardSlashSeparators: true }
        );

    for (const handler of BrowserLiveReloader.onURI_ChangedEventHandlers) {
      handler(targetHTML_FileAbsolutePath);
    }

    letPass();

  }

}


namespace BrowserLiveReloader {

  export type OnURI_ChangedEventHandler = (targetFileAbsolutePath: string) => void;

  export type Localization = {

    generateOutputFileChangeDetectionLog: (namedParameters: Localization.OutputFileChangeDetectionLog.TemplateNamedParameters) =>
        Localization.OutputFileChangeDetectionLog;

    browserTabWillBeReloadedSoonLog: Localization.BrowserTabWillBeReloadedSoonLog;

  };


  export namespace Localization {

    export type OutputFileChangeDetectionLog = Pick<InfoLog, "title" | "description">;

    export namespace OutputFileChangeDetectionLog {

      export type TemplateNamedParameters = Readonly<{
        eventLocalizedInterpretation: string;
        filePath: string;
      }>;

    }

    export type BrowserTabWillBeReloadedSoonLog = Pick<InfoLog, "title" | "description">;

  }

}


export default BrowserLiveReloader;


/* It is the only way to extract the child namespace (no need to expose whole MarkupProcessingRawSettingsNormalizer
 * for the localization packages).
 * https://stackoverflow.com/a/73400523/4818123 */
export import BrowserLiveReloaderLocalization = BrowserLiveReloader.Localization;
