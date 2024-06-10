import ConsumingProjectBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";


const StylesProcessingSettings__Default: Readonly<{

  periodBetweenFileUpdatingAndRebuildingStarting__seconds: number;

  revisioning: Readonly<{
    mustExecute: (
      compoundParameter: Readonly<{ consumingProjectBuildingMode: ConsumingProjectBuildingModes; }>
    ) => boolean;
    contentHashPostfixSeparator: string;
  }>;

  linting: Readonly<{
    mustExecute: boolean;
  }>;

  logging: Readonly<{

    filesPaths: boolean;
    filesCount: boolean;
    partialFilesAndParentEntryPointsCorrespondence: boolean;
    filesWatcherEvents: boolean;

    linting: Readonly<{
      starting: boolean;
      completionWithoutIssues: boolean;
    }>;

  }>;

}> = {

  periodBetweenFileUpdatingAndRebuildingStarting__seconds: 1,

  revisioning: {
    mustExecute: (
      compoundParameter: Readonly<{ consumingProjectBuildingMode: ConsumingProjectBuildingModes; }>
    ): boolean =>
        compoundParameter.consumingProjectBuildingMode !== ConsumingProjectBuildingModes.staticPreview &&
        compoundParameter.consumingProjectBuildingMode !== ConsumingProjectBuildingModes.localDevelopment,
    contentHashPostfixSeparator: "--"
  },

  linting: {
    mustExecute: true
  },

  logging: {

    filesPaths: true,
    filesCount: false,
    partialFilesAndParentEntryPointsCorrespondence: false,
    filesWatcherEvents: true,

    linting: {
      starting: true,
      completionWithoutIssues: true
    }

  }

};


export default StylesProcessingSettings__Default;
