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
    },
    methods: {
      isMobile() {
        return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
      }
    },
    mounted() {
      if (this.isMobile()) {
        window.location.href = 'http://m.coconutmilk.club'
      }
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
