import ConsumingProjectBuildingModes from "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";


const ImagesProcessingSettings__Default: Readonly<{

  periodBetweenFileUpdatingAndRebuildingStarting__seconds: number;

  logging: Readonly<{
    filesPaths: boolean;
    filesCount: boolean;
    filesWatcherEvents: boolean;
  }>;

  mustOptimize: (consumingProjectBuildingMode: ConsumingProjectBuildingModes) => boolean;

}> = {

  periodBetweenFileUpdatingAndRebuildingStarting__seconds: 1,

  logging: {
    filesPaths: true,
    filesCount: true,
    filesWatcherEvents: true
  },

  mustOptimize:
      (consumingProjectBuildingMode: ConsumingProjectBuildingModes): boolean =>
          consumingProjectBuildingMode !== ConsumingProjectBuildingModes.staticPreview &&
          consumingProjectBuildingMode !== ConsumingProjectBuildingModes.localDevelopment

};


export default ImagesProcessingSettings__Default;
