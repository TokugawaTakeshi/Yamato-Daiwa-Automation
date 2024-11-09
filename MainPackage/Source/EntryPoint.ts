/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import BUG_TRACKER_URI from "@ProjectBuilding/Common/Restrictions/BUG_TRACKER_URI";

/* ─── Defaults ───────────────────────────────────────────────────────────────────────────────────────────────────── */
import CONFIGURATION_FILE_DEFAULT_NAME_WITH_EXTENSION from
      "@ProjectBuilding/Common/Defaults/CONFIGURATION_FILE_DEFAULT_NAME_WITH_EXTENSION";

/* ─── Console List Interface ─────────────────────────────────────────────────────────────────────────────────────── */
import ApplicationConsoleLineInterface from "./ApplicationConsoleLineInterface";

/* ─── Scenarios ──────────────────────────────────────────────────────────────────────────────────────────────────── */
import ProjectBuilder from "./ProjectBuilder";

/* ─── Applied Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import DotYDA_DirectoryManager from "@Utils/DotYDA_DirectoryManager";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import {
  Logger,
  FileReadingFailedError,
  PoliteErrorsMessagesBuilder
} from "@yamato-daiwa/es-extensions";
import {
  ConsoleApplicationLogger,
  ConsoleCommandsParser,
  FileNotFoundError,
  ObjectDataFilesProcessor
} from "@yamato-daiwa/es-extensions-nodejs";
import Path from "path";


export default abstract class EntryPoint {

  static {

    Logger.setImplementation(ConsoleApplicationLogger);

    PoliteErrorsMessagesBuilder.setDefaultBugTrackerURI(BUG_TRACKER_URI);

    EntryPoint.interpretAndExecuteConsoleCommand();

  }


  public static interpretAndExecuteConsoleCommand(): void {

    /* [ Theory ] The global constant `__IS_DEVELOPMENT_BUILDING_MODE__` is not available in above static block. */
    PoliteErrorsMessagesBuilder.setTechnicalDetailsOnlyModeIf(__IS_DEVELOPMENT_BUILDING_MODE__);

    const parsedConsoleCommand: ConsoleCommandsParser.
        ParsedCommand<ApplicationConsoleLineInterface.SupportedCommandsAndParametersCombinations> =
            ConsoleCommandsParser.parse(ApplicationConsoleLineInterface.specification);

    const consumingProjectRootDirectoryAbsolutePath: string = process.cwd();
    DotYDA_DirectoryManager.unrollDotYDA_Directory(consumingProjectRootDirectoryAbsolutePath);

    switch (parsedConsoleCommand.phrase) {

      case ApplicationConsoleLineInterface.CommandPhrases.projectBuilding: {

        const rawConfigFileAbsolutePath: string = Path.resolve(
          consumingProjectRootDirectoryAbsolutePath, CONFIGURATION_FILE_DEFAULT_NAME_WITH_EXTENSION
        );

        /* [ Approach ] The validation is scenario-dependent thus will be executed later. */
        let rawConfigFromFile: unknown;

        try {

          rawConfigFromFile = ObjectDataFilesProcessor.processFile({
            filePath: rawConfigFileAbsolutePath,
            synchronously: true
          });

        } catch (error: unknown) {

          if (error instanceof FileNotFoundError) {
            Logger.throwErrorAndLog({
              errorInstance: new FileNotFoundError({
                customMessage:
                    "The configuration file for \"Yamato Daiwa Automation\" utility not found at path " +
                      `"${ rawConfigFileAbsolutePath }". ` +
                    "The \"Yamato Daiwa Automation\" utility is required the configuration file and will expect the " +
                      `file "${ CONFIGURATION_FILE_DEFAULT_NAME_WITH_EXTENSION }" at the same directory as CLI has ` +
                      "been invoked. " +
                    "You can set custom configuration file name via CLI if you want."
              }),
              title: FileNotFoundError.localization.defaultTitle,
              occurrenceLocation: "EntryPoint.interpretAndExecuteConsoleCommand()",
              innerError: error
            });
          }


          Logger.throwErrorAndLog({
            errorInstance: new FileReadingFailedError({
              customMessage:
                  "The configuration file for \"Yamato Daiwa Automation\" utility not found at path " +
                    `"${ rawConfigFileAbsolutePath }". ` +
                  "The \"Yamato Daiwa Automation\" utility is required the configuration file and will expect the " +
                    `file "${ CONFIGURATION_FILE_DEFAULT_NAME_WITH_EXTENSION }" at the same directory as CLI has ` +
                    "been invoked. " +
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

      case ApplicationConsoleLineInterface.CommandPhrases.referenceGenerating: {

        Logger.logInfo({
          title: "Yamato Daiwa Automation",
          description: ConsoleCommandsParser.generateFullHelpReference(ApplicationConsoleLineInterface.specification)
        });

      }

    }
  }

}
