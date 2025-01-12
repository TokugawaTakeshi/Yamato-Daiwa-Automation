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

  private readonly markupProcessingSettingsRepresentative: MarkupProcessingSettingsRepresentative;

  private readonly pageStateDependentVariationsSpecification?:
      MarkupProcessingSettings__Normalized.StaticPreview.PagesVariations.StateDependent.Page;


  public constructor(
    {
      initialPlainVinylFile,
      markupProcessingSettingsRepresentative,
      pageStateDependentVariationData
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

  }


  public forkVariationsForStaticPreviewIfAnyAndStaticPreviewBuildingMode(): Array<MarkupEntryPointVinylFile> {

    const pageVariations: Array<MarkupEntryPointVinylFile> = [];

    const localeDependentPagesVariationsSettings:
        MarkupProcessingSettings__Normalized.StaticPreview.PagesVariations.LocaleDependent | undefined =
            this.markupProcessingSettingsRepresentative.localeDependentPagesVariationsSettings;

    const localesData:
        MarkupProcessingSettings__Normalized.StaticPreview.PagesVariations.LocaleDependent.LocalesData =
            localeDependentPagesVariationsSettings?.locales ?? new Map();

    const areLocaleDependentVariationsRequiredForCurrentFile: boolean =
        localesData.size > 0 &&
        localeDependentPagesVariationsSettings?.excludedFilesAbsolutePaths.includes(this.sourceAbsolutePath) === false;

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

    return pageVariations;

  }

}


namespace MarkupEntryPointVinylFile {

  export type ConstructorParameter = Readonly<{
    initialPlainVinylFile: VinylFile;
    markupProcessingSettingsRepresentative: MarkupProcessingSettingsRepresentative;
    pageStateDependentVariationsSpecification?: MarkupProcessingSettings__Normalized.StaticPreview.
        PagesVariations.StateDependent.Page;
    pageStateDependentVariationData?: PageStateDependentVariationData;
  }>;

  export type PageStateDependentVariationData = Readonly<{ [stateVariableName: string]: ArbitraryObject; }>;

}


export default MarkupEntryPointVinylFile;
