# Markup processing

```yaml
projectBuilding:

  markupProcessing: # Markup processing settings going here (see schema and examples below)
```

## Schema

```typescript
type MarkupProcessingSettings__FromFile__RawValid = {

  common?: {
    secondsBetweenFileUpdatingAndStartingOfRebuilding?: number;
    buildingModeDependent?: {
      [projectBuildingMode: string]: {
        mustUseResolveResourceReferencesToRelativePaths?: boolean;
      };
    }
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
    };
    
  };

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
        } | 
        {
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
            outputCodeFormatting?: { enabled?: boolean }
          }
        };
        
      }
      
  };

  logging: {
    filesPaths?: boolean;
    filesCount?: boolean;
    partialFilesAndParentEntryPointsCorrespondence?: boolean;
  };
  
};
```

## `common` - Common settings

<dl>

  <dt>Type</dt>
  <dd>Object</dd>

  <dt>Is required</dt>
  <dd>No</dd>

</dl>


### `secondsBetweenFileUpdatingAndStartingOfRebuilding` - The interval between last markup file has been saved and starting of rebuilding 

<dl>

  <dt>Type</dt>
  <dd>number</dd>

  <dt>Default value</dt>
  <dd>1</dd>

</dl>

Specifies how many seconds must pass from one markup file will be saved until markup rebuilding will start.

Even if the Integrated Development Environment (IDE) could save multiple files at once, the saving actually is not simultaneous
  and also the detecting of file changing is not instant.
So, without any specific measures it will be one re-building per one changed file what is the wasting of computer's resources.

The default value is enough for the starting of the development when the files quantity is not large, but as files
  quantity will become more, the increasing of default value could require. 
The detecting of the changes in file and rebuilding staring are being logged, so consider the increasing of 
  **secondsBetweenFileUpdatingAndStartingOfRebuilding** if some files changes still being logged immediately after 
  rebuilding started.


### `buildingModeDependent` - The common settings dependent on project building mode

<dl>

  <dt>Type</dt>
  <dd>Associative array-like object</dd>

  <dt>Is required</dt>
  <dd>No</dd>

  <dt>Key</dt>
  <dd>Project building modes</dd>

  <dt>Allowed keys</dt>
  <dd>
    <ul>
      <li>STATIC_PREVIEW</li>
      <li>LOCAL_DEVELOPMENT</li>
      <li>TESTING</li>
      <li>STAGING</li>
      <li>PRODUCTION</li>
    </ul>
  </dd>

  <dt>Value type</dt>
  <dd>Object</dd>

  <dt>Value schema<dt>
  <dd><pre><code>
{
  mustUseResolveResourceReferencesToRelativePaths?: boolean;
}
  </code></pre></dd>

Value schema
  
</dl>

The settings dependent of **project building mode** however common for all **entry points groups**. 
Do not be confused with `entryPointsGroups.entryPointsGroups.[GROUP_ID].buildingModeDependent` which are individual for each
  entry points group.
  

#### `mustResolveResourceReferencesToRelativePaths`

<dl>

  <dt>Type</dt>
  <dd>Boolean</dd>

  <dt>Default value</dt>
  <dd><code>false</code></dd>

</dl>

As default, the [resource references](../../../Functionality/Shared/ResourcesPathsResolving/ResourcesPathsResolving.english.md)
  are being resolved to _absolute_ paths for all project building modes _except_ **static preview** (because the absolute
  paths are incompatible with **static preview** concept; for the **static preview** mode all **resource references** will
  _always_ be resolved to _relative_ paths.)

If this option set to <code>true</code>, the resource references will be resolved to _relative_ path for target 
  **project building mode**.
  

## `linting` - Markup source code linting settings

<dl>

  <dt>Type</dt>
  <dd>Object</dd>

  <dt>Is required</dt>
  <dd>No</dd>

  <dt>Schema<dt>
  <dd><pre><code>
{
  presetFileRelativePath?: string;
  enable?: boolean;
}
  </code></pre></dd>

</dl>


