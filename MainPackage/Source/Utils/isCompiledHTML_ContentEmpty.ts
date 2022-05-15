import cheerio from "cheerio";


/** 〔 理論 〕  "gulp-pug"は、空pugファイルをHTMLファイルに変換する時時、空headとbodyを追加している。 */
export default function isCompiledHTML_ContentEmpty(HTML_Content: string): boolean {

  if (HTML_Content.length === 0) {
    return true;
  }

  const $CheerioCapturing: cheerio.Root = cheerio.load(HTML_Content);

  if ($CheerioCapturing("html").length === 0) {
    return true;
  }


  if ($CheerioCapturing("head").length === 0 || $CheerioCapturing("body").length === 0) {
    return true;
  }

  return $CheerioCapturing("head").html()?.
      trim().
      length === 0;
}
