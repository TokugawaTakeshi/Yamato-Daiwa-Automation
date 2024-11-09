/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type OutputPackageJSON_GeneratingSettings__Normalized from
    "@ProjectBuilding/OutputPackageJSON_Generating/OutputPackageJSON_GeneratingSettings__Normalized";

/* ─── Settings Representatives ───────────────────────────────────────────────────────────────────────────────────── */
import type ProjectBuildingMasterConfigRepresentative from "@ProjectBuilding/ProjectBuildingMasterConfigRepresentative";

/* ─── General Utils ──────────────────────────────────────────────────────────────────────────────────────────────── */
import FileSystem from "fs";
import { isUndefined } from "@yamato-daiwa/es-extensions";
import replaceLinesSeparators from "@UtilsIncubator/Strings/replaceLinesSeparators";


export default class OutputPackageJSON_Generator {

  public static generateIfMust(
    projectBuildingMasterConfigRepresentative: ProjectBuildingMasterConfigRepresentative
  ): () => Promise<void> {

    if (isUndefined(projectBuildingMasterConfigRepresentative.outputPackageJSON_GeneratingSettingsRepresentative)) {
      return async (): Promise<void> => Promise.resolve();
    }


    const { outputPackageJSON_GeneratingSettingsRepresentative }: ProjectBuildingMasterConfigRepresentative =
        projectBuildingMasterConfigRepresentative;

    return async (): Promise<void> => OutputPackageJSON_Generator.generate(
      outputPackageJSON_GeneratingSettingsRepresentative.outputPackageJSON_GeneratingSettings
    );

  }


  private static async generate(
    {
      outputFileAbsolutePath,
      dependencies,
      developmentDependencies,
      scripts,
      indentString,
      linesSeparator
    }: OutputPackageJSON_GeneratingSettings__Normalized
  ): Promise<void> {

    FileSystem.writeFileSync(
      outputFileAbsolutePath,
      replaceLinesSeparators(
        JSON.stringify(
          {
            private: true,
            dependencies,
            devDependencies: developmentDependencies,
            scripts
          },
          null,
          indentString
        ),
        linesSeparator
      )
    );

    return Promise.resolve();

  }

}
