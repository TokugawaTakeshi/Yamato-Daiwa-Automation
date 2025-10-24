/* ━━━ < Imports ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* ┅┅┅ Restrictions ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import ConsumingProjectBuildingModes from "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";

/* ┅┅┅ Normalized Settings ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import type ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";

/* ┅┅┅ Settings Representatives ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
/* ╍╍╍ Source Code Processing ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
import MarkupProcessingSettingsRepresentative from "@MarkupProcessing/MarkupProcessingSettingsRepresentative";
import StylesProcessingSettingsRepresentative from "@StylesProcessing/StylesProcessingSettingsRepresentative";
import ECMA_ScriptLogicProcessingSettingsRepresentative from
      "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettingsRepresentative";

/* ╍╍╍ Assets Management ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
import ImagesProcessingSettingsRepresentative from
    "@ImagesProcessing/ImagesProcessingSettingsRepresentative";
import FontsProcessingSettingsRepresentative from
    "@FontsProcessing/FontsProcessingSettingsRepresentative";
import AudiosProcessingSettingsRepresentative from
    "@AudiosProcessing/AudiosProcessingSettingsRepresentative";
import VideosProcessingSettingsRepresentative from
    "@VideosProcessing/VideosProcessingSettingsRepresentative";

/* ╍╍╍ Other ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
import PlainCopyingSettingsRepresentative from "@ProjectBuilding/PlainCopying/PlainCopyingSettingsRepresentative";

import BrowserLiveReloadingSettingsRepresentative from "@BrowserLiveReloading/BrowserLiveReloadingSettingsRepresentative";

import OutputPackageJSON_GeneratingSettingsRepresentative from
    "@ProjectBuilding/OutputPackageJSON_Generating/OutputPackageJSON_GeneratingSettingsRepresentative";

import DockerSettingsRepresentative from "@ProjectBuilding/DockerCompose/DockerSettingsRepresentative";

/* ┅┅┅ Utils ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import {
  Logger,
  ClassRedundantSubsequentInitializationError,
  isNotUndefined,
  undefinedToNull
} from "@yamato-daiwa/es-extensions";
/* ━━━ Imports > ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */


export default class ProjectBuildingMasterConfigRepresentative {

  /* ━━━ Static Fields ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private static hasBeenConstructedAtLeastOnce: boolean = false;


  /* ┅┅┅ Public Instance Fields ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  /* ╍╍╍ Settings Representatives ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
  /* ─── Source Code Processing ───────────────────────────────────────────────────────────────────────────────────── */
  public readonly markupProcessingSettingsRepresentative?: MarkupProcessingSettingsRepresentative;
  public readonly stylesProcessingSettingsRepresentative?: StylesProcessingSettingsRepresentative;
  public readonly ECMA_ScriptLogicProcessingSettingsRepresentative?:
      ECMA_ScriptLogicProcessingSettingsRepresentative;

  /* ─── Assets Management ────────────────────────────────────────────────────────────────────────────────────────── */
  public readonly imagesProcessingSettingsRepresentative?: ImagesProcessingSettingsRepresentative;
  public readonly fontsProcessingSettingsRepresentative?: FontsProcessingSettingsRepresentative;
  public readonly audiosProcessingSettingsRepresentative?: AudiosProcessingSettingsRepresentative;
  public readonly videosProcessingSettingsRepresentative?: VideosProcessingSettingsRepresentative;


  /* ─── Other ────────────────────────────────────────────────────────────────────────────────────────────────────── */
  public readonly plainCopyingSettingsRepresentative?: PlainCopyingSettingsRepresentative;
  public readonly browserLiveReloadingSettingsRepresentative?: BrowserLiveReloadingSettingsRepresentative;
  public readonly dockerComposeSettingsRepresentative?: DockerSettingsRepresentative;
  public readonly outputPackageJSON_GeneratingSettingsRepresentative?: OutputPackageJSON_GeneratingSettingsRepresentative;


