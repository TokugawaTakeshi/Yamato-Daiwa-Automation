/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import PROCESSABLE_FILES_POINTER_ALIAS_PREFIX from
    "@ProjectBuilding/Common/Restrictions/ResourcesReferences/PROCESSABLE_FILES_POINTER_ALIAS_PREFIX";
import PLAIN_COPIED_FILES_POINTER_ALIAS_PREFIX from
    "@ProjectBuilding/Common/Restrictions/ResourcesReferences/PLAIN_COPIED_FILES_POINTER_ALIAS_PREFIX";

/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type MarkupProcessingSettings__Normalized from "@MarkupProcessing/MarkupProcessingSettings__Normalized";
import type StylesProcessingSettings__Normalized from "@StylesProcessing/StylesProcessingSettings__Normalized";
import type ECMA_ScriptLogicProcessingSettings__Normalized from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettings__Normalized";
import type ImagesProcessingSettings__Normalized from "@ImagesProcessing/ImagesProcessingSettings__Normalized";
import type AudiosProcessingSettings__Normalized from "@AudiosProcessing/AudiosProcessingSettings__Normalized";
import type VideosProcessingSettings__Normalized from "@VideosProcessing/VideosProcessingSettings__Normalized";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type MarkupProcessingSettingsRepresentative from "@MarkupProcessing/MarkupProcessingSettingsRepresentative";
import type StylesProcessingSettingsRepresentative from "@StylesProcessing/StylesProcessingSettingsRepresentative";
import type ECMA_ScriptLogicProcessingSettingsRepresentative from
    "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSettingsRepresentative";
import type ImagesProcessingSettingsRepresentative from "@ImagesProcessing/ImagesProcessingSettingsRepresentative";
import type VideosProcessingSettingsRepresentative from "@VideosProcessing/VideosProcessingSettingsRepresentative";
import type AudiosProcessingSettingsRepresentative from "@AudiosProcessing/AudiosProcessingSettingsRepresentative";
import type PlainCopyingSettingsRepresentative from "@ProjectBuilding/PlainCopying/PlainCopyingSettingsRepresentative";

/* ─── Shared State ───────────────────────────────────────────────────────────────────────────────────────────────── */
import MarkupProcessingSharedState from "@MarkupProcessing/MarkupProcessingSharedState";
import StylesProcessingSharedState from "@StylesProcessing/StylesProcessingSharedState";
import ECMA_ScriptLogicProcessingSharedState from "@ECMA_ScriptProcessing/ECMA_ScriptLogicProcessingSharedState";
import ImagesProcessingSharedState from "@ImagesProcessing/ImagesProcessingSharedState";
import VideosProcessingSharedState from "@VideosProcessing/VideosProcessingSharedState";
import AudiosProcessingSharedState from "@AudiosProcessing/AudiosProcessingSharedState";

/* ─── Assets ─────────────────────────────────────────────────────────────────────────────────────────────────────── */
import assetsPathsAliasesResolverForHTML_Localization__english from "./PointersReferencesResolverForHTML_Localization.english";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import type { HTMLElement as HTML_Element } from "node-html-parser";
import {
  Logger,
  stringifyAndFormatArbitraryValue,
  replaceMatchesWithRegularExpressionToDynamicValue,
  createMapBasedOnOtherMap,
  extractLastExtensionOfFileName,
  filterMap,
  appendLastFileNameExtension,
  explodeURI_PathToSegments,
  getURI_PartWithoutFragment,
  getURI_Fragment,
  appendFragmentToURI,
  isNonEmptyString,
  isUndefined,
  isNotUndefined,
  isNull,
  isNotNull
} from "@yamato-daiwa/es-extensions";
import type { ReplacingOfMatchesWithRegularExpressionToDynamicValue, WarningLog } from "@yamato-daiwa/es-extensions";
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


class ResourcesPointersResolverForHTML {

  public static localization: ResourcesPointersResolverForHTML.Localization =
      assetsPathsAliasesResolverForHTML_Localization__english;


  private static readonly aliasedURIsAndOutputMarkupFilesAbsolutePathsCorrespondenceMap:
      ResourcesPointersResolverForHTML.AliasedURIsAndOutputFilesAbsolutePathsCorrespondenceMap =
          new Map<ResourcesPointersResolverForHTML.AliasedURI, ResourcesPointersResolverForHTML.OutputFileAbsolutePath>();
  private static markupSourceFilesGroupsTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: ReadonlyMap<string, string> =
      new Map<string, string>();

  private static readonly aliasedURIsAndOutputStylesFilesAbsolutePathsCorrespondenceMap:
      ResourcesPointersResolverForHTML.AliasedURIsAndOutputFilesAbsolutePathsCorrespondenceMap =
          new Map<ResourcesPointersResolverForHTML.AliasedURI, ResourcesPointersResolverForHTML.OutputFileAbsolutePath>();
  private static stylesSourceFilesGroupsTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: ReadonlyMap<string, string> =
      new Map<string, string>();

  private static readonly aliasedURIsAndOutputScriptsFilesAbsolutePathsCorrespondenceMap:
      ResourcesPointersResolverForHTML.AliasedURIsAndOutputFilesAbsolutePathsCorrespondenceMap =
          new Map<ResourcesPointersResolverForHTML.AliasedURI, ResourcesPointersResolverForHTML.OutputFileAbsolutePath>();
  private static scriptsSourceFilesGroupsTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: ReadonlyMap<string, string> =
      new Map<string, string>();

  private static readonly aliasedURIsAndOutputImagesFilesAbsolutePathsCorrespondenceMap:
      ResourcesPointersResolverForHTML.AliasedURIsAndOutputFilesAbsolutePathsCorrespondenceMap =
          new Map<ResourcesPointersResolverForHTML.AliasedURI, ResourcesPointersResolverForHTML.OutputFileAbsolutePath>();
  private static imagesSourceFilesGroupsTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: ReadonlyMap<string, string> =
      new Map<string, string>();

