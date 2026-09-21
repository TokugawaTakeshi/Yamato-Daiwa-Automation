/* ─── Work Types ─────────────────────────────────────────────────────────────────────────────────────────────────── */
import type PagesVariationsMetadata from "@MarkupProcessing/Worktypes/PagesVariationsMetadata";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { addEntriesToMap, type ArbitraryObject } from "@yamato-daiwa/es-extensions";


export default abstract class MarkupProcessingSharedState {

  public static importsFromTypeScript: ArbitraryObject | null;
  public static importsFromJavaScript: ArbitraryObject | null;

  public static pagesVariationsMetadata: PagesVariationsMetadata = new Map();


  /**
   * @description
   * For the state-dependent variations of static preview and/or static localizations cases, the output files number is
   *   greater than the number of source ones. To resolve internal links like
   *   `@Pages/Task/Management/TasksManagementPage__Loading.english` to file
   *   `[PagesDirectory]/Task/Management/TasksManagementPage.pug`, the path to the fictive
   *   `[PagesDirectory]/Task/Management/TasksManagementPageLoading.english.pug` file must be stored.
   */
  public static get entryPointsSourceAndOutputFilesAbsolutePathsCorrespondenceMap__includingFictiveOnes():
      ReadonlyMap<string, string>
  {
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

  public static get outputHTML_FilesAndSourcePugFilesAbsolutePathsCorrespondenceMap(): ReadonlyMap<string, string> {
    return Array.from(MarkupProcessingSharedState.pagesVariationsMetadata.values()).
      reduce(
        (
          interimConcatenatedMap: Map<string, string>,
          { initialSourceFileAbsolutePath, sourceAndOutputAbsolutePathsOfAllVariations }: PagesVariationsMetadata.Page
        ): Map<string, string> =>
            addEntriesToMap({
              targetMap: interimConcatenatedMap,
              mutably: true,
              newEntries: Array.from(sourceAndOutputAbsolutePathsOfAllVariations.values()).
                  map(
                    (outputHTML_FieldAbsolutePath: string): [ string, string ] =>
                        [ outputHTML_FieldAbsolutePath, initialSourceFileAbsolutePath ]
                  )
            }),
        new Map<string, string>()
      );
  }

}
