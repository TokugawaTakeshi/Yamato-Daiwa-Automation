import type ProjectBuildingConfig__FromFile__RawValid from "@ProjectBuilding/ProjectBuildingConfig__FromFile__RawValid";


const ProjectBuildingConfigFromFileDefaultLocalization: ProjectBuildingConfig__FromFile__RawValid.Localization = {

  KEY: "projectBuilding",

  enumerations: {

    tasksIDs: {
      markupProcessing: "markupProcessing",
      stylesProcessing: "stylesProcessing",
      ECMA_ScriptLogicProcessing: "ECMA_ScriptLogicProcessing",
      imagesProcessing: "imagesProcessing",
      fontsProcessing: "fontsProcessing",
      audiosProcessing: "audiosProcessing",
      videosProcessing: "videosProcessing",
      browserLiveReloading: "browserLiveReloading"
    },

    consumingProjectPreDefinedBuildingModes: {
      staticPreview: "STATIC_PREVIEW",
      development: "DEVELOPMENT",
      testing: "TESTING",
      staging: "STAGING",
      production: "PRODUCTION"
    }
  },

  reusables: {

    sourceCodeProcessingGenericProperties: {
      entryPointsSourceFilesTopDirectoryOrSingleFileRelativePath: {
        KEY: "entryPointsSourceFilesTopDirectoryOrSingleFileRelativePath"
      },
      partialsRecognition: {
        KEY: "partialsRecognition",
        excludeAllSubdirectories: { KEY: "excludeAllSubdirectories" },
        excludeSubdirectoriesWithNames: { KEY: "excludeSubdirectoriesWithNames" },
        excludeSubdirectoriesWithPrefixes: { KEY: "excludeSubdirectoriesWithPrefixes" },
        excludeFilesWithPrefixes: { KEY: "excludeFilesWithPrefixes" }
      }
    },

    revisioning: {
      disable: { KEY: "disable" },
      contentHashPostfixSeparator: { KEY: "contentHashPostfixSeparator" }
    },

    lintingCommonSettings: {
      presetFileRelativePath: { KEY: "presetFileRelativePath" },
      disableCompletely: { KEY: "disableCompletely" }
    }
  },

  commonSettings: {

    KEY: "commonSettings",

    properties: {
      selectiveExecutions: {
        KEY: "selectiveExecutions",
        tasksAndSourceFilesSelection: { KEY: "tasksAndSourceFilesSelection" },
        browserLiveReloadingSetupID: { KEY: "browserLiveReloadingSetupID" }
      },
      publicDirectoriesRelativePaths: { KEY: "publicDirectoriesRelativePaths" }
    }
  },

  tasks: {

    markupProcessing: {

      common: {
        KEY: "common",
        waitingForSubsequentFilesWillBeSavedPeriod__seconds: { KEY: "waitingForSubsequentFilesWillBeSavedPeriod__seconds" }
      },

      linting: {
        KEY: "linting"
      },

      entryPointsGroups: {

        KEY: "entryPointsGroups",

        linting: {
          KEY: "linting",
          disable: { KEY: "disable" }
        },

        HTML_Validation: {
          KEY: "HTML_Validation",
          disable: { KEY: "disable" }
        },

        accessibilityInspection: {
          KEY: "accessibilityInspection",
          standard: { KEY: "standard" },
          disable: { KEY: "disable" }
        },

        buildingModeDependent: {
          KEY: "buildingModeDependent",
          outputBaseDirectoryRelativePath: { KEY: "outputBaseDirectoryRelativePath" }
        }
      }
    },

    stylesProcessing: {

      common: {
        KEY: "common",
        waitingForSubsequentFilesWillBeSavedPeriod__seconds: { KEY: "waitingForSubsequentFilesWillBeSavedPeriod__seconds" }
      },

      linting: {
        KEY: "linting"
      },

      entryPointsGroups: {

        KEY: "entryPointsGroups",

        entryPointsSourceFilesTopDirectoryOrSingleFilePathAliasNameForReferencingFromHTML: {
          KEY: "entryPointsSourceFilesTopDirectoryOrSingleFilePathAliasNameForReferencingFromHTML"
        },

        linting: {
          KEY: "linting",
          disable: { KEY: "disable" }
        },

        buildingModeDependent: {
          KEY: "buildingModeDependent",
          outputBaseDirectoryRelativePath: { KEY: "outputBaseDirectoryRelativePath" },
          revisioning: { KEY: "revisioning" }
        }
      }
    },

    ECMA_ScriptLogicProcessing: {

      common: {
        KEY: "common",
        directoriesRelativePathsAliases: { KEY: "directoriesRelativePathsAliases" }
      },

      linting: {
        KEY: "linting"
      },

      entryPointsGroups: {

        KEY: "entryPointsGroups",

        targetRuntime: {
          KEY: "targetRuntime",
          type: { KEY: "type" },
          minimalVersion: {
            KEY: "minimalVersion",
            REQUIREMENT_CONDITION_DESCRIPTION: "Target runtime is NodeJS",
            major: { KEY: "major" },
            minor: { KEY: "minor" }
          }
        },

        entryPointsSourceFilesTopDirectoryOrSingleFilePathAliasNameForReferencingFromHTML: {
          KEY: "entryPointsSourceFilesTopDirectoryOrSingleFilePathAliasNameForReferencingFromHTML"
        },
        associatedMarkupEntryPointsGroupID_ForModulesDynamicLoadingWithoutDevelopmentServer: {
          KEY: "associatedMarkupEntryPointsGroupID_ForModulesDynamicLoadingWithoutDevelopmentServer"
        },
        typeScriptConfigurationFileRelativePath: { KEY: "typeScriptConfigurationFileRelativePath" },

        linting: {
          KEY: "linting",
          disable: { KEY: "disable" }
        },

        distributing: {
          KEY: "distributing",
          exposingOfExportsFromEntryPoints: {
            KEY: "exposingOfExportsFromEntryPoints",
            mustExpose: { KEY: "mustExpose" },
            namespace: { KEY: "namespace" }
          },
          typeScriptTypesDeclarations: {
            KEY: "typeScriptTypesDeclarations",
            mustGenerate: { KEY: "mustGenerate" },
            fileNameWithoutExtension: { KEY: "outputRelativePath" }
          }
        },

        buildingModeDependent: {
          KEY: "buildingModeDependent",
          outputBaseDirectoryRelativePath: { KEY: "outputBaseDirectoryRelativePath" },
          revisioning: { KEY: "revisioning" },
          dynamicallyLoadedFilesSubdirectory: { KEY: "dynamicallyLoadedFilesSubdirectory" },
          dynamicallyLoadedFilesNamesTemplate: { KEY: "dynamicallyLoadedFilesNamesTemplate" }
        }
      }
    },

    imagesProcessing: {
      assetsGroups: {
        KEY: "assetsGroups",
        sourceFilesTopDirectoryRelativePath: { KEY: "sourceFilesTopDirectoryRelativePath" },
        sourceFilesTopDirectoryPathAliasForReferencingFromHTML: { KEY: "sourceFilesTopDirectoryPathAliasForReferencingFromHTML" },
        buildingModeDependent: {
          KEY: "buildingModeDependent",
          outputBaseDirectoryRelativePath: { KEY: "outputBaseDirectoryRelativePath" },
          revisioning: { KEY: "revisioning" },
          outputPathTransformations: {
            KEY: "outputPathTransformations",
            segmentsWhichMustBeRemoved: { KEY: "segmentsWhichMustBeRemoved" },
            segmentsWhichLastDuplicatesMustBeRemoved: { KEY: "segmentsWhichLastDuplicatesMustBeRemoved" }
          }
        }
      }
    },

    fontsProcessing: {
      assetsGroups: {
        KEY: "assetsGroups",
        sourceFilesTopDirectoryRelativePath: { KEY: "sourceFilesTopDirectoryRelativePath" },
        sourceFilesTopDirectoryPathAliasForReferencingFromHTML: { KEY: "sourceFilesTopDirectoryPathAliasForReferencingFromHTML" },
        buildingModeDependent: {
          KEY: "buildingModeDependent",
          outputBaseDirectoryRelativePath: { KEY: "outputBaseDirectoryRelativePath" },
          revisioning: { KEY: "revisioning" },
          outputPathTransformations: {
            KEY: "outputPathTransformations",
            segmentsWhichMustBeRemoved: { KEY: "segmentsWhichMustBeRemoved" },
            segmentsWhichLastDuplicatesMustBeRemoved: { KEY: "segmentsWhichLastDuplicatesMustBeRemoved" }
          }
        }
      }
    },

    videosProcessing: {
      assetsGroups: {
        KEY: "assetsGroups",
        sourceFilesTopDirectoryRelativePath: { KEY: "sourceFilesTopDirectoryRelativePath" },
        sourceFilesTopDirectoryPathAliasForReferencingFromHTML: { KEY: "sourceFilesTopDirectoryPathAliasForReferencingFromHTML" },
        buildingModeDependent: {
          KEY: "buildingModeDependent",
          outputBaseDirectoryRelativePath: { KEY: "outputBaseDirectoryRelativePath" },
          revisioning: { KEY: "revisioning" },
          outputPathTransformations: {
            KEY: "outputPathTransformations",
            segmentsWhichMustBeRemoved: { KEY: "segmentsWhichMustBeRemoved" },
            segmentsWhichLastDuplicatesMustBeRemoved: { KEY: "segmentsWhichLastDuplicatesMustBeRemoved" }
          }
        }
      }
    },

    audiosProcessing: {
      assetsGroups: {
        KEY: "assetsGroups",
        sourceFilesTopDirectoryRelativePath: { KEY: "sourceFilesTopDirectoryRelativePath" },
        sourceFilesTopDirectoryPathAliasForReferencingFromHTML: { KEY: "sourceFilesTopDirectoryPathAliasForReferencingFromHTML" },
        buildingModeDependent: {
          KEY: "buildingModeDependent",
          outputBaseDirectoryRelativePath: { KEY: "outputBaseDirectoryRelativePath" },
          revisioning: { KEY: "revisioning" },
          outputPathTransformations: {
            KEY: "outputPathTransformations",
            segmentsWhichMustBeRemoved: { KEY: "segmentsWhichMustBeRemoved" },
            segmentsWhichLastDuplicatesMustBeRemoved: { KEY: "segmentsWhichLastDuplicatesMustBeRemoved" }
          }
        }
      }
    },

    browserLiveReloading: {
      targetFilesRootDirectoryRelativePath: { KEY: "targetFilesRootDirectoryRelativePath" },
      customStartingFilenameWithExtension: { KEY: "customStartingFilenameWithExtension" },
      waitingForTheOtherFilesWillUpdateDuration__seconds: { KEY: "waitingForTheOtherFilesWillUpdateDuration__seconds" },
      useHTTPS: { KEY: "useHTTPS" },
      virtualHost: { KEY: "virtualHost" },
      ports: {
        KEY: "ports",
        main: { KEY: "main" },
        userInterface: { KEY: "userInterface" }
      },
      ignoredFilesAndDirectories: { KEY: "ignoredFilesAndDirectories" }
    }
  },

  debugging: {

    KEY: "debugging",

    properties: {
      enabled: { KEY: "enabled" },
      partials: {
        KEY: "partials",
        partialFilesAndParentEntryPointAccordance: { KEY: "partialFilesAndParentEntryPointAccordance" }
      }
    }
  }
};


export default ProjectBuildingConfigFromFileDefaultLocalization;
