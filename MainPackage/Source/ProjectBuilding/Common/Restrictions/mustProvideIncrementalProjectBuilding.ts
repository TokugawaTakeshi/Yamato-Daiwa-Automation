import ConsumingProjectBuildingModes from "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";


export default function mustProvideIncrementalProjectBuilding(
  consumingProjectBuildingModes: ConsumingProjectBuildingModes
): boolean {
  return consumingProjectBuildingModes === ConsumingProjectBuildingModes.staticPreview ||
      consumingProjectBuildingModes === ConsumingProjectBuildingModes.localDevelopment;
}
