/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import type ConsumingProjectBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";

/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid from
    "@ProjectBuilding:Common/RawConfig/SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid";
import type ConsumingProjectPreDefinedBuildingModes__Localized from
    "@ProjectBuilding/Common/RawConfig/Enumerations/ConsumingProjectPreDefinedBuildingModes__Localized";
import type RevisioningSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/RevisioningSettings__FromFile__RawValid";
import type LintingSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/LintingSettings__FromFile__RawValid";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { RawObjectDataProcessor, nullToUndefined } from "@yamato-daiwa/es-extensions";


type StylesProcessingSettings__FromFile__RawValid = Readonly<{
  common?: StylesProcessingSettings__FromFile__RawValid.Common;
  linting?: StylesProcessingSettings__FromFile__RawValid.Linting;
  entryPointsGroups: Readonly<{ [groupID: string]: StylesProcessingSettings__FromFile__RawValid.EntryPointsGroup; }>;
  logging?: StylesProcessingSettings__FromFile__RawValid.Logging;
}>;


namespace StylesProcessingSettings__FromFile__RawValid {

  /* ━━━ Types ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type Common = Readonly<{ periodBetweenFileUpdatingAndRebuildingStarting__seconds?: number; }>;


  export type Linting = LintingSettings__FromFile__RawValid;


  export type EntryPointsGroup =
      SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.EntryPointsGroup &
      Readonly<{
        buildingModeDependent: Readonly<{
          [projectBuildingMode in ConsumingProjectBuildingModes]: EntryPointsGroup.BuildingModeDependent;
        }>;
      }>;

  export namespace EntryPointsGroup {

    export type BuildingModeDependent =
        SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.EntryPointsGroup.BuildingModeDependent &
        Readonly<{ revisioning?: RevisioningSettings__FromFile__RawValid; }>;

  }


  export type Logging = Readonly<{

    filesPaths?: boolean;
    filesCount?: boolean;
    partialFilesAndParentEntryPointsCorrespondence?: boolean;
    filesWatcherEvents?: boolean;

    linting: Readonly<{
      starting?: boolean;
      completionWithoutIssues?: boolean;
    }>;

  }>;


  /* ━━━ Localization ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type Localization = Readonly<{

    common: Readonly<{
      KEY: string;
      periodBetweenFileUpdatingAndRebuildingStarting__seconds: { KEY: string; };
    }>;

    linting: Readonly<{ KEY: string; }>;

    entryPointsGroups: Readonly<{

      KEY: string;

      buildingModeDependent: Readonly<{
        KEY: string;
        outputTopDirectoryRelativePath: Readonly<{ KEY: string; }>;
        revisioning: Readonly<{ KEY: string; }>;
      }>;

    }>;

    logging: Readonly<{

      KEY: string;

      filesPaths: Readonly<{ KEY: string; }>;
      filesCount: Readonly<{ KEY: string; }>;
      partialFilesAndParentEntryPointsCorrespondence: Readonly<{ KEY: string; }>;
      filesWatcherEvents: Readonly<{ KEY: string; }>;

      linting: Readonly<{
        KEY: string;
        starting: Readonly<{ KEY: string; }>;
        completionWithoutIssues: Readonly<{ KEY: string; }>;
      }>;

    }>;

  }>;

  export function getLocalizedPropertiesSpecification(
    {
      stylesProcessingPropertiesLocalization,
      localizedConsumingProjectLocalizedPreDefinedBuildingModes,
      lintingSettingsLocalizedPropertiesSpecification,
      revisioningSettingsLocalizedPropertiesSpecification,
      sourceCodeProcessingSettingsGenericPropertiesLocalization,
      entryPointsGroupBuildingModeDependentOutputGenericSettingsLocalizedPropertiesSpecification
    }: Readonly<{
      stylesProcessingPropertiesLocalization: Localization;
      localizedConsumingProjectLocalizedPreDefinedBuildingModes: ConsumingProjectPreDefinedBuildingModes__Localized;
      lintingSettingsLocalizedPropertiesSpecification: RawObjectDataProcessor.PropertiesSpecification;
      revisioningSettingsLocalizedPropertiesSpecification: RawObjectDataProcessor.PropertiesSpecification;
      sourceCodeProcessingSettingsGenericPropertiesLocalization:
          SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.Localization;
      entryPointsGroupBuildingModeDependentOutputGenericSettingsLocalizedPropertiesSpecification: RawObjectDataProcessor.
          PropertiesSpecification;
    }>
  ): RawObjectDataProcessor.PropertiesSpecification {

    return {

      [stylesProcessingPropertiesLocalization.common.KEY]: {

        newName: "common",
        type: Object,
        required: false,
        preValidationModifications: nullToUndefined,

        properties: {
          [stylesProcessingPropertiesLocalization.common.periodBetweenFileUpdatingAndRebuildingStarting__seconds.KEY]: {
            newName: "periodBetweenFileUpdatingAndRebuildingStarting__seconds",
            type: Number,
            required: false,
            numbersSet: RawObjectDataProcessor.NumbersSets.naturalNumber
          }
        }

      },

      [stylesProcessingPropertiesLocalization.linting.KEY]: {
        newName: "linting",
        type: Object,
        required: false,
        preValidationModifications: nullToUndefined,
        properties: lintingSettingsLocalizedPropertiesSpecification
      },

      ...SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.getLocalizedPropertiesSpecification({
        sourceCodeProcessingSettingsGenericPropertiesLocalization,
        localizedConsumingProjectLocalizedPreDefinedBuildingModes,
        entryPointsGroupBuildingModeDependentOutputGenericSettingsLocalizedPropertiesSpecification,
        entryPointsGroupBuildingModeDependentSpecificSettingsLocalizedPropertiesSpecification: {
          [stylesProcessingPropertiesLocalization.entryPointsGroups.buildingModeDependent.revisioning.KEY]: {
            newName: "revisioning",
            type: Object,
            required: false,
            preValidationModifications: nullToUndefined,
            properties: revisioningSettingsLocalizedPropertiesSpecification
          }
        }
      }),

      [stylesProcessingPropertiesLocalization.logging.KEY]: {

        newName: "logging",
        type: Object,
        required: false,
        preValidationModifications: nullToUndefined,

        properties: {

          [stylesProcessingPropertiesLocalization.logging.filesPaths.KEY]: {
            newName: "filesPaths",
            type: Boolean,
            required: false
          },

          [stylesProcessingPropertiesLocalization.logging.filesCount.KEY]: {
            newName: "filesCount",
            type: Boolean,
            required: false
          },

          [stylesProcessingPropertiesLocalization.logging.partialFilesAndParentEntryPointsCorrespondence.KEY]: {
            newName: "partialFilesAndParentEntryPointsCorrespondence",
            type: Boolean,
            required: false
          },

          [stylesProcessingPropertiesLocalization.logging.filesWatcherEvents.KEY]: {
            newName: "filesWatcherEvents",
            type: Boolean,
            required: false
          },

          [stylesProcessingPropertiesLocalization.logging.linting.KEY]: {

            newName: "linting",
            type: Object,
            required: false,
            preValidationModifications: nullToUndefined,

            properties: {

              [stylesProcessingPropertiesLocalization.logging.linting.starting.KEY]: {
                newName: "starting",
                type: Boolean,
                required: false
              },

              [stylesProcessingPropertiesLocalization.logging.linting.completionWithoutIssues.KEY]: {
                newName: "completionWithoutIssues",
                type: Boolean,
                required: false
              }

            }

          }

        }

      }

    };

  }

}


export default StylesProcessingSettings__FromFile__RawValid;
