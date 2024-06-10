/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import ConsumingProjectBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";

/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import type ConsumingProjectPreDefinedBuildingModes__Localized from
    "@ProjectBuilding/Common/RawConfig/Enumerations/ConsumingProjectPreDefinedBuildingModes__Localized";
import type OutputDirectoryPathTransformationsSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/OutputDirectoryPathTransformationsSettings__FromFile__RawValid";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import { RawObjectDataProcessor, nullToUndefined, isUndefined } from "@yamato-daiwa/es-extensions";
import type { ArbitraryObject } from "@yamato-daiwa/es-extensions";


type PlainCopyingSettings__FromFile__RawValid = Readonly<{
  filesGroups: Readonly<{ [filesGroupID: string]: PlainCopyingSettings__FromFile__RawValid.FilesGroup; }>;
}>;


namespace PlainCopyingSettings__FromFile__RawValid {

  /* ━━━ Types ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type FilesGroup = FilesGroup.Singular | FilesGroup.Plural;

  export namespace FilesGroup {

    export type CommonProperties = Readonly<{
      aliasName?: string;
    }>;

    export namespace CommonProperties {

      export type BuildingModeDependent = Readonly<{
        revisioning?: BuildingModeDependent.Revisioning;
      }>;

      export namespace BuildingModeDependent {

        export type Revisioning = Readonly<{
          enable?: boolean;
          contentHashPostfixSeparator?: string;
        }>;

      }

    }


    export type Singular =
        CommonProperties &
        Readonly<{
          sourceFileRelativePath: string;
          buildingModeDependent: Readonly<{
            [projectBuildingMode in ConsumingProjectBuildingModes]: Singular.BuildingModeDependent | undefined;
          }>;
        }>;

    export namespace Singular {
      export type BuildingModeDependent =
          CommonProperties.BuildingModeDependent &
          Readonly<{
            outputDirectoryRelativePath: string;
            newFileNameWithExtension?: string;
          }>;
    }


    export type Plural =
        CommonProperties &
        Readonly<{
          sourceTopDirectoryRelativePath: string;
          fileNameLastExtensions?: ReadonlyArray<string>;
          buildingModeDependent: Readonly<{
            [projectBuildingMode in ConsumingProjectBuildingModes]: Plural.BuildingModeDependent | undefined;
          }>;
        }>;

    export namespace Plural {

      export type BuildingModeDependent =
          CommonProperties.BuildingModeDependent &
          Readonly<{
            outputTopDirectoryRelativePath: string;
            filesRenamings?: Array<FileRenaming>;
            outputDirectoryPathTransformations?: OutputDirectoryPathTransformationsSettings__FromFile__RawValid;
          }>;

      export type FileRenaming = Readonly<{
        pathRelativeToSourceDirectory: string;
        newFileNameWithExtension: string;
      }>;

    }

  }

  /* ━━━ Localization ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type Localization = Readonly<{

    filesGroups: Readonly<{ KEY: string; }>;

    sourceFileRelativePath: Readonly<{ KEY: string; }>;
    sourceTopDirectoryRelativePath: Readonly<{
      KEY: string;
      REQUIREMENT_CONDITION_DESCRIPTION: string;
    }>;

    fileNameLastExtensions: Readonly<{ KEY: string; }>;

    aliasName: Readonly<{ KEY: string; }>;

    buildingModeDependent: Readonly<{

      KEY: string;

      outputDirectoryRelativePath: Readonly<{ KEY: string; }>;
      outputTopDirectoryRelativePath: Readonly<{ KEY: string; }>;
      revisioning: Readonly<{
        KEY: string;
        enable: Readonly<{ KEY: string; }>;
        contentHashPostfixSeparator: Readonly<{ KEY: string; }>;
      }>;

      newFileNameWithExtension: Readonly<{ KEY: string; }>;

      filesRenamings: Readonly<{
        KEY: string;
        pathRelativeToSourceDirectory: Readonly<{ KEY: string; }>;
        newFileNameWithExtension: Readonly<{ KEY: string; }>;
      }>;

      outputDirectoryPathTransformations: Readonly<{ KEY: string; }>;

    }>;

  }>;

  export function getLocalizedPropertiesSpecification(
    {
      plainCopyingLocalization,
      consumingProjectLocalizedPreDefinedBuildingModes,
      outputDirectoryPathTransformationsPropertiesLocalizedSpecification
    }: Readonly<{
      plainCopyingLocalization: Localization;
      consumingProjectLocalizedPreDefinedBuildingModes: ConsumingProjectPreDefinedBuildingModes__Localized;
      outputDirectoryPathTransformationsPropertiesLocalizedSpecification: RawObjectDataProcessor.PropertiesSpecification;
    }>
  ): RawObjectDataProcessor.PropertiesSpecification {

    return {

      [plainCopyingLocalization.filesGroups.KEY]: {

        newName: "filesGroups",
        type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
        required: true,
        minimalEntriesCount: 1,

        value: {

          type: Object,
          properties: {

            /* ─── Common ─────────────────────────────────────────────────────────────────────────────────────────── */
            [plainCopyingLocalization.aliasName.KEY]: {
              newName: "aliasName",
              preValidationModifications: nullToUndefined,
              type: String,
              required: false
            },

