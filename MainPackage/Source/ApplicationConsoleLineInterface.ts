import ConsumingProjectBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";
import { ConsoleCommandsParser } from "@yamato-daiwa/es-extensions-nodejs";


namespace ApplicationConsoleLineInterface {

  export enum CommandPhrases {
    buildProject = "build",
    deployProject = "deployProject"
  }

  export const specification: ConsoleCommandsParser.CommandLineInterfaceSpecification = {
    applicationName: "Yamato Daiwa Automation",
    applicationDescription: "The project building tool.",
    commandPhrases: {
      [CommandPhrases.buildProject]: {
        description: "Builds the projects according to configuration file (\"yda.config.yaml\" as default).",
        options: {
          mode: {
            newName: "projectBuildingMode",
            description: "The project building mode; affects to presence or absence of incremental building, " +
                "browser reloading, code minification etc.",
            type: ConsoleCommandsParser.ParametersTypes.string,
            required: true,
            shortcut: "m",
            allowedAlternatives: Object.values(ConsumingProjectBuildingModes)
          },
          configurationFile: {
            description: "Custom name of the configuration file (\"yda.config.yaml\" is the default)",
            newName: "customConfigurationFileName__possiblyWithoutExtension",
            type: ConsoleCommandsParser.ParametersTypes.string,
            required: false
          },
          selectiveExecution: {
            newName: "selectiveExecutionID",
            description: "Allows to specify the selection of tasks, entry points groups, etc., herewith the " +
                "specified selection execution ID must be preliminarily defined in the configuration file.",
            type: ConsoleCommandsParser.ParametersTypes.string,
            required: false
          }
        }
      }
    }
  };

  export type SupportedCommandsAndParametersCombinations = BuildProjectConsoleCommand | DeployProjectConsoleCommand;

  export type BuildProjectConsoleCommand = {
    phrase: CommandPhrases.buildProject;
    projectBuildingMode: ConsumingProjectBuildingModes;
    customConfigurationFileName__possiblyWithoutExtension?: string;
    selectiveExecutionID?: string;
  };

  export type DeployProjectConsoleCommand = {
    phrase: CommandPhrases.deployProject;
  };

}


export default ApplicationConsoleLineInterface;
