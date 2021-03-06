import FileSystem from "fs";

import YAML from "yamljs";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";

import {
  Logger,
  InvalidParameterValueError,
  FileReadingFailedError,
  InvalidExternalDataError,
  RawObjectDataProcessor,
  isNotUndefined,
  isNull
} from "@yamato-daiwa/es-extensions";
import type { ArbitraryObject } from "@yamato-daiwa/es-extensions";
import { isErrnoException } from "@yamato-daiwa/es-extensions-nodejs";
import FileNotFoundError from "@UtilsIncubator/Logging/Errors/FileNotFoundError";
import DesiredFileActuallyIsDirectoryError from "@UtilsIncubator/Logging/Errors/DesiredFileActuallyIsDirectoryError";


class ObjectDataFilesProcessor {

  public static processFile<ValidData extends ArbitraryObject>(
    namedParameters: {
      filePath: string;
      validDataSpecification: RawObjectDataProcessor.ObjectDataSpecification;
      schema?: ObjectDataFilesProcessor.SupportedSchemas;
    }
  ): ValidData {

    const filePath: string = namedParameters.filePath;
    let dataSchema: ObjectDataFilesProcessor.SupportedSchemas;

    if (isNotUndefined(namedParameters.schema)) {
      dataSchema = namedParameters.schema;
    } else {

      const fileNameLastExtension: string | null = ImprovedPath.extractLastFilenameExtensionWithoutFirstDot(filePath);

      if (isNull(fileNameLastExtension)) {
        Logger.throwErrorAndLog({
          errorInstance: new InvalidParameterValueError({
            parameterName: "namedParameters.filePath",
            messageSpecificPart: "Unable to decide the data parsing algorithm because target file " +
                `'${ namedParameters.filePath }' has no explicit filename extension. If it is intentional, ` +
                "specify 'namedParameters.dataSchema' with desired element of 'ObjectDataFilesProcessor.SupportedSchemas'" +
                "enumeration."
          }),
          title: InvalidParameterValueError.localization.defaultTitle,
          occurrenceLocation: "ObjectDataFilesProcessor.processFile(namedParameters)"
        });
      }


      switch (fileNameLastExtension) {

        case "json": {
          dataSchema = ObjectDataFilesProcessor.SupportedSchemas.JSON;
          break;
        }

        case "yaml":
        case "yml": {
          dataSchema = ObjectDataFilesProcessor.SupportedSchemas.YAML;
          break;
        }

        default: {

          Logger.throwErrorAndLog({
            errorInstance: new InvalidParameterValueError({
              parameterName: "namedParameters.filePath",
              messageSpecificPart: `Target file '${ namedParameters.filePath }' has unsupported filename extension ` +
                  `'${ fileNameLastExtension }'. If this file including the data of known for 'ObjectDataFilesProcessor' ` +
                  "schema, specify 'namedParameters.dataSchema' with desired element of " +
                  "'ObjectDataFilesProcessor.SupportedSchemas' enumeration"
            }),
            title: InvalidParameterValueError.localization.defaultTitle,
            occurrenceLocation: "ObjectDataFilesProcessor.processFile(namedParameters)"
          });
        }
      }
    }


    let targetFileStatistics: FileSystem.Stats;

    try {

      targetFileStatistics = FileSystem.statSync(filePath);

    } catch (error: unknown) {

      if (isErrnoException(error) && error.code === "ENOENT") {
        Logger.throwErrorAndLog({
          errorInstance: new FileNotFoundError({ filePath }),
          title: FileNotFoundError.localization.defaultTitle,
          occurrenceLocation: "ObjectDataFilesProcessor.processFile(namedParameters)",
          wrappableError: error
        });
      }

      throw error;
    }


    if (!targetFileStatistics.isFile()) {
      Logger.throwErrorAndLog({
        errorInstance: new DesiredFileActuallyIsDirectoryError({ targetPath: filePath }),
        title: DesiredFileActuallyIsDirectoryError.localization.defaultTitle,
        occurrenceLocation: "ObjectDataFilesProcessor.processFile(namedParameters)"
      });
    }


    let rawData: string;

    try {

      rawData = FileSystem.readFileSync(filePath, "utf-8");

    } catch (error: unknown) {
      Logger.throwErrorAndLog({
        errorInstance: new FileReadingFailedError({ filePath }),
        title: FileReadingFailedError.localization.defaultTitle,
        occurrenceLocation: "ObjectDataFilesProcessor.processFile(namedParameters)"
      });
    }


    let parsedData: unknown;

    try {

      switch (dataSchema) {

        case ObjectDataFilesProcessor.SupportedSchemas.JSON: {
          parsedData = JSON.parse(rawData);
          break;
        }

        case ObjectDataFilesProcessor.SupportedSchemas.YAML: {
          parsedData = YAML.parse(rawData);
          break;
        }
      }

    } catch (error: unknown) {
      Logger.throwErrorAndLog({
        errorInstance: new InvalidExternalDataError({ mentionToExpectedData: filePath }),
        title: InvalidExternalDataError.localization.defaultTitle,
        occurrenceLocation: "ObjectDataFilesProcessor.processFile(namedParameters)",
        wrappableError: error
      });
    }


    const processingResult: RawObjectDataProcessor.ProcessingResult<ValidData> =
        RawObjectDataProcessor.process(parsedData, namedParameters.validDataSpecification);

    if (processingResult.rawDataIsInvalid) {
      Logger.throwErrorAndLog({
        errorInstance: new InvalidExternalDataError({
          customMessage: `The contents of file '${ filePath }' does not matching with valid data specification:\n` +
              `${ RawObjectDataProcessor.formatValidationErrorsList(processingResult.validationErrorsMessages) }`
        }),
        title: InvalidExternalDataError.localization.defaultTitle,
        occurrenceLocation: "ObjectDataFilesProcessor.processFile(namedParameters)"
      });
    }


    return processingResult.processedData;
  }
}

namespace ObjectDataFilesProcessor {
  export enum SupportedSchemas {
    JSON = "JSON",
    /* eslint-disable-next-line @typescript-eslint/no-shadow --
     * The declaring of type/interface inside namespace with same name as defined in upper scope
     * is completely valid TypeScript and not desired to be warned by @typescript-eslint. */
    YAML = "YAML"
  }
}


export default ObjectDataFilesProcessor;
