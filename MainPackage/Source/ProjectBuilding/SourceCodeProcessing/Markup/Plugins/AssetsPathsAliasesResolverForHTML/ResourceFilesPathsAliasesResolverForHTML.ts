/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type StylesProcessingSettings__Normalized from "@StylesProcessing/StylesProcessingSettings__Normalized";
import type ECMA_ScriptLogicProcessingSettings__Normalized from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettings__Normalized";
import type ImagesProcessingSettings__Normalized from "@ImagesProcessing/ImagesProcessingSettings__Normalized";
import type AudiosProcessingSettings__Normalized from "@AudiosProcessing/AudiosProcessingSettings__Normalized";
import type VideosProcessingSettings__Normalized from "@VideosProcessing/VideosProcessingSettings__Normalized";

/* --- Settings representatives ------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type StylesProcessingSettingsRepresentative from "@StylesProcessing/StylesProcessingSettingsRepresentative";
import type ECMA_ScriptLogicProcessingSettingsRepresentative from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettingsRepresentative";
import type ImagesProcessingSettingsRepresentative from "@ImagesProcessing/ImagesProcessingSettingsRepresentative";
import type VideosProcessingSettingsRepresentative from "@VideosProcessing/VideosProcessingSettingsRepresentative";
import type AudiosProcessingSettingsRepresentative from "@AudiosProcessing/AudiosProcessingSettingsRepresentative";

/* --- Tasks executor ----------------------------------------------------------------------------------------------- */
import type MarkupProcessor from "@MarkupProcessing/MarkupProcessor";

/* --- Assets ------------------------------------------------------------------------------------------------------- */
import AssetsPathsAliasesResolverForHTML_Localization__English from
    "@MarkupProcessing/Plugins/AssetsPathsAliasesResolverForHTML/AssetsPathsAliasesResolverForHTML_Localization.english";

/* --- Applied auxiliaries ------------------------------------------------------------------------------------------ */
import cheerio from "cheerio";
import extractExpectedToBeNonNullStringifiedContentFromVinylFile from
    "@Utils/getExpectedToBeNonNullStringifiedContentOfVinylFile";

/* --- General auxiliaries ------------------------------------------------------------------------------------------ */
import {
  Logger,
  stringifyAndFormatArbitraryValue,
  createMapBasedOnOtherMap,
  filterMap,
  isNonEmptyString,
  isUndefined,
  isNull
} from "@yamato-daiwa/es-extensions";
import type { WarningLog } from "@yamato-daiwa/es-extensions";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";


class ResourceFilesPathsAliasesResolverForHTML {

  public static localization: ResourceFilesPathsAliasesResolverForHTML.Localization =
      AssetsPathsAliasesResolverForHTML_Localization__English;

  private readonly compiledHTML_File: MarkupProcessor.MarkupVinylFile;
  private readonly HTML_FileContentCheerioCapturing: cheerio.Root;
  private readonly masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;


  public static resolvePathAliases(
    compiledHTML_File: MarkupProcessor.MarkupVinylFile,
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): string {

      return new ResourceFilesPathsAliasesResolverForHTML(compiledHTML_File, masterConfigRepresentative).

          resolveStylesheetsPathsAliases().
          resoleScriptsPathsAliases().
          resolveImagesPathsAliases().
          resolveVideosPathsAliases().
          resolveAudiosPathsAliases().

          /* [ Theory ] Without '{ decodeEntities: false }' all ideographic characters will be converted to entities
           * like '&#x6587;' what could cause some troubles during HTML code post-processing. */
          HTML_FileContentCheerioCapturing.
          html({ decodeEntities: false });
  }


  private constructor(
    compiledHTML_File: MarkupProcessor.MarkupVinylFile,
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ) {
    this.compiledHTML_File = compiledHTML_File;
    this.HTML_FileContentCheerioCapturing = cheerio.load(
      extractExpectedToBeNonNullStringifiedContentFromVinylFile(compiledHTML_File)
    );
    this.masterConfigRepresentative = masterConfigRepresentative;
  }


