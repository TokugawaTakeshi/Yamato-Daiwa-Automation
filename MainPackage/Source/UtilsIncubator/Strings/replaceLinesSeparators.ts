import type { LineSeparators } from "@yamato-daiwa/es-extensions";
import { explodeStringToLines } from "@yamato-daiwa/es-extensions";


export default function replaceLinesSeparators(targetString: string, lineSeparators: LineSeparators): string {
  return explodeStringToLines({ targetString, mustIgnoreCarriageReturn: false }).join(lineSeparators);
}
