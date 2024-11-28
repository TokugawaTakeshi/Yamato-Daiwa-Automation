/* ─── Normalized settings ───────────────────────────────────────────────────────────────────────────────────────── */
import type MarkupProcessingSettings__Normalized from "@MarkupProcessing/MarkupProcessingSettings__Normalized";

/* ─── Settings representatives ──────────────────────────────────────────────────────────────────────────────────── */
import MarkupProcessingSettingsRepresentative from "@MarkupProcessing/MarkupProcessingSettingsRepresentative";

/* ─── Vinyl FS ──────────────────────────────────────────────────────────────────────────────────────────────────── */
import VinylFile from "vinyl";
import VinylFileClass from "@Utils/VinylFileClass";

/* ─── Utils ─────────────────────────────────────────────────────────────────────────────────────────────────────── */
import type { ArbitraryObject } from "@yamato-daiwa/es-extensions";
import { isUndefined, isNotUndefined } from "@yamato-daiwa/es-extensions";
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


class MarkupEntryPointVinylFile extends VinylFileClass {

  public readonly sourceAbsolutePath: string;
  public readonly outputDirectoryAbsolutePath: string;
  public readonly actualEntryPointsGroupSettings: MarkupProcessingSettings__Normalized.EntryPointsGroup;

  public readonly pageStateDependentVariationData?: MarkupEntryPointVinylFile.PageStateDependentVariationData;

  private readonly pageStateDependentVariationsSpecification?: MarkupProcessingSettings__Normalized.StaticPreview.
      PagesVariations.StateDependent.Page;


  public constructor(
    {
      initialPlainVinylFile,
      actualEntryPointsGroupSettings,
      pageStateDependentVariationsSpecification,
      pageStateDependentVariationData
    }: MarkupEntryPointVinylFile.ConstructorParameter
  ) {

    super({
      explicitlySpecifiedPathPart: initialPlainVinylFile.base,
      path: initialPlainVinylFile.path,
      contents: Buffer.isBuffer(initialPlainVinylFile.contents) ? initialPlainVinylFile.contents : Buffer.from("")
    });

    this.sourceAbsolutePath = ImprovedPath.replacePathSeparatorsToForwardSlashes(initialPlainVinylFile.path);
    this.actualEntryPointsGroupSettings = actualEntryPointsGroupSettings;

    this.outputDirectoryAbsolutePath = MarkupProcessingSettingsRepresentative.
        computeRelevantOutputDirectoryAbsolutePathForTargetSourceFile(
          this.sourceAbsolutePath, this.actualEntryPointsGroupSettings
        );


    if (isNotUndefined(pageStateDependentVariationsSpecification)) {

      this.pageStateDependentVariationsSpecification = pageStateDependentVariationsSpecification;
      this.pageStateDependentVariationData = { [pageStateDependentVariationsSpecification.stateVariableName]: {} };

    } else if (isNotUndefined(pageStateDependentVariationData)) {
      this.pageStateDependentVariationData = pageStateDependentVariationData;
    }

  }


  public forkStaticPreviewStateDependentVariationsIfAny(): Array<MarkupEntryPointVinylFile> {

    if (isUndefined(this.pageStateDependentVariationsSpecification)) {
      return [];
    }


    const pageStateDependentVariations: Array<MarkupEntryPointVinylFile> = [];

    for (
      const [ derivedFileAbsolutePath, state ] of
          this.pageStateDependentVariationsSpecification.derivedPagesAndStatesMap.entries()
    ) {

      pageStateDependentVariations.push(new MarkupEntryPointVinylFile({
        initialPlainVinylFile: new VinylFile({
          base: this.base,
          path: derivedFileAbsolutePath,
          contents: this.contents
        }),
        actualEntryPointsGroupSettings: this.actualEntryPointsGroupSettings,
        pageStateDependentVariationData: { [this.pageStateDependentVariationsSpecification.stateVariableName]: state }
      }));

    }

    return pageStateDependentVariations;

  }

}


namespace MarkupEntryPointVinylFile {

  export type ConstructorParameter = Readonly<{
    initialPlainVinylFile: VinylFile;
    actualEntryPointsGroupSettings: MarkupProcessingSettings__Normalized.EntryPointsGroup;
    pageStateDependentVariationsSpecification?: MarkupProcessingSettings__Normalized.StaticPreview.
        PagesVariations.StateDependent.Page;
    pageStateDependentVariationData?: PageStateDependentVariationData;
  }>;

  export type PageStateDependentVariationData = Readonly<{ [stateVariableName: string]: ArbitraryObject; }>;

}


export default MarkupEntryPointVinylFile;
