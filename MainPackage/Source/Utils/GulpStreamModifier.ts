/* --- Applied utils ------------------------------------------------------------------------------------------------ */
import Stream from "stream";
import type { TransformCallback } from "stream";
import VinylFile from "vinyl";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import {
  Logger,
  UnexpectedEventError,
  PoliteErrorsMessagesBuilder,
  isUndefined
} from "@yamato-daiwa/es-extensions";


abstract class GulpStreamModifier {

  public static modify(namedParameters: GulpStreamModifier.NamedParameters): Stream.Transform {

    return new Stream.Transform({

      objectMode: true,

      /* eslint-disable-next-line max-params -- The limitation of "Stream" native library */
      transform(this: Stream.Transform, chunk: unknown, _encoding: BufferEncoding, callback: TransformCallback): void {

        if (!VinylFile.isVinyl(chunk)) {
          Logger.throwErrorAndLog({
            errorInstance: new UnexpectedEventError(
              PoliteErrorsMessagesBuilder.buildMessage({
                technicalDetails: "The \"chunk\" parameter is not an instance of Vinyl file",
                politeExplanation: "According official TypeScript types definitions, the second parameter of native " +
                    "\"stream.TransformOptions.transform\" method has \"any\" type. Using it with Gulp, we are expected " +
                    "that \"chunk\" could be only Vinyl file instances and during tests is was such as. However, this " +
                    "time, it is not the instance of Vinyl file. We need to investigate it and decide what to do with it."
              })
            ),
            title: UnexpectedEventError.localization.defaultTitle,
            occurrenceLocation: "GulpStreamModifier.modify(namedParameters)",
            additionalData: { chunk }
          });
        }


        const addNewFilesToStream: GulpStreamModifier.NewFilesAdder =
            (newFiles: VinylFile | ReadonlyArray<VinylFile>): void => {

              for (const newFile of Array.isArray(newFiles) ? newFiles : [ newFiles ]) {
                this.push(newFile);
              }

            };

        const targetFile: VinylFile = chunk;
        let hasSpecificHandlerForCurrentVinylFileInheritor: boolean = false;

        for (
          const [ ClassExtendedFromVinylFile, handler ] of
          namedParameters.onStreamStartedEventHandlersForSpecificFileTypes ??
          new Map<
            new () => VinylFile,
            (file: VinylFile, addNewFileToStream: GulpStreamModifier.NewFilesAdder) =>
                Promise<GulpStreamModifier.CompletionSignals>
          >()
        ) {

          if (targetFile instanceof ClassExtendedFromVinylFile) {

            hasSpecificHandlerForCurrentVinylFileInheritor = true;

            handler(targetFile, addNewFilesToStream).

                then((completionSignal: GulpStreamModifier.CompletionSignals): void => {

                  switch (completionSignal) {

                    case GulpStreamModifier.CompletionSignals.PASSING_ON: {
                      callback(null, targetFile);
                      break;
                    }

                    case GulpStreamModifier.CompletionSignals.REMOVING_FILE_FROM_STREAM: {
                      callback();
                      break;
                    }

                  }

                }).

                catch((error: Error): void => { callback(error); });
          }

        }

        if (!hasSpecificHandlerForCurrentVinylFileInheritor) {

          if (isUndefined(namedParameters.onStreamStartedEventCommonHandler)) {
            callback(null, targetFile);
            return;
          }


          namedParameters.onStreamStartedEventCommonHandler(targetFile, addNewFilesToStream).

              then((completionSignal: GulpStreamModifier.CompletionSignals): void => {

                switch (completionSignal) {

                  case GulpStreamModifier.CompletionSignals.PASSING_ON: {
                    callback(null, targetFile);
                    break;
                  }

                  case GulpStreamModifier.CompletionSignals.REMOVING_FILE_FROM_STREAM: {
                    callback();
                    break;
                  }

                }

              }).

              catch((error: Error): void => { callback(error); });
        }
      },

      flush(this: Stream.Transform, callback: TransformCallback): void {

        if (isUndefined(namedParameters.onStreamEndedEventHandler)) {
          callback();
          return;
        }


        const addNewFilesToStream: GulpStreamModifier.NewFilesAdder =
            (newFiles: VinylFile | ReadonlyArray<VinylFile>): void => {

              for (const newFile of Array.isArray(newFiles) ? newFiles : [ newFiles ]) {
                this.push(newFile);
              }

            };

        namedParameters.
            onStreamEndedEventHandler(addNewFilesToStream).
            then((): void => { callback(); }).
            catch((error: Error): void => { callback(error); });

      }
    });

  }

}


namespace GulpStreamModifier {

  export type NamedParameters<FileTypes extends VinylFile = VinylFile> = {
    onStreamStartedEventCommonHandler?: (file: VinylFile, addNewFileToStream: NewFilesAdder) => Promise<CompletionSignals>;
    onStreamStartedEventHandlersForSpecificFileTypes?: Map<
      new () => FileTypes, (file: FileTypes, addNewFileToStream: NewFilesAdder) => Promise<CompletionSignals>
    >;
    onStreamEndedEventHandler?: (addNewFileToStream: NewFilesAdder) => Promise<void>;
  };

  export enum CompletionSignals {
    PASSING_ON = "PASSING_ON",
    REMOVING_FILE_FROM_STREAM = "REMOVING_FILE_FROM_STREAM"
  }

  export type NewFilesAdder = (newFiles: VinylFile | ReadonlyArray<VinylFile>) => void;

}


export default GulpStreamModifier;
