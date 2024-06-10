import type Stream from "stream";
import type VinylFile from "vinyl";
import GulpStreamModifier from "@Utils/GulpStreamModifier";


export default function addLogToGulpPipeline(
  loggingFunction: () => void,
  condition?: (file: VinylFile) => boolean
): Stream.Transform {

  return GulpStreamModifier.modify({
    async onStreamStartedEventCommonHandler(file: VinylFile): Promise<GulpStreamModifier.CompletionSignals> {

      if (condition?.(file) === false) {
        return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);
      }


      loggingFunction();

      return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);

    }
  });

}
