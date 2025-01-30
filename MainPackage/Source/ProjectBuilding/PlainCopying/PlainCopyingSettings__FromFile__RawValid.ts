/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import ConsumingProjectBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";

/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import OutputDirectoryPathTransformationsSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/OutputDirectoryPathTransformationsSettings__FromFile__RawValid";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import { RawObjectDataProcessor, isUndefined } from "@yamato-daiwa/es-extensions";


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
          excludeSubdirectoriesRelativePaths?: ReadonlyArray<string>;
          excludeFilesRelativePaths?: ReadonlyArray<string>;
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

  /* ━━━ Properties Specification ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export const propertiesSpecification: RawObjectDataProcessor.PropertiesSpecification = {

    $filesGroups: {

      newName: "filesGroups",
      type: RawObjectDataProcessor.ValuesTypesIDs.associativeArray,
      isUndefinedForbidden: true,
      isNullForbidden: true,
      areUndefinedTypeValuesForbidden: true,
      areNullTypeValuesForbidden: true,
      minimalEntriesCount: 1,

      value: {

        type: Object,
        properties: {

          /* ─── Common ─────────────────────────────────────────────────────────────────────────────────────────── */
          $aliasName: {
            newName: "aliasName",
            type: String,
            isUndefinedForbidden: false,
            isNullForbidden: true
          },

          /* ─── Singular ───────────────────────────────────────────────────────────────────────────────────────── */
          $sourceFileRelativePath: {
            newName: "sourceFileRelativePath",
            type: String,
            isUndefinedForbidden: false,
            isNullForbidden: true
          },

          /* ─── Plural ─────────────────────────────────────────────────────────────────────────────────────────── */
          $sourceTopDirectoryRelativePath: {
            newName: "sourceTopDirectoryRelativePath",
            type: String,
            undefinedForbiddenIf: {
              predicate: (
                { rawData__currentObjectDepth: filesGroup }:
                    RawObjectDataProcessor.ConditionAssociatedWithProperty.Predicate.Parameter
              ): boolean => isUndefined(filesGroup.$sourceFileRelativePath),
              descriptionForLogging: "\"$sourceFileRelativePath\" not undefined"
            },
            isNullForbidden: true
          },

          $fileNameLastExtensions: {
            newName: "fileNameLastExtensions",
            type: Array,
            isUndefinedForbidden: false,
            isNullForbidden: true,
            areUndefinedElementsForbidden: true,
            areNullElementsForbidden: true,
            element: {
              type: String,
              minimalCharactersCount: 1
            }
          },

          $excludeSubdirectoriesRelativePaths: {
            newName: "excludeSubdirectoriesRelativePaths",
            type: Array,
            isUndefinedForbidden: false,
            isNullForbidden: true,
            areUndefinedElementsForbidden: true,
            areNullElementsForbidden: true,
            element: {
              type: String,
              minimalCharactersCount: 1
            }
          },

          $excludeFilesRelativePaths: {
            newName: "excludeFilesRelativePaths",
            type: Array,
            isUndefinedForbidden: false,
            isNullForbidden: true,
            areUndefinedElementsForbidden: true,
            areNullElementsForbidden: true,
            element: {
              type: String,
              minimalCharactersCount: 1
            }
          },

          $buildingModeDependent: {

            newName: "buildingModeDependent",
            type: RawObjectDataProcessor.ValuesTypesIDs.associativeArray,
            isUndefinedForbidden: true,
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

                /* ─── Common ───────────────────────────────────────────────────────────────────────────────────── */
                $revisioning: {

                  newName: "revisioning",
                  type: Object,
                  isUndefinedForbidden: false,
                  mustTransformNullToUndefined: true,
                  properties: {

                    $enable: {
                      newName: "enable",
                      type: Boolean,
                      isUndefinedForbidden: false,
                      isNullForbidden: true
                    },

                    $contentHashPostfixSeparator: {
                      newName: "contentHashPostfixSeparator",
                      type: String,
                      isUndefinedForbidden: false,
                      isNullForbidden: true,
                      minimalCharactersCount: 1
                    }

                  }

                },

                /* ─── Singular ─────────────────────────────────────────────────────────────────────────────────── */
                $outputDirectoryRelativePath: {
                  newName: "outputDirectoryRelativePath",
                  type: String,
                  isUndefinedForbidden: false,
                  isNullForbidden: true
                },

                $newFileNameWithExtension: {
                  newName: "newFileNameWithExtension",
                  type: String,
                  isUndefinedForbidden: false,
                  isNullForbidden: true,
                  minimalCharactersCount: 1
                },

                /* ─── Plural ───────────────────────────────────────────────────────────────────────────────────── */
                $outputTopDirectoryRelativePath: {
                  newName: "outputTopDirectoryRelativePath",
                  type: String,
                  isUndefinedForbidden: false,
                  isNullForbidden: true
                },

                $filesRenamings: {

                  newName: "filesRenamings",
                  type: Array,
                  isUndefinedForbidden: false,
                  mustTransformNullToUndefined: true,
                  areUndefinedElementsForbidden: true,
                  areNullElementsForbidden: true,

                  element: {

                    type: Object,

                    properties: {

                      $pathRelativeToSourceDirectory: {
                        newName: "pathRelativeToSourceDirectory",
                        type: String,
                        isUndefinedForbidden: true,
                        isNullForbidden: true,
                        minimalCharactersCount: 1
                      },

                      $newFileNameWithExtension: {
                        newName: "newFileNameWithExtension",
                        type: String,
                        isUndefinedForbidden: true,
                        isNullForbidden: true,
                        minimalCharactersCount: 1
                      }

                    }

                  }

                },

                $outputDirectoryPathTransformations: {
                  newName: "outputDirectoryPathTransformations",
                  type: Object,
                  isUndefinedForbidden: false,
                  mustTransformNullToUndefined: true,
                  properties: OutputDirectoryPathTransformationsSettings__FromFile__RawValid.propertiesSpecification
                }

              }

            }

          }

        }

      }

    }

  };

}


export default PlainCopyingSettings__FromFile__RawValid;
