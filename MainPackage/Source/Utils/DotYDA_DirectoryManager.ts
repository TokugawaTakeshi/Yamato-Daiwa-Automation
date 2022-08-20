import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";
import FileSystem from "fs";
import {
  Logger,
  ClassRedundantSubsequentInitializationError,
  isNotNull,
  isNull,
  ClassRequiredInitializationHasNotBeenExecutedError
} from "@yamato-daiwa/es-extensions";


export default class DotYDA_DirectoryManager {

  private static readonly DOT_YDA_DIRECTORY_NAME: string = ".yda";
  private static readonly TEMPORARY_FILES_SUBDIRECTORY_NAME: string = "Temporary";
  private static readonly OPTIMIZATION_FILES_SUBDIRECTORY_NAME: string = "Optimizations";
  private static readonly GIT_IGNORE_FILE_NAME: string = ".gitignore";

  private static selfSoleInstance: DotYDA_DirectoryManager | null = null;

  readonly #DOT_YDA_DIRECTORY_ABSOLUTE_PATH: string;
  readonly #TEMPORARY_FILES_DIRECTORY_ABSOLUTE_PATH: string;
  readonly #OPTIMIZATION_FILES_DIRECTORY_ABSOLUTE_PATH: string;
  readonly #GIT_IGNORE_FILE_ABSOLUTE_PATH: string;

  private readonly CONSUMING_PROJECT_ROOT_DIRECTORY_ABSOLUTE_PATH: string;


  public static unrollDotYDA_Directory(consumingProjectRootDirectoryAbsolutePath: string): void {

    if (isNotNull(DotYDA_DirectoryManager.selfSoleInstance)) {
      Logger.throwErrorAndLog({
        errorInstance: new ClassRedundantSubsequentInitializationError({ className: "DotYDA_DirectoryManager" }),
        title: ClassRedundantSubsequentInitializationError.localization.defaultTitle,
        occurrenceLocation: "DotYDA_DirectoryManager.unrollDotYDA_Directory(consumingProjectRootDirectoryAbsolutePath)"
      });
    }


    const selfSoleInstance: DotYDA_DirectoryManager = new DotYDA_DirectoryManager(consumingProjectRootDirectoryAbsolutePath);

    if (!FileSystem.existsSync(selfSoleInstance.#DOT_YDA_DIRECTORY_ABSOLUTE_PATH)) {
      FileSystem.mkdirSync(selfSoleInstance.#DOT_YDA_DIRECTORY_ABSOLUTE_PATH);
    }

    if (!FileSystem.existsSync(selfSoleInstance.#TEMPORARY_FILES_DIRECTORY_ABSOLUTE_PATH)) {
      FileSystem.mkdirSync(selfSoleInstance.#TEMPORARY_FILES_DIRECTORY_ABSOLUTE_PATH);
    }

    if (!FileSystem.existsSync(selfSoleInstance.#OPTIMIZATION_FILES_DIRECTORY_ABSOLUTE_PATH)) {
      FileSystem.mkdirSync(selfSoleInstance.#OPTIMIZATION_FILES_DIRECTORY_ABSOLUTE_PATH);
    }

    if (!FileSystem.existsSync(selfSoleInstance.#GIT_IGNORE_FILE_ABSOLUTE_PATH)) {
      FileSystem.writeFileSync(
        selfSoleInstance.#GIT_IGNORE_FILE_ABSOLUTE_PATH,
        `/${ DotYDA_DirectoryManager.TEMPORARY_FILES_SUBDIRECTORY_NAME }/`
      );
    }

    DotYDA_DirectoryManager.selfSoleInstance = selfSoleInstance;
  }


  private constructor(consumingProjectRootDirectoryAbsolutePath: string) {

    this.CONSUMING_PROJECT_ROOT_DIRECTORY_ABSOLUTE_PATH = consumingProjectRootDirectoryAbsolutePath;
    this.#DOT_YDA_DIRECTORY_ABSOLUTE_PATH = ImprovedPath.joinPathSegments(
      [ this.CONSUMING_PROJECT_ROOT_DIRECTORY_ABSOLUTE_PATH, DotYDA_DirectoryManager.DOT_YDA_DIRECTORY_NAME ],
      { forwardSlashOnlySeparators: true }
    );

    this.#TEMPORARY_FILES_DIRECTORY_ABSOLUTE_PATH = ImprovedPath.joinPathSegments(
      [ this.#DOT_YDA_DIRECTORY_ABSOLUTE_PATH, DotYDA_DirectoryManager.TEMPORARY_FILES_SUBDIRECTORY_NAME ],
      { forwardSlashOnlySeparators: true }
    );

    this.#OPTIMIZATION_FILES_DIRECTORY_ABSOLUTE_PATH = ImprovedPath.joinPathSegments(
      [ this.#DOT_YDA_DIRECTORY_ABSOLUTE_PATH, DotYDA_DirectoryManager.OPTIMIZATION_FILES_SUBDIRECTORY_NAME ],
      { forwardSlashOnlySeparators: true }
    );

    this.#GIT_IGNORE_FILE_ABSOLUTE_PATH = ImprovedPath.joinPathSegments(
      [ this.#DOT_YDA_DIRECTORY_ABSOLUTE_PATH, DotYDA_DirectoryManager.GIT_IGNORE_FILE_NAME ],
      { forwardSlashOnlySeparators: true }
    );
  }


  public static get DOT_YDA_DIRECTORY_ABSOLUTE_PATH(): string {
    return DotYDA_DirectoryManager.getExpectedToBeInitializedSelfSoleInstance().#DOT_YDA_DIRECTORY_ABSOLUTE_PATH;
  }

  public static get TEMPORARY_FILES_DIRECTORY_ABSOLUTE_PATH(): string {
    return DotYDA_DirectoryManager.getExpectedToBeInitializedSelfSoleInstance().#TEMPORARY_FILES_DIRECTORY_ABSOLUTE_PATH;
  }

  public static get OPTIMIZATION_FILES_DIRECTORY_ABSOLUTE_PATH(): string {
    return DotYDA_DirectoryManager.getExpectedToBeInitializedSelfSoleInstance().#OPTIMIZATION_FILES_DIRECTORY_ABSOLUTE_PATH;
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
