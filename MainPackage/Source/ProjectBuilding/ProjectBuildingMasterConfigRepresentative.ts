/* --- Business rules ----------------------------------------------------------------------------------------------- */
import ConsumingProjectPreDefinedBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectPreDefinedBuildingModes";

/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";

/* --- Settings representatives ------------------------------------------------------------------------------------- */
import MarkupProcessingSettingsRepresentative from "@MarkupProcessing/MarkupProcessingSettingsRepresentative";
import StylesProcessingSettingsRepresentative from "@StylesProcessing/StylesProcessingSettingsRepresentative";
import ECMA_ScriptLogicProcessingSettingsRepresentative from
      "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettingsRepresentative";

import ImagesProcessingSettingsRepresentative from
    "@ImagesProcessing/ImagesProcessingSettingsRepresentative";
import FontsProcessingSettingsRepresentative from
    "@FontsProcessing/FontsProcessingSettingsRepresentative";
import AudiosProcessingSettingsRepresentative from
    "@AudiosProcessing/AudiosProcessingSettingsRepresentative";
import VideosProcessingSettingsRepresentative from
    "@VideosProcessing/VideosProcessingSettingsRepresentative";

import BrowserLiveReloadingSettingsRepresentative from "@BrowserLiveReloading/BrowserLiveReloadingSettingsRepresentative";

/* --- General auxiliaries ------------------------------------------------------------------------------------------ */
import {
  Logger,
  ClassRedundantSubsequentInitializationError,
  isNotUndefined,
  isNotNull
} from "@yamato-daiwa/es-extensions";


export default class ProjectBuildingMasterConfigRepresentative {

  private static selfSoleInstance: ProjectBuildingMasterConfigRepresentative | null = null;


  public readonly markupProcessingSettingsRepresentative: MarkupProcessingSettingsRepresentative | undefined;
  public readonly stylesProcessingSettingsRepresentative: StylesProcessingSettingsRepresentative | undefined;
  public readonly ECMA_ScriptLogicProcessingSettingsRepresentative:
      ECMA_ScriptLogicProcessingSettingsRepresentative | undefined;

  public readonly imagesProcessingSettingsRepresentative: ImagesProcessingSettingsRepresentative | undefined;
  public readonly fontsProcessingSettingsRepresentative: FontsProcessingSettingsRepresentative | undefined;
  public readonly audiosProcessingSettingsRepresentative: AudiosProcessingSettingsRepresentative | undefined;
  public readonly videosProcessingSettingsRepresentative: VideosProcessingSettingsRepresentative | undefined;

  public readonly browserLiveReloadingSettingsRepresentative: BrowserLiveReloadingSettingsRepresentative | undefined;


  private readonly commonSettings: ProjectBuildingCommonSettings__Normalized;


  public static initializeAndGetInstance(
    projectBuilderConfig__normalized: ProjectBuildingConfig__Normalized
  ): ProjectBuildingMasterConfigRepresentative {

    if (isNotNull(ProjectBuildingMasterConfigRepresentative.selfSoleInstance)) {
      Logger.throwErrorAndLog({
        errorInstance: new ClassRedundantSubsequentInitializationError({
          className: "ProjectBuildingMasterConfigRepresentative"
        }),
        title: ClassRedundantSubsequentInitializationError.localization.defaultTitle,
        occurrenceLocation: "ProjectBuildingMasterConfigRepresentative" +
            ".initializeAndGetInstance(projectBuilderConfig__normalized)"
      });
    }


    ProjectBuildingMasterConfigRepresentative.selfSoleInstance = new ProjectBuildingMasterConfigRepresentative(
      projectBuilderConfig__normalized
    );

    return ProjectBuildingMasterConfigRepresentative.selfSoleInstance;
  }


  public constructor(projectBuilderNormalizedConfig: ProjectBuildingConfig__Normalized) {

    this.commonSettings = projectBuilderNormalizedConfig.commonSettings;

    if (isNotUndefined(projectBuilderNormalizedConfig.markupProcessing)) {
      this.markupProcessingSettingsRepresentative = new MarkupProcessingSettingsRepresentative(
        projectBuilderNormalizedConfig.markupProcessing, this
      );
    }

    if (isNotUndefined(projectBuilderNormalizedConfig.stylesProcessing)) {
      this.stylesProcessingSettingsRepresentative = new StylesProcessingSettingsRepresentative(
        projectBuilderNormalizedConfig.stylesProcessing, this
      );
    }

    if (isNotUndefined(projectBuilderNormalizedConfig.ECMA_ScriptLogicProcessing)) {
      this.ECMA_ScriptLogicProcessingSettingsRepresentative = new ECMA_ScriptLogicProcessingSettingsRepresentative(
        projectBuilderNormalizedConfig.ECMA_ScriptLogicProcessing, this
      );
    }

    if (isNotUndefined(projectBuilderNormalizedConfig.imagesProcessing)) {
      this.imagesProcessingSettingsRepresentative = new ImagesProcessingSettingsRepresentative(
        projectBuilderNormalizedConfig.imagesProcessing, this
      );
    }

    if (isNotUndefined(projectBuilderNormalizedConfig.fontsProcessing)) {
      this.fontsProcessingSettingsRepresentative = new FontsProcessingSettingsRepresentative(
        projectBuilderNormalizedConfig.fontsProcessing, this
      );
    }

    if (isNotUndefined(projectBuilderNormalizedConfig.audiosProcessing)) {
      this.audiosProcessingSettingsRepresentative = new AudiosProcessingSettingsRepresentative(
        projectBuilderNormalizedConfig.audiosProcessing, this
      );
    }

    if (isNotUndefined(projectBuilderNormalizedConfig.videosProcessing)) {
      this.videosProcessingSettingsRepresentative = new VideosProcessingSettingsRepresentative(
        projectBuilderNormalizedConfig.videosProcessing, this
      );
    }

    if (isNotUndefined(projectBuilderNormalizedConfig.browserLiveReloading)) {
      this.browserLiveReloadingSettingsRepresentative = new BrowserLiveReloadingSettingsRepresentative(
        projectBuilderNormalizedConfig.browserLiveReloading
      );
    }
  }


