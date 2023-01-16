/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type MarkupProcessingSettings__Normalized from "@MarkupProcessing/MarkupProcessingSettings__Normalized";
import type StylesProcessingSettings__Normalized from "@StylesProcessing/StylesProcessingSettings__Normalized";
import type ECMA_ScriptLogicProcessingSettings__Normalized from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettings__Normalized";
import type ImagesProcessingSettings__Normalized from "@ImagesProcessing/ImagesProcessingSettings__Normalized";
import type AudiosProcessingSettings__Normalized from "@AudiosProcessing/AudiosProcessingSettings__Normalized";
import type VideosProcessingSettings__Normalized from "@VideosProcessing/VideosProcessingSettings__Normalized";

/* --- Settings representatives ------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type MarkupProcessingSettingsRepresentative from "@MarkupProcessing/MarkupProcessingSettingsRepresentative";
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
    "@MarkupProcessing/Plugins/ResourcesReferencesResolverForHTML/ResourcesReferencesResolverForHTML.english";

/* --- Applied auxiliaries ------------------------------------------------------------------------------------------ */
import cheerio from "cheerio";
import extractStringifiedContentFromVinylFile from "@Utils/extractStringifiedContentFromVinylFile";

/* --- General auxiliaries ------------------------------------------------------------------------------------------ */
import {
  Logger,
  stringifyAndFormatArbitraryValue,
  createMapBasedOnOtherMap,
  filterMap,
  appendLastFileNameExtension,
  getURI_PartWithoutFragment,
  getURI_Fragment,
  appendFragmentToURI,
  isNonEmptyString,
  isUndefined,
  isNull,
  isNotNull
} from "@yamato-daiwa/es-extensions";
import type { WarningLog } from "@yamato-daiwa/es-extensions";
import ImprovedPath from "@UtilsIncubator/ImprovedPath/ImprovedPath";


class ResourcesReferencesResolverForHTML {

  public static localization: ResourcesReferencesResolverForHTML.Localization =
      AssetsPathsAliasesResolverForHTML_Localization__English;

  private readonly compiledHTML_File: MarkupProcessor.MarkupVinylFile;
  private readonly HTML_FileContentCheerioCapturing: cheerio.Root;

  private readonly masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
  private readonly actualPublicDirectoryAbsolutePath: string | null;


  public static resolve(
    compiledHTML_File: MarkupProcessor.MarkupVinylFile,
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): string {

      return new ResourcesReferencesResolverForHTML(compiledHTML_File, masterConfigRepresentative).

          resolveInternalLinks().
          resolveStylesheetsPathsAliases().
          resoleScriptsPathsAliases().
          resolveImagesPathsAliases().
          resolveVideosPathsAliases().
          resolveAudiosPathsAliases().

          /* [ Theory ] Without '{ decodeEntities: false }' all ideographic characters will be converted to entities
           * like '&#x6587;' what could cause some troubles during post-processing of HTML code. */
          HTML_FileContentCheerioCapturing.
          html({ decodeEntities: false });

  }


  private constructor(
    compiledHTML_File: MarkupProcessor.MarkupVinylFile,
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ) {

    this.compiledHTML_File = compiledHTML_File;
    this.HTML_FileContentCheerioCapturing = cheerio.load(extractStringifiedContentFromVinylFile(compiledHTML_File));
    this.masterConfigRepresentative = masterConfigRepresentative;
    this.actualPublicDirectoryAbsolutePath = masterConfigRepresentative.markupProcessingSettingsRepresentative?.
        getAbsolutePublicPathIfMustToResolveReferencesToAbsolutePath() ?? null;

  }


