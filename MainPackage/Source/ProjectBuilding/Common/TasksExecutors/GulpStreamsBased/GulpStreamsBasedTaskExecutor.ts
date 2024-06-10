import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";

/* ─── Applied Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import type VinylFile from "vinyl";
import preventGulpPipelineBreaking from "gulp-plumber";
import GulpStreamModifier from "@Utils/GulpStreamModifier";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import type Stream from "stream";
import { Logger, nullToUndefined, secondsToMilliseconds } from "@yamato-daiwa/es-extensions";
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";
import NodeNotifier from "node-notifier";


abstract class GulpStreamsBasedTaskExecutor {

  private static readonly SUBSEQUENT_ERROR_TOAST_NOTIFICATION_PROHIBITION_PERIOD__SECONDS: number = 5;

  protected abstract readonly logging: GulpStreamsBasedTaskExecutor.Logging;

  protected readonly projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
  protected readonly TASK_TITLE_FOR_LOGGING: string;

  protected processedFilesCountDuringCurrentRun: number = 0;

  private waitingForErrorToastNotificationsWillBePermittedAgain: NodeJS.Timeout | null = null;
  private isErrorToastNotificationPermitted: boolean = true;


  protected constructor(
    {
      projectBuildingMasterConfigRepresentative,
      taskTitleForLogging
    }: GulpStreamsBasedTaskExecutor.ConstructorParameter
  ) {
    this.projectBuildingMasterConfigRepresentative = projectBuildingMasterConfigRepresentative;
    this.TASK_TITLE_FOR_LOGGING = taskTitleForLogging;
  }


  protected handleErrorIfItWillOccur(): NodeJS.ReadWriteStream {
    return preventGulpPipelineBreaking({

      errorHandler: (error: Error): void => {

        const ERROR_MESSAGE_TITLE: string = `Task "${ this.TASK_TITLE_FOR_LOGGING }", error occurred`;

        Logger.logErrorLikeMessage({
          title: ERROR_MESSAGE_TITLE,
          description: error.message
        });

        clearTimeout(nullToUndefined(this.waitingForErrorToastNotificationsWillBePermittedAgain));

        if (this.isErrorToastNotificationPermitted) {
          NodeNotifier.notify({
            title: ERROR_MESSAGE_TITLE,
            message: "Please check your terminal for the details."
          });
        }

        this.waitingForErrorToastNotificationsWillBePermittedAgain = setTimeout(
          (): void => { this.isErrorToastNotificationPermitted = true; },
          secondsToMilliseconds(GulpStreamsBasedTaskExecutor.SUBSEQUENT_ERROR_TOAST_NOTIFICATION_PROHIBITION_PERIOD__SECONDS)
        );

      }

    });
  }

  protected logProcessedFilesIfMust(): Stream.Transform {
    return GulpStreamModifier.modify({

      onStreamStartedEventCommonHandler: async (file: VinylFile): Promise<GulpStreamModifier.CompletionSignals> => {

        Logger.logGeneric({
          mustOutputIf: this.logging.pathsOfFilesWillBeProcessed,
          badge: false,
          title: `[ ${ this.TASK_TITLE_FOR_LOGGING } ]`,
          description: ImprovedPath.computeRelativePath({
            basePath: this.projectBuildingMasterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath,
            comparedPath: file.path,
            alwaysForwardSlashSeparators: true
          }),
          compactLayout: true
        });

        this.processedFilesCountDuringCurrentRun++;

        return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);

      },

      onStreamEndedEventHandler: async (): Promise<void> => {

        Logger.logGeneric({
          mustOutputIf: this.logging.quantityOfFilesWillBeProcessed,
          badge: false,
          title: this.TASK_TITLE_FOR_LOGGING,
          description: `Files will be processed: ${ this.processedFilesCountDuringCurrentRun }`,
          compactLayout: true
        });

        this.processedFilesCountDuringCurrentRun = 0;

        return Promise.resolve();

      }

    });
  }

}


namespace GulpStreamsBasedTaskExecutor {

  export type ConstructorParameter = Readonly<{
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
    taskTitleForLogging: string;
  }>;

  export type Logging = Readonly<{
    pathsOfFilesWillBeProcessed: boolean;
    quantityOfFilesWillBeProcessed: boolean;
  }>;

}


export default GulpStreamsBasedTaskExecutor;
