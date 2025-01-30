/* ─── Work Types ─────────────────────────────────────────────────────────────────────────────────────────────────── */
import type PagesVariationsMetadata from "@MarkupProcessing/Worktypes/PagesVariationsMetadata";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { addEntriesToMap, type ArbitraryObject } from "@yamato-daiwa/es-extensions";


export default abstract class MarkupProcessingSharedState {

  public static importsFromTypeScript: ArbitraryObject | null;
  public static importsFromJavaScript: ArbitraryObject | null;

  public static pagesVariationsMetadata: PagesVariationsMetadata = new Map();

  public static get entryPointsSourceAndOutputFilesAbsolutePathsCorrespondenceMap(): ReadonlyMap<string, string> {
      return Array.from(MarkupProcessingSharedState.pagesVariationsMetadata.values()).
        reduce(
          (
            interimConcatenatedMap: Map<string, string>,
            { sourceAndOutputAbsolutePathsOfAllVariations }: PagesVariationsMetadata.Page
          ): Map<string, string> =>
              addEntriesToMap({
                targetMap: interimConcatenatedMap,
                mutably: true,
                newEntries: sourceAndOutputAbsolutePathsOfAllVariations
              }),
          new Map<string, string>()
        );
  }

}
