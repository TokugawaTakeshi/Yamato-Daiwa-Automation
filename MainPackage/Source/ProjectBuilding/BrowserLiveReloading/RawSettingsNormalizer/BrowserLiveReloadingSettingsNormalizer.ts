/* --- Default configuration ---------------------------------------------------------------------------------------- */
import BrowserLiveReloadingSettings__Default from "@BrowserLiveReloading/BrowserLiveReloadingSettings__Default";

/* --- Raw valid configuration -------------------------------------------------------------------------------------- */
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";
import type BrowserLiveReloadingSettings__FromFile__RawValid from
    "@BrowserLiveReloading/BrowserLiveReloadingSettings__FromFile__RawValid";

/* --- Normalized configuration ------------------------------------------------------------------------------------- */
import type BrowserLiveReloadingSettings__Normalized from "../BrowserLiveReloadingSettings__Normalized";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import {
  Logger,
  InvalidParameterValueError,
  stringifyAndFormatArbitraryValue,
  isString,
  isNonEmptyArbitraryObject,
  isUndefined,
  isNotUndefined
} from "@yamato-daiwa/es-extensions";
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";

/* --- Localization ------------------------------------------------------------------------------------------------- */
import browserLiveReloadingSettingsNormalizerLocalization__english from
    "@BrowserLiveReloading/RawSettingsNormalizer/BrowserLiveReloadingSettingsNormalizerLocalization.english";


class BrowserLiveReloadingSettingsNormalizer {

  public static localization: BrowserLiveReloadingSettingsNormalizer.Localization =
      browserLiveReloadingSettingsNormalizerLocalization__english;

