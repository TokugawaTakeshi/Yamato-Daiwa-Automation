# Styles processing

## Schema

```typescript
type StylesProcessingSettings__FromFile__RawValid = {
  
  common?: {
    waitingForSubsequentFilesWillBeSavedPeriod__seconds?: number;
  };

  linting?: {
    presetFileRelativePath?: string;
    disableCompletely?: boolean;
  };

  entryPointsGroups: {
    
    [groupID: string]: {

      entryPointsSourceFilesTopDirectoryOrSingleFileRelativePath: string;
      partialsRecognition?: {
         excludeAllSubdirectories?: boolean;
         excludeSubdirectoriesWithNames?: Array<string> | string;
         excludeSubdirectoriesWithPrefixes?: Array<string> | string;
         excludeFilesWithPrefixes?: Array<string> | string;
      };
      entryPointsSourceFilesTopDirectoryOrSingleFilePathAliasNameForReferencingFromHTML?: string;

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
        }
      };
    }
  };
}
```

## Common settings
### waitingForSubsequentFilesWillBeSavedPeriod__seconds

<dl>
  <dt>Type</dt>
  <dd>number</dd>
  <dt>Default value</dt>
  <dd>1</dd>
</dl>

Specifies how many seconds must pass from one styles file will be saved until styles rebuilding will start.

Actual for the saving of all project files at once. Because the detecting of file changes is not instant,
without any delay will be one re-building per one changed file what is the waste of computer's resources.

The default value is enough for the start, but as files quantity will become more, the increasing of default value could
require. The detecting of changes in file and rebuilding are being logged, so consider the increasing of
**waitingForSubsequentFilesWillBeSavedPeriod__seconds** is some files changes still being logged immediately
after rebuilding started.


## Styles linting

**YDA** using [stlint](https://github.com/stylus/stlint#cli) linter because the alternative one - [stylint](https://github.com/SimenB/stylint) -
has been abandoned unfixed critical bugs.

**YDA** supports two linting approaches:

1. The linting of entry point files and their partials (primary method)
2. The linting of specified files (actual for the case when CSS must be bundled with JavaScript without outputting
   to separate CSS files)

Because both approaches does not contradicting (same file will not be checked twice until it will change), 
they could be combined.

Because the usage of linting is usual in high-quality web development for which **YDA** designed for, it is enabled as
default. It is also recommended to use the **Stlint** plugin (available for [IntelliJ IDEA IDEs family](https://github.com/stylus/stlint-idea-plugin) 
and [VSCode](https://marketplace.visualstudio.com/items?itemName=xdan.stlint-vscode-plugin)).


## Configuration

Because **Stlint** plugins from IDEs could not understand the **YDA** config files, we forced to split the config between
**YDA** configuration file and **Styint** file (**.stlintrc**). Why the settings of styles linting could not be fully defined 
in **Stlint** config file is **YDA** as high-level tools takes care about some settings (like reporting and files watching) 
and also gives some extra options.


### YDA configuration

#### Common settings

##### Preset file relative path (stylesProcessing.common.linting.presetFileRelativePath)

The file with **Stlint** config, **<ProjectRoot>/.stlintrc** as default.
If such file will not be found, **YDA** will warn about it because as mentioned above in high quality web development 
for which **YDA** has been designed the enabled by default linting is surely. 
If you don't need the linting, you can disable it by **disableCompletely : true**.


##### Disable completely (stylesProcessing.common.linting.disableCompletely)

Once has been set to **true**, the styles linting will be completely disabled regardless to any other **YDA** config.


#### Entry point group dependent settings

We are not reccomend to make linting config entry point group dependent because

1. The partial files could belong to multiple entry points group; when is this the case the presents conflict could occur.
2. It could be some problems with multiple **Stlint** plugin configuration files.
3. All styles should be written with same guidelines for maintainability.

But we are understand what sometimes could be the extraordinary cases like integration of third-party code with other guidelines.


##### Special preset file relative path (stylesProcessing.entryPointsGroups[groupID].linting.specialPresetFileRelativePath)

File which will be used instead of common **stylesProcessing.common.linting.presetFileRelativePath**.
**YDA** will take care about linting of only files corresponding to current entry points group and theirs partial files, 
but for **Stlint** plugin you need to exclude all files except mentioned above ones via **excludes** property and Glob
selectors.


##### Disabled (stylesProcessing.entryPointsGroups[groupID].linting.disable)

Disables the linting for the current entry points group and their partial files.
It will be enough to make **YDA** ignore these files, but for **Stlint** plugin you need also exclude above files in
actual **Stlint** configuration file via **excludes** property and Glob  selectors.


### Stlint configuration
#### Supported properties

#### extends

The relative path to sharable Stlint configuration file or multiple of them.


#### extraRules

The files with definitions of custom rules. See [self rules](https://github.com/stylus/stlint#self-rules) section of
**Stlint** documentation for details.


#### rules

The list of build-in rules which must be followed.
See [rules](https://github.com/stylus/stlint#rules) section of **Stlint** documentation for details. 


#### Ignored properties
##### reporter

**YDA** takes care about aesthetic reporting to console.
If you need the other format of reporting, use standalone **Stylint** or write own reporting Gulp task.


#### watch

The files watching is enabled for local development mode and not available for any other modes.


#### Missing Stlint documentation

Each rule could be:

```
export type modes = 'always' | 'never' | 'lowercase' | 'uppercase' | 'double' | 'single' | 'grouped' | 'alphabetical';

export interface IState {
	conf: modes;
	enabled?: boolean;
	[key: string]: any;
}

export type State = IState | [ modes, boolean] | [ modes ] | boolean;

```
