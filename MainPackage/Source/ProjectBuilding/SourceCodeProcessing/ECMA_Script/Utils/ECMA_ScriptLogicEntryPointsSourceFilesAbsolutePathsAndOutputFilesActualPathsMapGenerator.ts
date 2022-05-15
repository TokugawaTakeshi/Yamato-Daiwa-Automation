/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type ECMA_ScriptLogicProcessingSettings__Normalized from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettings__Normalized";

/* --- Settings representatives ------------------------------------------------------------------------------------- */
import type ECMA_ScriptLogicProcessingSettingsRepresentative from
      "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettingsRepresentative";

/* --- Utils -------------------------------------------------------------------------------------------------------- */
import {
  Logger,
  AlgorithmMismatchError,
  stringifyAndFormatArbitraryValue
} from "@yamato-daiwa/es-extensions";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";
import ImprovedGlob from "@UtilsIncubator/ImprovedGlob";


export default class ECMA_ScriptLogicEntryPointsSourceFilesAbsolutePathsAndOutputFilesActualPathsMapGenerator {

  public static generate(
    ecmaScriptLogicProcessingConfigRepresentative: ECMA_ScriptLogicProcessingSettingsRepresentative
  ): Map<string, string> {

    const entryPointsSourceFilesAbsolutePathsAndOutputFilesActualPathsMap: Map<string, string> = new Map<string, string>();


    for (
      const entryPointsGroupNormalizedSettings
      of ecmaScriptLogicProcessingConfigRepresentative.relevantEntryPointsGroupsSettings.values()
    ) {

      const sourceFilesAbsolutePaths: Array<string> = ImprovedGlob.getFilesAbsolutePathsSynchronously(
        entryPointsGroupNormalizedSettings.sourceFilesGlobSelectors
      );


      for (const sourceFileAbsolutePath of sourceFilesAbsolutePaths) {
        entryPointsSourceFilesAbsolutePathsAndOutputFilesActualPathsMap.set(
          sourceFileAbsolutePath,
          ECMA_ScriptLogicEntryPointsSourceFilesAbsolutePathsAndOutputFilesActualPathsMapGenerator.
              getEntryPointsOutputFileActualAbsolutePath(sourceFileAbsolutePath, entryPointsGroupNormalizedSettings)
        );
      }
    }

    return entryPointsSourceFilesAbsolutePathsAndOutputFilesActualPathsMap;
  }


  private static getEntryPointsOutputFileActualAbsolutePath(
    sourceFileAbsolutePath: string,
    entryPointsGroupNormalizedSettings: ECMA_ScriptLogicProcessingSettings__Normalized.EntryPointsGroup
  ): string {

    let correspondingOutputFileAbsolutePath: string;

    if (entryPointsGroupNormalizedSettings.revisioning.mustExecute) {

      const targetOutputFileGlobSelector: string = ImprovedPath.buildAbsolutePath(
        [
          entryPointsGroupNormalizedSettings.outputFilesTopDirectoryAbsolutePath,
          `${ ImprovedPath.extractFileNameWithoutExtensionFromPath(sourceFileAbsolutePath) }**.js`
        ],
        { forwardSlashOnlySeparators: true }
      );

      const targetOutputFileSearchResults: Array<string> = ImprovedGlob.getFilesAbsolutePathsSynchronously(
        [ targetOutputFileGlobSelector ]
      );

      if (targetOutputFileSearchResults.length === 0) {
        Logger.throwErrorAndLog({
          errorInstance: new AlgorithmMismatchError(`入点源ファイル:${ sourceFileAbsolutePath }に該当している出力ファイルが見つけられなかった。`),
          occurrenceLocation:
              "ECMA_ScriptLogicEntryPointsSourceFilesAbsolutePathsAndOutputFilesActualPathsMapGenerator" +
              ".getEntryPointsOutputFileActualAbsolutePath(...parameters)",
          title: AlgorithmMismatchError.localization.defaultTitle
        });
      } else if (targetOutputFileSearchResults.length > 1) {
        Logger.throwErrorAndLog({
          errorInstance: new AlgorithmMismatchError(
              `入点源ファイル:${ sourceFileAbsolutePath }に該当している出力ファイルが複数件が発見された：\n` +
              `${ stringifyAndFormatArbitraryValue(targetOutputFileSearchResults) }\n` +
              "前の構成は自動的に削除されなかった場合、再構成する前に手動で削除して下さい。"
          ),
          occurrenceLocation:
              "ECMA_ScriptLogicEntryPointsSourceFilesAbsolutePathsAndOutputFilesActualPathsMapGenerator" +
              ".getEntryPointsOutputFileActualAbsolutePath(...parameters)",
          title: AlgorithmMismatchError.localization.defaultTitle
        });
      }

      correspondingOutputFileAbsolutePath = targetOutputFileSearchResults[0];

    } else {
      correspondingOutputFileAbsolutePath = ImprovedPath.buildAbsolutePath(
        [
          entryPointsGroupNormalizedSettings.outputFilesTopDirectoryAbsolutePath,
          `${ ImprovedPath.extractFileNameWithoutExtensionFromPath(sourceFileAbsolutePath) }.js`
        ],
        { forwardSlashOnlySeparators: true }
      );
    }


    return correspondingOutputFileAbsolutePath;
  }
}