  /* ┅┅┅ Private Instance Fields ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private readonly commonSettings: ProjectBuildingCommonSettings__Normalized;


  /* ━━━ Constructor ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public constructor(projectBuilderNormalizedConfig: ProjectBuildingConfig__Normalized) {

    if (ProjectBuildingMasterConfigRepresentative.hasBeenConstructedAtLeastOnce) {
      Logger.throwErrorWithFormattedMessage({
        errorInstance: new ClassRedundantSubsequentInitializationError({
          className: "ProjectBuildingMasterConfigRepresentative"
        }),
        title: ClassRedundantSubsequentInitializationError.localization.defaultTitle,
        occurrenceLocation: "ProjectBuildingMasterConfigRepresentative." +
            "constructor(projectBuilderConfig__normalized)"
      });
    }


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

    if (isNotUndefined(projectBuilderNormalizedConfig.browserLiveReloading)) {
      this.browserLiveReloadingSettingsRepresentative = new BrowserLiveReloadingSettingsRepresentative(
        projectBuilderNormalizedConfig.browserLiveReloading
      );
    }

    if (isNotUndefined(projectBuilderNormalizedConfig.dockerCompose)) {
      this.dockerComposeSettingsRepresentative = new DockerSettingsRepresentative(
        projectBuilderNormalizedConfig.dockerCompose
      );
    }

    if (isNotUndefined(projectBuilderNormalizedConfig.outputPackageJSON_Generating)) {
      this.outputPackageJSON_GeneratingSettingsRepresentative = new OutputPackageJSON_GeneratingSettingsRepresentative(
        projectBuilderNormalizedConfig.outputPackageJSON_Generating
      );
    }

    ProjectBuildingMasterConfigRepresentative.hasBeenConstructedAtLeastOnce = true;

  }


  /* ━━━ Common Settings Sharing ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public get consumingProjectRootDirectoryAbsolutePath(): string {
    return this.commonSettings.projectRootDirectoryAbsolutePath;
  }

  public get actualPublicDirectoryAbsolutePath(): string | undefined {
    return this.commonSettings.actualPublicDirectoryAbsolutePath;
  }

  public get selectiveExecutionID(): string | undefined {
    return this.commonSettings.selectiveExecutionID;
  }

  public get filesWatchingSettings(): ProjectBuildingCommonSettings__Normalized.FilesWatching {
    return this.commonSettings.filesWatching;
  }


  /* ┅┅┅ Project Building Mode ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
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
    ].
        includes(this.commonSettings.projectBuildingMode);
  }

  public get mustProvideIncrementalBuilding(): boolean {
    return this.commonSettings.mustProvideIncrementalBuilding;
  }


  /* ┅┅┅ Tasks Execution Requirement ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  public getECMA_ScriptLogicProcessingSettingsRepresentativeIfMustOrchestrateLocalDevelopmentServer():
      ECMA_ScriptLogicProcessingSettingsRepresentative | null
  {
    return isNotUndefined(
      this.ECMA_ScriptLogicProcessingSettingsRepresentative?.localDevelopmentServerOrchestrationSettings
    ) && this.isLocalDevelopmentBuildingMode ?
        this.ECMA_ScriptLogicProcessingSettingsRepresentative : null;

  }

  public getBrowserLiveReloadingSettingsRepresentativeIfMustProvideBrowserLiveReloading():
      BrowserLiveReloadingSettingsRepresentative | null
  {
    return this.mustProvideIncrementalBuilding ? undefinedToNull(this.browserLiveReloadingSettingsRepresentative) : null;
  }

  public get processingOnDemandSettings(): ProjectBuildingCommonSettings__Normalized.ProcessingOnDemand {
    return this.commonSettings.processingOnDemand;
  }

  public get CSS_ClassesMinificationOnFlySettings(): ProjectBuildingCommonSettings__Normalized.CSS_ClassesMinificationOnFly {
    return this.commonSettings.CSS_ClassesMinificationOnFly;
  }

}
