/* --- Settings representatives ------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type BrowserLiveReloadingSettingsRepresentative from "@BrowserLiveReloading/BrowserLiveReloadingSettingsRepresentative";

/* --- Applied utils ------------------------------------------------------------------------------------------------ */
import Gulp from "gulp";
import BrowserSync from "browser-sync";
import ChokidarSpecialist from "@ThirdPartySolutionsSpecialists/ChokidarSpecialist";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import Timeout = NodeJS.Timeout;
import {
  Logger,
  UnexpectedEventError,
  isNotNull,
  isUndefined,
  secondsToMilliseconds
} from "@yamato-daiwa/es-extensions";


export default class BrowserLiveReloader {

  private readonly masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
  private readonly browserLiveReloadingSettingsRepresentative: BrowserLiveReloadingSettingsRepresentative;


  public static provideBrowserLiveReloading(
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): () => void {

    const dataHoldingSelfInstance: BrowserLiveReloader = new BrowserLiveReloader(masterConfigRepresentative);
    const browserLiveReloadingConfigRepresentative: BrowserLiveReloadingSettingsRepresentative = dataHoldingSelfInstance.
        browserLiveReloadingSettingsRepresentative;

    return (): void => {

      BrowserSync.init({
        watch: true,
        server: {
          baseDir: browserLiveReloadingConfigRepresentative.targetFilesRootDirectoryAbsolutePath,
          index: browserLiveReloadingConfigRepresentative.startingFilenameWithExtension
        },
        browser: "chrome",
        ...isNotNull(browserLiveReloadingConfigRepresentative.customMainPort) ? {
          port: browserLiveReloadingConfigRepresentative.customMainPort
        } : {},
        ...isNotNull(browserLiveReloadingConfigRepresentative.customUserInterfacePort) ? {
          ui: {
            port: browserLiveReloadingConfigRepresentative.customUserInterfacePort
          }
        } : {}
      });

      let waitingForOtherFilesWillBeUpdatedCountdown: Timeout;

      Gulp.watch(dataHoldingSelfInstance.masterConfigRepresentative.allOutputFilesGlobSelectors).

          on("all", (eventName: string, fileOrDirectoryPath: string): void => {

            clearTimeout(waitingForOtherFilesWillBeUpdatedCountdown);
            Logger.logInfo({
              title: "Output files watcher",
              description:
                  `  Event : ${ ChokidarSpecialist.getEventNameInterpretation(eventName) }` +
                  `\n  Path : ${ fileOrDirectoryPath }\n` +
                  "Waiting for status changing of other output files..."
            });

            waitingForOtherFilesWillBeUpdatedCountdown = setTimeout(
                (): void => {

                  Logger.logInfo({
                    title: "Browser live reloader",
                    description: "Reloading the browser ..."
                  });

                  BrowserSync.reload();
                },
                secondsToMilliseconds(
                  dataHoldingSelfInstance.browserLiveReloadingSettingsRepresentative.
                      waitingDurationForSubsequentFilesWillBeUpdatedBeforeBrowserReloading__seconds
                )
            );
          });
    };
  }


  private constructor(masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative) {

    const browserLiveReloadingConfigRepresentative: BrowserLiveReloadingSettingsRepresentative | undefined =
        masterConfigRepresentative.browserLiveReloadingSettingsRepresentative;

    if (isUndefined(browserLiveReloadingConfigRepresentative)) {
      Logger.throwErrorAndLog({
        errorInstance: new UnexpectedEventError("YUE1"),
        title: UnexpectedEventError.localization.defaultTitle,
        occurrenceLocation: "browserLiveReloader.provideBrowserLiveReloading(masterConfigRepresentative) -> constructor"
      });
    }

    this.masterConfigRepresentative = masterConfigRepresentative;
    this.browserLiveReloadingSettingsRepresentative = browserLiveReloadingConfigRepresentative;
  }
}
