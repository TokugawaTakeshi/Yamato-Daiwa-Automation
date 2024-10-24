/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import type MarkupProcessingSettings__FromFile__RawValid
  from "@MarkupProcessing/MarkupProcessingSettings__FromFile__RawValid";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import {
  type ArbitraryObject,
  getObjectPropertySafely,
  InvalidExternalDataError,
  FileReadingFailedError,
  isArbitraryObject,
  isEitherUndefinedOrNull,
  isNonEmptyString,
  isNotNull,
  isNumber,
  isString,
  isUndefined,
  Logger,
  nullToUndefined,
  removeSpecificCharacterFromCertainPosition,
  replaceMatchesWithRegularExpressionToDynamicValue,
  type ReplacingOfMatchesWithRegularExpressionToDynamicValue
} from "@yamato-daiwa/es-extensions";
import { ImprovedPath, ObjectDataFilesProcessor } from "@yamato-daiwa/es-extensions-nodejs";


class RoutingSettingsNormalizer {

  private static readonly routingPathSegments: Array<string> = [];

  private static projectRootDirectoryAbsolutePath: string;
  private static cachedAbsolutePathsOfSectioning: Set<string> = new Set<string>();


  public static normalize(
    {
      routingSettings__fromFile__rawValid,
      projectRootDirectoryAbsolutePath,
      absolutePathsOfSectioningToCache
    }: Readonly<{
      routingSettings__fromFile__rawValid: MarkupProcessingSettings__FromFile__RawValid.Routing;
      projectRootDirectoryAbsolutePath: string;
      absolutePathsOfSectioningToCache: Set<string>;
    }>
  ): RoutingSettingsNormalizer.NormalizedRouting {

    RoutingSettingsNormalizer.cachedAbsolutePathsOfSectioning = absolutePathsOfSectioningToCache;
    RoutingSettingsNormalizer.projectRootDirectoryAbsolutePath = projectRootDirectoryAbsolutePath;

    const rawRouting: unknown = ObjectDataFilesProcessor.processFile({
      filePath: ImprovedPath.joinPathSegments([
        projectRootDirectoryAbsolutePath, routingSettings__fromFile__rawValid.specificationFileRelativePath
      ]),
      synchronously: true,
      schema: ObjectDataFilesProcessor.SupportedSchemas.YAML
    });

    const rawLocalizations: { [locale: string]: ArbitraryObject; } = {};

    for (
      const [ locale, localizationFileRelativePath ] of
          Object.entries(routingSettings__fromFile__rawValid.localizations ?? {})
    ) {

      const routingLocalizationFileAbsolutePath: string = ImprovedPath.joinPathSegments(
        [ projectRootDirectoryAbsolutePath, localizationFileRelativePath ],
        { alwaysForwardSlashSeparators: true }
      );

      const routingLocalization: unknown = ObjectDataFilesProcessor.processFile({
        filePath: routingLocalizationFileAbsolutePath,
        synchronously: true,
        schema: ObjectDataFilesProcessor.SupportedSchemas.YAML
      });

      if (!isArbitraryObject(routingLocalization)) {
        Logger.throwErrorAndLog({
          errorInstance: new InvalidExternalDataError({
            customMessage: `Malformed routing localization at "${ routingLocalizationFileAbsolutePath }".`
          }),
          title: InvalidExternalDataError.localization.defaultTitle,
          occurrenceLocation: "RoutingSettingsNormalizer.normalize(compoundParameter)"
        });
      }

      rawLocalizations[locale] = routingLocalization;

    }

    if (Object.entries(rawLocalizations).length === 0) {
      return RoutingSettingsNormalizer.normalizeDepthLevelWiseRecursively({
        rawRoutingOfSpecificDepthLevel: rawRouting,
        outputWorkpiece: {}
      });
    }


    const normalizedRoutingWorkpiece: { [locale: string]: RoutingSettingsNormalizer.NormalizedRouting.Routes; } = {};

    for (const locale of Object.keys(rawLocalizations)) {

      normalizedRoutingWorkpiece[locale] = {};

      RoutingSettingsNormalizer.normalizeDepthLevelWiseRecursively({
        rawRoutingOfSpecificDepthLevel: rawRouting,
        outputWorkpiece: normalizedRoutingWorkpiece[locale],
        localization: {
          locale,
          strings: rawLocalizations[locale]
        }
      });

    }

    RoutingSettingsNormalizer.cachedAbsolutePathsOfSectioning = new Set<string>();

    return normalizedRoutingWorkpiece;

  }


