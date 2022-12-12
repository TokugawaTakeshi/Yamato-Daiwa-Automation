# ECMAScript logic processing

## Schema

```typescript
type ECMA_ScriptLogicProcessingSettings__FromFile__RawValid = {

  common?: {
    directoriesRelativePathsAliases?: { [directoryAlias: string]: string; };
  }

  linting?: {
    presetFileRelativePath?: string;
    enable?: boolean;
  }

  entryPointsGroups: {
    
    [groupID: string]:
        
        (
          {
            topDirectoryRelativePath: string;
            partialsRecognition?: {
              excludeAllSubdirectories?: boolean;
              excludeSubdirectoriesWithNames?: Array<string> | string;
              excludeSubdirectoriesWithPrefixes?: Array<string> | string;
              excludeFilesWithPrefixes?: Array<string> | string;
            };
          } | {
            singleEntryPointRelativePath: string;
          }
        ) &

        {
          
          targetRuntime: (
            { type: "BROWSER" } |
            { type: "WEB_WORKER" } |
            {
              type: "NODEJS";
              minimalVersion: {
                major: number;
                minor?: number;
              };
            } |
            { type: "PUG" }
          );

          entryPointsSourceFilesTopDirectoryOrSingleFilePathAliasNameForReferencingFromHTML?: string;
          associatedMarkupEntryPointsGroupID_ForModulesDynamicLoadingWithoutDevelopmentServer?: string;
          typeScriptConfigurationFileRelativePath?: string;

          distributing?: {
            exposingOfExportsFromEntryPoints: {
              mustExpose: boolean;
              namespace?: string;
            };
            typeScriptTypesDeclarations: {
              mustGenerate?: boolean;
              fileNameWithoutExtension?: string;
            };
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


## `common` - Common settings

<dl>
  <dt>Type</dt>
  <dd>object</dd>
  <dt>Is required</dt>
  <dd>No</dd>
</dl>


### `directoriesRelativePathsAliases`

**!!! This feature will be removed in next minor version; path aliases will be automatically picked from the tsconfig.json !!!**

<dl>
  <dt>Type</dt>
  <dd>Associative array-like object</dd>
  <dt>Required</dt>
  <dd>Yes</dd>
  <dt>Key</dt>
  <dd>Alias name</dd>
  <dt>Value</dt>
  <dd>String; relative to project root directory path</dd>
</dl>

```yaml
projectBuilding:
  
  # ...
  
  ECMA_ScriptLogicProcessing:

    common:

      directoriesRelativePathsAliases:

        "@Entities": "01-Source/CommonSolution/Entities"
        "@Gateways": "01-Source/CommonSolution/Gateways"
        "@Client": "01-Source/Implementation/Elements/Client"
        "@MockDataSource": "01-Source/Implementation/Elements/MockDataSource"
        "@Interactions": "01-Source/Implementation/Interactions"
        "@Utils": "01-Source/Utils"
```

We are sorry, but in current version the duplicating in **tsconfig.json** is required.
This routine will be removed in next minor version.

For above example, the declarations at **tsconfig.json** will be:

```json5
{
  "compilerOptions": {

    /* ... */

    "baseUrl": "./01-Source",
    "paths": {
      "@Entities/*": [ "./CommonSolution/Entities/*"],
      "@Gateways/*": [ "./CommonSolution/Gateways/*"],
      "@Client/*": [ "./Implementation/Elements/Client/*"],
      "@MockDataSource/*": [ "./Implementation/Elements/MockDataSource/*"],
      "@Interactions/*": [ "./Implementation/Interactions/*" ],
      "@Utils/*": [ "./Utils/*"]
    }
  }
}

