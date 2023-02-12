import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";
import { isUndefined } from "../../../../../YamatoDaiwaES_Extensions/CoreLibrary/Package";
import createImmediatelyEndingEmptyStream from "@Utils/createImmediatelyEndingEmptyStream";


export default class PlainCopier {

  public static providePlainCopierIfMust(
    masterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): () => NodeJS.ReadWriteStream {

    if (isUndefined(masterConfigRepresentative.plainCopyingSettingsRepresentative)) {
      return createImmediatelyEndingEmptyStream();
    }


    return createImmediatelyEndingEmptyStream();

  }

}
