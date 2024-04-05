const AudiosProcessingSettings__Default: Readonly<{

  periodBetweenFileUpdatingAndRebuildingStarting__seconds: number;

  logging: Readonly<{
    filesPaths: boolean;
    filesCount: boolean;
    filesWatcherEvents: boolean;
  }>;

}> = {

  periodBetweenFileUpdatingAndRebuildingStarting__seconds: 1,

  logging: {
    filesPaths: true,
    filesCount: true,
    filesWatcherEvents: true
  }

};


export default AudiosProcessingSettings__Default;
