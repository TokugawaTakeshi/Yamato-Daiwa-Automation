# Common settings 

```yaml
projectBuilding:

  common: # Common settings going here (see schema and examples below)
```

## Schema 

```typescript
type ProjectBuildingCommonSettings__FromFile__RawValid = Readonly<{
  selectiveExecutions?: ProjectBuildingCommonSettings__FromFile__RawValid.SelectiveExecutions;
  publicDirectoriesRelativePaths?: Readonly<{ [projectBuildingMode__possiblyCustom: string ]: string | undefined; }>;
}>;

namespace ProjectBuildingCommonSettings__FromFile__RawValid {

  export type SelectiveExecutions = Readonly<{ [selectiveExecutionID: string]: SelectiveExecution | undefined; }>;

  export type SelectiveExecution = Readonly<{
    tasksAndSourceFilesSelection: ProjectBuilderTasksAndSourceFilesSelection;
    browserLiveReloadingSetupID?: string;
  }>;

  type ProjectBuilderTasksAndSourceFilesSelection = Readonly<{
    [ProjectBuildingTasksIDsForConfigFile.markupProcessing]?: ReadonlyArray<string>;
    [ProjectBuildingTasksIDsForConfigFile.stylesProcessing]?: ReadonlyArray<string>;
    [ProjectBuildingTasksIDsForConfigFile.ECMA_ScriptLogicProcessing]?: ReadonlyArray<string>;
    [ProjectBuildingTasksIDsForConfigFile.imagesProcessing]?: ReadonlyArray<string>;
    [ProjectBuildingTasksIDsForConfigFile.fontsProcessing]?: ReadonlyArray<string>;
    [ProjectBuildingTasksIDsForConfigFile.audiosProcessing]?: ReadonlyArray<string>;
    [ProjectBuildingTasksIDsForConfigFile.videosProcessing]?: ReadonlyArray<string>;
    [ProjectBuildingTasksIDsForConfigFile.plainCopying]?: ReadonlyArray<string>;
  }>;
  
}
```

## Quick Example

```yaml
projectBuilding:

  # === Common settings ================================================================================================
  common:

    selectiveExecutions:
      
      MixinParametersValidator:  # Selective execution name (intended to be used in the console commands)

        # Specify setups' ID's for each task which will be executed in current selective execution
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
  
      TESTING: 02-TestingBuild/public
      PRODUCTION: 03-ProductionBuild/public
  # ====================================================================================================================
```


## Description

### `selectiveExecutions` - selective executions

<dl>

  <dt>Type</dt>
  <dd>Associative array-like object</dd>

  <dt>Is required</dt>
  <dd>No</dd>

  <dt>Value schema<dt>
  <dd><pre><code>
{
  tasksAndSourceFilesSelection: ProjectBuilderTasksAndSourceFilesSelection;
  browserLiveReloadingSetupID?: string;
}
  </code></pre></dd>

</dl>

