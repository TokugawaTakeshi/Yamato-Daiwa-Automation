# Browser live reloading
## Schema

```typescript
type BrowserLiveReloadingSettings__FromFile__RawValid = {
  [setupID: string]: {
    targetFilesRootDirectoryRelativePath: string;
    customStartingFilenameWithExtension?: string;
    waitingForTheOtherFilesWillUpdateDuration__seconds?: number;
    useHTTPS?: boolean;
    virtualHost?: string;
    ports?: {
      main?: number;
      userInterface?: number;
    };
    ignoredFilesAndDirectories?: Array<string>;
  };
};
```
