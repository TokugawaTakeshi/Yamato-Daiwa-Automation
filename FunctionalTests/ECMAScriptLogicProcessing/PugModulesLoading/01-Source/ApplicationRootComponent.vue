<template lang="pug">
//- using `@webdiscus/pug-loader`, you can add indent here
ExampleSingleFileComponent
ExampleMultipleFilesComponent

</template>


<script lang="ts">

  /* --- Other components ------------------------------------------------------------------------------------------- */
  import ExampleSingleFileComponent from "./Components/ExampleSingleFileComponent.vue";
  import ExampleMultipleFilesComponent from "./Components/ExampleMultipleFilesComponent/ExampleMultipleFilesComponent.vue";

  /* --- Framework -------------------------------------------------------------------------------------------------- */
  import { Component as VueComponentConfiguration, Vue as VueComponent } from "vue-facing-decorator";


  @VueComponentConfiguration({
    components: {
      ExampleSingleFileComponent,
      ExampleMultipleFilesComponent
    }
  })
  export default class ApplicationRootComponent extends VueComponent {}

</script>
