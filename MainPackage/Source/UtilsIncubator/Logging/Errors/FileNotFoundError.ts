import FileNotFoundErrorLocalization__English from
    "@UtilsIncubator/Logging/Errors/FileNotFoundErrorLocalization.english";


class FileNotFoundError extends Error {

  public static readonly NAME: string = "FileNotFoundError";
  public static get DEFAULT_TITLE(): string {
    return FileNotFoundError.localization.defaultTitle;
  }

  public static localization: FileNotFoundError.Localization = FileNotFoundErrorLocalization__English;


  public constructor(namedParameters: FileNotFoundError.ConstructorNamedParameters) {

    super();

    this.name = FileNotFoundError.NAME;

    if ("customMessage" in namedParameters) {
      this.message = namedParameters.customMessage;
    } else {
      this.message = FileNotFoundError.localization.genericDescription(namedParameters);
    }
  }
}


namespace FileNotFoundError {

  export type ConstructorNamedParameters = Localization.DescriptionTemplateNamedParameters | { customMessage: string; };

  export type Localization = {
    readonly defaultTitle: string;
    readonly genericDescription: (
      parametersObject: Localization.DescriptionTemplateNamedParameters
    ) => string;
  };

  export namespace Localization {
    export type DescriptionTemplateNamedParameters = {
      filePath: string;
      messageSpecificPart?: string;
    };
  }
}


export default FileNotFoundError;
