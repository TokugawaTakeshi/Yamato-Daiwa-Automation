# Common settings

## Schema 

```typescript
type ProjectBuildingCommonSettings__FromFile__RawValid = {
  selectiveExecutions?: { 
    [selectiveExecutionID: string]: {
      tasksAndSourceFilesSelection: {
        markupProcessing?: Array<string>;
        stylesProcessing?: Array<string>;
        ECMA_ScriptLogicProcessing?: Array<string>;
        imagesProcessing?: Array<string>;
        fontsProcessing?: Array<string>;
        audiosProcessing?: Array<string>;
        videosProcessing?: Array<string>;
      };
      browserLiveReloadingSetupID?: string;
    } | undefined; 
  };
  publicDirectoriesRelativePaths?: { [projectBuildingMode__possiblyCustom: string ]: string | undefined; };
};
```

## Example

```yaml
projectBuilding:

  # === Common settings ================================================================================================
  common:

    selectiveExecutions:
      
      MixinParametersValidator:  # Selective execution name (intended to be used in console commands)

        # Specify setups' ID's for each task will be executed in current selective execution
        tasksAndSourceFilesSelection:
          ECMA_ScriptLogicProcessing: [ MixinParametersValidator ]

      StylesAndComponentsTesting:

        tasksAndSourceFilesSelection:
          markupProcessing: [ StylesAndComponentsTesting ]
          stylesProcessing: [ StylesAndComponentsTesting ]
          ECMA_ScriptLogicProcessing: [ StylesAndComponentsTesting ]

        # If browser live reloading wanted for this selective execution, refer to it's ID
        browserLiveReloadingSetupID: StylesAndComponentsTesting

      StaticPreviewAnywherePage:
        
        tasksAndSourceFilesSelection:
          stylesProcessing: [ StaticPreviewAnywherePage ]

    publicDirectoriesRelativePaths:
  
      TESTING: 02-TestingBuild
      PRODUCTION: 03-ProductionBuild
  # ====================================================================================================================
```
