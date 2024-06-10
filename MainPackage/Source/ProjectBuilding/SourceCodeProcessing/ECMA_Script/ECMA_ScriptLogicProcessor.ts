import ECMA_ScriptLogicProcessingSharedState from "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSharedState";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type ECMA_ScriptLogicProcessingSettingsRepresentative from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettingsRepresentative";

/* ─── Applied Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import Webpack from "webpack";
import type { Configuration as WebpackConfiguration } from "webpack";
import WebpackConfigGenerator from "@ECMA_ScriptProcessing/Utils/WebpackConfigGenerator";
import ECMA_ScriptLogicEntryPointsSourceFilesAbsolutePathsAndOutputFilesActualPathsMapGenerator from
    "@ECMA_ScriptProcessing/Utils/ECMA_ScriptLogicEntryPointsSourceFilesAbsolutePathsAndOutputFilesActualPathsMapGenerator";
import ECMA_ScriptSourceFilesWatcher from "@ECMA_ScriptProcessing/ECMA_ScriptSourceFilesWatcher";
import NodeNotifier from "node-notifier";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import {
  Logger,
  UnexpectedEventError,
  isNotUndefined,
  isNeitherUndefinedNorNull,
  undefinedToEmptyArray,
  addMultiplePairsToMap,
  isUndefined
} from "@yamato-daiwa/es-extensions";


export default class ECMA_ScriptLogicProcessor {

  protected readonly TASK_NAME_FOR_LOGGING: string = "ECMAScript logic processing";

  private readonly masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
  private readonly ECMA_ScriptLogicProcessingConfigRepresentative: ECMA_ScriptLogicProcessingSettingsRepresentative;


  public static provideLogicProcessingIfMust(
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): (callback: (error?: Error) => void) => void {

    const ecmaScriptLogicProcessingSettingsRepresentative: ECMA_ScriptLogicProcessingSettingsRepresentative | undefined =
        projectBuildingMasterConfigRepresentative.ECMA_ScriptLogicProcessingSettingsRepresentative;

    if (isUndefined(ecmaScriptLogicProcessingSettingsRepresentative)) {
      return (callback: () => void): void => { callback(); };
    }


    const dataHoldingSelfInstance: ECMA_ScriptLogicProcessor = new ECMA_ScriptLogicProcessor(
      ecmaScriptLogicProcessingSettingsRepresentative, projectBuildingMasterConfigRepresentative
    );


    const webpackConfigurationSets: ReadonlyArray<WebpackConfiguration> = WebpackConfigGenerator.
        generateWebpackConfigurationForEachEntryPointsGroup(
          ecmaScriptLogicProcessingSettingsRepresentative, projectBuildingMasterConfigRepresentative
        );

    return (callback: (error?: Error) => void): void => {

      try {

        /* [ Webpack theory ] Although there is no `null` hardError is type definitions, the `hardError` could be null. */
        Webpack(webpackConfigurationSets, (
          hardError?: Error | null, statistics?: Webpack.MultiStats
        ): void => {

          if (isNotUndefined(statistics)) {
            process.stdout.write(`${ statistics.toString({ colors: true }) }\n`);
          }

          let finalErrorMessageDynamicPart: string | undefined;

          /* [ Webpack theory ] Even there is no hard error braking the build, there are could be the soft errors. */
          const softErrors: Array<Error> = undefinedToEmptyArray(statistics?.stats[0]?.compilation.errors);

          if (isNeitherUndefinedNorNull(hardError)) {
            finalErrorMessageDynamicPart = hardError.message;
          } else if (softErrors.length > 0) {
            finalErrorMessageDynamicPart = softErrors.toString();
          }

          if (isNotUndefined(finalErrorMessageDynamicPart)) {

            Logger.logError({
              errorType: "ECMA_ScriptLogicProcessingError",
              title: "ECMAScript logic processing error",
              description: finalErrorMessageDynamicPart,
              occurrenceLocation: "ECMA_ScriptLogicProcessor.provideLogicProcessing(projectBuildingMasterConfigRepresentative)"
            });

            NodeNotifier.notify({
              title: "ECMAScript logic processing",
              message: "Error has occurred. Please check the console."
            });

          }

          if (dataHoldingSelfInstance.masterConfigRepresentative.mustProvideIncrementalBuilding) {
            ECMA_ScriptSourceFilesWatcher.initializeIfRequiredAndGetInstance({
              ecmaScriptLogicProcessingSettingsRepresentative: dataHoldingSelfInstance.
                  ECMA_ScriptLogicProcessingConfigRepresentative,
              projectBuildingMasterConfigRepresentative: dataHoldingSelfInstance.masterConfigRepresentative
            });
          }

          /** 〔 納品版のみ理由 〕　開発版で同じ事をすれば、gulpが落ちる */
          if (
            !dataHoldingSelfInstance.masterConfigRepresentative.mustProvideIncrementalBuilding &&
            isNotUndefined(finalErrorMessageDynamicPart)
          ) {

            Logger.logError({
              errorType: "ECMA_ScriptLogicProcessingError",
              title: "ECMAScript logic processing error",
              description: "Unable to production build.",
              occurrenceLocation: "ECMA_ScriptLogicProcessor.provideLogicProcessing(projectBuildingMasterConfigRepresentative)"
            });

            callback(new Error(finalErrorMessageDynamicPart));

          } else {

            addMultiplePairsToMap(
              ECMA_ScriptLogicProcessingSharedState.sourceFilesAbsolutePathsAndOutputFilesActualPathsMap,
              ECMA_ScriptLogicEntryPointsSourceFilesAbsolutePathsAndOutputFilesActualPathsMapGenerator.generate(
                dataHoldingSelfInstance.ECMA_ScriptLogicProcessingConfigRepresentative
              )
            );

            callback();

          }

        });

      } catch (error: unknown) {

        /* [ Theory ] Once reached here, the Gulp tasks chain will collapse whatever will callback called to no. */
        Logger.logError({
          errorType: UnexpectedEventError.NAME,
          title: UnexpectedEventError.localization.defaultTitle,
          description: "依存性の'Webpack'の実行中エラーが発生した。'webpack'関数の呼び出しを'try/catch'に包めなければいけない事に就いて説明書" +
            "(https://webpack.js.org/api/node/)に書いてはないが、今は'catch'に当たった状態だ。'Gulp'課題鎖が崩れない様に、エラーを再投擲無しで捕まえた。",
          occurrenceLocation: "ECMA_ScriptLogicProcessor.provideLogicProcessing(projectBuildingMasterConfigRepresentative)",
          caughtError: error
        });

      }

    };
  }


  public constructor(
    ecmaScriptLogicProcessingConfigRepresentative: ECMA_ScriptLogicProcessingSettingsRepresentative,
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ) {
    this.ECMA_ScriptLogicProcessingConfigRepresentative = ecmaScriptLogicProcessingConfigRepresentative;
    this.masterConfigRepresentative = masterConfigRepresentative;
  }

}
