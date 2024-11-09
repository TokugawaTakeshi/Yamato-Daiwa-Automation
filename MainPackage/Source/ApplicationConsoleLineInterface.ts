/* ─── Defaults ───────────────────────────────────────────────────────────────────────────────────────────────────── */
import CONFIGURATION_FILE_DEFAULT_NAME_WITH_EXTENSION from
    "@ProjectBuilding/Common/Defaults/CONFIGURATION_FILE_DEFAULT_NAME_WITH_EXTENSION";

/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import ConsumingProjectBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import { ConsoleCommandsParser } from "@yamato-daiwa/es-extensions-nodejs";


namespace ApplicationConsoleLineInterface {

  export enum CommandPhrases {
    projectBuilding = "build",
    referenceGenerating = "help"
  }

  export const specification: ConsoleCommandsParser.CommandLineInterfaceSpecification = {
    applicationName: "Yamato Daiwa Automation",
    applicationDescription: "The high-level project building tool.",
    commandPhrases: {

      [CommandPhrases.projectBuilding]: {
        description:
            "Builds the projects according to the configuration file " +
              `("${ CONFIGURATION_FILE_DEFAULT_NAME_WITH_EXTENSION }" as default).`,
        isDefault: true,
        options: {
          mode: {
            newName: "projectBuildingMode",
            description:
                "The project building mode; affects to presence or absence of incremental building, " +
                  "browser live reloading, code minification etc.",
            type: ConsoleCommandsParser.ParametersTypes.string,
            required: true,
            shortcut: "m",
            allowedAlternatives: Object.values(ConsumingProjectBuildingModes)
          },
          configurationFile: {
            description:
                "Custom name of the configuration file (the default one is " +
                  `"${ CONFIGURATION_FILE_DEFAULT_NAME_WITH_EXTENSION }")`,
            newName: "customConfigurationFileName__possiblyWithoutExtension",
            type: ConsoleCommandsParser.ParametersTypes.string,
            required: false
          },
          selectiveExecution: {
            newName: "selectiveExecutionID",
            description:
                "Allows to specify the selection of tasks, entry points groups, etc. by selective execution ID, " +
                  "herewith the desired selective execution must be preliminarily defined in the configuration file.",
            type: ConsoleCommandsParser.ParametersTypes.string,
            required: false
          }
        }
      },

      [CommandPhrases.referenceGenerating]: {}

    }
  };

  export type SupportedCommandsAndParametersCombinations =
      ProjectBuildingConsoleCommand |
      ReferenceGeneratingConsoleCommand;

  export type ProjectBuildingConsoleCommand = {
    phrase: CommandPhrases.projectBuilding;
    projectBuildingMode: ConsumingProjectBuildingModes;
    customConfigurationFileName__possiblyWithoutExtension?: string;
    selectiveExecutionID?: string;
  };

  export type ReferenceGeneratingConsoleCommand = {
    phrase: CommandPhrases.referenceGenerating;
  };

}


export default ApplicationConsoleLineInterface;
