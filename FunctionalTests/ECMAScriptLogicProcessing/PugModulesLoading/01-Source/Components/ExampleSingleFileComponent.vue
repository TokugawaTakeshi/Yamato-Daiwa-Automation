<template lang="pug">
//- using `@webdiscus/pug-loader`, you can add indent here
div Example Single File Component

</template>


<script lang="ts">

  import { Component as VueComponentConfiguration, Vue as VueComponent } from "vue-facing-decorator";


  @VueComponentConfiguration({})
  export default class ExampleSingleFileComponent extends VueComponent {}

</script>
