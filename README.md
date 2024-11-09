# Yamato Daiwa Automation 〔 YDA 〕

The project building tool with declarative YAML configuration based on Gulp and Webpack.
Specializing on Pug, Stylus and TypeScript as source code languages; also works with images, fonts, videos and audios.
Could be used for development of websites, web applications, console utilities and libraries.

![Main visual of Yamato-Daiwa Automation tool](https://user-images.githubusercontent.com/41653501/167278259-b2ac61e9-b781-4d0c-93d6-4b9709387974.png)


## Installation

```
npm i @yamato-daiwa/automation -D -E
```


## Required terminology

Please familiarize with the YDF terminology because it is being used in documentation.

[📖 Terminology reference](TemporaryDocumentation/Terminology/Terminology.english.md)


## Conceptions

* [📖 Resolving of path to resources](TemporaryDocumentation/Functionality/Shared/ResourcesPathsResolving/ResourcesPathsResolving.english.md)


## API

### Configuration file

**YDA** required the configuration filed.
As default, **yda.config.yaml** file will be searched in the project root directory. 

* [Common settings](TemporaryDocumentation/API/ConfigurationFile/CommonSettings/CommonSettings.english.md)
* [Markup processing settings](Documentation/01-Source/Pages/ConfigurationFile/MarkupProcessing/MarkupProcessing.draft.md)
* [Styles processing settings](Documentation/01-Source/Pages/ConfigurationFile/StylesProcessing/StylesProcessing.draft.md)
* [ECMAScript logic processing settings](TemporaryDocumentation/API/ConfigurationFile/ECMA_ScriptProcessing/ECMA_ScriptProcessing.md)
* [Plain copying](TemporaryDocumentation/API/ConfigurationFile/PlainCopying/PlainCopying.md)

[//]: # (// TODO )
* [Assets processing settings](TemporaryDocumentation/AssetsProcessing.md)
* [Browser live reloading settings](TemporaryDocumentation/API/ConfigurationFile/BrowserLiveReloading/BrowserLiveReloading.english.md)


### Console

```bash
yda build
```

#### Parameters
##### mode

<dl>

  <dt>Type</dt>
  <dd>string</dd>

  <dt>Is required</dt>
  <dd>YES</dd>

  <dt>Shortcut</dt>
  <dd>m</dd>

  <dt>Allowed alternatives</dt>
  <dd>
    <ul>
      <li>STATIC_PREVIEW</li>
      <li>LOCAL_DEVELOPMENT</li>
      <li>TESTING</li>
      <li>STAGING</li>
      <li>PRODUCTION</li>
    </ul>
  </dd>

</dl>

The project building mode; affecting on, for example, output directory or code minification.
See **buildingModeDependent** configuration of each task.

```bash
yda build --mode LOCAL_DEVELOPMENT
```

### configurationFile


<dl>
  <dt>Type</dt>
  <dd>string</dd>  
  <dt>Default value</dt>
  <dd>yda.config.yaml</dd>
</dl>

The relative path to configuration file.
The file name extension ("yaml" of "yml") could be omitted.

```bash
yda build --configurationFile automation.yaml --mode DEVELOPMENT
```


### selectiveExecution

<dl>
  <dt>Type</dt>
  <dd>string</dd>
  <dt>Is required</dt>
  <dd>NO</dd>
</dl>

The ID of selective execution which must be defined in configuration file if to use this option.

```bash
yda build --selectiveExecution StaticPreview --mode DEVELOPMENT
```

### Vulnerabilities

Depending on Gulp, pre-processors and other utils, YDA inherits theirs vulnerabilities.
Once these vulnerabilities will be fixed in dependencies, it will be fixed in YDA.

The most problematic packages are:

* gulp
* access-sniff
