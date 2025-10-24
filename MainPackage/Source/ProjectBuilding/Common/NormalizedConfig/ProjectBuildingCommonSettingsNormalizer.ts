/* ━━━ < Imports ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* ┅┅┅ Restrictions ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import ConsumingProjectBuildingModes from "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";
import mustProvideIncrementalProjectBuilding from
    "@ProjectBuilding/Common/Restrictions/mustProvideIncrementalProjectBuilding";
import FilesWatchingRestrictions from "@ProjectBuilding/FilesWatching/FilesWatchingRestrictions";

/* ┅┅┅ Default Settings ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import ProjectBuildingCommonSettings__Default from "@ProjectBuilding/Common/Defaults/ProjectBuildingCommonSettings__Default";

/* ┅┅┅ Raw Valid Settings ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import { ProjectBuildingTasksIDsForConfigFile } from
    "@ProjectBuilding:Common/RawConfig/Enumerations/ProjectBuildingTasksIDsForConfigFile";
import ProjectBuildingCommonSettings__FromFile__RawValid from
    "@ProjectBuilding:Common/RawConfig/ProjectBuildingCommonSettings__FromFile__RawValid";

/* ┅┅┅ Normalized Settings ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import type ProjectBuildingCommonSettings__Normalized from
    "@ProjectBuilding:Common/NormalizedConfig/ProjectBuildingCommonSettings__Normalized";

/* ┅┅┅ General Utils ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import { RawObjectDataProcessor, isString, isUndefined, isNotUndefined } from "@yamato-daiwa/es-extensions";
import { ObjectDataFilesProcessor, ImprovedGlob, ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";
/* ━━━ Imports > ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */


export default abstract class ProjectBuildingCommonSettingsNormalizer {

