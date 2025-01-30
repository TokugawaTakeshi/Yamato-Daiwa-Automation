/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import MarkupProcessingRestrictions from "@MarkupProcessing/MarkupProcessingRestrictions";
import PROCESSABLE_FILES_POINTER_ALIAS_PREFIX from
    "@ProjectBuilding/Common/Restrictions/ResourcesReferences/PROCESSABLE_FILES_POINTER_ALIAS_PREFIX";
import PLAIN_COPIED_FILES_POINTER_ALIAS_PREFIX from
    "@ProjectBuilding/Common/Restrictions/ResourcesReferences/PLAIN_COPIED_FILES_POINTER_ALIAS_PREFIX";

/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type MarkupProcessingSettings__Normalized from "@MarkupProcessing/MarkupProcessingSettings__Normalized";
import type SourceCodeProcessingGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/SourceCodeProcessingGenericProperties__Normalized";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import GulpStreamBasedSourceCodeProcessingConfigRepresentative from
    "@ProjectBuilding/Common/SettingsRepresentatives/GulpStreamBasedSourceCodeProcessingConfigRepresentative";

/* ─── Worktypes ──────────────────────────────────────────────────────────────────────────────────────────────────── */
import type PagesVariationsMetadata from "@MarkupProcessing/Worktypes/PagesVariationsMetadata";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import {
  extractFileNameWithoutLastExtension,
  insertSubstringIf,
  replaceDoubleBackslashesWithForwardSlashes,
  isNotUndefined,
  getExpectedToBeNonUndefinedMapValue
} from "@yamato-daiwa/es-extensions";
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


export default class MarkupProcessingSettingsRepresentative extends GulpStreamBasedSourceCodeProcessingConfigRepresentative<
  MarkupProcessingSettings__Normalized.Common, MarkupProcessingSettings__Normalized.EntryPointsGroup
