/* --- General utils ------------------------------------------------------------------------------------------------ */
import { RawObjectDataProcessor, nullToUndefined } from "@yamato-daiwa/es-extensions";


type BrowserLiveReloadingSettings__FromFile__RawValid = Readonly<{
  setups: BrowserLiveReloadingSettings__FromFile__RawValid.Setups;
  logging?: BrowserLiveReloadingSettings__FromFile__RawValid.Logging;
}>;


/* eslint-disable-next-line @typescript-eslint/no-redeclare --
 * The merging of type/interface and namespace is completely valid TypeScript,
 * but @typescript-eslint community does not wish to support it.
 * https://github.com/eslint/eslint/issues/15504 */
namespace BrowserLiveReloadingSettings__FromFile__RawValid {

  /* === Types ====================================================================================================== */
  export type Setups = Readonly<{ [setupID: string]: Setup; }>;

  export type Setup = Readonly<{
    localServer: Setup.LocalServer;
    proxy?: string;
    openInBrowsers?: ReadonlyArray<string> | string;
    browserSyncUserInterface?: Setup.BrowserSyncUserInterface;
    periodBetweenFileUpdatingAndBrowserReloading__seconds?: number;
  }>;

  export namespace Setup {

    export type LocalServer = Readonly<{
      rootDirectoryRelativePath: string;
      ignoredFilesAndDirectoriesRelativePaths?: ReadonlyArray<string>;
      customPort?: number;
      customStartingFileNameWithExtension?: string;
      useHTTPS?: boolean;
      useCORS?: boolean;
    }>;

    export type BrowserSyncUserInterface = Readonly<{
      customPort?: number;
      disable?: boolean;
    }>;
  }


  export type Logging = Readonly<{
    outputFileChangeDetection?: boolean;
    browserTabWillBeReloadedSoon?: boolean;
    browsersyncConnection?: boolean;
  }>;


  /* === Localization =============================================================================================== */
  export type Localization = Readonly<{

    setups: Readonly<{

      KEY: string;

      localServer: Readonly<{
        KEY: string;
        rootDirectoryRelativePath: Readonly<{ KEY: string; }>;
        ignoredFilesAndDirectoriesRelativePaths: Readonly<{ KEY: string; }>;
        customPort: Readonly<{ KEY: string; }>;
        customStartingFileNameWithExtension: Readonly<{ KEY: string; }>;
        useHTTPS: Readonly<{ KEY: string; }>;
        useCORS: Readonly<{ KEY: string; }>;
      }>;

      proxy: Readonly<{ KEY: string; }>;

      openInBrowsers: Readonly<{ KEY: string; }>;

      browserSyncUserInterface: Readonly<{
        KEY: string;
        disable: Readonly<{ KEY: string; }>;
        customPort: Readonly<{ KEY: string; }>;
      }>;

      periodBetweenFileUpdatingAndBrowserReloading__seconds: Readonly<{ KEY: string; }>;

    }>;

    logging: Readonly<{
      KEY: string;
      outputFileChangeDetection: Readonly<{ KEY: string; }>;
      browserTabWillBeReloadedSoon: Readonly<{ KEY: string; }>;
      browsersyncConnection: Readonly<{ KEY: string; }>;
    }>;
  }>;