  private static normalizeDepthLevelWiseRecursively(
    {
      rawRoutingOfSpecificDepthLevel,
      outputWorkpiece,
      localization
    }: Readonly<{
      rawRoutingOfSpecificDepthLevel: unknown;
      outputWorkpiece: RoutingSettingsNormalizer.NormalizedRouting.Routes;
      localization?: RoutingSettingsNormalizer.RawLocalization;
    }>
  ): RoutingSettingsNormalizer.NormalizedRouting.Routes {

    if (!isArbitraryObject(rawRoutingOfSpecificDepthLevel)) {
      Logger.throwErrorAndLog({
        errorInstance: new InvalidExternalDataError({
          customMessage: [
            "Malformed routing",
            RoutingSettingsNormalizer.routingPathSegments.length > 0 ?
                [ ` at "${ RoutingSettingsNormalizer.routingPathSegments.join(".") }"` ] : [],
            ". ",
            `Must be an object while ${ typeof rawRoutingOfSpecificDepthLevel } found.`
          ].join(" ")
        }),
        title: InvalidExternalDataError.localization.defaultTitle,
        occurrenceLocation: "RoutingSettingsNormalizer.normalizeDepthLevelWiseRecursively(...parameters)"
      });
    }

    RoutingSettingsNormalizer.routingPathSegments.push(
      ...RoutingSettingsNormalizer.routingPathSegments.length === 0 ? [ "" ] : [ "$children", "" ]
    );

    for (const [ routeKey, rawRoute ] of Object.entries(rawRoutingOfSpecificDepthLevel)) {

      RoutingSettingsNormalizer.routingPathSegments[RoutingSettingsNormalizer.routingPathSegments.length - 1] = routeKey;

      if (!isArbitraryObject(rawRoute)) {
        Logger.throwErrorAndLog({
          errorInstance: new InvalidExternalDataError({
            customMessage:
                `Malformed routing at "${ RoutingSettingsNormalizer.routingPathSegments.join(".") }". ` +
                `Must be an object while ${ typeof nullToUndefined(rawRoute) } found.`
          }),
          title: InvalidExternalDataError.localization.defaultTitle,
          occurrenceLocation: "RoutingSettingsNormalizer.normalizeDepthLevelWiseRecursively(...parameters)"
        });
      }


      const routeURI: string | null = RoutingSettingsNormalizer.normalizeURI_IfExists(rawRoute.$URI, localization);

      outputWorkpiece[routeKey] = {
        $heading: RoutingSettingsNormalizer.normalizeHeading(rawRoute.$heading, localization),
        ...isNotNull(routeURI) ? { $URI: routeURI } : null,
        ...isArbitraryObject(rawRoute.$children) ? {
          $children: RoutingSettingsNormalizer.normalizeDepthLevelWiseRecursively({
            rawRoutingOfSpecificDepthLevel: rawRoute.$children,
            outputWorkpiece: {},
            localization
          })
        } : null,
        ...isArbitraryObject(rawRoute.$sectioning) ? {
          $sectioning: RoutingSettingsNormalizer.normalizeSectioning(rawRoute.$sectioning, routeURI, localization)
        } : null
      };

    }

    RoutingSettingsNormalizer.routingPathSegments.pop();

    return outputWorkpiece;

  }


