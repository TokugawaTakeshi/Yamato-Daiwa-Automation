# Plain copying

## Schema

```typescript
namespace PlainCopyingSettings__FromFile__RawValid {

  export type Group =
      Readonly<
        (
          { sourceFileRelativePath: string; } |
          { sourceDirectoryRelativePath: string; }
        ) &
        {
          referenceName?: string;
          buildingModeDependent: Readonly<{
            [projectBuildingMode in ConsumingProjectPreDefinedBuildingModes]: Group.BuildingModeDependent | undefined;
          }>;
        }
      >;
}
```


## Group properties
### `sourceFileRelativePath`

<dl>

  <dt>Type</dt>
  <dd>string</dd>

  <dt>Required if</dt>
  <dd>Only one file must be copied according to settings of target group</dd>

  <dt>Note</dt>
  <dd>Must be the valid path to file</dd>

  <dt>Valid value example</dt>
  <dd><code>01-Source/robots.txt</code></dd>

</dl>


### `sourceDirectoryRelativePath`

<dl>

  <dt>Type</dt>
  <dd>string</dd>

  <dt>Required if</dt>
  <dd><code>sourceFileRelativePath</code> is not specified</dd>

  <dt>Note</dt>
  <dd>Must be the valid path to directory; neither leading nor trailing slashed required.</dd>

  <dt>Valid value example</dt>
  <dd><code>01-Source/Assets/ApplicationIcons</code></dd>

</dl>


### `referenceName`

<dl>

  <dt>Type</dt>
  <dd>string</dd>

  <dt>Is required</dt>
  <dd>No</dd>

  <dt>Valid value example</dt>
  <dd><code>Favicon</code></dd>

</dl>
