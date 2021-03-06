import type InvalidConsoleCommandError from "./InvalidConsoleCommandError";
import { insertSubstring } from "@yamato-daiwa/es-extensions";


const InvalidConsoleCommandErrorLocalization__English: InvalidConsoleCommandError.Localization = {
  defaultTitle: "Invalid console command",
  generateDescription:
    (parametersObject: InvalidConsoleCommandError.Localization.DescriptionTemplateNamedParameters): string =>
        `Invalid console command for the application '${ parametersObject.applicationName }'` +
        `${ insertSubstring(parametersObject.messageSpecificPart, {
          modifier: (messageSpecificPart: string): string => `\n${ messageSpecificPart }`
        }) }`

};


export default InvalidConsoleCommandErrorLocalization__English;
