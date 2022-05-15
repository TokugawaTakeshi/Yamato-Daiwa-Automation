# Assets processing

## Schema

Currently, the schemas for images, fonts, videos and audios processing are even:

```typescript
type AssetsGroup = {
  sourceFilesTopDirectoryRelativePath: string;
  sourceFilesTopDirectoryPathAliasForReferencingFromHTML?: string;
  buildingModeDependent: {
    [projectBuildingMode: string]: {
      outputBaseDirectoryRelativePath: string;
      revisioning?: {
        disable?: boolean;
        contentHashPostfixSeparator?: string;
      };
      outputPathTransformations?: {
        segmentsWhichMustBeRemoved?: Array<string>;
        segmentsWhichLastDuplicatesMustBeRemoved?: Array<string>;
      };
    } | undefined;
  };
};
```
