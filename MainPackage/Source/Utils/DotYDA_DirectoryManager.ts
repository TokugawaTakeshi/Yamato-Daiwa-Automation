import packageJSON_Metadata from "./../../package.json";
import FileSystem from "fs";
import {
  Logger,
  ClassRedundantSubsequentInitializationError,
  ClassRequiredInitializationHasNotBeenExecutedError,
  isNull
} from "@yamato-daiwa/es-extensions";
import {
  ImprovedFileSystem,
  ImprovedPath
} from "@yamato-daiwa/es-extensions-nodejs";


export default class DotYDA_DirectoryManager {

  private static readonly DOT_YDA_DIRECTORY_NAME: string = ".yda";
  private static readonly TEMPORARY_FILES_SUBDIRECTORY_NAME: string = "Temporary";
  private static readonly OPTIMIZATION_FILES_SUBDIRECTORY_NAME: string = "Optimizations";
  private static readonly GIT_IGNORE_FILE_NAME: string = ".gitignore";
  private static readonly DOT_VERSION_FILE_NAME: string = ".version";

  private static readonly CURRENT_YDA_VERSION: string = packageJSON_Metadata.version;

  private static selfSoleInstance: DotYDA_DirectoryManager | null = null;

  private readonly DOT_YDA_DIRECTORY_ABSOLUTE_PATH: string;
  private readonly TEMPORARY_FILES_DIRECTORY_ABSOLUTE_PATH: string;
  private readonly OPTIMIZATION_FILES_DIRECTORY_ABSOLUTE_PATH: string;
  private readonly GIT_IGNORE_FILE_ABSOLUTE_PATH: string;
  private readonly DOT_VERSION_FILE_ABSOLUTE_PATH: string;

  private readonly CONSUMING_PROJECT_ROOT_DIRECTORY_ABSOLUTE_PATH: string;


  public static unrollDotYDA_Directory(consumingProjectRootDirectoryAbsolutePath: string): void {

    let selfSoleInstance: DotYDA_DirectoryManager;

    if (isNull(DotYDA_DirectoryManager.selfSoleInstance)) {

      selfSoleInstance = new DotYDA_DirectoryManager(consumingProjectRootDirectoryAbsolutePath);
      DotYDA_DirectoryManager.selfSoleInstance = selfSoleInstance;

    } else {

      Logger.logError({
        errorType: ClassRedundantSubsequentInitializationError.NAME,
        title: ClassRedundantSubsequentInitializationError.localization.defaultTitle,
        description: ClassRedundantSubsequentInitializationError.localization.
            generateDescription({ className: "DotYDA_DirectoryManager" }),
        occurrenceLocation: "DotYDA_DirectoryManager.unrollDotYDA_Directory(consumingProjectRootDirectoryAbsolutePath)"
      });

      selfSoleInstance = DotYDA_DirectoryManager.selfSoleInstance;

    }


    if (!FileSystem.existsSync(selfSoleInstance.DOT_YDA_DIRECTORY_ABSOLUTE_PATH)) {
      selfSoleInstance.unrollDotYDA_DirectoryScratch();
      return;
    }


    let YDA_VersionActualForDotYDA_Directory: string;


    try {

      YDA_VersionActualForDotYDA_Directory = FileSystem.
          readFileSync(selfSoleInstance.DOT_VERSION_FILE_ABSOLUTE_PATH, "utf-8").
          trim();

    } catch {

      ImprovedFileSystem.removeDirectoryWithFiles({
        targetPath: selfSoleInstance.DOT_YDA_DIRECTORY_ABSOLUTE_PATH,
        mustThrowErrorIfOneOrMoreFilesCouldNotBeDeleted: false
      });

      selfSoleInstance.unrollDotYDA_DirectoryScratch();

      return;

    }


    if (YDA_VersionActualForDotYDA_Directory !== DotYDA_DirectoryManager.CURRENT_YDA_VERSION) {

      ImprovedFileSystem.removeDirectoryWithFiles({
        targetPath: selfSoleInstance.DOT_YDA_DIRECTORY_ABSOLUTE_PATH,
        mustThrowErrorIfOneOrMoreFilesCouldNotBeDeleted: false
      });

      selfSoleInstance.unrollDotYDA_DirectoryScratch();

    }

  }


