import ConsumingProjectPreDefinedBuildingModes from "@ProjectBuilding:Common/Defaults/ConsumingProjectPreDefinedBuildingModes";


export default {
  filePathAliasNotation: "@",
  entryPointsGroupDependent: {
    areExportsFromEntryPointsAccessible: false
  },
  revisioning: {
    mustExecute: (projectBuildingMode__possiblyCustom: string): boolean =>
        projectBuildingMode__possiblyCustom !== ConsumingProjectPreDefinedBuildingModes.development,
    contentHashPostfixSeparator: "--"
  },
  linting: {
    mustExecute: false,
    isDisabledForEntryPointGroups: false
  }
};
