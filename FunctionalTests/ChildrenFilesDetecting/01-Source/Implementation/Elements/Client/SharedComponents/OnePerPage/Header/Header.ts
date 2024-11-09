import { Logger } from "@yamato-daiwa/es-extensions";


export default class Header {

  public static initialize(): void {

    document.
        querySelector(".Header")?.
        addEventListener("click", (): void => {
          Logger.logSuccess({
            title: "Handler Works",
            description: "The header has been clicked"
          });
        });

  }

}
