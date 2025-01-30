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

  public static modifyForSingleVinylFileSubtype<TargetFileType extends VinylFile = VinylFile>(
    {
      onStreamStartedEventHandler,
      onStreamEndedEventHandler
    }: GulpStreamModifier.ConstructorParameter1FileTypes<TargetFileType>
  ): Stream.Transform {

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
            occurrenceLocation: "GulpStreamModifier.modifyForSingleVinylFileSubtype(compoundParameter)",
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

        onStreamStartedEventHandler(targetFile, addNewFilesToStream).

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

            /* eslint-disable-next-line @typescript-eslint/use-unknown-in-catch-callback-variable --
            * `TransformCallback` does not accept the error of `unknown` type. */
            catch((error: Error): void => { callback(error); });

      },

      flush(this: Stream.Transform, callback: TransformCallback): void {

        if (isUndefined(onStreamEndedEventHandler)) {
          callback();
          return;
        }


        const addNewFilesToStream: GulpStreamModifier.NewFilesAdder =
            (newFiles: VinylFile | ReadonlyArray<VinylFile>): void => {

              for (const newFile of Array.isArray(newFiles) ? newFiles : [ newFiles ]) {
                this.push(newFile);
              }

            };

        onStreamEndedEventHandler(addNewFilesToStream).
            then((): void => { callback(); }).
            /* eslint-disable-next-line @typescript-eslint/use-unknown-in-catch-callback-variable --
             * `TransformCallback` does not accept the error of `unknown` type. */
            catch((error: Error): void => { callback(error); });

      }
    });

  }

  public static modify(compoundParameter: GulpStreamModifier.ConstructorParameter): Stream.Transform {

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
            occurrenceLocation: "GulpStreamModifier.modify(compoundParameter)",
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
          compoundParameter.onStreamStartedEventHandlersForSpecificFileTypes ??
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

                /* eslint-disable-next-line @typescript-eslint/use-unknown-in-catch-callback-variable --
                * `TransformCallback` does not accept the error of `unknown` type. */
                catch((error: Error): void => { callback(error); });
          }

        }

        if (!hasSpecificHandlerForCurrentVinylFileInheritor) {

          if (isUndefined(compoundParameter.onStreamStartedEventCommonHandler)) {
            callback(null, targetFile);
            return;
          }


          compoundParameter.onStreamStartedEventCommonHandler(targetFile, addNewFilesToStream).

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

              /* eslint-disable-next-line @typescript-eslint/use-unknown-in-catch-callback-variable --
               * `TransformCallback` does not accept the error of `unknown` type. */
              catch((error: Error): void => { callback(error); });
        }
      },

      flush(this: Stream.Transform, callback: TransformCallback): void {

        if (isUndefined(compoundParameter.onStreamEndedEventHandler)) {
          callback();
          return;
        }


        const addNewFilesToStream: GulpStreamModifier.NewFilesAdder =
            (newFiles: VinylFile | ReadonlyArray<VinylFile>): void => {

              for (const newFile of Array.isArray(newFiles) ? newFiles : [ newFiles ]) {
                this.push(newFile);
              }

            };

        compoundParameter.
            onStreamEndedEventHandler(addNewFilesToStream).
            then((): void => { callback(); }).
            /* eslint-disable-next-line @typescript-eslint/use-unknown-in-catch-callback-variable --
             * `TransformCallback` does not accept the error of `unknown` type. */
            catch((error: Error): void => { callback(error); });

      }
    });

  }

}


namespace GulpStreamModifier {

  export type ConstructorParameter1FileTypes<TargetFileType extends VinylFile = VinylFile> = Readonly<{
    onStreamStartedEventHandler: (file: TargetFileType, addNewFileToStream: NewFilesAdder) => Promise<CompletionSignals>;
    onStreamEndedEventHandler?: (addNewFileToStream: NewFilesAdder) => Promise<void>;
  }>;

  export type ConstructorParameter<FileTypes extends VinylFile = VinylFile> = {
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
