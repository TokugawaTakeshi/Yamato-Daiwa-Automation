/* ─── Normalized Settings ───────────────────────────────────────────────────────────────────────────────────────── */
import type MarkupProcessingSettings__Normalized from "@MarkupProcessing/MarkupProcessingSettings__Normalized";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import MarkupProcessingSettingsRepresentative from "@MarkupProcessing/MarkupProcessingSettingsRepresentative";

/* ─── State Management ───────────────────────────────────────────────────────────────────────────────────────────── */
import MarkupProcessingSharedState from "@MarkupProcessing/MarkupProcessingSharedState";

/* ─── Worktypes ──────────────────────────────────────────────────────────────────────────────────────────────────── */
import type PagesVariationsMetadata from "@MarkupProcessing/Worktypes/PagesVariationsMetadata";

/* ─── Vinyl FS ──────────────────────────────────────────────────────────────────────────────────────────────────── */
import VinylFile from "vinyl";
import VinylFileClass from "@Utils/VinylFileClass";

/* ─── Utils ─────────────────────────────────────────────────────────────────────────────────────────────────────── */
import {
  type ArbitraryObject,
  getExpectedToBeNonUndefinedMapValue,
  isNotUndefined
} from "@yamato-daiwa/es-extensions";
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


class MarkupEntryPointVinylFile extends VinylFileClass {

  public readonly sourceAbsolutePath: string;
  public readonly outputDirectoryAbsolutePath: string;
  public readonly actualEntryPointsGroupSettings: MarkupProcessingSettings__Normalized.EntryPointsGroup;

  public readonly pageStateDependentVariationData?: MarkupEntryPointVinylFile.PageStateDependentVariationData;
  public readonly localizationData?: Readonly<{ [variableName: string]: unknown; }>;

  private readonly markupProcessingSettingsRepresentative: MarkupProcessingSettingsRepresentative;

  private readonly pageStateDependentVariationsSpecification?:
      MarkupProcessingSettings__Normalized.StaticPreview.PagesVariations.StateDependent.Page;


  public constructor(
    {
      initialPlainVinylFile,
      markupProcessingSettingsRepresentative,
      pageStateDependentVariationData,
      localizationData
    }: MarkupEntryPointVinylFile.ConstructorParameter
  ) {

    super({
      explicitlySpecifiedPathPart: initialPlainVinylFile.base,
      path: initialPlainVinylFile.path,
      contents: Buffer.isBuffer(initialPlainVinylFile.contents) ? initialPlainVinylFile.contents : Buffer.from("")
    });

    this.sourceAbsolutePath = ImprovedPath.replacePathSeparatorsToForwardSlashes(initialPlainVinylFile.path);

    this.markupProcessingSettingsRepresentative = markupProcessingSettingsRepresentative;

    this.actualEntryPointsGroupSettings = this.markupProcessingSettingsRepresentative.
        getExpectedToExistEntryPointsGroupSettingsRelevantForSpecifiedSourceFileAbsolutePath(initialPlainVinylFile.path);

    this.outputDirectoryAbsolutePath = MarkupProcessingSettingsRepresentative.
        computeRelevantOutputDirectoryAbsolutePathForTargetSourceFile(
          this.sourceAbsolutePath, this.actualEntryPointsGroupSettings
        );

    this.pageStateDependentVariationsSpecification = this.markupProcessingSettingsRepresentative.
        getStateDependentVariationsForEntryPointWithAbsolutePath(initialPlainVinylFile.path);

    if (isNotUndefined(this.pageStateDependentVariationsSpecification)) {
      this.pageStateDependentVariationData = { [this.pageStateDependentVariationsSpecification.stateVariableName]: {} };
    } else if (isNotUndefined(pageStateDependentVariationData)) {
      this.pageStateDependentVariationData = pageStateDependentVariationData;
    }

    if (isNotUndefined(localizationData)) {
      this.localizationData = localizationData;
    }

  }


  public manageVariations(): MarkupEntryPointVinylFile.VariationsManagement {

    const actualPageVariationsMetadata: PagesVariationsMetadata.Page = getExpectedToBeNonUndefinedMapValue(
      MarkupProcessingSharedState.pagesVariationsMetadata, this.sourceAbsolutePath
    );

    if (
      actualPageVariationsMetadata.mustInitialFileBeKept &&
      actualPageVariationsMetadata.absoluteSourcePathsOfAllVariations.size === 1 &&
      actualPageVariationsMetadata.absoluteSourcePathsOfAllVariations.has(this.sourceAbsolutePath)
    ) {
      return {
        newFiles: [],
        mustInitialFileBeDeleted: false
      };
    }


    const pageVariations: Array<MarkupEntryPointVinylFile> = [];

    for (
      const [ variationFileAbsolutePath__forwardSlashesPathSeparators, dataForPug ] of
          actualPageVariationsMetadata.dataForPugBySourceFilesAbsolutePaths.entries()
    ) {

      if (this.sourceAbsolutePath === variationFileAbsolutePath__forwardSlashesPathSeparators) {
        continue;
      }


      pageVariations.push(
        new MarkupEntryPointVinylFile({
          initialPlainVinylFile: new VinylFile({
            base: this.base,
            path: variationFileAbsolutePath__forwardSlashesPathSeparators,
            contents: this.contents
          }),
          markupProcessingSettingsRepresentative: this.markupProcessingSettingsRepresentative,
          pageStateDependentVariationData: {
            ...dataForPug.localizationData ?? null,
            ...dataForPug.pageStateDependentVariationData ?? null
          }
        })
      );

    }

    return {
      newFiles: pageVariations,
      mustInitialFileBeDeleted: !actualPageVariationsMetadata.mustInitialFileBeKept
    };

  }

}


namespace MarkupEntryPointVinylFile {

  export type ConstructorParameter = Readonly<{
    initialPlainVinylFile: VinylFile;
    markupProcessingSettingsRepresentative: MarkupProcessingSettingsRepresentative;
    pageStateDependentVariationsSpecification?: MarkupProcessingSettings__Normalized.StaticPreview.
        PagesVariations.StateDependent.Page;
    pageStateDependentVariationData?: PageStateDependentVariationData;
    localizationData?: Readonly<{ [variableName: string]: unknown; }>;
  }>;

  export type PageStateDependentVariationData = Readonly<{ [stateVariableName: string]: ArbitraryObject; }>;

  export type VariationsManagement = Readonly<{
    newFiles: Array<MarkupEntryPointVinylFile>;
    mustInitialFileBeDeleted: boolean;
  }>;

}


export default MarkupEntryPointVinylFile;
