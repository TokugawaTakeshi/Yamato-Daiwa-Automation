# Markup processing

## Schema

```typescript
type MarkupProcessingSettings__FromFile__RawValid = {

  common?: {
    waitingForSubsequentFilesWillBeSavedPeriod__seconds?: number;
  };

  linting?: {
    presetFileRelativePath?: string;
    disableCompletely?: boolean;
  }

  entryPointsGroups: {
    
    [groupID: string]: {

      entryPointsSourceFilesTopDirectoryOrSingleFileRelativePath: string;
      partialsRecognition?: {
        excludeAllSubdirectories?: boolean;
        excludeSubdirectoriesWithNames?: Array<string> | string;
        excludeSubdirectoriesWithPrefixes?: Array<string> | string;
        excludeFilesWithPrefixes?: Array<string> | string;
      };

      linting?: {
        disable?: boolean;
      }

      HTML_Validation?: {
        disable?: boolean;
      }

      accessibilityInspection?: {
        standard?: "WCAG2A" | "WCAG2AA" | "WCAG2AAA";
        disable?: boolean;
      };

      buildingModeDependent: {
        [projectBuildingMode: string]: {
          outputBaseDirectoryRelativePath: string;
        }
      };
    } 
  }
}
```

## Common settings
### `waitingForSubsequentFilesWillBeSavedPeriod__seconds`

<dl>
  <dt>Type</dt>
  <dd>number</dd>
  <dt>Default value</dt>
  <dd>1</dd>
</dl>

Specifies how many seconds must pass from one markup file will be saved until markup rebuilding will start.

Actual for the saving of all project files at once. Because the detecting of file changes is not instant,
without any delay will be one re-building per one changed file what is the waste of computer's resources.

The default value is enough for the start, but as files quantity will become more, the increasing of default value could 
require. The detecting of changes in file and rebuilding are being logged, so consider the increasing of
**waitingForSubsequentFilesWillBeSavedPeriod__seconds** is some files changes still being logged immediately
after rebuilding started.


## `linting`

The linting is the automatic check of the compliance of the source code with guidelines established in development team.

