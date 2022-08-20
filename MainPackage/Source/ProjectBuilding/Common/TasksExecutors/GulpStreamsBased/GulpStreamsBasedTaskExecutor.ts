/* --- Config representative ---------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";

/* --- Applied utils ------------------------------------------------------------------------------------------------ */
import type VinylFile from "vinyl";
import printProcessedFilesPathsAndQuantity from "gulp-debug";
import preventGulpPipelineBreaking from "gulp-plumber";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import { insertSubstring, Logger } from "@yamato-daiwa/es-extensions";
import NodeNotifier from "node-notifier";


abstract class GulpStreamsBasedTaskExecutor {

  protected abstract readonly TASK_NAME_FOR_LOGGING: string;

  protected readonly masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;


  protected constructor(masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative) {
    this.masterConfigRepresentative = masterConfigRepresentative;
  }


  protected printProcessedFilesPathsAndQuantity(
    namedParameters: Readonly<{ subtaskName?: string; }> = {}
  ): NodeJS.ReadWriteStream {
    return printProcessedFilesPathsAndQuantity({
      title: `Task '${ this.TASK_NAME_FOR_LOGGING }` +
          `${ 
            insertSubstring(
              namedParameters.subtaskName, 
              { modifier: (subtaskName: string): string => ` / ${ subtaskName }` }
            )
          }':`
    });
  }

  protected handleErrorIfItWillOccur(
    namedParameters: Readonly<{ subtaskName?: string; }> = {}
  ): NodeJS.ReadWriteStream {
    return preventGulpPipelineBreaking({

      errorHandler: (error: Error): void => {

        const ERROR_MESSAGE_TITLE: string = `Task '${ this.TASK_NAME_FOR_LOGGING }` +
            `${
              insertSubstring(
                namedParameters.subtaskName,
                { modifier: (subtaskName: string): string => ` / ${ subtaskName }` }
              )
            }', error occurred`;

        Logger.logErrorLikeMessage({
          title: ERROR_MESSAGE_TITLE,
          description: error.message
        });

        NodeNotifier.notify({
          title: ERROR_MESSAGE_TITLE,
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
