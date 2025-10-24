import SpacesNormalizerForCJK_Text from "@MarkupProcessing/Plugins/DOM_Based/SpacesNormalizerForCJK_Text";
import { type HTMLElement as HTML_Element, parse as parseHTML } from "node-html-parser";
import Testing from "node:test";
import Assert from "assert";
import { Logger } from "@yamato-daiwa/es-extensions";


const rawAndExpectedFixedSamplesMap: ReadonlyMap<string, string> = new Map([

  [ "習う。 料理は", "習う。料理は" ],
  [ "習う。\n料理は", "習う。料理は" ]

]);


Testing.

    suite(
      SpacesNormalizerForCJK_Text.name,
      async (): Promise<void> => {

        await Promise.all(
          Array.from(rawAndExpectedFixedSamplesMap.entries()).
              map(
                async ([ rawSample, expectedFixedSample ]: Readonly<[ string, string ]>): Promise<void> => {

                    const wrappedRawSample: HTML_Element =
                        parseHTML(`<p data-yda-normalize_spaces_in_cjk="">${ rawSample }</p>`);

                    await Testing.test(
                      `${ rawSample } filed`,
                      (): void => {
                        Assert.strictEqual(
                          SpacesNormalizerForCJK_Text.normalize(wrappedRawSample).text,
                          expectedFixedSample
                        );
                      }
                    );

                }
              )
        );

      }
    ).

    catch(Logger.logPromiseError);
