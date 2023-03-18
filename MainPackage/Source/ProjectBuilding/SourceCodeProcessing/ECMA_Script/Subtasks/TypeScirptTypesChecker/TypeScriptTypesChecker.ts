import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import { isUndefined } from "@yamato-daiwa/es-extensions";
import createImmediatelyEndingEmptyStream from "@Utils/createImmediatelyEndingEmptyStream";


export default class TypeScriptTypesChecker {

  public static provideTypeCheckingIfMust(
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): () => NodeJS.ReadWriteStream {

    if (isUndefined(projectBuildingMasterConfigRepresentative.ECMA_ScriptLogicProcessingSettingsRepresentative)) {
      return createImmediatelyEndingEmptyStream();
    }


    return createImmediatelyEndingEmptyStream();

  }

}
