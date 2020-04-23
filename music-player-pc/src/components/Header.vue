<template>
  <div id="nav">
    <el-menu :default-active="path"
             class="el-menu-demo"
             router
             mode="horizontal">
      <el-menu-item>音乐播放器后台管理系统</el-menu-item>
      <el-menu-item class="right" @click="logout">退出登录</el-menu-item>
      <el-menu-item class="right" index="/login">登录</el-menu-item>
      <el-menu-item class="right" index="/register">注册</el-menu-item>
      <el-menu-item class="right" index="/">推荐管理</el-menu-item>
      <el-menu-item class="right" index="/">歌单管理</el-menu-item>
      <el-menu-item class="right" index="/">歌曲管理</el-menu-item>
    </el-menu>
    <div class="line"></div>
  </div>

</template>

<script>
  export default {
    name: "Header",
    data() {
      return {
        path: '',
      }
    },
    watch: {
      '$route': {
        handler() {
          this.onRouteChanged();
        },
        immediate: true
      }
    },
    methods: {
      onRouteChanged() {
        this.path = this.$route.path
      },
      logout() {
        console.log('logout')
      }
    }
  }
</script>

<style scoped lang="less">
  #nav {
    .right {
      float: right;
    }
  }
</style>
