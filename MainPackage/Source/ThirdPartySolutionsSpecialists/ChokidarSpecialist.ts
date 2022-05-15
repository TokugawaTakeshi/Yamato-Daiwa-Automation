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

  export function getEventNameInterpretation(eventName: string): string {
    switch (eventName) {
      case EventsNames.fileAdded: return "File added";
      case EventsNames.fileChanged: return "File changed";
      case EventsNames.fileDeleted: return "File deleted";
      case EventsNames.directoryAdded: return "Directory added";
      case EventsNames.directoryDeleted: return "Directory deleted";
      case EventsNames.errorOccurred: return "Error occurred";
      case EventsNames.initialScanComplete: return "Initial scan complete";
      default: return eventName;
    }
  }
}


export default ChokidarSpecialist;
