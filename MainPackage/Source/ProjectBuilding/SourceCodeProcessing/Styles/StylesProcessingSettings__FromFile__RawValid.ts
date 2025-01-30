/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import ConsumingProjectBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";

/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid from
    "@ProjectBuilding:Common/RawConfig/SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid";
import RevisioningSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/RevisioningSettings__FromFile__RawValid";
import LintingSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/LintingSettings__FromFile__RawValid";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { RawObjectDataProcessor } from "@yamato-daiwa/es-extensions";


type StylesProcessingSettings__FromFile__RawValid = Readonly<{
  common?: StylesProcessingSettings__FromFile__RawValid.Common;
  linting?: StylesProcessingSettings__FromFile__RawValid.Linting;
  entryPointsGroups: Readonly<{ [groupID: string]: StylesProcessingSettings__FromFile__RawValid.EntryPointsGroup; }>;
  logging?: StylesProcessingSettings__FromFile__RawValid.Logging;
}>;


namespace StylesProcessingSettings__FromFile__RawValid {

  /* ━━━ Common ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type Common = Readonly<{
    buildingModeDependent?: Readonly<{ [projectBuildingMode: string]: Common.BuildingModeDependent | undefined; }>;
  }>;

  export namespace Common {
    export type BuildingModeDependent = Readonly<{
      secondsBetweenFileUpdatingAndStartingOfRebuilding?: number;
    }>;
  }


  /* ━━━ Linting ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type Linting = LintingSettings__FromFile__RawValid;


  /* ━━━ Entry Points Group ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
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


  /* ━━━ Logging ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
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
  export const propertiesSpecification: RawObjectDataProcessor.PropertiesSpecification = {

    $common: {

      newName: "common",
      type: Object,
      isUndefinedForbidden: false,
      mustTransformNullToUndefined: true,

      properties: {

        $buildingModeDependent: {

          newName: "buildingModeDependent",

          type: RawObjectDataProcessor.ValuesTypesIDs.associativeArray,

          isUndefinedForbidden: false,
          isNullForbidden: true,
          areUndefinedTypeValuesForbidden: true,
          areNullTypeValuesForbidden: true,

          minimalEntriesCount: 1,

          allowedKeys: [
            "$staticPreview",
            "$localDevelopment",
            "$testing",
            "$staging",
            "$production"
          ],

          keysRenamings: {
            $staticPreview: ConsumingProjectBuildingModes.staticPreview,
            $localDevelopment: ConsumingProjectBuildingModes.localDevelopment,
            $testing: ConsumingProjectBuildingModes.testing,
            $staging: ConsumingProjectBuildingModes.staging,
            $production: ConsumingProjectBuildingModes.production
          },

          value: {

            type: Object,

            properties: {

              $secondsBetweenFileUpdatingAndStartingOfRebuilding: {
                newName: "secondsBetweenFileUpdatingAndStartingOfRebuilding",
                type: Number,
                numbersSet: RawObjectDataProcessor.NumbersSets.naturalNumber,
                isUndefinedForbidden: false,
                isNullForbidden: true
              },

              $mustResolveResourceReferencesToRelativePaths: {
                newName: "mustResolveResourceReferencesToRelativePaths",
                type: Boolean,
                isUndefinedForbidden: false,
                isNullForbidden: true
              }

            }

          }

        }

      }

    },

    $linting: {
      newName: "linting",
      type: Object,
      isUndefinedForbidden: false,
      mustTransformNullToUndefined: true,
      properties: LintingSettings__FromFile__RawValid.propertiesSpecification
    },

    ...SourceCodeProcessingSettingsGenericProperties__FromFile__RawValid.generatePropertiesSpecification({
      entryPointsGroupBuildingModeDependentSpecificSettingsLocalizedPropertiesSpecification: {
        $revisioning: {
          newName: "revisioning",
          type: Object,
          isUndefinedForbidden: false,
          mustTransformNullToUndefined: true,
          properties: RevisioningSettings__FromFile__RawValid.propertiesSpecification
        }
      }
    }),

    $logging: {

      newName: "logging",
      type: Object,
      isUndefinedForbidden: false,
      mustTransformNullToUndefined: true,

      properties: {

        $filesPaths: {
          newName: "filesPaths",
          type: Boolean,
          isUndefinedForbidden: false,
          isNullForbidden: true
        },

        $filesCount: {
          newName: "filesCount",
          type: Boolean,
          isUndefinedForbidden: false,
          isNullForbidden: true
        },

        $partialFilesAndParentEntryPointsCorrespondence: {
          newName: "partialFilesAndParentEntryPointsCorrespondence",
          type: Boolean,
          isUndefinedForbidden: false,
          isNullForbidden: true
        },

        $filesWatcherEvents: {
          newName: "filesWatcherEvents",
          type: Boolean,
          isUndefinedForbidden: false,
          isNullForbidden: true
        },

        $linting: {

          newName: "linting",
          type: Object,
          isUndefinedForbidden: false,
          mustTransformNullToUndefined: true,

          properties: {

            $starting: {
              newName: "starting",
              type: Boolean,
              isUndefinedForbidden: false,
              isNullForbidden: true
            },

            $completionWithoutIssues: {
              newName: "completionWithoutIssues",
              type: Boolean,
              isUndefinedForbidden: false,
              isNullForbidden: true
            }

          }

        }

      }

    }

  };

}


export default StylesProcessingSettings__FromFile__RawValid;