```

## `linting` - ECMAScript logic source code linting settings

<dl>
  <dt>Type</dt>
  <dd>object</dd>
  <dt>Is required</dt>
  <dd>No</dd>
</dl>


The **linting** is the automatic check of the compliance of the source code with guidelines established in development team.
**YDA** using the [ESLint](https://eslint.org) linter.


### `presetFileRelativePath` - Relative path of "ESLint" configuration file

<dl>
  <dt>Type</dt>
  <dd>string</dd>
  <dt>Is required</dt>
  <dd>No</dd>
  <dt>Note</dt> 
  <dd>Must be the valid path relative to project root; neither leading not trailing slashes required.</dd>
  <dt>Example</dt> 
  <dd><code>Settings/ECMAScript.js</code></dd>
</dl>


### `enable` - Enabling/disabling of ECMAScript source code linting

<dl>
  <dt>Type</dt>
  <dd>boolean</dd>
  <dt>Default value</dt>
  <dd>true</dd>
</dl>

In high-quality web development for which **YDA** is intended to be used the linting is de-facto required tool.
However, this option has been added because of foresight of complaints about unable of disabling the linting.


## `entryPointsGroups` - Entry point group dependent settings

<dl>
  <dt>Type</dt>
  <dd>Associative array-like object</dd>
  <dt>Is required</dt>
  <dd>No</dd>
  <dt>Minimal entries count</dt>
  <dd>1</dd>
  <dt>Value type</dt>
  <dd>object</dd>
</dl>

* The keys are the entry point group name.
* The object-type values has the following properties.


### `topDirectoryRelativePath` - Top directory relative path for multiple entry points group

<dl>
  <dt>Type</dt>
  <dd>string</dd>
  <dt>Required if</dt>
  <dd>Group includes the arbitrary number of entry points</dd>
  <dt>Minimal characters count</dt>
  <dd>1</dd>
  <dt>Note</dt>
  <dd>Must be the valid relative path to project root directory; the trailing slash is not required.</dd>
  <dt>Example</dt>
  <dd><code>01-Source/Infrastructure/Elements/Client/Pages</code></dd>
</dl>

The relative path to directory below which entry points will be searched.

```yaml
projectBuilding:

 # ...

  ECMA_ScriptLogicProcessing:

    entryPointsGroups:

      Pages:

        topDirectoryRelativePath: 01-Source/Infrastructure/Elements/Client/Pages
        # ...
```

In above example, the entry points will be searched below "**[Project root directory]**/01-Source/Infrastructure/Elements/Client/Pages"
Looks like the website or Multi Page Application.


### `partialsRecognition` - The strategy of entry points and child files distinction

<dl>
  <dt>Type</dt>
  <dd>object</dd>
  <dt>Is required</dt>
  <dd>No</dd>
  <dt>Must be omitted if</dt>
  <dd>The group is including one explicit entry point</dd>
</dl>

Specifies how to distinguish the **entry points files** (which will be compiled to separate JavaScript files) and
non-entry points files (which will not be compiled independently to entry points).

See [Entry points and children files distinction concept](../Shared/EntryPointsAndChildrenFilesDistinction.md)
  for details.


### `singleEntryPointRelativePath` - The relative path of single entry point group

<dl>
  <dt>Type</dt>
  <dd>string</dd>
  <dt>Required if</dt>
  <dd>Group includes exactly one entry point</dd>
  <dt>Note</dt>
  <dd>Must be the valid relative path file; the file name extension is required.</dd>
  <dt>Example</dt>
  <dd><code>01-Source/Infrastructure/Elements/FrontServer/FrontServerEntryPoint.ts</code></dd>
</dl>

The relative path of exactly one entry point in group (to file of `.ts` extension).

```yaml
projectBuilding:

 # ...

  ECMA_ScriptLogicProcessing:

    entryPointsGroups:

      FrontServer:

        topDirectoryRelativePath: 01-Source/Infrastructure/Elements/FrontServer/FrontServerEntryPoint.ts
        # ...
```


### `targetRuntime`

<dl>
  <dt>Type</dt>
  <dd>object</dd>
  <dt>Is required</dt>
  <dd>yes</dd>
</dl>

The runtime by which the compiled JavaScript file will be executed.
Currently, below runtimes are available:

<dl>

  <dt>BROWSER</dt>
  <dd>Actual developing for websites and browser applications.</dd>

  <dt>NODEJS</dt>
  <dd>Actual for server and console applications.</dd>

  <dt>WEB_WORKER</dt>
  <dd>
    Actual for developing for websites and browser applications.
    <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers">
      Learn more about Web workers
    </a>
  </dd>
  <dt>PUG</dt>
  <dd>Useful if required to provide some JavaScript functionality written by TypeScript to Pug pre-processor.</dd>
</dl>

Currently, only **NODEJS** requires the options and that it the minimal version (only major one is required):

```yaml
projectBuilding:

  # ...
  ECMA_ScriptLogicProcessing:
    
    entryPointsGroups:

      FrontServerEntryPoint:

        singleEntryPointRelativePath: 01-Source/Implementation/Elements/FrontServer/FrontServerEntryPoint.ts

        targetRuntime:
          type: NODEJS
          minimalVersion:
            major: 16
            minor: 14
```



### `buildingModeDependent` - The settings dependent on project building mode
#### `outputTopDirectoryRelativePath`

<dl>
  <dt>Type</dt>
  <dd>string</dd>
  <dt>Is required</dt>
  <dd>yes</dd>
</dl>

The top directory where the compiled JavaScript files will be output.
The "top" means that path of target entry point relative to `topDirectoryRelativePath` will be kept and appended to
  `outputBaseDirectoryRelativePath`.
For example, if `topDirectoryRelativePath` is `Pages` and file is `Top/TopPage.ts`,
  the compiled `TopPage.js` will be put to `[outputBaseDirectoryRelativePath]/Top`,
  not to root `[outputBaseDirectoryRelativePath]`.
