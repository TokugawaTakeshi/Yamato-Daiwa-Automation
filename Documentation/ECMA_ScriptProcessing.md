# ECMAScript logic processing

## Schema

```typescript
type ECMA_ScriptLogicProcessingSettings__FromFile__RawValid = {

  common?: {
    directoriesRelativePathsAliases?: { [alias: string]: string; };
  }

  linting?: {
    presetFileRelativePath?: string;
    disableCompletely?: boolean;
  }

  entryPointsGroups: {
    
    [groupID: string]: {

      entryPointsSourceFilesTopDirectoryOrSingleFileRelativePath: string;
      targetRuntime: (
        {
          type: Types.browser;
        } |
        {
          type: Types.webWorker;
        } |
        {
          type: Types.nodeJS;
          minimalVersion: {
            major: number;
            minor?: number;
          };
        }
      );

      entryPointsSourceFilesTopDirectoryOrSingleFilePathAliasNameForReferencingFromHTML?: string;
      associatedMarkupEntryPointsGroupID_ForModulesDynamicLoadingWithoutDevelopmentServer?: string;
      typeScriptConfigurationFileRelativePath?: string;

      linting?: {
        disable?: boolean;
      };

      buildingModeDependent: {
        [projectBuildingMode: string]: {
          
          outputBaseDirectoryRelativePath: string;
          
          revisioning: {
            disable?: boolean;
            contentHashPostfixSeparator?: string;
          }

          dynamicallyLoadedFilesSubdirectory?: string;
          dynamicallyLoadedFilesNamesTemplate?: string;
        };
      };
    }
  }
} 
```
