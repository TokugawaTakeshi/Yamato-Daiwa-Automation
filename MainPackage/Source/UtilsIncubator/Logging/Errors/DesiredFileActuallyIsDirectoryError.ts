import DesiredFileActuallyIsDirectoryErrorLocalization__English from
    "./DesiredFileActuallyIsDirectoryErrorLocalization.english";


class DesiredFileActuallyIsDirectoryError extends Error {

  public static readonly NAME: string = "DesiredFileActuallyIsDirectoryError";
  public static get DEFAULT_TITLE(): string {
    return DesiredFileActuallyIsDirectoryError.localization.defaultTitle;
  }

  public static localization: DesiredFileActuallyIsDirectoryError.Localization =
      DesiredFileActuallyIsDirectoryErrorLocalization__English;


  public constructor(namedParameters: DesiredFileActuallyIsDirectoryError.ConstructorNamedParameters) {

    super();

    this.name = DesiredFileActuallyIsDirectoryError.NAME;

    if ("customMessage" in namedParameters) {
      this.message = namedParameters.customMessage;
    } else {
      this.message = DesiredFileActuallyIsDirectoryError.localization.genericDescription(namedParameters);
    }
  }
}


namespace DesiredFileActuallyIsDirectoryError {

  export type ConstructorNamedParameters = Localization.DescriptionTemplateNamedParameters | { customMessage: string; };

  export type Localization = {
    readonly defaultTitle: string;
    readonly genericDescription: (
      namedParameters: Localization.DescriptionTemplateNamedParameters
    ) => string;
  };

  export namespace Localization {
    export type DescriptionTemplateNamedParameters = {
      targetPath: string;
      messageSpecificPart?: string;
    };
  }
}


export default DesiredFileActuallyIsDirectoryError;
