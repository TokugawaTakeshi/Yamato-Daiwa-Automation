# Styles processing

## Schema

```typescript
type StylesProcessingSettings__FromFile__RawValid = {

  common?: {
    periodBetweenFileUpdatingAndRebuildingStarting__seconds?: number;
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
        } | {
          singleEntryPointRelativePath: string;
        }
      ) & 
      {

        customReferenceName?: string;
  
        buildingModeDependent: {
          [projectBuildingMode: string]: {
            outputTopDirectoryRelativePath: string;
            revisioning?: {
              disable?: boolean;
              contentHashPostfixSeparator?: string;
            }
          }
        };

      }

  };
}
```

## `common` - Common settings

<dl>
  <dt>Type</dt>
  <dd>object</dd>
  <dt>Is required</dt>
  <dd>No</dd>
</dl>


### `periodBetweenFileUpdatingAndRebuildingStarting__seconds` - The interval between last markup file has been saved and starting of rebuilding

<dl>
  <dt>Type</dt>
  <dd>number</dd>
  <dt>Default value</dt>
  <dd>1</dd>
</dl>

Specifies how many seconds must pass from one style file will be saved until styles rebuilding will start.

Even if the Integrated Development Environment (IDE) could save the files at once, the saving actually is not simultaneous,
  and also the detecting of file changing is not instant.
So, without any specific measures it will be one re-building per one changed file what is the wasting of computer's resources.

The default value is enough for the starting of the development when the files quantity is not large, but as files
  quantity will become more, the increasing of default value could require.
The detecting of the changes in file and rebuilding are being logged, so consider the increasing of
  **periodBetweenFileUpdatingAndRebuildingStarting__seconds** if some files changes still being logged immediately after
  rebuilding started.


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
* The objet-type value has the following properties.


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
</dl>

The relative path to directory below which entry points will be searched.

```yaml
projectBuilding:

  # ...

  stylesProcessing:

    entryPointsGroups:

      StaticPreview:

        topDirectoryRelativePath: 01-Source/Infrastructure/Elements/Client/Pages
```

In above example, the entry points will be searched below "**[Project root directory]**/01-Source/Infrastructure/Elements/Client/Pages"


### `partialsRecognition` - The strategy of entry points and child files distinction

<dl>
  <dt>Type</dt>
  <dd>object</dd>
  <dt>Is required</dt>
  <dd>No</dd>
  <dt>Must be omitted if</dt>
  <dd>The group is including one explicit entry point</dd>
</dl>

Specifies how to distinguish the **entry points files** (which will be compiled to separate CSS files) and
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
</dl>

The relative path of exactly one entry point in group (to file of `.styl` or `.stylus` extension).


### `buildingModeDependent` - The settings dependent on project building mode
#### `outputTopDirectoryRelativePath`

<dl>
  <dt>Type</dt>
  <dd>string</dd>
  <dt>Is required</dt>
  <dd>yes</dd>
</dl>

The top directory where the compiled CSS files will be output.
The "top" means that path of target entry point relative to `topDirectoryRelativePath` will be kept and appended to
  `outputBaseDirectoryRelativePath`.
For example, if `topDirectoryRelativePath` is `Pages` and file is `Top/TopPage.styl`,
  the compiled `TopPage.css` will be put to `[outputBaseDirectoryRelativePath]/Top`,
  not to root `[outputBaseDirectoryRelativePath]`.


### `revisioning` - The revisioning settings

[📖 Revisioning conception](../../../Functionality/Shared/Revisioning/Revisioning-English.md)

<dl>
  <dt>Type</dt>
  <dd>object</dd>
  <dt>Is required</dt>
  <dd>no</dd>
</dl>

#### `disable`

<dl>
  <dt>Type</dt>
  <dd>boolean</dd>
  <dt>Default value</dt>
  <dd>false</dd>
</dl>

Disabling the revisioning for current entry points group.


#### `contentHashPostfixSeparator`

<dl>
  <dt>Type</dt>
  <dd>string</dd>
  <dt>Is required</dt>
  <dd>no</dd>
  <dt>Valid value example</dt>
  <dd><code>"__"</code></dd>
</dl>

The delimiter between file name and hash sum. 