The **linting** is the automatic check of the compliance of the source code with guidelines established in development team.
**YDA** is using [pug-lint](https://github.com/pugjs/pug-lint) linter with below improvements:

1. Better formatted logging
2. Optimizations

[📖 pug-lint](https://github.com/pugjs/pug-lint)


### `presetFileRelativePath` - Relative path of "pug-lint" configuration file

<dl>

  <dt>Type</dt>
  <dd>String</dd>

  <dt>Is required</dt>
  <dd>No</dd>

  <dt>Notes</dt> 
  <dd>
    <ul>
      <li>Must be the valid path relative to project root</li>
      <li>Neither leading not trailing slashes required</li>
    </ul>
  </dd>

  <dt>Example</dt> 
  <dd><code>Settings/Markup.js</code></dd>

</dl>

The **pug-lint** searches the configuration at:

* **.pug-lintrc**
* **.pug-lintrc.js**
* **.pug-lintrc.json**
* option **pugLintConfig** of **package.json**

Of none of above alternatives desired, specify the path of the configuration file relative to project root in 
  this option, the **presetFileRelativePath**.


### `enable` - Enabling/disabling of markup source code linting

<dl>

  <dt>Type</dt>
  <dd>Boolean</dd>

  <dt>Default value</dt>
  <dd><code>true</code></dd>

</dl>

In high-quality development for which **YDA** is intended to be used the linting is de-facto required tool.
However, this option has been added because of foresight of complaints about unable of disabling the linting.

If the linting is desires, basically not need explicitly specify this option.
However, if you has not declared any **entry points groups** for the markup, but need the linting, 
  specify `enable: true` because if it will not be `markupProcessing` property at `projectBuilding`,
  will be concluded that the markup processing has not been demanded and the linting of the markup will not be executed.


## `staticPreview` - Static preview specific configuration

<dl>

  <dt>Type</dt>
  <dd>Object</dd>

  <dt>Is required</dt>
  <dd>No</dd>

</dl>


[📖 The Static Preview concept](https://github.com/TokugawaTakeshi/Yamato-Daiwa-Frontend/blob/master/CoreLibrary/Package/Documentation/PagesTemplates/StaticPreviewAnywherePage/StaticPreviewAnywherePage.md#the-concept-of-static-preview)

This group is actual only for the **static preview building** mode.
These settings will not affect to something for the other project building modes.


### `stateDependentPagesVariationsSpecificationFileRelativePath` - The relative path to state dependent page variation specification

<dl>

  <dt>Type</dt>
  <dd>String</dd>

  <dt>Is required</dt>
  <dd>No</dd>

  <dt>Note</dt> 
  <dd>
    <ul>
      <li>Must be the valid path relative to project root directory</li>
      <li>The filename extension could be omitted</li>
      <li>Target file must the either <b>yaml</b> or <b>yml</b></li>
    </ul>
  </dd>

  <dt>Example</dt> 
  <dd><code>StaticPreview/PagesStateDependentVariations.yaml</code></dd>

</dl>

[📖 The Page State Dependent Variations concept](../../../Functionality/MarkupProcessing/StaticPreview/StateDependentPagesVariations/StateDependentPagesVariations.english.md)

The relative path to YAML file with declared specific **entry points** relative paths (the omitting of the filename 
  extensions is allowed) and corresponding Pug/JavaScript variables which will be automatically injected. 
These settings are required to be defined in separate file because they could be large while they are about only one
  functionality namely the **static preview**.

```yaml
projectBuilding:

  # ...

  markupProcessing:

    staticPreview:

      stateDependentPagesVariationsSpecificationFileRelativePath: StaticPreview/PagesStateDependentVariations

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
  the following files will be generated automatically:

* `Pages/Inbox/ItemsList/InboxItemsListPage__Loading.pug`, herewith the global Pug variable `InboxItemsListPageStatesSimulations`
   with value `{ loading: true }` will be provided.
* `Pages/Inbox/ItemsList/InboxItemsListPage__Error.pug`, herewith the global Pug variable `InboxItemsListPageStatesSimulations`
  with value `{ error: true }` will be provided.
* `Pages/Inbox/ItemsList/InboxItemsListPage__NoItems.pug`, herewith the global Pug variable `InboxItemsListPageStatesSimulations`
   with value `{ noItems: true }` will be provided.
* `Pages/Inbox/ItemsList/InboxItemsListPage__NoSearchResults.pug`, herewith the global Pug variable `InboxItemsListPageStatesSimulations`
    with value `{ noSearchResults: true }` will be provided.

Similarly, for `Pages/Timeline/TimelinePage.pug` case.

Note that you don't need to check the `InboxItemsListPageStatesSimulations` for existence for the 
  `Pages/Inbox/ItemsList/InboxItemsListPage.pug` case because for this file the `InboxItemsListPageStatesSimulations`
  will be provided too - with empty object value. 
Similarly, for `Pages/Timeline/TimelinePage.pug` and `TimelinePageStatesSimulations` case.

The example content of `Pages/Inbox/ItemsList/InboxItemsListPage.pug`:

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
  may need some dummy data to display.
For example, in the case of developing of the online store, it is required to display some products in the products list page. 

One way to get this dummy data in static preview stage with YDA is import it from the `.json` or `.yaml` files to Pug.
Each file could import one and only one variable - of object or array (which is the partial case of object for ECMAScript) type.

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

For above case, the `DummyProducts` and `DummyCategories` variables will be injected in **static preview building mode**.
The usage example:

```pug
ul.ProductsList
  each produt in DummyProducts
    li.ProductsList-Item
      .ProductsList-Item-Title= product.title
      .ProductsList-Item-PriceLabel
        span.ProductsList-Item-PriceLabel-Amount= product.price__dollars__withoutTax 
        span.ProductsList-Item-PriceLabel-Currency $
```

Although the multiple files are supported, the storing of all dummy data in the single file is completely normal for 
  this situation:

```yaml
projectBuilding:

  # ...

  markupProcessing:

    staticPreview:

      importsFromStaticDataFiles:

        - importedVariableName: DummyData
          fileRelativePath: StaticPreview/DummyData.json
```


### `importsFromCompiledTypeScript` - Importing from the compiled TypeScript 

<dl>

  <dt>Type</dt>
  <dd>Object</dd>

  <dt>Is required</dt>
  <dd>No</dd>

</dl>


Another way of the providing of the dummy data for the static preview is importing it from the TypeScript.
YDA will take care about compiling of the TypeScript to JavaScript and then - about wrapping to Pug file.

Currently, it is required to include the output Pug file manually.


### `typeScriptConfigurationFileRelativePath`

<dl>

  <dt>Type</dt>
  <dd>String</dd>

  <dt>Is required</dt>
  <dd>No</dd>

  <dt>Note</dt>
  <dd>As default, the TypeScript configuration will be searched at <code>tsconfig.json</code> in the project root directory.</dd>

</dl>

Basically, no need to specify the custom TypeScript configuration file because the entry point and required modules are
  being configured automatically.


### `files`

<dl>

  <dt>Type</dt>
  <dd>Array</dd>

  <dt>Is required</dt>
  <dd>No</dd>

  <dt>Minimal elements count</dt>
  <dd>1</dd>

  <dt>Element type</dt>
  <dd>Object</dd>

  <dt>Element schema</dt>
  <dd>
    <pre>
      <code>
  {
    importedNamespace: string;
    sourceFileRelativePath: string;
    outputDirectoryRelativePath: string;
    customOutputFileNameWithoutLastExtension?: string;
  }
      </code>
    </pre>
  </dd>
</dl>

Basically, just one file (for example, **MockData.ts** which will be compiled to **MockData.pug**) is enough, 
  but YDA does not limit to one file.

> #### ⚠️ Issue
>
> Because of [upstream bug](https://github.com/shama/webpack-stream/issues/247) (the bug of dependency), currently
>   the automatic rebuilding in the case of multiple files is not available.
> It is possible to implement the same functionality as dependency provides, however it will take some time.


#### Example

The target is compiling of below **MockData.ts** file to **MockData.pug** which must include the compiled JavaScript code
and make `MockData` variable accessible from the Pug code.

The content of **MockData.ts** could be like:

```typescript
/* --- Entities ----------------------------------------------------------------------------------------------------- */
import type Category from "@Entities/Category";
import type Product from "@Entities/Product";

/* --- Data --------------------------------------------------------------------------------------------------------- */
import MockDataSource from "@MockDataSource/MockDataSource";


const mockDataSource: MockDataSource = MockDataSource.getInstance();

const MockData: {
  categories: ReadonlyArray<Category>;
  products: ReadonlyArray<Product>;
} = {
  categories: mockDataSource.categories,
  products: mockDataSource.products
};


export default MockData;
```

The implementation **MockDataSource** could be any; the only requirement is **MockDataSource** must grant access
  to its data (in above example the  `categories`  and `products` are the public static readonly fields of array type).

Next, the minimal YDA settings are:

```yaml
projectBuilding:

  markupProcessing:

    staticPreview:

      importsFromCompiledTypeScript:

        files:
          - importedNamespace: MockData
            sourceFileRelativePath: 01-Source/Implementation/Elements/Client/StaticPreview/_MockData/MockData.ts
            outputDirectoryRelativePath: 01-Source/Implementation/Elements/Client/StaticPreview/_MockData


    entryPointsGroups:

      StaticPreview:

        topDirectoryRelativePath: 01-Source/Implementation/Elements/Client/StaticPreview
        partialsRecognition:
          excludeSubdirectoriesWithPrefixes: "_"
          excludeFilesWithPrefixes: "_"

        buildingModeDependent:
          STATIC_PREVIEW:
            outputTopDirectoryRelativePath: 02-StaticPreviewBuild

      # ...
```

* The `importedNamespace` is the name of variable which could be accessed from the Pug.
* `sourceFileRelativePath` is the path to target TypeScript file (**MockData.ts** in above example)
* `outputDirectoryRelativePath` is the directory where the pug file with the compiled JavaScript will be output.
* About `entryPointsGroups`, see below.

Now the `MockData` variable could be accessed from the Pug file: 

```pug
ul
  each category in MockData.categories
    li= category.title
```

If you are interesting how `MockData` has become accessible, the contains of the output Pug file is:  

```pug
-
  !function(e,t){/* The compiled JavaScript code ... */;

  const MockData = global.MockData.default;
```


## `entryPointsGroups` - Entry point group dependent settings

<dl>

  <dt>Type</dt>
  <dd>Associative array-like object</dd>

  <dt>Is required</dt>
  <dd>No</dd>

  <dt>Minimal entries count</dt>
  <dd>1</dd>

  <dt>Value type</dt>
  <dd>Object</dd>

  <dt>Value schema<dt>
  <dd><pre><code>
(
  {
    topDirectoryRelativePath: string;
    partialsRecognition?: {
      excludeAllSubdirectories?: boolean;
      excludeSubdirectoriesWithNames?: Array<string> | string;
      excludeSubdirectoriesWithPrefixes?: Array<string> | string;
      excludeFilesWithPrefixes?: Array<string> | string;
    };
  } | 
  {
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
  </code></pre></dd>

</dl>

* The keys are the entry point group name.
* The objet-type value has the following properties.


### `topDirectoryRelativePath` - Top directory relative path for multiple entry points group 

<dl>

  <dt>Type</dt>
  <dd>String</dd>

  <dt>Required if</dt>
  <dd>The group includes the arbitrary number of entry points</dd>

  <dt>Minimal characters count</dt>
  <dd>1</dd>

  <dt>Note</dt>
  <dd>
    <ul>
      <li>Must be the valid relative path to project root directory</li>
      <li>The trailing slash is not required</li>
    </ul>
  </dd>

  <dl>Valid value example</dl>
  <dd><code>01-Source/Infrastructure/Elements/Client/StaticPreview</code></dd>

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

In above example, the entry points will be searched below 
  "**[Project root directory]**/01-Source/Infrastructure/Elements/Client/StaticPreview".


### `partialsRecognition` - The strategy of entry points and child files distinction

<dl>

  <dt>Type</dt>
  <dd>Object</dd>

  <dt>Is required</dt>
  <dd>No</dd>

  <dt>Must be omitted if</dt>
  <dd>The group is including one explicit entry point</dd>

</dl>

Specifies how to distinguish the **entry points files** (which will be compiled to separate HTML files) and 
non-entry points files (which will not be compiled independently on entry points).

See [Entry points and children files distinction concept](../Shared/EntryPointsAndChildrenFilesDistinction.md)
  for details.


### `singleEntryPointRelativePath` - The relative path of single entry point group

<dl>

  <dt>Type</dt>
  <dd>string</dd>

  <dt>Required if</dt>
  <dd>The group is including one explicit entry point</dd>

  <dt>Notes</dt>
  <dd>
    <ul>
      <li>Must be the valid relative path file</li>
      <li>The file name extension is not required</li>
    </ul>
  </dd>

  <dt>Valid value example</dt>
  <dd><code>01-Source/Implementation/Elements/Client/index.pug</code></dd> 

</dl>

The relative path of exactly one entry point in group (to file of `.pug` extension).


### `HTML_Validation` - HTML code validation
#### `disable`

<dl>

  <dt>Type</dt>
  <dd>Boolean</dd>

  <dt>Default value</dt>
  <dd>false</dd>

</dl>

Disabling the HTML validation only for current entry points group.


### `accessibilityInspection` - The settings of accessibility inspection
#### `standard`

<dl>

  <dt>Type</dt>
  <dd>String</dd>

  <dt>Default value</dt>
  <dd><code>WCAG2AAA</code></dd>

  <dt>Allowed alternatives</dt>
  <dt>
    <ul>
      <li><code>WCAG2A</code></li>
      <li><code>WCAG2AA</code></li>
      <li><code>WCAG2AAA</code></li>
    </ul>
  </dt>

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
  <dd>Boolean</dd>

  <dt>Default value</dt>
  <dd>false</dd>

</dl>

Disabling the accessibility inspection only for current entry points group.


### `convertToHandlebarsOnNonStaticPreviewModes`

<dl>

  <dt>Type</dt>
  <dd>Boolean</dd>

  <dt>Default value</dt>
  <dd><code>false</code></dd>

</dl>

Changes the output file name extension from ".html" to ".hbs" on each mode <i>except</i> <b>static preview</b> one.


### `buildingModeDependent` - The entry points groups settings dependent on project building mode
#### `outputTopDirectoryRelativePath`

<dl>

  <dt>Type</dt>
  <dd>String</dd>

  <dt>Is required</dt>
  <dd>Yes</dd>

  <dt>Valid value example</dt>
  <dd><code>03-LocalDevelopmentBuild/public</code></dd>

</dl>

The top directory where the compiled HTML files will be output.
The "top" means that path of target entry point relative to `topDirectoryRelativePath` will be kept and appended to 
`outputBaseDirectoryRelativePath`.
For example, if `topDirectoryRelativePath` is `Pages` and file is `Top/TopPage.pug`, 
  the compiled `TopPage.html` will be put to `[outputBaseDirectoryRelativePath]/Top`, 
  not to root `[outputBaseDirectoryRelativePath]`.

#### `outputCodeFormatting`

<dl>

  <dt>Type</dt>
  <dd>Object</dd>

  <dt>Is required</dt>
  <dd>No</dd>

  <dt>Schema<dt>
  <dd><pre><code>
{
  enable?: string;
}
  </code></pre></dd>

</dl>

The formatting of output HTML code.


#### `enable`

<dl>

  <dt>Type</dt>
  <dd>Boolean</dd>

  <dt>Default value</dt>
  <dd>
    <ul>
      <li><code>true</code> for <b>static preview</b> and <b>local development</b> building modes.</li>
      <li><code>false</code> for all other modes.</li>
    </ul>
  </dd>

</dl>


### `logging` - Logging
#### `filesPaths` 

<dl>

  <dt>Type</dt>
  <dd>Boolean</dd>

  <dt>Default value</dt>
  <dd><code>false</code></dd>

</dl>

If being set to `true`, the paths of all files which being processing will be logged.


#### `filesCount`

<dl>

  <dt>Type</dt>
  <dd>Boolean</dd>

  <dt>Default value</dt>
  <dd><code>false</code></dd>

</dl>

If being set to `true`, the count of all files which being processing will be logged.


#### `partialFilesAndParentEntryPointsCorrespondence`

<dl>

  <dt>Type</dt>
  <dd>Boolean</dd>

  <dt>Default value</dt>
  <dd><code>false</code></dd>

</dl>

If being set to `true`, the parents of all partial files will be logged.


## Typical setups
### Full-stack REST web application

[//]: # (TODO)

### Full-stack web site

[//]: # (TODO)
