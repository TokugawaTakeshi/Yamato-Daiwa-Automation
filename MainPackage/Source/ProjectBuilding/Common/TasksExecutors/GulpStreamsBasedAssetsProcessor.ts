/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type AssetsProcessingSettingsGenericProperties__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/AssetsProcessingSettingsGenericProperties__Normalized";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type AssetsProcessingSettingsRepresentative from
    "@ProjectBuilding/Common/SettingsRepresentatives/AssetsProcessingSettingsRepresentative";

/* ─── Task Executors ─────────────────────────────────────────────────────────────────────────────────────────────── */
import GulpStreamsBasedTaskExecutor from "@ProjectBuilding/Common/TasksExecutors/GulpStreamsBased/GulpStreamsBasedTaskExecutor";

/* ─── Applied Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import type VinylFile from "vinyl";
import AssetVinylFile from "@ProjectBuilding/Common/VinylFiles/AssetVinylFile";
import GulpStreamModifier from "@Utils/GulpStreamModifier";
import FileNameRevisionPostfixer from "@Utils/FileNameRevisionPostfixer";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import { isNotNull, secondsToMilliseconds } from "@yamato-daiwa/es-extensions";


export default abstract class GulpStreamsBasedAssetsProcessor<
  AssetsManagerCommonSettings__Normalized extends AssetsProcessingSettingsGenericProperties__Normalized.Common,
  AssetsGroupSettings__Normalized extends AssetsProcessingSettingsGenericProperties__Normalized.AssetsGroup,
  CertainAssetsManagerConfigRepresentative extends AssetsProcessingSettingsRepresentative<
    AssetsManagerCommonSettings__Normalized, AssetsGroupSettings__Normalized
  >
> extends GulpStreamsBasedTaskExecutor {

  protected readonly absolutePathOfFilesWaitingForReProcessing: Set<string> = new Set<string>();
  protected readonly WAITING_FOR_SUBSEQUENT_FILES_WILL_SAVED_PERIOD__SECONDS: number;

  protected associatedAssetsProcessingSettingsRepresentative: CertainAssetsManagerConfigRepresentative;
  protected subsequentFilesStateChangeTimeout: NodeJS.Timeout | null = null;

  protected logging: GulpStreamsBasedTaskExecutor.Logging;


  protected constructor(
    constructorParameter:
        GulpStreamsBasedTaskExecutor.ConstructorParameter &
        Readonly<{
          associatedAssetsProcessingSettingsRepresentative: CertainAssetsManagerConfigRepresentative;
          waitingForSubsequentFilesWillSavedPeriod__seconds: number;
        }>
  ) {

    super(constructorParameter);

    this.associatedAssetsProcessingSettingsRepresentative = constructorParameter.
        associatedAssetsProcessingSettingsRepresentative;
    this.WAITING_FOR_SUBSEQUENT_FILES_WILL_SAVED_PERIOD__SECONDS = constructorParameter.
        waitingForSubsequentFilesWillSavedPeriod__seconds;

    this.logging = {
      pathsOfFilesWillBeProcessed: this.associatedAssetsProcessingSettingsRepresentative.loggingSettings.filesPaths,
      quantityOfFilesWillBeProcessed: this.associatedAssetsProcessingSettingsRepresentative.loggingSettings.filesCount
    };

  }


  protected abstract processAssets(sourceFilesAbsolutePathsOrGlobs: Array<string>): () => NodeJS.ReadWriteStream;


  /* ━━━ Pipeline methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  protected async replacePlainVinylFileWithAssetVinylFile(
    plainVinylFile: VinylFile, addNewFileToStream: GulpStreamModifier.NewFilesAdder
  ): Promise<GulpStreamModifier.CompletionSignals> {

    addNewFileToStream(
      new AssetVinylFile({
        initialPlainVinylFile: plainVinylFile,
        actualAssetsGroupSettings: this.associatedAssetsProcessingSettingsRepresentative.
            getAssetsNormalizedSettingsActualForTargetSourceFile(plainVinylFile.path)
      })
    );

    return Promise.resolve(GulpStreamModifier.CompletionSignals.REMOVING_FILE_FROM_STREAM);

  }

  protected static async addContentHashPostfixToFileNameIfMust(
    processedAssetFile: AssetVinylFile
  ): Promise<GulpStreamModifier.CompletionSignals> {

    if (processedAssetFile.actualAssetsGroupSettings.revisioning.mustExecute) {
      FileNameRevisionPostfixer.appendPostfixIfPossible(
        processedAssetFile,
        { contentHashPostfixSeparator: processedAssetFile.actualAssetsGroupSettings.revisioning.contentHashPostfixSeparator }
      );
    }

    return Promise.resolve(GulpStreamModifier.CompletionSignals.PASSING_ON);

  }


  /* ━━━ Rebuilding ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* eslint-disable-next-line @typescript-eslint/member-ordering --
  * `addContentHashPostfixToFileNameIfMust`を静的にすると、`@typescript-eslint/class-methods-use-this`が発生するが、メソッドが論理的な
  *   順番通り整理してある。  */
  protected onSourceFilesWatcherEmittedFileAddingOrUpdatingEvent(targetFileAbsolutePath: string): void {

    this.absolutePathOfFilesWaitingForReProcessing.add(targetFileAbsolutePath);

    if (isNotNull(this.subsequentFilesStateChangeTimeout)) {
      clearTimeout(this.subsequentFilesStateChangeTimeout);
    }


    this.subsequentFilesStateChangeTimeout = setTimeout(
      (): void => {
        this.processAssets(Array.from(this.absolutePathOfFilesWaitingForReProcessing))();
        this.absolutePathOfFilesWaitingForReProcessing.clear();
      },
      secondsToMilliseconds(this.WAITING_FOR_SUBSEQUENT_FILES_WILL_SAVED_PERIOD__SECONDS)
    );

  }


}
