<template>
  <div id="nav">
    <el-menu :default-active="$route.path"
             class="el-menu-demo"
             router
             mode="horizontal">
      <el-menu-item class="is-active large-font">音乐播放器后台管理系统</el-menu-item>
      <el-menu-item v-if="hasLogin" class="is-active">管理员：{{userInfo.username}}</el-menu-item>
      <el-menu-item v-if="hasLogin" class="right" @click="bindLogout">退出登录</el-menu-item>
      <el-menu-item v-if="!hasLogin" class="right" index="/login">登录</el-menu-item>
      <el-menu-item v-if="!hasLogin" class="right" index="/register">注册</el-menu-item>
      <el-menu-item class="right" index="/poster">推荐管理</el-menu-item>
      <el-menu-item class="right" index="/playlist">歌单管理</el-menu-item>
      <el-menu-item class="right" index="/song">歌曲管理</el-menu-item>
    </el-menu>
    <div class="line"></div>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: "Header",
    data() {
      return {}
    },
    computed: {
      ...mapState(['hasLogin', 'userInfo'])
    },

    methods: {
      ...mapMutations(['logout']),
      bindLogout() {
        this.logout();
        window.location.reload();
      }
    }
  }
</script>

<style scoped lang="less">
  #nav {
    .right {
      float: right;
    }

    .large-font {
      font-size: 120%;
      font-weight: bolder;
    }
  }
</style>
