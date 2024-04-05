export default class Header {

  public static initialize(): void {

    document.
        querySelector(".Header")?.
        addEventListener("click", (): void => {
          console.log("The header has been clicked");
        });

  }

}
