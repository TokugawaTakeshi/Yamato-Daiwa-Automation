/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type ECMA_ScriptLogicProcessingSettingsRepresentative from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettingsRepresentative";

/* ─── Source Files Watcher ───────────────────────────────────────────────────────────────────────────────────────── */
import ECMA_ScriptSourceFilesWatcher from "@ECMA_ScriptProcessing/ECMA_ScriptSourceFilesWatcher";

/* ─── Applied Utils ─────────────────────────────────────────────────────────────────────────────────────────────── */
import { type VoidPromiseReturningFunction, voidPromiseReturningFunction } from "@Utils/VoidPromiseReturningFunction";

/* ─── Generals Utils ─────────────────────────────────────────────────────────────────────────────────────────────── */
import ChildProcess from "child_process";
import FileSystem from "fs";
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";
import {
  Logger,
  isNotNull,
  isUndefined,
  isNull,
  UnexpectedEventError,
  nullToUndefined,
  secondsToMilliseconds
} from "@yamato-daiwa/es-extensions";
import NodeNotifier from "node-notifier";


export default class TypeScriptTypesChecker {

  private static readonly WAITING_FOR_NEXT_EVENT_WITH_RELATED_FILES__SECONDS: number = 1;

  /* [ Theory ] 120 columns is about the half of the 1920x1080 screen. */
  private static readonly DISPLAYING_MAXIMAL_COLUMNS_COUNT_IN_LOG: number = 120;

  private readonly vueTSC_ExecutableFileAbsolutePath: string;
  private readonly projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
  private readonly ecmaScriptLogicProcessingSettingsRepresentative: ECMA_ScriptLogicProcessingSettingsRepresentative;

  private waitingForNextWithRelatedFiles: NodeJS.Timeout | null = null;


  public static provideCheckingIfMust(
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): VoidPromiseReturningFunction {

    const ecmaScriptLogicProcessingSettingsRepresentative: ECMA_ScriptLogicProcessingSettingsRepresentative | undefined =
      projectBuildingMasterConfigRepresentative.ECMA_ScriptLogicProcessingSettingsRepresentative;

    if (isUndefined(ecmaScriptLogicProcessingSettingsRepresentative)) {
      return voidPromiseReturningFunction;
    }


    const selfInstance: TypeScriptTypesChecker = new TypeScriptTypesChecker({
      projectBuildingMasterConfigRepresentative,
      ecmaScriptLogicProcessingSettingsRepresentative
    });

    return selfInstance.checkTypes.bind(selfInstance);

  }


  private constructor(
    {
      projectBuildingMasterConfigRepresentative,
      ecmaScriptLogicProcessingSettingsRepresentative
    }: Readonly<{
      projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
      ecmaScriptLogicProcessingSettingsRepresentative: ECMA_ScriptLogicProcessingSettingsRepresentative;
    }>
  ) {

    this.projectBuildingMasterConfigRepresentative = projectBuildingMasterConfigRepresentative;
    this.ecmaScriptLogicProcessingSettingsRepresentative = ecmaScriptLogicProcessingSettingsRepresentative;

    if (this.projectBuildingMasterConfigRepresentative.mustProvideIncrementalBuilding) {

      ECMA_ScriptSourceFilesWatcher.initializeIfRequiredAndGetInstance({
        projectBuildingMasterConfigRepresentative: this.projectBuildingMasterConfigRepresentative,
        ecmaScriptLogicProcessingSettingsRepresentative: this.ecmaScriptLogicProcessingSettingsRepresentative
      }).
          addOnAnyEventRelatedWithActualFilesHandler({
            handlerID: "ON_ANY_EVENT_RELATED_WITH_ACTUAL_FILES_HANDLER--BY_TYPE_SCRIPT_TYPES_CHECKER",
            handler: this.onAnyEventRelatedWithActualFiles.bind(this)
          });

    }

    const vueTSC_ExecutableFileAbsolutePath: string | null = TypeScriptTypesChecker.
        getAbsolutePathOfExistingVueTSC_ExecutableFile__alwaysForwardSlashesPathSeparators(
          projectBuildingMasterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath
        );

    if (isNull(vueTSC_ExecutableFileAbsolutePath)) {
      Logger.throwErrorAndLog({
        errorInstance: new UnexpectedEventError("File to \"vue-tsc\" executable not found"),
        title: UnexpectedEventError.localization.defaultTitle,
        occurrenceLocation: "TypeScriptTypesChecker.constructor(compoundParameter)"
      });
    }


    this.vueTSC_ExecutableFileAbsolutePath = vueTSC_ExecutableFileAbsolutePath;

  }


