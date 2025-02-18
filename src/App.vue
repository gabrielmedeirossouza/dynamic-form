<template>
  <div id="app">
    <GridMetadataForm :components="metadataFormComponents" />
  </div>
</template>

<script>
import GridMetadataForm from './components/GridMetadataFormEditor.vue'
import TextMetadata from './components/TextMetadata.vue'

export default {
  name: 'App',
  components: {
    GridMetadataForm,
  },
  data() {
    return {
      metadataFormComponents: {
        text: TextMetadata
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