  private static readonly aliasedURIsAndOutputVideosFilesAbsolutePathsCorrespondenceMap:
      ResourcesPointersResolverForHTML.AliasedURIsAndOutputFilesAbsolutePathsCorrespondenceMap =
          new Map<ResourcesPointersResolverForHTML.AliasedURI, ResourcesPointersResolverForHTML.OutputFileAbsolutePath>();
  private static videosSourceFilesGroupsTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: ReadonlyMap<string, string> =
      new Map<string, string>();

  private static readonly aliasedURIsAndOutputAudiosFilesAbsolutePathsCorrespondenceMap:
      ResourcesPointersResolverForHTML.AliasedURIsAndOutputFilesAbsolutePathsCorrespondenceMap =
          new Map<ResourcesPointersResolverForHTML.AliasedURI, ResourcesPointersResolverForHTML.OutputFileAbsolutePath>();
  private static audiosSourceFilesGroupsTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: ReadonlyMap<string, string> =
      new Map<string, string>();


  private readonly rootHTML_Element: HTML_Element;
  private readonly projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
  private readonly markupProcessingSettingsRepresentative: MarkupProcessingSettingsRepresentative;

  private readonly contextHTML_FileOutputDirectoryAbsolutePath: string;
  private readonly publicDirectoryAbsolutePath?: string;

  private readonly plainCopyingSettingsRepresentative?: PlainCopyingSettingsRepresentative;


  public static resolve(sourceData: ResourcesPointersResolverForHTML.SourceData): HTML_Element {

    return new ResourcesPointersResolverForHTML(sourceData).

        resolveInternalLinks().
        resolveStylesheetsAliasedPaths().
        resolveScriptsPathsAliases().

        resolveImagesAliasedPaths().
        resolveVideosAliasedPaths().
        resolveAudiosAliasedPaths().

        rootHTML_Element;

  }


  private constructor(
    {
      rootHTML_Element,
      projectBuildingMasterConfigRepresentative,
      markupProcessingSettingsRepresentative,
      absolutePathOfOutputDirectoryForTargetHTML_File
    }: ResourcesPointersResolverForHTML.SourceData
  ) {

    this.rootHTML_Element = rootHTML_Element;
    this.projectBuildingMasterConfigRepresentative = projectBuildingMasterConfigRepresentative;
    this.markupProcessingSettingsRepresentative = markupProcessingSettingsRepresentative;

    this.contextHTML_FileOutputDirectoryAbsolutePath = absolutePathOfOutputDirectoryForTargetHTML_File;

    if (isNotNull(this.projectBuildingMasterConfigRepresentative.actualPublicDirectoryAbsolutePath)) {
      this.publicDirectoryAbsolutePath = this.projectBuildingMasterConfigRepresentative.actualPublicDirectoryAbsolutePath;
    }

    this.plainCopyingSettingsRepresentative = projectBuildingMasterConfigRepresentative.plainCopyingSettingsRepresentative;

    if (ResourcesPointersResolverForHTML.markupSourceFilesGroupsTopDirectoriesAliasesAndRespectiveAbsolutePathsMap.size === 0) {
      ResourcesPointersResolverForHTML.markupSourceFilesGroupsTopDirectoriesAliasesAndRespectiveAbsolutePathsMap =
          createMapBasedOnOtherMap(
            this.markupProcessingSettingsRepresentative.entryPointsGroupsNormalizedSettingsMappedByReferences,
            (
              pathAlias: string, markupEntryPointsGroupNormalizedSettings: MarkupProcessingSettings__Normalized.EntryPointsGroup
            ): [ string, string ] => [
              pathAlias,
              markupEntryPointsGroupNormalizedSettings.isSingeEntryPointGroup ?
                  markupEntryPointsGroupNormalizedSettings.sourceFilesGlobSelectors[0] :
                  markupEntryPointsGroupNormalizedSettings.sourceFilesTopDirectoryAbsolutePath
            ]
        );
    }

    if (ResourcesPointersResolverForHTML.stylesSourceFilesGroupsTopDirectoriesAliasesAndRespectiveAbsolutePathsMap.size === 0) {
      ResourcesPointersResolverForHTML.stylesSourceFilesGroupsTopDirectoriesAliasesAndRespectiveAbsolutePathsMap =
          createMapBasedOnOtherMap(
            projectBuildingMasterConfigRepresentative.stylesProcessingSettingsRepresentative?.
                entryPointsGroupsNormalizedSettingsMappedByReferences ?? new Map(),
            (
              pathAlias: string, stylesEntryPointsGroupNormalizedSettings: StylesProcessingSettings__Normalized.EntryPointsGroup
            ): [ string, string ] => [
              pathAlias,
              stylesEntryPointsGroupNormalizedSettings.isSingeEntryPointGroup ?
                  stylesEntryPointsGroupNormalizedSettings.sourceFilesGlobSelectors[0] :
                  stylesEntryPointsGroupNormalizedSettings.sourceFilesTopDirectoryAbsolutePath
            ]
          );
    }

    if (
      ResourcesPointersResolverForHTML.scriptsSourceFilesGroupsTopDirectoriesAliasesAndRespectiveAbsolutePathsMap.size === 0
    ) {
      ResourcesPointersResolverForHTML.scriptsSourceFilesGroupsTopDirectoriesAliasesAndRespectiveAbsolutePathsMap =
          createMapBasedOnOtherMap(
            projectBuildingMasterConfigRepresentative.ECMA_ScriptLogicProcessingSettingsRepresentative?.
                entryPointsGroupsNormalizedSettingsMappedByReferences ?? new Map(),
            (
              pathAlias: string,
              entryPointsGroupNormalizedSettings: ECMA_ScriptLogicProcessingSettings__Normalized.EntryPointsGroup
            ): [ string, string ] => [
              pathAlias,
              entryPointsGroupNormalizedSettings.isSingeEntryPointGroup ?
                  entryPointsGroupNormalizedSettings.sourceFilesGlobSelectors[0] :
                  entryPointsGroupNormalizedSettings.sourceFilesTopDirectoryAbsolutePath
            ]
          );
    }

    if (ResourcesPointersResolverForHTML.imagesSourceFilesGroupsTopDirectoriesAliasesAndRespectiveAbsolutePathsMap.size === 0) {
      ResourcesPointersResolverForHTML.imagesSourceFilesGroupsTopDirectoriesAliasesAndRespectiveAbsolutePathsMap =
          createMapBasedOnOtherMap(
            projectBuildingMasterConfigRepresentative.imagesProcessingSettingsRepresentative?.
                relevantAssetsGroupsSettingsMappedBySourceFilesTopDirectoryAliasName ?? new Map(),
            (
              pathAlias: string, stylesEntryPointsGroupNormalizedSettings: ImagesProcessingSettings__Normalized.AssetsGroup
            ): [ string, string ] => [ pathAlias, stylesEntryPointsGroupNormalizedSettings.sourceFilesTopDirectoryAbsolutePath ]
          );
    }


    if (ResourcesPointersResolverForHTML.videosSourceFilesGroupsTopDirectoriesAliasesAndRespectiveAbsolutePathsMap.size === 0) {
      ResourcesPointersResolverForHTML.videosSourceFilesGroupsTopDirectoriesAliasesAndRespectiveAbsolutePathsMap =
          createMapBasedOnOtherMap(
            projectBuildingMasterConfigRepresentative.fontsProcessingSettingsRepresentative?.
                relevantAssetsGroupsSettingsMappedBySourceFilesTopDirectoryAliasName ?? new Map(),
            (
              pathAlias: string, stylesEntryPointsGroupNormalizedSettings: VideosProcessingSettings__Normalized.AssetsGroup
            ): [ string, string ] => [ pathAlias, stylesEntryPointsGroupNormalizedSettings.sourceFilesTopDirectoryAbsolutePath ]
          );
    }

    if (ResourcesPointersResolverForHTML.audiosSourceFilesGroupsTopDirectoriesAliasesAndRespectiveAbsolutePathsMap.size === 0) {

      ResourcesPointersResolverForHTML.audiosSourceFilesGroupsTopDirectoriesAliasesAndRespectiveAbsolutePathsMap =
          createMapBasedOnOtherMap(
            projectBuildingMasterConfigRepresentative.audiosProcessingSettingsRepresentative?.
                relevantAssetsGroupsSettingsMappedBySourceFilesTopDirectoryAliasName ?? new Map(),
            (
              pathAlias: string, stylesEntryPointsGroupNormalizedSettings: AudiosProcessingSettings__Normalized.AssetsGroup
            ): [ string, string ] => [ pathAlias, stylesEntryPointsGroupNormalizedSettings.sourceFilesTopDirectoryAbsolutePath ]
          );
    }

  }