  private resolveStylesheetsPathsAliases(): this {

    if (isUndefined(this.masterConfigRepresentative.stylesProcessingSettingsRepresentative)) {
      return this;
    }


    const stylesProcessingSettingsRepresentative: StylesProcessingSettingsRepresentative =
        this.masterConfigRepresentative.stylesProcessingSettingsRepresentative;

    for (const linkElement of Array.from(this.HTML_FileContentCheerioCapturing("link[rel='stylesheet']"))) {

      const $linkElement: cheerio.Cheerio = this.HTML_FileContentCheerioCapturing(linkElement);
      const hrefAttributeValue: string | undefined = $linkElement.attr("href");

      if (!isNonEmptyString(hrefAttributeValue)) {
        continue;
      }


      const resolvedOutputAbsolutePathOfStylesheet: string | null = this.resolveOutputResourceFileAbsolutePathIfPossible({
        pickedPathOfTargetResourceFile: hrefAttributeValue,
        prefixOfAliasOfTopDirectoryOfResourcesGroup: stylesProcessingSettingsRepresentative.
            prefixOfAliasOfTopDirectoryOfEntryPointsGroup,
        sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: createMapBasedOnOtherMap(
          stylesProcessingSettingsRepresentative.entryPointsGroupsNormalizedSettingsMappedByPathAliases,
          (
            pathAlias: string, stylesEntryPointsGroupNormalizedSettings: StylesProcessingSettings__Normalized.EntryPointsGroup
          ): [ string, string ] => [
            pathAlias,
            stylesEntryPointsGroupNormalizedSettings.isSingeEntryPointGroup ?
                stylesEntryPointsGroupNormalizedSettings.sourceFilesGlobSelectors[0] :
                stylesEntryPointsGroupNormalizedSettings.sourceFilesTopDirectoryAbsolutePath
          ]
        ),
        supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: stylesProcessingSettingsRepresentative.
            supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots,
        sourceAndOutputFilesAbsolutePathsCorrespondenceMap:
            stylesProcessingSettingsRepresentative.sourceAndOutputFilesAbsolutePathsCorrespondenceMap,
        fileTypeForLogging__singularForm: stylesProcessingSettingsRepresentative.TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM,
        fileTypeForLogging__pluralForm: stylesProcessingSettingsRepresentative.TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM
      });

      if (isNull(resolvedOutputAbsolutePathOfStylesheet)) {
        continue;
      }


      $linkElement.attr(
        "href",
        this.buildResourceFileFinalPath({
          resolvedOutputAbsolutePathOfResourceFile: resolvedOutputAbsolutePathOfStylesheet,
          resourceFileType__singularForm: stylesProcessingSettingsRepresentative.TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM
        })
      );
    }


    return this;
  }

