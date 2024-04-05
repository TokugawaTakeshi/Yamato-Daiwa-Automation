/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type SourceCodeProcessingGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/SourceCodeProcessingGenericProperties__Normalized";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type SourceCodeProcessingConfigRepresentative from
    "@ProjectBuilding/Common/SettingsRepresentatives/SourceCodeProcessingConfigRepresentative";

/* ─── Superclass ─────────────────────────────────────────────────────────────────────────────────────────────────── */
import FilesPassiveWatcher from "@ProjectBuilding/FilesWatching/Watchers/FilesPassiveWatcher";

/* ─── Related Classes ────────────────────────────────────────────────────────────────────────────────────────────── */
import FilesMasterWatcher from "@ProjectBuilding/FilesWatching/Watchers/FilesMasterWatcher";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import { Logger, toLowerCamelCase, toUpperCamelCase } from "@yamato-daiwa/es-extensions";
import { ImprovedGlob } from "@yamato-daiwa/es-extensions-nodejs";


abstract class CodeSourceFilesWatcher extends FilesPassiveWatcher {

  protected abstract readonly settingsRepresentative: SourceCodeProcessingConfigRepresentative<
    SourceCodeProcessingGenericProperties__Normalized.Common,
    SourceCodeProcessingGenericProperties__Normalized.EntryPointsGroup
  >;

  protected readonly onAnyEventRelatedWithActualFiles: CodeSourceFilesWatcher.EventHandlers = {};

  protected readonly onAnyRelatedFileAddedEventHandlers: CodeSourceFilesWatcher.EventHandlers = {};
  protected readonly onAnyRelatedFileUpdatedEventHandlers: CodeSourceFilesWatcher.EventHandlers = {};
  protected readonly onAnyRelatedFileDeletedEventHandlers: CodeSourceFilesWatcher.EventHandlers = {};

  protected readonly onEntryPointFileAddedEventHandlers: CodeSourceFilesWatcher.EventHandlers = {};
  protected readonly onEntryPointFileUpdatedEventHandlers: CodeSourceFilesWatcher.EventHandlers = {};
  protected readonly onEntryPointFileDeletedEventHandlers: CodeSourceFilesWatcher.EventHandlers = {};