  private resolveInternalLinks(): this {

    if (isUndefined(this.masterConfigRepresentative.markupProcessingSettingsRepresentative)) {
      return this;
    }


    const markupProcessingSettingsRepresentative: MarkupProcessingSettingsRepresentative =
        this.masterConfigRepresentative.markupProcessingSettingsRepresentative;

    for (const anchorElement of Array.from(this.HTML_FileContentCheerioCapturing("a"))) {

      const anchorCheerioElement: cheerio.Cheerio = this.HTML_FileContentCheerioCapturing(anchorElement);
      const hrefAttributeValue: string | undefined = anchorCheerioElement.attr("href");

      if (!isNonEmptyString(hrefAttributeValue)) {
        continue;
      }


      const resolvedURI: string | null = this.resolveOutputResourceFileAbsolutePathIfPossible({
        pickedPathOfTargetResourceFile: hrefAttributeValue,
        prefixOfAliasOfTopDirectoryOfResourcesGroup: markupProcessingSettingsRepresentative.prefixOfEntryPointsGroupReference,

        sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: createMapBasedOnOtherMap(
            markupProcessingSettingsRepresentative.entryPointsGroupsNormalizedSettingsMappedByReferences,
            (
              pathAlias: string, markupEntryPointsGroupNormalizedSettings: MarkupProcessingSettings__Normalized.EntryPointsGroup
            ): [ string, string ] => [
              pathAlias,
              markupEntryPointsGroupNormalizedSettings.isSingeEntryPointGroup ?
                  markupEntryPointsGroupNormalizedSettings.sourceFilesGlobSelectors[0] :
                  markupEntryPointsGroupNormalizedSettings.sourceFilesTopDirectoryAbsolutePath
            ]
        ),
        supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: markupProcessingSettingsRepresentative.
            supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots,
        sourceAndOutputFilesAbsolutePathsCorrespondenceMap:
            markupProcessingSettingsRepresentative.sourceAndOutputFilesAbsolutePathsCorrespondenceMap,
        fileTypeForLogging__singularForm: markupProcessingSettingsRepresentative.TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM,
        fileTypeForLogging__pluralForm: markupProcessingSettingsRepresentative.TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM
      });

      if (isNull(resolvedURI)) {
        continue;
      }


      anchorCheerioElement.attr("href", this.buildResourceFileFinalPath(resolvedURI));

    }

    return this;

  }

  private resolveStylesheetsPathsAliases(): this {

    if (isUndefined(this.masterConfigRepresentative.stylesProcessingSettingsRepresentative)) {
      return this;
    }


    const stylesProcessingSettingsRepresentative: StylesProcessingSettingsRepresentative =
        this.masterConfigRepresentative.stylesProcessingSettingsRepresentative;

    for (const linkElement of Array.from(this.HTML_FileContentCheerioCapturing("link[rel='stylesheet']"))) {

      const linkCheerioElement: cheerio.Cheerio = this.HTML_FileContentCheerioCapturing(linkElement);
      const hrefAttributeValue: string | undefined = linkCheerioElement.attr("href");

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


      linkCheerioElement.attr("href", this.buildResourceFileFinalPath(resolvedOutputAbsolutePathOfStylesheet));

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

      const scriptCheerioElement: cheerio.Cheerio = this.HTML_FileContentCheerioCapturing(scriptElement);
      const srcAttributeValue: string | undefined = scriptCheerioElement.attr("src");

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


      scriptCheerioElement.attr("src", this.buildResourceFileFinalPath(resolvedOutputAbsolutePathOfScript));

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

      const imageCheerioElement: cheerio.Cheerio = this.HTML_FileContentCheerioCapturing(imageElement);
      const srcAttributeValue: string | undefined = imageCheerioElement.attr("src");

      if (!isNonEmptyString(srcAttributeValue)) {
        continue;
      }


      const resolvedOutputAbsolutePathOfImage: string | null = this.resolveOutputImageFileAbsolutePathIfPossible({
        pickedPathOfTargetResourceFile: srcAttributeValue, imagesProcessingConfigRepresentative
      });

      if (isNull(resolvedOutputAbsolutePathOfImage)) {
        continue;
      }


      imageCheerioElement.attr("src", this.buildResourceFileFinalPath(resolvedOutputAbsolutePathOfImage));

    }

    for (const sourceElement of Array.from(this.HTML_FileContentCheerioCapturing("picture>source"))) {

      const sourceCheerioElement: cheerio.Cheerio = this.HTML_FileContentCheerioCapturing(sourceElement);
      const srcsetAttributeValue: string | undefined = sourceCheerioElement.attr("srcset");

      if (!isNonEmptyString(srcsetAttributeValue)) {
        continue;
      }


      const resolvedOutputAbsolutePathOfImage: string | null = this.resolveOutputImageFileAbsolutePathIfPossible({
        pickedPathOfTargetResourceFile: srcsetAttributeValue, imagesProcessingConfigRepresentative
      });

      if (isNull(resolvedOutputAbsolutePathOfImage)) {
        continue;
      }


      sourceCheerioElement.attr("srcset", this.buildResourceFileFinalPath(resolvedOutputAbsolutePathOfImage));

    }

    for (const linkElement of Array.from(this.HTML_FileContentCheerioCapturing("link[type='image/x-icon']"))) {

      const linkCheerioElement: cheerio.Cheerio = this.HTML_FileContentCheerioCapturing(linkElement);
      const hrefAttributeValue: string | undefined = linkCheerioElement.attr("href");

      if (isUndefined(hrefAttributeValue)) {
        continue;
      }


      const imageResolvedOutputAbsolutePath: string | null = this.resolveOutputImageFileAbsolutePathIfPossible({
        pickedPathOfTargetResourceFile: hrefAttributeValue, imagesProcessingConfigRepresentative
      });

      if (isNull(imageResolvedOutputAbsolutePath)) {
        continue;
      }


      linkCheerioElement.attr("href", this.buildResourceFileFinalPath(imageResolvedOutputAbsolutePath));

    }

    return this;
  }

