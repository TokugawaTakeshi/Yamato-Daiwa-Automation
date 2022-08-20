import type { InheritEnumerationKeys } from "@yamato-daiwa/es-extensions";
import ChokidarSpecialistLocalization__English from
    "@ThirdPartySolutionsSpecialists/Chokidar/ChokidarSpecialistLocalization.english";


class ChokidarSpecialist {

  public static localization: ChokidarSpecialist.Localization = ChokidarSpecialistLocalization__English;

  public static getEventNameInterpretation(eventName: string): string {

    switch (eventName) {

      case ChokidarSpecialist.EventsNames.fileAdded:
        return ChokidarSpecialist.localization.eventsNamesInterpretations.fileAdded;

      case ChokidarSpecialist.EventsNames.fileChanged:
        return ChokidarSpecialist.localization.eventsNamesInterpretations.fileChanged;

      case ChokidarSpecialist.EventsNames.fileDeleted:
        return ChokidarSpecialist.localization.eventsNamesInterpretations.fileDeleted;

      case ChokidarSpecialist.EventsNames.directoryAdded:
        return ChokidarSpecialist.localization.eventsNamesInterpretations.directoryAdded;

      case ChokidarSpecialist.EventsNames.directoryDeleted:
        return ChokidarSpecialist.localization.eventsNamesInterpretations.fileDeleted;

      case ChokidarSpecialist.EventsNames.errorOccurred:
        return ChokidarSpecialist.localization.eventsNamesInterpretations.errorOccurred;

      case ChokidarSpecialist.EventsNames.initialScanComplete:
        return ChokidarSpecialist.localization.eventsNamesInterpretations.initialScanComplete;

      default:
        return eventName;
    }
  }


}

namespace ChokidarSpecialist {

  export enum EventsNames {
    fileAdded = "add",
    fileChanged = "change",
    fileDeleted = "unlink",
    directoryAdded = "addDir",
    directoryDeleted = "unlinkDir",
    errorOccurred = "error",
    initialScanComplete = "ready"
  }

  export type Localization = {
    eventsNamesInterpretations: InheritEnumerationKeys<typeof EventsNames, string>;
  };

}


export default ChokidarSpecialist;

/* eslint-disable-next-line @typescript-eslint/no-unused-vars --
 * It is the only way to extract the child namespace (no need to expose whole MarkupProcessingRawSettingsNormalizer
 * for the localization packages).
 * https://stackoverflow.com/a/73400523/4818123 */
export import ChokidarSpecialistLocalization = ChokidarSpecialist.Localization;
