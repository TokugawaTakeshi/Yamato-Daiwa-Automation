import ConsumingProjectPreDefinedBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectPreDefinedBuildingModes";
import { ConsoleCommandsParser } from "@yamato-daiwa/es-extensions-nodejs";


namespace ApplicationConsoleLineInterface {

  export enum CommandPhrases {
    buildProject = "build",
    deployProject = "deployProject"
  }

  export const specification: ConsoleCommandsParser.CommandLineInterfaceSpecification = {
    applicationName: "Yamato Daiwa Automation",
    commandPhrases: {
      [CommandPhrases.buildProject]: {
        mode: {
          newName: "projectBuildingMode",
          type: ConsoleCommandsParser.ParametersTypes.string,
          required: true,
          shortcut: "m",
          allowedAlternatives: Object.values(ConsumingProjectPreDefinedBuildingModes)
        },
        configurationFile: {
          newName: "customConfigurationFileName__possiblyWithoutExtension",
          type: ConsoleCommandsParser.ParametersTypes.string,
          required: false
        },
        selectiveExecution: {
          newName: "selectiveExecutionID",
          type: ConsoleCommandsParser.ParametersTypes.string,
          required: false
        }
      }
    }
  };

  export type SupportedCommandsAndParametersCombinations = BuildProjectConsoleCommand | DeployProjectConsoleCommand;

  export type BuildProjectConsoleCommand = {
    phrase: CommandPhrases.buildProject;
    projectBuildingMode: ConsumingProjectPreDefinedBuildingModes;
    customConfigurationFileName__possiblyWithoutExtension?: string;
    selectiveExecutionID?: string;
  };

  export type DeployProjectConsoleCommand = {
    phrase: CommandPhrases.deployProject;
  };
}


export default ApplicationConsoleLineInterface;
