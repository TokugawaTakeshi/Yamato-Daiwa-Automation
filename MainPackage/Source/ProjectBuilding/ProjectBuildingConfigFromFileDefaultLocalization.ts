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
      plainCopying: "plainCopying",
      browserLiveReloading: "browserLiveReloading"
    },

    consumingProjectPreDefinedBuildingModes: {
      staticPreview: "STATIC_PREVIEW",
      localDevelopment: "LOCAL_DEVELOPMENT",
      testing: "TESTING",
      staging: "STAGING",
      production: "PRODUCTION"
    }
  },

  reusables: {

    sourceCodeProcessingGenericProperties: {
      topDirectoryRelativePath: { KEY: "topDirectoryRelativePath" },
      partialsRecognition: {
        KEY: "partialsRecognition",
        excludeAllSubdirectories: { KEY: "excludeAllSubdirectories" },
        excludeSubdirectoriesWithNames: { KEY: "excludeSubdirectoriesWithNames" },
        excludeSubdirectoriesWithPrefixes: { KEY: "excludeSubdirectoriesWithPrefixes" },
        excludeFilesWithPrefixes: { KEY: "excludeFilesWithPrefixes" }
      },
      singleEntryPointRelativePath: {
        KEY: "singleEntryPointRelativePath",
        REQUIREMENT_CONDITION_DESCRIPTION: "'topDirectoryRelativePath' is not defined"
      }
    },

    revisioning: {
      disable: { KEY: "disable" },
      contentHashPostfixSeparator: { KEY: "contentHashPostfixSeparator" }
    },

    lintingCommonSettings: {
      presetFileRelativePath: { KEY: "presetFileRelativePath" },
      enabled: { KEY: "enabled" }
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
        periodBetweenFileUpdatingAndRebuildingStarting__seconds: {
          KEY: "periodBetweenFileUpdatingAndRebuildingStarting__seconds"
        },
        buildingModeDependent: {
          KEY: "buildingModeDependent",
          mustResolveResourceReferencesToRelativePaths: {
            KEY: "mustResolveResourceReferencesToRelativePaths"
          }
        }
      },

      staticPreview: {
        KEY: "staticPreview",
        stateDependentPagesVariationsSpecificationFileRelativePath: {
          KEY: "stateDependentPagesVariationsSpecificationFileRelativePath"
        },
        importsFromStaticDataFiles: {
          KEY: "importsFromStaticDataFiles",
          importedVariableName: { KEY: "importedVariableName" },
          fileRelativePath: { KEY: "fileRelativePath" }
        },
        importsFromCompiledTypeScript: {
          KEY: "importsFromCompiledTypeScript",
          typeScriptConfigurationFileRelativePath: { KEY: "typeScriptConfigurationFileRelativePath" },
          files: {
            KEY: "files",
            importedNamespace: { KEY: "importedNamespace" },
            sourceFileRelativePath: { KEY: "sourceFileRelativePath" },
            outputDirectoryRelativePath: { KEY: "outputDirectoryRelativePath" },
            customOutputFileNameWithoutLastExtension: { KEY: "customOutputFileNameWithoutLastExtension" }
          }
        }
      },

      linting: {
        KEY: "linting"
      },

      entryPointsGroups: {

        KEY: "entryPointsGroups",

        HTML_Validation: {
          KEY: "HTML_Validation",
          disable: { KEY: "disable" }
        },

        accessibilityInspection: {
          KEY: "accessibilityInspection",
          standard: { KEY: "standard" },
          disable: { KEY: "disable" }
        },

        convertToHandlebarsOnNonStaticPreviewModes: { KEY: "convertToHandlebarsOnNonStaticPreviewModes" },

        buildingModeDependent: {
          KEY: "buildingModeDependent",
          outputTopDirectoryRelativePath: { KEY: "outputTopDirectoryRelativePath" }
        }
      },

      logging: {
        filesPaths: { KEY: "filesPaths" },
        filesCount: { KEY: "filesCount" },
        partialFilesAndParentEntryPointsCorrespondence: { KEY: "partialFilesAndParentEntryPointsCorrespondence" }
      }
    },

    stylesProcessing: {

      common: {
        KEY: "common",
        periodBetweenFileUpdatingAndRebuildingStarting__seconds: {
          KEY: "periodBetweenFileUpdatingAndRebuildingStarting__seconds"
        }
      },

      linting: {
        KEY: "linting"
      },

      entryPointsGroups: {

        KEY: "entryPointsGroups",

        customReferenceName: { KEY: "customReferenceName" },

        buildingModeDependent: {
          KEY: "buildingModeDependent",
          outputTopDirectoryRelativePath: { KEY: "outputTopDirectoryRelativePath" },
          revisioning: { KEY: "revisioning" }
        }
      }
    },

    ECMA_ScriptLogicProcessing: {

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

        customReferenceName: { KEY: "customReferenceName" },
        associatedMarkupEntryPointsGroupID_ForModulesDynamicLoadingWithoutDevelopmentServer: {
          KEY: "associatedMarkupEntryPointsGroupID_ForModulesDynamicLoadingWithoutDevelopmentServer"
        },
        typeScriptConfigurationFileRelativePath: { KEY: "typeScriptConfigurationFileRelativePath" },

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
          outputTopDirectoryRelativePath: { KEY: "outputTopDirectoryRelativePath" },
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
          outputTopDirectoryRelativePath: { KEY: "outputTopDirectoryRelativePath" },
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
          outputTopDirectoryRelativePath: { KEY: "outputTopDirectoryRelativePath" },
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
          outputTopDirectoryRelativePath: { KEY: "outputTopDirectoryRelativePath" },
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
          outputTopDirectoryRelativePath: { KEY: "outputTopDirectoryRelativePath" },
          revisioning: { KEY: "revisioning" },
          outputPathTransformations: {
            KEY: "outputPathTransformations",
            segmentsWhichMustBeRemoved: { KEY: "segmentsWhichMustBeRemoved" },
            segmentsWhichLastDuplicatesMustBeRemoved: { KEY: "segmentsWhichLastDuplicatesMustBeRemoved" }
          }
        }
      }
    },

    plainCopying: {
      filesGroups: { KEY: "filesGroups" },
      sourceFileRelativePath: { KEY: "sourceFileRelativePath" },
      sourceDirectoryRelativePath: {
        KEY: "sourceFileRelativePath",
        REQUIREMENT_CONDITION_DESCRIPTION: "\"sourceFileRelativePath\" is not specified"
      },
      referenceName: { KEY: "referenceName" },
      buildingModeDependent: {
        KEY: "buildingModeDependent",
        sourceDirectoryRelativePath: { KEY: "sourceDirectoryRelativePath" }
      }
    },

    browserLiveReloading: {

      setups: {

        KEY: "setups",

        localServer: {
          KEY: "localServer",
          rootDirectoryRelativePath: { KEY: "rootDirectoryRelativePath" },
          ignoredFilesAndDirectoriesRelativePaths: { KEY: "ignoredFilesAndDirectoriesRelativePaths" },
          customPort: { KEY: "customPort" },
          customStartingFileNameWithExtension: { KEY: "customStartingFileNameWithExtension" },
          useHTTPS: { KEY: "useHTTPS" },
          useCORS: { KEY: "useCORS" }
        },

        proxy: { KEY: "proxy" },

        openInBrowsers: { KEY: "openInBrowsers" },

        browserSyncUserInterface: {
          KEY: "browserSyncUserInterface",
          customPort: { KEY: "customPort" },
          disable: { KEY: "disable" }
        },

        periodBetweenFileUpdatingAndBrowserReloading__seconds: { KEY: "periodBetweenFileUpdatingAndBrowserReloading__seconds" }

      },

      logging: {
        KEY: "logging",
        outputFileChangeDetection: { KEY: "outputFileChangeDetection" },
        browserTabWillBeReloadedSoon: { KEY: "browserTabWillBeReloadedSoon" },
        browsersyncConnection: { KEY: "browsersyncConnection" }
      }
    }
  }
};


export default ProjectBuildingConfigFromFileDefaultLocalization;
