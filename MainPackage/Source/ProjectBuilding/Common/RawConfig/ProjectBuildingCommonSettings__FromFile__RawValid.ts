/* ━━━ < Imports ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* ┅┅┅ Restrictions ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import ConsumingProjectBuildingModes from "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";

/* ┅┅┅ Raw Valid Configuration ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import { ProjectBuildingTasksIDsForConfigFile } from
    "@ProjectBuilding:Common/RawConfig/Enumerations/ProjectBuildingTasksIDsForConfigFile";

/* ┅┅┅ General Utils ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import { RawObjectDataProcessor } from "@yamato-daiwa/es-extensions";
/* ━━━ Imports > ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */


type ProjectBuildingCommonSettings__FromFile__RawValid = Readonly<{
  selectiveExecutions?: ProjectBuildingCommonSettings__FromFile__RawValid.SelectiveExecutions;
  publicDirectoriesRelativePaths?: Readonly<{ [projectBuildingMode: string]: string | undefined; }>;
  filesWatching?: ProjectBuildingCommonSettings__FromFile__RawValid.FilesWatching;
  processingOnDemand?: ProjectBuildingCommonSettings__FromFile__RawValid.ProcessingOnDemand;
  CSS_ClassesShorteningOnFly?: ProjectBuildingCommonSettings__FromFile__RawValid.CSS_ClassesShorteningOnFly;
}>;


namespace ProjectBuildingCommonSettings__FromFile__RawValid {

