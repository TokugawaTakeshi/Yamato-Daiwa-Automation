import { createApp as createVueApplication } from "vue";
import ApplicationRootComponent from "./ApplicationRootComponent.vue";
import samplePugRendererFunction from "./Assets/SampleMarkup.renderer.pug";
import sampleHTML_FromPug from "./Assets/SampleMarkup.pug"


console.log("=== Sample Pug Renderer ======");
console.log(samplePugRendererFunction());

console.log("=== Sample HTML from Pug ======");
console.log(sampleHTML_FromPug);


createVueApplication(ApplicationRootComponent).mount("#APPLICATION");
