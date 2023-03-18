import type VinylFile from "vinyl";
import extractStringifiedContentFromVinylFile from "@Utils/extractStringifiedContentFromVinylFile";
import cheerio from "cheerio";
import { isNull } from "@yamato-daiwa/es-extensions";


export default function removeExtraSpacesFromJapaneseText(compiledHTML_File: VinylFile): VinylFile {

  const $HTML_FileContentCheerioCapturing: cheerio.Root = cheerio.
      load(extractStringifiedContentFromVinylFile(compiledHTML_File), { decodeEntities: false });

  for (const targetElement of Array.from($HTML_FileContentCheerioCapturing("p"))) {

    const $TargetElement: cheerio.Cheerio = $HTML_FileContentCheerioCapturing(targetElement);
    const targetElementHTML: string | null = $TargetElement.html();

    if (isNull(targetElementHTML)) {
      continue;
    }


    $TargetElement.html(targetElementHTML.replaceAll(
      /(?<characterBeforeSpace>[^\x20-\x7e]) (?<characterAfterSpace>[^\x20-\x7e])/gu,
      "$<characterBeforeSpace>$<characterAfterSpace>"
    ));
  }

  compiledHTML_File.contents = Buffer.from($HTML_FileContentCheerioCapturing.html({ decodeEntities: false }));

  return compiledHTML_File;

}