  /* ━━━ Types ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* ┅┅┅ Selective Executions ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  export type SelectiveExecutions = Readonly<{ [selectiveExecutionID: string]: SelectiveExecution | undefined; }>;

  export type SelectiveExecution = Readonly<{
    tasksAndSourceFilesSelection: ProjectBuilderTasksAndSourceFilesSelection;
    browserLiveReloadingSetupID?: string;
    dockerSetupID?: string;
    distributablePackageJSON_Generating?: boolean;
    processingOnDemand?: ProcessingOnDemand;
  }>;


  /* ┅┅┅ Project Builder Tasks and Source Files Selection ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  export type ProjectBuilderTasksAndSourceFilesSelection = Readonly<{
    [ProjectBuildingTasksIDsForConfigFile.markupProcessing]?: ReadonlyArray<string>;
    [ProjectBuildingTasksIDsForConfigFile.stylesProcessing]?: ReadonlyArray<string>;
    [ProjectBuildingTasksIDsForConfigFile.ECMA_ScriptLogicProcessing]?: ReadonlyArray<string>;
    [ProjectBuildingTasksIDsForConfigFile.imagesProcessing]?: ReadonlyArray<string>;
    [ProjectBuildingTasksIDsForConfigFile.fontsProcessing]?: ReadonlyArray<string>;
    [ProjectBuildingTasksIDsForConfigFile.audiosProcessing]?: ReadonlyArray<string>;
    [ProjectBuildingTasksIDsForConfigFile.videosProcessing]?: ReadonlyArray<string>;
    [ProjectBuildingTasksIDsForConfigFile.plainCopying]?: ReadonlyArray<string>;
  }>;


  /* ┅┅┅ Files Watching ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  export type FilesWatching = Readonly<{
    relativePathsOfExcludedFiles?: ReadonlyArray<string>;
    relativePathsOfExcludeDirectories?: ReadonlyArray<string>;
    buildingModeDependent?: Readonly<{
      [
        projectBuildingMode in
            ConsumingProjectBuildingModes.staticPreview |
            ConsumingProjectBuildingModes.localDevelopment
      ]: FilesWatching.BuildingModeDependent;
    }>;
  }>;

  export namespace FilesWatching {

    export type BuildingModeDependent = Readonly<{
      relativePathsOfExcludedFiles?: ReadonlyArray<string>;
      relativePathsOfExcludeDirectories?: ReadonlyArray<string>;
    }>;

  }


  /* ┅┅┅ Processing on Demand ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  export type ProcessingOnDemand = Readonly<{
    enabled?: boolean;
    fullInitialBuilding?: boolean;
  }>;


  /* ┅┅┅ CSS Classes Shortening on Fly ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  /* ╍╍╍ Properties Specification ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
  export type CSS_ClassesShorteningOnFly = Readonly<{
    enabledOn: Readonly<{
      projectBuildingModes: Readonly<{ [projectBuildingMode: string]: boolean | undefined; }>;
      selectiveExecutions?: Readonly<{ [selectiveExecutionID: string]: boolean | undefined; }>;
    }>;
    CSS_ClassesPrefixesDefaultSeparators: ReadonlyArray<string> | string;
    CSS_ClassesPrefixes: ReadonlyArray<string | Readonly<{ prefix: string; separators: ReadonlyArray<string> | string; }>>;
    forbiddenShortenedCSS_ClassesNames?: ReadonlyArray<string>;
    ignoredInitialCSS_Classes?: ReadonlyArray<string>;
    generatingInMarkupOfShortCSS_ClassesNotMentionedInStylesheets?:
        CSS_ClassesMinificationOnFly.GeneratingInMarkupOfShortCSS_ClassesNotMentionedInStylesheets;
    pathsOfPartialSetupFilesRelativeToProjectRootDirectory?: ReadonlyArray<string>;
  }>;

  export namespace CSS_ClassesMinificationOnFly {

    export type GeneratingInMarkupOfShortCSS_ClassesNotMentionedInStylesheets = Readonly<{
      enabled?: boolean;
      ignoredInitialCSS_Classes?: ReadonlyArray<string>;
    }>;

    export type PartialSetup =

        Pick<
          CSS_ClassesShorteningOnFly,
            "CSS_ClassesPrefixes" |
            "forbiddenShortenedCSS_ClassesNames" |
            "ignoredInitialCSS_Classes"
          > &

        Partial<
          Pick<CSS_ClassesShorteningOnFly, "CSS_ClassesPrefixesDefaultSeparators">
        >;

  }


  /* ━━━ Properties Specification ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export const propertiesSpecification: RawObjectDataProcessor.PropertiesSpecification = {

    $selectiveExecutions: {

      newName: "selectiveExecutions",
      type: RawObjectDataProcessor.ValuesTypesIDs.associativeArray,
      isUndefinedForbidden: false,
      mustTransformNullToUndefined: true,
      areUndefinedTypeValuesForbidden: true,
      areNullTypeValuesForbidden: true,
      minimalEntriesCount: 1,

      value: {

        type: Object,

        properties: {

          $tasksAndSourceFilesSelection: {

            newName: "tasksAndSourceFilesSelection",
            type: RawObjectDataProcessor.ValuesTypesIDs.associativeArray,
            isUndefinedForbidden: true,
            isNullForbidden: true,
            areUndefinedTypeValuesForbidden: true,
            areNullTypeValuesForbidden: true,

            allowedKeys: [
              "$markupProcessing",
              "$stylesProcessing",
              "$ECMA_ScriptLogicProcessing",
              "$imagesProcessing",
              "$fontsProcessing",
              "$audiosProcessing",
              "$videosProcessing",
              "$plainCopying",
              "$browserLiveReloading"
            ],

            keysRenamings: {
              $markupProcessing: ProjectBuildingTasksIDsForConfigFile.markupProcessing,
              $stylesProcessing: ProjectBuildingTasksIDsForConfigFile.stylesProcessing,
              $ECMA_ScriptLogicProcessing: ProjectBuildingTasksIDsForConfigFile.ECMA_ScriptLogicProcessing,
              $imagesProcessing: ProjectBuildingTasksIDsForConfigFile.imagesProcessing,
              $fontsProcessing: ProjectBuildingTasksIDsForConfigFile.fontsProcessing,
              $audiosProcessing: ProjectBuildingTasksIDsForConfigFile.audiosProcessing,
              $videosProcessing: ProjectBuildingTasksIDsForConfigFile.videosProcessing,
              $plainCopying: ProjectBuildingTasksIDsForConfigFile.plainCopying,
              $browserLiveReloading: ProjectBuildingTasksIDsForConfigFile.browserLiveReloading
            },

            value: {

              type: Array,
              minimalElementsCount: 1,
              areUndefinedElementsForbidden: true,
              areNullElementsForbidden: true,

              element: {
                type: String,
                minimalCharactersCount: 1
              }

            }

          },

          $browserLiveReloadingSetupID: {
            newName: "browserLiveReloadingSetupID",
            type: String,
            isUndefinedForbidden: false,
            isNullForbidden: true,
            minimalCharactersCount: 1
          },

          $dockerSetupID: {
            newName: "dockerSetupID",
            type: String,
            isUndefinedForbidden: false,
            isNullForbidden: true,
            minimalCharactersCount: 1
          },

          $distributablePackageJSON_Generating: {
            newName: "distributablePackageJSON_Generating",
            type: Boolean,
            isUndefinedForbidden: false,
            isNullForbidden: true
          },

          $processingOnDemand: {

            newName: "processingOnDemand",
            type: Object,
            isUndefinedForbidden: false,
            mustTransformNullToUndefined: true,

            properties: {

              $enable: {
                newName: "enabled",
                type: Boolean,
                isUndefinedForbidden: false,
                isNullForbidden: true
              },

              $fullInitialBuilding: {
                newName: "fullInitialBuilding",
                type: Boolean,
                isUndefinedForbidden: false,
                isNullForbidden: true
              }

            }

          }

        }

      }

    },

    $publicDirectoriesRelativePaths: {

      newName: "publicDirectoriesRelativePaths",
      type: RawObjectDataProcessor.ValuesTypesIDs.associativeArray,
      isUndefinedForbidden: false,
      mustTransformNullToUndefined: true,
      areUndefinedTypeValuesForbidden: true,
      areNullTypeValuesForbidden: true,

      allowedKeys: [
        "$localDevelopment",
        "$testing",
        "$staging",
        "$production"
      ],

      keysRenamings: {
        $localDevelopment: ConsumingProjectBuildingModes.localDevelopment,
        $testing: ConsumingProjectBuildingModes.testing,
        $staging: ConsumingProjectBuildingModes.staging,
        $production: ConsumingProjectBuildingModes.production
      },

      value: {
        type: String,
        minimalCharactersCount: 1
      }

    },

    $CSS_ClassesShorteningOnFly: {

      newName: "CSS_ClassesShorteningOnFly",
      type: Object,
      isUndefinedForbidden: false,
      mustTransformNullToUndefined: true,

      properties: {

        $enableOn: {

          newName: "enabledOn",
          type: Object,
          isUndefinedForbidden: true,
          mustTransformNullToUndefined: true,

          properties: {

            $projectBuildingModes: {

              newName: "projectBuildingModes",
              type: RawObjectDataProcessor.ValuesTypesIDs.associativeArray,
              isUndefinedForbidden: true,
              mustTransformNullToUndefined: true,
              areUndefinedTypeValuesForbidden: true,
              areNullTypeValuesForbidden: true,

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
                type: Boolean
              }

            },

            $selectiveExecutions: {

              newName: "selectiveExecutions",
              type: RawObjectDataProcessor.ValuesTypesIDs.associativeArray,
              isUndefinedForbidden: false,
              mustTransformNullToUndefined: true,
              areUndefinedTypeValuesForbidden: true,
              areNullTypeValuesForbidden: true,

              value: {
                type: Boolean
              }

            }

          }

        },

        $CSS_ClassesPrefixesDefaultSeparators: {

          newName: "CSS_ClassesPrefixesDefaultSeparators",
          type: RawObjectDataProcessor.ValuesTypesIDs.polymorphic,
          isUndefinedForbidden: true,
          isNullForbidden: true,

          alternatives: [

            {
              type: Array,
              areUndefinedElementsForbidden: true,
              areNullElementsForbidden: true,
              minimalElementsCount: 1,
              element: {
                type: String,
                minimalCharactersCount: 1
              }
            },

            {
              type: String,
              minimalCharactersCount: 1
            }

          ]

        },

        $CSS_ClassesPrefixes: {

          newName: "CSS_ClassesPrefixes",
          type: Array,
          isUndefinedForbidden: true,
          isNullForbidden: true,
          areUndefinedElementsForbidden: true,
          areNullElementsForbidden: true,

          element: {

            type: RawObjectDataProcessor.ValuesTypesIDs.polymorphic,

            alternatives: [

              {
                type: String,
                minimalCharactersCount: 1
              },

              {
                type: Object,
                properties: {

                  $prefix: {
                    type: String,
                    isUndefinedForbidden: true,
                    isNullForbidden: true,
                    minimalCharactersCount: 1
                  },

                  $separator: {
                    type: String,
                    isUndefinedForbidden: true,
                    isNullForbidden: true,
                    minimalCharactersCount: 1
                  }

                }
              }

            ]

          }

        },

        $forbidShortenedCSS_ClassesNames: {

          newName: "forbiddenShortenedCSS_ClassesNames",
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

        $ignoreInitialCSS_Classes: {

          newName: "ignoredInitialCSS_Classes",
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

        $generatingInMarkupOfShortCSS_ClassesNotMentionedInStylesheets: {

          newName: "generatingInMarkupOfShortCSS_ClassesNotMentionedInStylesheets",
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

            $ignoreInitialCSS_Classes: {
              newName: "ignoredInitialCSS_Classes",
              type: Array,
              isUndefinedForbidden: false,
              isNullForbidden: true,
              areUndefinedElementsForbidden: true,
              areNullElementsForbidden: true,

              element: {
                type: String,
                minimalCharactersCount: 1
              }
            }

          }

        },

        $pathsOfPartialSetupFilesRelativeToProjectRootDirectory: {

          newName: "pathsOfPartialSetupFilesRelativeToProjectRootDirectory",
          type: Array,
          isUndefinedForbidden: false,
          isNullForbidden: true,
          areUndefinedElementsForbidden: true,
          areNullElementsForbidden: true,

          element: {
            type: String,
            minimalCharactersCount: 1
          }

        }

      }

    },

    $filesWatching: {

      newName: "filesWatching",
      type: Object,
      isUndefinedForbidden: false,
      mustTransformNullToUndefined: true,

      properties: {

        $excludeFilesWithPathsRelativeToProjectRootDirectory: {

          newName: "relativePathsOfExcludedFiles",
          type: Array,
          isUndefinedForbidden: false,
          mustTransformNullToUndefined: true,
          areUndefinedElementsForbidden: false,
          areNullElementsForbidden: false,

          element: {
            type: String,
            minimalCharactersCount: 1
          }

        },

        $excludeDirectoriesWithPathsRelativeToProjectRootDirectory: {

          newName: "relativePathsOfExcludeDirectories",
          type: Array,
          isUndefinedForbidden: false,
          mustTransformNullToUndefined: true,
          areUndefinedElementsForbidden: false,
          areNullElementsForbidden: false,

          element: {
            type: String,
            minimalCharactersCount: 1
          }

        },

        $buildingModeDependent: {

          newName: "buildingModeDependent",
          type: RawObjectDataProcessor.ValuesTypesIDs.associativeArray,
          isUndefinedForbidden: false,
          mustTransformNullToUndefined: true,
          areUndefinedTypeValuesForbidden: true,
          areNullTypeValuesForbidden: true,

          allowedKeys: [
            "$staticPreview",
            "$localDevelopment"
          ],

          keysRenamings: {
            $staticPreview: ConsumingProjectBuildingModes.staticPreview,
            $localDevelopment: ConsumingProjectBuildingModes.localDevelopment
          },

          value: {

            type: Object,

            properties: {

              $excludeFilesWithPathsRelativeToProjectRootDirectory: {

                newName: "relativePathsOfExcludedFiles",
                type: Array,
                isUndefinedForbidden: false,
                mustTransformNullToUndefined: true,
                areUndefinedElementsForbidden: false,
                areNullElementsForbidden: false,

                element: {
                  type: String,
                  minimalCharactersCount: 1
                }

              },

              $excludeDirectoriesWithPathsRelativeToProjectRootDirectory: {

                newName: "relativePathsOfExcludeDirectories",
                type: Array,
                isUndefinedForbidden: false,
                mustTransformNullToUndefined: true,
                areUndefinedElementsForbidden: false,
                areNullElementsForbidden: false,

                element: {
                  type: String,
                  minimalCharactersCount: 1
                }

              }

            }

          }

        }

      }

    },

    $processingOnDemand: {

      newName: "processingOnDemand",
      type: Object,
      isUndefinedForbidden: false,
      mustTransformNullToUndefined: true,

      properties: {

        $enable: {
          newName: "enabled",
          type: Boolean,
          isUndefinedForbidden: false,
          isNullForbidden: true
        },

        $fullInitialBuilding: {
          newName: "fullInitialBuilding",
          type: Boolean,
          isUndefinedForbidden: false,
          isNullForbidden: true
        }

      }

    }

  };

  export namespace PropertiesSpecification {

    /* eslint-disable-next-line @typescript-eslint/no-shadow --
     * No problem will occur while access by the fully qualified name. */
    export namespace CSS_ClassesMinificationOnFly {

