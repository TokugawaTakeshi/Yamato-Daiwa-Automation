/* --- Enumerations ------------------------------------------------------------------------------------------------- */
import type ConsumingProjectBuildingModes from
    "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";

/* --- Utils -------------------------------------------------------------------------------------------------------- */
import type { InheritEnumerationKeys } from "@yamato-daiwa/es-extensions";


type ConsumingProjectPreDefinedBuildingModes__Localized =
    InheritEnumerationKeys<typeof ConsumingProjectBuildingModes, string>;


export default ConsumingProjectPreDefinedBuildingModes__Localized;