  private static normalizeURI_IfExists(
    rawURI: unknown, localization?: RoutingSettingsNormalizer.RawLocalization
  ): string | null {

    if (isEitherUndefinedOrNull(rawURI)) {
      return null;
    }


    if (!isString(rawURI)) {
      Logger.throwErrorAndLog({
        errorInstance: new InvalidExternalDataError({
          customMessage:
              `Malformed routing at "${ RoutingSettingsNormalizer.routingPathSegments.join(".") }.$URI". ` +
              `Must be a string while ${ typeof nullToUndefined(rawURI) } found.`
        }),
        title: InvalidExternalDataError.localization.defaultTitle,
        occurrenceLocation: "RoutingSettingsNormalizer.normalizeURI_IfExists(rawURI, localization?)"
      });
    }


    let URI_Workpiece: string = rawURI;

    if (URI_Workpiece.startsWith("`")) {

      if (isUndefined(localization)) {
        Logger.throwErrorAndLog({
          errorInstance: new InvalidExternalDataError({
            customMessage:
                `Malformed routing at "${ RoutingSettingsNormalizer.routingPathSegments.join(".") }.$URI". ` +
                "The specified URI has been wrapped to backticks while no localization specified."
          }),
          title: InvalidExternalDataError.localization.defaultTitle,
          occurrenceLocation: "RoutingSettingsNormalizer.normalizeURI_IfExists(rawURI, localization?)"
        });
      }


      URI_Workpiece = removeSpecificCharacterFromCertainPosition({
        targetString: URI_Workpiece,
        targetCharacter: "`",
        fromFirstPosition: true
      });

      URI_Workpiece = removeSpecificCharacterFromCertainPosition({
        targetString: URI_Workpiece,
        targetCharacter: "`",
        fromLastPosition: true
      });

      if (URI_Workpiece.includes("${")) {

        URI_Workpiece = replaceMatchesWithRegularExpressionToDynamicValue({
          targetString: URI_Workpiece,
          regularExpressionWithCapturingGroups: /(?<interpolation>\$\{\s*(?<variable>(?:\w|\.)+)\s*\})/gum,
          replacer(
            matching: ReplacingOfMatchesWithRegularExpressionToDynamicValue.Matching<
              Readonly<{ interpolation: string; variable: string; }>,
              Readonly<{ [1]: string; [2]: string; }>
            >
          ): string | null {

            const variableSubstitution: unknown = getObjectPropertySafely(
              localization.strings,
              matching.namedCapturingGroups.variable
            );

            if (!isString(variableSubstitution) && !isNumber(variableSubstitution)) {
              return null;
            }


            return String(variableSubstitution);

          }
        });

      }

      if (URI_Workpiece.includes("$")) {

        const localeDependentURI: unknown = getObjectPropertySafely(localization.strings, URI_Workpiece);

        if (!isString(localeDependentURI)) {
          Logger.throwErrorAndLog({
            errorInstance: new InvalidExternalDataError({
              customMessage:
                  `Malformed routing at "${ RoutingSettingsNormalizer.routingPathSegments.join(".") }.$URI". ` +
                  "The specified URI is including backticks while no localization specified."
            }),
            title: InvalidExternalDataError.localization.defaultTitle,
            occurrenceLocation: "RoutingSettingsNormalizer.normalizeURI_IfExists(rawURI, localization?)"
          });
        }


        return localeDependentURI;

      }

    }


    return URI_Workpiece;

  }

  private static normalizeHeading(
    rawHeading: unknown, localization?: RoutingSettingsNormalizer.RawLocalization
  ): string {

    if (!isString(rawHeading)) {
      Logger.throwErrorAndLog({
        errorInstance: new InvalidExternalDataError({
          customMessage: [
            `Malformed routing at "${ RoutingSettingsNormalizer.routingPathSegments.join(".") }.$heading".`,
            `Must be a string while ${ typeof nullToUndefined(rawHeading) } found.`
          ].join(" ")
        }),
        title: InvalidExternalDataError.localization.defaultTitle,
        occurrenceLocation: "RoutingSettingsNormalizer.normalizeHeading(specification, localization?)"
      });
    }


    let headingWorkpiece: string = rawHeading;

    if (headingWorkpiece.startsWith("`")) {

      if (isEitherUndefinedOrNull(localization)) {
        Logger.throwErrorAndLog({
          errorInstance: new InvalidExternalDataError({
            customMessage:
                `Malformed routing at "${ RoutingSettingsNormalizer.routingPathSegments.join(".") }.$heading".` +
                "The specified URI is including backticks while no localization specified."
          }),
          title: InvalidExternalDataError.localization.defaultTitle,
          occurrenceLocation: "RoutingSettingsNormalizer.normalizeHeading(specification, localization?)"
        });
      }


      headingWorkpiece = removeSpecificCharacterFromCertainPosition({
        targetString: headingWorkpiece,
        targetCharacter: "`",
        fromFirstPosition: true
      });

      headingWorkpiece = removeSpecificCharacterFromCertainPosition({
        targetString: headingWorkpiece,
        targetCharacter: "`",
        fromLastPosition: true
      });

      const localizedHeading: unknown = getObjectPropertySafely(localization.strings, headingWorkpiece);

      if (!isString(localizedHeading)) {
        Logger.throwErrorAndLog({
          errorInstance: new InvalidExternalDataError({
            customMessage: [
              `Malformed localized heading at "${ RoutingSettingsNormalizer.routingPathSegments.join(".") }.$heading".`,
              `Must be a string while ${ typeof nullToUndefined(localizedHeading) } found.`
            ].join(" ")
          }),
          title: InvalidExternalDataError.localization.defaultTitle,
          occurrenceLocation: "RoutingSettingsNormalizer.normalizeHeading(specification, localization?)"
        });
      }


      return localizedHeading;

    }


    return headingWorkpiece;

  }