  private resoleScriptsPathsAliases(): this {

    if (isUndefined(this.masterConfigRepresentative.ECMA_ScriptLogicProcessingSettingsRepresentative)) {
      return this;
    }


    const ECMA_ScriptLogicProcessingConfigRepresentative: ECMA_ScriptLogicProcessingSettingsRepresentative =
        this.masterConfigRepresentative.ECMA_ScriptLogicProcessingSettingsRepresentative;

    for (const scriptElement of Array.from(this.HTML_FileContentCheerioCapturing("script"))) {

      const $scriptElement: cheerio.Cheerio = this.HTML_FileContentCheerioCapturing(scriptElement);
      const srcAttributeValue: string | undefined = $scriptElement.attr("src");

      if (!isNonEmptyString(srcAttributeValue)) {
        continue;
      }


      const resolvedOutputAbsolutePathOfScript: string | null = this.resolveOutputResourceFileAbsolutePathIfPossible({
        pickedPathOfTargetResourceFile: srcAttributeValue,
        prefixOfAliasOfTopDirectoryOfResourcesGroup: ECMA_ScriptLogicProcessingConfigRepresentative.
            prefixOfAliasOfTopDirectoryOfEntryPointsGroup,
        sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: createMapBasedOnOtherMap(
          ECMA_ScriptLogicProcessingConfigRepresentative.entryPointsGroupsNormalizedSettingsMappedByPathAliases,
          (
            pathAlias: string,
            entryPointsGroupNormalizedSettings: ECMA_ScriptLogicProcessingSettings__Normalized.EntryPointsGroup
          ): [ string, string ] => [
            pathAlias,
            entryPointsGroupNormalizedSettings.isSingeEntryPointGroup ?
                entryPointsGroupNormalizedSettings.sourceFilesGlobSelectors[0] :
                entryPointsGroupNormalizedSettings.sourceFilesTopDirectoryAbsolutePath
          ]
        ),
        supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots:
            ECMA_ScriptLogicProcessingConfigRepresentative.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots,
        sourceAndOutputFilesAbsolutePathsCorrespondenceMap:
            ECMA_ScriptLogicProcessingConfigRepresentative.entryPointsSourceFilesAbsolutePathsAndOutputFilesActualPathsMap,
        fileTypeForLogging__singularForm: ECMA_ScriptLogicProcessingConfigRepresentative.
            TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM,
        fileTypeForLogging__pluralForm: ECMA_ScriptLogicProcessingConfigRepresentative.
            TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM
      });

      if (isNull(resolvedOutputAbsolutePathOfScript)) {
        continue;
      }


      $scriptElement.attr(
        "src",
        this.buildResourceFileFinalPath({
          resolvedOutputAbsolutePathOfResourceFile: resolvedOutputAbsolutePathOfScript,
          resourceFileType__singularForm: ECMA_ScriptLogicProcessingConfigRepresentative.
              TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM
        })
      );
    }


    return this;
  }

