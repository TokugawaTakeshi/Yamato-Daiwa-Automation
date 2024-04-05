import TypeScript from "typescript";
import {
  Logger,
  FileReadingFailedError,
  isNotUndefined,
  isNonEmptyString,
  InvalidConfigError,
  isArbitraryObject
} from "@yamato-daiwa/es-extensions";
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


export default abstract class TypeScriptSpecialist {

  public static readTypeScriptConfigurationFileAndGetCompilerOptions(
    typeScriptConfigurationFileAbsolutePath: string
  ): TypeScript.CompilerOptions {

    let typeScriptFileReadingResult: Readonly<{ config?: unknown; error?: TypeScript.Diagnostic; }>;

    try {

      typeScriptFileReadingResult = TypeScript.readConfigFile(
        typeScriptConfigurationFileAbsolutePath,
        (typeScriptConfigurationFilePath: string): string | undefined =>
            TypeScript.sys.readFile(typeScriptConfigurationFilePath)
      );

    } catch (error: unknown) {

      Logger.throwErrorAndLog({
        errorInstance: new FileReadingFailedError({ filePath: typeScriptConfigurationFileAbsolutePath }),
        title: FileReadingFailedError.localization.defaultTitle,
        occurrenceLocation: "TypeScriptSpecialist.readTypeScriptConfigurationFileAndGetCompilerOptions" +
            "(typeScriptConfigurationFileAbsolutePath)",
        innerError: error
      });

    }


    if (isNotUndefined(typeScriptFileReadingResult.error)) {

      Logger.throwErrorAndLog({
        errorInstance: new FileReadingFailedError({ filePath: typeScriptConfigurationFileAbsolutePath }),
        title: FileReadingFailedError.localization.defaultTitle,
        occurrenceLocation: "TypeScriptSpecialist.readTypeScriptConfigurationFileAndGetCompilerOptions" +
            "(typeScriptConfigurationFileAbsolutePath)",
        innerError: isNonEmptyString(typeScriptFileReadingResult.error.messageText) ?
            typeScriptFileReadingResult.error.messageText : typeScriptFileReadingResult.error.messageText.messageText
      });

    }


    if (!isArbitraryObject(typeScriptFileReadingResult.config) || !("compilerOptions" in typeScriptFileReadingResult.config)) {
      Logger.throwErrorAndLog({
        errorInstance: new InvalidConfigError({
          mentionToConfig: `TypeScript (${ typeScriptConfigurationFileAbsolutePath })`
        }),
        title: InvalidConfigError.localization.defaultTitle,
        occurrenceLocation: "TypeScriptSpecialist.readTypeScriptConfigurationFileAndGetCompilerOptions" +
            "(typeScriptConfigurationFileAbsolutePath)"
      });
    }


    let typeCompilerOptionsConfigurationParsingResult: Readonly<{
      options: TypeScript.CompilerOptions;
      errors: Array<TypeScript.Diagnostic>;
    }>;

    try {

      typeCompilerOptionsConfigurationParsingResult = TypeScript.
        convertCompilerOptionsFromJson(
          typeScriptFileReadingResult.config.compilerOptions,
          ImprovedPath.extractDirectoryFromFilePath({
            targetPath: typeScriptConfigurationFileAbsolutePath,
            alwaysForwardSlashSeparators: true,
            ambiguitiesResolution: {
              mustConsiderLastSegmentStartingWithDotAsDirectory: false,
              mustConsiderLastSegmentWithNonLeadingDotAsDirectory: false,
              mustConsiderLastSegmentWihtoutDotsAsFileNameWithoutExtension: true
            }
          })
      );

    } catch (error: unknown) {

      Logger.throwErrorAndLog({
        errorInstance: new FileReadingFailedError({ filePath: typeScriptConfigurationFileAbsolutePath }),
        title: FileReadingFailedError.localization.defaultTitle,
        occurrenceLocation: "TypeScriptSpecialist.readTypeScriptConfigurationFileAndGetCompilerOptions" +
            "(typeScriptConfigurationFileAbsolutePath)",
        innerError: error
      });

    }


    if (typeCompilerOptionsConfigurationParsingResult.errors.length > 0) {

      Logger.throwErrorAndLog({
        errorInstance: new FileReadingFailedError({ filePath: typeScriptConfigurationFileAbsolutePath }),
        title: FileReadingFailedError.localization.defaultTitle,
        occurrenceLocation: "TypeScriptSpecialist.readTypeScriptConfigurationFileAndGetCompilerOptions" +
            "(typeScriptConfigurationFileAbsolutePath)",
        innerError: typeCompilerOptionsConfigurationParsingResult.errors.
            map(
              (error: TypeScript.Diagnostic): string =>
                  (isNonEmptyString(error.messageText) ? error.messageText : error.messageText.messageText)
            ).
            join("\n")
      });

    }


    return typeCompilerOptionsConfigurationParsingResult.options;

  }

}
