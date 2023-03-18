import ConsumingProjectPreDefinedBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectPreDefinedBuildingModes";


const StylesProcessingSettings__Default: Readonly<{

  periodBetweenFileUpdatingAndRebuildingStarting__seconds: number;

  entryPointsGroupReferencePrefix: string;

  revisioning: Readonly<{
    mustExecute: (namedParameters: Readonly<{ consumingProjectBuildingMode: string; }>) => boolean;
    contentHashPostfixSeparator: string;
  }>;

  linting: Readonly<{
    mustExecute: boolean;
  }>;

}> = {

  periodBetweenFileUpdatingAndRebuildingStarting__seconds: 1,

  entryPointsGroupReferencePrefix: "@",

  revisioning: {
    mustExecute: (namedParameters: Readonly<{ consumingProjectBuildingMode: string; }>): boolean =>
        namedParameters.consumingProjectBuildingMode !== ConsumingProjectPreDefinedBuildingModes.staticPreview &&
        namedParameters.consumingProjectBuildingMode !== ConsumingProjectPreDefinedBuildingModes.localDevelopment,
    contentHashPostfixSeparator: "--"
  },

  linting: {
    mustExecute: true
  }

};


export default StylesProcessingSettings__Default;