  private resolveImagesPathsAliases(): this {

    if (isUndefined(this.masterConfigRepresentative.imagesProcessingSettingsRepresentative)) {
      return this;
    }


    const imagesProcessingConfigRepresentative: ImagesProcessingSettingsRepresentative =
        this.masterConfigRepresentative.imagesProcessingSettingsRepresentative;

    for (const imageElement of Array.from(this.HTML_FileContentCheerioCapturing("img"))) {

      const $imageElement: cheerio.Cheerio = this.HTML_FileContentCheerioCapturing(imageElement);
      const srcAttributeValue: string | undefined = $imageElement.attr("src");

      if (!isNonEmptyString(srcAttributeValue)) {
        continue;
      }


      const resolvedOutputAbsolutePathOfImage: string | null = this.resolveOutputResourceFileAbsolutePathIfPossible({
        pickedPathOfTargetResourceFile: srcAttributeValue,
        prefixOfAliasOfTopDirectoryOfResourcesGroup: imagesProcessingConfigRepresentative.
            prefixOfAliasOfTopDirectoryOfEntryPointsGroup,
        sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: createMapBasedOnOtherMap(
          imagesProcessingConfigRepresentative.assetsGroupsNormalizedSettingsMappedByAssetAliases,
          (
              pathAlias: string, stylesEntryPointsGroupNormalizedSettings: ImagesProcessingSettings__Normalized.AssetsGroup
          ): [ string, string ] => [ pathAlias, stylesEntryPointsGroupNormalizedSettings.sourceFilesTopDirectoryAbsolutePath ]
        ),
        supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots:
            imagesProcessingConfigRepresentative.supportedSourceFilesNamesExtensionsWithoutLeadingDots,
        sourceAndOutputFilesAbsolutePathsCorrespondenceMap:
            imagesProcessingConfigRepresentative.sourceFilesAbsolutePathsAndOutputFilesActualPathsMap,
        fileTypeForLogging__singularForm: imagesProcessingConfigRepresentative.TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM,
        fileTypeForLogging__pluralForm: imagesProcessingConfigRepresentative.TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM
      });

      if (isNull(resolvedOutputAbsolutePathOfImage)) {
        continue;
      }


      $imageElement.attr(
        "src",
        this.buildResourceFileFinalPath({
          resolvedOutputAbsolutePathOfResourceFile: resolvedOutputAbsolutePathOfImage,
          resourceFileType__singularForm: imagesProcessingConfigRepresentative.TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM
        })
      );
    }

    for (const linkElement of Array.from(this.HTML_FileContentCheerioCapturing("link[type='image/x-icon']"))) {

      const $linkElement: cheerio.Cheerio = this.HTML_FileContentCheerioCapturing(linkElement);
      const hrefAttributeValue: string | undefined = $linkElement.attr("href");

      if (isUndefined(hrefAttributeValue)) {
        continue;
      }


      const imageResolvedOutputAbsolutePath: string | null = this.resolveOutputResourceFileAbsolutePathIfPossible({
        pickedPathOfTargetResourceFile: hrefAttributeValue,
        prefixOfAliasOfTopDirectoryOfResourcesGroup: imagesProcessingConfigRepresentative.
            prefixOfAliasOfTopDirectoryOfEntryPointsGroup,
        sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: createMapBasedOnOtherMap(
            imagesProcessingConfigRepresentative.assetsGroupsNormalizedSettingsMappedByAssetAliases,
            (
              pathAlias: string, stylesEntryPointsGroupNormalizedSettings: ImagesProcessingSettings__Normalized.AssetsGroup
            ): [ string, string ] => [
              pathAlias, stylesEntryPointsGroupNormalizedSettings.sourceFilesTopDirectoryAbsolutePath
            ]
        ),
        supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots:
        imagesProcessingConfigRepresentative.supportedSourceFilesNamesExtensionsWithoutLeadingDots,
        sourceAndOutputFilesAbsolutePathsCorrespondenceMap:
        imagesProcessingConfigRepresentative.sourceFilesAbsolutePathsAndOutputFilesActualPathsMap,
        fileTypeForLogging__singularForm: imagesProcessingConfigRepresentative.TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM,
        fileTypeForLogging__pluralForm: imagesProcessingConfigRepresentative.TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM
      });

      if (isNull(imageResolvedOutputAbsolutePath)) {
        continue;
      }


      $linkElement.attr(
        "href",
        this.buildResourceFileFinalPath({
          resolvedOutputAbsolutePathOfResourceFile: imageResolvedOutputAbsolutePath,
          resourceFileType__singularForm: imagesProcessingConfigRepresentative.TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM
        })
      );
    }


    return this;
  }

  private resolveVideosPathsAliases(): this {

    if (isUndefined(this.masterConfigRepresentative.videosProcessingSettingsRepresentative)) {
      return this;
    }


    const videosProcessingConfigRepresentative: VideosProcessingSettingsRepresentative =
        this.masterConfigRepresentative.videosProcessingSettingsRepresentative;

    for (const sourceElement of Array.from(this.HTML_FileContentCheerioCapturing("video > source"))) {

      const $sourceElement: cheerio.Cheerio = this.HTML_FileContentCheerioCapturing(sourceElement);
      const srcAttributeValue: string | undefined = $sourceElement.attr("src");

      if (!isNonEmptyString(srcAttributeValue)) {
        continue;
      }


      const resolvedOutputAbsolutePathOfVideo: string | null = this.resolveOutputResourceFileAbsolutePathIfPossible({
        pickedPathOfTargetResourceFile: srcAttributeValue,
        prefixOfAliasOfTopDirectoryOfResourcesGroup: videosProcessingConfigRepresentative.
            prefixOfAliasOfTopDirectoryOfEntryPointsGroup,
        sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: createMapBasedOnOtherMap(
          videosProcessingConfigRepresentative.assetsGroupsNormalizedSettingsMappedByAssetAliases,
          (
            pathAlias: string, stylesEntryPointsGroupNormalizedSettings: VideosProcessingSettings__Normalized.AssetsGroup
          ): [ string, string ] => [ pathAlias, stylesEntryPointsGroupNormalizedSettings.sourceFilesTopDirectoryAbsolutePath ]
        ),
        supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots:
            videosProcessingConfigRepresentative.supportedSourceFilesNamesExtensionsWithoutLeadingDots,
        sourceAndOutputFilesAbsolutePathsCorrespondenceMap:
            videosProcessingConfigRepresentative.sourceFilesAbsolutePathsAndOutputFilesActualPathsMap,
        fileTypeForLogging__singularForm: videosProcessingConfigRepresentative.TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM,
        fileTypeForLogging__pluralForm: videosProcessingConfigRepresentative.TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM
      });

      if (isNull(resolvedOutputAbsolutePathOfVideo)) {
        continue;
      }


      $sourceElement.attr(
        "src",
        this.buildResourceFileFinalPath({
          resolvedOutputAbsolutePathOfResourceFile: resolvedOutputAbsolutePathOfVideo,
          resourceFileType__singularForm: videosProcessingConfigRepresentative.TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM
        })
      );
    }

    return this;
  }

