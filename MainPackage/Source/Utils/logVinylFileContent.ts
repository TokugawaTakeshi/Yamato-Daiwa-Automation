import type Stream from "stream";
import type VinylFile from "vinyl";
import GulpStreamModifier from "@Utils/GulpStreamModifier";
import { Logger } from "@yamato-daiwa/es-extensions";


export default function logVinylFileContent(condition?: (file: VinylFile) => boolean): Stream.Transform {

  return GulpStreamModifier.modify({
    async onStreamStartedEventCommonHandler(file: VinylFile): Promise<GulpStreamModifier.CompletionSignals> {

      if (condition?.(file) === false) {
        return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);
      }


      if (file.contents instanceof Buffer) {
        Logger.logInfo({
          title: "Logging of Vinyl file content",
          description: `The content of "${ file.path }" file:\n ${ file.contents.toString() }`
        });
      }

      return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);

    }
  });

}
