import type { RawObjectDataProcessor } from "@yamato-daiwa/es-extensions";


type FilesWatchingSettings__FromFile__RawValid = Readonly<{
  relativePathsOfExcludeFiles?: ReadonlyArray<string>;
  relativePathsOfExcludeDirectories?: ReadonlyArray<string>;
}>;


namespace FilesWatchingSettings__FromFile__RawValid {

  export type Localization = Readonly<{
    relativePathsOfExcludeFiles: Readonly<{ KEY: string; }>;
    relativePathsOfExcludeDirectories: Readonly<{ KEY: string; }>;
  }>;

  export function getLocalizedPropertiesSpecification(
    filesWatchingSettingsLocalization: Localization
  ): RawObjectDataProcessor.PropertiesSpecification {

    return {

      [filesWatchingSettingsLocalization.relativePathsOfExcludeFiles.KEY]: {

        newName: "relativePathsOfExcludeFiles",
        type: Array,
        required: false,

        element: {
          type: String,
          minimalCharactersCount: 1
        }

      },

      [filesWatchingSettingsLocalization.relativePathsOfExcludeDirectories.KEY]: {

        newName: "relativePathsOfExcludeDirectories",
        type: Array,
        required: false,

        element: {
          type: String,
          minimalCharactersCount: 1
        }

      }

    };

  }

}


export default FilesWatchingSettings__FromFile__RawValid;
