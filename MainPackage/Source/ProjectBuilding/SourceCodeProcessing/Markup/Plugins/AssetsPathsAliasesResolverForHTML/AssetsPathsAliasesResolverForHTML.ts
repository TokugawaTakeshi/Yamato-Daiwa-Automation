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
import extractStringifiedContentFromVinylFile from "@Utils/extractStringifiedContentFromVinylFile";

/* --- General auxiliaries ------------------------------------------------------------------------------------------ */
import {
  Logger,
  stringifyAndFormatArbitraryValue,
  createMapBasedOnOtherMap,
  filterMap,
  isUndefined,
  isNull
} from "@yamato-daiwa/es-extensions";
import type { WarningLog } from "@yamato-daiwa/es-extensions";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";


class AssetsPathsAliasesResolverForHTML {

  public static localization: AssetsPathsAliasesResolverForHTML.Localization =
      AssetsPathsAliasesResolverForHTML_Localization__English;

  private readonly compiledHTML_File: MarkupProcessor.MarkupVinylFile;
  private readonly $HTML_FileContentCheerioCapturing: cheerio.Root;
  private readonly masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;


  public static getHTML_CodeWithResolvedAliases(
    compiledHTML_File: MarkupProcessor.MarkupVinylFile,
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): string {

      return new AssetsPathsAliasesResolverForHTML(compiledHTML_File, masterConfigRepresentative).
          resolveStylesheetsPathsAliases().
          resoleScriptsPathsAliases().
          resolveImagesPathsAliases().
          resolveVideosPathsAliases().
          resolveAudiosPathsAliases().

          /* 〔 理論 〕 { decodeEntities: false }が無ければ、全ての漢字等は'&#x6587;'の様にユニコード実体に成る。 */
          $HTML_FileContentCheerioCapturing.html({ decodeEntities: false });
  }


  private constructor(
    compiledHTML_File: MarkupProcessor.MarkupVinylFile,
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ) {
    this.compiledHTML_File = compiledHTML_File;
    this.$HTML_FileContentCheerioCapturing = cheerio.load(extractStringifiedContentFromVinylFile(compiledHTML_File));
    this.masterConfigRepresentative = masterConfigRepresentative;
  }