  private constructor(consumingProjectRootDirectoryAbsolutePath: string) {

    this.CONSUMING_PROJECT_ROOT_DIRECTORY_ABSOLUTE_PATH = consumingProjectRootDirectoryAbsolutePath;
    this.DOT_YDA_DIRECTORY_ABSOLUTE_PATH = ImprovedPath.joinPathSegments(
      [ this.CONSUMING_PROJECT_ROOT_DIRECTORY_ABSOLUTE_PATH, DotYDA_DirectoryManager.DOT_YDA_DIRECTORY_NAME ],
      { alwaysForwardSlashSeparators: true }
    );

    this.TEMPORARY_FILES_DIRECTORY_ABSOLUTE_PATH = ImprovedPath.joinPathSegments(
      [ this.DOT_YDA_DIRECTORY_ABSOLUTE_PATH, DotYDA_DirectoryManager.TEMPORARY_FILES_SUBDIRECTORY_NAME ],
      { alwaysForwardSlashSeparators: true }
    );

    this.OPTIMIZATION_FILES_DIRECTORY_ABSOLUTE_PATH = ImprovedPath.joinPathSegments(
      [ this.DOT_YDA_DIRECTORY_ABSOLUTE_PATH, DotYDA_DirectoryManager.OPTIMIZATION_FILES_SUBDIRECTORY_NAME ],
      { alwaysForwardSlashSeparators: true }
    );

    this.GIT_IGNORE_FILE_ABSOLUTE_PATH = ImprovedPath.joinPathSegments(
      [ this.DOT_YDA_DIRECTORY_ABSOLUTE_PATH, DotYDA_DirectoryManager.GIT_IGNORE_FILE_NAME ],
      { alwaysForwardSlashSeparators: true }
    );

    this.DOT_VERSION_FILE_ABSOLUTE_PATH = ImprovedPath.joinPathSegments(
      [ this.DOT_YDA_DIRECTORY_ABSOLUTE_PATH, DotYDA_DirectoryManager.DOT_VERSION_FILE_NAME ],
      { alwaysForwardSlashSeparators: true }
    );

  }


  public static get DOT_YDA_DIRECTORY_ABSOLUTE_PATH(): string {
    return DotYDA_DirectoryManager.getExpectedToBeInitializedSelfSoleInstance().DOT_YDA_DIRECTORY_ABSOLUTE_PATH;
  }

  public static get TEMPORARY_FILES_DIRECTORY_ABSOLUTE_PATH(): string {
    return DotYDA_DirectoryManager.getExpectedToBeInitializedSelfSoleInstance().TEMPORARY_FILES_DIRECTORY_ABSOLUTE_PATH;
  }

  public static get OPTIMIZATION_FILES_DIRECTORY_ABSOLUTE_PATH(): string {
    return DotYDA_DirectoryManager.getExpectedToBeInitializedSelfSoleInstance().OPTIMIZATION_FILES_DIRECTORY_ABSOLUTE_PATH;
  }


  private unrollDotYDA_DirectoryScratch(): void {

    FileSystem.mkdirSync(this.DOT_YDA_DIRECTORY_ABSOLUTE_PATH);
    FileSystem.mkdirSync(this.TEMPORARY_FILES_DIRECTORY_ABSOLUTE_PATH);
    FileSystem.mkdirSync(this.OPTIMIZATION_FILES_DIRECTORY_ABSOLUTE_PATH);

    FileSystem.writeFileSync(
      this.GIT_IGNORE_FILE_ABSOLUTE_PATH,
      `/${ DotYDA_DirectoryManager.TEMPORARY_FILES_SUBDIRECTORY_NAME }/`
    );

    FileSystem.writeFileSync(
      this.DOT_VERSION_FILE_ABSOLUTE_PATH,
      DotYDA_DirectoryManager.CURRENT_YDA_VERSION
    );

  }


  private static getExpectedToBeInitializedSelfSoleInstance(): DotYDA_DirectoryManager {

    if (isNull(DotYDA_DirectoryManager.selfSoleInstance)) {
      Logger.throwErrorAndLog({

        errorInstance: new ClassRequiredInitializationHasNotBeenExecutedError({
          className: "DotYDA_DirectoryManager", initializingMethodName: "unrollDotYDA_Directory"
        }),
        title: ClassRequiredInitializationHasNotBeenExecutedError.localization.defaultTitle,
        occurrenceLocation: "DotYDA_DirectoryManager.getExpectedToBeInitializedSelfSoleInstance()"
      });
    }


    return DotYDA_DirectoryManager.selfSoleInstance;

  }

}