            /* ─── Singular ───────────────────────────────────────────────────────────────────────────────────────── */
            [plainCopyingLocalization.sourceFileRelativePath.KEY]: {
              newName: "sourceFileRelativePath",
              type: String,
              required: false
            },

            /* ─── Plural ─────────────────────────────────────────────────────────────────────────────────────────── */
            [plainCopyingLocalization.sourceTopDirectoryRelativePath.KEY]: {
              newName: "sourceTopDirectoryRelativePath",
              type: String,
              requiredIf: {
                predicate: (filesGroup: ArbitraryObject): boolean =>
                    isUndefined(filesGroup[plainCopyingLocalization.sourceFileRelativePath.KEY]),
                descriptionForLogging: plainCopyingLocalization.sourceTopDirectoryRelativePath.
                    REQUIREMENT_CONDITION_DESCRIPTION
              }
            },

            [plainCopyingLocalization.fileNameLastExtensions.KEY]: {
              newName: "fileNameLastExtensions",
              type: Array,
              required: false,
              element: {
                type: String,
                minimalCharactersCount: 1
              }
            },

            [plainCopyingLocalization.buildingModeDependent.KEY]: {

              newName: "buildingModeDependent",
              type: RawObjectDataProcessor.ValuesTypesIDs.associativeArrayOfUniformTypeValues,
              required: true,
              allowedKeys: Object.values(ConsumingProjectBuildingModes),
              minimalEntriesCount: 1,

              keysRenamings: {
                [consumingProjectLocalizedPreDefinedBuildingModes.staticPreview]:
                    ConsumingProjectBuildingModes.staticPreview,
                [consumingProjectLocalizedPreDefinedBuildingModes.localDevelopment]:
                    ConsumingProjectBuildingModes.localDevelopment,
                [consumingProjectLocalizedPreDefinedBuildingModes.testing]:
                    ConsumingProjectBuildingModes.testing,
                [consumingProjectLocalizedPreDefinedBuildingModes.staging]:
                    ConsumingProjectBuildingModes.staging,
                [consumingProjectLocalizedPreDefinedBuildingModes.production]:
                    ConsumingProjectBuildingModes.production
              },

              value: {

                type: Object,

                properties: {

                  /* ─── Common ───────────────────────────────────────────────────────────────────────────────────── */
                  [plainCopyingLocalization.buildingModeDependent.revisioning.KEY]: {

                    newName: "revisioning",
                    type: Object,
                    required: false,
                    preValidationModifications: nullToUndefined,
                    properties: {

                      [plainCopyingLocalization.buildingModeDependent.revisioning.enable.KEY]: {
                        newName: "enable",
                        type: Boolean,
                        required: false
                      },

                      [plainCopyingLocalization.buildingModeDependent.revisioning.contentHashPostfixSeparator.KEY]: {
                        newName: "contentHashPostfixSeparator",
                        type: String,
                        required: false,
                        minimalCharactersCount: 1
                      }

                    }

                  },

                  /* ─── Singular ─────────────────────────────────────────────────────────────────────────────────── */
                  [plainCopyingLocalization.buildingModeDependent.outputDirectoryRelativePath.KEY]: {
                    newName: "outputDirectoryRelativePath",
                    type: String,
                    required: false
                  },

                  [plainCopyingLocalization.buildingModeDependent.newFileNameWithExtension.KEY]: {
                    newName: "newFileNameWithExtension",
                    type: String,
                    required: false,
                    minimalCharactersCount: 1
                  },

                  /* ─── Plural ───────────────────────────────────────────────────────────────────────────────────── */
                  [plainCopyingLocalization.buildingModeDependent.outputTopDirectoryRelativePath.KEY]: {
                    newName: "outputTopDirectoryRelativePath",
                    type: String,
                    required: false
                  },

                  [plainCopyingLocalization.buildingModeDependent.filesRenamings.KEY]: {

                    newName: "filesRenamings",
                    type: Array,
                    required: false,
                    preValidationModifications: nullToUndefined,

                    element: {

                      type: Object,

                      properties: {

                        [plainCopyingLocalization.buildingModeDependent.filesRenamings.pathRelativeToSourceDirectory.KEY]: {
                          newName: "pathRelativeToSourceDirectory",
                          type: String,
                          required: true,
                          minimalCharactersCount: 1
                        },

                        [plainCopyingLocalization.buildingModeDependent.filesRenamings.newFileNameWithExtension.KEY]: {
                          newName: "newFileNameWithExtension",
                          type: String,
                          required: true,
                          minimalCharactersCount: 1
                        }

                      }

                    }

                  },

                  [plainCopyingLocalization.buildingModeDependent.outputDirectoryPathTransformations.KEY]: {
                    newName: "outputDirectoryPathTransformations",
                    type: Object,
                    required: false,
                    preValidationModifications: nullToUndefined,
                    properties: outputDirectoryPathTransformationsPropertiesLocalizedSpecification
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
