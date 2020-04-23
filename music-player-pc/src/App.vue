<template>
  <div id="app">
    <my-header></my-header>
    <router-view/>
  </div>
</template>
<script>
  import myHeader from './components/Header.vue';
  export default {
    components: {
      myHeader
    }
  }
</script>
<style lang="less">
  body {
    margin: 0;
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

</style>
