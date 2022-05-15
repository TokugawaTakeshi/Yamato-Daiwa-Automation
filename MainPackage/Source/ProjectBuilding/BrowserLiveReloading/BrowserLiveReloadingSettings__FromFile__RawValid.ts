import { RawObjectDataProcessor, nullToUndefined } from "@yamato-daiwa/es-extensions";


type BrowserLiveReloadingSettings__FromFile__RawValid = {
  readonly [setupID: string]: BrowserLiveReloadingSettings__FromFile__RawValid.Setup;
};


/* eslint-disable-next-line @typescript-eslint/no-redeclare --
 * The merging of type/interface and namespace is completely valid TypeScript,
 * but @typescript-eslint community does not wish to support it.
 * https://github.com/eslint/eslint/issues/15504 */
namespace BrowserLiveReloadingSettings__FromFile__RawValid {

  /* === Types ====================================================================================================== */
  export type Setup = {
    readonly targetFilesRootDirectoryRelativePath: string;
    readonly customStartingFilenameWithExtension?: string;
    readonly waitingForTheOtherFilesWillUpdateDuration__seconds?: number;
    readonly useHTTPS?: boolean;
    readonly virtualHost?: string;
    readonly ports?: {
      readonly main?: number;
      readonly userInterface?: number;
    };
    readonly ignoredFilesAndDirectories?: Array<string>;
  };


  /* === Localization =============================================================================================== */
  export type Localization = {

    readonly targetFilesRootDirectoryRelativePath: { KEY: string; };
    readonly customStartingFilenameWithExtension: { KEY: string; };
    readonly waitingForTheOtherFilesWillUpdateDuration__seconds: { KEY: string; };
    readonly useHTTPS: { KEY: string; };
    readonly virtualHost: { KEY: string; };

    readonly ports: {
      readonly KEY: string;
      readonly main: { KEY: string; };
      readonly userInterface: { KEY: string; };
    };

    readonly ignoredFilesAndDirectories: { KEY: string; };
  };

  export function getLocalizedPropertiesSpecification(
    browserLiveReloadingSettingsLocalization: Localization
  ): RawObjectDataProcessor.PropertiesSpecification {

    return {

      [browserLiveReloadingSettingsLocalization.targetFilesRootDirectoryRelativePath.KEY]: {
        newName: "targetFilesRootDirectoryRelativePath",
        type: String,
        required: true,
        minimalCharactersCount: 1
      },

      [browserLiveReloadingSettingsLocalization.customStartingFilenameWithExtension.KEY]: {
        newName: "customStartingFilenameWithExtension",
        type: String,
        required: false,
        minimalCharactersCount: 1
      },

      [browserLiveReloadingSettingsLocalization.waitingForTheOtherFilesWillUpdateDuration__seconds.KEY]: {
        newName: "waitingForTheOtherFilesWillUpdateDuration__seconds",
        type: Number,
        required: false,
        numbersSet: RawObjectDataProcessor.NumbersSets.anyRealNumber
      },

      [browserLiveReloadingSettingsLocalization.useHTTPS.KEY]: {
        newName: "useHTTPS",
        type: Boolean,
        required: false
      },

      [browserLiveReloadingSettingsLocalization.virtualHost.KEY]: {
        newName: "virtualHost",
        type: String,
        required: false,
        minimalCharactersCount: 1
      },

      [browserLiveReloadingSettingsLocalization.ports.KEY]: {

        newName: "ports",
        type: Object,
        preValidationModifications: nullToUndefined,
        required: false,

        properties: {

          [browserLiveReloadingSettingsLocalization.ports.main.KEY]: {
            newName: "main",
            type: Number,
            required: false,
            numbersSet: RawObjectDataProcessor.NumbersSets.nonNegativeInteger
          },

          [browserLiveReloadingSettingsLocalization.ports.userInterface.KEY]: {
            newName: "userInterface",
            type: Number,
            required: false,
            numbersSet: RawObjectDataProcessor.NumbersSets.nonNegativeInteger
          }
        }
      },

      [browserLiveReloadingSettingsLocalization.ignoredFilesAndDirectories.KEY]: {

        newName: "ignoreFilesAndDirectories",
        type: Array,
        preValidationModifications: nullToUndefined,
        required: false,

        element: {
          type: String,
          minimalCharactersCount: 1
        }
      }
    };
  }
}


export default BrowserLiveReloadingSettings__FromFile__RawValid;
