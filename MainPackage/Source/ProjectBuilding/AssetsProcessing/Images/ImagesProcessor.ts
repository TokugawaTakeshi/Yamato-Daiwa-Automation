/* ━━━ < Imports ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* ┅┅┅ Normalized Settings ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import type ImagesProcessingSettings__Normalized from "@ImagesProcessing/ImagesProcessingSettings__Normalized";

/* ┅┅┅ Settings Representatives ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type ImagesProcessingSettingsRepresentative from "@ImagesProcessing/ImagesProcessingSettingsRepresentative";

/* ┅┅┅ Shared State ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import ImagesProcessingSharedState from "@ImagesProcessing/ImagesProcessingSharedState";

/* ┅┅┅ Worktypes ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import type ImagesProcessingTypes from "@ImagesProcessing/ImagesProcessingTypes";

/* ┅┅┅ Gulp & Plugins ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import Gulp from "gulp";
import type VinylFile from "vinyl";
import gulpIf from "gulp-if";
import type GulpImagemin from "gulp-imagemin";
import pngQuant from "imagemin-pngquant";

/* ┅┅┅ Applied Utils ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import GulpStreamsBasedAssetsProcessor from "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBasedAssetsProcessor";
import GulpStreamModifier from "@Utils/GulpStreamModifier";
import ImagesSourceFilesWatcher from "@ImagesProcessing/ImagesSourceFilesWatcher";
import createImmediatelyEndingEmptyStream from "@Utils/createImmediatelyEndingEmptyStream";
import ImageVinyFile from "./ImageVinyFile";
import DotYDA_DirectoryManager from "@Utils/DotYDA_DirectoryManager";
import HTML_Validator from "@MarkupProcessing/Plugins/HTML_Validator/HTML_Validator";

/* ┅┅┅ General Utils ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import {
  RawObjectDataProcessor,
  ClassRequiredInitializationHasNotBeenExecutedError,
  Logger,
  readonlyArrayToMutableOne,
  isUndefined
} from "@yamato-daiwa/es-extensions";
import {
  FileNotFoundError,
  ImprovedPath,
  ObjectDataFilesProcessor
} from "@yamato-daiwa/es-extensions-nodejs";
import FileSystem from "node:fs/promises";
import writeFileToPossiblyNotExistingDirectory from
    "@Incubators/@yamato-daiwa/es-extensions-nodejs/ImprovedFileSystem/writeFileToPossiblyNotExistingDirectory";
/* ━━━ Imports > ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */


export default class ImagesProcessor extends GulpStreamsBasedAssetsProcessor<
  ImagesProcessingSettings__Normalized.Common,
  ImagesProcessingSettings__Normalized.AssetsGroup,
  ImagesProcessingSettingsRepresentative
