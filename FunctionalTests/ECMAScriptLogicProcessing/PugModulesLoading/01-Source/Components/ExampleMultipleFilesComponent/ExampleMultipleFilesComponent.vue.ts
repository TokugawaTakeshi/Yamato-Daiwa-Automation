import componentTemplate from "./ExampleMultipleFilesComponent.vue.pug";
import { Component as VueComponentConfiguration, Vue as VueComponent } from "vue-facing-decorator";


console.log("---------------");
console.log(componentTemplate);

@VueComponentConfiguration({
  template: componentTemplate,
  // template: componentTemplate(tmplVariables) // if is used the `method: 'compile'`, then template is the function, you can pass custom data
  //template: componentTemplate() // if is used the `method: 'compile'`, w/o custom data
  //template: componentTemplate // if is used the `method: 'render'`, then template is already rendered string
})
export default class ExampleMultipleFilesComponent extends VueComponent {}
