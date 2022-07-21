/* --- Defaults ----------------------------------------------------------------------------------------------------- */
import CONFIG_FILE_DEFAULT_NAME_WITH_EXTENSION from
    "@ProjectBuilding/Common/Defaults/CONFIG_FILE_DEFAULT_NAME_WITH_EXTENSION";

/* --- Console line interface --------------------------------------------------------------------------------------- */
import ApplicationConsoleLineInterface from "./ApplicationConsoleLineInterface";

/* --- Scenarios ---------------------------------------------------------------------------------------------------- */
import ProjectBuilder from "./ProjectBuilder";

/* --- Applied utils ------------------------------------------------------------------------------------------------ */
import PoliteErrorsMessagesBuilder from "./Utils/PoliteErrorsMessagesBuilder";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import { Logger, FileReadingFailedError } from "@yamato-daiwa/es-extensions";
import { ConsoleApplicationLogger, ConsoleCommandsParser } from "@yamato-daiwa/es-extensions-nodejs";
import Path from "path";
import YAML from "yamljs";


export default abstract class EntryPoint {

  public static interpretAndExecuteConsoleCommand(rawConsoleCommand: Array<string>): void {

    const parsedConsoleCommand: ConsoleCommandsParser.
        ParsedCommand<ApplicationConsoleLineInterface.SupportedCommandsAndParametersCombinations> =
            ConsoleCommandsParser.parse(rawConsoleCommand, ApplicationConsoleLineInterface.specification);

    if (__IS_DEVELOPMENT_BUILDING_MODE__) {
      PoliteErrorsMessagesBuilder.setTechnicalDetailsOnlyMode();
    }


    switch (parsedConsoleCommand.phrase) {

      case ApplicationConsoleLineInterface.CommandPhrases.buildProject: {

        const consumingProjectRootDirectoryAbsolutePath: string = process.cwd();
        const rawConfigFileAbsolutePath: string = Path.resolve(
          consumingProjectRootDirectoryAbsolutePath, CONFIG_FILE_DEFAULT_NAME_WITH_EXTENSION
        );

        let rawConfigFromFile: unknown;

        try {

          rawConfigFromFile = YAML.load(rawConfigFileAbsolutePath);

        } catch (error: unknown) {

          Logger.throwErrorAndLog({
            errorInstance: new FileReadingFailedError({
              customMessage: `Config file not found at: ${ rawConfigFileAbsolutePath }`
            }),
            title: FileReadingFailedError.localization.defaultTitle,
            occurrenceLocation: "EntryPoint.interpretAndExecuteConsoleCommand()",
            wrappableError: error
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

  static {
    Logger.setImplementation(ConsoleApplicationLogger);
  }
}