The definition of [selective executions](../../../Terminology/Terminology.english.md#selective-execution) via associative array.

The key is the name (ID) of **selective execution**; the value is the object including specified **tasks** and 
  **resources groups**, and also the ID of **browser live reloading** preset if this functionality required.


```yaml
projectBuilding:

  # === Common settings ================================================================================================
  common:

    selectiveExecutions:
      
      SelectiveExecution1:
        tasksAndSourceFilesSelection: # See below
        browserLiveReloadingSetupID: # See below
        
      SelectiveExecution2:
        tasksAndSourceFilesSelection: # See below
```

#### `tasksAndSourceFilesSelection`

<dl>

  <dt>Type</dt>
  <dd>Object</dd>

  <dt>Is required</dt>
  <dd>Yes</dd>

  <dt>Schema<dt>
  <dd><pre><code>
{
  markupProcessing?: ReadonlyArray&lt;string&gt;
  stylesProcessing?: ReadonlyArray&lt;string&gt;
  ECMA_ScriptLogicProcessing?: ReadonlyArray&lt;string&gt;
  imagesProcessing?: ReadonlyArray&lt;string&gt;
  fontsProcessing?: ReadonlyArray&lt;string&gt;
  audiosProcessing?: ReadonlyArray&lt;string&gt;
  videosProcessing?: ReadonlyArray&lt;string&gt;
  plainCopying?: ReadonlyArray&lt;string&gt;
}
  </code></pre></dd>

</dl>

The objects where keys are the tasks names:

* markupProcessing
* stylesProcessing
* ECMA_ScriptLogicProcessing
* imagesProcessing
* fontsProcessing
* audiosProcessing
* videosProcessing
* plainCopying

The values are the arrays with **entry points groups IDs** or **assets groups IDs**:

```yaml
projectBuilding:

  # === Common settings ================================================================================================
  common:

    selectiveExecutions:
      
      SelectiveExecution1:

        markupProcessing: [ MarkupEntryPointsGroup1, MarkupEntryPointsGroup2 ]
        stylusProcessing: [ StylesEntryPointsGroup1, StylesEntryPointsGroup2 ]
```

These groups must be defined in appropriate tasks configurations.

Once selective execution has been defines, this selective execution could be referred from the console command:

```bash
yda build --selectiveExecution SelectiveExecution1 --mode DEVELOPMENT
```


#### `browserLiveReloadingSetupID`

<dl>

  <dt>Type</dt>
  <dd>String</dd>

  <dt>Is required</dt>
  <dd>No</dd>

</dl>

The ID of browser live reloading setup which must be defined in 
[browser live reloading task configuration](../BrowserLiveReloading/BrowserLiveReloading.english.md).


### `publicDirectoriesRelativePaths`

<dl>

  <dt>Type</dt>
  <dd>Associative array-like object</dd>

  <dt>Is required</dt>
  <dd>No</dd>

  <dt>Allowed keys</dt>
  <dd>
    <ul>
      <li><code>LOCAL_DEVELOPMENT</code></li>
      <li><code>TESTING</code></li>
      <li><code>STAGING</code></li>
      <li><code>PRODUCTION</code></li>
    </ul>
  </dd>

  <dt>Value</dt>
  <dd>String; must be the valid directory path relative to project root</dd>

</dl>

Currently, the **public directory** is required for 
  [building of absolute paths to resources files](../../../Functionality/Shared/ResourcesPathsResolving/ResourcesPathsResolving.english.md).

```yaml
projectBuilding:

  commonSettings:

    publicDirectoriesRelativePaths:

      LOCAL_DEVELOPMENT: 03-LocalDevelopmentBuild/public
      TESTING: 04-TestingBuild/public
      STAGING: 05-StagingBuild/public
      PRODUCTION: 06-ProductionBuild/public
```


## Typical example

Below common settings are for the full-stack application with 
  [static preview](https://github.com/TokugawaTakeshi/Yamato-Daiwa-Frontend/blob/master/CoreLibrary/Package/Documentation/PagesTemplates/StaticPreviewAnywherePage/StaticPreviewAnywherePage.md#the-concept-of-static-preview) 
and interactive implementation.

Note that to get it work it also required to set up each task which will be explained in dedicated sections. 

```yaml
projectBuilding:

  commonSettings:

    selectiveExecutions:

      StaticPreview:

        tasksAndSourceFilesSelection:

          markupProcessing: [ StaticPreview, Pages ]
          stylesProcessing: [ AllStylesForStaticPreview ]

        browserLiveReloadingSetupID: StaticPreview

      Application:

        tasksAndSourceFilesSelection:

          markupProcessing: [ SingePageApplicationEntryPoint ]
          stylesProcessing: [ SharedStylesForApplication ]
          ECMA_ScriptLogicProcessing: [ ClientEntryPoint, FrontServerEntryPoint ]

        browserLiveReloadingSetupID: Application

    publicDirectoriesRelativePaths:

      LOCAL_DEVELOPMENT: 03-LocalDevelopmentBuild/public
      TESTING: 04-TestingBuild/public
      STAGING: 05-StagingBuild/public
      PRODUCTION: 06-ProductionBuild/public
  
  # ... The definitions of other tasks ... 
```

For the **static preview** stage, the essentials are the **markup processing**, **styles processing** and **browser live reloading**.
In advanced example, it could be also the images processing, fonts processing etc.

* The markup processing is including the processing of markup file for each page.
* For the static preview stage, the single stylesheet for the all pages is fine.
* The browser live reloading is opening the top page of the **static preview** (see [Static Preview Anywhere Page](https://github.com/TokugawaTakeshi/Yamato-Daiwa-Frontend/blob/master/CoreLibrary/Package/Documentation/PagesTemplates/StaticPreviewAnywherePage/StaticPreviewAnywherePage.md))
  and then reloading the browser when output files will change.

Now, the building of the static preview could be executed by

```
yda build --selectiveExecution StaticPreview --mode STATIC_PREVIEW
```

For the interactive application stage (**LOCAL_DEVELOPMENT** mode and other),

* If it uses the frameworks like Vue, most likely it will be enough to process just the sole markup file (usually **index.html**)
  among markup processing task. The processing of Pug templates inside Vue single file components is not lies inside
  markup processing task.
* The gathering of all styles in single output CSS file is the simple approach, but has the performance impact.
  Conversely, the creating of separate stylesheet with used functionality only for each route of Single Page Application 
  could take a lot of time in both development and maintenance stages. 
  The compromise is process the common stylesheet (global styles, reusable components, etc.) to separate file
  (the **SharedStylesForApplication** group in example above), while individual page styles should be 
  [loaded on demand](https://webpack.js.org/guides/code-splitting/#dynamic-imports). 
  Also, the styles created on **static preview stage** are fully reusable on interactive application stage.
* Because this example is for the full-stack application (Single Page Application on client side), among ECMAScript 
  processing task, the **client entry point** and **front server entry point** (AKA "server entry point" or "back-end entry point" but
  these terms could be ambiguous for multiple servers and/or complicated infrastructure case) must be processed.
* Unlike the browser live reloading setup for the static preview, the setup for local development building mode
  using different initial HTML file. Herewith, no browser live loading required for any other building modes.

Finally, to make the [resources references](../../../Functionality/Shared/ResourcesPathsResolving/ResourcesPathsResolving.english.md)
  resolvable to absolute paths, we need to specify the `publicDirectoriesRelativePaths` for all modes excpt
  static preview one.

Now, the local development building of the interactive application could be executed as

```
yda build --selectiveExecution Application --mode DEVELOPMENT
```

Similarly, for **TESTING**, **STAGING** and **PRODUCTION** modes, however in these cases the project will be just built
  without rebuilding on source files updating and browser live relosing.