  /* ━━━ Sectioning ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private static normalizeSectioning(
    rawSectioningSpecification: ArbitraryObject,
    parentRouteURI: string | null,
    localization?: RoutingSettingsNormalizer.RawLocalization
  ): RoutingSettingsNormalizer.NormalizedRouting.Sectioning {

    RoutingSettingsNormalizer.routingPathSegments.push("$sectioning");

    if (!isString(parentRouteURI)) {
      Logger.throwErrorAndLog({
        errorInstance: new InvalidExternalDataError({
          customMessage:
              `The sectioning at "${ RoutingSettingsNormalizer.routingPathSegments.join(".") }" has been defined ` +
                "while the $URI of the parent route has not been. " +
              "It must be defined to compute the URI for each section."
        }),
        title: InvalidExternalDataError.localization.defaultTitle,
        occurrenceLocation: "RoutingSettingsNormalizer.normalizeSectioning(...parameters)"
      });
    }


    if (!isNonEmptyString(rawSectioningSpecification.$specificationFileRelativePath)) {
      Logger.throwErrorAndLog({
        errorInstance: new InvalidExternalDataError({
          customMessage:
              `Malformed routing at "${ RoutingSettingsNormalizer.routingPathSegments.join(".") }.` +
                "$specificationFileRelativePath\"." +
              "The \"$sectioning.$specificationFileRelativePath\" must be defined with the valid file path relative " +
                "to project top directory."
        }),
        title: InvalidExternalDataError.localization.defaultTitle,
        occurrenceLocation: "RoutingSettingsNormalizer.normalizeSectioning(...parameters)"
      });
    }


    const rawSectioningSchemaFileAbsolutePath: string = ImprovedPath.joinPathSegments(
      [
        RoutingSettingsNormalizer.projectRootDirectoryAbsolutePath,
        rawSectioningSpecification.$specificationFileRelativePath
      ],
      { alwaysForwardSlashSeparators: true }
    );

    let rawSectioningSchema: unknown;

    try {

      rawSectioningSchema = ObjectDataFilesProcessor.processFile({
        filePath: ImprovedPath.joinPathSegments([
          RoutingSettingsNormalizer.projectRootDirectoryAbsolutePath,
          rawSectioningSpecification.$specificationFileRelativePath
        ]),
        synchronously: true,
        schema: ObjectDataFilesProcessor.SupportedSchemas.YAML
      });

    } catch (error: unknown) {

      Logger.throwErrorAndLog({
        errorInstance: new InvalidExternalDataError({
          customMessage:
              "The error has occurred during the reading of sectioning file at " +
                  `"${ rawSectioningSpecification.$specificationFileRelativePath }".`
        }),
        title: InvalidExternalDataError.localization.defaultTitle,
        occurrenceLocation: "RoutingSettingsNormalizer.normalizeSectioning(...parameters)",
        innerError: error
      });

    }

    RoutingSettingsNormalizer.cachedAbsolutePathsOfSectioning.add(rawSectioningSchemaFileAbsolutePath);

    if (!isArbitraryObject(rawSectioningSchema)) {
      Logger.throwErrorAndLog({
        errorInstance: new InvalidExternalDataError({
          customMessage:
              `Malformed sectioning at "${ rawSectioningSpecification.$specificationFileRelativePath }". ` +
              `Must be an object while ${ typeof nullToUndefined(rawSectioningSchema) } found.`
        }),
        title: InvalidExternalDataError.localization.defaultTitle,
        occurrenceLocation: "RoutingSettingsNormalizer.normalizeSectioning(...parameters)"
      });
    }


    if (isArbitraryObject(rawSectioningSpecification.$localizations)) {

      if (isUndefined(localization)) {
        Logger.throwErrorAndLog({
          errorInstance: new InvalidExternalDataError({
            customMessage:
                "The $localizations has been specified for sectioning " +
                  `"${ RoutingSettingsNormalizer.routingPathSegments.join(".") }", but common localizations for ` +
                  "routing has not been. " +
                "Specify the $localizations property also in routing configuration."
          }),
          title: InvalidExternalDataError.localization.defaultTitle,
          occurrenceLocation: "RoutingSettingsNormalizer.normalizeSectioning(...parameters)"
        });
      }


      const targetLocalizationFileRelativePath: unknown = rawSectioningSpecification.$localizations[localization.locale];

      RoutingSettingsNormalizer.routingPathSegments.push("$localizations", localization.locale);

      if (!isString(targetLocalizationFileRelativePath)) {
        Logger.throwErrorAndLog({
          errorInstance: new InvalidExternalDataError({
            customMessage:
                "Invalid path to sectioning localization at " +
                  `"${ RoutingSettingsNormalizer.routingPathSegments.join(".") }". ` +
                  "Must be the string with file path relative to project root directory, " +
                    `${ typeof nullToUndefined(targetLocalizationFileRelativePath) } found.`
          }),
          title: InvalidExternalDataError.localization.defaultTitle,
          occurrenceLocation: "RoutingSettingsNormalizer.normalizeSectioning(...parameters)"
        });
      }


      const targetLocalizationFileAbsolutePath: string = ImprovedPath.joinPathSegments(
        [ RoutingSettingsNormalizer.projectRootDirectoryAbsolutePath, targetLocalizationFileRelativePath ],
        { alwaysForwardSlashSeparators: true }
      );

      let sectioningRawLocalization: unknown;

      try {

        sectioningRawLocalization = ObjectDataFilesProcessor.processFile({
          filePath: targetLocalizationFileAbsolutePath,
          synchronously: true,
          schema: ObjectDataFilesProcessor.SupportedSchemas.YAML
        });

      } catch (error: unknown) {

        Logger.throwErrorAndLog({
          errorInstance: new FileReadingFailedError({ filePath: targetLocalizationFileAbsolutePath }),
          title: FileReadingFailedError.localization.defaultTitle,
          occurrenceLocation: "RoutingSettingsNormalizer.normalizeSectioning(...parameters)",
          innerError: error
        });

      }


      RoutingSettingsNormalizer.cachedAbsolutePathsOfSectioning.add(targetLocalizationFileAbsolutePath);

      if (!isArbitraryObject(sectioningRawLocalization)) {
        Logger.throwErrorAndLog({
          errorInstance: new InvalidExternalDataError({
            customMessage: `Malformed sectioning localization at "${ targetLocalizationFileAbsolutePath }".`
          }),
          title: InvalidExternalDataError.localization.defaultTitle,
          occurrenceLocation: "RoutingSettingsNormalizer.normalizeSectioning(...parameters)"
        });
      }

      const normalizedLocalizedSectioning: RoutingSettingsNormalizer.NormalizedRouting.Sectioning =
          RoutingSettingsNormalizer.normalizeSectioningDepthLevelRecursively({
            rawSectioningOfSpecificDepthLevel: rawSectioningSchema,
            outputWorkpiece: {},
            localization: {
              locale: localization.locale,
              strings: sectioningRawLocalization
            },
            parentRouteURI
          });

      /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- `$localizations` and `localization.locale` */
      RoutingSettingsNormalizer.routingPathSegments.splice(-2);