**YDA** using [pug-lint](https://github.com/pugjs/pug-lint) linter with below improvements:

1. Better formatted logging
2. Linting by entry points groups


### `presetFileRelativePath`

<dl>
  <dt>Type</dt>
  <dd>string</dd>
  <dt>Is required</dt>
  <dd>no</dd>
</dl>

The **pug-lint** will find configuration at:

* **.pug-lintrc**
* **.pug-lintrc.js**
* **.pug-lintrc.json**
* option **pugLintConfig** of **package.json**

Of none of above alternative desired, specify the path of the configuration file relative to project root in 
**presetFileRelativePath**.


### `disableCompletely`

<dl>
  <dt>Type</dt>
  <dd>boolean</dd>
  <dt>Default value</dt>
  <dd>false</dd>
</dl>

In high-quality web development for which **YDA** is intended to be used the linting is de-facto required tool.
However, this option has been added because of foresight of complaints about unable of disabling the linting. 


## Entry point group dependent settings
### `entryPointsSourceFilesTopDirectoryOrSingleFileRelativePath`

<dl>
  <dt>Type</dt>
  <dd>string</dd>
  <dt>Is required</dt>
  <dd>yes</dd>
</dl>

Obviously, the top directory of target entry points group below which entry points will be searched, or single
file of `.pug` extension.


### `partialsRecognition`

<dl>
  <dt>Type</dt>
  <dd>string</dd>
  <dt>Is required</dt>
  <dd>No; must not be when <b>entryPointsSourceFilesTopDirectoryOrSingleFileRelativePath</b> is the path of the single file</dd>
  <dt>Must be omitted if</dt>
  <dd><b>entryPointsSourceFilesTopDirectoryOrSingleFileRelativePath</b> is the path of the single file, not directory</dd>
</dl>

Specifies how to distinguish entry points files (which will be compiled to separate HTML files) and 
non-entry points files (which will not be compiled independently on entry points)

<dl>
  <dt>excludeAllSubdirectories</dt>
  <dd>
    When being set to <b>true</b>, all files in all subdirectories of <b>entryPointsSourceFilesTopDirectoryOrSingleFileRelativePath</b>
    will not be compiled to separate HTML files.
  </dd>
  <dt>excludeSubdirectoriesWithNames</dt>
  <dd>
    When being specified with array of subdirectories or single subdirectory, all files in these subdirectories 
    will not be compiled to separate HTML files
  </dd>
  <dt>excludeSubdirectoriesWithPrefixes</dt>
  <dd>
    When being specified with array of string values or single string value, all files in directories
    starting with these prefixes will not be compiled to separate HTML files 
  </dd>
  <dt>excludeFilesWithPrefixes</dt>
  <dd>
     When being specified with array of string values or single string value, all files which names
     starting with these prefixes will not be compiled to separate HTML files
  </dd>
</dl>

#### Example

Consider the below structure

```
📂 Sample
┣ 📂 Directory1
┃  ┗ 📜File1-1.pug
┃  ┗ 📜_File1-2.pug
┣ 📂 _Directory2
┃ ┗ 📜File2-1.pug
┃ ┗ 📜_File2-2.pug
┣ 📜 File3-1.pug
┗ 📜 _File3-2.pug
```

Without defined `partialsRecognition` all above files will be considered as entry points therefore will be compiled
to separate HTML files.

`excludeAllSubdirectories: true` will filter out files in all subdirectories:

```
📂 Sample
┣ 📂 Directory1
┃  ┗ 📜File1-1.pug ✖
┃  ┗ 📜_File1-2.pug ✖
┣ 📂 _Directory2
┃ ┗ 📜File2-1.pug ✖
┃ ┗ 📜_File2-2.pug ✖
┣ 📜 File3-1.pug 〇
┗ 📜 _File3-2.pug 〇
```

`excludeSubdirectoriesWithNames: [ "Directory1" ]` will filter out the files in `Directory1`:

```
📂 Sample
┣ 📂 Directory1
┃  ┗ 📜File1-1.pug ✖
┃  ┗ 📜_File1-2.pug ✖
┣ 📂 _Directory2
┃ ┗ 📜File2-1.pug 〇
┃ ┗ 📜_File2-2.pug 〇
┣ 📜 File3-1.pug 〇
┗ 📜 _File3-2.pug 〇
```

`excludeSubdirectoriesWithPrefixes: [ "_" ]` will filter out the files in subdirectory `_Directory2` (and other subdirectories
which names begin from `_`):

```
📂 Sample
┣ 📂 Directory1
┃  ┗ 📜File1-1.pug 〇
┃  ┗ 📜_File1-2.pug 〇
┣ 📂 _Directory2
┃ ┗ 📜File2-1.pug ✖
┃ ┗ 📜_File2-2.pug ✖
┣ 📜 File3-1.pug 〇
┗ 📜 _File3-2.pug 〇
```

`excludeFilesWithPrefixes: [ "_" ]` will filter out all files starts with `_`:

```
📂 Sample
┣ 📂 Directory1
┃  ┗ 📜File1-1.pug 〇
┃  ┗ 📜_File1-2.pug ✖
┣ 📂 _Directory2
┃ ┗ 📜File2-1.pug 〇
┃ ┗ 📜_File2-2.pug ✖
┣ 📜 File3-1.pug 〇
┗ 📜 _File3-2.pug ✖
```

#### Use case

Assume that the entry point **TopPage.pug** including files **MainVisual.pug**, **NewsFeed.pug**, **Service.pug**,
thus only **TopPage.pug** must be compiled to separate **TopPage.html** file. 

```
📂 Pages
┗ 📂 Top
   ┣ 📜TopPage.pug 〇
   ┗ 📂 Partials
     ┣ 📜 MainVisual.pug
     ┣ 📜 NewsFeed.pug
     ┗ 📜 Service.pug
```

First, we can ignore `Pages/Top/Partials` directory by `excludeSubdirectoriesWithNames: [ "Partials" ]`, but
there could be multiple page like `Top`.

Other option is the convention "All directories begins from underscore are containing partials". In this case ... 


### `linting`
#### `disable`

<dl>
  <dt>Type</dt>
  <dd>boolean</dd>
  <dt>Default value</dt>
  <dd>false</dd>
</dl>

Disabling the linting only for current entry points group.


### `HTML_Validation`
#### `disable`

<dl>
  <dt>Type</dt>
  <dd>boolean</dd>
  <dt>Default value</dt>
  <dd>false</dd>
</dl>

Disabling the HTML validation only for current entry points group.


### `accessibilityInspection`
#### `standard`

<dl>
  <dt>Type</dt>
  <dd>string</dd>
  <dt>Default value</dt>
  <dd>WCAG2A</dd>
  <dt>Allowed alternatives</dt>
  <dd>WCAG2A, WCAG2AA, WCAG2AAA</dd>
</dl>


#### `disable`

<dl>
  <dt>Type</dt>
  <dd>boolean</dd>
  <dt>Default value</dt>
  <dd>false</dd>
</dl>

Disabling the accessibility inspection only for current entry points group.


### `buildingModeDependent`
#### `outputBaseDirectoryRelativePath`

<dl>
  <dt>Type</dt>
  <dd>string</dd>
  <dt>Is required</dt>
  <dd>yes</dd>
</dl>

The top directory where the compiled HTML files will be put.
The "top" means that path of target entry point relative to `entryPointsSourceFilesTopDirectoryOrSingleFileRelativePath` 
will be kept and appended to `outputBaseDirectoryRelativePath`.
For example, if `entryPointsSourceFilesTopDirectoryOrSingleFileRelativePath` is `Pages`
and file is `Top/TopPage.pug`, the compiled `TopPage.html` will be put to `[outputBaseDirectoryRelativePath]/Top`,
not to root `[outputBaseDirectoryRelativePath]`.