  private resolveAudiosPathsAliases(): this {

    if (isUndefined(this.masterConfigRepresentative.audiosProcessingSettingsRepresentative)) {
      return this;
    }


    const audiosProcessingConfigRepresentative: AudiosProcessingSettingsRepresentative =
        this.masterConfigRepresentative.audiosProcessingSettingsRepresentative;

    for (const sourceElement of Array.from(this.HTML_FileContentCheerioCapturing("audio > source"))) {

      const $sourceElement: cheerio.Cheerio = this.HTML_FileContentCheerioCapturing(sourceElement);
      const srcAttributeValue: string | undefined = $sourceElement.attr("src");

      if (isUndefined(srcAttributeValue)) {
        continue;
      }


      const resolvedOutputAbsolutePathOfVideo: string | null = this.resolveOutputResourceFileAbsolutePathIfPossible({
        pickedPathOfTargetResourceFile: srcAttributeValue,
        prefixOfAliasOfTopDirectoryOfResourcesGroup: audiosProcessingConfigRepresentative.
            prefixOfAliasOfTopDirectoryOfEntryPointsGroup,
        sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: createMapBasedOnOtherMap(
          audiosProcessingConfigRepresentative.assetsGroupsNormalizedSettingsMappedByAssetAliases,
          (
              pathAlias: string, stylesEntryPointsGroupNormalizedSettings: AudiosProcessingSettings__Normalized.AssetsGroup
          ): [ string, string ] => [ pathAlias, stylesEntryPointsGroupNormalizedSettings.sourceFilesTopDirectoryAbsolutePath ]
        ),
        supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots:
        audiosProcessingConfigRepresentative.supportedSourceFilesNamesExtensionsWithoutLeadingDots,
        sourceAndOutputFilesAbsolutePathsCorrespondenceMap:
        audiosProcessingConfigRepresentative.sourceFilesAbsolutePathsAndOutputFilesActualPathsMap,
        fileTypeForLogging__singularForm: audiosProcessingConfigRepresentative.TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM,
        fileTypeForLogging__pluralForm: audiosProcessingConfigRepresentative.TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM
      });

      if (isNull(resolvedOutputAbsolutePathOfVideo)) {
        continue;
      }


      $sourceElement.attr(
        "src",
        this.buildResourceFileFinalPath({
          resolvedOutputAbsolutePathOfResourceFile: resolvedOutputAbsolutePathOfVideo,
          resourceFileType__singularForm: audiosProcessingConfigRepresentative.TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM
        })
      );
    }

    return this;
  }


