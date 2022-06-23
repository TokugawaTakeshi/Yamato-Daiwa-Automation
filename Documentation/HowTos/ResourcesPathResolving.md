# How to specify the paths of stylesheets, scripts, images, videos and audios from the markup

## Knowing the problems first

### The problems of absolute path

Consider below setup. The image files below **01-Source/Infrastructure/Elements/Client/SharedAssets/Images/Articles**
will be copy below **02-DevelopmentBuild/StaticPreview** and **http://localhost:3000** will refer to this directory:  

```yaml
projectBuilding:

  entryPointsGroups:

    Pages:

      entryPointsSourceFilesTopDirectoryOrSingleFileRelativePath: 01-Source/Infrastructure/Elements/Client/StaticPreview

      buildingModeDependent:
        DEVELOPMENT:
          outputBaseDirectoryRelativePath: 02-DevelopmentBuild/StaticPreview

  imagesProcessing:

    assetsGroups:

      Articles:

        sourceFilesTopDirectoryRelativePath: 01-Source/Infrastructure/Elements/Client/SharedAssets/Images/Articles
        buildingModeDependent:
          DEVELOPMENT:
            outputBaseDirectoryRelativePath: 02-DevelopmentBuild/StaticPreview
            
  browserLiveReloading:

    StaticPreview:

      targetFilesRootDirectoryRelativePath: 02-DevelopmentBuild/StaticPreview
      customStartingFilenameWithExtension: StaticPreviewAnywherePage.html
```

Now we can refer to the file **01-Source/Infrastructure/Elements/Client/SharedAssets/Images/Articles/Cats/Kitten.jpg**
(will be output to **02-DevelopmentBuild/StaticPreview/Cats/Kitten.jpg**) as:

```pug
img(src="/Cats/Kitten.jpg")
```

What's wrong? First we need to compute in out head the destination of **Kitten.jpg**.
But it will work while we are using the local development server.
What if wee need to send the files for the check to customer or manager?
If he opens file in **C:\Users/Takeshi Tokugawa/Downloads**, for example, the **Kitten.jpg** will not display,
because **/Cats/Kitten.jpg** will be resolved as **C:/Cats/Kitten.jpg**.

Neither customers nor managers must to install the npm dependencies, start the project building etc. because they are
not engineers. Open just 1 HTML file and can check everything - it is that what required, and shortened absolute paths
does not fit to this approach.


### The problems of relative path


## YDA solution

**YDA** works with named groups of resources. Each group has either it's top directory or consists from single file
(stylesheets and scripts case only). In the below example, we have group **StaticPreview** represented by single stylesheet
**01-Source/Infrastructure/Elements/Client/StaticPreview/AllStyles.styl** and group **Articles** of images:

```yaml
projectBuilding:

  stylesProcessing:

    entryPointsGroups:

      StaticPreview:

        entryPointsSourceFilesTopDirectoryOrSingleFileRelativePath: 01-Source/Infrastructure/Elements/Client/StaticPreview/AllStyles.styl
        buildingModeDependent:
          DEVELOPMENT:
            outputBaseDirectoryRelativePath: 02-DevelopmentBuild/StaticPreview

  imagesProcessing:

    assetsGroups:

      Articles:

        sourceFilesTopDirectoryRelativePath: 01-Source/Infrastructure/Elements/Client/SharedAssets/Images/Articles
        buildingModeDependent:
          DEVELOPMENT:
            outputBaseDirectoryRelativePath: 02-DevelopmentBuild/Application/public
          PRODUCTION:
            outputBaseDirectoryRelativePath: 03-ProductionBuild/public
```

For each group, the reference **@<Group name>** being generated. For the above example, references **@StaticPreview** and
**@Articles** will be generated.

**@StaticPreview** refers to the stylesheet **01-Source/Infrastructure/Elements/Client/StaticPreview/AllStyles.styl**
because there are no other stylesheets in this group. So it could be accessed as

```pug
link(href="StaticPreview" rel="stylesheet")
```

**@Articles** refers to **01-Source/Infrastructure/Elements/Client/SharedAssets/Images/Articles**, it's 
top directory. So, for example, the image **01-Source/Infrastructure/Elements/Client/SharedAssets/Images/Articles/Animals/Cat.jpg**
could be accessed as:

```pug
img(src="@Articles/Animals/Cat.jpg")
```

When you are defining the assets group ID ("Pages" and "Components" in below example), the source group directory alias
will be automatically defined ("@Pages" and "@Components" for the below example):

### Into what these aliased paths will be resolved?