  export function getLocalizedPropertiesSpecification(
    browserLiveReloadingSettingsLocalization: Localization
  ): RawObjectDataProcessor.PropertiesSpecification {

    return {

      [browserLiveReloadingSettingsLocalization.setups.KEY]: {

        newName: "setups",
        type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
        required: true,
        minimalEntriesCount: 1,

        value: {

          type: Object,
          properties: {

            [browserLiveReloadingSettingsLocalization.setups.localServer.KEY]: {

              newName: "localServer",
              type: Object,
              required: true,
              properties: {

                [browserLiveReloadingSettingsLocalization.setups.localServer.rootDirectoryRelativePath.KEY]: {
                  newName: "rootDirectoryRelativePath",
                  type: String,
                  required: true,
                  minimalCharactersCount: 1
                },

                [browserLiveReloadingSettingsLocalization.setups.localServer.ignoredFilesAndDirectoriesRelativePaths.KEY]: {
                  newName: "ignoredFilesAndDirectoriesRelativePaths",
                  type: Array,
                  required: false,
                  preValidationModifications: nullToUndefined,
                  element: {
                    type: String,
                    minimalCharactersCount: 1
                  }
                },

                [browserLiveReloadingSettingsLocalization.setups.localServer.customPort.KEY]: {
                  newName: "customPort",
                  type: Number,
                  numbersSet: RawObjectDataProcessor.NumbersSets.nonNegativeInteger,
                  required: false,
                  maximalValue: 65536
                },

                [browserLiveReloadingSettingsLocalization.setups.localServer.customStartingFileNameWithExtension.KEY]: {
                  newName: "customStartingFileNameWithExtension",
                  type: String,
                  required: false,
                  minimalCharactersCount: 1
                },

                [browserLiveReloadingSettingsLocalization.setups.localServer.useHTTPS.KEY]: {
                  newName: "useHTTPS",
                  type: Boolean,
                  required: false
                },

                [browserLiveReloadingSettingsLocalization.setups.localServer.useCORS.KEY]: {
                  newName: "useCORS",
                  type: Boolean,
                  required: false
                }
              }
            },

            [browserLiveReloadingSettingsLocalization.setups.proxy.KEY]: {
              newName: "proxy",
              type: String,
              required: false,
              minimalCharactersCount: 1
            },

            [browserLiveReloadingSettingsLocalization.setups.openInBrowsers.KEY]: {

              newName: "openInBrowsers",
              type: RawObjectDataProcessor.ValuesTypesIDs.oneOf,
              required: false,

              alternatives: [
                {
                  type: Array,
                  minimalElementsCount: 1,
                  element: {
                    type: String,
                    minimalCharactersCount: 1
                  }
                },
                {
                  type: String,
                  minimalCharactersCount: 1
                }
              ]
            },

            [browserLiveReloadingSettingsLocalization.setups.browserSyncUserInterface.KEY]: {

              newName: "browserSyncUserInterface",
              type: Object,
              required: false,
              preValidationModifications: nullToUndefined,

              properties: {

                [browserLiveReloadingSettingsLocalization.setups.browserSyncUserInterface.customPort.KEY]: {
                  newName: "customPort",
                  type: Number,
                  numbersSet: RawObjectDataProcessor.NumbersSets.nonNegativeInteger,
                  required: false,
                  maximalValue: 65536
                },

                [browserLiveReloadingSettingsLocalization.setups.browserSyncUserInterface.disable.KEY]: {
                  newName: "disable",
                  type: Boolean,
                  required: false
                }
              }
            },

            [browserLiveReloadingSettingsLocalization.setups.periodBetweenFileUpdatingAndBrowserReloading__seconds.KEY]: {
              newName: "periodBetweenFileUpdatingAndBrowserReloading__seconds",
              type: Number,
              required: false,
              numbersSet: RawObjectDataProcessor.NumbersSets.anyRealNumber
            }
          }
        }
      },

      [browserLiveReloadingSettingsLocalization.logging.KEY]: {

        newName: "logging",
        type: Object,
        required: false,
        preValidationModifications: nullToUndefined,

        properties: {

          [browserLiveReloadingSettingsLocalization.logging.outputFileChangeDetection.KEY]: {
            newName: "outputFileChangeDetection",
            type: Boolean,
            required: false
          },

          [browserLiveReloadingSettingsLocalization.logging.browserTabWillBeReloadedSoon.KEY]: {
            newName: "browserTabWillBeReloadedSoon",
            type: Boolean,
            required: false
          },

          [browserLiveReloadingSettingsLocalization.logging.browsersyncConnection.KEY]: {
            newName: "browsersyncConnection",
            type: Boolean,
            required: false
          }
        }
      }
    };
  }
}


export default BrowserLiveReloadingSettings__FromFile__RawValid;