  public static normalize(
    {
      commonSettings__fromFile__rawValid,
      consumingProjectRootDirectoryAbsolutePath,
      projectBuildingMode,
      actualSelectiveExecutionID,
      actualSelectiveExecution
    }: Readonly<{
      commonSettings__fromFile__rawValid: ProjectBuildingCommonSettings__FromFile__RawValid;
      consumingProjectRootDirectoryAbsolutePath: string;
      projectBuildingMode: ConsumingProjectBuildingModes;
      actualSelectiveExecutionID?: string;
      actualSelectiveExecution?: ProjectBuildingCommonSettings__FromFile__RawValid.SelectiveExecution;
    }>
  ): ProjectBuildingCommonSettings__Normalized {

    const consumingProjectRootDirectoryAbsolutePath__forwardSlashes: string = ImprovedPath.
        replacePathSeparatorsToForwardSlashes(consumingProjectRootDirectoryAbsolutePath);

    const actualPublicDirectoryRelativePath: string | undefined =
        commonSettings__fromFile__rawValid.publicDirectoriesRelativePaths?.[projectBuildingMode];

    let actualPublicDirectoryAbsolutePath: string | undefined;

    if (isNotUndefined(actualPublicDirectoryRelativePath)) {
      actualPublicDirectoryAbsolutePath = ImprovedPath.joinPathSegments(
        [ consumingProjectRootDirectoryAbsolutePath__forwardSlashes, actualPublicDirectoryRelativePath ],
        { alwaysForwardSlashSeparators: true }
      );
    }

    const filesWatchingSettings__fromFile__rawValid:
        ProjectBuildingCommonSettings__FromFile__RawValid.FilesWatching | undefined =
            commonSettings__fromFile__rawValid.filesWatching;

    return {

      projectRootDirectoryAbsolutePath: consumingProjectRootDirectoryAbsolutePath__forwardSlashes,

      projectBuildingMode,

      mustProvideIncrementalBuilding: mustProvideIncrementalProjectBuilding(projectBuildingMode),

      ...isNotUndefined(actualSelectiveExecutionID) ? { selectiveExecutionID: actualSelectiveExecutionID } : null,

      ...isNotUndefined(actualSelectiveExecution) ? {

        tasksAndSourceFilesSelection: {

          markupProcessing: actualSelectiveExecution.
              tasksAndSourceFilesSelection[ProjectBuildingTasksIDsForConfigFile.markupProcessing],

          stylesProcessing: actualSelectiveExecution.
              tasksAndSourceFilesSelection[ProjectBuildingTasksIDsForConfigFile.stylesProcessing],

          ECMA_ScriptLogicProcessing: actualSelectiveExecution.
              tasksAndSourceFilesSelection[ProjectBuildingTasksIDsForConfigFile.ECMA_ScriptLogicProcessing],

          imagesProcessing: actualSelectiveExecution.
              tasksAndSourceFilesSelection[ProjectBuildingTasksIDsForConfigFile.imagesProcessing],

          fontsProcessing: actualSelectiveExecution.
              tasksAndSourceFilesSelection[ProjectBuildingTasksIDsForConfigFile.fontsProcessing],

          audiosProcessing: actualSelectiveExecution.
              tasksAndSourceFilesSelection[ProjectBuildingTasksIDsForConfigFile.audiosProcessing],

          plainCopying: actualSelectiveExecution.
              tasksAndSourceFilesSelection[ProjectBuildingTasksIDsForConfigFile.plainCopying],

          videosProcessing: actualSelectiveExecution.
              tasksAndSourceFilesSelection[ProjectBuildingTasksIDsForConfigFile.videosProcessing]

        }

      } : null,

      filesWatching: {

        excludedFilesGlobSelectors: new Set(
          [

            ...FilesWatchingRestrictions.relativePathsOfExcludeFiles,
            ...filesWatchingSettings__fromFile__rawValid?.relativePathsOfExcludedFiles ?? [],

            /* eslint-disable-next-line @stylistic/no-extra-parens -- For squared layout */
            ...(
              projectBuildingMode === ConsumingProjectBuildingModes.staticPreview ||
              projectBuildingMode === ConsumingProjectBuildingModes.localDevelopment
            ) ?
              filesWatchingSettings__fromFile__rawValid?.buildingModeDependent?.[projectBuildingMode].
                  relativePathsOfExcludedFiles ??
                [] :
              []

          ].
              map(
                (fileRelativePath: string): string =>

                    /* [ Theory ] In this case the Glob even with a directory absolute path. */
                    ImprovedPath.joinPathSegments(
                      [ consumingProjectRootDirectoryAbsolutePath, fileRelativePath ],
                      { alwaysForwardSlashSeparators: true }
                    )

              )

        ),

        excludedDirectoriesGlobSelectors: new Set(
          [

            ...FilesWatchingRestrictions.relativePathsOfExcludeDirectories,
            ...filesWatchingSettings__fromFile__rawValid?.relativePathsOfExcludeDirectories ?? [],

            /* eslint-disable-next-line @stylistic/no-extra-parens -- For squared layout */
            ...(
              projectBuildingMode === ConsumingProjectBuildingModes.staticPreview ||
              projectBuildingMode === ConsumingProjectBuildingModes.localDevelopment
            ) ?
              filesWatchingSettings__fromFile__rawValid?.buildingModeDependent?.[projectBuildingMode].
                  relativePathsOfExcludeDirectories ??
                [] :
              []

          ].
              map(
                (directoryRelativePath: string): string =>

                    ImprovedGlob.buildAllFilesInCurrentDirectoryAndBelowGlobSelector({
                      basicDirectoryPath: ImprovedPath.joinPathSegments(
                        [ consumingProjectRootDirectoryAbsolutePath, directoryRelativePath ],
                        { alwaysForwardSlashSeparators: true }
                      )
                    })

              )
        )

      },

      browserLiveReloadingSetupID: actualSelectiveExecution?.browserLiveReloadingSetupID,

      mustGenerateOutputPackageJSON: actualSelectiveExecution?.distributablePackageJSON_Generating === true,

      dockerSetupID: actualSelectiveExecution?.dockerSetupID,

      actualPublicDirectoryAbsolutePath,

      processingOnDemand: {

          enabled:
              actualSelectiveExecution?.processingOnDemand?.enabled ??
              commonSettings__fromFile__rawValid.processingOnDemand?.enabled ??
              ProjectBuildingCommonSettings__Default.processingOnDemand.enabled,

          fullInitialBuilding:
              actualSelectiveExecution?.processingOnDemand?.fullInitialBuilding ??
              commonSettings__fromFile__rawValid.processingOnDemand?.fullInitialBuilding ??
              ProjectBuildingCommonSettings__Default.processingOnDemand.fullInitialBuilding

      },


      CSS_ClassesMinificationOnFly:
          ProjectBuildingCommonSettingsNormalizer.normalizeCSS_ClassesMinificationOnFlySettings({
            CSS_ClassesMinificationOnFlySettings__fromFile__rawValid:
                commonSettings__fromFile__rawValid.CSS_ClassesShorteningOnFly,
            projectBuildingMode,
            actualSelectiveExecutionID,
            consumingProjectRootDirectoryAbsolutePath
          })

    };

  }

