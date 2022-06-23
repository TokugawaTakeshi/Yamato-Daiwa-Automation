/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type StylesProcessingSettings__Normalized from "@StylesProcessing/StylesProcessingSettings__Normalized";
import type ProjectBuildingConfig__Normalized from "@ProjectBuilding/ProjectBuildingConfig__Normalized";

/* --- Settings representatives ------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import GulpStreamBasedSourceCodeProcessingConfigRepresentative from
    "@ProjectBuilding/Common/SettingsRepresentatives/GulpStreamBasedSourceCodeProcessingConfigRepresentative";

/* --- Libraries specialists ---------------------------------------------------------------------------------------- */
import StylusPreProcessorSpecialist from "@ThirdPartySolutionsSpecialists/StylusPreProcessorSpecialist";

/* --- Auxiliaries -------------------------------------------------------------------------------------------------- */
import {
  Logger,
  UnexpectedEventError,
  isNull
} from "@yamato-daiwa/es-extensions";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";
import PoliteErrorsMessagesBuilder from "@Utils/PoliteErrorsMessagesBuilder";


class StylesProcessingSettingsRepresentative extends GulpStreamBasedSourceCodeProcessingConfigRepresentative<
  StylesProcessingSettings__Normalized.Common, StylesProcessingSettings__Normalized.EntryPointsGroup