  public get consumingProjectRootDirectoryAbsolutePath(): string {
    return this.commonSettings.projectRootDirectoryAbsolutePath;
  }

  public get actualPublicDirectoryAbsolutePath(): string | undefined {
    return this.commonSettings.actualPublicDirectoryAbsolutePath;
  }


  /* --- Project building mode -------------------------------------------------------------------------------------- */
  public get consumingProjectBuildingMode(): string { return this.commonSettings.projectBuildingMode; }

  public get isStaticPreviewBuildingMode(): boolean {
    return this.commonSettings.projectBuildingMode === ConsumingProjectPreDefinedBuildingModes.staticPreview;
  }

  public get isLocalDevelopmentBuildingMode(): boolean {
    return this.commonSettings.projectBuildingMode === ConsumingProjectPreDefinedBuildingModes.localDevelopment;
  }

  public get isTestingBuildingMode(): boolean {
    return this.commonSettings.projectBuildingMode === ConsumingProjectPreDefinedBuildingModes.testing;
  }

  public get isStagingBuildingMode(): boolean {
    return this.commonSettings.projectBuildingMode === ConsumingProjectPreDefinedBuildingModes.staging;
  }

  public get isProductionBuildingMode(): boolean {
    return this.commonSettings.projectBuildingMode === ConsumingProjectPreDefinedBuildingModes.production;
  }


  /* --- Tasks execution requirement -------------------------------------------------------------------------------- */
  public get mustProcessMarkup(): boolean {
    return isNotUndefined(this.markupProcessingSettingsRepresentative) &&
        this.markupProcessingSettingsRepresentative.hasAtLeastOneRelevantEntryPointsGroup;
  }

  public get mustProvideMarkupLinting(): boolean {
    return isNotUndefined(this.markupProcessingSettingsRepresentative);
  }

  public get mustProcessStyles(): boolean {
    return isNotUndefined(this.stylesProcessingSettingsRepresentative) &&
        this.stylesProcessingSettingsRepresentative.hasAtLeastOneRelevantEntryPointsGroup;
  }

  public get mustProcessECMA_ScriptBasedLogic(): boolean {
    return isNotUndefined(this.ECMA_ScriptLogicProcessingSettingsRepresentative);
  }

  public get mustProcessImages(): boolean {
    return isNotUndefined(this.imagesProcessingSettingsRepresentative);
  }

  public get mustProcessFonts(): boolean {
    return isNotUndefined(this.fontsProcessingSettingsRepresentative);
  }

  public get mustProcessAudios(): boolean {
    return isNotUndefined(this.audiosProcessingSettingsRepresentative);
  }

  public get mustProcessVideos(): boolean {
    return isNotUndefined(this.videosProcessingSettingsRepresentative);
  }

  public get mustProvideBrowserLiveReloading(): boolean {
    return isNotUndefined(this.browserLiveReloadingSettingsRepresentative) &&
        (this.isStaticPreviewBuildingMode || this.isLocalDevelopmentBuildingMode);
  }


  /* --- Other ------------------------------------------------------------------------------------------------------ */
  public get allOutputFilesGlobSelectors(): Array<string> {
    return [
      ...this.markupProcessingSettingsRepresentative?.actualOutputFilesGlobSelectors ?? [],
      ...this.stylesProcessingSettingsRepresentative?.actualOutputFilesGlobSelectors ?? [],
      ...this.ECMA_ScriptLogicProcessingSettingsRepresentative?.actualOutputFilesGlobSelectors ?? [],
      ...this.imagesProcessingSettingsRepresentative?.actualOutputFilesGlobSelectors ?? [],
      ...this.fontsProcessingSettingsRepresentative?.actualOutputFilesGlobSelectors ?? [],
      ...this.audiosProcessingSettingsRepresentative?.actualOutputFilesGlobSelectors ?? [],
      ...this.videosProcessingSettingsRepresentative?.actualOutputFilesGlobSelectors ?? []
    ];
  }

}