  public static normalize(
    {
      browserLiveReloadingSettings__fromFile__rawValid,
      projectBuilderCommonSettings__normalized,
      hasSelectiveExecutionBeenDeclared,
      selectedBrowserLiveReloadingSetupID
    }: Readonly<{
      browserLiveReloadingSettings__fromFile__rawValid: BrowserLiveReloadingSettings__FromFile__RawValid;
      projectBuilderCommonSettings__normalized: ProjectBuildingCommonSettings__Normalized;
      hasSelectiveExecutionBeenDeclared: boolean;
      selectedBrowserLiveReloadingSetupID?: string;
    }>
  ): BrowserLiveReloadingSettings__Normalized | undefined {

    let actualBrowserLiveReloadingSetup__rawValid: BrowserLiveReloadingSettings__FromFile__RawValid.Setup | undefined;

    if (isNotUndefined(selectedBrowserLiveReloadingSetupID)) {

      actualBrowserLiveReloadingSetup__rawValid =
          browserLiveReloadingSettings__fromFile__rawValid.setups[selectedBrowserLiveReloadingSetupID];

      if (isUndefined(actualBrowserLiveReloadingSetup__rawValid)) {
        Logger.throwErrorAndLog({
          errorInstance: new InvalidParameterValueError({
            customMessage: BrowserLiveReloadingSettingsNormalizer.localization.
                generateUndefinedBrowserLiveReloadingSetupID_Message({
                  selectedBrowserLiveReloadingSetupID,
                  stringifiedAvailableBrowserLiveReloadingSetupsIDs: stringifyAndFormatArbitraryValue(
                    Object.keys(browserLiveReloadingSettings__fromFile__rawValid)
                  )
                })
          }),
          occurrenceLocation: "BrowserLiveReloadingSettingsNormalizer.normalize(namedParameters)",
          title: InvalidParameterValueError.localization.defaultTitle
        });
      }

    } else if (
      !hasSelectiveExecutionBeenDeclared &&
      Object.values(browserLiveReloadingSettings__fromFile__rawValid).length === 1
    ) {

      actualBrowserLiveReloadingSetup__rawValid = Object.values(browserLiveReloadingSettings__fromFile__rawValid.setups)[0];

    } else {
      return;
    }


    return {

      setup: {

        localServer: {

          rootDirectoryAbsolutePath: ImprovedPath.joinPathSegments(
              [
                projectBuilderCommonSettings__normalized.projectRootDirectoryAbsolutePath,
                actualBrowserLiveReloadingSetup__rawValid.localServer.rootDirectoryRelativePath
              ],
              { alwaysForwardSlashSeparators: true }
          ),

          ignoredFilesAndDirectoriesRelativePaths: ((): ReadonlyArray<string> => {

            const ignoredFilesAndDirectoriesRelativePaths: ReadonlyArray<string> | string | undefined =
                actualBrowserLiveReloadingSetup__rawValid.localServer.ignoredFilesAndDirectoriesRelativePaths;

            if (Array.isArray(ignoredFilesAndDirectoriesRelativePaths)) {
              return ignoredFilesAndDirectoriesRelativePaths;
            } else if (isString(ignoredFilesAndDirectoriesRelativePaths)) {
              return [ ignoredFilesAndDirectoriesRelativePaths ];
            }


            return [];

          })(),

          ...isNotUndefined(actualBrowserLiveReloadingSetup__rawValid.localServer.customPort) ? {
            port: actualBrowserLiveReloadingSetup__rawValid.localServer.customPort
          } : null,

          startingFileNameWithExtension:
              actualBrowserLiveReloadingSetup__rawValid.localServer.customStartingFileNameWithExtension ??
              BrowserLiveReloadingSettings__Default.setup.localServer.startingFileNameWithExtension,

          ...isNotUndefined(actualBrowserLiveReloadingSetup__rawValid.localServer.HTTPS) ? {

            HTTPS: {
              keyAbsolutePath: ImprovedPath.joinPathSegments(
                [
                  projectBuilderCommonSettings__normalized.projectRootDirectoryAbsolutePath,
                  actualBrowserLiveReloadingSetup__rawValid.localServer.HTTPS.SSL_KeyRelativePath
                ],
                { alwaysForwardSlashSeparators: true }
              ),
              certificateAbsolutePath: ImprovedPath.joinPathSegments(
                [
                  projectBuilderCommonSettings__normalized.projectRootDirectoryAbsolutePath,
                  actualBrowserLiveReloadingSetup__rawValid.localServer.HTTPS.SSL_CertificateRelativePath
                ],
                { alwaysForwardSlashSeparators: true }
              )
            }

          } : null,

          mustUseCORS:
              actualBrowserLiveReloadingSetup__rawValid.localServer.useCORS === true ?
                  true : BrowserLiveReloadingSettings__Default.setup.localServer.CORS_Usage
        },

        ...isNotUndefined(actualBrowserLiveReloadingSetup__rawValid.proxy) ? {
          proxy: actualBrowserLiveReloadingSetup__rawValid.proxy
        } : {},

        ...((): { targetBrowsers?: ReadonlyArray<string>; } => {

          if (isUndefined(actualBrowserLiveReloadingSetup__rawValid.openInBrowsers)) {
            return {};
          }


          return {
            targetBrowsers: Array.isArray(actualBrowserLiveReloadingSetup__rawValid.openInBrowsers) ?
                actualBrowserLiveReloadingSetup__rawValid.openInBrowsers :
                [ actualBrowserLiveReloadingSetup__rawValid.openInBrowsers ]
          };

        })(),

        browserSyncUserInterface: {

          enabled: BrowserLiveReloadingSettings__Default.setup.browserSyncUserInterface.enabled,

          ...((): { port?: number; } => {

            if (
                isUndefined(actualBrowserLiveReloadingSetup__rawValid.browserSyncUserInterface) ||
                isUndefined(actualBrowserLiveReloadingSetup__rawValid.browserSyncUserInterface.customPort)
            ) {
              return {};
            }


            return {
              port: actualBrowserLiveReloadingSetup__rawValid.browserSyncUserInterface.customPort
            };

          })()
        },

        ...((): { browserSyncUserInterface?: BrowserLiveReloadingSettings__Normalized.Setup.BrowserSyncUserInterface; } => {

          if (!isNonEmptyArbitraryObject(actualBrowserLiveReloadingSetup__rawValid.browserSyncUserInterface)) {
            return {};
          }


          return {
            browserSyncUserInterface: {
              ...isNotUndefined(actualBrowserLiveReloadingSetup__rawValid.browserSyncUserInterface.customPort) ?
                  { port: actualBrowserLiveReloadingSetup__rawValid.browserSyncUserInterface.customPort } : null,
              enabled: BrowserLiveReloadingSettings__Default.setup.browserSyncUserInterface.enabled
            }
          };

        })(),

        periodBetweenFileUpdatingAndBrowserReloading__seconds:
            actualBrowserLiveReloadingSetup__rawValid.periodBetweenFileUpdatingAndBrowserReloading__seconds ??
            BrowserLiveReloadingSettings__Default.setup.periodBetweenFileUpdatingAndBrowserReloading__seconds

      },

      logging: {
        outputFileChangeDetection: browserLiveReloadingSettings__fromFile__rawValid.logging?.outputFileChangeDetection ??
            BrowserLiveReloadingSettings__Default.logging.outputFileChangeDetection,
        browserTabWillBeReloadedSoon: browserLiveReloadingSettings__fromFile__rawValid.logging?.browserTabWillBeReloadedSoon ??
            BrowserLiveReloadingSettings__Default.logging.browserTabWillBeReloadedSoon,
        browsersyncConnection: browserLiveReloadingSettings__fromFile__rawValid.logging?.browsersyncConnection ??
            BrowserLiveReloadingSettings__Default.logging.browsersyncConnection
      }

    };
  }
}


namespace BrowserLiveReloadingSettingsNormalizer {

  export type Localization = Readonly<{
    generateUndefinedBrowserLiveReloadingSetupID_Message: (
      namedParameters: Localization.UndefinedBrowserLiveReloadingSetupID_Log.NamedParameters
    ) => string;
  }>;

  export namespace Localization {

    export namespace UndefinedBrowserLiveReloadingSetupID_Log {
      export type NamedParameters = Readonly<{
        selectedBrowserLiveReloadingSetupID: string;
        stringifiedAvailableBrowserLiveReloadingSetupsIDs: string;
      }>;
    }

  }

}


export default BrowserLiveReloadingSettingsNormalizer;

/* eslint-disable-next-line @typescript-eslint/no-unused-vars --
 * It is the only way to extract the child namespace (no need to expose whole MarkupProcessingRawSettingsNormalizer
 * for the localization packages).
 * https://stackoverflow.com/a/73400523/4818123 */
export import BrowserLiveReloadingSettingsNormalizerLocalization = BrowserLiveReloadingSettingsNormalizer.Localization;
