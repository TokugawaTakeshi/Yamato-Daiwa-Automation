/* --- General utils ------------------------------------------------------------------------------------------------ */
import { RawObjectDataProcessor } from "@yamato-daiwa/es-extensions";


type BrowserLiveReloadingSettings__FromFile__RawValid = Readonly<{
  setups: BrowserLiveReloadingSettings__FromFile__RawValid.Setups;
  logging?: BrowserLiveReloadingSettings__FromFile__RawValid.Logging;
}>;


namespace BrowserLiveReloadingSettings__FromFile__RawValid {

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
      HTTPS?: LocalServer.HTTPS;
      useCORS?: boolean;
    }>;

    export namespace LocalServer {
      export type HTTPS = Readonly<{
        SSL_KeyRelativePath: string;
        SSL_CertificateRelativePath: string;
      }>;
    }


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


  export const propertiesSpecification: RawObjectDataProcessor.PropertiesSpecification = {

    $setups: {

      newName: "setups",
      type: RawObjectDataProcessor.ValuesTypesIDs.associativeArray,
      isUndefinedForbidden: true,
      isNullForbidden: true,
      areUndefinedTypeValuesForbidden: true,
      areNullTypeValuesForbidden: true,
      minimalEntriesCount: 1,

      value: {

        type: Object,
        properties: {

          $localServer: {

            newName: "localServer",
            type: Object,
            isUndefinedForbidden: true,
            isNullForbidden: true,
            properties: {

              $rootDirectoryRelativePath: {
                newName: "rootDirectoryRelativePath",
                type: String,
                isUndefinedForbidden: true,
                isNullForbidden: true,
                minimalCharactersCount: 1
              },

              $ignoredFilesAndDirectoriesRelativePaths: {
                newName: "ignoredFilesAndDirectoriesRelativePaths",
                type: Array,
                isUndefinedForbidden: false,
                mustTransformNullToUndefined: true,
                areUndefinedElementsForbidden: true,
                areNullElementsForbidden: true,
                element: {
                  type: String,
                  minimalCharactersCount: 1
                }
              },

              $customPort: {
                newName: "customPort",
                type: Number,
                numbersSet: RawObjectDataProcessor.NumbersSets.positiveIntegerOrZero,
                isUndefinedForbidden: false,
                isNullForbidden: true,
                maximalValue: 65536
              },

              $customStartingFileNameWithExtension: {
                newName: "customStartingFileNameWithExtension",
                type: String,
                isUndefinedForbidden: false,
                isNullForbidden: true,
                minimalCharactersCount: 1
              },

              $HTTPS: {

                newName: "HTTPS",
                type: Object,
                isUndefinedForbidden: false,
                mustTransformNullToUndefined: true,

                properties: {

                  $SSL_KeyRelativePath: {
                    newName: "SSL_KeyRelativePath",
                    type: String,
                    isUndefinedForbidden: true,
                    isNullForbidden: true,
                    minimalCharactersCount: 1
                  },

                  $SSL_CertificateRelativePath: {
                    newName: "SSL_CertificateRelativePath",
                    type: String,
                    isUndefinedForbidden: true,
                    isNullForbidden: true,
                    minimalCharactersCount: 1
                  }

                }

              },

              $useCORS: {
                newName: "useCORS",
                type: Boolean,
                isUndefinedForbidden: false,
                isNullForbidden: true
              }

            }

          },

          $proxy: {
            newName: "proxy",
            type: String,
            isUndefinedForbidden: false,
            isNullForbidden: true,
            minimalCharactersCount: 1
          },

          $openInBrowsers: {

            newName: "openInBrowsers",
            type: RawObjectDataProcessor.ValuesTypesIDs.polymorphic,
            isUndefinedForbidden: false,
            isNullForbidden: true,

            alternatives: [
              {
                type: Array,
                areUndefinedElementsForbidden: true,
                areNullElementsForbidden: true,
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

          $browserSyncUserInterface: {

            newName: "browserSyncUserInterface",
            type: Object,
            isUndefinedForbidden: false,
            mustTransformNullToUndefined: true,

            properties: {

              $customPort: {
                newName: "customPort",
                type: Number,
                numbersSet: RawObjectDataProcessor.NumbersSets.positiveIntegerOrZero,
                isUndefinedForbidden: false,
                isNullForbidden: true,
                maximalValue: 65536
              },

              $disable: {
                newName: "disable",
                type: Boolean,
                isUndefinedForbidden: false,
                isNullForbidden: true
              }

            }

          },

          $periodBetweenFileUpdatingAndBrowserReloading__seconds: {
            newName: "periodBetweenFileUpdatingAndBrowserReloading__seconds",
            type: Number,
            isUndefinedForbidden: false,
            isNullForbidden: true,
            numbersSet: RawObjectDataProcessor.NumbersSets.anyRealNumber
          }
        }
      }
    },

    $logging: {

      newName: "logging",
      type: Object,
      isUndefinedForbidden: false,
      mustTransformNullToUndefined: true,

      properties: {

        $outputFileChangeDetection: {
          newName: "outputFileChangeDetection",
          type: Boolean,
          isUndefinedForbidden: false,
          isNullForbidden: true
        },

        $browserTabWillBeReloadedSoon: {
          newName: "browserTabWillBeReloadedSoon",
          type: Boolean,
          isUndefinedForbidden: false,
          isNullForbidden: true
        },

        $browsersyncConnection: {
          newName: "browsersyncConnection",
          type: Boolean,
          isUndefinedForbidden: false,
          isNullForbidden: true
        }
      }

    }

  };

}


export default BrowserLiveReloadingSettings__FromFile__RawValid;
