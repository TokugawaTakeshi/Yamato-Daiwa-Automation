import type { LineSeparators } from "@yamato-daiwa/es-extensions";


abstract class MarkupProcessingSharedState {

  public static entryPointsSourceAndOutputFilesAbsolutePathsCorrespondenceMap: Map<string, string> = new Map<string, string>();

  public static importingFromTypeScriptPugCodeGenerator:
      MarkupProcessingSharedState.ImportingFromTypeScriptPugCodeGenerator | null;

}


namespace MarkupProcessingSharedState {

  export type ImportingFromTypeScriptPugCodeGenerator = (
    compoundParameter: ImportingFromTypeScriptPugCodeGenerator.CompoundParameter
  ) => string;

  export namespace ImportingFromTypeScriptPugCodeGenerator {

    export type CompoundParameter = Readonly<{
      indentString: string;
      lineSeparator: LineSeparators;
      initialIndentationDepth__numerationFrom0: number;
    }>;

  }

}


export default MarkupProcessingSharedState;