> {

  static #localization: StylesProcessingSettingsRepresentative.Localization = {
    targetFilesType: {
      singularForm: "stylesheet",
      pluralForm: "stylesheets"
    },
    errorsMessagesData: {
      unableToDecideMustFileBePrecessedByStylusPreProcessorBecauseFileNameExtensionIsMissing: {
        generateTechnicalDetails({ filePath }: { filePath: string; }): string {
          return `Unable to decide must file '${ filePath }' be processed by Stylus pre-processor or not because this \n` +
              "file has no filename extension.";
        },
        generatePoliteExplanation({ filePath }: { filePath: string; }): string {
          return `The styles processor tried to check must file with path ${ filePath } be processed by Stylus pre-processor ` +
              "or no. To check this, it is required to confirm the filename extension, but name of target file has no " +
              "extension. During normal operation, only files with appropriate filename extensions being included to " +
              "selection which will be processed while this time file without filename extension has been included " +
              "to selection. It means we missed something when developed the algorithm or logic mistake in code was made.";
        }
      }
    },
    warningsData: {
      noRelevantEntryPointsSettings: {
        title: "Styles processing idle",
        generateDescription({ projectBuildingMode }: { projectBuildingMode: string; }): string {
          return `No styles processing settings has been specified for project building mode '${ projectBuildingMode }'` +
              "and/or current selective execution.";
        }
      }
    }
  };

  public readonly supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: Array<string>;
  public readonly TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM: string = StylesProcessingSettingsRepresentative.#localization.
      targetFilesType.singularForm;
  public readonly TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM: string = StylesProcessingSettingsRepresentative.#localization.
      targetFilesType.pluralForm;
  public readonly waitingForTheOtherFilesWillBeSavedPeriod__seconds: number;
  public readonly prefixOfAliasOfTopDirectoryOfEntryPointsGroup: string = "@";

  public readonly sourceCodeLintingCommonSettings: StylesProcessingSettings__Normalized.Linting;
  public readonly sourceAndOutputFilesAbsolutePathsCorrespondenceMap: Map<string, string> = new Map<string, string>();

  public readonly relevantEntryPointsGroupsSettings: Map<
    ProjectBuildingConfig__Normalized.EntryPointsGroupID, StylesProcessingSettings__Normalized.EntryPointsGroup
  >;

  protected readonly sourceCodeProcessingCommonSettings: StylesProcessingSettings__Normalized.Common;


  public static mustFileBeProcessedByStylus(targetFilePath: string): boolean {

    const filenameExtensionOfTargetFile: string | null = ImprovedPath.
        extractLastFilenameExtensionWithoutFirstDot(targetFilePath);

    if (isNull(filenameExtensionOfTargetFile)) {
      Logger.throwErrorAndLog({
        errorInstance: new UnexpectedEventError(PoliteErrorsMessagesBuilder.buildMessage({
          technicalDetails: StylesProcessingSettingsRepresentative.#localization.errorsMessagesData.
              unableToDecideMustFileBePrecessedByStylusPreProcessorBecauseFileNameExtensionIsMissing.
              generateTechnicalDetails({ filePath: targetFilePath }),
          politeExplanation: StylesProcessingSettingsRepresentative.#localization.errorsMessagesData.
              unableToDecideMustFileBePrecessedByStylusPreProcessorBecauseFileNameExtensionIsMissing.
              generatePoliteExplanation({ filePath: targetFilePath })
        })),
        occurrenceLocation: "StylesProcessingSettingsRepresentative.mustFileBeProcessedByStylus(targetFilePath)",
        title: UnexpectedEventError.localization.defaultTitle
      });
    }


    return StylusPreProcessorSpecialist.supportedFileNamesExtensionsWithoutPrependedDots.includes(filenameExtensionOfTargetFile);
  }


  public constructor(
    normalizedStylesProcessingSettings: StylesProcessingSettings__Normalized,
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ) {

    super(projectBuildingMasterConfigRepresentative);

    this.sourceCodeProcessingCommonSettings = normalizedStylesProcessingSettings.common;
    this.sourceCodeLintingCommonSettings = normalizedStylesProcessingSettings.linting;
    this.relevantEntryPointsGroupsSettings = normalizedStylesProcessingSettings.
        entryPointsGroupsActualForCurrentProjectBuildingMode;

    if (this.relevantEntryPointsGroupsSettings.size === 0) {
      Logger.logWarning({
        title: StylesProcessingSettingsRepresentative.#localization.warningsData.noRelevantEntryPointsSettings.title,
        description: StylesProcessingSettingsRepresentative.#localization.warningsData.noRelevantEntryPointsSettings.
            generateDescription({ projectBuildingMode: this.masterConfigRepresentative.consumingProjectBuildingMode })
      });
    }

    this.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots = normalizedStylesProcessingSettings.common.
        supportedSourceFileNameExtensionsWithoutLeadingDots;
    this.waitingForTheOtherFilesWillBeSavedPeriod__seconds = normalizedStylesProcessingSettings.common.
        waitingForSubsequentFilesWillBeSavedPeriod__seconds;

    super.initializeOrUpdatePartialFilesAndEntryPointsRelationsMap();
  }


  public get entryPointsGroupsNormalizedSettingsMappedByPathAliases(): Map<
    string, StylesProcessingSettings__Normalized.EntryPointsGroup
  > {
    return new Map<string, StylesProcessingSettings__Normalized.EntryPointsGroup>(
        Array.from(this.relevantEntryPointsGroupsSettings.values()).map(
          (entryPointsGroupSettings: StylesProcessingSettings__Normalized.EntryPointsGroup):
              [ string, StylesProcessingSettings__Normalized.EntryPointsGroup ] =>
                  [
                    entryPointsGroupSettings.entryPointsSourceFilesTopDirectoryOrSingleFilePathAliasForReferencingFromHTML,
                    entryPointsGroupSettings
                  ]
        )
    );
  }
}


/* eslint-disable-next-line @typescript-eslint/no-redeclare --
 * The merging of type/interface and namespace is completely valid TypeScript,
 * but @typescript-eslint community does not wish to support it.
 * https://github.com/eslint/eslint/issues/15504 */
namespace StylesProcessingSettingsRepresentative {

  export type Localization = {
    targetFilesType: {
      singularForm: string;
      pluralForm: string;
    };
    errorsMessagesData: {
      unableToDecideMustFileBePrecessedByStylusPreProcessorBecauseFileNameExtensionIsMissing: {
        generateTechnicalDetails: (parametersObject: { filePath: string; }) => string;
        generatePoliteExplanation: (parametersObject: { filePath: string; }) => string;
      };
    };
    warningsData: {
      noRelevantEntryPointsSettings: {
        title: string;
        generateDescription: (parametersObject: { projectBuildingMode: string; }) => string;
      };
    };
  };
}


export default StylesProcessingSettingsRepresentative;