      return normalizedLocalizedSectioning;

    }


    return RoutingSettingsNormalizer.normalizeSectioningDepthLevelRecursively({
      rawSectioningOfSpecificDepthLevel: rawSectioningSchema,
      outputWorkpiece: {},
      parentRouteURI
    });

  }

  private static normalizeSectioningDepthLevelRecursively(
    {
      rawSectioningOfSpecificDepthLevel,
      outputWorkpiece,
      localization,
      parentRouteURI
    }: Readonly<{
      rawSectioningOfSpecificDepthLevel: unknown;
      outputWorkpiece: RoutingSettingsNormalizer.NormalizedRouting.Sectioning;
      localization?: RoutingSettingsNormalizer.RawLocalization;
      parentRouteURI: string;
    }>
  ): RoutingSettingsNormalizer.NormalizedRouting.Sectioning {

    if (!isArbitraryObject(rawSectioningOfSpecificDepthLevel)) {
      Logger.throwErrorAndLog({
        errorInstance: new InvalidExternalDataError({
          customMessage:
            `Malformed routing at "${ RoutingSettingsNormalizer.routingPathSegments.join(".") }". ` +
            `Must be an object while ${ typeof nullToUndefined(rawSectioningOfSpecificDepthLevel) } found.`
        }),
        title: InvalidExternalDataError.localization.defaultTitle,
        occurrenceLocation: "RoutingSettingsNormalizer.normalizeDepthLevelWiseRecursively(compoundParameter)"
      });
    }

    RoutingSettingsNormalizer.routingPathSegments.push(
      /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- For the top level of sectioning case,
        the "$sectioning" element will be second from the end.  */
      ...RoutingSettingsNormalizer.routingPathSegments[RoutingSettingsNormalizer.routingPathSegments.length - 3] ===
          "$sectioning" ? [ "" ] : [ "$children", "" ]
    );

    RoutingSettingsNormalizer.routingPathSegments.push("");

    for (const [ sectionKey, sectionRawMetadata ] of Object.entries(rawSectioningOfSpecificDepthLevel)) {

      RoutingSettingsNormalizer.routingPathSegments[RoutingSettingsNormalizer.routingPathSegments.length - 1] = sectionKey;

      if (!isArbitraryObject(sectionRawMetadata)) {
        Logger.throwErrorAndLog({
          errorInstance: new InvalidExternalDataError({
            customMessage:
              `Malformed sectioning at "${ RoutingSettingsNormalizer.routingPathSegments.join(".") }".` +
              `Must be an object while ${ typeof nullToUndefined(sectionRawMetadata) } found.`
          }),
          title: InvalidExternalDataError.localization.defaultTitle,
          occurrenceLocation: "RoutingSettingsNormalizer.normalizeDepthLevelWiseRecursively(compoundParameter)"
        });
      }


      if (!isString(sectionRawMetadata.$anchor)) {
        Logger.throwErrorAndLog({
          errorInstance: new InvalidExternalDataError({
            customMessage:
                `Malformed sectioning at "${ RoutingSettingsNormalizer.routingPathSegments.join(".") }". ` +
                `The property "$anchor" must be defined with string while ${ typeof sectionRawMetadata } found.`
          }),
          title: InvalidExternalDataError.localization.defaultTitle,
          occurrenceLocation: "RoutingSettingsNormalizer.normalizeDepthLevelWiseRecursively(compoundParameter)"
        });
      }

      outputWorkpiece[sectionKey] = {
        $heading: RoutingSettingsNormalizer.normalizeHeading(sectionRawMetadata.$heading, localization),
        $anchor: sectionRawMetadata.$anchor,
        $URI: `${ parentRouteURI }#${ sectionRawMetadata.$anchor }`,
        ...isArbitraryObject(sectionRawMetadata.$children) ? {
          $children: RoutingSettingsNormalizer.normalizeSectioningDepthLevelRecursively({
            rawSectioningOfSpecificDepthLevel: sectionRawMetadata.$children,
            outputWorkpiece: {},
            localization,
            parentRouteURI
          })
        } : null
      };

    }

    RoutingSettingsNormalizer.routingPathSegments.pop();

    return outputWorkpiece;

  }

}


namespace RoutingSettingsNormalizer {

  export type RawLocalization = Readonly<{
    locale: string;
    strings: ArbitraryObject;
  }>;

  export type NormalizedRouting = NormalizedRouting.Routes | NormalizedRouting.Localized;

  export namespace NormalizedRouting {

    export type Localized = { [locale: string]: Routes; };

    export type Routes = { [route: string]: Route; };

    export type Route = {
      $heading: string;
      $URI?: string;
      $children?: Routes;
      $sectioning?: Sectioning;
    };


    export type Sectioning = { [key: string]: Section; };

    export type Section = {
      $heading: string;
      $anchor: string;
      readonly $URI: string;
      $children?: Sectioning;
    };

  }

}


export default RoutingSettingsNormalizer;
