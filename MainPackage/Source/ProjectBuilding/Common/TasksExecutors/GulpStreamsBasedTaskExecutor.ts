/* --- Task executors ----------------------------------------------------------------------------------------------- */
import TaskExecutor from "./TaskExecutor";

/* --- Applied utils ------------------------------------------------------------------------------------------------ */
import type VinylFile from "vinyl";
import printProcessedFilesPathsAndQuantity from "gulp-debug";
import preventGulpPipelineBreaking from "gulp-plumber";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import { Logger } from "@yamato-daiwa/es-extensions";
import NodeNotifier from "node-notifier";


abstract class GulpStreamsBasedTaskExecutor extends TaskExecutor {

  protected printProcessedFilesPathsAndQuantity(): NodeJS.ReadWriteStream {
    return printProcessedFilesPathsAndQuantity({ title: `Task ${ this.TASK_NAME_FOR_LOGGING }: ` });
  }

  protected handleErrorIfItWillOccur(): NodeJS.ReadWriteStream {
    return preventGulpPipelineBreaking({

      errorHandler: (error: Error): void => {

        const ERROR_MESSAGE_TITLE: string = `${ this.TASK_NAME_FOR_LOGGING }, error occurred`;

        Logger.logErrorLikeMessage({
          title: ERROR_MESSAGE_TITLE,
          description: error.message
        });

        NodeNotifier.notify({
          title: `Task ${ this.TASK_NAME_FOR_LOGGING }, error occurred`,
          message: "Please check your terminal for the details."
        });
      }
    });
  }
}


namespace GulpStreamsBasedTaskExecutor {
  export type VinylFileWithCachedNormalizedSettings =
      VinylFile &
      {
        readonly sourceAbsolutePath: string;
        readonly outputDirectoryAbsolutePath: string;
      };
}


export default GulpStreamsBasedTaskExecutor;