  private resolveOutputImageFileAbsolutePathIfPossible(
    {
      pickedPathOfTargetResourceFile,
      imagesProcessingConfigRepresentative
    }: {
      pickedPathOfTargetResourceFile: string;
      imagesProcessingConfigRepresentative: ImagesProcessingSettingsRepresentative;
    }
  ): string | null {
    return this.resolveOutputResourceFileAbsolutePathIfPossible({
      pickedPathOfTargetResourceFile,
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
  }

  private resolveVideosPathsAliases(): this {

    if (isUndefined(this.masterConfigRepresentative.videosProcessingSettingsRepresentative)) {
      return this;
    }


    const videosProcessingConfigRepresentative: VideosProcessingSettingsRepresentative =
        this.masterConfigRepresentative.videosProcessingSettingsRepresentative;

    for (const sourceElement of Array.from(this.HTML_FileContentCheerioCapturing("video > source"))) {

      const sourceCheerioElement: cheerio.Cheerio = this.HTML_FileContentCheerioCapturing(sourceElement);
      const srcAttributeValue: string | undefined = sourceCheerioElement.attr("src");

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


      sourceCheerioElement.attr("src", this.buildResourceFileFinalPath(resolvedOutputAbsolutePathOfVideo));

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

      const sourceCheerioElement: cheerio.Cheerio = this.HTML_FileContentCheerioCapturing(sourceElement);
      const srcAttributeValue: string | undefined = sourceCheerioElement.attr("src");

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


      sourceCheerioElement.attr("src", this.buildResourceFileFinalPath(resolvedOutputAbsolutePathOfVideo));

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
    }: Readonly<{
      pickedPathOfTargetResourceFile: string;
      prefixOfAliasOfTopDirectoryOfResourcesGroup: string;
      sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: Map<string, string>;
      supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: ReadonlyArray<string>;
      sourceAndOutputFilesAbsolutePathsCorrespondenceMap: Map<string, string>;
      fileTypeForLogging__singularForm: string;
      fileTypeForLogging__pluralForm: string;
    }>
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
        ResourcesReferencesResolverForHTML.localization.generateUnknownResourceGroupReferenceWarningLog({
          fileType__pluralForm: fileTypeForLogging__pluralForm,
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
      [ sourceFilesTopDirectoryAbsolutePathOfCurrentAlias, ...segmentsOfPickedPath.slice(1) ],
      { forwardSlashOnlySeparators: true }
    );

    const explicitlySpecifiedLastFileNameExtensionWithoutDotOfSourceFile: string | null = ImprovedPath.
        extractLastFilenameExtensionWithoutFirstDot(sourceFileComputedAbsolutePathPossiblyWithoutFileNameExtension);

    if (
      isNull(explicitlySpecifiedLastFileNameExtensionWithoutDotOfSourceFile) ||
      !supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots.
          includes(explicitlySpecifiedLastFileNameExtensionWithoutDotOfSourceFile)
    ) {

      const possibleAbsolutePathsOfTargetSourceFileWithoutFragment: Array<string> =
          supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots.map(
            (supportedStylesheetFileNameExtensionWithoutLeadingDot: string): string =>
                getURI_PartWithoutFragment(
                  appendLastFileNameExtension({
                    targetPath: sourceFileComputedAbsolutePathPossiblyWithoutFileNameExtension,
                    targetFileNameExtensionWithOrWithoutLeadingDot: supportedStylesheetFileNameExtensionWithoutLeadingDot,
                    mustAppendDuplicateEvenIfTargetLastFileNameExtensionAlreadyPresentsAtSpecifiedPath: false
                  })
                )
          );

      const searchingResultsInSourceFilesAbsolutePathsAndOutputFilesActualPathsMap: Map<string, string> = filterMap(
        sourceAndOutputFilesAbsolutePathsCorrespondenceMap,
        (sourceFileAbsolutePath: string): boolean =>
            possibleAbsolutePathsOfTargetSourceFileWithoutFragment.includes(sourceFileAbsolutePath)
      );

      if (searchingResultsInSourceFilesAbsolutePathsAndOutputFilesActualPathsMap.size === 0) {

        Logger.logWarning(
          ResourcesReferencesResolverForHTML.localization.
              generateNoMatchingsForAliasedFilePathWithoutFilenameExtensionWarningLog({
                pickedPathOfTargetResourceFile,
                fileType__singularForm: fileTypeForLogging__pluralForm,
                checkedAbsolutePaths__formatted: stringifyAndFormatArbitraryValue(
                  possibleAbsolutePathsOfTargetSourceFileWithoutFragment
                )
              })
        );

        return null;

      }


      return appendFragmentToURI({
        targetURI: Array.from(searchingResultsInSourceFilesAbsolutePathsAndOutputFilesActualPathsMap.values())[0],
        targetFragmentWithOrWithoutLeadingHash: getURI_Fragment({
          targetURI: sourceFileComputedAbsolutePathPossiblyWithoutFileNameExtension,
          withLeadingHash: false
        }),
        mustReplaceFragmentIfThereIsOneAlready: false
      });

    }


    const resolvedFileOutputAbsolutePath: string | undefined = sourceAndOutputFilesAbsolutePathsCorrespondenceMap.
        get(sourceFileComputedAbsolutePathPossiblyWithoutFileNameExtension);

    if (isUndefined(resolvedFileOutputAbsolutePath)) {

      Logger.logWarning(
        ResourcesReferencesResolverForHTML.localization.generateNoOutputFileExistingForSpecifiedSourceFilePathWarningLog({
          pickedPathOfTargetResourceFile,
          fileType__singularForm: fileTypeForLogging__pluralForm
        })
      );

      return null;

    }


    return resolvedFileOutputAbsolutePath;

  }


  private buildResourceFileFinalPath(resolvedOutputAbsolutePathOfResourceFile: string): string {
    return isNotNull(this.actualPublicDirectoryAbsolutePath) ?
        `/${ ImprovedPath.computeRelativePath({
          basePath: this.actualPublicDirectoryAbsolutePath,
          comparedPath: resolvedOutputAbsolutePathOfResourceFile
        }) }` :
        ImprovedPath.computeRelativePath({
          basePath: this.compiledHTML_File.outputDirectoryAbsolutePath,
          comparedPath: resolvedOutputAbsolutePathOfResourceFile
        });
  }

}


namespace ResourcesReferencesResolverForHTML {

  export type Localization = Readonly<{

    generateUnknownResourceGroupReferenceWarningLog: (
      namedParameters: Localization.UnknownResourceGroupReferenceWarningLog.TemplateNamedParameters
    ) => Localization.UnknownResourceGroupReferenceWarningLog;

    generateNoMatchingsForAliasedFilePathWithoutFilenameExtensionWarningLog: (
      namedParameters: Localization.NoMatchingsForAliasedFilePathWithoutFilenameExtensionWarningLog.TemplateNamedParameters
    ) => Localization.NoMatchingsForAliasedFilePathWithoutFilenameExtensionWarningLog;

    generateNoOutputFileExistingForSpecifiedSourceFilePathWarningLog: (
      namedParameters: Localization.NoOutputFileExistingForSpecifiedSourceFilePathWarningLog.TemplateNamedParameters
    ) => Localization.NoOutputFileExistingForSpecifiedSourceFilePathWarningLog;
  }>;

  export namespace Localization {

    export type UnknownResourceGroupReferenceWarningLog = Readonly<Pick<WarningLog, "title" | "description">>;

    export namespace UnknownResourceGroupReferenceWarningLog {
      export type TemplateNamedParameters = Readonly<{
        fileType__pluralForm: string;
        pickedPathOfTargetResourceFile: string;
        firstPathSegment: string;
        formattedSourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: string;
      }>;
    }


    export type NoMatchingsForAliasedFilePathWithoutFilenameExtensionWarningLog =
        Readonly<Pick<WarningLog, "title" | "description">>;

    export namespace NoMatchingsForAliasedFilePathWithoutFilenameExtensionWarningLog {
      export type TemplateNamedParameters = Readonly<{
        fileType__singularForm: string;
        pickedPathOfTargetResourceFile: string;
        checkedAbsolutePaths__formatted: string;
      }>;
    }


    export type NoOutputFileExistingForSpecifiedSourceFilePathWarningLog = Readonly<Pick<WarningLog, "title" | "description">>;

    export namespace NoOutputFileExistingForSpecifiedSourceFilePathWarningLog {
      export type TemplateNamedParameters = Readonly<{
        fileType__singularForm: string;
        pickedPathOfTargetResourceFile: string;
      }>;
    }
  }
}


export default ResourcesReferencesResolverForHTML;

/* eslint-disable-next-line @typescript-eslint/no-unused-vars --
 * It is the only way to extract the child namespace (no need to expose whole ResourcesReferencesResolverForHTML for the
 * localization packages).
 * https://stackoverflow.com/a/73400523/4818123 */
export import ResourcesReferencesResolverForHTML_Localization = ResourcesReferencesResolverForHTML.Localization;
