/* eslint-disable-next-line n/no-unpublished-import -- Nor required for deployment. */
import { TemplatesGenerator } from "@yamato-daiwa/documentation-files-templates";


TemplatesGenerator.generate({
  functionality: [
    {
      templatePathRelativeToProjectDirectory: "Automation/Templates/Functionality/Functionality.english.template.pug",
      outputFileNamePattern: "[BASIC_FILE_NAME].english.pug"
    },
    {
      templatePathRelativeToProjectDirectory: "Automation/Templates/Functionality/Functionality.japanese.template.pug",
      outputFileNamePattern: "[BASIC_FILE_NAME].japanese.pug"
    },
    {
      templatePathRelativeToProjectDirectory: "Automation/Templates/Functionality/Functionality.russian.template.pug",
      outputFileNamePattern: "[BASIC_FILE_NAME].russian.pug"
    },
    {
      templatePathRelativeToProjectDirectory: "Automation/Templates/Functionality/Functionality.toc.template.yaml",
      outputFileNamePattern: "[BASIC_FILE_NAME].toc.yaml",
      subdirectory: "TableOfContents"
    },
    {
      templatePathRelativeToProjectDirectory: "Automation/Templates/Functionality/Functionality.toc.english.template.yaml",
      outputFileNamePattern: "[BASIC_FILE_NAME].toc.english.yaml",
      subdirectory: "TableOfContents"
    },
    {
      templatePathRelativeToProjectDirectory: "Automation/Templates/Functionality/Functionality.toc.japanese.template.yaml",
      outputFileNamePattern: "[BASIC_FILE_NAME].toc.japanese.yaml",
      subdirectory: "TableOfContents"
    },
    {
      templatePathRelativeToProjectDirectory: "Automation/Templates/Functionality/Functionality.toc.russian.template.yaml",
      outputFileNamePattern: "[BASIC_FILE_NAME].toc.russian.yaml",
      subdirectory: "TableOfContents"
    }
  ]
});
