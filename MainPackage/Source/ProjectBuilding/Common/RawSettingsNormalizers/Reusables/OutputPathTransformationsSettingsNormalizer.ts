/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import type OutputDirectoryPathTransformationsSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/OutputDirectoryPathTransformationsSettings__FromFile__RawValid";

/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type OutputDirectoryPathTransformationsSettings__Normalized from
    "@ProjectBuilding/Common/NormalizedConfig/Reusables/OutputDirectoryPathTransformationsSettings__Normalized";

/* ─── Utils ──────────────────────────────────────────────────────────────────────────────────────────────────────── */
import { isNotUndefined } from "@yamato-daiwa/es-extensions";


export default abstract class OutputPathTransformationsSettingsNormalizer {

  public static normalize(
    outputPathTransformations__rawValid?: OutputDirectoryPathTransformationsSettings__FromFile__RawValid
  ): OutputDirectoryPathTransformationsSettings__Normalized {

    return {

      segmentsWhichMustBeRemoved: outputPathTransformations__rawValid?.segmentsWhichMustBeRemoved ?? [],

      segmentsWhichLastDuplicatesMustBeRemoved:
          outputPathTransformations__rawValid?.segmentsWhichLastDuplicatesMustBeRemoved ?? [],

      ...isNotUndefined(outputPathTransformations__rawValid?.segmentsCountRelativeToGroupTopDirectoryWhichMustBeRemoved) ?
          {
            segmentsCountRelativeToGroupTopDirectoryWhichMustBeRemoved:
                outputPathTransformations__rawValid.segmentsCountRelativeToGroupTopDirectoryWhichMustBeRemoved
          } : null
    };

  }

}
