# Markup processing

## Schema

```typescript
type MarkupProcessingSettings__FromFile__RawValid = {

  common?: {
    periodBetweenFileUpdatingAndRebuildingStarting__seconds?: number;
  };

  linting?: {
    presetFileRelativePath?: string;
    enable?: boolean;
  };

  staticPreview?: {
    
    stateDependentPagesVariationsSpecificationFileRelativePath?: string;
    
    importsFromStaticDataFiles?: Array<{
      importedVariableName: string;
      fileRelativePath: string;
    }>;

    importsFromCompiledTypeScript?: {
      typeScriptConfigurationFileRelativePath?: string;
      files: Array<{
        importedNamespace: string;
        sourceFileRelativePath: string;
        outputDirectoryRelativePath: string;
        customOutputFileNameWithoutLastExtension?: string;
      }>;
    }
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

        HTML_Validation?: {
          disable?: boolean;
        }
  
        accessibilityInspection?: {
          standard?: "WCAG2A" | "WCAG2AA" | "WCAG2AAA";
          disable?: boolean;
        };

        convertToHandlebarsOnNonStaticPreviewModes?: boolean;
  
        buildingModeDependent: {
          [projectBuildingMode: string]: {
            outputTopDirectoryRelativePath: string;
          }
        };
      } 
  }

  logging: {
    filesPaths?: boolean;
    filesCount?: boolean;
    partialFilesAndParentEntryPointsCorrespondence?: boolean;
  }
}
```

## `common` - Common settings
### `periodBetweenFileUpdatingAndRebuildingStarting__seconds` - The interval between last markup file has been saved and starting of rebuilding 

<dl>
  <dt>Type</dt>
  <dd>number</dd>
  <dt>Default value</dt>
  <dd>1</dd>
</dl>

Specifies how many seconds must pass from one markup file will be saved until markup rebuilding will start.

Even is the Integrated Development Environment (IDE) could save files at once, the saving actually is not simultaneous,
and also the detecting of file changing is not instant.
So, without any specific measures it will be one re-building per one changed file what is the wasting of computer's resources.

The default value is enough for the starting of the development when the files quantity is not large, but as files
quantity will become more, the increasing of default value could require. The detecting of the changes in file and rebuilding 
are being logged, so consider the increasing of **periodBetweenFileUpdatingAndRebuildingStarting__seconds** if some files
changes still being logged immediately after rebuilding started.


## `linting` - Markup source code linting settings

The **linting** is the automatic check of the compliance of the source code with guidelines established in development team.

