/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type BrowserLiveReloadingSettingsRepresentative from "@BrowserLiveReloading/BrowserLiveReloadingSettingsRepresentative";

/* ─── Assets ─────────────────────────────────────────────────────────────────────────────────────────────────────── */
import InternalAssets from "@Utils/InternalAssets";

/* ─── Shared State ───────────────────────────────────────────────────────────────────────────────────────────────── */
import MarkupProcessingSharedState from "@MarkupProcessing/MarkupProcessingSharedState";

/* ─── Watchers ───────────────────────────────────────────────────────────────────────────────────────────────────── */
import MarkupSourceFilesWatcher from "@MarkupProcessing/MarkupSourceFilesWatcher";

/* ─── Applied Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import BrowserSync from "browser-sync";
import BrowserCoordinatorRelatedFilesWatcher from "@BrowserLiveReloading/BrowserCoordinatorRelatedFilesWatcher";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import type HTTP from "http";
import Timeout = NodeJS.Timeout;
import {
  Logger,
  secondsToMilliseconds,
  extractLastExtensionOfFileName,
  isUndefined,
  isNull,
  isNotNull,
  addElementsToSet,
  isNotUndefined
} from "@yamato-daiwa/es-extensions";
import type { InfoLog } from "@yamato-daiwa/es-extensions";
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";
import FileSystem from "fs";

/* ─── Localization ───────────────────────────────────────────────────────────────────────────────────────────────── */
import BrowserLiveReloaderLocalization__English from "@BrowserLiveReloading/BrowserLiveReloaderLocalization.english";


class BrowserLiveReloader {

