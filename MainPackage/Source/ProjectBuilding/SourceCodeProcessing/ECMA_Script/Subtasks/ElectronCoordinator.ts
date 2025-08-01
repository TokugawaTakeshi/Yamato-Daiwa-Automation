/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type ECMA_ScriptLogicProcessingSettingsRepresentative from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettingsRepresentative";

/* ─── Files Watchers ─────────────────────────────────────────────────────────────────────────────────────────────── */
import ElectronOutputFilesWatcher from "@ECMA_ScriptProcessing/Watchers/ElectronOutputFilesWatcher";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import ChildProcess from "child_process";
import { type VoidPromiseReturningFunction, voidPromiseReturningFunction } from "@Utils/VoidPromiseReturningFunction";
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";
import {
  Logger,
  secondsToMilliseconds,
  isUndefined,
  nullToUndefined
} from "@yamato-daiwa/es-extensions";


export default class ElectronCoordinator {

  private readonly projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
  private readonly electronExecutableFileAbsolutePath: string;

  private activeElectronChildProcess: ChildProcess.ChildProcess | null = null;
  private waitingForNextEventWithRelatedFiles: NodeJS.Timeout | null = null;


  public static coordinateIfMust(
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): VoidPromiseReturningFunction {

    const ecmaScriptLogicProcessingSettingsRepresentative: ECMA_ScriptLogicProcessingSettingsRepresentative | undefined =
      projectBuildingMasterConfigRepresentative.ECMA_ScriptLogicProcessingSettingsRepresentative;

    if (isUndefined(ecmaScriptLogicProcessingSettingsRepresentative?.electronSettings)) {
      return voidPromiseReturningFunction;
    }


    const selfInstance: ElectronCoordinator = new ElectronCoordinator({ projectBuildingMasterConfigRepresentative });

    ElectronOutputFilesWatcher.initialize({
      electronSettings: ecmaScriptLogicProcessingSettingsRepresentative.electronSettings,
      loggingSettings: ecmaScriptLogicProcessingSettingsRepresentative.loggingSettings,
      onAnyEventRelatedWithActualFilesHandler: selfInstance.onAnyEventRelatedWithRelatedFiles.bind(selfInstance)
    });

    return selfInstance.createPromisfiedChildProcess.bind(selfInstance);

  }


  private constructor(
    {
      projectBuildingMasterConfigRepresentative
    }: Readonly<{
      projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
    }>
  ) {

    this.projectBuildingMasterConfigRepresentative = projectBuildingMasterConfigRepresentative;

    this.electronExecutableFileAbsolutePath = ImprovedPath.joinPathSegments(
      [
        this.projectBuildingMasterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath,
        "node_modules",
        "electron",
        "cli.js"
      ],
      { alwaysForwardSlashSeparators: true }
    );

  }


  private async createPromisfiedChildProcess(): Promise<void> {
    return new Promise<void>(
      (resolve: () => void): void => {
        this.activeElectronChildProcess = this.createElectronChildProcess(resolve);
      }
    );
  }

  private createElectronChildProcess(onStartedEventHandler?: () => void): ChildProcess.ChildProcess {


    /* [ Theory ]
     * The process killing will not work on Windows with the `exec` method.
     * https://github.com/nodejs/node/issues/7281 */
    const childProcess: ChildProcess.ChildProcess = ChildProcess.
        execFile(
          "node",
          [ this.electronExecutableFileAbsolutePath, "." ],
          { encoding: "utf-8" }
        ).
        on(
          "spawn",
          (): void => {
            onStartedEventHandler?.();
          }
        );

    childProcess.stdout?.on(
      "data",
      (data: string): void => {

        /* eslint-disable-next-line no-console -- The data should be output as is, preserving the formatting if any. */
        console.log(data);

      }
    );

    childProcess.stderr?.on(
      "data",
      (data: string): void => {

        /* eslint-disable-next-line no-console -- The data should be output as is, preserving the formatting if any. */
        console.error(data);

      }
    );

    return childProcess;

  }

  private onAnyEventRelatedWithRelatedFiles(): void {

    clearTimeout(
      nullToUndefined(this.waitingForNextEventWithRelatedFiles)
    );


    Logger.logInfo({
      title: "ElectronCoordinator, Restarting Application",
      description: "The changes has been detected on or more output files. Restarting the application..."
    });

    this.waitingForNextEventWithRelatedFiles = setTimeout(
      (): void => {

        const outdatedChildProcess: ChildProcess.ChildProcess | null = this.activeElectronChildProcess;

        this.activeElectronChildProcess = this.createElectronChildProcess(
          (): void => {

            /* [ Theory ]
             * The process killing will not work on Windows if the child process has started with the `exec` method.
             * https://github.com/nodejs/node/issues/7281 */
            outdatedChildProcess?.kill("SIGKILL");
          }
        );

      },
      secondsToMilliseconds(1)
    );

  }

}