  private resolveStylesheetsPathsAliases(): this {

    if (isUndefined(this.masterConfigRepresentative.stylesProcessingSettingsRepresentative)) {
      return this;
    }


    const stylesProcessingConfigRepresentative: StylesProcessingSettingsRepresentative =
        this.masterConfigRepresentative.stylesProcessingSettingsRepresentative;


    for (const linkElement of Array.from(this.$HTML_FileContentCheerioCapturing("link[rel='stylesheet']"))) {

      const $LinkElement: cheerio.Cheerio = this.$HTML_FileContentCheerioCapturing(linkElement);
      const hrefAttributeValue: string | undefined = $LinkElement.attr("href");

      if (isUndefined(hrefAttributeValue)) {
        continue;
      }


      const stylesheetResolvedOutputAbsolutePath: string | null = AssetsPathsAliasesResolverForHTML.
          resolveOutputAssetFileAbsolutePathIfPossible({
            pickedURL: hrefAttributeValue,
            filePathAliasPrefix: "@",
            sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: createMapBasedOnOtherMap(
              stylesProcessingConfigRepresentative.entryPointsGroupsNormalizedSettingsMappedByPathAliases,
              (
                pathAlias: string, stylesEntryPointsGroupNormalizedSettings: StylesProcessingSettings__Normalized.EntryPointsGroup
              ): [ string, string ] => [
                pathAlias,
                stylesEntryPointsGroupNormalizedSettings.isSingeEntryPointGroup ?
                    stylesEntryPointsGroupNormalizedSettings.sourceFilesGlobSelectors[0] :
                    stylesEntryPointsGroupNormalizedSettings.sourceFilesTopDirectoryAbsolutePath
              ]
            ),
            supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: stylesProcessingConfigRepresentative.
                supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots,
            sourceAndOutputFilesAbsolutePathsCorrespondenceMap:
                stylesProcessingConfigRepresentative.sourceAndOutputFilesAbsolutePathsCorrespondenceMap,
            fileTypeForLogging: stylesProcessingConfigRepresentative.TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM
          });

      if (isNull(stylesheetResolvedOutputAbsolutePath)) {
        continue;
      }


      $LinkElement.attr(
        "href",
        this.buildFinalAssetURL(
          stylesheetResolvedOutputAbsolutePath,
          stylesProcessingConfigRepresentative.TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM
        )
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


    for (const scriptElement of Array.from(this.$HTML_FileContentCheerioCapturing("script"))) {

      const $ScriptElement: cheerio.Cheerio = this.$HTML_FileContentCheerioCapturing(scriptElement);
      const srcAttributeValue: string | undefined = $ScriptElement.attr("src");

      if (isUndefined(srcAttributeValue)) {
        continue;
      }


      const scriptResolvedOutputAbsolutePath: string | null = AssetsPathsAliasesResolverForHTML.
          resolveOutputAssetFileAbsolutePathIfPossible({
            pickedURL: srcAttributeValue,
            filePathAliasPrefix: "@",
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
            fileTypeForLogging: ECMA_ScriptLogicProcessingConfigRepresentative.TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM
          });

      if (isNull(scriptResolvedOutputAbsolutePath)) {
        continue;
      }


      $ScriptElement.attr(
        "src",
        this.buildFinalAssetURL(
          scriptResolvedOutputAbsolutePath,
          ECMA_ScriptLogicProcessingConfigRepresentative.TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM
        )
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


    for (const imageElement of Array.from(this.$HTML_FileContentCheerioCapturing("img"))) {

      const $ImageElement: cheerio.Cheerio = this.$HTML_FileContentCheerioCapturing(imageElement);
      const srcAttributeValue: string | undefined = $ImageElement.attr("src");

      if (isUndefined(srcAttributeValue)) {
        continue;
      }


      const imageResolvedOutputAbsolutePath: string | null = AssetsPathsAliasesResolverForHTML.
          resolveOutputAssetFileAbsolutePathIfPossible({
            pickedURL: srcAttributeValue,
            filePathAliasPrefix: imagesProcessingConfigRepresentative.filePathAliasPrefix,
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
            fileTypeForLogging: imagesProcessingConfigRepresentative.TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM
          });

      if (isNull(imageResolvedOutputAbsolutePath)) {
        continue;
      }


      $ImageElement.attr(
        "src",
        this.buildFinalAssetURL(
          imageResolvedOutputAbsolutePath,
          imagesProcessingConfigRepresentative.TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM
        )
      );
    }

    for (const linkElement of Array.from(this.$HTML_FileContentCheerioCapturing("link[type='image/x-icon']"))) {

      const $LinkElement: cheerio.Cheerio = this.$HTML_FileContentCheerioCapturing(linkElement);
      const hrefAttributeValue: string | undefined = $LinkElement.attr("href");

      if (isUndefined(hrefAttributeValue)) {
        continue;
      }


      const imageResolvedOutputAbsolutePath: string | null = AssetsPathsAliasesResolverForHTML.
          resolveOutputAssetFileAbsolutePathIfPossible({
            pickedURL: hrefAttributeValue,
            filePathAliasPrefix: imagesProcessingConfigRepresentative.filePathAliasPrefix,
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
            fileTypeForLogging: imagesProcessingConfigRepresentative.TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM
          });

      if (isNull(imageResolvedOutputAbsolutePath)) {
        continue;
      }


      $LinkElement.attr(
        "href",
        this.buildFinalAssetURL(
          imageResolvedOutputAbsolutePath,
          imagesProcessingConfigRepresentative.TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM
        )
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


    for (const sourceElement of Array.from(this.$HTML_FileContentCheerioCapturing("video > source"))) {

      const $SourceElement: cheerio.Cheerio = this.$HTML_FileContentCheerioCapturing(sourceElement);
      const srcAttributeValue: string | undefined = $SourceElement.attr("src");

      if (isUndefined(srcAttributeValue)) {
        continue;
      }


      const videoResolvedOutputAbsolutePath: string | null = AssetsPathsAliasesResolverForHTML.
          resolveOutputAssetFileAbsolutePathIfPossible({
            pickedURL: srcAttributeValue,
            filePathAliasPrefix: videosProcessingConfigRepresentative.filePathAliasPrefix,
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
            fileTypeForLogging: videosProcessingConfigRepresentative.TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM
          });

      if (isNull(videoResolvedOutputAbsolutePath)) {
        continue;
      }


      $SourceElement.attr(
        "src",
        this.buildFinalAssetURL(
          videoResolvedOutputAbsolutePath,
          videosProcessingConfigRepresentative.TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM
        )
      );
    }

    return this;
  }


  /* --- 録音 -------------------------------------------------------------------------------------------------------- */
  private resolveAudiosPathsAliases(): this {

    if (isUndefined(this.masterConfigRepresentative.audiosProcessingSettingsRepresentative)) {
      return this;
    }


    const audiosProcessingConfigRepresentative: AudiosProcessingSettingsRepresentative =
        this.masterConfigRepresentative.audiosProcessingSettingsRepresentative;


    for (const sourceElement of Array.from(this.$HTML_FileContentCheerioCapturing("audio > source"))) {

      const $SourceElement: cheerio.Cheerio = this.$HTML_FileContentCheerioCapturing(sourceElement);
      const srcAttributeValue: string | undefined = $SourceElement.attr("src");

      if (isUndefined(srcAttributeValue)) {
        continue;
      }


      const audioResolvedOutputAbsolutePath: string | null = AssetsPathsAliasesResolverForHTML.
          resolveOutputAssetFileAbsolutePathIfPossible({
            pickedURL: srcAttributeValue,
            filePathAliasPrefix: audiosProcessingConfigRepresentative.filePathAliasPrefix,
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
            fileTypeForLogging: audiosProcessingConfigRepresentative.TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM
          });

      if (isNull(audioResolvedOutputAbsolutePath)) {
        continue;
      }


      $SourceElement.attr(
        "src",
        this.buildFinalAssetURL(
          audioResolvedOutputAbsolutePath,
          audiosProcessingConfigRepresentative.TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM
        )
      );
    }

    return this;
  }


  /* --- Helpers ---------------------------------------------------------------------------------------------------- */
  private buildFinalAssetURL(assetResolvedOutputAbsolutePath: string, assetTypeForLogging: string): string {

    if (
      this.masterConfigRepresentative.isDevelopmentBuildingMode ||
      isUndefined(this.masterConfigRepresentative.actualPublicDirectoryAbsolutePath)
    ) {

      if (
        !this.masterConfigRepresentative.isDevelopmentBuildingMode &&
        isUndefined(this.masterConfigRepresentative.actualPublicDirectoryAbsolutePath)
      ) {
        Logger.logWarning(AssetsPathsAliasesResolverForHTML.localization.generateUnableToComputeShortenedAbsolutePathWarning({
          projectBuildingMode: this.masterConfigRepresentative.consumingProjectBuildingMode,
          filesTypeForLogging: assetTypeForLogging
        }));
      }

      return ImprovedPath.computeRelativePath({
        basePath: this.compiledHTML_File.outputDirectoryAbsolutePath,
        comparedPath: assetResolvedOutputAbsolutePath
      });
    }


    return `/${ ImprovedPath.computeRelativePath({
      basePath: this.masterConfigRepresentative.actualPublicDirectoryAbsolutePath,
      comparedPath: assetResolvedOutputAbsolutePath
    }) }`;
  }


  private static resolveOutputAssetFileAbsolutePathIfPossible(
    {
      pickedURL,
      filePathAliasPrefix,
      sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap,
      supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots,
      sourceAndOutputFilesAbsolutePathsCorrespondenceMap,
      fileTypeForLogging
    }: {
      pickedURL: string;
      filePathAliasPrefix: string;
      sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: Map<string, string>;
      supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: Array<string>;
      sourceAndOutputFilesAbsolutePathsCorrespondenceMap: Map<string, string>;
      fileTypeForLogging: string;
    }
  ): string | null {

    const pickedURL_Segments: Array<string> = ImprovedPath.splitPathToSegments(pickedURL);
    const firstURL_Segment__possiblyPathAlias: string | undefined = pickedURL_Segments[0];

    if (
      isUndefined(firstURL_Segment__possiblyPathAlias) ||
      !firstURL_Segment__possiblyPathAlias.startsWith(filePathAliasPrefix)
    ) {
      return null;
    }


    const sourceFilesTopDirectoryAbsolutePathForCurrentAlias: string | undefined =
        sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap.get(firstURL_Segment__possiblyPathAlias);

    if (isUndefined(sourceFilesTopDirectoryAbsolutePathForCurrentAlias)) {
      Logger.logWarning(
        AssetsPathsAliasesResolverForHTML.localization.generateUnknownSourceFileTopDirectoryAliasWarning({
          fileTypeForLogging,
          firstPathSegment: firstURL_Segment__possiblyPathAlias,
          pickedPath: pickedURL,
          formattedSourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: stringifyAndFormatArbitraryValue(
            Array.from(sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap.entries())
          )
        })
      );

      return null;
    }


    const sourceFileComputedAbsolutePath__possiblyWithoutFilenameExtension: string = ImprovedPath.joinPathSegments(
      sourceFilesTopDirectoryAbsolutePathForCurrentAlias, ...pickedURL_Segments.slice(1)
    );

    const explicitlySpecifiedSourceFilenameExtension: string | null = ImprovedPath.
        extractLastFilenameExtensionWithoutFirstDot(sourceFileComputedAbsolutePath__possiblyWithoutFilenameExtension);


    if (isNull(explicitlySpecifiedSourceFilenameExtension)) {

      const sourceFilesPossibleAbsolutePaths: Array<string> = supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots.map(
          (supportedStylesheetFileNameExtensionWithoutDot: string): string =>
              `${ sourceFileComputedAbsolutePath__possiblyWithoutFilenameExtension }.` +
              `${ supportedStylesheetFileNameExtensionWithoutDot }`
      );

      const searchResultsInSourceFilesAbsolutePathsAndOutputFilesActualPathsMap: Map<string, string> = filterMap(
        sourceAndOutputFilesAbsolutePathsCorrespondenceMap,
        (sourceFileAbsolutePath: string): boolean =>
            sourceFilesPossibleAbsolutePaths.includes(sourceFileAbsolutePath)
      );

      if (searchResultsInSourceFilesAbsolutePathsAndOutputFilesActualPathsMap.size === 0) {

        Logger.logWarning({
          title: `${ fileTypeForLogging }ファイル、不明パスアリアス`,
          description: `${ fileTypeForLogging }ファイル：「${ pickedURL }」に在るアリアス：${ firstURL_Segment__possiblyPathAlias }に` +
              "該当する出力ファイルが見つけられなかった。"
        });
        return null;

      } else if (searchResultsInSourceFilesAbsolutePathsAndOutputFilesActualPathsMap.size > 1) {

        Logger.logWarning({
          title: `${ fileTypeForLogging }ファイル、漠然パスアリアス`,
          description: `${ fileTypeForLogging }ファイル：「${ pickedURL }」に在るアリアス：${ firstURL_Segment__possiblyPathAlias }は複数` +
              `のファイルに該当している：\n${ stringifyAndFormatArbitraryValue(
                Array.from(searchResultsInSourceFilesAbsolutePathsAndOutputFilesActualPathsMap.values())
              ) }\n其の場合は、源ファイルのファイル名拡張子を明示的に指定するのが必要。`
        });
        return null;
      }

      return Array.from(searchResultsInSourceFilesAbsolutePathsAndOutputFilesActualPathsMap.values())[0];
    }


    const resolvedFileOutputAbsolutePath: string | undefined =
        sourceAndOutputFilesAbsolutePathsCorrespondenceMap.get(
            sourceFileComputedAbsolutePath__possiblyWithoutFilenameExtension
        );


    if (isUndefined(resolvedFileOutputAbsolutePath)) {
      Logger.logWarning({
        title: `${ fileTypeForLogging }ファイル、不明パスアリアス`,
        description: `${ fileTypeForLogging }ファイル：「${ pickedURL }」に在るアリアス：${ firstURL_Segment__possiblyPathAlias }に` +
            "該当する出力ファイルが見つけられなかった。"
      });
      return null;
    }


    return resolvedFileOutputAbsolutePath;
  }
}


namespace AssetsPathsAliasesResolverForHTML {

  export type Localization = Readonly<{

    generateUnableToComputeShortenedAbsolutePathWarning: (
      namedParameters: Localization.UnableToComputeShortenedAbsolutePathWarning.NamedParameters
    ) => Pick<WarningLog, "title" | "description">;

    generateUnknownSourceFileTopDirectoryAliasWarning: (
      namedParameters: Localization.UnknownSourceFileTopDirectoryAliasWarning.NamedParameters
    ) => Pick<WarningLog, "title" | "description">;
  }>;

  export namespace Localization {

    export namespace UnableToComputeShortenedAbsolutePathWarning {
      export type NamedParameters = Readonly<{
        filesTypeForLogging: string;
        projectBuildingMode: string;
      }>;
    }

    export namespace UnknownSourceFileTopDirectoryAliasWarning {
      export type NamedParameters = Readonly<{
        fileTypeForLogging: string;
        pickedPath: string;
        firstPathSegment: string;
        formattedSourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: string;
      }>;
    }
  }
}


export default AssetsPathsAliasesResolverForHTML;