/* --- Normalized settings ------------------------------------------------------------------------------------------ */
import type PlainCopyingSettings__Normalized from "@ProjectBuilding/PlainCopying/PlainCopyingSettings__Normalized";

/* --- Settings representative -------------------------------------------------------------------------------------- */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import type PlainCopyingSettingsRepresentative from "@ProjectBuilding/PlainCopying/PlainCopyingSettingsRepresentative";

/* --- Applied utils ------------------------------------------------------------------------------------------------ */
import Gulp from "gulp";
import GulpStreamModifier from "@Utils/GulpStreamModifier";
import createImmediatelyEndingEmptyStream from "@Utils/createImmediatelyEndingEmptyStream";
import type VinylFile from "vinyl";
import PlainCopiedVinylFile from "@ProjectBuilding/PlainCopying/PlainCopiedVinylFile";

/* --- General utils ------------------------------------------------------------------------------------------------ */
import { isUndefined } from "@yamato-daiwa/es-extensions";
import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";
import ImprovedGlob from "@UtilsIncubator/ImprovedGlob";


export default class PlainCopier {

  private readonly sourceFilesAbsolutePathsAndRespectiveFilesGroupSettingsCorrespondence: {
    [sourceFileAbsolutePath: string]: PlainCopyingSettings__Normalized.FilesGroup;
  };


  public static providePlainCopierIfMust(
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): () => NodeJS.ReadWriteStream {

    if (
      isUndefined(masterConfigRepresentative.plainCopyingSettingsRepresentative) ||
      Object.entries(masterConfigRepresentative.plainCopyingSettingsRepresentative.filesGroups).length === 0
    ) {
      return createImmediatelyEndingEmptyStream();
    }


    return new PlainCopier(masterConfigRepresentative.plainCopyingSettingsRepresentative).copyFiles();

  }


  private constructor(plainCopyingSettingsRepresentative: PlainCopyingSettingsRepresentative) {

    const sourceFilesAbsolutePathsAndRespectiveFilesGroupSettingsCorrespondence: {
      [sourceFileAbsolutePath: string]: PlainCopyingSettings__Normalized.FilesGroup;
    } = {};

    for (const filesGroupSettings of Object.values(plainCopyingSettingsRepresentative.filesGroups)) {

      const absolutePathsOfFilesOfTargetGroup: ReadonlyArray<string> = "sourceFileAbsolutePath" in filesGroupSettings ?
          [ filesGroupSettings.sourceFileAbsolutePath ] :
          ImprovedGlob.getFilesAbsolutePathsSynchronously([
            ImprovedGlob.buildAllFilesInCurrentDirectoryAndBelowGlobSelector({
              basicDirectoryPath: filesGroupSettings.sourceDirectoryAbsolutePath
            })
          ]);

      for (const fileAbsolutePath of absolutePathsOfFilesOfTargetGroup) {
        sourceFilesAbsolutePathsAndRespectiveFilesGroupSettingsCorrespondence[fileAbsolutePath] = filesGroupSettings;
      }

    }

    this.sourceFilesAbsolutePathsAndRespectiveFilesGroupSettingsCorrespondence =
        sourceFilesAbsolutePathsAndRespectiveFilesGroupSettingsCorrespondence;

  }


  private copyFiles(): () => NodeJS.ReadWriteStream {

    return (): NodeJS.ReadWriteStream =>

        Gulp.src(Object.keys(this.sourceFilesAbsolutePathsAndRespectiveFilesGroupSettingsCorrespondence)).

            pipe(GulpStreamModifier.modify({
              onStreamStartedEventCommonHandler: this.replacePlainVinylFileWithPlainCopiedVinylFile.bind(this)
            })).

            pipe(Gulp.dest(PlainCopiedVinylFile.outputDirectoryCalculatorForSpecificFile));

  }


  /* === Pipeline methods =========================================================================================== */
  private async replacePlainVinylFileWithPlainCopiedVinylFile(
    plainVinylFile: VinylFile, addNewFileToStream: GulpStreamModifier.NewFilesAdder
  ): Promise<GulpStreamModifier.CompletionSignals> {

    addNewFileToStream(
      new PlainCopiedVinylFile(
        plainVinylFile,
        this.sourceFilesAbsolutePathsAndRespectiveFilesGroupSettingsCorrespondence[
          ImprovedPath.replacePathSeparatorsToForwardSlashes(plainVinylFile.path)
        ]
      )
    );

    return Promise.resolve(GulpStreamModifier.CompletionSignals.REMOVING_FILE_FROM_STREAM);

  }

}
