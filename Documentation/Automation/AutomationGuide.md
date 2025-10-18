# Automation Guide
## Creating of Files
### Functionality

**Windows**

```bash
# UNIX-like
tsx Automation/TemplatesGenerator.ts\
    functionality\
    '[ Route ]'\
    [ Directory ]\
    [ Output File Name Common Part ]
```

```powershell
# Windows
tsx Automation/TemplatesGenerator.ts `
    functionality `
    '[ Route ]' `
    [ Directory ] `
    [ Output File Name Common Part ]
```

For example, in

<dl>

  <dt>Route</dt>
  <dd><code>functionality.$children.markupProcessing.$children.staticPreview.$children.stateDependentPagesVariations</code></dd>

  <dt>Directory</dt>
  <dd>Functionality/MarkupProcessing/StaticPreview/StateDependentPagesVariations</dd>

  <dt>Output File Name Common Part<dt>
  <dd><code>StateDependentPagesVariations</code></dd>

</dl>

case it will be:

```bash
# UNIX-like
tsx Automation/TemplatesGenerator.ts\
    functionality\
    'functionality.$children.markupProcessing.$children.staticPreview.$children.stateDependentPagesVariations'\
    Functionality/MarkupProcessing/StaticPreview/StateDependentPagesVariations\
    StateDependentPagesVariations
```

```powershell
# Windows
tsx Automation/TemplatesGenerator.ts `
    functionality `
    'functionality.$children.markupProcessing.$children.staticPreview.$children.stateDependentPagesVariations' `
    Functionality/MarkupProcessing/StaticPreview/StateDependentPagesVariations `
    StateDependentPagesVariations
```
