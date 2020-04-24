<template>
  <div id="login" class="my-form">
    <h3>管理员登录</h3>
    <el-form :model="loginForm"
             ref="loginForm"
             label-width="100px"
             class="demo-ruleForm">
      <el-form-item
          label="用户名"
          prop="username"
          :rules="[
      { required: true, message: '用户名不能为空'},
      { min: 5, message: '用户名至少 5 个字符'}
    ]">
        <el-input v-model="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item
          label="密码"
          prop="password"
          :rules="[
      { required: true, message: '密码不能为空'},
      { min: 6, message: '密码至少 6 个字符'}
    ]">
        <el-input v-model="loginForm.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="submitForm('loginForm')">登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {mapActions} from 'vuex';
  export default {
    name: "login",
    data() {
      return {
        loginForm: {
          username: '',
          password: ''
        }
      }
    },
    methods: {
      ...mapActions(['login']),
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.login(this.loginForm)
              .then(res => {
                console.log(res)
              });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>

<style lang="less" scoped>
  #login {
    h3 {
      text-align: center;
    }
    width: 340px;
    margin: 140px auto;
  }
</style>
