/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";

/* ─── Shared State ───────────────────────────────────────────────────────────────────────────────────────────────── */
import PlainCopyingSharedState from "@ProjectBuilding/PlainCopying/PlainCopyingSharedState";

/* ─── Applied Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import Gulp from "gulp";
import GulpStreamModifier from "@Utils/GulpStreamModifier";
import createImmediatelyEndingEmptyStream from "@Utils/createImmediatelyEndingEmptyStream";
import type VinylFile from "vinyl";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import { isUndefined, replaceDoubleBackslashesWithForwardSlashes } from "@yamato-daiwa/es-extensions";
import Path from "path";


export default abstract class PlainCopier {

  public static providePlainCopierIfMust(
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): () => NodeJS.ReadWriteStream {

    if (
      isUndefined(masterConfigRepresentative.plainCopyingSettingsRepresentative) ||
      Object.entries(masterConfigRepresentative.plainCopyingSettingsRepresentative.filesGroups).length === 0
    ) {
      return createImmediatelyEndingEmptyStream();
    }


    const targetSourceFilesAbsolutePaths: Array<string> = Array.from(
      PlainCopyingSharedState.sourceFilesAbsolutePathsAndRespectiveFilesGroupSettingsCorrespondenceMap.keys()
    );

    if (targetSourceFilesAbsolutePaths.length === 0) {
      return createImmediatelyEndingEmptyStream();
    }


    return (): NodeJS.ReadWriteStream =>

        Gulp.src(targetSourceFilesAbsolutePaths).

            pipe(
              GulpStreamModifier.modify({
                async onStreamStartedEventCommonHandler(vinylFile: VinylFile): Promise<GulpStreamModifier.CompletionSignals> {

                  const outputAbsolutePathForTargetFile: string | undefined = PlainCopyingSharedState.
                      sourceFilesAbsolutePathsAndRespectiveFilesGroupSettingsCorrespondenceMap.
                      get(replaceDoubleBackslashesWithForwardSlashes(vinylFile.path));

                  if (isUndefined(outputAbsolutePathForTargetFile)) {
                    return Promise.resolve(GulpStreamModifier.CompletionSignals.REMOVING_FILE_FROM_STREAM);
                  }


                  vinylFile.path = outputAbsolutePathForTargetFile;
                  vinylFile.base = Path.dirname(outputAbsolutePathForTargetFile);

                  return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);

                }
              })
            ).

            pipe(
              Gulp.dest((vinylFile: VinylFile): string => vinylFile.base)
            );

  }

}
