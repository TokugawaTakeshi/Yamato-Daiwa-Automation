/* ─── Restrictions ───────────────────────────────────────────────────────────────────────────────────────────────── */
import type ConsumingProjectBuildingModes from
      "@ProjectBuilding/Common/Restrictions/ConsumingProjectBuildingModes";

/* ─── Raw Valid Settings ─────────────────────────────────────────────────────────────────────────────────────────── */
import type RevisioningSettings__FromFile__RawValid from
    "@ProjectBuilding/Common/RawConfig/Reusables/RevisioningSettings__FromFile__RawValid";

/* ─── Normalized Settings ────────────────────────────────────────────────────────────────────────────────────────── */
import type RevisioningSettings__Normalized
  from "@ProjectBuilding/Common/NormalizedConfig/Reusables/RevisioningSettings__Normalized";


export default abstract class RevisioningSettingsNormalizer {

  public static normalize(
    {
      revisioningSettings__rawValid,
      revisioningSettings__default,
      consumingProjectBuildingMode
    }: Readonly<{
      revisioningSettings__rawValid?: RevisioningSettings__FromFile__RawValid;
      revisioningSettings__default: Readonly<{
        mustExecute: (
          compoundParameter: Readonly<{ consumingProjectBuildingMode: ConsumingProjectBuildingModes; }>
        ) => boolean;
        contentHashPostfixSeparator: string;
      }>;
      consumingProjectBuildingMode: ConsumingProjectBuildingModes;
    }>
  ): RevisioningSettings__Normalized {
    return {

      mustExecute:
          revisioningSettings__rawValid?.disable === true ? false :
              revisioningSettings__default.mustExecute({ consumingProjectBuildingMode }),

      contentHashPostfixSeparator:
          revisioningSettings__rawValid?.contentHashPostfixSeparator ??
          revisioningSettings__default.contentHashPostfixSeparator

    };
  }

}
