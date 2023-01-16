# Browser live reloading

## Schema

The `projectBuilding.browserLiveReloading` property in the YDA configuration file is obeys to below TypeScript type. 

```typescript
type BrowserLiveReloadingSettings__FromFile__RawValid = {

  setups: { 
    [setupID: string]: {
      localServer: {
        rootDirectoryRelativePath: string;
        ignoredFilesAndDirectoriesRelativePaths?: Array<string>;
        customPort?: number;
        customStartingFileNameWithExtension?: string;
        useHTTPS?: boolean;
        useCORS?: boolean;
      };
      proxy?: string;
      openInBrowsers?: Array<string> | string;
      browserSyncUserInterface?: {
        customPort?: number;
        disable?: boolean;
      };
      periodBetweenFileUpdatingAndBrowserReloading__seconds?: number;
    }; 
  };
  
  logging?: {
    outputFileChangeDetection?: boolean;
    browserTabWillReloadSoon?: boolean;
    browsersyncConnection?: boolean;
  };
  
};
```


## `setups`

<dl>
  <dt>Type</dt>
  <dd>Associative array-like object</dd>
  <dt>Required</dt>
  <dd>Yes</dd>
  <dt>Key</dt>
  <dd>Setup ID</dd>
  <dt>Value</dt>
  <dd>Setup specification</dd>
</dl>

You may need more than one setup, for example one for the **static preview mode** and one for the **local development mode**.
The key is the setup ID; the value is the object with below schema.


### Setup specification
#### `localServer`

<dl>
  <dt>Type</dt>
  <dd>Object</dd>
  <dt>Required</dt>
  <dd>Yes</dd>
</dl>

This group specifies the settings of local server which provides the reloading of the browser tab.


#### `rootDirectoryRelativePath`

<dl>
  <dt>Type</dt>
  <dd>String</dd>
  <dt>Required</dt>
  <dd>Yes</dd>
  <dt>Note</dt>
  <dd>Must the valid directory path relative to project root directory.</dd>
  <dt>Valid value example</dt>
  <dd><code>LocalDevelopmentBuild/public</code></dd>
</dl>

The path to directory below which starting file (**index.html** or specified in `customStartingFileNameWithExtension`)
  fill be searched. 
Basically, it is the directory with the output files.


#### `ignoredFilesAndDirectoriesRelativePaths`

<dl>
  <dt>Type</dt>
  <dd>Array</dd>
  <dt>Element type</dt>
  <dd>String</dd>
  <dt>Required</dt>
  <dd>No</dd>
</dl>

Basically, the browser will be reloaded on any file changed below `rootDirectoryRelativePath`.
If some files and/or directories must not be watched for changes matter, 
  specify them in `ignoredFilesAndDirectoriesRelativePaths`.
Usually, it is various logging files.


#### `customPort`

<dl>
  <dt>Type</dt>
  <dd>Positive integer</dd>
  <dt>Required</dt>
  <dd>No</dd>
</dl>

As default the port will be selected automatically.
First, the port **3000** will be tried, but it is not the default value because if the port **3000** is in use, 
  other port will be tried.
If you want to assign the specific port, `customPort` option is designed for this, but this port must be vacant.


#### `customStartingFileNameWithExtension`

<dl>
  <dt>Type</dt>
  <dd>String</dd>
  <dt>Required</dt>
  <dd>No</dd>
  <dt>Valid value example</dt>
  <dd><code>StaticPreviewAnywherePage.html</code></dd>
</dl>

As default, the **index.html** will be searched below `ignoredFilesAndDirectoriesRelativePaths`.


#### `useHTTPS`

<dl>
  <dt>Type</dt>
  <dd>Boolean</dd>
  <dt>Default value</dt>
  <dd>false</dd>
</dl>

As default the local server uses the HTTP port because basically no security requires on local development mode.
However, if it is required to approximate the local development mode to production mode where for today HTTPS is de facto
  required, set this option to `true`. 
But in this case, the following two things are required to be done:

1. Create the SSL certificate
2. Convince the browser that this certificate is reliable. This procedure is operationing system dependent.


##### `useCORS`

<dl>
  <dt>Type</dt>
  <dd>Boolean</dd>
  <dt>Default value</dt>
  <dd>false</dd>
</dl>

If the backend part of the application is the REST API, once request will be submitted by AJAX, the browser will
  not accept the response and display the message like

> Access to fetch at 'http://localhost:1337/api/products' from origin 'http://localhost:3000' 
> has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the 
> requested resource. If an opaque response serves your needs, set the request's mode to 
> 'no-cors' to fetch the resource with CORS disabled.

The cause is not the backend - it is the feature of the browser, however it could be solved at the server by the 
  corresponding HTTP headers. 
Other solution is make the **useCORS** option to `true`.

#### `proxy`

<dl>
  <dt>Type</dt>
  <dd>String</dd>
  <dt>Required</dt>
  <dd>false</dd>
</dl>

Intended to be used mainly for the MVC applications.
In this case, the local server processing the HTTP requests and returning the HTML content will listen for 
  the specific port, for example, 8080.
If to set `localServer.customPort: 8080`, error will be emitted because port 8080 is already in use.
To solve it, the `proxy: "localhost:8080"` requires instead.
As result `proxy: "localhost:3000"` will be opened, however it will refer to `"localhost:8080"`.


#### `openInBrowsers`

<dl>
  <dt>Type</dt>
  <dd>Array of strings or lone string</dd>
  <dt>Required</dt>
  <dd>false</dd>
</dl>

Once project has build, the default browser will be opened.
If specific browser or multiple of them required to open, define their names in this property.
These names are lower cased, for example:

* chrome
* firefox
* edge


#### `browserSyncUserInterface`

In addition to browser live reloading the Browsersync provides the GUI.
It could be accessed via browser.

##### `customPort`

<dl>
  <dt>Type</dt>
  <dd>number</dd>
  <dt>Required</dt>
  <dd>false</dd>
</dl>

As in the case with main port, the default port for Browsersync interface is being selected automatically.
If main port is **3000** and **3001** is vacant, port **3001** will be selected. 
If you want to assign the specific port, use this option, however it must be vacant otherwise error will be thrown.


##### `disable`

<dl>
  <dt>Type</dt>
  <dd>boolean</dd>
  <dt>Required</dt>
  <dd>false</dd>
</dl>

Disables the Browsersync UI.


#### `periodBetweenFileUpdatingAndBrowserReloading__seconds`

<dl>
  <dt>Type</dt>
  <dd>number</dd>
  <dt>Default value</dt>
  <dd>0.5</dd>
</dl>


If to reload the browser for each updated output file, it will be a lot of reloads and sometimes - multiple reloads per second.
To prevent this, once some out file has updated, the YDA waits `periodBetweenFileUpdatingAndBrowserReloading__seconds` period 
  for the subsequent files will update.

For the new project with few files, the default value is enough, however with the increase of source/output files,
  maybe this value will need to be increased too.
