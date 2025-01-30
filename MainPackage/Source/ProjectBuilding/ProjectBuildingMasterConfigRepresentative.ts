/* --- Business rules ----------------------------------------------------------------------------------------------- */
import ConsumingProjectBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";

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

import PlainCopyingSettingsRepresentative from "@ProjectBuilding/PlainCopying/PlainCopyingSettingsRepresentative";

import FilesWatchingSettingsRepresentative from "@ProjectBuilding/FilesWatching/FilesWatchingSettingsRepresentative";
import BrowserLiveReloadingSettingsRepresentative from "@BrowserLiveReloading/BrowserLiveReloadingSettingsRepresentative";

import OutputPackageJSON_GeneratingSettingsRepresentative from
    "@ProjectBuilding/OutputPackageJSON_Generating/OutputPackageJSON_GeneratingSettingsRepresentative";

/* --- General auxiliaries ------------------------------------------------------------------------------------------ */
import {
  Logger,
  ClassRedundantSubsequentInitializationError,
  isNotUndefined,
  isNotNull,
  undefinedToNull
} from "@yamato-daiwa/es-extensions";


export default class ProjectBuildingMasterConfigRepresentative {

  private static selfSoleInstance: ProjectBuildingMasterConfigRepresentative | null = null;


  public readonly markupProcessingSettingsRepresentative?: MarkupProcessingSettingsRepresentative;
  public readonly stylesProcessingSettingsRepresentative?: StylesProcessingSettingsRepresentative;
  public readonly ECMA_ScriptLogicProcessingSettingsRepresentative?:
      ECMA_ScriptLogicProcessingSettingsRepresentative;

  public readonly imagesProcessingSettingsRepresentative?: ImagesProcessingSettingsRepresentative;
  public readonly fontsProcessingSettingsRepresentative?: FontsProcessingSettingsRepresentative;
  public readonly audiosProcessingSettingsRepresentative?: AudiosProcessingSettingsRepresentative;
  public readonly videosProcessingSettingsRepresentative?: VideosProcessingSettingsRepresentative;

  public readonly plainCopyingSettingsRepresentative?: PlainCopyingSettingsRepresentative;

  public readonly filesWatchingSettingsRepresentative?: FilesWatchingSettingsRepresentative;
  public readonly browserLiveReloadingSettingsRepresentative?: BrowserLiveReloadingSettingsRepresentative;

  public readonly outputPackageJSON_GeneratingSettingsRepresentative?: OutputPackageJSON_GeneratingSettingsRepresentative;


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

    if (isNotUndefined(projectBuilderNormalizedConfig.plainCopying)) {
      this.plainCopyingSettingsRepresentative = new PlainCopyingSettingsRepresentative(
        projectBuilderNormalizedConfig.plainCopying
      );
    }

    this.filesWatchingSettingsRepresentative =
        new FilesWatchingSettingsRepresentative(projectBuilderNormalizedConfig.filesWatching, this);

    if (isNotUndefined(projectBuilderNormalizedConfig.browserLiveReloading)) {
      this.browserLiveReloadingSettingsRepresentative = new BrowserLiveReloadingSettingsRepresentative(
        projectBuilderNormalizedConfig.browserLiveReloading
      );
    }

    if (isNotUndefined(projectBuilderNormalizedConfig.outputPackageJSON_Generating)) {
      this.outputPackageJSON_GeneratingSettingsRepresentative = new OutputPackageJSON_GeneratingSettingsRepresentative(
        projectBuilderNormalizedConfig.outputPackageJSON_Generating
      );
    }

  }


  /* === Common settings ============================================================================================ */
  public get consumingProjectRootDirectoryAbsolutePath(): string {
    return this.commonSettings.projectRootDirectoryAbsolutePath;
  }

  public get actualPublicDirectoryAbsolutePath(): string | undefined {
    return this.commonSettings.actualPublicDirectoryAbsolutePath;
  }

  public get selectiveExecutionID(): string | undefined {
    return this.commonSettings.selectiveExecutionID;
  }


  /* --- Project building mode -------------------------------------------------------------------------------------- */
  public get consumingProjectBuildingMode(): string { return this.commonSettings.projectBuildingMode; }

  public get isStaticPreviewBuildingMode(): boolean {
    return this.commonSettings.projectBuildingMode === ConsumingProjectBuildingModes.staticPreview;
  }

  public get isLocalDevelopmentBuildingMode(): boolean {
    return this.commonSettings.projectBuildingMode === ConsumingProjectBuildingModes.localDevelopment;
  }

  public get isTestingBuildingMode(): boolean {
    return this.commonSettings.projectBuildingMode === ConsumingProjectBuildingModes.testing;
  }

  public get isStagingBuildingMode(): boolean {
    return this.commonSettings.projectBuildingMode === ConsumingProjectBuildingModes.staging;
  }

  public get isProductionBuildingMode(): boolean {
    return this.commonSettings.projectBuildingMode === ConsumingProjectBuildingModes.production;
  }

  public get isProductionLikeBuildingMode(): boolean {
    return [
      ConsumingProjectBuildingModes.testing,
      ConsumingProjectBuildingModes.staging,
      ConsumingProjectBuildingModes.production
    ].includes(this.commonSettings.projectBuildingMode);
  }


  /* --- Tasks execution requirement -------------------------------------------------------------------------------- */
  /* eslint-disable @stylistic/brace-style -- In this case the Allman style provides symmetry. */
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

  public getECMA_ScriptLogicProcessingSettingsRepresentativeIfMustProcessECMA_ScriptLogic():
      ECMA_ScriptLogicProcessingSettingsRepresentative | null
  {
    return undefinedToNull(this.ECMA_ScriptLogicProcessingSettingsRepresentative);
  }

  public getECMA_ScriptLogicProcessingSettingsRepresentativeIfMustOrchestrateLocalDevelopmentServer():
      ECMA_ScriptLogicProcessingSettingsRepresentative | null
  {
    return isNotUndefined(
      this.ECMA_ScriptLogicProcessingSettingsRepresentative?.localDevelopmentServerOrchestrationSettings
    ) && this.isLocalDevelopmentBuildingMode ? this.ECMA_ScriptLogicProcessingSettingsRepresentative : null;

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

  public get mustProvideLocalDevelopmentServerOrchestration(): boolean {
    return isNotUndefined(this.ECMA_ScriptLogicProcessingSettingsRepresentative) &&
        this.isLocalDevelopmentBuildingMode &&
        isNotUndefined(this.ECMA_ScriptLogicProcessingSettingsRepresentative.localDevelopmentServerOrchestrationSettings);
  }

  public getBrowserLiveReloadingSettingsRepresentativeIfMustProvideBrowserLiveReloading():
      BrowserLiveReloadingSettingsRepresentative | null
  {
    return this.mustProvideIncrementalBuilding ? undefinedToNull(this.browserLiveReloadingSettingsRepresentative) : null;
  }
  /* eslint-enable @stylistic/brace-style */


  /* --- Other ------------------------------------------------------------------------------------------------------ */
  public get mustProvideIncrementalBuilding(): boolean {
    return this.commonSettings.mustProvideIncrementalBuilding;
  }

}
