# Entry points and children files distinction

> :bulb: **Tip:** This concept is actual for **markup** and **styles** pre-processing

As default, all files of supported filename extensions below specified `topDirectoryRelativePath` are being considered
as **entry points** thus will be compiled to separate files. To change this behaviour, use `partialsRecognition` option,
the object with below properties.

<dl>

  <dt>excludeAllSubdirectories</dt>
  <dd>
    When being set to <b>true</b>, all files in all subdirectories of <b>topDirectoryRelativePath</b> will not be 
    compiled to separate files.
  </dd>

  <dt>excludeSubdirectoriesWithNames</dt>
  <dd>
    When being specified with array of subdirectories or single subdirectory, all files in these subdirectories 
    will not be compiled to separate files.
  </dd>

  <dt>excludeSubdirectoriesWithPrefixes</dt>
  <dd>
    When being specified with array of string values or single string value, all files in directories
    starting with these prefixes will not be compiled to separate files. 
  </dd>
  <dt>excludeFilesWithPrefixes</dt>
  <dd>
     When being specified with array of string values or single string value, all files which names
     starting with these prefixes will not be compiled to separate files.
  </dd>
</dl>


## Example

Consider the below structure.

```
📂 Sample
┣ 📂 Directory1
┃  ┗ 📜File1-1.pug
┃  ┗ 📜_File1-2.pug
┣ 📂 _Directory2
┃ ┗ 📜File2-1.pug
┃ ┗ 📜_File2-2.pug
┣ 📜 File3-1.pug
┗ 📜 _File3-2.pug
```

Without defined `partialsRecognition` all above files will be considered as entry points therefore will be compiled
to separate HTML files.

`excludeAllSubdirectories: true` will filter out files in all subdirectories:

```
📂 Sample
┣ 📂 Directory1
┃  ┗ 📜File1-1.pug ✖
┃  ┗ 📜_File1-2.pug ✖
┣ 📂 _Directory2
┃ ┗ 📜File2-1.pug ✖
┃ ┗ 📜_File2-2.pug ✖
┣ 📜 File3-1.pug 〇
┗ 📜 _File3-2.pug 〇
```

`excludeSubdirectoriesWithNames: [ "Directory1" ]` will filter out the files in `Directory1`:

```
📂 Sample
┣ 📂 Directory1
┃  ┗ 📜File1-1.pug ✖
┃  ┗ 📜_File1-2.pug ✖
┣ 📂 _Directory2
┃ ┗ 📜File2-1.pug 〇
┃ ┗ 📜_File2-2.pug 〇
┣ 📜 File3-1.pug 〇
┗ 📜 _File3-2.pug 〇
```

`excludeSubdirectoriesWithPrefixes: [ "_" ]` will filter out the files in subdirectory `_Directory2` (and other subdirectories
which names begin from `_`):

```
📂 Sample
┣ 📂 Directory1
┃  ┗ 📜File1-1.pug 〇
┃  ┗ 📜_File1-2.pug 〇
┣ 📂 _Directory2
┃ ┗ 📜File2-1.pug ✖
┃ ┗ 📜_File2-2.pug ✖
┣ 📜 File3-1.pug 〇
┗ 📜 _File3-2.pug 〇
```

`excludeFilesWithPrefixes: [ "_" ]` will filter out all files starts with `_`:

```
📂 Sample
┣ 📂 Directory1
┃  ┗ 📜File1-1.pug 〇
┃  ┗ 📜_File1-2.pug ✖
┣ 📂 _Directory2
┃ ┗ 📜File2-1.pug 〇
┃ ┗ 📜_File2-2.pug ✖
┣ 📜 File3-1.pug 〇
┗ 📜 _File3-2.pug ✖
```

## Use case

Assume that the entry point **TopPage.pug** including files **MainVisual.pug**, **NewsFeed.pug**, **Service.pug**,
thus only **TopPage.pug** must be compiled to separate **TopPage.html** file.

```
📂 Pages
┗ 📂 Top
   ┣ 📜TopPage.pug 〇
   ┗ 📂 Partials
     ┣ 📜 MainVisual.pug
     ┣ 📜 NewsFeed.pug
     ┗ 📜 Service.pug
```

First, we can ignore `Pages/Top/Partials` directory by `excludeSubdirectoriesWithNames: [ "Partials" ]`, but
there could be multiple pages like `Top`.

Other option is the convention "All directories begins from underscore containing the partials". 
In this case `excludeSubdirectoriesWithPrefixes: [ "_" ]` will be the solution.