  /* ━━━ By files type ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* ─── HTML Files ──────────────────────────────────────────────────────────────────────────────────────────────── */
  private resolveInternalLinks(): this {

    for (const anchorElement of this.rootHTML_Element.querySelectorAll("a")) {

      this.resolveInternalLink({
        targetHTML_Element: anchorElement,
        targetHTML_ElementAttributeName: "href"
      });

    }

    for (const iFrameElement of this.rootHTML_Element.querySelectorAll("iframe")) {

      this.resolveInternalLink({
        targetHTML_Element: iFrameElement,
        targetHTML_ElementAttributeName: "src"
      });

    }

    return this;

  }

  private resolveInternalLink(
    {
      targetHTML_Element,
      targetHTML_ElementAttributeName
    }: Readonly<{
      targetHTML_Element: HTML_Element;
      targetHTML_ElementAttributeName: string;
    }>
  ): void {

    const attributeValueContainingAliasedURI: string | undefined = targetHTML_Element.
        getAttribute(targetHTML_ElementAttributeName);

    if (!isNonEmptyString(attributeValueContainingAliasedURI)) {
      return;
    }


    let resolvedAbsolutePath: string | null = ResourcesPointersResolverForHTML.
        aliasedURIsAndOutputMarkupFilesAbsolutePathsCorrespondenceMap.
        get(attributeValueContainingAliasedURI) ??
        null;

    if (isNotNull(resolvedAbsolutePath)) {
      targetHTML_Element.setAttribute(targetHTML_ElementAttributeName, this.buildResourceFileFinalPath(resolvedAbsolutePath));
      return;
    }


    const segmentsOfPickedPath: Array<string> = explodeURI_PathToSegments(attributeValueContainingAliasedURI);
    const firstSegmentOfPickedPath: string | undefined = segmentsOfPickedPath[0];

    if (!isNonEmptyString(firstSegmentOfPickedPath)) {
      return;
    }


    if (
      isNotUndefined(this.plainCopyingSettingsRepresentative) &&
          firstSegmentOfPickedPath.startsWith(PLAIN_COPIED_FILES_POINTER_ALIAS_PREFIX)
    ) {

      resolvedAbsolutePath = this.plainCopyingSettingsRepresentative.
          getSourceFileAbsolutePathByAliasedPath(segmentsOfPickedPath);

      if (isNull(resolvedAbsolutePath)) {
        return;
      }


      ResourcesPointersResolverForHTML.aliasedURIsAndOutputMarkupFilesAbsolutePathsCorrespondenceMap.
          set(attributeValueContainingAliasedURI, resolvedAbsolutePath);

      targetHTML_Element.setAttribute(targetHTML_ElementAttributeName, this.buildResourceFileFinalPath(resolvedAbsolutePath));

      return;

    }


    resolvedAbsolutePath = this.resolveOutputResourceFileAbsolutePathIfPossible({
      pickedPathOfTargetResourceFile: attributeValueContainingAliasedURI,
      sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap:
          ResourcesPointersResolverForHTML.markupSourceFilesGroupsTopDirectoriesAliasesAndRespectiveAbsolutePathsMap,
      supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: this.markupProcessingSettingsRepresentative.
          supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots,
      sourceAndOutputFilesAbsolutePathsCorrespondenceMap: MarkupProcessingSharedState.
          entryPointsSourceAndOutputFilesAbsolutePathsCorrespondenceMap,
      fileTypeForLogging__singularForm: this.markupProcessingSettingsRepresentative.
          TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM,
      fileTypeForLogging__pluralForm: this.markupProcessingSettingsRepresentative.
          TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM
    });

    if (isNull(resolvedAbsolutePath)) {
      return;
    }


    ResourcesPointersResolverForHTML.aliasedURIsAndOutputMarkupFilesAbsolutePathsCorrespondenceMap.
        set(attributeValueContainingAliasedURI, resolvedAbsolutePath);

    targetHTML_Element.setAttribute(targetHTML_ElementAttributeName, this.buildResourceFileFinalPath(resolvedAbsolutePath));

  }


