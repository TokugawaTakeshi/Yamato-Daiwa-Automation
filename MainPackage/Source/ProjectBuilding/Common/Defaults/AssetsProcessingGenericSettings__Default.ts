import ConsumingProjectBuildingModes from
      "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";


export default {
  revisioning: {
    mustExecute: (
      { consumingProjectBuildingMode }: Readonly<{ consumingProjectBuildingMode: ConsumingProjectBuildingModes; }>
    ): boolean =>
        consumingProjectBuildingMode !== ConsumingProjectBuildingModes.staticPreview &&
        consumingProjectBuildingMode !== ConsumingProjectBuildingModes.localDevelopment,
    contentHashPostfixSeparator: "--"
  }
};