  /* ━━━ Static Fields ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* ┅┅┅ Public ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  public static selfSingleInstance: BrowserLiveReloader | undefined;
  public static localization: BrowserLiveReloader.Localization = BrowserLiveReloaderLocalization__English;

  /* ┅┅┅ Private ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  public static readonly onNewPageOpenedEventHandlers:
      Map<BrowserLiveReloader.OnPageChangedEventHandler.ID, BrowserLiveReloader.OnPageChangedEventHandler> = new Map();

  private static readonly EXPERIMENTAL_LOGGING: boolean = false;


  /* ━━━ Instance Fields ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private readonly browserLiveReloadingSettingsRepresentative: BrowserLiveReloadingSettingsRepresentative;

  private readonly absolutePathsOfSourceFilesCorrespondingToViewedPages__forwardSlashesPathSeparators__processingOnDemandModeOnly:
      Set<string> = new Set();

  private waitingForSubsequentFilesWillBeUpdatedCountdown: Timeout | undefined;

  private currentHTML_FileAbsolutePath__forwardSlashesPathSeparators: string | null = null;

  /* ┅┅┅ Loading on Demand ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private readonly processingOnDemandSettings: ProjectBuildingCommonSettings__Normalized.ProcessingOnDemand;
  private loadingPageHTML_ForProcessingOnDemandMode?: string;
  private isFirstPageRequestInProcessingOnDemandMode: boolean = true;


  /* ━━━ Public Methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public static provideBrowserLiveReloadingIfMust(
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): (callback: () => void) => void {

    const browserLiveReloadingConfigRepresentative: BrowserLiveReloadingSettingsRepresentative | null =
        projectBuildingMasterConfigRepresentative.
            getBrowserLiveReloadingSettingsRepresentativeIfMustProvideBrowserLiveReloading();

    if (isNull(browserLiveReloadingConfigRepresentative)) {
      return (callback: () => void): void => { callback(); };
    }


    const selfInstance: BrowserLiveReloader =
        new BrowserLiveReloader(browserLiveReloadingConfigRepresentative, projectBuildingMasterConfigRepresentative);

    BrowserLiveReloader.selfSingleInstance = selfInstance;

    return (callback: () => void): void => {

      BrowserCoordinatorRelatedFilesWatcher.initialize({
        onAnyEventRelatedWithActualFilesHandler: selfInstance.onAnyChangeInRelatedFiles.
            bind(selfInstance),
        browserLiveReloadingSettingsRepresentative: browserLiveReloadingConfigRepresentative
      });

      selfInstance.initializeBrowsersync();

      callback();

    };

  }

  public static addOnNewPageOpenedEventHandler(
    { handlerID, handler }:
        Readonly<{
          handlerID: string;
          handler: BrowserLiveReloader.OnPageChangedEventHandler;
        }>
  ): void {
    BrowserLiveReloader.onNewPageOpenedEventHandlers.set(handlerID, handler);
  }

  public static reload(): void {
    BrowserSync.reload();
  }

  public static get currentHTML_FileAbsolutePath__forwardSlashesPathSeparators(): string | null {
    return BrowserLiveReloader.selfSingleInstance?.currentHTML_FileAbsolutePath__forwardSlashesPathSeparators ?? null;
  }


  /* ━━━ Constructor ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private constructor(
    browserLiveReloadingConfigRepresentative: BrowserLiveReloadingSettingsRepresentative,
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ) {

    this.browserLiveReloadingSettingsRepresentative = browserLiveReloadingConfigRepresentative;
    this.processingOnDemandSettings = projectBuildingMasterConfigRepresentative.processingOnDemandSettings;

    if (
      this.processingOnDemandSettings.enabled &&
          this.processingOnDemandSettings.fullInitialBuilding &&
          isNotUndefined(projectBuildingMasterConfigRepresentative.markupProcessingSettingsRepresentative)
    ) {
      addElementsToSet({
        targetSet:
            this.absolutePathsOfSourceFilesCorrespondingToViewedPages__forwardSlashesPathSeparators__processingOnDemandModeOnly,
        newElements:
            projectBuildingMasterConfigRepresentative.markupProcessingSettingsRepresentative.
                initialRelevantEntryPointsSourceFilesAbsolutePaths,
        mutably: true
      });
    }

    if (
      this.processingOnDemandSettings.enabled &&
          isNotUndefined(projectBuildingMasterConfigRepresentative.markupProcessingSettingsRepresentative)
    ) {

      if (this.processingOnDemandSettings.fullInitialBuilding) {
        addElementsToSet({
          targetSet:
              this.absolutePathsOfSourceFilesCorrespondingToViewedPages__forwardSlashesPathSeparators__processingOnDemandModeOnly,
          newElements:
              projectBuildingMasterConfigRepresentative.markupProcessingSettingsRepresentative.
                  initialRelevantEntryPointsSourceFilesAbsolutePaths,
          mutably: true
        });
      }


      MarkupSourceFilesWatcher.
          initializeIfRequiredAndGetInstance({
            projectBuildingMasterConfigRepresentative,
            markupProcessingSettingsRepresentative:
                projectBuildingMasterConfigRepresentative.markupProcessingSettingsRepresentative
          }).
          addOnEntryPointFileDeletedEventHandler({
            handlerID: "ON_MARKUP_ENTRY_POINT_FILE_DELETED--BY_BROWSER_LIVE_RELOADER",
            handler: (targetMarkupSourceFileAbsolutePath__forwardSlashesSeparators: string): void => {
              this.absolutePathsOfSourceFilesCorrespondingToViewedPages__forwardSlashesPathSeparators__processingOnDemandModeOnly.
                  delete(targetMarkupSourceFileAbsolutePath__forwardSlashesSeparators);
            }
          });

    }

  }


  /* ━━━ Private Methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private initializeBrowsersync(): void {

    BrowserSync.init(

      {

        /* [ Browsersync theory ] Either "server" or "proxy" could be specified but not both. */
        ...isNull(this.browserLiveReloadingSettingsRepresentative.proxy) ?
            {
              server: {
                baseDir: this.browserLiveReloadingSettingsRepresentative.targetFilesRootDirectoryAbsolutePath,
                index: this.browserLiveReloadingSettingsRepresentative.startingFileNameWithExtension
              }
            } : {
              proxy: this.browserLiveReloadingSettingsRepresentative.proxy
            },

        ...isNotNull(this.browserLiveReloadingSettingsRepresentative.HTTPS) ?
            {
              https: {
                key: this.browserLiveReloadingSettingsRepresentative.HTTPS.keyAbsolutePath,
                cert: this.browserLiveReloadingSettingsRepresentative.HTTPS.certificateAbsolutePath
              }
            } :
            null,

