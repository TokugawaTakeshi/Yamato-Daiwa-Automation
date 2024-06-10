import Path from "path";
import FileSystem from "fs";

import type { HTMLElement as HTML_Element } from "node-html-parser";
import type { ProbeResult } from "probe-image-size";
import probeImageSize from "probe-image-size";

import {
  FileReadingFailedError,
  UnexpectedEventError,
  Logger,
  isUndefined,
  isNotUndefined,
  isNull,
  isNotNull
} from "@yamato-daiwa/es-extensions";
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


export default abstract class ImagesAspectRatioAffixer {

  private static readonly TARGET_ELEMENTS_ATTRIBUTE_NAME: string = "data-yda-auto_aspect_ratio";
  private static readonly imagesCachedMetadata: ImagesAspectRatioAffixer.ImagesCachedMetadata = new Map();


  public static affix(
    {
      rootHTML_Element,
      publicPath,
      absolutePathOfOutputDirectoryForTargetHTML_File,
      consumingProjectRootDirectoryAbsolutePath
    }: Readonly<{
      rootHTML_Element: HTML_Element;
      publicPath?: string;
      absolutePathOfOutputDirectoryForTargetHTML_File: string;
      consumingProjectRootDirectoryAbsolutePath: string;
    }>
  ): HTML_Element {

    for (
      const DOM_Element of
          rootHTML_Element.querySelectorAll(`[${ ImagesAspectRatioAffixer.TARGET_ELEMENTS_ATTRIBUTE_NAME }]`)
    ) {

      const isImgElement: boolean = DOM_Element.tagName === "IMG";

      const imageRawPath: string | null =
          isImgElement ?
              DOM_Element.getAttribute("src") ?? null :
              ImagesAspectRatioAffixer.tryToExtractBackgroundImagePathFromElement(DOM_Element);

      if (isNull(imageRawPath) || imageRawPath.startsWith("http")) {
        continue;
      }


      let imageAbsolutePath: string;

      if (Path.isAbsolute(imageRawPath)) {

        if (isUndefined(publicPath)) {

          Logger.logError({
            mustOutputIf: __IS_DEVELOPMENT_BUILDING_MODE__,
            errorType: UnexpectedEventError.NAME,
            title: UnexpectedEventError.localization.defaultTitle,
            description:
                "The image has the shortened absolute path while \"publicPath\" has not been passed. ",
            occurrenceLocation: "ImagesAspectRatioAffixer.affix(compoundParameter)"
          });

          continue;

        }


        imageAbsolutePath = ImprovedPath.joinPathSegments(
          [ publicPath, imageRawPath ],
          { alwaysForwardSlashSeparators: true }
        );

      } else {

        imageAbsolutePath = ImprovedPath.joinPathSegments(
          [ absolutePathOfOutputDirectoryForTargetHTML_File, imageRawPath ],
          { alwaysForwardSlashSeparators: true }
        );

      }


      let imageModificationDateTime__UNIX_Milliseconds: number;

      try {

        imageModificationDateTime__UNIX_Milliseconds = FileSystem.statSync(imageAbsolutePath).ctime.getTime();

      } catch (error: unknown) {

        Logger.logError({
          mustOutputIf: __IS_DEVELOPMENT_BUILDING_MODE__,
          errorType: UnexpectedEventError.NAME,
          title: UnexpectedEventError.localization.defaultTitle,
          description:
              `No image with path "${ imageRawPath }" specified in output HTML code has been found. ` +
              "It must be investigated.",
          occurrenceLocation: "ImagesAspectRatioAffixer.affix(compoundParameter)",
          caughtError: error
        });

        continue;

      }


      const imagePathRelativeToConsumingProjectRootDirectory: string = ImprovedPath.computeRelativePath({
        comparedPath: imageAbsolutePath,
        basePath: consumingProjectRootDirectoryAbsolutePath,
        alwaysForwardSlashSeparators: true
      });

      let imageWidth__pixels: number;
      let imageHeight__pixels: number;

      const cachedDataOfCurrentImage: ImagesAspectRatioAffixer.ImagesCachedMetadata.Image | undefined =
          ImagesAspectRatioAffixer.imagesCachedMetadata.get(imagePathRelativeToConsumingProjectRootDirectory);

      if (
        isNotUndefined(cachedDataOfCurrentImage) &&
        cachedDataOfCurrentImage.modificationDateTime__UNIX_milliseconds === imageModificationDateTime__UNIX_Milliseconds
      ) {
        imageWidth__pixels = cachedDataOfCurrentImage.width__pixels;
        imageHeight__pixels = cachedDataOfCurrentImage.height__pixels;
      } else {

        let imageContent: Buffer;

        try {

          imageContent = FileSystem.readFileSync(imageAbsolutePath);

        } catch (error: unknown) {

          Logger.logError({
            mustOutputIf: __IS_DEVELOPMENT_BUILDING_MODE__,
            errorType: FileReadingFailedError.NAME,
            title: FileReadingFailedError.localization.defaultTitle,
            description: FileReadingFailedError.localization.generateDescription({
              filePath: absolutePathOfOutputDirectoryForTargetHTML_File
            }),
            occurrenceLocation: "ImagesAspectRatioAffixer.affix(compoundParameter)",
            caughtError: error
          });

          continue;

        }


        let imageProbeResult: ProbeResult | null;

        try {

          imageProbeResult = probeImageSize.sync(imageContent);

        } catch (error: unknown) {

          Logger.logError({
            mustOutputIf: __IS_DEVELOPMENT_BUILDING_MODE__,
            errorType: "ImageAnalyzingFailure",
            title: "Image analyzing failed",
            description: "Fail to get the image dimensions.",
            occurrenceLocation: "ImagesAspectRatioAffixer.affix(compoundParameter)",
            caughtError: error
          });

          continue;

        }


        if (isNull(imageProbeResult)) {
          continue;
        }


        imageWidth__pixels = imageProbeResult.width;
        imageHeight__pixels = imageProbeResult.height;


        ImagesAspectRatioAffixer.imagesCachedMetadata.set(
          imagePathRelativeToConsumingProjectRootDirectory,
          {
            modificationDateTime__UNIX_milliseconds: imageModificationDateTime__UNIX_Milliseconds,
            width__pixels: imageWidth__pixels,
            height__pixels: imageHeight__pixels
          }
        );

      }

      const styleAttributeInitialValue: string = DOM_Element.getAttribute("style") ?? "";

      DOM_Element.setAttribute(
        "style",
        `${ styleAttributeInitialValue }aspect-ratio: ${ imageWidth__pixels }/${ imageHeight__pixels };`
      );

      DOM_Element.removeAttribute(ImagesAspectRatioAffixer.TARGET_ELEMENTS_ATTRIBUTE_NAME);

    }

    return rootHTML_Element;

  }

  private static tryToExtractBackgroundImagePathFromElement(targetElement: HTML_Element): string | null {

    const styleAttributeValue: string | undefined = targetElement.getAttribute("style");

    if (isUndefined(styleAttributeValue)) {
      return null;
    }


    /* [ Fiddle ] https://regex101.com/r/vvGR6t/1 */
    const imagePathSearchingResults: RegExpMatchArray | null =
        (/background(?:-image)?\s*:\s*url\(["'](?<URI>[^"']+)["']/gu).exec(styleAttributeValue);

    return isNotNull(imagePathSearchingResults) ? imagePathSearchingResults[1] : null;

  }

}


namespace ImagesAspectRatioAffixer {

  export type ImagesCachedMetadata = Map<
    ImagesCachedMetadata.PathRelativeToConsumingProjectRootDirectory,
    ImagesCachedMetadata.Image
  >;

  export namespace ImagesCachedMetadata {

    export type PathRelativeToConsumingProjectRootDirectory = string;

    export type Image = Readonly<{
      modificationDateTime__UNIX_milliseconds: number;
      width__pixels: number;
      height__pixels: number;
    }>;

  }

}
