<template>
  <div class="login-container">
    <el-row :gutter="20"  type="flex" justify="center" :loading="loading">
      <el-col :xs="24" :sm="24" :md="12" :lg="9" :xl="9" style="transition: all 0.3s"  :loading="loading">
        <el-collapse-transition>
        <el-card v-if="isLogin" >
          <div slot="header" >
            <h3 class="title">登录</h3>
          </div>
          <el-form ref="loginForm"
                   :model="loginForm"
                   :rules="loginRules"
                   auto-complete="on" label-position="left">
            <el-form-item prop="username">
                      <span class="svg-container">
                        <svg-icon icon-class="user" />
                      </span>
              <el-input
                ref="username"
                v-model="loginForm.username"
                placeholder="Username"
                name="username"
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
                placeholder="Password"
                name="password"
                tabindex="2"
                auto-complete="on"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>

            <el-form-item prop="code">
              <span class="svg-container">
                <svg-icon icon-class="form" />
              </span>
              <el-input
                ref="code"
                v-model="loginForm.code"
                placeholder="验证码"
                name="code"
                type="text"
                tabindex="1"
                maxlength="4"
                minlength="4"
                auto-complete="off"
              />
            </el-form-item>

            <!--验证码图片-->
            <div @click="refreshLoginCode" class="code-container">
              <!--<img :src="loginCodeUrl"/>-->
              <img :src="loginCodeUrl"/>
            </div>

            <div style="margin:20px;" ><a @click="toRegister">没有账号，进行注册</a></div>
            <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
          </el-form>
        </el-card>


        <el-card v-if="!isLogin" >
          <div slot="header" >
            <h3 class="title">注册</h3>
          </div>
          <el-form ref="signupForm"
                   :model="signupForm"
                   :rules="signupRules"
                   class="signup-form" auto-complete="on" label-position="left">

            <el-form-item prop="name">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                ref="name"
                v-model="signupForm.name"
                placeholder="用户名"
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
                v-model="signupForm.password"
                :type="passwordType"
                placeholder="6位以上密码"
                name="password"
                tabindex="2"
                auto-complete="on"
                @keyup.enter.native="handleSignup"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>


            <el-form-item prop="email">
              <span class="svg-container">
                <svg-icon icon-class="email" />
              </span>
              <el-input
                ref="email"
                v-model="signupForm.email"
                type="text"
                placeholder="邮箱地址"
                name="email"
                tabindex="2"
                auto-complete="on"
              />
            </el-form-item>

            <el-form-item prop="code">
              <span class="svg-container">
                <svg-icon icon-class="form" />
              </span>
              <el-input
                ref="code"
                v-model="signupForm.code"
                placeholder="邮箱验证码"
                name="emailCode"
                type="text"
                tabindex="1"
                auto-complete="off">
              </el-input>
            </el-form-item>
          </el-form>
          <div style="margin:20px;" ><a @click="toLogin">已有账号，去登录</a></div>
          <div style="margin-bottom:20px;">
            <el-button
              :loading="emailBtnWaiting"
              :disable="emailBtnWaiting"
              type="primary"
              style="width:100%;"
              @click.native.prevent="getEmailCode">
              {{emailBtnText}}
            </el-button>
          </div>
          <div style="margin-bottom:30px;">
            <el-button  type="primary" style="width:100%;" @click.native.prevent="handleRegister">注册</el-button>
          </div>
        </el-card>

        </el-collapse-transition>
      </el-col>


    </el-row>

  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { login,loginCode,registerMail,register } from '@/api/account'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { Message } from 'element-ui'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名！'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不可少于六位数字！'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      // let reg = new RegExp("*@*\.");
      if (value.length < 6) {
        callback(new Error('邮箱格式不正确！'))
      } else {
        callback()
      }
    }
    const validateLoginCode = (rule, value, callback) => {
      // let reg = new RegExp("*@*\.");
      if (value.length != 4) {
        callback(new Error('验证码格式不正确！'))
      } else {
        callback()
      }
    }
    const validateEmailCode = (rule, value, callback) => {
      // let reg = new RegExp("*@*\.");
      if (value.length != 6) {
        callback(new Error('验证码格式不正确！'))
      } else {
        callback()
      }
    }

    return {
      loginForm: {
        username: '',
        password: '',
        code:''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        code: [{ required: true, trigger: 'blur', validator: validateLoginCode }]
      },
      signupForm: {
        name: '',
        password: '',
        email:'',
        code:''
      },
      signupRules: {
        name: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        code :[{ required: true, trigger: 'blur', validator: validateEmailCode }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      userToken:'',
      isLogin:true,
      emailBtnText:'发送验证码',
      resetEmailCount:0,
      emailBtnWaiting:false,
      code:'',
      // loginCodeBaseUrl:"http://119.29.52.224:8081/api/account/login/code",
      loginCodeBaseUrl:"/back/api/account/login/code",
      loginCodeUrl:"/back/api/account/login/code"

    }
  },
  watch: {
    $route: {
      handler: function(route) {//监听路由变化，路由变化也就是登录成功了
        //自动跳转指定页面，query是查询参数  查询参数中的redirect
        //跳转的时候在页面之间传参
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    refreshLoginCode(){
      this.loginCodeUrl = this.loginCodeBaseUrl + "?" + Math.random()
    },
    getEmailCode(){
      if (this.signupForm.email.trim().length == 0 ){
        Message.error("请填写正确的邮箱地址！")
        return
      }
      this.resetEmailCount = 0
      this.emailBtnWaiting =true

      registerMail({email:this.signupForm.email}).then(response=>{
        Message.success("邮件已发送，请进入邮箱查收")
        this.setEmailCountDownTimer()
      }).catch(e=>{
        Message.error("发生错误，请60s后重试")
        this.setEmailCountDownTimer()
      })

    },
    setEmailCountDownTimer(){
      let emailTimer = setInterval(()=>{
        this.emailBtnText = (60 - this.resetEmailCount++) + "s 后可重新发送";
        if (this.resetEmailCount == 60){
          this.emailBtnText = "发送验证码"
          this.resetEmailCount = 0
          this.emailBtnWaiting = false
          clearInterval(emailTimer)
          return
        }
      },1000)
    },
    toRegister(){
      this.isLogin = false
    },
    toLogin(){
      this.isLogin = true
    },
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
          })


        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    handleRegister() {
      this.$refs.signupForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/register', this.signupForm).then(() => {
            Message.success("注册成功！")
            this.loginForm.username = this.signupForm.name
            this.toLogin()
            // this.$router.push({ path: this.redirect || '/' })
            // this.loading = false
          }).catch(() => {
            Message.error("注册失败！请稍后重试")
            this.toLogin()
            this.loading = false
          })


        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getLoginCode(){

      loginCode().then(response =>{
        this.loginCodeUrl = response.data
      })
    }

  },
  mounted(){

  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#f0f2f5;
$light_gray:black;
$cursor: black;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .code-container{
    padding: 6px 5px 6px 15px;
    vertical-align: middle;
    width: 24px;
    display: inline-block;
  }

  .code-container img{
    width: 72px;
    height: 34px;
    /*width: 24px;*/

  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    /*background: rgba(0, 0, 0, 0.1);*/
    border-radius: 5px;
    /*color: #454545;*/
  }
}
</style>

<style lang="scss" scoped>
$bg:#fff;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: #eee;
  overflow: hidden;
  padding-top: 64px;
  @media screen and (max-width:992px){
    padding-top: 0;
  }
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .title {
    font-size: 26px;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