        cors: this.browserLiveReloadingSettingsRepresentative.mustUseCORS,

        /* [ Browsersync theory ] When port is undefined, it will be assigned automatically. */
        ...isNotNull(this.browserLiveReloadingSettingsRepresentative.localServerCustomPort) ?
            {
              port: this.browserLiveReloadingSettingsRepresentative.localServerCustomPort
            } :
            null,

        ignore: this.browserLiveReloadingSettingsRepresentative.globSelectorsOfFilesAndDirectoriesWhichWillBeIgnored,

        /* [ Browsersync theory ] When value is empty array, no browsers will be opened. */
        ...this.browserLiveReloadingSettingsRepresentative.targetBrowsers.length > 0 ?
            {
              browser: this.browserLiveReloadingSettingsRepresentative.targetBrowsers
            } :
            null,

        ui: this.browserLiveReloadingSettingsRepresentative.mustEnableBrowsersyncUserInterface ?
            {

              /* [ Browsersync theory ] When the port is undefined, it will be assigned automatically. */
              ...isNotNull(this.browserLiveReloadingSettingsRepresentative.browsersyncUserInterfaceCustomPort) ?
                  { port: this.browserLiveReloadingSettingsRepresentative.browsersyncUserInterfaceCustomPort } : null

            } :
            false,

        notify: this.browserLiveReloadingSettingsRepresentative.mustDisplayBrowsersyncConnectedPopupInBrowser,

