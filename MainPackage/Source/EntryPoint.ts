/* --- Defaults ----------------------------------------------------------------------------------------------------- */
import CONFIG_FILE_DEFAULT_NAME_WITH_EXTENSION from
    "@ProjectBuilding/Common/Defaults/CONFIG_FILE_DEFAULT_NAME_WITH_EXTENSION";

/* --- Console line interface --------------------------------------------------------------------------------------- */
import ApplicationConsoleLineInterface from "./ApplicationConsoleLineInterface";

/* --- Scenarios ---------------------------------------------------------------------------------------------------- */
import ProjectBuilder from "./ProjectBuilder";

/* --- Applied utils ------------------------------------------------------------------------------------------------ */
import DotYDA_DirectoryManager from "@Utils/DotYDA_DirectoryManager";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import {
  Logger,
  FileReadingFailedError,
  PoliteErrorsMessagesBuilder
} from "@yamato-daiwa/es-extensions";
import {
  ConsoleApplicationLogger,
  ConsoleCommandsParser,
  ObjectDataFilesProcessor
} from "@yamato-daiwa/es-extensions-nodejs";
import Path from "path";


export default abstract class EntryPoint {

  static {
    Logger.setImplementation(ConsoleApplicationLogger);
    PoliteErrorsMessagesBuilder.setDefaultBugTrackerURI("https://github.com/TokugawaTakeshi/Yamato-Daiwa-Automation/issues");
  }


  public static interpretAndExecuteConsoleCommand(rawConsoleCommand: Array<string>): void {

    /* [ Theory ] The global constant "__IS_DEVELOPMENT_BUILDING_MODE__" is not available in above static block. */
    PoliteErrorsMessagesBuilder.setTechnicalDetailsOnlyModeIf(__IS_DEVELOPMENT_BUILDING_MODE__);

    const parsedConsoleCommand: ConsoleCommandsParser.
        ParsedCommand<ApplicationConsoleLineInterface.SupportedCommandsAndParametersCombinations> =
            ConsoleCommandsParser.parse(ApplicationConsoleLineInterface.specification, rawConsoleCommand);

    const consumingProjectRootDirectoryAbsolutePath: string = process.cwd();
    DotYDA_DirectoryManager.unrollDotYDA_Directory(consumingProjectRootDirectoryAbsolutePath);

    switch (parsedConsoleCommand.phrase) {

      case ApplicationConsoleLineInterface.CommandPhrases.buildProject: {

        const rawConfigFileAbsolutePath: string = Path.resolve(
          consumingProjectRootDirectoryAbsolutePath, CONFIG_FILE_DEFAULT_NAME_WITH_EXTENSION
        );

        /* [ Approach ] The validation is scenario-dependent thus will be executed later. */
        let rawConfigFromFile: unknown;

        try {

          rawConfigFromFile = ObjectDataFilesProcessor.processFile({
            filePath: rawConfigFileAbsolutePath,
            synchronously: true
          });

        } catch (error: unknown) {

          Logger.throwErrorAndLog({
            errorInstance: new FileReadingFailedError({
              customMessage:
                  "The configuration file for \"Yamato Daiwa Automation\" utility not found at path " +
                  `"${ rawConfigFileAbsolutePath }". ` +
                  "The \"Yamato Daiwa Automation\" utility is required the configuration file and will expect the " +
                  `file "${ CONFIG_FILE_DEFAULT_NAME_WITH_EXTENSION }" at the same directory as CLI has been invoked. ` +
                  "You can set custom configuration file name via CLI if you want."
            }),
            title: FileReadingFailedError.localization.defaultTitle,
            occurrenceLocation: "EntryPoint.interpretAndExecuteConsoleCommand()",
            innerError: error
          });

        }

        ProjectBuilder.buildProject({
          consumingProjectRootDirectoryAbsolutePath,
          projectBuildingConfig__fromConsole: {
            projectBuildingMode: parsedConsoleCommand.projectBuildingMode,
            selectiveExecutionID: parsedConsoleCommand.selectiveExecutionID
          },
          rawConfigFromFile
        });

        break;
      }

      case ApplicationConsoleLineInterface.CommandPhrases.deployProject: {

        Logger.logWarning({
          title: "Not implemented yet",
          description: "This functionality has not been implemented yet."
        });

      }

    }
  }

}