  protected static normalizeCSS_ClassesMinificationOnFlySettings(
    {
      CSS_ClassesMinificationOnFlySettings__fromFile__rawValid,
      projectBuildingMode,
      actualSelectiveExecutionID,
      consumingProjectRootDirectoryAbsolutePath
    }: Readonly<{
      CSS_ClassesMinificationOnFlySettings__fromFile__rawValid?:
          ProjectBuildingCommonSettings__FromFile__RawValid.CSS_ClassesShorteningOnFly;
      projectBuildingMode: ConsumingProjectBuildingModes;
      actualSelectiveExecutionID?: string;
      consumingProjectRootDirectoryAbsolutePath: string;
    }>

  ): ProjectBuildingCommonSettings__Normalized.CSS_ClassesMinificationOnFly {

    if (isUndefined(CSS_ClassesMinificationOnFlySettings__fromFile__rawValid)) {
      return {
        enabled: false,
        CSS_ClassesRegularExpressions: new Set(),
        forbiddenMinifiedCSS_ClassesNames: new Set(),
        ignoredCSS_Classes: new Set(),
        generatingInMarkupOfShortCSS_ClassesNotMentionedInStylesheets: {
          enabled: false,
          ignoredInitialCSS_Classes: new Set()
        }
      };
    }


    const CSS_ClassesPrefixesDefaultSeparators: ReadonlySet<string> =

        new Set(
          isString(CSS_ClassesMinificationOnFlySettings__fromFile__rawValid.CSS_ClassesPrefixesDefaultSeparators) ?
              [ CSS_ClassesMinificationOnFlySettings__fromFile__rawValid.CSS_ClassesPrefixesDefaultSeparators ] :
              CSS_ClassesMinificationOnFlySettings__fromFile__rawValid.CSS_ClassesPrefixesDefaultSeparators
        );

    const partialSetups:
        Array<ProjectBuildingCommonSettings__FromFile__RawValid.CSS_ClassesMinificationOnFly.PartialSetup> = [];

    for (
      const pathOfPartialSetupFileRelativeToProjectRootDirectory of
          CSS_ClassesMinificationOnFlySettings__fromFile__rawValid.pathsOfPartialSetupFilesRelativeToProjectRootDirectory ??
              []
    ) {

      partialSetups.push(
        ObjectDataFilesProcessor.processFile({
          filePath:
              ImprovedPath.joinPathSegments([
                consumingProjectRootDirectoryAbsolutePath, pathOfPartialSetupFileRelativeToProjectRootDirectory
              ]),
          schema: ObjectDataFilesProcessor.SupportedSchemas.YAML,
          synchronously: true,
          validDataSpecification: {
            nameForLogging: pathOfPartialSetupFileRelativeToProjectRootDirectory,
            subtype: RawObjectDataProcessor.ObjectSubtypes.fixedSchema,
            properties:
                ProjectBuildingCommonSettings__FromFile__RawValid.PropertiesSpecification.CSS_ClassesMinificationOnFly.partial
          }
        })
      );

    }


    return {

      enabled:

          CSS_ClassesMinificationOnFlySettings__fromFile__rawValid.enabledOn.projectBuildingModes[projectBuildingMode] === true &&
            (
              isUndefined(actualSelectiveExecutionID) ||
                  isUndefined(CSS_ClassesMinificationOnFlySettings__fromFile__rawValid.enabledOn.selectiveExecutions) ||
                  CSS_ClassesMinificationOnFlySettings__fromFile__rawValid.enabledOn.
                      selectiveExecutions[actualSelectiveExecutionID] === true
            ),

      CSS_ClassesRegularExpressions:

          new Set(
            CSS_ClassesMinificationOnFlySettings__fromFile__rawValid.CSS_ClassesPrefixes.
                concat(
                  partialSetups.flatMap(
                    (
                      partialSetup: ProjectBuildingCommonSettings__FromFile__RawValid.CSS_ClassesMinificationOnFly.PartialSetup
                    ):
                        ReadonlyArray<string | Readonly<{ prefix: string; separators: ReadonlyArray<string> | string; }>> =>
                            partialSetup.CSS_ClassesPrefixes
                  )
                ).
                map(
                  (
                    polymorphicArrayElement:
                        string | Readonly<{ prefix: string; separators: ReadonlyArray<string> | string; }>
                  ): RegExp => {

                    let CSS_ClassPrefix: string;
                    let CSS_ClassPrefixSeparators: ReadonlyArray<string> = [];

                    if (isString(polymorphicArrayElement)) {

                      CSS_ClassPrefix = polymorphicArrayElement;

                    } else {

                      CSS_ClassPrefix = polymorphicArrayElement.prefix;

                      CSS_ClassPrefixSeparators =
                          isString(polymorphicArrayElement.separators) ?
                              [ polymorphicArrayElement.separators ] :
                              polymorphicArrayElement.separators;

                    }

                    if (CSS_ClassPrefixSeparators.length === 0) {
                      CSS_ClassPrefixSeparators = Array.from(CSS_ClassesPrefixesDefaultSeparators);
                    }


                    /*
                     * [ Example ] ^(?:(?:Foo-Alpha$)|(?:Foo-Alpha(?:-|__)(?!-|_).+?$))
                     * [ Fiddle ] https://regex101.com/r/HthYhx/2
                     * */
                    const CSS_ClassPrefixSeparators__singleCharacterPerItem: ReadonlyArray<string> =
                        CSS_ClassPrefixSeparators.map(
                            (CSS_ClassPrefixSeparator: string): string => Array.from(CSS_ClassPrefixSeparator)[0]
                        );

                    return new RegExp(
                      [

                        /* [ Complex Regular Expression ] `CSS_ClassPrefix` only or ... */
                        `^(?:(?:${ CSS_ClassPrefix }$)|`,

                          /* [ Complex Regular Expression ]
                           * ① CSS_ClassPrefix` then ...
                           * ② Divider then ...
                           * ③ Anything except character from which dividers start then ...
                           * ④ Any character except line braking until the end of string because
                           *    Any character except NUL is allowed in CSS class names in CSS.
                           *    https://stackoverflow.com/a/6732899/4818123
                           *  */
                        `(?:${ CSS_ClassPrefix }(?:${ CSS_ClassPrefixSeparators.join("|") })` +
                          `(?!${ CSS_ClassPrefixSeparators__singleCharacterPerItem.join("|") }).+?$))`

                      ].join(""),
                      "u"
                    );

                  }
            )
          ),

      forbiddenMinifiedCSS_ClassesNames:

          new Set([
            ...CSS_ClassesMinificationOnFlySettings__fromFile__rawValid.forbiddenShortenedCSS_ClassesNames ?? [],
            ...partialSetups.flatMap(
              (partialSetup: ProjectBuildingCommonSettings__FromFile__RawValid.CSS_ClassesMinificationOnFly.PartialSetup):
                  ReadonlyArray<string> =>
                      partialSetup.forbiddenShortenedCSS_ClassesNames ?? []
            )
          ]),

      ignoredCSS_Classes:

          new Set([
            ...CSS_ClassesMinificationOnFlySettings__fromFile__rawValid.ignoredInitialCSS_Classes ?? [],
            ...partialSetups.flatMap(
              (partialSetup: ProjectBuildingCommonSettings__FromFile__RawValid.CSS_ClassesMinificationOnFly.PartialSetup):
                  ReadonlyArray<string> =>
                      partialSetup.ignoredInitialCSS_Classes ?? []
            )
          ]),

      generatingInMarkupOfShortCSS_ClassesNotMentionedInStylesheets: {

        enabled:
            CSS_ClassesMinificationOnFlySettings__fromFile__rawValid.
                generatingInMarkupOfShortCSS_ClassesNotMentionedInStylesheets?.enabled ??
            ProjectBuildingCommonSettings__Default.CSS_ClassesMinificationOnFly.
                generatingInMarkupOfShortCSS_ClassesNotMentionedInStylesheets.enabled,

        ignoredInitialCSS_Classes: new Set(
            CSS_ClassesMinificationOnFlySettings__fromFile__rawValid.
                generatingInMarkupOfShortCSS_ClassesNotMentionedInStylesheets?.ignoredInitialCSS_Classes ??
            []
        )

      }

    };

  }

}
