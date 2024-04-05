/* ─── Related Classes ────────────────────────────────────────────────────────────────────────────────────────────── */
import AssetsSourceFilesWatcher from "@ProjectBuilding/FilesWatching/Watchers/AssetsSourceFilesWatcher";
import FilesMasterWatcher from "@ProjectBuilding/FilesWatching/Watchers/FilesMasterWatcher";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ImagesProcessingSettingsRepresentative from "@ImagesProcessing/ImagesProcessingSettingsRepresentative";
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { isNull } from "@yamato-daiwa/es-extensions";


class ImagesSourceFilesWatcher extends AssetsSourceFilesWatcher {

  protected static selfSoleInstance: ImagesSourceFilesWatcher | null = null;


  public static initializeIfRequiredAndGetInstance(
    initializationRequirements: ImagesSourceFilesWatcher.InitializationRequirements
  ): ImagesSourceFilesWatcher {

    if (isNull(ImagesSourceFilesWatcher.selfSoleInstance)) {
      ImagesSourceFilesWatcher.selfSoleInstance = new ImagesSourceFilesWatcher(initializationRequirements);
      FilesMasterWatcher.addPassiveWatcher(ImagesSourceFilesWatcher.selfSoleInstance);
    }

    return ImagesSourceFilesWatcher.selfSoleInstance;

  }


  private constructor(
    {
      imagesProcessingSettingsRepresentative,
      projectBuildingMasterConfigRepresentative
    }: ImagesSourceFilesWatcher.InitializationRequirements
  ) {

    super({
      ID: "IMAGE_SOURCE_FILES_WATCHER",
      mustLogEvents: imagesProcessingSettingsRepresentative.loggingSettings.filesWatcherEvents,
      projectBuildingMasterConfigRepresentative,
      targetFilesNamesExtensionsWithoutLeadingDots: imagesProcessingSettingsRepresentative.
          supportedSourceFilesNamesExtensionsWithoutLeadingDots,
      outputFilesGlobSelectors: imagesProcessingSettingsRepresentative.actualOutputFilesGlobSelectors,
      targetSourceFilesType__singularForm: "Image"
    });

  }

}


namespace ImagesSourceFilesWatcher {

  export type InitializationRequirements = Readonly<{
    imagesProcessingSettingsRepresentative: ImagesProcessingSettingsRepresentative;
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
  }>;

}


export default ImagesSourceFilesWatcher;
