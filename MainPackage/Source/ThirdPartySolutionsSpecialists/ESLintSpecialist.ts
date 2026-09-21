import Path from "path";
import FileSystem from "fs";
import { ImprovedGlob, ImprovedPath, isErrnoException } from "@yamato-daiwa/es-extensions-nodejs";
import {
  RawObjectDataProcessor,
  InvalidExternalDataError,
  Logger,
  explodeURI_PathToSegments,
  isUndefined,
  isNull,
  isNotNull,
  getMatchingWithFirstRegularExpressionCapturingGroup,
  getLastElementOfArray
} from "@yamato-daiwa/es-extensions";


export default abstract class ESLintSpecialist {

  private static readonly SUPPORTED_CONFIGURATION_FILES_NAMES_WITH_EXTENSIONS: ReadonlyArray<string> = [
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.cjs",
    "eslint.config.ts",
    "eslint.config.mts",
    "eslint.config.cts"
  ];


  public static generateExcludingGlobSelectorsOfIgnoredFiles(
    consumingProjectRootDirectoryAbsolutePath: string
  ): Array<string> {

    let configurationFileContent: string | undefined;

    for (
      const potentialConfigurationFileNameWithExtension of
          ESLintSpecialist.SUPPORTED_CONFIGURATION_FILES_NAMES_WITH_EXTENSIONS
    ) {

      try {

        configurationFileContent = FileSystem.readFileSync(
          ImprovedPath.joinPathSegments(
            [
              consumingProjectRootDirectoryAbsolutePath,
              potentialConfigurationFileNameWithExtension
            ],
            { alwaysForwardSlashSeparators: true }
          ),
          "utf-8"
        );

        break;

      } catch (error: unknown) {

        if (isErrnoException(error) && error.code === "ENOENT") {
          continue;
        }


        Logger.logError({
          mustOutputIf: __IS_DEVELOPMENT_BUILDING_MODE__,
          errorType: "FileReadingFailedError",
          title: "File Reading Failed",
          description:
            `Unable to read the file ${ potentialConfigurationFileNameWithExtension } while this file seems to be exist`,
          occurrenceLocation: "ESLintLinterSpecialist.getGlobSelectorsOfExcludedFiles(compoundParameter)",
          caughtError: error
        });

      }

    }


    if (isUndefined(configurationFileContent)) {

      Logger.logWarning({
        title: "No Files Will be Ignored by ESLint",
        description: "ESLint configuration file not found thus unable to decide which files must be ignored.",
        occurrenceLocation: "className.methodName(compoundParameter)"
      });

      return [];

    }


    const filesIgnoringPatternsRawExpression: string | null =

        /** [ Theory ]
         * Ignore the "Single character alternation in RegExp" warning from the IntelliJ IDEA, it will brake the capturing
         *   of to apply. See: https://regex101.com/r/FI0Bsn/1 */
        getMatchingWithFirstRegularExpressionCapturingGroup(configurationFileContent, /ignores:\s*(?<array>\[(?:.|\s)+?\])/gu);

    if (isNull(filesIgnoringPatternsRawExpression)) {
      return [];
    }


    let filesIgnoringPatterns: unknown;

    try {

      filesIgnoringPatterns = JSON.parse(filesIgnoringPatternsRawExpression.replace("'", "\""));

    } catch (error: unknown) {

      Logger.logError({
        errorType: InvalidExternalDataError.NAME,
        title: InvalidExternalDataError.localization.defaultTitle,
        description: "Invalid ignoring patters in ESLint configuration.",
        occurrenceLocation: "ESLintLinterSpecialist.getGlobSelectorsOfExcludedFiles(compoundParameter)",
        caughtError: error
      });

      return [];

    }

    const processingResult: RawObjectDataProcessor.ProcessingResult<ReadonlyArray<string>> = RawObjectDataProcessor.process(
      filesIgnoringPatterns,
      {
        subtype: RawObjectDataProcessor.ObjectSubtypes.indexedArray,
        nameForLogging: "ESLint ignoring patterns",
        areUndefinedElementsForbidden: true,
        areNullElementsForbidden: true,
        element: {
          type: String
        }
      }
    );

    if (processingResult.isRawDataInvalid) {

      Logger.logError({
        errorType: InvalidExternalDataError.NAME,
        title: InvalidExternalDataError.localization.defaultTitle,
        description: "Invalid ignoring patters in ESLint configuration.\n" +
            RawObjectDataProcessor.formatValidationErrorsList(processingResult.validationErrorsMessages),
        occurrenceLocation: "ESLintLinterSpecialist.getGlobSelectorsOfExcludedFiles(compoundParameter)"
      });

      return [];

    }

    /* [ Theory ] Known Patterns from ESLint Documentation & Experiments
     * 1. ".config/*": ignore subdirectory ".config" in the directory below the root, but not ".config" recursively
     * 2. ".config/": equivalent of 1
     * 2. ".config": equivalent of 1
     * 3. "＊＊/.config/": recursive ignoring of ".config"
     * 4. config.js - ignoring of a specific file
     * See https://eslint.org/docs/latest/use/configure/ignore#ignoring-files
     * */
    return processingResult.processedData.

        /* [ Theory ]
         * ESLint ignores "node_modules" as default, so it must be ignored whether it has been specified in ESLint
         *   configuration file or no. */
        filter((ignoredFilesPattern: string): boolean => !ignoredFilesPattern.includes("node_module")).

        flatMap(
          (ignoredFilesPattern: string): Array<string> => {

            if (ignoredFilesPattern.startsWith("**/")) {
              return [
                ImprovedGlob.buildExcludingOfDirectoryWithSubdirectoriesGlobSelector(
                  Path.join(
                    consumingProjectRootDirectoryAbsolutePath,
                    ignoredFilesPattern.replace(/^\*\*\//gu, "")
                  )
                )
              ];
            }


            /* [ Theory ]
             * If something like the file path (including the dot in the last path segment like "wwwroot/YDF.global.js")
             *  specified, then it is applicable to the specific file, and the files with a specified name will not be
             *  excluded recursively. */

            const pathPatternSegments: ReadonlyArray<string> = explodeURI_PathToSegments(ignoredFilesPattern);
            const lastPathPatternSegment: string | null = getLastElementOfArray(pathPatternSegments);

            if (isNotNull(lastPathPatternSegment) && lastPathPatternSegment.includes(".")) {

              const targetAbsolutePath: string = ImprovedPath.joinPathSegments(
                [ consumingProjectRootDirectoryAbsolutePath, ignoredFilesPattern ],
                { alwaysForwardSlashSeparators: true }
              );

              /* [ Theory ]
               * Although something like "wwwroot/YDF.global.js" seems to be the file path, it also may be the directory,
               *   so the corresponding potential directory must be excluded too. */
              return [
                ImprovedGlob.includingGlobSelectorToExcludingOne(targetAbsolutePath),
                ImprovedGlob.buildExcludingOfDirectoryWithSubdirectoriesGlobSelector(
                  Path.join(
                    consumingProjectRootDirectoryAbsolutePath,
                    ignoredFilesPattern.replace(/\*/gu, "")
                  )
                )
              ];

            }

            return [
              ImprovedGlob.buildExcludingOfDirectoryWithSubdirectoriesGlobSelector(
                Path.join(
                  consumingProjectRootDirectoryAbsolutePath,
                  ignoredFilesPattern.replace(/\*/gu, "")
                )
              )
            ];

          }
        );

  }

}
