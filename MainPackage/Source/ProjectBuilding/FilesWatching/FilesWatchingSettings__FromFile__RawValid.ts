import type { RawObjectDataProcessor } from "@yamato-daiwa/es-extensions";


type FilesWatchingSettings__FromFile__RawValid = Readonly<{
  relativePathsOfExcludeFiles?: ReadonlyArray<string>;
  relativePathsOfExcludeDirectories?: ReadonlyArray<string>;
}>;


namespace FilesWatchingSettings__FromFile__RawValid {

  export const propertiesSpecification: RawObjectDataProcessor.PropertiesSpecification = {

    $relativePathsOfExcludeFiles: {

      newName: "relativePathsOfExcludeFiles",
      type: Array,
      isUndefinedForbidden: false,
      isNullForbidden: true,
      areUndefinedElementsForbidden: true,
      areNullElementsForbidden: true,

      element: {
        type: String,
        minimalCharactersCount: 1
      }

    },

    $relativePathsOfExcludeDirectories: {

      newName: "relativePathsOfExcludeDirectories",
      type: Array,
      isUndefinedForbidden: false,
      isNullForbidden: true,
      areUndefinedElementsForbidden: true,
      areNullElementsForbidden: true,

      element: {
        type: String,
        minimalCharactersCount: 1
      }

    }

  };

}


export default FilesWatchingSettings__FromFile__RawValid;
