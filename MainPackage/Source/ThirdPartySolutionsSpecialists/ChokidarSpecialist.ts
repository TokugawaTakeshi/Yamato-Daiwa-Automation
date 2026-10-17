class ChokidarSpecialist {

  public static getEventNameInterpretation(eventName: string): string {

    /* eslint-disable @typescript-eslint/no-unsafe-enum-comparison --
    * The enum has been created according to documentation. */
    switch (eventName) {

      case ChokidarSpecialist.EventsNames.fileAdded:
        return "File has been added";

      case ChokidarSpecialist.EventsNames.fileChanged:
        return "File has changed";

      case ChokidarSpecialist.EventsNames.fileDeleted:
        return "File has been deleted";

      case ChokidarSpecialist.EventsNames.directoryAdded:
        return "Directory has been added";

      case ChokidarSpecialist.EventsNames.directoryDeleted:
        return "Directory has been deleted";

      case ChokidarSpecialist.EventsNames.errorOccurred:
        return "Error has occurred";

      case ChokidarSpecialist.EventsNames.initialScanComplete:
        return "Initial scan complete";

      /* eslint-enable @typescript-eslint/no-unsafe-enum-comparison */

      default: return eventName;

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

}


export default ChokidarSpecialist;