  /* --- Helpers ---------------------------------------------------------------------------------------------------- */
  /* eslint-disable-next-line class-methods-use-this --
  * The method is being used before non-static "buildResourceFileFinalPath", so in this case it has been declared first. */
  private resolveOutputResourceFileAbsolutePathIfPossible(
    {
      pickedPathOfTargetResourceFile,
      prefixOfAliasOfTopDirectoryOfResourcesGroup,
      sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap,
      supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots,
      sourceAndOutputFilesAbsolutePathsCorrespondenceMap,
      fileTypeForLogging__pluralForm
    }: {
      pickedPathOfTargetResourceFile: string;
      prefixOfAliasOfTopDirectoryOfResourcesGroup: string;
      sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: Map<string, string>;
      supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: Array<string>;
      sourceAndOutputFilesAbsolutePathsCorrespondenceMap: Map<string, string>;
      fileTypeForLogging__singularForm: string;
      fileTypeForLogging__pluralForm: string;
    }
  ): string | null {

    const segmentsOfPickedPath: Array<string> = ImprovedPath.splitPathToSegments(pickedPathOfTargetResourceFile);
    const firstSegmentOfPickedPath: string | undefined = segmentsOfPickedPath[0];

    if (
      isUndefined(firstSegmentOfPickedPath) ||
      !firstSegmentOfPickedPath.startsWith(prefixOfAliasOfTopDirectoryOfResourcesGroup)
    ) {
      return null;
    }


    const sourceFilesTopDirectoryAbsolutePathOfCurrentAlias: string | undefined =
        sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap.get(firstSegmentOfPickedPath);

    if (isUndefined(sourceFilesTopDirectoryAbsolutePathOfCurrentAlias)) {
      Logger.logWarning(
        ResourceFilesPathsAliasesResolverForHTML.localization.generateUnknownSourceFileTopDirectoryAliasWarning({
          fileType__singularForm: fileTypeForLogging__pluralForm,
          firstPathSegment: firstSegmentOfPickedPath,
          pickedPathOfTargetResourceFile,
          formattedSourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: stringifyAndFormatArbitraryValue(
            Array.from(sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap.entries())
          )
        })
      );

      return null;
    }


    const sourceFileComputedAbsolutePathPossiblyWithoutFileNameExtension: string = ImprovedPath.joinPathSegments(
      sourceFilesTopDirectoryAbsolutePathOfCurrentAlias, ...segmentsOfPickedPath.slice(1)
    );

    const explicitlySpecifiedSourceFilenameExtension: string | null = ImprovedPath.
        extractLastFilenameExtensionWithoutFirstDot(sourceFileComputedAbsolutePathPossiblyWithoutFileNameExtension);


    if (isNull(explicitlySpecifiedSourceFilenameExtension)) {

      const possibleAbsolutePathsOfTargetSourceFile: Array<string> =
          supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots.map(
            (supportedStylesheetFileNameExtensionWithoutLeadingDot: string): string =>
                `${ sourceFileComputedAbsolutePathPossiblyWithoutFileNameExtension }.` +
                `${ supportedStylesheetFileNameExtensionWithoutLeadingDot }`
          );

      const searchingResultsInSourceFilesAbsolutePathsAndOutputFilesActualPathsMap: Map<string, string> = filterMap(
        sourceAndOutputFilesAbsolutePathsCorrespondenceMap,
        (sourceFileAbsolutePath: string): boolean => possibleAbsolutePathsOfTargetSourceFile.includes(sourceFileAbsolutePath)
      );

      if (searchingResultsInSourceFilesAbsolutePathsAndOutputFilesActualPathsMap.size === 0) {

        Logger.logWarning(
          ResourceFilesPathsAliasesResolverForHTML.localization.
              generateNoMatchingsForAliasedFilePathWithoutFilenameExtensionWarning({
                pickedPathOfTargetResourceFile,
                fileType__singularForm: fileTypeForLogging__pluralForm,
                checkedAbsolutePaths__formatted: stringifyAndFormatArbitraryValue(possibleAbsolutePathsOfTargetSourceFile)
              })
        );
        return null;
      }


      return Array.from(searchingResultsInSourceFilesAbsolutePathsAndOutputFilesActualPathsMap.values())[0];
    }


    const resolvedFileOutputAbsolutePath: string | undefined = sourceAndOutputFilesAbsolutePathsCorrespondenceMap.
        get(sourceFileComputedAbsolutePathPossiblyWithoutFileNameExtension);

    if (isUndefined(resolvedFileOutputAbsolutePath)) {

      Logger.logWarning(
        ResourceFilesPathsAliasesResolverForHTML.localization.generateNoOutputFileExistingForSpecifiedSourceFilePath({
          pickedPathOfTargetResourceFile,
          fileType__singularForm: fileTypeForLogging__pluralForm
        })
      );

      return null;
    }


    return resolvedFileOutputAbsolutePath;
  }


