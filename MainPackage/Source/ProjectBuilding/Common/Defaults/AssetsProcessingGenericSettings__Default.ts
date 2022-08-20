import ConsumingProjectPreDefinedBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectPreDefinedBuildingModes";


export default {
  revisioning: {
    mustExecute: (projectBuildingMode__possiblyCustom: string): boolean =>
        projectBuildingMode__possiblyCustom !== ConsumingProjectPreDefinedBuildingModes.staticPreview &&
        projectBuildingMode__possiblyCustom !== ConsumingProjectPreDefinedBuildingModes.localDevelopment,
    contentHashPostfixSeparator: "--"
  }
};
