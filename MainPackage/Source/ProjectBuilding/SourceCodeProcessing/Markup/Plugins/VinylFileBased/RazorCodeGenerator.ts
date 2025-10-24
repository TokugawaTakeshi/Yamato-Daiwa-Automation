import type VinylFileClass from "@Utils/VinylFileClass";
import InterimXML_CompatibleCodeNormalizer from "razor-by-pug";


export default class RazorCodeGenerator {

  public static generateAndSetContentForVinylFile(targetMarkupVinylFile: VinylFileClass): void {

    const initialXML_IncompatibleCode: string = targetMarkupVinylFile.stringifiedContents;
    const XML_CompatibleCode: string = RazorCodeGenerator.convertInitialCodeToXML_Compatible(initialXML_IncompatibleCode);
    const outputRazorCOde: string = InterimXML_CompatibleCodeNormalizer.normalize(XML_CompatibleCode);

    targetMarkupVinylFile.setContents(outputRazorCOde);

  }


  private static convertInitialCodeToXML_Compatible(initialCode: string): string {

    let workpiece: string = initialCode;

    workpiece = workpiece.replaceAll(/@ref=/gu, "at-ref=");

    return workpiece;

  }

}