  private onAnyEventRelatedWithActualFiles(): void {

    clearTimeout(
      nullToUndefined(this.waitingForNextWithRelatedFiles)
    );


    this.waitingForNextWithRelatedFiles = setTimeout(
      (): void => {
        this.checkTypes().catch(Logger.logPromiseError);
      },
      secondsToMilliseconds(TypeScriptTypesChecker.WAITING_FOR_NEXT_EVENT_WITH_RELATED_FILES__SECONDS)
    );

  }

  private async checkTypes(): Promise<void> {
    return new Promise<void>(
      (resolve: () => void, reject: (error: ChildProcess.ExecException) => void): void => {

        ChildProcess.exec(
          `node ${ this.vueTSC_ExecutableFileAbsolutePath } --noEmit`,
          { encoding: "utf-8" },
          (error: ChildProcess.ExecException | null, stdout: string): void => {

            if (isNotNull(error)) {

              Logger.logErrorLikeMessage({
                title: "TypeScript Type Checking, Error(s) Detected",
                description:
                  "The source code is including the TypeScript error(s).\n" +
                  (
                    this.projectBuildingMasterConfigRepresentative.isProductionLikeBuildingMode ?
                      "Is is unacceptable for production-like modes thus the project building will be terminated." : "") +
                  `${ "-".repeat(TypeScriptTypesChecker.DISPLAYING_MAXIMAL_COLUMNS_COUNT_IN_LOG) }\n` +
                  stdout
              });

              NodeNotifier.notify({
                title: "TypeScript Types Checking, Errors Detected",
                message: "Please check your terminal for the details."
              });

              if (this.projectBuildingMasterConfigRepresentative.isProductionLikeBuildingMode) {
                reject(error);
                return;
              }


              resolve();

              return;

            }


            Logger.logSuccess({
              title: "TypeScript Type Checking, No Errors Found",
              description: "The source TypeScript is valid. Keep it up!"
            });

            resolve();

          }
        );

      }
    );
  }

  private static getAbsolutePathOfExistingVueTSC_ExecutableFile__alwaysForwardSlashesPathSeparators(
    consumingProjectRootDirectoryAbsolutePath: string
  ): string | null {

    for (
      const vueTSC_ExecutableFileAbsolutePath__alwaysForwardSlashesPathSeparators of [
        ImprovedPath.joinPathSegments(
          [
            consumingProjectRootDirectoryAbsolutePath,
            "node_modules",
            ".bin",
            "vue-tsc.js"
          ],
          { alwaysForwardSlashSeparators: true }
        ),
        ImprovedPath.joinPathSegments(
          [
            consumingProjectRootDirectoryAbsolutePath,
            "node_modules",
            "@yamato-daiwa",
            "automation",
            "node_modules",
            "vue-tsc",
            "bin",
            "vue-tsc.js"
          ],
          { alwaysForwardSlashSeparators: true }
        )
      ]
    ) {

      if (FileSystem.existsSync(vueTSC_ExecutableFileAbsolutePath__alwaysForwardSlashesPathSeparators)) {
        return vueTSC_ExecutableFileAbsolutePath__alwaysForwardSlashesPathSeparators;
      }

    }


    return null;

  }

}
