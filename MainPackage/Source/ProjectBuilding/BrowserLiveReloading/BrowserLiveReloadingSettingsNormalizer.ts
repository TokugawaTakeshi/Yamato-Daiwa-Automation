/* --- Business rules ----------------------------------------------------------------------------------------------- */
import BrowserLiveReloadingSettings__Default from "@BrowserLiveReloading/BrowserLiveReloadingSettings__Default";

/* --- Raw valid config --------------------------------------------------------------------------------------------- */
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding:Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";
import type BrowserLiveReloadingSettings__FromFile__RawValid from
    "@BrowserLiveReloading/BrowserLiveReloadingSettings__FromFile__RawValid";

/* --- Normalized config -------------------------------------------------------------------------------------------- */
import type BrowserLiveReloadingSettings__Normalized from "./BrowserLiveReloadingSettings__Normalized";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import {
  Logger,
  InvalidParameterValueError,
  isUndefined,
  isNotUndefined,
  isNumber
} from "@yamato-daiwa/es-extensions";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";


export default class BrowserLiveReloadingSettingsNormalizer {

  public static getNormalizedSettings(
    {
      browserLiveReloadingSettings__fromFile__rawValid,
      projectBuilderCommonSettings__normalized,
      hasSelectiveExecutionBeenDeclared,
      selectedBrowserLiveReloadingSetupID
    }: {
      browserLiveReloadingSettings__fromFile__rawValid: BrowserLiveReloadingSettings__FromFile__RawValid;
      projectBuilderCommonSettings__normalized: ProjectBuildingCommonSettings__Normalized;
      hasSelectiveExecutionBeenDeclared: boolean;
      selectedBrowserLiveReloadingSetupID?: string;
    }
  ): BrowserLiveReloadingSettings__Normalized | undefined {

    let targetBrowserLiveReloadingProfile__rawValid: BrowserLiveReloadingSettings__FromFile__RawValid.Setup | undefined;

    if (isNotUndefined(selectedBrowserLiveReloadingSetupID)) {

      targetBrowserLiveReloadingProfile__rawValid =
          browserLiveReloadingSettings__fromFile__rawValid[selectedBrowserLiveReloadingSetupID];

      if (isUndefined(targetBrowserLiveReloadingProfile__rawValid)) {
        Logger.throwErrorAndLog({
          errorInstance: new InvalidParameterValueError({
            parameterName: "parametersObject",
            messageSpecificPart: `プロパティ：'selectedBrowserLiveReloadingSetupID'の値：'${ selectedBrowserLiveReloadingSetupID }'に該当する` +
                "ブラウザ自動リロードの設定は定義されていない。"
          }),
          occurrenceLocation: "BrowserLiveReloadingSettingsNormalizer.getNormalizedSettings(parametersObject)",
          title: InvalidParameterValueError.localization.defaultTitle
        });
      }
    } else if (
        !hasSelectiveExecutionBeenDeclared &&
        Object.values(browserLiveReloadingSettings__fromFile__rawValid).length === 1
    ) {
      targetBrowserLiveReloadingProfile__rawValid = Object.values(browserLiveReloadingSettings__fromFile__rawValid)[0];
    } else {
      return;
    }

    return {
      targetFilesRootDirectoryAbsolutePath: ImprovedPath.buildAbsolutePath(
      [
          projectBuilderCommonSettings__normalized.projectRootDirectoryAbsolutePath,
          targetBrowserLiveReloadingProfile__rawValid.targetFilesRootDirectoryRelativePath
        ],
        { forwardSlashOnlySeparators: true }
      ),
      startingFilenameWithExtension:
          targetBrowserLiveReloadingProfile__rawValid.customStartingFilenameWithExtension ??
          BrowserLiveReloadingSettings__Default.startingFilenameWithExtension,

      waitingForTheOtherFilesWillUpdateDuration__seconds:
          targetBrowserLiveReloadingProfile__rawValid.waitingForTheOtherFilesWillUpdateDuration__seconds ??
          BrowserLiveReloadingSettings__Default.waitingDurationForSubsequentFilesWillBeUpdatedBeforeBrowserReloading__seconds,
      ...isNotUndefined(targetBrowserLiveReloadingProfile__rawValid.virtualHost) ? {
        virtualHost: targetBrowserLiveReloadingProfile__rawValid.virtualHost
      } : {},
      ...isNotUndefined(targetBrowserLiveReloadingProfile__rawValid.ports) ? {
        ports: {
          ...isNumber(targetBrowserLiveReloadingProfile__rawValid.ports.main) ? {
            main: targetBrowserLiveReloadingProfile__rawValid.ports.main
          } : {},
          ...isNumber(targetBrowserLiveReloadingProfile__rawValid.ports.userInterface) ? {
            userInterface: targetBrowserLiveReloadingProfile__rawValid.ports.userInterface
          } : {}
        }
      } : {},
      ignoredFilesAndDirectories:
          isNotUndefined(targetBrowserLiveReloadingProfile__rawValid.ignoredFilesAndDirectories) ?
              targetBrowserLiveReloadingProfile__rawValid.ignoredFilesAndDirectories : []
    };
  }
}
