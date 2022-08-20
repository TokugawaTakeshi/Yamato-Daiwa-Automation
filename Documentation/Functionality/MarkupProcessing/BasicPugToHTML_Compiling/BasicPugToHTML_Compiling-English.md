# Basic Pug-to-HTML compiling

## Passive functionality

## Build-in Pug filters
### `html_special_characters_to_html_entities` - converting of HTML character to HTML entities

Don't

```pug
pre
  code 
    :html_special_characters_to_html_entities.
      
```

Note that the filter contains is not the plain text from the viewpoint of Pug - it is just the raw code which processing
will be delegated to filter.
Everything after dot will be ignored.