  /* ─── Stylesheets ──────────────────────────────────────────────────────────────────────────────────────────────── */
  private resolveStylesheetsAliasedPaths(): this {

    const stylesProcessingSettingsRepresentative: StylesProcessingSettingsRepresentative | undefined =
        this.projectBuildingMasterConfigRepresentative.stylesProcessingSettingsRepresentative;

    if (isUndefined(this.plainCopyingSettingsRepresentative) && isUndefined(stylesProcessingSettingsRepresentative)) {
      return this;
    }


    for (const linkElement of this.rootHTML_Element.querySelectorAll("link[rel='stylesheet']")) {

      const hrefAttributeValue: string | undefined = linkElement.getAttribute("href");

      if (!isNonEmptyString(hrefAttributeValue)) {
        continue;
      }


      let resolvedAbsolutePath: string | null = ResourcesPointersResolverForHTML.
          aliasedURIsAndOutputStylesFilesAbsolutePathsCorrespondenceMap.
          get(hrefAttributeValue) ??
          null;

      if (isNotNull(resolvedAbsolutePath)) {
        linkElement.setAttribute("href", this.buildResourceFileFinalPath(resolvedAbsolutePath));
        continue;
      }


      const segmentsOfPickedPath: Array<string> = explodeURI_PathToSegments(hrefAttributeValue);
      const firstSegmentOfPickedPath: string | undefined = segmentsOfPickedPath[0];

      if (!isNonEmptyString(firstSegmentOfPickedPath)) {
        continue;
      }


      if (
        isNotUndefined(this.plainCopyingSettingsRepresentative) &&
            firstSegmentOfPickedPath.startsWith(PLAIN_COPIED_FILES_POINTER_ALIAS_PREFIX)
      ) {

        resolvedAbsolutePath = this.plainCopyingSettingsRepresentative.
            getSourceFileAbsolutePathByAliasedPath(segmentsOfPickedPath);

        if (isNull(resolvedAbsolutePath)) {
          continue;
        }


        ResourcesPointersResolverForHTML.
            aliasedURIsAndOutputStylesFilesAbsolutePathsCorrespondenceMap.
            set(hrefAttributeValue, resolvedAbsolutePath);

        linkElement.setAttribute("href", this.buildResourceFileFinalPath(resolvedAbsolutePath));

        continue;

      }


      if (isUndefined(stylesProcessingSettingsRepresentative)) {
        continue;
      }


      resolvedAbsolutePath = this.resolveOutputResourceFileAbsolutePathIfPossible({
        pickedPathOfTargetResourceFile: hrefAttributeValue,
        sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap:
            ResourcesPointersResolverForHTML.stylesSourceFilesGroupsTopDirectoriesAliasesAndRespectiveAbsolutePathsMap,
        supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: stylesProcessingSettingsRepresentative.
            supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots,
        sourceAndOutputFilesAbsolutePathsCorrespondenceMap: StylesProcessingSharedState.
            entryPointsSourceAndOutputFilesAbsolutePathsCorrespondenceMap,
        fileTypeForLogging__singularForm: stylesProcessingSettingsRepresentative.TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM,
        fileTypeForLogging__pluralForm: stylesProcessingSettingsRepresentative.TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM
      });

      if (isNull(resolvedAbsolutePath)) {
        continue;
      }


      ResourcesPointersResolverForHTML.
          aliasedURIsAndOutputStylesFilesAbsolutePathsCorrespondenceMap.
          set(hrefAttributeValue, resolvedAbsolutePath);

      linkElement.setAttribute("href", this.buildResourceFileFinalPath(resolvedAbsolutePath));

    }

    return this;

  }


  /* ─── Scripts ──────────────────────────────────────────────────────────────────────────────────────────────────── */
  private resolveScriptsPathsAliases(): this {

    const ECMA_ScriptLogicProcessingConfigRepresentative: ECMA_ScriptLogicProcessingSettingsRepresentative | undefined =
        this.projectBuildingMasterConfigRepresentative.ECMA_ScriptLogicProcessingSettingsRepresentative;

    if (isUndefined(this.plainCopyingSettingsRepresentative) && isUndefined(ECMA_ScriptLogicProcessingConfigRepresentative)) {
      return this;
    }


    for (const scriptElement of this.rootHTML_Element.querySelectorAll("script")) {

      const srcAttributeValue: string | undefined = scriptElement.getAttribute("src");

      if (!isNonEmptyString(srcAttributeValue)) {
        continue;
      }


      let resolvedAbsolutePath: string | null = ResourcesPointersResolverForHTML.
          aliasedURIsAndOutputScriptsFilesAbsolutePathsCorrespondenceMap.
          get(srcAttributeValue) ??
          null;

      if (isNotNull(resolvedAbsolutePath)) {
        scriptElement.setAttribute("src", this.buildResourceFileFinalPath(resolvedAbsolutePath));
        continue;
      }


      const segmentsOfPickedPath: Array<string> = explodeURI_PathToSegments(srcAttributeValue);
      const firstSegmentOfPickedPath: string | undefined = segmentsOfPickedPath[0];

      if (!isNonEmptyString(firstSegmentOfPickedPath)) {
        continue;
      }


      if (
        isNotUndefined(this.plainCopyingSettingsRepresentative) &&
            firstSegmentOfPickedPath.startsWith(PLAIN_COPIED_FILES_POINTER_ALIAS_PREFIX)
      ) {

        resolvedAbsolutePath = this.plainCopyingSettingsRepresentative.
            getSourceFileAbsolutePathByAliasedPath(segmentsOfPickedPath);

        if (isNull(resolvedAbsolutePath)) {
          continue;
        }


        ResourcesPointersResolverForHTML.
            aliasedURIsAndOutputScriptsFilesAbsolutePathsCorrespondenceMap.
            set(srcAttributeValue, resolvedAbsolutePath);

        scriptElement.setAttribute("src", this.buildResourceFileFinalPath(resolvedAbsolutePath));

        continue;

      }


      if (isUndefined(ECMA_ScriptLogicProcessingConfigRepresentative)) {
        continue;
      }


      resolvedAbsolutePath = this.resolveOutputResourceFileAbsolutePathIfPossible({
        pickedPathOfTargetResourceFile: srcAttributeValue,
        sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: ResourcesPointersResolverForHTML.
            scriptsSourceFilesGroupsTopDirectoriesAliasesAndRespectiveAbsolutePathsMap,
        supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots:
            ECMA_ScriptLogicProcessingConfigRepresentative.supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots,
        sourceAndOutputFilesAbsolutePathsCorrespondenceMap:
            ECMA_ScriptLogicProcessingSharedState.sourceFilesAbsolutePathsAndOutputFilesActualPathsMap,
        fileTypeForLogging__singularForm: ECMA_ScriptLogicProcessingConfigRepresentative.
            TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM,
        fileTypeForLogging__pluralForm: ECMA_ScriptLogicProcessingConfigRepresentative.
            TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM
      });

      if (isNull(resolvedAbsolutePath)) {
        continue;
      }


      ResourcesPointersResolverForHTML.
          aliasedURIsAndOutputScriptsFilesAbsolutePathsCorrespondenceMap.
          set(srcAttributeValue, resolvedAbsolutePath);

      scriptElement.setAttribute("src", this.buildResourceFileFinalPath(resolvedAbsolutePath));

    }

    return this;

  }


