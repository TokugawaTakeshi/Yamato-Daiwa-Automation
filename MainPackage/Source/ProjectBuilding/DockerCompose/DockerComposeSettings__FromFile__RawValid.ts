import {
  RawObjectDataProcessor,
  lowercaseLatinCharacters,
  stringifiedDigits
} from "@yamato-daiwa/es-extensions";


type DockerComposeSettings__FromFile__RawValid = Readonly<{
  [setupID: string]: DockerComposeSettings__FromFile__RawValid.Setup;
}>;


namespace DockerComposeSettings__FromFile__RawValid {

  /* ━━━ Types ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type Setup = {
    composingOptions: ComposingOptions;
    upOptions: Readonly<UpOptions>;
  };

  export type ComposingOptions = Readonly<{
    projectName?: string;
    composeFileNameWithExtension?: string;
    environmentFileNameWithExtensions?: string;
  }>;

  export type UpOptions = Readonly<{
    mustAlwaysBuildImagesBeforeStarting?: boolean;
  }>;


  /* ━━━ Properties Specification ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export const propertiesSpecification: RawObjectDataProcessor.AssociativeArrayValueSpecification = {

    type: RawObjectDataProcessor.ValuesTypesIDs.associativeArray,
    areUndefinedTypeValuesForbidden: true,
    areNullTypeValuesForbidden: true,

    value: {

      type: Object,
      properties: {

        $composingOptions: {

          newName: "composingOptions",
          type: Object,
          isUndefinedForbidden: true,
          isNullForbidden: true,

          properties: {

            $projectName: {

              newName: "projectName",
              type: String,
              isUndefinedForbidden: false,
              isNullForbidden: true,
              minimalCharactersCount: 1,

              /* [ Reference ] https://docs.docker.com/compose/how-tos/project-name/#set-a-project-name */
              allowedCharacters: new Set([
                ...lowercaseLatinCharacters,
                ...stringifiedDigits,
                "-",
                "_"
              ])

            },

            $composeFileNameWithExtension: {
              newName: "composeFileNameWithExtension",
              type: String,
              isUndefinedForbidden: false,
              isNullForbidden: true,
              minimalCharactersCount: 1
            },

            $environmentFileNameWithExtensions: {
              newName: "environmentFileNameWithExtensions",
              type: String,
              isUndefinedForbidden: false,
              isNullForbidden: true,
              minimalCharactersCount: 1
            }

          }

        },

        $upOptions: {

          newName: "upOptions",
          type: Object,

          isUndefinedForbidden: true,
          isNullForbidden: true,

          properties: {

            $mustAlwaysBuildImagesBeforeStarting: {
              newName: "mustAlwaysBuildImagesBeforeStarting",
              type: Boolean,
              isUndefinedForbidden: false,
              isNullForbidden: true
            }

          }

        }

      }

    }

  };

}


export default DockerComposeSettings__FromFile__RawValid;
