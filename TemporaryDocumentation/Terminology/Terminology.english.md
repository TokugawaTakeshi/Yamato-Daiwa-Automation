# Terminology

## YDA

## Task

## Scenario

## Entry points and partials

## Assets

## Selective execution


<dl>

  <dt>YDA</dt>
  <dd>
    The abbreviation of <b>Yamato Daiwa Automation</b>, the name of this tool.
    The <b>Yamato Daiwa</b> is the name of future Japanese startup which initially will be specializing on 
    entrusted development of web applications and native applications.
  </dd>

  <dt>Task</dt>
  <dd>
    The specialized work for the computer among project building automation. 
    Currently YDA suggesting below tasks:
    <ul>
      <li>Markup processing</li>
      <li>Styles processing</li>
      <li>ECMAScript logic processing</li>
      <li>Images processing</li>
      <li>Font files processing</li>
      <li>Audio files processing</li>
      <li>Video files processing</li>
      <li>Browser live reloading</li>
    </ul>
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
        The <dfn>parent file</dfn> must be compiled to separate HTML file while <dfn>partials</dfn> must not. 
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


***

## Read on other languages

* [日本語（Japanese）](Terminilogy.japanese.md)