  /* ─── Images ───────────────────────────────────────────────────────────────────────────────────────────────────── */
  private resolveImagesAliasedPaths(): this {

    const imagesProcessingSettingsRepresentative: ImagesProcessingSettingsRepresentative | undefined =
        this.projectBuildingMasterConfigRepresentative.imagesProcessingSettingsRepresentative;

    if (isUndefined(this.plainCopyingSettingsRepresentative) && isUndefined(imagesProcessingSettingsRepresentative)) {
      return this;
    }


    for (const imgElement of this.rootHTML_Element.querySelectorAll("img")) {

      this.resoleAliasedPathForImageLikeElement({
        targetHTML_Element: imgElement,
        targetHTML_ElementAttributeName: "src"
      });

    }

    for (const sourceElement of this.rootHTML_Element.querySelectorAll("picture > source")) {

      this.resoleAliasedPathForImageLikeElement({
        targetHTML_Element: sourceElement,
        targetHTML_ElementAttributeName: "srcset"
      });

    }

    for (const linkElement of this.rootHTML_Element.querySelectorAll("link[type='image/x-icon']")) {

      this.resoleAliasedPathForImageLikeElement({
        targetHTML_Element: linkElement,
        targetHTML_ElementAttributeName: "href"
      });

    }

    /* [ Theory ] Because CSS regular expression has limited functionality it is impossible to specify the optional
    *    whitespace after `background:` or `background-image:`. https://stackoverflow.com/a/78140136/4818123 */
    for (
      const variadicElement of
          this.rootHTML_Element.querySelectorAll("[style*=\"background: url(\"]").
            concat(this.rootHTML_Element.querySelectorAll("[style*=\"background:url(\"]")).
            concat(this.rootHTML_Element.querySelectorAll("[style*=\"background-image: url(\"]")).
            concat(this.rootHTML_Element.querySelectorAll("[style*=\"background-image:url(\"]"))
    ) {

      const updatedStyleAttributeValue: string = replaceMatchesWithRegularExpressionToDynamicValue({
        targetString: variadicElement.getAttribute("style") ?? "",
        regularExpressionWithCapturingGroups: /url\(["']?(?<possiblyAliasedPath>.+?)["']?\);?/gu,
        replacer: (
          matching: ReplacingOfMatchesWithRegularExpressionToDynamicValue.Matching<
            Readonly<{ possiblyAliasedPath: string; }>,
            Readonly<{ [1]: string; }>
          >
        ): string | null => {

          const possiblyAliasedPath: string = matching.namedCapturingGroups.possiblyAliasedPath;

          let resolvedAbsolutePath: string | null = ResourcesPointersResolverForHTML.
              aliasedURIsAndOutputImagesFilesAbsolutePathsCorrespondenceMap.
              get(possiblyAliasedPath) ??
              null;

          if (isNotNull(resolvedAbsolutePath)) {
            return `url("${ this.buildResourceFileFinalPath(resolvedAbsolutePath) }");`;
          }


          const segmentsOfPickedPath: Array<string> = explodeURI_PathToSegments(possiblyAliasedPath);
          const firstSegmentOfPickedPath: string | undefined = segmentsOfPickedPath[0];

          if (!isNonEmptyString(firstSegmentOfPickedPath)) {
            return null;
          }


          if (
            isNotUndefined(this.plainCopyingSettingsRepresentative) &&
                firstSegmentOfPickedPath.startsWith(PLAIN_COPIED_FILES_POINTER_ALIAS_PREFIX)
          ) {

            resolvedAbsolutePath = this.plainCopyingSettingsRepresentative.
                getSourceFileAbsolutePathByAliasedPath(segmentsOfPickedPath);

            if (isNull(resolvedAbsolutePath)) {
              return null;
            }


            ResourcesPointersResolverForHTML.
                aliasedURIsAndOutputImagesFilesAbsolutePathsCorrespondenceMap.
                set(possiblyAliasedPath, resolvedAbsolutePath);

            return `url("${ this.buildResourceFileFinalPath(resolvedAbsolutePath) }");`;

          }


          if (isUndefined(imagesProcessingSettingsRepresentative)) {
            return null;
          }


          resolvedAbsolutePath = this.resolveOutputResourceFileAbsolutePathIfPossible({
            pickedPathOfTargetResourceFile: possiblyAliasedPath,
            sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: ResourcesPointersResolverForHTML.
                imagesSourceFilesGroupsTopDirectoriesAliasesAndRespectiveAbsolutePathsMap,
            supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots:
                imagesProcessingSettingsRepresentative.supportedSourceFilesNamesExtensionsWithoutLeadingDots,
            sourceAndOutputFilesAbsolutePathsCorrespondenceMap:
                ImagesProcessingSharedState.sourceFilesAbsolutePathsAndOutputFilesActualPathsMap,
            fileTypeForLogging__singularForm: imagesProcessingSettingsRepresentative.TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM,
            fileTypeForLogging__pluralForm: imagesProcessingSettingsRepresentative.TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM
          });


          if (isNull(resolvedAbsolutePath)) {
            return null;
          }


          ResourcesPointersResolverForHTML.
              aliasedURIsAndOutputImagesFilesAbsolutePathsCorrespondenceMap.
              set(possiblyAliasedPath, resolvedAbsolutePath);

          return `url("${ this.buildResourceFileFinalPath(resolvedAbsolutePath) }");`;

        }
      });

      variadicElement.setAttribute("style", updatedStyleAttributeValue);

    }


    return this;

  }

  private resoleAliasedPathForImageLikeElement(
    {
      targetHTML_Element,
      targetHTML_ElementAttributeName
    }: Readonly<{
      targetHTML_Element: HTML_Element;
      targetHTML_ElementAttributeName: string;
    }>
  ): void {

    const targetHTML_ElementAttributeValue: string | undefined = targetHTML_Element.
        getAttribute(targetHTML_ElementAttributeName);

    if (!isNonEmptyString(targetHTML_ElementAttributeValue)) {
      return;
    }


    let resolvedAbsolutePath: string | null = ResourcesPointersResolverForHTML.
        aliasedURIsAndOutputImagesFilesAbsolutePathsCorrespondenceMap.
        get(targetHTML_ElementAttributeName) ??
        null;

    if (isNotNull(resolvedAbsolutePath)) {
      targetHTML_Element.setAttribute(targetHTML_ElementAttributeName, this.buildResourceFileFinalPath(resolvedAbsolutePath));
      return;
    }

    const segmentsOfPickedPath: Array<string> = explodeURI_PathToSegments(targetHTML_ElementAttributeValue);
    const firstSegmentOfPickedPath: string | undefined = segmentsOfPickedPath[0];

    if (!isNonEmptyString(firstSegmentOfPickedPath)) {
      return;
    }


    if (
      isNotUndefined(this.plainCopyingSettingsRepresentative) &&
          firstSegmentOfPickedPath.startsWith(PLAIN_COPIED_FILES_POINTER_ALIAS_PREFIX)
    ) {

      resolvedAbsolutePath = this.plainCopyingSettingsRepresentative.
          getSourceFileAbsolutePathByAliasedPath(segmentsOfPickedPath);

      if (isNull(resolvedAbsolutePath)) {
        return;
      }


      ResourcesPointersResolverForHTML.
          aliasedURIsAndOutputImagesFilesAbsolutePathsCorrespondenceMap.
          set(targetHTML_ElementAttributeValue, resolvedAbsolutePath);

      targetHTML_Element.setAttribute(targetHTML_ElementAttributeName, this.buildResourceFileFinalPath(resolvedAbsolutePath));

      return;

    }


    const imagesProcessingSettingsRepresentative: ImagesProcessingSettingsRepresentative | undefined =
        this.projectBuildingMasterConfigRepresentative.imagesProcessingSettingsRepresentative;

    if (isUndefined(imagesProcessingSettingsRepresentative)) {
      return;
    }


    resolvedAbsolutePath = this.resolveOutputResourceFileAbsolutePathIfPossible({
      pickedPathOfTargetResourceFile: targetHTML_ElementAttributeValue,
      sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: ResourcesPointersResolverForHTML.
          imagesSourceFilesGroupsTopDirectoriesAliasesAndRespectiveAbsolutePathsMap,
      supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots:
          imagesProcessingSettingsRepresentative.supportedSourceFilesNamesExtensionsWithoutLeadingDots,
      sourceAndOutputFilesAbsolutePathsCorrespondenceMap:
          ImagesProcessingSharedState.sourceFilesAbsolutePathsAndOutputFilesActualPathsMap,
      fileTypeForLogging__singularForm: imagesProcessingSettingsRepresentative.TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM,
      fileTypeForLogging__pluralForm: imagesProcessingSettingsRepresentative.TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM
    });

    if (isNull(resolvedAbsolutePath)) {
      return;
    }


    ResourcesPointersResolverForHTML.
        aliasedURIsAndOutputImagesFilesAbsolutePathsCorrespondenceMap.
        set(targetHTML_ElementAttributeValue, resolvedAbsolutePath);

    targetHTML_Element.setAttribute(targetHTML_ElementAttributeName, this.buildResourceFileFinalPath(resolvedAbsolutePath));

  }

  /* ─── Videos ──────────────────────────────────────────────────────────────────────────────────────────────────── */
  private resolveVideosAliasedPaths(): this {

    const videosProcessingSettingsRepresentative: VideosProcessingSettingsRepresentative | undefined =
        this.projectBuildingMasterConfigRepresentative.videosProcessingSettingsRepresentative;

    if (isUndefined(this.plainCopyingSettingsRepresentative) && isUndefined(videosProcessingSettingsRepresentative)) {
      return this;
    }


    for (const sourceElement of this.rootHTML_Element.querySelectorAll("video > source")) {

      const srcAttributeValue: string | undefined = sourceElement.getAttribute("src");

      if (!isNonEmptyString(srcAttributeValue)) {
        continue;
      }


      let resolvedAbsolutePath: string | null = ResourcesPointersResolverForHTML.
          aliasedURIsAndOutputVideosFilesAbsolutePathsCorrespondenceMap.
          get(srcAttributeValue) ??
          null;

      if (isNotNull(resolvedAbsolutePath)) {
        sourceElement.setAttribute("src", this.buildResourceFileFinalPath(resolvedAbsolutePath));
        continue;
      }


      const segmentsOfPickedPath: Array<string> = explodeURI_PathToSegments(srcAttributeValue);
      const firstSegmentOfPickedPath: string | undefined = segmentsOfPickedPath[0];

      if (!isNonEmptyString(firstSegmentOfPickedPath)) {
        continue;
      }


      if (
        isNotUndefined(this.plainCopyingSettingsRepresentative) &&
            firstSegmentOfPickedPath.startsWith(PLAIN_COPIED_FILES_POINTER_ALIAS_PREFIX)
      ) {

        resolvedAbsolutePath = this.plainCopyingSettingsRepresentative.
            getSourceFileAbsolutePathByAliasedPath(segmentsOfPickedPath);

        if (isNull(resolvedAbsolutePath)) {
          continue;
        }


        ResourcesPointersResolverForHTML.
            aliasedURIsAndOutputVideosFilesAbsolutePathsCorrespondenceMap.
            set(srcAttributeValue, resolvedAbsolutePath);

        sourceElement.setAttribute("src", this.buildResourceFileFinalPath(resolvedAbsolutePath));

        continue;

      }


      if (isUndefined(videosProcessingSettingsRepresentative)) {
        continue;
      }

      resolvedAbsolutePath = this.resolveOutputResourceFileAbsolutePathIfPossible({
        pickedPathOfTargetResourceFile: srcAttributeValue,
        sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: ResourcesPointersResolverForHTML.
            videosSourceFilesGroupsTopDirectoriesAliasesAndRespectiveAbsolutePathsMap,
        supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots:
            videosProcessingSettingsRepresentative.supportedSourceFilesNamesExtensionsWithoutLeadingDots,
        sourceAndOutputFilesAbsolutePathsCorrespondenceMap:
            VideosProcessingSharedState.sourceFilesAbsolutePathsAndOutputFilesActualPathsMap,
        fileTypeForLogging__singularForm: videosProcessingSettingsRepresentative.TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM,
        fileTypeForLogging__pluralForm: videosProcessingSettingsRepresentative.TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM
      });

      if (isNull(resolvedAbsolutePath)) {
        continue;
      }


      ResourcesPointersResolverForHTML.
          aliasedURIsAndOutputVideosFilesAbsolutePathsCorrespondenceMap.
          set(srcAttributeValue, resolvedAbsolutePath);

      sourceElement.setAttribute("src", this.buildResourceFileFinalPath(resolvedAbsolutePath));

    }

    return this;

  }

  /* ─── Audios ──────────────────────────────────────────────────────────────────────────────────────────────────── */
  private resolveAudiosAliasedPaths(): this {

    const audiosProcessingSettingsRepresentative: AudiosProcessingSettingsRepresentative | undefined =
        this.projectBuildingMasterConfigRepresentative.audiosProcessingSettingsRepresentative;

    if (isUndefined(this.plainCopyingSettingsRepresentative) && isUndefined(audiosProcessingSettingsRepresentative)) {
      return this;
    }


    for (const sourceElement of this.rootHTML_Element.querySelectorAll("audio > source")) {

      const srcAttributeValue: string | undefined = sourceElement.getAttribute("src");

      if (!isNonEmptyString(srcAttributeValue)) {
        continue;
      }


      let resolvedAbsolutePath: string | null = ResourcesPointersResolverForHTML.
          aliasedURIsAndOutputAudiosFilesAbsolutePathsCorrespondenceMap.
          get(srcAttributeValue) ??
          null;

      if (isNotNull(resolvedAbsolutePath)) {
        sourceElement.setAttribute("src", this.buildResourceFileFinalPath(resolvedAbsolutePath));
      }


      const segmentsOfPickedPath: Array<string> = explodeURI_PathToSegments(srcAttributeValue);
      const firstSegmentOfPickedPath: string | undefined = segmentsOfPickedPath[0];

      if (!isNonEmptyString(firstSegmentOfPickedPath)) {
        continue;
      }

      if (
        isNotUndefined(this.plainCopyingSettingsRepresentative) &&
            firstSegmentOfPickedPath.startsWith(PLAIN_COPIED_FILES_POINTER_ALIAS_PREFIX)
      ) {

        resolvedAbsolutePath = this.plainCopyingSettingsRepresentative.
            getSourceFileAbsolutePathByAliasedPath(segmentsOfPickedPath);

        if (isNull(resolvedAbsolutePath)) {
          continue;
        }


        ResourcesPointersResolverForHTML.
            aliasedURIsAndOutputAudiosFilesAbsolutePathsCorrespondenceMap.
            set(srcAttributeValue, resolvedAbsolutePath);

        sourceElement.setAttribute("src", this.buildResourceFileFinalPath(resolvedAbsolutePath));

        continue;

      }


      if (isUndefined(audiosProcessingSettingsRepresentative)) {
        continue;
      }


      resolvedAbsolutePath = this.resolveOutputResourceFileAbsolutePathIfPossible({
        pickedPathOfTargetResourceFile: srcAttributeValue,
        sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: ResourcesPointersResolverForHTML.
            audiosSourceFilesGroupsTopDirectoriesAliasesAndRespectiveAbsolutePathsMap,
        supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots:
            audiosProcessingSettingsRepresentative.supportedSourceFilesNamesExtensionsWithoutLeadingDots,
        sourceAndOutputFilesAbsolutePathsCorrespondenceMap:
            AudiosProcessingSharedState.sourceFilesAbsolutePathsAndOutputFilesActualPathsMap,
        fileTypeForLogging__singularForm: audiosProcessingSettingsRepresentative.TARGET_FILES_KIND_FOR_LOGGING__SINGULAR_FORM,
        fileTypeForLogging__pluralForm: audiosProcessingSettingsRepresentative.TARGET_FILES_KIND_FOR_LOGGING__PLURAL_FORM
      });

      if (isNull(resolvedAbsolutePath)) {
        continue;
      }


      ResourcesPointersResolverForHTML.
          aliasedURIsAndOutputAudiosFilesAbsolutePathsCorrespondenceMap.
          set(srcAttributeValue, resolvedAbsolutePath);

      sourceElement.setAttribute("src", this.buildResourceFileFinalPath(resolvedAbsolutePath));

    }

    return this;

  }


  /* ━━━ Routines ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* eslint-disable-next-line @typescript-eslint/class-methods-use-this --
   * The method is being used before non-static "buildResourceFileFinalPath", so in this case it has been declared first. */
  private resolveOutputResourceFileAbsolutePathIfPossible(
    {
      pickedPathOfTargetResourceFile,
      sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap,
      supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots,
      sourceAndOutputFilesAbsolutePathsCorrespondenceMap,
      fileTypeForLogging__pluralForm
    }: Readonly<{
      pickedPathOfTargetResourceFile: string;
      sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: ReadonlyMap<string, string>;
      supportedEntryPointsSourceFileNameExtensionsWithoutLeadingDots: ReadonlyArray<string>;
      sourceAndOutputFilesAbsolutePathsCorrespondenceMap: ReadonlyMap<string, string>;
      fileTypeForLogging__singularForm: string;
      fileTypeForLogging__pluralForm: string;
    }>
  ): string | null {

    const segmentsOfPickedPath: Array<string> = explodeURI_PathToSegments(pickedPathOfTargetResourceFile);
    const firstSegmentOfPickedPath: string | undefined = segmentsOfPickedPath[0];

    if (isUndefined(firstSegmentOfPickedPath)) {
      return null;
    }


    if (firstSegmentOfPickedPath.startsWith(PROCESSABLE_FILES_POINTER_ALIAS_PREFIX)) {

      const sourceFilesTopDirectoryAbsolutePathOfCurrentAlias: string | undefined =
          sourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap.get(firstSegmentOfPickedPath);

      if (isUndefined(sourceFilesTopDirectoryAbsolutePathOfCurrentAlias)) {

        Logger.logWarning(
          ResourcesPointersResolverForHTML.localization.generateUnknownResourceGroupReferenceWarningLog({
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
        { alwaysForwardSlashSeparators: true }
      );

      const explicitlySpecifiedLastFileNameExtensionWithoutDotOfSourceFile: string | null =
          extractLastExtensionOfFileName({
            targetPath: sourceFileComputedAbsolutePathPossiblyWithoutFileNameExtension,
            withLeadingDot: false
          });

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
            ResourcesPointersResolverForHTML.localization.
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
          ResourcesPointersResolverForHTML.localization.generateNoOutputFileExistingForSpecifiedSourceFilePathWarningLog({
            pickedPathOfTargetResourceFile,
            fileType__singularForm: fileTypeForLogging__pluralForm
          })
        );

        return null;

      }


      return resolvedFileOutputAbsolutePath;

    }


    return null;

  }

  private buildResourceFileFinalPath(resolvedOutputAbsolutePathOfResourceFile: string): string {
    return isNotUndefined(this.publicDirectoryAbsolutePath) ?
        `/${ 
          ImprovedPath.computeRelativePath({
            basePath: this.publicDirectoryAbsolutePath,
            comparedPath: resolvedOutputAbsolutePathOfResourceFile,
            alwaysForwardSlashSeparators: true
          })
        }` :
        ImprovedPath.computeRelativePath({
          basePath: this.contextHTML_FileOutputDirectoryAbsolutePath,
          comparedPath: resolvedOutputAbsolutePathOfResourceFile,
          alwaysForwardSlashSeparators: true
        });
  }

}


namespace ResourcesPointersResolverForHTML {

  export type SourceData = Readonly<{
    rootHTML_Element: HTML_Element;
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;
    markupProcessingSettingsRepresentative: MarkupProcessingSettingsRepresentative;
    absolutePathOfOutputDirectoryForTargetHTML_File: string;
  }>;


  export type AliasedURIsAndOutputFilesAbsolutePathsCorrespondenceMap = Map<AliasedURI, OutputFileAbsolutePath>;

  export type AliasedURI = string;
  export type OutputFileAbsolutePath = string;


  export type Localization = Readonly<{

    generateUnknownResourceGroupReferenceWarningLog: (
      templateVariables: Localization.UnknownResourceGroupReferenceWarningLog.TemplateVariables
    ) => Localization.UnknownResourceGroupReferenceWarningLog;

    generateNoMatchingsForAliasedFilePathWithoutFilenameExtensionWarningLog: (
      templateVariables: Localization.NoMatchingsForAliasedFilePathWithoutFilenameExtensionWarningLog.TemplateVariables
    ) => Localization.NoMatchingsForAliasedFilePathWithoutFilenameExtensionWarningLog;

    generateNoOutputFileExistingForSpecifiedSourceFilePathWarningLog: (
      templateVariables: Localization.NoOutputFileExistingForSpecifiedSourceFilePathWarningLog.TemplateVariables
    ) => Localization.NoOutputFileExistingForSpecifiedSourceFilePathWarningLog;

  }>;

  export namespace Localization {

    export type UnknownResourceGroupReferenceWarningLog = Readonly<Pick<WarningLog, "title" | "description">>;

    export namespace UnknownResourceGroupReferenceWarningLog {
      export type TemplateVariables = Readonly<{
        fileType__pluralForm: string;
        pickedPathOfTargetResourceFile: string;
        firstPathSegment: string;
        formattedSourceFilesTopDirectoriesAliasesAndRespectiveAbsolutePathsMap: string;
      }>;
    }


    export type NoMatchingsForAliasedFilePathWithoutFilenameExtensionWarningLog =
        Readonly<Pick<WarningLog, "title" | "description">>;

    export namespace NoMatchingsForAliasedFilePathWithoutFilenameExtensionWarningLog {
      export type TemplateVariables = Readonly<{
        fileType__singularForm: string;
        pickedPathOfTargetResourceFile: string;
        checkedAbsolutePaths__formatted: string;
      }>;
    }


    export type NoOutputFileExistingForSpecifiedSourceFilePathWarningLog = Readonly<Pick<WarningLog, "title" | "description">>;

    export namespace NoOutputFileExistingForSpecifiedSourceFilePathWarningLog {
      export type TemplateVariables = Readonly<{
        fileType__singularForm: string;
        pickedPathOfTargetResourceFile: string;
      }>;
    }

  }

}


export default ResourcesPointersResolverForHTML;


/* It is the only way to extract the child namespace (no need to expose whole AccessibilityInspector for the localization
 * packages). See https://stackoverflow.com/a/73400523/4818123 */
export import ResourcesReferencesResolverForHTML_Localization = ResourcesPointersResolverForHTML.Localization;