        middleware: this.onRequest.bind(this)

      }

    );

  }

  private onAnyChangeInRelatedFiles(targetFileAbsolutePath__forwardSlashesPathSeparators: string): void {

    Logger.logWarning({
      badge: { customText: "Experimental" },
      title: "BrowserLiveReloader.onAnyChangeInRelatedFiles,",
      description: targetFileAbsolutePath__forwardSlashesPathSeparators,
      compactLayout: true,
      mustOutputIf: BrowserLiveReloader.EXPERIMENTAL_LOGGING
    });

    /* [ Approach ]
     * In processing on demand case, the browser live reloading is being triggered by a markup processor on HTML file ready.
     * */
    if (
      this.processingOnDemandSettings.enabled &&
          extractLastExtensionOfFileName({
            targetPath: targetFileAbsolutePath__forwardSlashesPathSeparators,
            withLeadingDot: true
          }) === "html"
    ) {
      return;
    }


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

  private async onRequest(request: HTTP.IncomingMessage, response: HTTP.ServerResponse, letPass: () => void): Promise<void> {

    Logger.logWarning({
      badge: { customText: "Experimental" },
      title: "BrowserLiveReloader.onRequest, URI:",
      description: request.url ?? "No URI",
      compactLayout: true,
      mustOutputIf: BrowserLiveReloader.EXPERIMENTAL_LOGGING
    });

    /* [ Approach ] Currently, this middleware is only processing on demand feature. */
    if (!this.processingOnDemandSettings.enabled) {
      letPass();
      return;
    }


    if (isUndefined(request.url)) {
      letPass();
      return;
    }


    const targetHTML_FileAbsolutePath__forwardSlashesPathSeparators: string = request.url === "/" ?
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

    if (
      extractLastExtensionOfFileName({
        targetPath: targetHTML_FileAbsolutePath__forwardSlashesPathSeparators, withLeadingDot: false
      }) !== "html"
    ) {
      letPass();
      return;
    }

    const correspondingSourcePugFileAbsolutePath__forwardSlashSeparators: string | undefined =
        MarkupProcessingSharedState.outputHTML_FilesAndSourcePugFilesAbsolutePathsCorrespondenceMap.
            get(targetHTML_FileAbsolutePath__forwardSlashesPathSeparators);

    /* [ Theory ]
     * Normally `correspondingSourcePugFileAbsolutePath__forwardSlashSeparators` is not undefined but there are some
     *   specific cases, for example, the HTML file copied from another project and embedded to other page via `iframe` */
    if (isUndefined(correspondingSourcePugFileAbsolutePath__forwardSlashSeparators)) {
      letPass();
      return;
    }


    const hasPageChanged: boolean =
        this.currentHTML_FileAbsolutePath__forwardSlashesPathSeparators !==
            targetHTML_FileAbsolutePath__forwardSlashesPathSeparators;

    Logger.logWarning({
      badge: { customText: "Experimental" },
      title: "BrowserLiveReloader.onRequest, Target HTML File:",
      description: targetHTML_FileAbsolutePath__forwardSlashesPathSeparators,
      mustOutputIf: BrowserLiveReloader.EXPERIMENTAL_LOGGING,
      additionalData: {
        hasPageChanged,
        relatedEntryPointsSourceFiles: correspondingSourcePugFileAbsolutePath__forwardSlashSeparators
      }
    });

    this.currentHTML_FileAbsolutePath__forwardSlashesPathSeparators =
        targetHTML_FileAbsolutePath__forwardSlashesPathSeparators;

    const isTargetHTML_FileExisting: boolean =
        this.absolutePathsOfSourceFilesCorrespondingToViewedPages__forwardSlashesPathSeparators__processingOnDemandModeOnly.
              has(correspondingSourcePugFileAbsolutePath__forwardSlashSeparators);

    if (isTargetHTML_FileExisting) {

      letPass();

      if (this.isFirstPageRequestInProcessingOnDemandMode) {
        this.isFirstPageRequestInProcessingOnDemandMode = false;
        return;
      }


      if (hasPageChanged) {

        await Promise.all(
          Array.from(BrowserLiveReloader.onNewPageOpenedEventHandlers.values()).map(
            async (onPageChangedEventHandler: BrowserLiveReloader.OnPageChangedEventHandler): Promise<void> =>
                onPageChangedEventHandler({
                  relatedSourcePugFileAbsolutePath__forwardSlashSeparators:
                      correspondingSourcePugFileAbsolutePath__forwardSlashSeparators,
                  HTML_FileAbsolutePath__forwardSlashSeparators: targetHTML_FileAbsolutePath__forwardSlashesPathSeparators
                })
          )
        );

      }

      return;

    }


    response.setHeader("Content-Type", "text/html");
    response.write(this.getLoadingPageHTML_ForProcessingOnDemandMode());
    response.end();

    await Promise.all(
      Array.from(BrowserLiveReloader.onNewPageOpenedEventHandlers.values()).map(
        async (onPageChangedEventHandler: BrowserLiveReloader.OnPageChangedEventHandler): Promise<void> =>
            onPageChangedEventHandler({
              relatedSourcePugFileAbsolutePath__forwardSlashSeparators:
                  correspondingSourcePugFileAbsolutePath__forwardSlashSeparators,
              HTML_FileAbsolutePath__forwardSlashSeparators: targetHTML_FileAbsolutePath__forwardSlashesPathSeparators
            })
      )
    );

    this.absolutePathsOfSourceFilesCorrespondingToViewedPages__forwardSlashesPathSeparators__processingOnDemandModeOnly.
        add(correspondingSourcePugFileAbsolutePath__forwardSlashSeparators);

    this.isFirstPageRequestInProcessingOnDemandMode = false;

  }

  private getLoadingPageHTML_ForProcessingOnDemandMode(): string {
    return this.loadingPageHTML_ForProcessingOnDemandMode ??
        (
          this.loadingPageHTML_ForProcessingOnDemandMode =
              FileSystem.readFileSync(
                InternalAssets.LOADING_SCREEN_HTML_FILE_FOR_PROCESSING_ON_DEMAND_MODE_ABSOLUTE_PATH, "utf-8"
              )
        );
  }

}


namespace BrowserLiveReloader {

  export type OnPageChangedEventHandler = (payload: OnPageChangedEventHandler.Payload) => Promise<void>;

  export namespace OnPageChangedEventHandler {

    export type ID = string;

    export type Payload = Readonly<{
      relatedSourcePugFileAbsolutePath__forwardSlashSeparators: string;
      HTML_FileAbsolutePath__forwardSlashSeparators: string;
    }>;

  }


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