      export const partial: RawObjectDataProcessor.PropertiesSpecification = {

        $CSS_ClassesPrefixesDefaultSeparators: {

          newName: "CSS_ClassesPrefixesDefaultSeparators",
          type: RawObjectDataProcessor.ValuesTypesIDs.polymorphic,
          isUndefinedForbidden: false,
          isNullForbidden: true,

          alternatives: [

            {
              type: Array,
              areUndefinedElementsForbidden: false,
              areNullElementsForbidden: false,
              minimalElementsCount: 0,
              element: {
                type: String,
                minimalCharactersCount: 1
              }
            },

            {
              type: String,
              minimalCharactersCount: 1
            }

          ]

        },

        $CSS_ClassesPrefixes: {

          newName: "CSS_ClassesPrefixes",
          type: Array,
          isUndefinedForbidden: true,
          isNullForbidden: true,
          areUndefinedElementsForbidden: true,
          areNullElementsForbidden: true,

          element: {

            type: RawObjectDataProcessor.ValuesTypesIDs.polymorphic,

            alternatives: [

              {
                type: String,
                minimalCharactersCount: 1
              },

              {
                type: Object,
                properties: {

                  $prefix: {
                    type: String,
                    isUndefinedForbidden: true,
                    isNullForbidden: true,
                    minimalCharactersCount: 1
                  },

                  $separator: {
                    type: String,
                    isUndefinedForbidden: true,
                    isNullForbidden: true,
                    minimalCharactersCount: 1
                  }

                }
              }

            ]

          }

        },

        $forbidShortenedCSS_ClassesNames: {

          newName: "forbiddenShortenedCSS_ClassesNames",
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

        $ignoreInitialCSS_Classes: {

          newName: "ignoredInitialCSS_Classes",
          type: Array,
          isUndefinedForbidden: false,
          isNullForbidden: true,
          areUndefinedElementsForbidden: true,
          areNullElementsForbidden: true,

          element: {
            type: String,
            minimalCharactersCount: 1
          }

        }

      };

    }

  }

}


export default ProjectBuildingCommonSettings__FromFile__RawValid;