  protected readonly onNonEntryPointFileAddedEventHandlers: CodeSourceFilesWatcher.EventHandlers = {};
  protected readonly onNonEntryPointFileUpdatedEventHandlers: CodeSourceFilesWatcher.EventHandlers = {};
  protected readonly onNonEntryPointFileDeletedEventHandlers: CodeSourceFilesWatcher.EventHandlers = {};


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
    }: CodeSourceFilesWatcher.InitializationRequirements
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

    this.LOGGER_BADGE_TEXT = `${ this.TARGET_SOURCE_FILES_TYPE__SINGULAR_FORM__CAPITALIZED } source files watcher report`;

  }


  public addOnAnyEventRelatedWithActualFilesHandler(
    { handlerID, handler }: Readonly<{ handlerID: string; handler: CodeSourceFilesWatcher.EventHandler; }>
  ): this {
    this.onAnyEventRelatedWithActualFiles[handlerID] = handler;
    return this;
  }

  public addOnAnyRelatedFileAddedEventHandler(
    { handlerID, handler }: Readonly<{ handlerID: string; handler: CodeSourceFilesWatcher.EventHandler; }>
  ): this {
    this.onAnyRelatedFileAddedEventHandlers[handlerID] = handler;
    return this;
  }

  public addOnAnyRelatedFileUpdatedEventHandler(
    { handlerID, handler }: Readonly<{ handlerID: string; handler: CodeSourceFilesWatcher.EventHandler; }>
  ): this {
    this.onAnyRelatedFileUpdatedEventHandlers[handlerID] = handler;
    return this;
  }

  public addOnAnyRelatedFileDeletedEventHandler(
    { handlerID, handler }: Readonly<{ handlerID: string; handler: CodeSourceFilesWatcher.EventHandler; }>
  ): this {
    this.onAnyRelatedFileDeletedEventHandlers[handlerID] = handler;
    return this;
  }

  public addOnEntryPointFileAddedEventHandler(
    { handlerID, handler }: Readonly<{ handlerID: string; handler: CodeSourceFilesWatcher.EventHandler; }>
  ): this {
    this.onEntryPointFileAddedEventHandlers[handlerID] = handler;
    return this;
  }

  public addOnEntryPointFileUpdatedEventHandler(
    { handlerID, handler }: Readonly<{ handlerID: string; handler: CodeSourceFilesWatcher.EventHandler; }>
  ): this {
    this.onEntryPointFileUpdatedEventHandlers[handlerID] = handler;
    return this;
  }

  public addOnEntryPointFileDeletedEventHandler(
    { handlerID, handler }: Readonly<{ handlerID: string; handler: CodeSourceFilesWatcher.EventHandler; }>
  ): this {
    this.onEntryPointFileDeletedEventHandlers[handlerID] = handler;
    return this;
  }

  public addOnNonEntryPointFileAddedEventHandler(
    { handlerID, handler }: Readonly<{ handlerID: string; handler: CodeSourceFilesWatcher.EventHandler; }>
  ): this {
    this.onNonEntryPointFileAddedEventHandlers[handlerID] = handler;
    return this;
  }

  public addOnNonEntryPointFileUpdatedEventHandler(
    { handlerID, handler }: Readonly<{ handlerID: string; handler: CodeSourceFilesWatcher.EventHandler; }>
  ): this {
    this.onNonEntryPointFileUpdatedEventHandlers[handlerID] = handler;
    return this;
  }

  public addOnNonEntryPointFileDeletedEventHandler(
    { handlerID, handler }: Readonly<{ handlerID: string; handler: CodeSourceFilesWatcher.EventHandler; }>
  ): this {
    this.onNonEntryPointFileDeletedEventHandlers[handlerID] = handler;
    return this;
  }


  public notifyAboutRelatedFileStateChange(
    targetFileAbsolutePath__forwardSlashesPathSeparators: string,
    eventName: FilesMasterWatcher.EventsNames
  ): void {

    const isTargetFileTheEntryPoint: boolean =
        this.isFileAbsolutePathOfEntryPoint(targetFileAbsolutePath__forwardSlashesPathSeparators);

    for (const handler of Object.values(this.onAnyEventRelatedWithActualFiles)) {
      handler(targetFileAbsolutePath__forwardSlashesPathSeparators);
    }


    switch (eventName) {

      case FilesMasterWatcher.EventsNames.fileAdded: {

        for (const handler of Object.values(this.onAnyRelatedFileAddedEventHandlers)) {
          handler(targetFileAbsolutePath__forwardSlashesPathSeparators);
        }

        if (isTargetFileTheEntryPoint) {

          Logger.logInfo({
            mustOutputIf: this.mustLogEvents,
            badge: { customText: this.LOGGER_BADGE_TEXT },
            title: `${ this.TARGET_SOURCE_FILES_TYPE__SINGULAR_FORM__LOWERCASE } Entry Point Source File Added`,
            description: targetFileAbsolutePath__forwardSlashesPathSeparators
          });

          for (const handler of Object.values(this.onEntryPointFileAddedEventHandlers)) {
            handler(targetFileAbsolutePath__forwardSlashesPathSeparators);
          }

        } else {

          Logger.logInfo({
            mustOutputIf: this.mustLogEvents,
            badge: { customText: this.LOGGER_BADGE_TEXT },
            title: `${ this.TARGET_SOURCE_FILES_TYPE__SINGULAR_FORM__LOWERCASE } Partial Source File Added`,
            description: targetFileAbsolutePath__forwardSlashesPathSeparators
          });

          for (const handler of Object.values(this.onNonEntryPointFileAddedEventHandlers)) {
            handler(targetFileAbsolutePath__forwardSlashesPathSeparators);
          }

        }

        break;

      }

      case FilesMasterWatcher.EventsNames.fileUpdated: {

        for (const handler of Object.values(this.onAnyRelatedFileUpdatedEventHandlers)) {
          handler(targetFileAbsolutePath__forwardSlashesPathSeparators);
        }

        if (isTargetFileTheEntryPoint) {

          Logger.logInfo({
            mustOutputIf: this.mustLogEvents,
            badge: { customText: this.LOGGER_BADGE_TEXT },
            title: `${ this.TARGET_SOURCE_FILES_TYPE__SINGULAR_FORM__CAPITALIZED } Entry Point Source File Updated`,
            description: targetFileAbsolutePath__forwardSlashesPathSeparators
          });

          for (const handler of Object.values(this.onEntryPointFileUpdatedEventHandlers)) {
            handler(targetFileAbsolutePath__forwardSlashesPathSeparators);
          }

        } else {

          Logger.logInfo({
            mustOutputIf: this.mustLogEvents,
            badge: { customText: this.LOGGER_BADGE_TEXT },
            title: `${ this.TARGET_SOURCE_FILES_TYPE__SINGULAR_FORM__CAPITALIZED } Partial Source File Updated`,
            description: targetFileAbsolutePath__forwardSlashesPathSeparators
          });

          for (const handler of Object.values(this.onNonEntryPointFileUpdatedEventHandlers)) {
            handler(targetFileAbsolutePath__forwardSlashesPathSeparators);
          }

        }

        break;

      }

      case FilesMasterWatcher.EventsNames.fileDeleted: {

        for (const handler of Object.values(this.onAnyRelatedFileDeletedEventHandlers)) {
          handler(targetFileAbsolutePath__forwardSlashesPathSeparators);
        }

        if (isTargetFileTheEntryPoint) {

          Logger.logInfo({
            mustOutputIf: this.mustLogEvents,
            badge: { customText: this.LOGGER_BADGE_TEXT },
            title: `${ this.TARGET_SOURCE_FILES_TYPE__SINGULAR_FORM__CAPITALIZED } Entry Point Source File Deleted`,
            description: targetFileAbsolutePath__forwardSlashesPathSeparators
          });

          for (const handler of Object.values(this.onEntryPointFileDeletedEventHandlers)) {
            handler(targetFileAbsolutePath__forwardSlashesPathSeparators);
          }

        } else {

          Logger.logInfo({
            mustOutputIf: this.mustLogEvents,
            badge: { customText: this.LOGGER_BADGE_TEXT },
            title: `${ this.TARGET_SOURCE_FILES_TYPE__SINGULAR_FORM__CAPITALIZED } Partial Source File Deleted`,
            description: targetFileAbsolutePath__forwardSlashesPathSeparators
          });

          for (const handler of Object.values(this.onNonEntryPointFileDeletedEventHandlers)) {
            handler(targetFileAbsolutePath__forwardSlashesPathSeparators);
          }

        }

      }

    }

  }

  private isFileAbsolutePathOfEntryPoint(targetFileAbsolutePath__forwardSlashesPathSeparators: string): boolean {
    return this.settingsRepresentative.isEntryPoint(targetFileAbsolutePath__forwardSlashesPathSeparators);
  }

}


namespace CodeSourceFilesWatcher {

  export type InitializationRequirements =
      Pick<FilesPassiveWatcher.InitializationRequirements, "ID" | "mustLogEvents"> &
      Readonly<{
        projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
        targetFilesNamesExtensionsWithoutLeadingDots: ReadonlyArray<string>;
        outputFilesGlobSelectors: ReadonlyArray<string>;
        targetSourceFilesType__singularForm: string;
      }>;

  export type EventHandler = (targetFileAbsolutePath: string) => unknown;

  export type EventHandlers = { [ID: string]: EventHandler; };

}


export default CodeSourceFilesWatcher;
