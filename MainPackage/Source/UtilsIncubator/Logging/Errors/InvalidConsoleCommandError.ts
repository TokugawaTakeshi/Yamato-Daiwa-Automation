import InvalidConsoleCommandErrorLocalization__English from "./InvalidConsoleCommandErrorLocalization__English";


class InvalidConsoleCommandError extends Error {

  public static readonly NAME: string = "InvalidConsoleCommandError";
  public static get DEFAULT_TITLE(): string {
    return InvalidConsoleCommandError.localization.defaultTitle;
  }

  public static localization: InvalidConsoleCommandError.Localization = InvalidConsoleCommandErrorLocalization__English;


  public constructor(namedParameters: InvalidConsoleCommandError.ConstructorNamedParameters) {

    super();

    this.name = InvalidConsoleCommandError.NAME;

    if ("customMessage" in namedParameters) {
      this.message = namedParameters.customMessage;
    } else {
      this.message = InvalidConsoleCommandError.localization.generateDescription(namedParameters);
    }
  }
}


namespace InvalidConsoleCommandError {

  export type ConstructorNamedParameters = Localization.DescriptionTemplateNamedParameters | { customMessage: string; };

  export type Localization = {
    readonly defaultTitle: string;
    readonly generateDescription: (
      parametersObject: Localization.DescriptionTemplateNamedParameters
    ) => string;
  };

  export namespace Localization {
    export type DescriptionTemplateNamedParameters = {
      applicationName: string;
      messageSpecificPart?: string;
    };
  }
}


export default InvalidConsoleCommandError;