> {

  /* ━━━ Fields ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* ┅┅┅ Optimized Images Caching ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private static readonly CACHED_OPTIMIZED_IMAGES_DIRECTORY_NAME: string = "Images";
  private static readonly CACHED_OPTIMIZED_IMAGES_METADATA_FILE_NAME_WITH_EXTENSION: string = "OptimizedImagesMetadata.json";

  private static readonly cachedOptimizedImagedMetadataSpecification:
      RawObjectDataProcessor.AssociativeArrayTypeDataSpecification =
          {
            nameForLogging: "ImagesProcessor.ImagesProcessingTypes.CachedOptimizedImagesMetadata",
            subtype: RawObjectDataProcessor.ObjectSubtypes.associativeArray,
            areUndefinedTypeValuesForbidden: true,
            areNullTypeValuesForbidden: true,
            value: {
              type: Object,
              properties: {
                cachedImageFileNameWithExtension: {
                  type: String,
                  isUndefinedForbidden: true,
                  isNullForbidden: true,
                  minimalCharactersCount: 1
                },
                targetImageLastModificationDateTime__ISO_8601: {
                  type: String,
                  isUndefinedForbidden: true,
                  isNullForbidden: true,
                  minimalCharactersCount: 1
                }
              }
            }
          };

  /* ┅┅┅ ESM Dependencies ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  /* [ Theory ]
   * The "gulp-imagemin" is the ESM module with top-level await thus it could not be loaded by "require()" even in
   *   the Node.js versions supporting the "require(esm)". The dynamic "import()" is the only way to load it from
   *   the CommonJS, thus it must be called before the images processing (the "gulp-imagemin" must be marked as the
   *   "import" type external in the Webpack config, otherwise the "import()" will be replaced with "require()"). */
  private static gulpImageminModule: Readonly<
    { gulpImagemin: typeof GulpImagemin; } & ImagesProcessor.GulpImageminPluginsFactories
  > | null = null;

  /* ┅┅┅ Optimized Images Caching ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private readonly CACHED_OPTIMIZED_IMAGES_DIRECTORY_ABSOLUTE_PATH: string;
  private readonly CACHED_OPTIMIZED_IMAGES_METADATA_FILE_ABSOLUTE_PATH: string;

  private readonly cachedOptimizedImagedMetadata: ImagesProcessingTypes.CachedOptimizedImagesMetadata;


  /* ━━━ Public Methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public static provideESM_DependenciesLoadingIfMust(
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): () => Promise<void> {

    if (isUndefined(projectBuildingMasterConfigRepresentative.imagesProcessingSettingsRepresentative)) {
      return async (): Promise<void> => Promise.resolve();
    }


    return async (): Promise<void> => {

      const {
        default: gulpImagemin,
        mozjpeg,
        gifsicle,
        svgo
      }: Readonly<{ default: typeof GulpImagemin; } & ImagesProcessor.GulpImageminPluginsFactories> =
          await import("gulp-imagemin");

      /* eslint-disable-next-line require-atomic-updates --
       * The value is not depending on the previous state thus the race condition is not possible. */
      ImagesProcessor.gulpImageminModule = { gulpImagemin, mozjpeg, gifsicle, svgo };

    };

  }

  public static provideImagesProcessingIfMust(
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): () => NodeJS.ReadWriteStream {

    const imagesProcessingSettingsRepresentative: ImagesProcessingSettingsRepresentative | undefined =
        projectBuildingMasterConfigRepresentative.imagesProcessingSettingsRepresentative;

    if (isUndefined(imagesProcessingSettingsRepresentative)) {
      return createImmediatelyEndingEmptyStream();
    }


    const dataHoldingSelfInstance: ImagesProcessor = new ImagesProcessor(
      projectBuildingMasterConfigRepresentative, imagesProcessingSettingsRepresentative
    );

    if (projectBuildingMasterConfigRepresentative.mustProvideIncrementalBuilding) {

      ImagesSourceFilesWatcher.
          initializeIfRequiredAndGetInstance({
            imagesProcessingSettingsRepresentative,
            projectBuildingMasterConfigRepresentative
          }).
          addOnFileAddedEventHandler({
            handlerID: "ON_IMAGES_FILE_ADDED--BY_IMAGES_PROCESSOR",
            handler: dataHoldingSelfInstance.onSourceFilesWatcherEmittedFileAddingOrUpdatingEvent.bind(dataHoldingSelfInstance)
          }).
          addFileUpdatedEventHandler({
            handlerID: "ON_IMAGES_FILE_UPDATED--BY_IMAGES_PROCESSOR",
            handler: dataHoldingSelfInstance.onSourceFilesWatcherEmittedFileAddingOrUpdatingEvent.bind(dataHoldingSelfInstance)
          }).
          addOnFileDeletedEventHandler({
            handlerID: "ON_IMAGES_FILE_DELETED--BY_IMAGES_PROCESSOR",
            handler: dataHoldingSelfInstance.onImageFileDeleted.bind(dataHoldingSelfInstance)
          });

   }

    return dataHoldingSelfInstance.processAssets(imagesProcessingSettingsRepresentative.actualAssetsSourceFilesAbsolutePaths);

  }


  /* ━━━ Constructor ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private constructor(
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative,
    imagesProcessingSettingsRepresentative: ImagesProcessingSettingsRepresentative
  ) {

    super({
      projectBuildingMasterConfigRepresentative,
      associatedAssetsProcessingSettingsRepresentative: imagesProcessingSettingsRepresentative,
      taskTitleForLogging: "Images Processing",
      waitingForSubsequentFilesWillSavedPeriod__seconds: imagesProcessingSettingsRepresentative.assetsProcessingCommonSettings.
          periodBetweenFileUpdatingAndRebuildingStarting__seconds
    });

    this.CACHED_OPTIMIZED_IMAGES_DIRECTORY_ABSOLUTE_PATH =
        ImprovedPath.joinPathSegments(
          [
            DotYDA_DirectoryManager.OPTIMIZATION_FILES_DIRECTORY_ABSOLUTE_PATH,
            ImagesProcessor.CACHED_OPTIMIZED_IMAGES_DIRECTORY_NAME
          ],
          { alwaysForwardSlashSeparators: true }
        );

    this.CACHED_OPTIMIZED_IMAGES_METADATA_FILE_ABSOLUTE_PATH =
        ImprovedPath.joinPathSegments(
          [
            DotYDA_DirectoryManager.OPTIMIZATION_FILES_DIRECTORY_ABSOLUTE_PATH,
            ImagesProcessor.CACHED_OPTIMIZED_IMAGES_DIRECTORY_NAME,
            ImagesProcessor.CACHED_OPTIMIZED_IMAGES_METADATA_FILE_NAME_WITH_EXTENSION
          ],
          { alwaysForwardSlashSeparators: true }
        );

    let cachedOptimizedImagedMetadata: ImagesProcessingTypes.CachedOptimizedImagesMetadata | undefined;

    try {

      cachedOptimizedImagedMetadata =
          ObjectDataFilesProcessor.processFile<ImagesProcessingTypes.CachedOptimizedImagesMetadata>({
            filePath: this.CACHED_OPTIMIZED_IMAGES_METADATA_FILE_ABSOLUTE_PATH,
            validDataSpecification: ImagesProcessor.cachedOptimizedImagedMetadataSpecification,
            synchronously: true
          });

    } catch (error: unknown) {

      if (!(error instanceof FileNotFoundError)) {
        Logger.logError({
          errorType: "CachedDataRetrievingFailure",
          ...HTML_Validator.localization.cachedPreviousValidationsResultsDataRetrievingErrorLog({
            cachedValidationsResultsFileAbsolutePath: this.CACHED_OPTIMIZED_IMAGES_METADATA_FILE_ABSOLUTE_PATH
          }),
          occurrenceLocation: "ImagesProcessor.provideImagesProcessingIfMust(projectBuildingMasterConfigRepresentative) ->" +
            "ImagesProcessor.constructor(...)",
          caughtError: error,
          mustOutputIf: __IS_DEVELOPMENT_BUILDING_MODE__
        });
      }

    }

    this.cachedOptimizedImagedMetadata = cachedOptimizedImagedMetadata ?? {};

  }


  /* ━━━ Internal Methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* ┅┅┅ Pipeline ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  protected processAssets(sourceFilesAbsolutePaths: ReadonlyArray<string>): () => NodeJS.ReadWriteStream {

    /* [ Theory ]
     * If to pass the empty array to 'Gulp.src(".")' error will occur, but the cause will not be told clearly.
     * However, the empty array is the usual scenario (for instance, when the user declared the configuration but
     *  has not added all files yet). */
    if (sourceFilesAbsolutePaths.length === 0) {
      return (): NodeJS.ReadWriteStream => Gulp.src(".");
    }


    return (): NodeJS.ReadWriteStream => Gulp.

        src(readonlyArrayToMutableOne(sourceFilesAbsolutePaths)).

        pipe(super.handleErrorIfItWillOccur()).
        pipe(super.logInputFilesIfMust()).

        pipe(
          GulpStreamModifier.modifyForSingleVinylFileSubtype({
            onStreamStartedEventHandler: this.replacePlainVinylFileWithImageVinylFile.bind(this)
          })
        ).

        pipe(
          gulpIf(

            (vinylFile: VinylFile): boolean =>
                /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions --
                 * The TypeScript type does not respect the possible extending from the Vinyl file. */
                (vinylFile as ImageVinyFile).mustBeOptimizedDuringCurrentExecution,

            ImagesProcessor.createImagesOptimizationStream()

          )
        ).

        pipe(
          GulpStreamModifier.modifyForSingleVinylFileSubtype({
            onStreamStartedEventHandler: async (imageVinylFile: ImageVinyFile): Promise<GulpStreamModifier.CompletionSignals> => {

              imageVinylFile.hasBeenOptimizedDuringCurrentExecution = imageVinylFile.mustBeOptimizedDuringCurrentExecution;

              if (imageVinylFile.hasBeenOptimizedDuringCurrentExecution) {

                const cachedImageFileNameWithExtension: string = `${ new Date().getTime() }${ imageVinylFile.extname }`;
                const cachedImageFileAbsolutePath: string =
                    ImprovedPath.joinPathSegments(
                      [ this.CACHED_OPTIMIZED_IMAGES_DIRECTORY_ABSOLUTE_PATH, cachedImageFileNameWithExtension ],
                      { alwaysForwardSlashSeparators: true }
                    );

                /* [ Theory ]
                 * Must be written as the buffer (not as the stringified content) to keep the encoding which may not be
                 *   UTF-8 especially for non-binary files like PNG or JPG. */
                writeFileToPossiblyNotExistingDirectory({
                  filePath: cachedImageFileAbsolutePath,
                  content: imageVinylFile.getContentsExpectedToBeBuffer(),
                  synchronously: true
                });

                const targetImageLastModificationDateTime__ISO_8601: string =
                    imageVinylFile.sourceFileLastModificationDateTime__ISO8601;

                this.cachedOptimizedImagedMetadata[
                  ImprovedPath.computeRelativePath({
                    basePath: this.projectBuildingMasterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath,
                    comparedPath: imageVinylFile.sourceAbsolutePath,
                    alwaysForwardSlashSeparators: true
                  })
                ] =

                    /* Values examples

                     '01-Source/Implementation/Elements/Client/SharedAssets/Images/ExternalWebSitesLogos/npm.jpg': {
                       cachedImageFileNameWithExtension: '51h_epHAFLzvN6hFqNgYi.jpg',
                       targetImageLastModificationDateTime__ISO_8601: '2026-08-01T03:19:17.379Z'
                     },

                     '01-Source/Implementation/Elements/Client/SharedAssets/Images/TechnologiesLogos/BlazorLogo.png': {
                       cachedImageFileNameWithExtension: 'GPo-uOnuZ0lS8ZZSplVk3.png',
                       targetImageLastModificationDateTime__ISO_8601: '2026-08-01T03:19:17.985Z'
                     }

                    */
                    {
                      cachedImageFileNameWithExtension,
                      targetImageLastModificationDateTime__ISO_8601
                    };

                await FileSystem.writeFile(
                  this.CACHED_OPTIMIZED_IMAGES_METADATA_FILE_ABSOLUTE_PATH,
                  JSON.stringify(this.cachedOptimizedImagedMetadata, null, 2)
                );

              }

              return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);

            }
          })
        ).

        pipe(
          GulpStreamModifier.modifyForSingleVinylFileSubtype({
            onStreamStartedEventHandler: GulpStreamsBasedAssetsProcessor.addContentHashPostfixToFileNameIfMust
          })
        ).

        pipe(
          GulpStreamModifier.modifyForSingleVinylFileSubtype({
            async onStreamStartedEventHandler(imageVinyFile: ImageVinyFile): Promise<GulpStreamModifier.CompletionSignals> {
              imageVinyFile.hasBeenOptimizedDuringCurrentExecution = imageVinyFile.mustBeOptimizedDuringCurrentExecution;
              return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);
            }
          })
        ).

        pipe(
          GulpStreamModifier.modifyForSingleVinylFileSubtype({
            onStreamStartedEventHandler: ImagesProcessor.postProcessFile.bind(this)
          })
        ).

        pipe(super.logOutputFilesIfMust()).

        pipe(
          Gulp.dest(
            (targetFileInFinalState: VinylFile): string =>
                ImageVinyFile.getOutputDirectoryAbsolutePathOfExpectedToBeSelfInstance(targetFileInFinalState)
          )
        );

  }

  protected async replacePlainVinylFileWithImageVinylFile(
    plainVinylFile: VinylFile, addNewFileToStream: GulpStreamModifier.NewFilesAdder
  ): Promise<GulpStreamModifier.CompletionSignals> {

    addNewFileToStream(
      new ImageVinyFile({
        initialPlainVinylFile: plainVinylFile,
        actualAssetsGroupSettings:
            this.associatedAssetsProcessingSettingsRepresentative.
                getAssetsNormalizedSettingsActualForTargetSourceFile(plainVinylFile.path),
        assetsProcessingCommonSettings:
            this.associatedAssetsProcessingSettingsRepresentative.assetsProcessingCommonSettings,
        cachedOptimizedImagedMetadata: this.cachedOptimizedImagedMetadata,
        consumingProjectRootDirectoryAbsolutePath:
            this.projectBuildingMasterConfigRepresentative.consumingProjectRootDirectoryAbsolutePath,
        cachedOptimizedImagesDirectoryAbsolutePath: this.CACHED_OPTIMIZED_IMAGES_DIRECTORY_ABSOLUTE_PATH
      })
    );

    return Promise.resolve(GulpStreamModifier.CompletionSignals.REMOVING_FILE_FROM_STREAM);

  }

  private static createImagesOptimizationStream(): NodeJS.ReadWriteStream {

    if (ImagesProcessor.gulpImageminModule === null) {
      Logger.throwErrorWithFormattedMessage({
        errorInstance: new ClassRequiredInitializationHasNotBeenExecutedError({
          className: "ImagesProcessor",
          initializingMethodName: "provideESM_DependenciesLoadingIfMust"
        }),
        title: ClassRequiredInitializationHasNotBeenExecutedError.localization.defaultTitle,
        occurrenceLocation: "ImagesProcessor.createImagesOptimizationStream()"
      });
    }


    const {
      gulpImagemin,
      mozjpeg,
      gifsicle,
      svgo
    }: Readonly<{ gulpImagemin: typeof GulpImagemin; } & ImagesProcessor.GulpImageminPluginsFactories> =
        ImagesProcessor.gulpImageminModule;

    return gulpImagemin([
      mozjpeg({ progressive: true }),
      gifsicle({ interlaced: true }),
      svgo({}),
      pngQuant()
    ]);

  }

  private static async postProcessFile(processedImageFile: ImageVinyFile): Promise<GulpStreamModifier.CompletionSignals> {

    ImagesProcessingSharedState.sourceFilesAbsolutePathsAndOutputFilesActualPathsMap.set(
      ImprovedPath.replacePathSeparatorsToForwardSlashes(processedImageFile.sourceAbsolutePath),
      ImprovedPath.joinPathSegments(
        [ processedImageFile.outputDirectoryAbsolutePath, processedImageFile.basename ],
        { alwaysForwardSlashSeparators: true }
      )
    );

    return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);

  }


  /* ━━━ Files Watcher Handlers ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* eslint-disable-next-line @typescript-eslint/member-ordering -- Semantically another method. */
  private onImageFileDeleted(targetVideoFileAbsolutePath: string): void {
    this.absolutePathOfFilesWaitingForReProcessing.delete(targetVideoFileAbsolutePath);
    ImagesProcessingSharedState.sourceFilesAbsolutePathsAndOutputFilesActualPathsMap.delete(targetVideoFileAbsolutePath);
  }

}


namespace ImagesProcessor {

  export type GulpImageminPluginsFactories = Readonly<{
    mozjpeg: typeof GulpImagemin.mozjpeg;
    gifsicle: typeof GulpImagemin.gifsicle;
    svgo: typeof GulpImagemin.svgo;
  }>;

}
