import ConsumingProjectPreDefinedBuildingModes from
    "@ProjectBuilding:Common/Defaults/ConsumingProjectPreDefinedBuildingModes";


export default {
  waitingForSubsequentFilesWillBeSavedPeriod__seconds: 1,
  filePathAliasNotation: "@",
  revisioning: {
    mustExecute: (projectBuildingMode__possiblyCustom: string): boolean =>
        projectBuildingMode__possiblyCustom !== ConsumingProjectPreDefinedBuildingModes.staticPreview &&
        projectBuildingMode__possiblyCustom !== ConsumingProjectPreDefinedBuildingModes.development,
    contentHashPostfixSeparator: "--"
  },
  linting: {
    mustExecute: false,
    isDisabledForEntryPointGroups: false
  }
};
