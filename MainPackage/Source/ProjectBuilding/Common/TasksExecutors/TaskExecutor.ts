import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";


export default abstract class TaskExecutor {

  protected abstract TASK_NAME_FOR_LOGGING: string;

  protected readonly masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative;


  protected constructor(masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative) {
    this.masterConfigRepresentative = masterConfigRepresentative;
  }
}
