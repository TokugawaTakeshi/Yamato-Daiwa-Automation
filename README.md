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

Please familiarize with the YDF terminology because it has being used in configuration.

[📖 Terminology](Documentation/Terminology/Terminology.md)


## How-tos

* [How to specify the paths of stylesheets, scripts, images, videos and audios from the markup?](Documentation/HowTos/ResourcesPathResolving.md)


## API

### Configuration file

As default, **yda.config.yaml** file will be searched in project root directory. 

* [Common settings](Documentation/CommonSettings.md)
* [Markup processing settings](Documentation/MarkupProcessing.md)
* [Styles processing settings](Documentation/StylesProcessing.md)
* [ECMAScript logic processing settings](Documentation/ECMA_ScriptProcessing.md)
* [Assets processing settings](Documentation/AssetsProcessing.md)
* [Browser live reloading settings](Documentation/BrowserLiveReloading.md)


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
      <li>DEVELOPMENT</li>
      <li>TESTING</li>
      <li>STAGING</li>
      <li>PRODUCTION</li>
    </ul>
  </dd>

</dl>

The project building mode; affecting on, for example, output directory or code minification.
See **buildingModeDependent** configuration of each task.

```bash
yda build --mode DEVELOPMENT
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


### Configuration file

As default, **yda.config.yaml** will be searched in the directory where command has been executed.


### Vulnerabilities

Depending on Gulp, pre-processors and other utils, YDA inherits theirs vulnerabilities.
Once these vulnerabilities will be fixed in dependencies, it will be fixed in YDA.

The most problematic packages are:

* gulp
* access-sniff
