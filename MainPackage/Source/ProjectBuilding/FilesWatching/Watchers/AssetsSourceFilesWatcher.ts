/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";

/* ─── Superclass ─────────────────────────────────────────────────────────────────────────────────────────────────── */
import FilesPassiveWatcher from "@ProjectBuilding/FilesWatching/Watchers/FilesPassiveWatcher";

/* ─── Related Classes ────────────────────────────────────────────────────────────────────────────────────────────── */
import FilesMasterWatcher from "@ProjectBuilding/FilesWatching/Watchers/FilesMasterWatcher";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import { Logger, toLowerCamelCase, toUpperCamelCase } from "@yamato-daiwa/es-extensions";
import { ImprovedGlob } from "@yamato-daiwa/es-extensions-nodejs";


abstract class AssetsSourceFilesWatcher extends FilesPassiveWatcher {

  protected readonly onAnyEventRelatedWithActualFiles: AssetsSourceFilesWatcher.EventHandlers = {};

  protected readonly onFileAddedEventHandlers: AssetsSourceFilesWatcher.EventHandlers = {};
  protected readonly onFileUpdatedEventHandlers: AssetsSourceFilesWatcher.EventHandlers = {};
  protected readonly onFileDeletedEventHandlers: AssetsSourceFilesWatcher.EventHandlers = {};

  protected readonly TARGET_SOURCE_FILES_TYPE__SINGULAR_FORM__CAPITALIZED: string;
  protected readonly TARGET_SOURCE_FILES_TYPE__SINGULAR_FORM__LOWERCASE: string;
  protected readonly LOGGER_BADGE_TEXT: string;


  protected constructor(
    {
      ID,
      mustLogEvents,
      projectBuildingMasterConfigRepresentative,
      targetFilesNamesExtensionsWithoutLeadingDots,
      outputFilesGlobSelectors,
      targetSourceFilesType__singularForm
    }: AssetsSourceFilesWatcher.InitializationRequirements
  ) {

    super({
      ID,
      targetFilesGlobSelectors: [
        ImprovedGlob.buildAllFilesInCurrentDirectoryAndBelowGlobSelector({
          basicDirectoryPath: projectBuildingMasterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath,
          fileNamesExtensions: targetFilesNamesExtensionsWithoutLeadingDots
        }),
        ...ImprovedGlob.includingGlobSelectorsToExcludingOnes(outputFilesGlobSelectors)
      ],
      mustLogEvents
    });

    this.TARGET_SOURCE_FILES_TYPE__SINGULAR_FORM__CAPITALIZED = toUpperCamelCase(targetSourceFilesType__singularForm);
    this.TARGET_SOURCE_FILES_TYPE__SINGULAR_FORM__LOWERCASE = toLowerCamelCase(targetSourceFilesType__singularForm);

    this.LOGGER_BADGE_TEXT = `${ this.TARGET_SOURCE_FILES_TYPE__SINGULAR_FORM__CAPITALIZED } Source Files Watcher Report`;

  }


  public notifyAboutRelatedFileStateChange(
    targetFileAbsolutePath__forwardSlashesPathSeparators: string,
    eventName: FilesMasterWatcher.EventsNames
  ): void {

    for (const handler of Object.values(this.onAnyEventRelatedWithActualFiles)) {
      handler(targetFileAbsolutePath__forwardSlashesPathSeparators);
    }


    switch (eventName) {

      case FilesMasterWatcher.EventsNames.fileAdded: {

        Logger.logInfo({
          mustOutputIf: this.mustLogEvents,
          badge: { customText: this.LOGGER_BADGE_TEXT },
          title: `${ this.TARGET_SOURCE_FILES_TYPE__SINGULAR_FORM__LOWERCASE } File Added`,
          description: targetFileAbsolutePath__forwardSlashesPathSeparators
        });

        for (const handler of Object.values(this.onFileAddedEventHandlers)) {
          handler(targetFileAbsolutePath__forwardSlashesPathSeparators);
        }

        break;

      }

      case FilesMasterWatcher.EventsNames.fileUpdated: {

        Logger.logInfo({
          mustOutputIf: this.mustLogEvents,
          badge: { customText: this.LOGGER_BADGE_TEXT },
          title: `${ this.TARGET_SOURCE_FILES_TYPE__SINGULAR_FORM__CAPITALIZED } File Updated`,
          description: targetFileAbsolutePath__forwardSlashesPathSeparators
        });

        for (const handler of Object.values(this.onFileUpdatedEventHandlers)) {
          handler(targetFileAbsolutePath__forwardSlashesPathSeparators);
        }

        break;

      }

      case FilesMasterWatcher.EventsNames.fileDeleted: {

        Logger.logInfo({
          mustOutputIf: this.mustLogEvents,
          badge: { customText: this.LOGGER_BADGE_TEXT },
          title: `${ this.TARGET_SOURCE_FILES_TYPE__SINGULAR_FORM__CAPITALIZED } File Deleted`,
          description: targetFileAbsolutePath__forwardSlashesPathSeparators
        });

        for (const handler of Object.values(this.onFileDeletedEventHandlers)) {
          handler(targetFileAbsolutePath__forwardSlashesPathSeparators);
        }

      }

    }

 }

   public addOnAnyEventRelatedWithActualFilesHandler(
    { handlerID, handler }: Readonly<{ handlerID: string; handler: AssetsSourceFilesWatcher.EventHandler; }>
  ): this {
    this.onAnyEventRelatedWithActualFiles[handlerID] = handler;
    return this;
  }

  public addOnFileAddedEventHandler(
    { handlerID, handler }: Readonly<{ handlerID: string; handler: AssetsSourceFilesWatcher.EventHandler; }>
  ): this {
    this.onFileAddedEventHandlers[handlerID] = handler;
    return this;
  }

  public addFileUpdatedEventHandler(
    { handlerID, handler }: Readonly<{ handlerID: string; handler: AssetsSourceFilesWatcher.EventHandler; }>
  ): this {
    this.onFileUpdatedEventHandlers[handlerID] = handler;
    return this;
  }

  public addOnFileDeletedEventHandler(
    { handlerID, handler }: Readonly<{ handlerID: string; handler: AssetsSourceFilesWatcher.EventHandler; }>
  ): this {
    this.onFileDeletedEventHandlers[handlerID] = handler;
    return this;
  }

}


namespace AssetsSourceFilesWatcher {

  export type InitializationRequirements =
      Pick<FilesPassiveWatcher.InitializationRequirements, "ID" | "mustLogEvents"> &
      Readonly<{
        projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
        targetFilesNamesExtensionsWithoutLeadingDots: ReadonlyArray<string>;
        outputFilesGlobSelectors: ReadonlyArray<string>;
        targetSourceFilesType__singularForm: string;
      }>;

  export type EventHandler = (targetFileAbsolutePath__forwardSlashesPathSeparators: string) => unknown;

  export type EventHandlers = { [ID: string]: EventHandler; };

}


export default AssetsSourceFilesWatcher;
