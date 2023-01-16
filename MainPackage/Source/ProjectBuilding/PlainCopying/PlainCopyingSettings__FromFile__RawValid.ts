/* --- Restrictions ------------------------------------------------------------------------------------------------- */
import ConsumingProjectPreDefinedBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectPreDefinedBuildingModes";

/* --- Raw valid settings ------------------------------------------------------------------------------------------- */
import type ConsumingProjectPreDefinedBuildingModes__Localized from
    "@ProjectBuilding/Common/RawConfig/Enumerations/ConsumingProjectPreDefinedBuildingModes__Localized";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import { RawObjectDataProcessor, nullToUndefined, isNonEmptyString } from "@yamato-daiwa/es-extensions";
import type { ArbitraryObject } from "@yamato-daiwa/es-extensions";


type PlainCopyingSettings__FromFile__RawValid = Readonly<{
  filesGroups: Readonly<{ [filesGroupID: string]: PlainCopyingSettings__FromFile__RawValid.FilesGroup; }>;
}>;


namespace PlainCopyingSettings__FromFile__RawValid {

  export type FilesGroup =
      Readonly<
        (
          { sourceFileRelativePath: string; } |
          { sourceDirectoryRelativePath: string; }
        ) &
        {
          referenceName?: string;
          buildingModeDependent: Readonly<{
            [projectBuildingMode in ConsumingProjectPreDefinedBuildingModes]: FilesGroup.BuildingModeDependent | undefined;
          }>;
        }
      >;

  export namespace FilesGroup {

    export type BuildingModeDependent = Readonly<{
      outputTopDirectoryRelativePath: string | undefined;
    }>;

  }

  /* === Localization =============================================================================================== */
  export type Localization = Readonly<{
    filesGroups: Readonly<{ KEY: string; }>;
    sourceFileRelativePath: Readonly<{ KEY: string; }>;
    sourceDirectoryRelativePath: Readonly<{
      KEY: string;
      REQUIREMENT_CONDITION_DESCRIPTION: string;
    }>;
    referenceName: Readonly<{ KEY: string; }>;
    buildingModeDependent: Readonly<{
      KEY: string;
      sourceDirectoryRelativePath: Readonly<{ KEY: string; }>;
    }>;
  }>;

  export function getLocalizedPropertiesSpecification(
    {
      plainCopyingLocalization,
      consumingProjectLocalizedPreDefinedBuildingModes
    }: Readonly<{
      plainCopyingLocalization: Localization;
      consumingProjectLocalizedPreDefinedBuildingModes: ConsumingProjectPreDefinedBuildingModes__Localized;
    }>
  ): RawObjectDataProcessor.PropertiesSpecification {

    return {

      [plainCopyingLocalization.filesGroups.KEY]: {

        newName: "filesGroups",
        type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
        required: true,

        value: {

          type: Object,
          properties: {

            [plainCopyingLocalization.sourceFileRelativePath.KEY]: {
              newName: "sourceFileRelativePath",
              preValidationModifications: nullToUndefined,
              type: String,
              required: false
            },

            [plainCopyingLocalization.sourceDirectoryRelativePath.KEY]: {
              newName: "sourceDirectoryRelativePath",
              preValidationModifications: nullToUndefined,
              type: String,
              requiredIf: {
                predicate: (rawObjectOfCurrentDepthLevel: ArbitraryObject): boolean =>
                    !isNonEmptyString(rawObjectOfCurrentDepthLevel[plainCopyingLocalization.sourceFileRelativePath.KEY]), // TODO 確認必要
                descriptionForLogging: plainCopyingLocalization.sourceDirectoryRelativePath.REQUIREMENT_CONDITION_DESCRIPTION
              }
            },

            [plainCopyingLocalization.referenceName.KEY]: {
              newName: "referenceName",
              preValidationModifications: nullToUndefined,
              type: String,
              required: false
            },

            [plainCopyingLocalization.buildingModeDependent.KEY]: {

              newName: "buildingModeDependent",
              type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
              required: true,
              allowedKeys: Object.values(ConsumingProjectPreDefinedBuildingModes),
              minimalEntriesCount: 1,

              keysRenamings: {
                [consumingProjectLocalizedPreDefinedBuildingModes.staticPreview]:
                    ConsumingProjectPreDefinedBuildingModes.staticPreview,
                [consumingProjectLocalizedPreDefinedBuildingModes.localDevelopment]:
                    ConsumingProjectPreDefinedBuildingModes.localDevelopment,
                [consumingProjectLocalizedPreDefinedBuildingModes.testing]:
                    ConsumingProjectPreDefinedBuildingModes.testing,
                [consumingProjectLocalizedPreDefinedBuildingModes.staging]:
                    ConsumingProjectPreDefinedBuildingModes.staging,
                [consumingProjectLocalizedPreDefinedBuildingModes.production]:
                    ConsumingProjectPreDefinedBuildingModes.production
              },

              value: {

                type: Object,

                properties: {
                  [plainCopyingLocalization.buildingModeDependent.sourceDirectoryRelativePath.KEY]: {
                    newName: "sourceDirectoryRelativePath",
                    type: String,
                    required: true
                  }
                }

              }

            }

          }

        }

      }

    };

  }

}


export default PlainCopyingSettings__FromFile__RawValid;
