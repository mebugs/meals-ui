<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">Meal’S</h3>
      </div>

      <el-form-item prop="name">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="name"
          v-model="loginForm.name"
          placeholder="请输入账号"
          name="name"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Login</el-button>

      <div class="tips">
        <span style="margin-right:20px;">name: admin</span>
        <span> password: 123456</span>
      </div>

    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        name: '',
        password: ''
      },
      loginRules: {
        name: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
            this.$message.error('账户密码错误或被锁定')
          })
        } else {
          this.$message.warning('请输入账号密码后提交')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.login-container{height:100%;width:100%;background:url(/bg.jpg) no-repeat;background-position:100% 100%;position:relative;}
.login-form {position: absolute;width: 500px;height: 100vh;padding: calc(50vh - 250px) 20px;left: calc(50vw - 600px);top: 0;background: rgba(0,0,0,0.5);}
.title {overflow: hidden;position: relative;line-height: 80px;text-align: center;font-size: 50px;color: #fff;}
.el-form-item{border:1px solid #999;background:rgba(0,0,0,0.2);border-radius:0;color:#454545}
.el-input{display:inline-block;height:47px;width:84%;margin-left: 5px;}
.el-input>>>input{margin:7px 0 0 2px;background-color:#222;border:1px solid #999;border-radius:0;color:#fff}
.el-input>>>input:-webkit-autofill{box-shadow:0 0 0 1000px #222 inset!important;-webkit-text-fill-color:#fff!important}
.tips{font-size:14px;color:#fff;margin-bottom:10px;text-align: center;}
.tips span:first-of-type{margin-right:16px}
.svg-container{padding:6px 5px 6px 15px;color:#999;vertical-align:middle;width:30px;display:inline-block}
.title-container{position:relative}
.title:before{content:"";position:absolute;left:-160px;top:-10px;width:240px;height:30px;background-color:rgba(255,255,255,0.3);transform:rotate(-50deg);animation:searchLights 1.5s ease-in 0s infinite}
@keyframes searchLights{0{left:-160px;top:-10px;}
100%{left:100%;top:80%;}
}
.show-pwd{position:absolute;right:10px;top:7px;font-size:16px;color:#999;cursor:pointer;user-select:none}
.login-form button.el-button{background-color: #000;border-color: #000;}
</style>
