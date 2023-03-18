# Yamato Daiwa Automation 〔YDA〕

The project building tool with declarative YAML configuration based on Gulp and Webpack.
Specializing on Pug, Stylus and TypeScript as source code languages; also works with images, fonts, videos and audios. 

![Main visual of Yamato-Daiwa Automation tool](https://user-images.githubusercontent.com/41653501/167278259-b2ac61e9-b781-4d0c-93d6-4b9709387974.png)

[📖 Documentation](https://github.com/TokugawaTakeshi/Yamato-Daiwa-Automation/blob/master/README.md)


## Installation

```
npm i @yamato-daiwa/automation -D -E
```


## Dependencies list

<dl>

  <dt>@vue/compiler-sfc, vue, vue-loader</dt>
  <dd>Used to provide the support of Vue Single File Components for ECMAScript logic processing</dd>

  <dt>@webdiscus/pug-loader</dt>
  <dd>
    Used to provide the bundling of the Pug code to output JavaScript code by Webpack.
    The better alternative of **pug-html-loader** because last one has multiple high and critical vulnerabilities
      (at least it was so for the February 2023).
  </dd>

  <dt>@yamato-daiwa/es-extensions, @yamato-daiwa/es-extensions-nodejs</dt>
  <dd>Used to reduce the routine code</dd>

  <dt>@yamato-daiwa/style_guides</dt>
  <dd>The code style guides to which this project obeying and also suggested for the consuming project</dd>

  <dt>autoprefixer</dt>
  <dd>Used for adding of the vendor prefixes to CSS properties in processed stylesheets the better cross-browser adaptations</dd>

  <dt>browser-sync</dt>
  <dd>Used to provide the automation of browser opening and reloading when project incrementally rebuilt</dd>

  <dt>cheerio</dt>
  <dd>Used for manipulation with compiled HTML code like resolving of paths aliases</dd>

  <dt>css-loader</dt>
  <dd>Used to provide the imports of stylesheets to ECMAScript bundles</dd>

  <dt>cssnano</dt>
  <dd>Used to provide optimization and minification of compiled CSS code</dd>

  <dt>eslint-webpack-plugin</dt>
  <dd>Used to provide the ESLint inspection with output to terminal during processing of ECMAScript logic</dd>

  <dt>fork-ts-checker-webpack-plugin</dt>
  <dd>Used to improve the performance of TypeScript transpiling functionality</dd>

  <dt>gulp</dt>
  <dd>Used as main task manager, the tool for providing of arranging of the tasks to sequences and series and running them</dd>

  <dt>gulp-data</dt>
  <dd>Used to provide the global variables defined by user in appropriate configuration inside the Pug templates</dd>

  <dt>gulp-debug</dt>
  <dd>Used to outputs the processed files names and quantity to the terminal</dd>

  <dt>gulp-html-prettify</dt>
  <dd>Used to provide the formatting of output HTML code better than suggested by Pug pre-processor</dd>

  <dt>gulp-if</dt>
  <dd>Used for providing of conditional processing according to various settings</dd>

  <dt>gulp-imagemin</dt>
  <dd>Used to provide the automation of images files optimization</dd>

  <dt>gulp-intercept</dt>
  <dd>Used for defining of configuration-dependent logic inside Gulp pipelines</dd>

  <dt>gulp-plumber</dt>
  <dd>Used for errors handing inside Gulp pipelines</dd>

  <dt>gulp-postcss</dt>
  <dd>Used to provide the post-processing of CSS code with PostCSS plugins</dd>

  <dt>gulp-pug</dt>
  <dd>Used to provide the basic Pug-to-HTML transpiling</dd>

  <dt>gulp-stylus</dt>
  <dd>Used to provide the basic Stylus-to-CSS transpiling</dd>

  <dt>html-validator</dt>
  <dd>Used to get the HTML validation data from W3C service. The formatted output to terminal has been implemented by YDA development side.</dd>

  <dt>imagemin-pngquant</dt>
  <dd>Used to provides the optimization of PNG files</dd>

  <dt>json5-loader</dt>
  <dd>Used to provide the imports of JSON5 as ECMAScript native object to JavaScript bundle</dd>

  <dt>node-notifier</dt>
  <dd>Used for accessing to native toast message functionality</dd>
  
  <dt>pug-lint</dt>
  <dd>Used to providing linting of Pug source code</dd>

  <dt>pug-plain-loader</dt>
  <dd>Used to providing of the Pug source code language for Vue templates in Single File Components</dd>

  <dt>rev-hash</dt>
  <dd>
    Used for generating of file content dependent postfixes to prevent the outdated stylesheets, scripts etc. 
    because of browser caching (thus actual for the Browser runtime only).
  </dd>

  <dt>stlint</dt>  
  <dd>Used for linting of styles written by Stylus. The formatted output to terminal has been implemented by YDA development side.</dd>

  <dt>stream-combiner2</dt>
  <dd>Used for creating of Gulp tasks with complicated conditionals and parallels.</dd>

  <dt>style-loader</dt>
  <dd>Used to provide the dynamic injection of CSS functionality which has been imported to JavaScript bundle built by Webpack</dd>

  <dt>stylus-loader</dt>
  <dd>
    Used to provide the dynamic loading of CSS witten by Stylus pre-processor which has been imported to JavaScript
    bundle built by Webpack
  </dd>

  <dt>ts-loader</dt>
  <dd>Used to provide the integration of TypeScript and Webpack</dd>

  <dt>vinyl</dt>
  <dd>
    Used to create new Gulp plugins. 
    Although this package is being installed indirectly, the importing of this package without manual installing will cause 
    "node/no-extraneous-import" ESLint issue and there is no reason to mute it.
  </dd>

  <dt>vue-style-loader</dt>
  <dd>Used to provide the dynamical loading of CSS written in Vue Single File Components to HTML document</dd>

  <dt>vue-tcs</dt>
  <dd>Used to provide the optimized type checking of Vue and also TypeScript files.</dd>
  
  <dt>webpack</dt>
  <dd>Used as basic tool for the ECMAScript logic processing</dd>
  
  <dt>webpack-node-externals</dt>
  <dd>
    Used to prevent the bundling of NodeJS modules by Webpack because this bundling brings a lot of warning and/or errors
    while not required for console and server applications
  </dd>

  <dt>webpack-stream</dt>
  <dd>
    Used only for the generating of Pug files with integrated JavaScript compiled from TypeScript.
    For this subtask, <b>webpack-stream</b> is perfect, but it has many limitations so it is not being used for the 
    main processing of ECMAScript logic.
  </dd>

  <dt>webpack-node-externals</dt>
  <dd>
    Used to prevent the bundling of NodeJS modules by Webpack because this bundling brings a lot of warning and/or errors
    while not required for console and server applications
  </dd>

  <dt>yaml-loader</dt>
  <dd>Used to provide the import of content of YAML files converted to JavaScript native object</dd> 

</dl>


### For development needs only

All **@types** are the TypeScript types definitions that required for normal transpiling of the TypeScript to JavaScript (Node.js).

<dl>

  <dt>ts-node</dt>
  <dd>Used to support the Webpack configuration written by TypeScript</dd>

  <dt>typescript</dt>
  <dd>Used to provide the TypeScript as source code language</dd>

  <dt>webpack-cli</dt>
  <dd>Used for the project building</dd>

</dl>


### Temporary dependencies

<dl>

  <dt>glob</dt>
  <dd>Used by <b>ImprovedGlob</b> which will be moved to <b>@yamato-daiwa/es-extensions-nodejs</b> and used as dependency </dd>

  <dt>minimatch</dt>
  <dd>used by <b>ImprovedGlob</b> which will be moved to <b>@yamato-daiwa/es-extensions-nodejs</b> and used as dependency </dd>

</dl>
