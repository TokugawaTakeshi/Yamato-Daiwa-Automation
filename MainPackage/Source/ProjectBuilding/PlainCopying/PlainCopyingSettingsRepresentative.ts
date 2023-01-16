import type PlainCopyingSettings__Normalized from "@ProjectBuilding/PlainCopying/PlainCopyingSettings__Normalized";


export default class PlainCopyingSettingsRepresentative {

  public readonly filesGroups: Readonly<{ [groupID: string]: PlainCopyingSettings__Normalized.FilesGroup; }>;


  public constructor(plainCopyingSettings__normalized: PlainCopyingSettings__Normalized) {
    this.filesGroups = plainCopyingSettings__normalized.filesGroups;
  }

}