  private buildResourceFileFinalPath(
    {
      resolvedOutputAbsolutePathOfResourceFile,
      resourceFileType__singularForm
    }: {
      resolvedOutputAbsolutePathOfResourceFile: string;
      resourceFileType__singularForm: string;
    }
  ): string {

    if (
      this.masterConfigRepresentative.isDevelopmentBuildingMode ||
      isUndefined(this.masterConfigRepresentative.actualPublicDirectoryAbsolutePath)
    ) {

      if (
        !this.masterConfigRepresentative.isDevelopmentBuildingMode &&
        isUndefined(this.masterConfigRepresentative.actualPublicDirectoryAbsolutePath)
      ) {
        Logger.logWarning(
          ResourceFilesPathsAliasesResolverForHTML.localization.generateUnableToResolveShortenedAbsolutePathWarning({
            projectBuildingMode: this.masterConfigRepresentative.consumingProjectBuildingMode,
            filesType__singularForm: resourceFileType__singularForm
          })
        );
      }

      return ImprovedPath.computeRelativePath({
        basePath: this.compiledHTML_File.outputDirectoryAbsolutePath,
        comparedPath: resolvedOutputAbsolutePathOfResourceFile
      });
    }


    return `/${ ImprovedPath.computeRelativePath({
      basePath: this.masterConfigRepresentative.actualPublicDirectoryAbsolutePath,
      comparedPath: resolvedOutputAbsolutePathOfResourceFile
    }) }`;
  }
}


namespace ResourceFilesPathsAliasesResolverForHTML {

  export type Localization = Readonly<{

    generateUnableToResolveShortenedAbsolutePathWarning: (
      namedParameters: Localization.UnableToResolveShortenedAbsolutePathWarning.TemplateNamedParameters
    ) => Pick<WarningLog, "title" | "description">;

    generateUnknownSourceFileTopDirectoryAliasWarning: (
      namedParameters: Localization.UnknownSourceFileTopDirectoryAliasWarning.TemplateNamedParameters
    ) => Pick<WarningLog, "title" | "description">;

    generateNoMatchingsForAliasedFilePathWithoutFilenameExtensionWarning: (
      namedParameters: Localization.NoMatchingsForAliasedFilePathWithoutFilenameExtensionWarning.TemplateNamedParameters
    ) => Pick<WarningLog, "title" | "description">;

    generateNoOutputFileExistingForSpecifiedSourceFilePath: (
      namedParameters: Localization.NoOutputFileExistingForSpecifiedSourceFilePath.TemplateNamedParameters
    ) => Pick<WarningLog, "title" | "description">;
  }>;

  export namespace Localization {

    export namespace UnableToResolveShortenedAbsolutePathWarning {
      export type TemplateNamedParameters = Readonly<{
        filesType__singularForm: string;
        projectBuildingMode: string;
      }>;
    }

    export namespace UnknownSourceFileTopDirectoryAliasWarning {
      export type TemplateNamedParameters = Readonly<{
        fileType__singularForm: string;
        pickedPathOfTargetResourceFile: string;
        firstPathSegment: string;
        formattedSourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: string;
      }>;
    }

    export namespace NoMatchingsForAliasedFilePathWithoutFilenameExtensionWarning {
      export type TemplateNamedParameters = Readonly<{
        fileType__singularForm: string;
        pickedPathOfTargetResourceFile: string;
        checkedAbsolutePaths__formatted: string;
      }>;
    }

    export namespace NoOutputFileExistingForSpecifiedSourceFilePath {
      export type TemplateNamedParameters = Readonly<{
        fileType__singularForm: string;
        pickedPathOfTargetResourceFile: string;
      }>;
    }
  }
}


export default ResourceFilesPathsAliasesResolverForHTML;
