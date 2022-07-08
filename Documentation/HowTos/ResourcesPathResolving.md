# How to specify the paths of stylesheets, scripts, images, videos and audios from the markup

## Knowing the problems first

### The problems of absolute path

Consider below setup. According to it, the image files below **01-Source/Infrastructure/Elements/Client/SharedAssets/Images**
will be copied below **02-DevelopmentBuild/StaticPreview/Images** and **http://localhost:3000** will refer to
**02-DevelopmentBuild/StaticPreview** local directory:  

```yaml
projectBuilding:

  entryPointsGroups:

    StaticPreview:

      entryPointsSourceFilesTopDirectoryOrSingleFileRelativePath: 01-Source/Infrastructure/Elements/Client/StaticPreview

      buildingModeDependent:
        DEVELOPMENT:
          outputBaseDirectoryRelativePath: 02-DevelopmentBuild/StaticPreview

  imagesProcessing:

    assetsGroups:

      Shared:

        sourceFilesTopDirectoryRelativePath: 01-Source/Infrastructure/Elements/Client/SharedAssets/Images
        buildingModeDependent:
          DEVELOPMENT:
            outputBaseDirectoryRelativePath: 02-DevelopmentBuild/StaticPreview/Images
            
  browserLiveReloading:

    StaticPreview:

      targetFilesRootDirectoryRelativePath: 02-DevelopmentBuild/StaticPreview
      customStartingFilenameWithExtension: StaticPreviewAnywherePage.html
```

Now we can refer to the file **01-Source/Infrastructure/Elements/Client/SharedAssets/Images/Cats/GrayKitten.jpg**
(will be output to **02-DevelopmentBuild/StaticPreview/Images/Cats/Kitten.jpg**) by shortened absolute path:

```pug
img(src="/Images/Cats/GrayKitter.jpg" alt="The gray kitten")
```

Basically everything is all right, but what's wrong? 

First we need to compute in our head the destination of **Kitten.jpg**.
If the project building system is forces to do it, it is a bad project building system. 

Second, the image will display as long as the HTML and image file are being hosted from some server - local development
server or actual one - the **/Images/Cats/Kitten.jpg** will be resolved to **http://localhost:3000/Images/Cats/Kitten.jpg** .
But what if wee need to send the files for the check to our customer or manager?

If he opens file in **C:\Users\GretCustomer\Downloads** for example, the **Kitten.jpg** will not be displayed,
because **/Cats/Kitten.jpg** will be resolved as **C:\Images\Cats\Kitten.jpg**. 
And what you will say to made angry customer?
"Oh, it is because you have not the local server! You need to install the Node.js in your local computer, then I'll
send you the source code. Next, you need to install all dependencies and run the local server via console command!".

Neither customers nor managers must understand in Node.js, source code management, dependencies management, 
project building etc. All that they want is open - and everything works. Well, the shared development servers are
one of the options, but the sharing of HTML/CSS files is completely valid option, but this method is not compatible
with absolute paths to resources.


### The problems of relative path

Assume that besides shared image we have the images associated with the components:  

```yaml
projectBuilding:

  # ...

  imagesProcessing:

    assetsGroups:

      Shared:

        # ...
            
      Components:

        sourceFilesTopDirectoryRelativePath: 01-Source/Infrastructure/Elements/Client/Components
        buildingModeDependent:
          DEVELOPMENT:
            outputBaseDirectoryRelativePath: 02-DevelopmentBuild/StaticPreview/Images/Components
          
            
  # ...
```

Now, for example, in the **Header** component, we can refer to 
**01-Source/Infrastructure/Elements/Client/Components/SharedSingletons/Header/Logo.png** as:

```pug
header.Header
  img(src="Images/Components/SharedSingletons/Header/Logo.png" alt="The logo of the service")
```

What is wrong in this time?

First, the image will be displayed if and only if the HTML file including above header component is directly 
below **02-DevelopmentBuild/StaticPreview** (for example, **02-DevelopmentBuild/StaticPreview/TopPage.html**).
But what if it is deeper, for example, **02-DevelopmentBuild/StaticPreview/Services/Restoration.html**?
The **Images/Components/SharedSingletons/Header/Logo.png** will be resolved to
**02-DevelopmentBuild/StaticPreview/Services/Images/Components/SharedSingletons/Header/Logo.png** that is wrong path.

The header as any other reusable component should be in the separate file 
(**01-Source/Infrastructure/Elements/Client/Components/SharedSingletons/Header/Header.pug**, for example).
Specifying the path **Images/Components/SharedSingletons/Header/Logo.png** we are assuming that **Images** folder
must be in the same directory as output HTML files, including the compiled HTML code of the header component.
We can't know it advance, according to components development concept, we don't know at advance where the component
will be used.


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