> {

  /* [ Theory ] Below two fields could be even or not. */
  public readonly supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: ReadonlyArray<string>;
  public readonly actualFileNameExtensionsWithoutLeadingDots: ReadonlyArray<string>;

  public readonly TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM: string = "Markup";
  public readonly TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM: string = "Markup";
  public readonly TASK_NAME_FOR_LOGGING: string = "Markup Processing";
  public readonly PLAIN_COPIED_FILES_ALIAS_PREFIX: string = PLAIN_COPIED_FILES_POINTER_ALIAS_PREFIX;
  public readonly WAITING_FOR_SUBSEQUENT_FILES_WILL_SAVED_PERIOD__SECONDS: number;

  public readonly entryPointsGroupsNormalizedSettingsMappedByReferences: ReadonlyMap<
    string, MarkupProcessingSettings__Normalized.EntryPointsGroup
  >;

  public readonly sourceCodeLintingCommonSettings: MarkupProcessingSettings__Normalized.Linting;
  public readonly importingFromTypeScriptSettings?: MarkupProcessingSettings__Normalized.ImportingFromTypeScript;
  public readonly importingFromJavaScriptSettings?: MarkupProcessingSettings__Normalized.ImportingFromJavaScript;
  public readonly staticPreviewSettings: MarkupProcessingSettings__Normalized.StaticPreview;
  public readonly routingSettings?: MarkupProcessingSettings__Normalized.Routing;
  public readonly relevantEntryPointsGroupsSettings: ReadonlyMap<
    SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup.ID, MarkupProcessingSettings__Normalized.EntryPointsGroup
  >;
  public readonly loggingSettings: MarkupProcessingSettings__Normalized.Logging;

  public readonly mustValidateHTML: boolean;
  public readonly mustInspectAccessibility: boolean;

  protected readonly sourceCodeProcessingCommonSettings: MarkupProcessingSettings__Normalized.Common;
  protected readonly mustResolveResourcesReferencesToAbsolutePath: boolean;


  public constructor(
    normalizedMarkupProcessingSettings: MarkupProcessingSettings__Normalized,
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ) {

    super(projectBuildingMasterConfigRepresentative);

    this.sourceCodeLintingCommonSettings = normalizedMarkupProcessingSettings.linting;
    this.importingFromTypeScriptSettings = normalizedMarkupProcessingSettings.importingFromTypeScript;
    this.importingFromJavaScriptSettings = normalizedMarkupProcessingSettings.importingFromJavaScript;
    this.staticPreviewSettings = normalizedMarkupProcessingSettings.staticPreview;
    this.routingSettings = normalizedMarkupProcessingSettings.routing;
    this.relevantEntryPointsGroupsSettings = normalizedMarkupProcessingSettings.relevantEntryPointsGroups;
    this.loggingSettings = normalizedMarkupProcessingSettings.logging;

    this.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots = normalizedMarkupProcessingSettings.common.
        supportedSourceFileNameExtensionsWithoutLeadingDots;
    this.actualFileNameExtensionsWithoutLeadingDots = normalizedMarkupProcessingSettings.common.
        supportedSourceFileNameExtensionsWithoutLeadingDots;

    this.WAITING_FOR_SUBSEQUENT_FILES_WILL_SAVED_PERIOD__SECONDS = normalizedMarkupProcessingSettings.common.
        secondsBetweenFileUpdatingAndStartingOfRebuilding;

    this.entryPointsGroupsNormalizedSettingsMappedByReferences = new Map<
      string, MarkupProcessingSettings__Normalized.EntryPointsGroup
    >(
      Array.from(this.relevantEntryPointsGroupsSettings.values()).map(
        (entryPointsGroupSettings: MarkupProcessingSettings__Normalized.EntryPointsGroup):
            [string, MarkupProcessingSettings__Normalized.EntryPointsGroup] =>
                [
                  `${ PROCESSABLE_FILES_POINTER_ALIAS_PREFIX }${ entryPointsGroupSettings.ID }`,
                  entryPointsGroupSettings
                ]
      )
    );

    this.mustValidateHTML = Array.from(this.relevantEntryPointsGroupsSettings.values()).some(
      (entryPointsGroupSettings: MarkupProcessingSettings__Normalized.EntryPointsGroup): boolean =>
          entryPointsGroupSettings.HTML_Validation.mustExecute
    );

    this.mustInspectAccessibility = Array.from(this.relevantEntryPointsGroupsSettings.values()).some(
      (entryPointsGroupSettings: MarkupProcessingSettings__Normalized.EntryPointsGroup): boolean =>
          entryPointsGroupSettings.accessibilityInspection.mustExecute
    );

    this.sourceCodeProcessingCommonSettings = normalizedMarkupProcessingSettings.common;
    this.mustResolveResourcesReferencesToAbsolutePath = normalizedMarkupProcessingSettings.common.
        mustResolveResourcesReferencesToAbsolutePath;

  }


  /* ━━━ Common ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public computeOutputFileNameExtension(
    compoundParameter: Readonly<
      (
        { targetFilePath: string; } |
        { entryPointsGroupSettingsActualForTargetFile: MarkupProcessingSettings__Normalized.EntryPointsGroup; }
      ) &
      { mustPrependDotToFileNameExtension: boolean; }
    >
  ): string {

    const actualEntryPointsGroupSettings: MarkupProcessingSettings__Normalized.EntryPointsGroup =
        "entryPointsGroupSettingsActualForTargetFile" in compoundParameter ?
            compoundParameter.entryPointsGroupSettingsActualForTargetFile :
            this.getExpectedToExistEntryPointsGroupSettingsRelevantForSpecifiedSourceFileAbsolutePath(
              compoundParameter.targetFilePath
            );

    let fileNameExtensionWithoutLeadingDot: string;

    switch (actualEntryPointsGroupSettings.outputFormat) {

      case MarkupProcessingRestrictions.OutputFormats.HTML: {
        fileNameExtensionWithoutLeadingDot = "html";
        break;
      }

      case MarkupProcessingRestrictions.OutputFormats.handlebars: {
        fileNameExtensionWithoutLeadingDot =
            this.projectBuildingMasterConfigRepresentative.isStaticPreviewBuildingMode ?
                "html" : "hbs";
        break;
      }

      case MarkupProcessingRestrictions.OutputFormats.razor: {
        fileNameExtensionWithoutLeadingDot = "razor";
      }

    }

    return insertSubstringIf(".", compoundParameter.mustPrependDotToFileNameExtension) +
        fileNameExtensionWithoutLeadingDot;

  }


  /* ━━━ Static Preview ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public getStateDependentVariationsForEntryPointWithAbsolutePath(
    targetFileAbsolutePath: string
  ): MarkupProcessingSettings__Normalized.StaticPreview.PagesVariations.StateDependent.Page | undefined {
    return this.staticPreviewSettings.pagesVariations.stateDependent.
        get(replaceDoubleBackslashesWithForwardSlashes(targetFileAbsolutePath));
  }

  public get staticDataForStaticPreview(): MarkupProcessingSettings__Normalized.StaticPreview.ImportsFromStaticDataFiles {
    return this.staticPreviewSettings.importsFromStaticDataFiles;
  }


  /* ━━━ Logging ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public get mustLogSourceFilesWatcherEvents(): boolean {
    return this.loggingSettings.filesWatcherEvents;
  }


  /* ━━━ Pages Variations ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public createPagesVariationsMetadata(
    sourceFilesAbsolutePaths__forwardSlashesSeparators: ReadonlyArray<string>
  ): PagesVariationsMetadata {
    return new Map(
      sourceFilesAbsolutePaths__forwardSlashesSeparators.map(
        (sourceFileAbsolutePath__forwardSlashesSeparators: string):
            [ PagesVariationsMetadata.SourceFileAbsolutePath__ForwardSlashesPathSeparators, PagesVariationsMetadata.Page ] =>
                [
                  sourceFileAbsolutePath__forwardSlashesSeparators,
                  this.createPageVariationsMetadata(sourceFileAbsolutePath__forwardSlashesSeparators)
                ]
      )
    );
  }

  public createPageVariationsMetadata(
    sourceFileAbsolutePath__forwardSlashesSeparators: string
  ): PagesVariationsMetadata.Page {

    const sourceAndOutputAbsolutePathsOfAllVariations: Map<string, string> = new Map();
    const absoluteSourcePathsOfAllVariations: Set<string> = new Set();
    const dataForPugBySourceFilesAbsolutePaths: Map<
      PagesVariationsMetadata.SourceFileAbsolutePath__ForwardSlashesPathSeparators,
      Readonly<{
        localizationData?: object;
        pageStateDependentVariationData?: object;
      }>
    > = new Map();

    const markupEntryPointsGroupSettingsActualForCurrentFile: MarkupProcessingSettings__Normalized.EntryPointsGroup =
        this.getExpectedToExistEntryPointsGroupSettingsRelevantForSpecifiedSourceFileAbsolutePath(
          sourceFileAbsolutePath__forwardSlashesSeparators
        );

    const {
      localizedStringResourcesConstantName,
      localeConstantName,
      locales,
      excludedFilesAbsolutePaths,
      nameOfConstantForInterpolationToLangHTML_Attribute
    }: MarkupProcessingSettings__Normalized.EntryPointsGroup.Localization =
        markupEntryPointsGroupSettingsActualForCurrentFile.localization;

    const areLocalizedVersionsRequiredForCurrentFile: boolean =
        locales.size > 0 &&
        !excludedFilesAbsolutePaths.includes(sourceFileAbsolutePath__forwardSlashesSeparators);

    const outputFileNameWithLastExtensionWithLeadingDot: string = this.computeOutputFileNameExtension({
      entryPointsGroupSettingsActualForTargetFile: markupEntryPointsGroupSettingsActualForCurrentFile,
      mustPrependDotToFileNameExtension: false
    });

    const outputDirectoryForCurrentMarkupFileAndDerivedOnes: string = MarkupProcessingSettingsRepresentative.
        computeRelevantOutputDirectoryAbsolutePathForTargetSourceFile(
          sourceFileAbsolutePath__forwardSlashesSeparators, markupEntryPointsGroupSettingsActualForCurrentFile
        );

    const entryPointStateDependentVariationsSpecification:
        MarkupProcessingSettings__Normalized.StaticPreview.PagesVariations.StateDependent.Page | undefined =
            this.getStateDependentVariationsForEntryPointWithAbsolutePath(sourceFileAbsolutePath__forwardSlashesSeparators);

    if (areLocalizedVersionsRequiredForCurrentFile) {

      for (
        const {
          outputFileInterimNameExtensionWithoutDot,
          localeConstantValue,
          stringResources,
          valueOfConstantForInterpolationToLangHTML_Attribute
        } of locales.values()
      ) {

        const absolutePathOfLocalizedEntryPointSourceFile: string = MarkupProcessingRestrictions.
            addLocaleIdentifyingPenultimateFileNameToAbsolutePathOfMarkupEntryPointSourceFile({
              initialAbsolutePathOfMarkupEntryPointSourceFile: sourceFileAbsolutePath__forwardSlashesSeparators,
              localeIdentifyingPenultimateFileNameExtensionWithoutLeadingDot: outputFileInterimNameExtensionWithoutDot
            });

        sourceAndOutputAbsolutePathsOfAllVariations.set(
          absolutePathOfLocalizedEntryPointSourceFile,
          ImprovedPath.joinPathSegments(
            [
              outputDirectoryForCurrentMarkupFileAndDerivedOnes,
              MarkupProcessingRestrictions.computeOutputFileNameWithAllExtensionsForLocalizedMarkupEntryPoint({
                sourceFileNameWithoutLastExtension:
                    extractFileNameWithoutLastExtension(sourceFileAbsolutePath__forwardSlashesSeparators),
                localeIdentifyingPenultimateFileNameExtensionWithoutLeadingDot: outputFileInterimNameExtensionWithoutDot,
                outputFileNameWithLastExtensionWithLeadingDot
              })
            ],
            { alwaysForwardSlashSeparators: true }
          )
        );

        absoluteSourcePathsOfAllVariations.add(absolutePathOfLocalizedEntryPointSourceFile);

        dataForPugBySourceFilesAbsolutePaths.set(
          absolutePathOfLocalizedEntryPointSourceFile,
          {
            localizationData: {
              ...isNotUndefined(localeConstantName) && isNotUndefined(localeConstantValue) ?
                  { [localeConstantName]: localeConstantValue } : null,
              ...isNotUndefined(localizedStringResourcesConstantName) && isNotUndefined(stringResources) ?
                  { [localizedStringResourcesConstantName]: stringResources } : null,
              ...isNotUndefined(nameOfConstantForInterpolationToLangHTML_Attribute) &&
                  isNotUndefined(valueOfConstantForInterpolationToLangHTML_Attribute) ?
                      {
                        [nameOfConstantForInterpolationToLangHTML_Attribute]:
                            valueOfConstantForInterpolationToLangHTML_Attribute
                      } : null
            },
            ...isNotUndefined(entryPointStateDependentVariationsSpecification) ?
              {
                pageStateDependentVariationData: {
                  [entryPointStateDependentVariationsSpecification.stateVariableName]: {}
                }
              } :
              null
          }
        );

      }

    } else {

      sourceAndOutputAbsolutePathsOfAllVariations.set(
        sourceFileAbsolutePath__forwardSlashesSeparators,
        ImprovedPath.joinPathSegments(
          [
            outputDirectoryForCurrentMarkupFileAndDerivedOnes,
            `${ extractFileNameWithoutLastExtension(sourceFileAbsolutePath__forwardSlashesSeparators) }.` +
                outputFileNameWithLastExtensionWithLeadingDot
          ],
          { alwaysForwardSlashSeparators: true }
        )
      );

      absoluteSourcePathsOfAllVariations.add(sourceFileAbsolutePath__forwardSlashesSeparators);

    }


    for (
      const derivedSourceFileAbsolutePath of
          (entryPointStateDependentVariationsSpecification?.derivedPagesAndStatesMap ?? new Map<string, string>()).keys()
    ) {

      if (areLocalizedVersionsRequiredForCurrentFile) {

        for (
          const {
            outputFileInterimNameExtensionWithoutDot,
            localeConstantValue,
            stringResources,
            valueOfConstantForInterpolationToLangHTML_Attribute
          } of locales.values()
        ) {

          const absolutePathOfLocalizeEntryPointSourceFile: string = MarkupProcessingRestrictions.
              addLocaleIdentifyingPenultimateFileNameToAbsolutePathOfMarkupEntryPointSourceFile({
                initialAbsolutePathOfMarkupEntryPointSourceFile: derivedSourceFileAbsolutePath,
                localeIdentifyingPenultimateFileNameExtensionWithoutLeadingDot: outputFileInterimNameExtensionWithoutDot
              });

          sourceAndOutputAbsolutePathsOfAllVariations.set(
            absolutePathOfLocalizeEntryPointSourceFile,
            ImprovedPath.joinPathSegments(
              [
                outputDirectoryForCurrentMarkupFileAndDerivedOnes,
                MarkupProcessingRestrictions.computeOutputFileNameWithAllExtensionsForLocalizedMarkupEntryPoint({
                  sourceFileNameWithoutLastExtension: extractFileNameWithoutLastExtension(derivedSourceFileAbsolutePath),
                  localeIdentifyingPenultimateFileNameExtensionWithoutLeadingDot: outputFileInterimNameExtensionWithoutDot,
                  outputFileNameWithLastExtensionWithLeadingDot
                })
              ],
              { alwaysForwardSlashSeparators: true }
            )
          );

          absoluteSourcePathsOfAllVariations.add(absolutePathOfLocalizeEntryPointSourceFile);

          dataForPugBySourceFilesAbsolutePaths.set(
            absolutePathOfLocalizeEntryPointSourceFile,
            {
              localizationData: {
                ...isNotUndefined(localeConstantName) && isNotUndefined(localeConstantValue) ?
                    { [localeConstantName]: localeConstantValue } : null,
                ...isNotUndefined(localizedStringResourcesConstantName) && isNotUndefined(stringResources) ?
                    { [localizedStringResourcesConstantName]: stringResources } : null,
                ...isNotUndefined(nameOfConstantForInterpolationToLangHTML_Attribute) &&
                    isNotUndefined(valueOfConstantForInterpolationToLangHTML_Attribute) ?
                        {
                          [nameOfConstantForInterpolationToLangHTML_Attribute]:
                              valueOfConstantForInterpolationToLangHTML_Attribute
                        } : null
              },
              ...isNotUndefined(entryPointStateDependentVariationsSpecification) ?
                  {
                    pageStateDependentVariationData: {
                      [entryPointStateDependentVariationsSpecification.stateVariableName]:
                          getExpectedToBeNonUndefinedMapValue(
                            entryPointStateDependentVariationsSpecification.derivedPagesAndStatesMap,
                            derivedSourceFileAbsolutePath
                          )
                    }
                  } :
                  null
            }
          );

        }

      } else {

        sourceAndOutputAbsolutePathsOfAllVariations.set(
          derivedSourceFileAbsolutePath,
          ImprovedPath.joinPathSegments(
            [
              outputDirectoryForCurrentMarkupFileAndDerivedOnes,
              `${ extractFileNameWithoutLastExtension(derivedSourceFileAbsolutePath) }.` +
                  outputFileNameWithLastExtensionWithLeadingDot
            ],
            { alwaysForwardSlashSeparators: true }
          )
        );

        absoluteSourcePathsOfAllVariations.add(derivedSourceFileAbsolutePath);

        dataForPugBySourceFilesAbsolutePaths.set(
          derivedSourceFileAbsolutePath,
          {
            localizationData: {

            },
            ...isNotUndefined(entryPointStateDependentVariationsSpecification) ?
                {
                  pageStateDependentVariationData: {
                    [entryPointStateDependentVariationsSpecification.stateVariableName]:
                        getExpectedToBeNonUndefinedMapValue(
                          entryPointStateDependentVariationsSpecification.derivedPagesAndStatesMap,
                          derivedSourceFileAbsolutePath
                        )
                  }
                } :
                null
          }
        );

      }

    }

    return {
      mustInitialFileBeKept: !areLocalizedVersionsRequiredForCurrentFile,
      sourceAndOutputAbsolutePathsOfAllVariations,
      absoluteSourcePathsOfAllVariations,
      dataForPugBySourceFilesAbsolutePaths
    };

  }

}
