import type Stream from "stream";
import type VinylFile from "vinyl";
import GulpStreamModifier from "@Utils/GulpStreamModifier";


/**
 * @example
 * Gulp.
 *     src( ... ).
 *     // ...
 *     pipe(
 *       addLogToGulpPipeline(
 *         (file): void => {
 *           Logger.logGeneric({
 *             title: "After prettifying",
 *             description: file.contents?.toString() ?? ""
 *           });
 *         },
 *         file => file.path.includes("HelloWorldTutorialPage")
 *       )
 *     ).
 *     // ...
 *     pipe(Gulp.dest( ... );
 */
export default function addLogToGulpPipeline(
  loggingFunction: (file: VinylFile) => void,
  condition?: (file: VinylFile) => boolean
): Stream.Transform {

  return GulpStreamModifier.modify({
    async onStreamStartedEventCommonHandler(file: VinylFile): Promise<GulpStreamModifier.CompletionSignals> {

      if (condition?.(file) === false) {
        return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);
      }


      loggingFunction(file);

      return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);

    }
  });

}
