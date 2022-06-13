# Yamato-Daiwa Automation [ YDA ]

The project building tool with declarative YAML configuration based on Gulp and Webpack.
Specializing on Pug, Stylus and TypeScript as source code languages; also works with images, fonts, videos and audios.
Could be used for development of websites, web applications, console utilities and libraries.

![Main visual of Yamato-Daiwa Automation tool](https://user-images.githubusercontent.com/41653501/167278259-b2ac61e9-b781-4d0c-93d6-4b9709387974.png)


## Installation

```
npm i @yamato-daiwa/automation -D -E
```


## Required terminology

<dl>

  <dt>YDA</dt>
  <dd>The abbreviation of <b>Yamato-Daiwa Automation</b>, the name of this tool.</dd>

  <dt>Task</dt>
  <dd>
    The specialized work for the computer among project building automation, for example, the processing of markup or 
    automatic browser reloading. 
  </dd>

  <dt>Scenario</dt>
  <dd>
    The <b>tasks</b> set where tasks been arranged into sequences and series. The appropriate arrangement is critical for both
    correct project building and optimization.
  </dd>

  <dt>Entry points and partials</dt>
  <dd>
    The name of <b>design pattern</b>. The specific meaning is depending on certain files and technology type.
    <ul>
      <li>
        In <b>markup</b> case, the <b>entry point</b> is the file representing the <i>complete</i> HTML document.
        Basically, HTML file could not be split to partials, but the pre-processors like Pug allows to do it for example, 
        for the reusing of certain partial files.
        Here <b>parent file</b> and <b>partials</b> must be distinguished.
        THe <dfn>parent file</dfn> must be compiled to separate HTML file while <dfn>partials</dfn> must not. 
      </li>
      <li>
        In <b>styles</b> case, the <b>entry point</b> is the file representing the single stylesheet.
        The usage of multiple CSS files in single HTML document is normal practice for both past and modernity,
        but the composing of CSS file from multiple source files is another option (moreover, these approaches could be combined,
        for example, one stylesheet with common styles and one stylesheet with the styles for certain page, herewith both
        stylesheets has been built from multiple partial source files).
        Basically, the CSS file could not be split to partials, but the pre-processors like Stylus allows to do it.
      </li>
      <li>
        In <b>ECMAScript logic</b> case, the entry point is the JavaScript file from which the execution of application starting.
        <ul>
          <li>
            For the front-end (client side), normally it must be one entry point per HTML document.
            The usage of multiple JavaScript files per HTML document without main one is skill existing methodology,
            but the project building tools has been created to replace it with organized entry point.
          </li>
          <li>The Single Page Applications (SPA) has one and only entry point, but for the web-sites it could be one entry point per HTML page.</li>
          <li>
            The project building systems like Webpack which YDA using can automatically extreact the common part from
            multiple entry points for the performance, but these extracted files are not entry points and called <dfn>chunks</dfn>.
          </li>
          <li>For the server application, <b>single entry point</b> is strongly recommended pattern.</li>
        </ul>
      </li>
    </ul>
  </dd>

  <dt>Assets</dt>
  <dd>
    The common term for images, fonts, audios and videos. All of these elements are being frequently used in
    modern websites and applications.
  </dd>

  <dt>Selective execution</dt>
  <dd>
    The selection of <b>tasks</b>, and also <b>entry points groups</b> and <b>assets groups</b>.
    As default, all tasks specified in the configuration file will be executed and also all entry points groups and assets 
    groups will be processed, but selective execution functionality allows to it selectively.
  </dd>
</dl>


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
