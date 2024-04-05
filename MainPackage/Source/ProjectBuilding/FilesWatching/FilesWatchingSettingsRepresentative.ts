/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type FilesWatchingSettings__Normalized from "@ProjectBuilding/FilesWatching/FilesWatchingSettings__Normalized";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { ImprovedGlob } from "@yamato-daiwa/es-extensions-nodejs";


export default class FilesWatchingSettingsRepresentative {

  public readonly mustProvideFilesWatching: boolean;
  public readonly exclusiveGlobsOfExcludedFilesAndDirectories: Array<string>;


  private readonly fileWatchingSettings: FilesWatchingSettings__Normalized;


  public constructor(
    fileWatchingSettings: FilesWatchingSettings__Normalized,
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ) {

    this.fileWatchingSettings = fileWatchingSettings;
    this.mustProvideFilesWatching = projectBuildingMasterConfigRepresentative.mustProvideIncrementalBuilding;

    this.exclusiveGlobsOfExcludedFilesAndDirectories = [
      ...ImprovedGlob.includingGlobSelectorsToExcludingOnes(
        Array.from(this.fileWatchingSettings.excludedFilesGlobSelectors)
      ),
      ...ImprovedGlob.includingGlobSelectorsToExcludingOnes(
        Array.from(this.fileWatchingSettings.excludedDirectoriesGlobSelectors)
      )
    ];

  }

}
