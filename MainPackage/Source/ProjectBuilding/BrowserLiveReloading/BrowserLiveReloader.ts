/* --- Settings representatives ------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type BrowserLiveReloadingSettingsRepresentative from "@BrowserLiveReloading/BrowserLiveReloadingSettingsRepresentative";

/* --- Applied utils ------------------------------------------------------------------------------------------------ */
import Gulp from "gulp";
import BrowserSync from "browser-sync";

/* --- Third-party solutions specialises ---------------------------------------------------------------------------- */
import ChokidarSpecialist from "@ThirdPartySolutionsSpecialists/Chokidar/ChokidarSpecialist";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import Timeout = NodeJS.Timeout;
import {
  Logger,
  isNull,
  isNotNull,
  isUndefined,
  secondsToMilliseconds
} from "@yamato-daiwa/es-extensions";
import type { InfoLog } from "@yamato-daiwa/es-extensions";

/* --- Localization ------------------------------------------------------------------------------------------------- */
import BrowserLiveReloaderLocalization__English from "@BrowserLiveReloading/BrowserLiveReloaderLocalization.english";


class BrowserLiveReloader {

  public static localization: BrowserLiveReloader.Localization = BrowserLiveReloaderLocalization__English;

  private readonly masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
  private readonly browserLiveReloadingSettingsRepresentative: BrowserLiveReloadingSettingsRepresentative;


  public static provideBrowserLiveReloadingIfMust(
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): (callback: () => void) => void {

    const browserLiveReloadingConfigRepresentative: BrowserLiveReloadingSettingsRepresentative | undefined =
        masterConfigRepresentative.browserLiveReloadingSettingsRepresentative;

    if (isUndefined(browserLiveReloadingConfigRepresentative)) {
      return (callback: () => void): void => { callback(); };
    }


    const dataHoldingSelfInstance: BrowserLiveReloader = new BrowserLiveReloader(
      masterConfigRepresentative, browserLiveReloadingConfigRepresentative
    );

    return (): void => {
      dataHoldingSelfInstance.initializeBrowsersync();
      dataHoldingSelfInstance.initializeOutputFilesWatcher();
    };

  }


  private constructor(
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative,
    browserLiveReloadingConfigRepresentative: BrowserLiveReloadingSettingsRepresentative
  ) {
    this.masterConfigRepresentative = masterConfigRepresentative;
    this.browserLiveReloadingSettingsRepresentative = browserLiveReloadingConfigRepresentative;
  }


  private initializeBrowsersync(): void {

    BrowserSync.init({

      /* [ Browsersync theory ] Either "server" or "proxy" could be specified but not both. */
      ...isNull(this.browserLiveReloadingSettingsRepresentative.proxy) ? {
        server: {
          baseDir: this.browserLiveReloadingSettingsRepresentative.targetFilesRootDirectoryAbsolutePath,
          index: this.browserLiveReloadingSettingsRepresentative.startingFileNameWithExtension
        }
      } : {
        proxy: this.browserLiveReloadingSettingsRepresentative.proxy
      },

      https: this.browserLiveReloadingSettingsRepresentative.mustUseHTTPS,
      cors: this.browserLiveReloadingSettingsRepresentative.mustUseCORS,

      /* [ Browsersync theory ] When port is undefined, it will be assigned automatically. */
      ...isNotNull(this.browserLiveReloadingSettingsRepresentative.localServerCustomPort) ? {
        port: this.browserLiveReloadingSettingsRepresentative.localServerCustomPort
      } : null,

      watch: true,
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
      notify: this.browserLiveReloadingSettingsRepresentative.mustDisplayBrowsersyncConnectedPopupInBrowser

    });

  }

  private initializeOutputFilesWatcher(): void {

    let waitingForSubsequentFilesWillBeUpdatedCountdown: Timeout;

    Gulp.watch(this.masterConfigRepresentative.allOutputFilesGlobSelectors).

        on("all", (eventName: string, fileOrDirectoryPath: string): void => {

          if (
            eventName === ChokidarSpecialist.EventsNames.directoryAdded ||
            eventName === ChokidarSpecialist.EventsNames.directoryDeleted
          ) {
            return;
          }


          clearTimeout(waitingForSubsequentFilesWillBeUpdatedCountdown);

          if (this.browserLiveReloadingSettingsRepresentative.mustLogOutputFileChangeDetection) {

            Logger.logInfo(BrowserLiveReloader.localization.generateOutputFileChangeDetectionLog({
              filePath: fileOrDirectoryPath,
              eventLocalizedInterpretation: ChokidarSpecialist.getEventNameInterpretation(eventName)
            }));

          }


          waitingForSubsequentFilesWillBeUpdatedCountdown = setTimeout(
            (): void => {

              if (this.browserLiveReloadingSettingsRepresentative.mustLogBrowserTabWillBeReloadedSoon) {

                Logger.logInfo(BrowserLiveReloader.localization.browserTabWillBeReloadedSoonLog);

                BrowserSync.reload();

              }

            },
            secondsToMilliseconds(
              this.browserLiveReloadingSettingsRepresentative.periodBetweenFileUpdatingAndBrowserReloading__seconds
            )
          );
        });
  }

}


namespace BrowserLiveReloader {

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


/* eslint-disable-next-line @typescript-eslint/no-unused-vars --
 * It is the only way to extract the child namespace (no need to expose whole MarkupProcessingRawSettingsNormalizer
 * for the localization packages).
 * https://stackoverflow.com/a/73400523/4818123 */
export import BrowserLiveReloaderLocalization = BrowserLiveReloader.Localization;
