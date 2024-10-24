import { Logger } from "@yamato-daiwa/es-extensions";


export default class PageA_Partial {

  public static initialize(): void {
    Logger.logSuccess({
      title: "Initialization Successful",
      description: "PageA_Partial, O'K."
    });
  }

}
