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
      browserLiveReloading: "browserLiveReloading",
      filesWatching: "filesWatching",
      outputPackageJSON_Generating: "outputPackageJSON_Generating"
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

      entryPointsGroups: {

        KEY: "entryPointsGroups",
        sourceFilesTopDirectoryRelativePath: { KEY: "sourceFilesTopDirectoryRelativePath" },
        sourceFilesTopDirectoryPathAliasName: { KEY: "sourceFilesTopDirectoryPathAliasName" },
        singleEntryPointSourceFilePathAliasName: { KEY: "singleEntryPointSourceFilePathAliasName" },

        partialsRecognition: {
          KEY: "partialsRecognition",
          excludeAllSubdirectories: { KEY: "excludeAllSubdirectories" },
          excludeSubdirectoriesWithNames: { KEY: "excludeSubdirectoriesWithNames" },
          excludeSubdirectoriesWithPrefixes: { KEY: "excludeSubdirectoriesWithPrefixes" },
          excludeFilesWithPrefixes: { KEY: "excludeFilesWithPrefixes" }
        },

        singleEntryPointSourceFileRelativePath: {
          KEY: "singleEntryPointSourceFileRelativePath",
          REQUIREMENT_CONDITION_DESCRIPTION: "\"sourceFilesTopDirectoryRelativePath\" has not been specified"
        },

        buildingModeDependent: {
          KEY: "buildingModeDependent",
          outputTopDirectoryRelativePath: { KEY: "outputTopDirectoryRelativePath" },
          revisioning: { KEY: "revisioning" },
          outputPathTransformations: { KEY: "outputPathTransformations" }
        }

      }

    },

    resourceFilesGroupBuildingModeDependentOutputGenericSettings: {
      KEY: "resourceFilesGroupBuildingModeDependentOutputGenericSettings",
      outputPathTransformations: { KEY: "outputPathTransformations" },
      outputTopDirectoryRelativePath: { KEY: "outputTopDirectoryRelativePath" }
    },

    revisioning: {
      disable: { KEY: "disable" },
      contentHashPostfixSeparator: { KEY: "contentHashPostfixSeparator" }
    },

    lintingCommonSettings: {
      presetFileRelativePath: { KEY: "presetFileRelativePath" },
      disable: { KEY: "enabled" }
    },

    outputPathTransformationsSettings: {
      segmentsWhichMustBeRemoved: { KEY: "segmentsWhichMustBeRemoved" },
      segmentsWhichLastDuplicatesMustBeRemoved: { KEY: "segmentsWhichLastDuplicatesMustBeRemoved" },
      segmentsCountRelativeToGroupTopDirectoryWhichMustBeRemoved: {
        KEY: "segmentsCountRelativeToGroupTopDirectoryWhichMustBeRemoved"
      }
    }

  },

  commonSettings: {

    KEY: "commonSettings",

    properties: {
      selectiveExecutions: {
        KEY: "selectiveExecutions",
        tasksAndSourceFilesSelection: { KEY: "tasksAndSourceFilesSelection" },
        browserLiveReloadingSetupID: { KEY: "browserLiveReloadingSetupID" },
        outputPackageJSON_Generating: { KEY: "outputPackageJSON_Generating" }
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
        }
      },

      linting: {
        KEY: "linting"
      },

      importingFromTypeScript: {

        KEY: "importingFromTypeScript",

        typeScriptConfigurationFileRelativePath: { KEY: "typeScriptConfigurationFileRelativePath" },
        importedNamespace: { KEY: "importedNamespace" },
        sourceFileRelativePath: { KEY: "sourceFileRelativePath" },
        nameOfPugBlockToWhichTranspiledTypeScriptMustBeInjected: {
          KEY: "nameOfPugBlockToWhichTranspiledTypeScriptMustBeInjected"
        }

      },

      entryPointsGroups: {

        KEY: "entryPointsGroups",

        HTML_Validation: {
          KEY: "HTML_Validation",
          disable: { KEY: "disable" },
          ignoring: {
            KEY: "ignoring",
            files: { KEY: "files" },
            directories: { KEY: "directories" }
          }
        },

        accessibilityInspection: {
          KEY: "accessibilityInspection",
          standard: { KEY: "standard" },
          disable: { KEY: "disable" },
          ignoring: {
            KEY: "ignoring",
            files: { KEY: "files" },
            directories: { KEY: "directories" }
          }
        },

        outputFormat: { KEY: "outputFormat" },

        buildingModeDependent: {
          KEY: "buildingModeDependent",
          outputTopDirectoryRelativePath: { KEY: "outputTopDirectoryRelativePath" },
          outputCodeFormatting: {
            KEY: "outputCodeFormatting",
            disable: { KEY: "enabled" }
          }
        }

      },

      logging: {

        KEY: "logging",

        filesPaths: { KEY: "filesPaths" },
        filesCount: { KEY: "filesCount" },
        partialFilesAndParentEntryPointsCorrespondence: { KEY: "partialFilesAndParentEntryPointsCorrespondence" },
        filesWatcherEvents: { KEY: "filesWatcherEvents" },

        linting: {
          KEY: "linting",
          starting: { KEY: "starting" },
          completionWithoutIssues: { KEY: "completionWithoutIssues" }
        },

        HTML_Validation: {
          KEY: "HTML_Validation",
          starting: { KEY: "starting" },
          completionWithoutIssues: { KEY: "completionWithoutIssues" }
        },

        accessibilityChecking: {
          KEY: "accessibilityChecking",
          starting: { KEY: "starting" },
          completionWithoutIssues: { KEY: "completionWithoutIssues" }
        }

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

        buildingModeDependent: {
          KEY: "buildingModeDependent",
          outputTopDirectoryRelativePath: { KEY: "outputTopDirectoryRelativePath" },
          revisioning: { KEY: "revisioning" }
        }

      },

      logging: {

        KEY: "logging",

        filesPaths: { KEY: "filesPaths" },
        filesCount: { KEY: "filesCount" },
        partialFilesAndParentEntryPointsCorrespondence: { KEY: "partialFilesAndParentEntryPointsCorrespondence" },
        filesWatcherEvents: { KEY: "filesWatcherEvents" },

        linting: {
          KEY: "linting",
          starting: { KEY: "starting" },
          completionWithoutIssues: { KEY: "completionWithoutIssues" }
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

        referenceCustomAliasName: { KEY: "referenceCustomAliasName" },
        associatedMarkupEntryPointsGroupID_ForDynamicModulesLoadingWithoutDevelopmentServer: {
          KEY: "associatedMarkupEntryPointsGroupID_ForDynamicModulesLoadingWithoutDevelopmentServer"
        },
        typeScriptConfigurationFileRelativePath: { KEY: "typeScriptConfigurationFileRelativePath" },

        distributing: {
          KEY: "distributing",
          exposingOfExportsFromEntryPoints: {
            KEY: "exposingOfExportsFromEntryPoints",
            mustExpose: { KEY: "mustExpose" },
            namespace: { KEY: "namespace" },
            mustAssignToWindowObject: { KEY: "mustAssignToWindowObject" }
          },
          externalizingDependencies: { KEY: "externalizingDependencies" },
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

      },

      localDevelopmentServerOrchestration: {
        KEY: "localDevelopmentServerOrchestration",
        targetSingularEntryPointsGroupID: { KEY: "targetSingularEntryPointsGroupID" },
        arguments: { KEY: "arguments" },
        environmentVariables: { KEY: "environmentVariables" }
      },

      logging: {

        KEY: "logging",

        filesPaths: { KEY: "filesPaths" },
        filesCount: { KEY: "filesCount" },
        partialFilesAndParentEntryPointsCorrespondence: { KEY: "partialFilesAndParentEntryPointsCorrespondence" },
        filesWatcherEvents: { KEY: "filesWatcherEvents" },

        linting: {
          KEY: "linting",
          starting: { KEY: "starting" },
          completionWithoutIssues: { KEY: "completionWithoutIssues" }
        }

      }

    },

    imagesProcessing: {

      common: {
        KEY: "common",
        periodBetweenFileUpdatingAndRebuildingStarting__seconds: {
          KEY: "periodBetweenFileUpdatingAndRebuildingStarting__seconds"
        }
      },

      logging: {
        KEY: "logging",
        filesPaths: { KEY: "filesPaths" },
        filesCount: { KEY: "filesCount" },
        filesWatcherEvents: { KEY: "filesWatcherEvents" }
      },

      assetsGroups: {

        KEY: "assetsGroups",
        sourceFilesTopDirectoryRelativePath: { KEY: "sourceFilesTopDirectoryRelativePath" },
        referenceCustomAliasName: { KEY: "sourceFilesTopDirectoryPathAliasForReferencingFromHTML" },

        buildingModeDependent: {
          KEY: "buildingModeDependent",
          outputTopDirectoryRelativePath: { KEY: "outputTopDirectoryRelativePath" },
          revisioning: { KEY: "revisioning" },
          outputPathTransformations: { KEY: "outputPathTransformations" }
        }

      }

    },

    fontsProcessing: {

      common: {
        KEY: "common",
        periodBetweenFileUpdatingAndRebuildingStarting__seconds: {
          KEY: "periodBetweenFileUpdatingAndRebuildingStarting__seconds"
        }
      },

      logging: {
        KEY: "logging",
        filesPaths: { KEY: "filesPaths" },
        filesCount: { KEY: "filesCount" },
        filesWatcherEvents: { KEY: "filesWatcherEvents" }
      },

      assetsGroups: {

        KEY: "assetsGroups",

        sourceFilesTopDirectoryRelativePath: { KEY: "sourceFilesTopDirectoryRelativePath" },
        referenceCustomAliasName: { KEY: "sourceFilesTopDirectoryPathAliasForReferencingFromHTML" },

        buildingModeDependent: {
          KEY: "buildingModeDependent",
          outputTopDirectoryRelativePath: { KEY: "outputTopDirectoryRelativePath" },
          revisioning: { KEY: "revisioning" },
          outputPathTransformations: { KEY: "outputPathTransformations" }
        }

      }

    },

    videosProcessing: {

      common: {
        KEY: "common",
        periodBetweenFileUpdatingAndRebuildingStarting__seconds: {
          KEY: "periodBetweenFileUpdatingAndRebuildingStarting__seconds"
        }
      },

      logging: {
        KEY: "logging",
        filesPaths: { KEY: "filesPaths" },
        filesCount: { KEY: "filesCount" },
        filesWatcherEvents: { KEY: "filesWatcherEvents" }
      },

      assetsGroups: {

        KEY: "assetsGroups",

        sourceFilesTopDirectoryRelativePath: { KEY: "sourceFilesTopDirectoryRelativePath" },
        referenceCustomAliasName: { KEY: "sourceFilesTopDirectoryPathAliasForReferencingFromHTML" },

        buildingModeDependent: {
          KEY: "buildingModeDependent",
          outputTopDirectoryRelativePath: { KEY: "outputTopDirectoryRelativePath" },
          revisioning: { KEY: "revisioning" },
          outputPathTransformations: { KEY: "outputPathTransformations" }
        }

      }

    },

    audiosProcessing: {

      common: {
        KEY: "common",
        periodBetweenFileUpdatingAndRebuildingStarting__seconds: {
          KEY: "periodBetweenFileUpdatingAndRebuildingStarting__seconds"
        }
      },

      logging: {
        KEY: "logging",
        filesPaths: { KEY: "filesPaths" },
        filesCount: { KEY: "filesCount" },
        filesWatcherEvents: { KEY: "filesWatcherEvents" }
      },

      assetsGroups: {

        KEY: "assetsGroups",

        sourceFilesTopDirectoryRelativePath: { KEY: "sourceFilesTopDirectoryRelativePath" },
        referenceCustomAliasName: { KEY: "sourceFilesTopDirectoryPathAliasForReferencingFromHTML" },

        buildingModeDependent: {
          KEY: "buildingModeDependent",
          outputTopDirectoryRelativePath: { KEY: "outputTopDirectoryRelativePath" },
          revisioning: { KEY: "revisioning" },
          outputPathTransformations: { KEY: "outputPathTransformations" }
        }

      }

    },

    plainCopying: {

      filesGroups: { KEY: "filesGroups" },

      sourceFileRelativePath: { KEY: "sourceFileRelativePath" },

      sourceTopDirectoryRelativePath: {
        KEY: "sourceTopDirectoryRelativePath",
        REQUIREMENT_CONDITION_DESCRIPTION: "\"sourceFileRelativePath\" is not specified"
      },

      fileNameLastExtensions: { KEY: "fileNameLastExtensions" },

      aliasName: { KEY: "aliasName" },

      buildingModeDependent: {

        KEY: "buildingModeDependent",

        outputDirectoryRelativePath: { KEY: "outputDirectoryRelativePath" },
        outputTopDirectoryRelativePath: { KEY: "outputTopDirectoryRelativePath" },

        revisioning: {
          KEY: "revisioning",
          enable: { KEY: "enable" },
          contentHashPostfixSeparator: { KEY: "contentHashPostfixSeparator" }
        },

        newFileNameWithExtension: { KEY: "newFileNameWithExtension" },

        filesRenamings: {
          KEY: "filesRenamings",
          pathRelativeToSourceDirectory: { KEY: "pathRelativeToSourceDirectory" },
          newFileNameWithExtension: { KEY: "newFileNameWithExtension" }
        },

        outputDirectoryPathTransformations: { KEY: "outputDirectoryPathTransformations" }

      }

    },

    filesWatching: {
      relativePathsOfExcludeFiles: { KEY: "relativePathsOfExcludeFiles" },
      relativePathsOfExcludeDirectories: { KEY: "relativePathsOfExcludeDirectories" }
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
          HTTPS: {
            KEY: "HTTPS",
            SSL_KeyRelativePath: { KEY: "SSL_KeyRelativePath" },
            SSL_CertificateRelativePath: { KEY: "SSL_CertificateRelativePath" }
          },
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
    },

    outputPackageJSON_Generating: {

      inheritedDependencies: { KEY: "inheritedDependencies" },
      inheritedDevelopmentDependencies: { KEY: "inheritedDevelopmentDependencies" },
      inheritedNPM_Scripts: { KEY: "inheritedNPM_Scripts" },
      newNPM_Scripts: { KEY: "newNPM_Scripts" },
      indentString: { KEY: "indentString" },
      linesSeparator: { KEY: "linesSeparator" },

      buildingModeDependent: {
        KEY: "buildingModeDependent",
        outputDirectoryRelativePath: { KEY: "outputDirectoryRelativePath" },
        indentString: { KEY: "indentString" },
        linesSeparator: { KEY: "linesSeparator" }
      }

    }

  }
};


export default ProjectBuildingConfigFromFileDefaultLocalization;