**YDA** using [pug-lint](https://github.com/pugjs/pug-lint) linter with below improvements:

1. Better formatted logging
2. Optimizations


### `presetFileRelativePath` - Relative path of "Puglint" configuration file  

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

Of none of above alternatives desired, specify the path of the configuration file relative to project root in 
**presetFileRelativePath**.


### `enable` - Enabling/disabling of markup source code linting

<dl>
  <dt>Type</dt>
  <dd>boolean</dd>
  <dt>Default value</dt>
  <dd>true</dd>
</dl>

In high-quality web development for which **YDA** is intended to be used the linting is de-facto required tool.
However, this option has been added because of foresight of complaints about unable of disabling the linting.

If linting is required, basically not need explicitly specify this option.
However if you has not declared any **entry points groups**, but need the linting, specify `enable: true` because
if will not be `markupProcessing` property in `yda.config.yaml` the linting will not be executed.


## `staticPreview` - Static preview specific configuration

[📖 The Static Preview concept](https://github.com/TokugawaTakeshi/Yamato-Daiwa-Frontend/blob/master/CoreLibrary/Package/Documentation/PagesTemplates/StaticPreviewAnywherePage/StaticPreviewAnywherePage.md#the-concept-of-static-preview)

All settings explained in this section are actual only for **static preview building** mode.


### `stateDependentPagesVariationsSpecificationFileRelativePath` - The relative path to state dependent page variation specification

The relative path to YAML file with declared specific **entry points** relative paths (the omitting of the filename 
extensions is allowed) and corresponding Pug/JavaScript variables which will be automatically injected. 
These settings are required to be defined in separate file because they could be large while they are about only one
functionality.

```yaml
projectBuilding:

  # ...

  markupProcessing:

    staticPreview:

      stateDependentPagesVariationsSpecificationFileRelativePath: StaticPreview/PagesStateDependentVariations.yaml

      # ...
```

The content of "StaticPreview/PagesStateDependentVariations.yaml" could be like:

```yaml
Pages/Inbox/ItemsList/InboxItemsListPage:

  stateObjectTypeVariableName: "InboxItemsListPageStatesSimulations"

  variations:

    __Loading: { loading: true }
    __Error: { error: true }
    __NoItems: { noItems: true }
    __NoSearchResults: { noSearchResults: true }


Pages/Timeline/TimelinePage:

  stateObjectTypeVariableName: "TimelinePageStatesSimulations"

  variations:

    __Loading: { loading: true }
    __Error: { error: true }
    __NoItems: { noItems: true }
    __NoSearchResults: { noSearchResults: true }
```

In above case, besides manually created `Pages/Inbox/ItemsList/InboxItemsListPage.pug` file,
the following files will be created automatically:

* `Pages/Inbox/ItemsList/InboxItemsListPage__Loading.pug`, herewith the global Pug variable `InboxItemsListPageStatesSimulations`
   with value `{ loading: true }` will be provided.
* `Pages/Inbox/ItemsList/InboxItemsListPage__Error.pug`, herewith the global Pug variable `InboxItemsListPageStatesSimulations`
  with value `{ error: true }` will be provided.
* `Pages/Inbox/ItemsList/InboxItemsListPage__NoItems.pug`, herewith the global Pug variable `InboxItemsListPageStatesSimulations`
   with value `{ noItems: true }` will be provided.
* `Pages/Inbox/ItemsList/InboxItemsListPage__NoSearchResults.pug`, herewith the global Pug variable `InboxItemsListPageStatesSimulations`
    with value `{ noSearchResults: true }` will be provided.

Similarly, for `Pages/Timeline/TimelinePage.pug` case.

[//]: # (TODO Static Preview Mode only)

Note that you don't need to check the `InboxItemsListPageStatesSimulations` for existence in `Pages/Inbox/ItemsList/InboxItemsListPage.pug`
because for this file, the empty object will be provided as value of `InboxItemsListPageStatesSimulations`.

The example content of `Pages/Inbox/ItemsList/InboxItemsListPage.pug`

```pug
//- ...

if InboxItemsListPageStatesSimulations.loading

  .InboxItemsListPage-ItemsList
    each cardNumber in Array.from(new Array(9).keys())
      +InboxItem-LoadingPlaceholder
      
else if InboxItemsListPageStatesSimulations.error

  +AlertBox({
    decorativeVariation: AlertBox.DecorativeVariations.erorr,
    title: "The loading error occurred"
  })
  
else if InboxItemsListPageStatesSimulations.noItems

  // ...
```


### `importsFromStaticDataFiles` - The relative path to files with data for Pug

<dl>
  <dt>Type</dt>
  <dd>Array</dd>
  <dt>Minimal elements count</dt>
  <dd>1</dd>
</dl>

The [static preview](https://github.com/TokugawaTakeshi/Yamato-Daiwa-Frontend/blob/master/CoreLibrary/Package/Documentation/PagesTemplates/StaticPreviewAnywherePage/StaticPreviewAnywherePage.md#the-concept-of-static-preview)
needs some dummy data to display what will be when interactive application will be complete. 

* It could be imported from `.json` or `.yaml` files.
* Each file could import one and only one variable - of object or array (which is the partial case of object for ECMAScript) type.

```yaml
projectBuilding:

  # ...

  markupProcessing:

    staticPreview:

      importsFromStaticDataFiles:

        - importedVariableName: DummyProducts
          fileRelativePath: StaticPreview/DummyData/DummyProducts.json

        - importedVariableName: DummyCategories
          fileRelativePath: StaticPreview/DummyData/DummyCategories.yaml
```

For above case, the `DummyProducts` and `DummyCategories` variables will be injected in `static preview building mode`.

```pug
ul.ProductsList
  each produt in DummyProducts
    li.ProductsList-Item
      .ProductsList-Item-Title= product.title
      .ProductsList-Item-PriceLabel
        span.ProductsList-Item-PriceLabel-Amount= product.price__dollars__withoutTax 
        span.ProductsList-Item-PriceLabel-Currency $
```

Although the multiple file are supported, you may want to prepare single file with all data:

```yaml
projectBuilding:

  # ...

  markupProcessing:

    staticPreview:

      importsFromStaticDataFiles:

        - importedVariableName: DummyData
          fileRelativePath: StaticPreview/DummyData.json
```


[//]: # (TODO importsFromCompiledTypeScript)

[//]: # (Besides [static preview]&#40;https://github.com/TokugawaTakeshi/Yamato-Daiwa-Frontend/blob/master/CoreLibrary/Package/Documentation/PagesTemplates/StaticPreviewAnywherePage/StaticPreviewAnywherePage.md#the-concept-of-static-preview&#41;)

[//]: # (state, you may need the dummy data in other stages of development including testing. Most likely, you will generate this)

[//]: # (data via TypeScript using appropriate libraries. With **YDA**, you can reuse this data for the static preview.)



## `entryPointsGroups` - Entry point group dependent settings
### `topDirectoryRelativePath` - Top directory relative path for multiple entry points group 

<dl>
  <dt>Type</dt>
  <dd>string</dd>
  <dt>Required if</dt>
  <dd>Group includes the arbitrary number of entry points</dd>
  <dt>Minimal characters count</dt>
  <dd>1</dd>
</dl>

The relative path to directory below which entry points will be searched.

```yaml
projectBuilding:

 # ...

  markupProcessing:

    entryPointsGroups:

      StaticPreview:

        topDirectoryRelativePath: 01-Source/Infrastructure/Elements/Client/StaticPreview
```

### `partialsRecognition` - The strategy of entry points and child files distinction

<dl>
  <dt>Type</dt>
  <dd>object</dd>
  <dt>Is required</dt>
  <dd>No</dd>
  <dt>Must be omitted if</dt>
  <dd>The group is including one explicit entry point</dd>
</dl>

Specifies how to distinguish the **entry points files** (which will be compiled to separate HTML files) and 
non-entry points files (which will not be compiled independently on entry points).

See [Entry points and children files distinction concept](API/ConfigurationFile/Concepts/EntryPointsAndChildrenFilesDistinction.md)
for details.


### `singleEntryPointRelativePath` - The relative path of single entry points

<dl>
  <dt>Type</dt>
  <dd>string</dd>
  <dt>Required if</dt>
  <dd>Group includes exactly one entry point</dd>
</dl>

The relative path of exactly one entry point in group (to file of `.pug` extension).


### `HTML_Validation` - HTML code validation
#### `disable`

<dl>
  <dt>Type</dt>
  <dd>boolean</dd>
  <dt>Default value</dt>
  <dd>false</dd>
</dl>

Disabling the HTML validation only for current entry points group.


### `accessibilityInspection` - The settings of accessibility inspection
#### `standard`

<dl>
  <dt>Type</dt>
  <dd>string</dd>
  <dt>Default value</dt>
  <dd>WCAG2AAA</dd>
  <dt>Allowed alternatives</dt>
  <dd>WCAG2A, WCAG2AA, WCAG2AAA</dd>
</dl>

The target accessibility guidelines.

<dl>
  <dt>WCAG2A</dt>
  <dd><a href="https://www.w3.org/WAI/WCAG2A-Conformance">Web Content Accessibility Guidelines (WCAG) 2 Level A Conformance</a></dd>
  <dt>WCAG2AA</dt>
  <dd><a href="https://www.w3.org/WAI/WCAG2AA-Conformance">Web Content Accessibility Guidelines (WCAG) 2 Level AA Conformance</a></dd>
  <dt>WCAG2AAA</dt>
  <dd><a href="https://www.w3.org/WAI/WCAG2AAA-Conformance">Web Content Accessibility Guidelines (WCAG) 2 Level AAA Conformance</a></dd>
</dl>

The default id most strict one - Level AAA Conformance.
According [w3c.org](https://www.w3.org), many organizations strive to meet Level AA.


#### `disable`

<dl>
  <dt>Type</dt>
  <dd>boolean</dd>
  <dt>Default value</dt>
  <dd>false</dd>
</dl>

Disabling the accessibility inspection only for current entry points group.


### `buildingModeDependent` - The settings dependent on project building mode
#### `outputTopDirectoryRelativePath`

<dl>
  <dt>Type</dt>
  <dd>string</dd>
  <dt>Is required</dt>
  <dd>yes</dd>
</dl>

The top directory where the compiled HTML files will be output.
The "top" means that path of target entry point relative to `topDirectoryRelativePath` will be kept and appended to 
`outputBaseDirectoryRelativePath`.
For example, if `topDirectoryRelativePath` is `Pages` and file is `Top/TopPage.pug`, 
the compiled `TopPage.html` will be put to `[outputBaseDirectoryRelativePath]/Top`, not to root `[outputBaseDirectoryRelativePath]`.


### `logging` - Logging
#### `filesPaths` 

<dl>
  <dt>Type</dt>
  <dd>boolean</dd>
  <dt>Default value</dt>
  <dd>false</dd>
</dl>

If being set to `true`, the paths of all files which being processing will be logged.


#### `filesCount`

<dl>
  <dt>Type</dt>
  <dd>boolean</dd>
  <dt>Default value</dt>
  <dd>false</dd>
</dl>

If being set to `true`, the count of all files which being processing will be logged.


#### `partialFilesAndParentEntryPointsCorrespondence`

<dl>
  <dt>Type</dt>
  <dd>boolean</dd>
  <dt>Default value</dt>
  <dd>false</dd>
</dl>

If being set to `true`, the parents of all partial files will be logged.
