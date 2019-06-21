
<!--注册页面-->
<!--样式同login/index.vue，其中名称与逻辑有改动-->
<template>
  <div class="register-container">
    <el-form ref="registerForm"
             :model="registerForm"
             :rules="registerRules"
             class="register-form" auto-complete="on" label-position="left">

      <!--:model是v-bind:model的缩写,将父组件数据传给子组件-->
<!--  ref：表单被引用时的名称，标识    -->
<!--  rules：表单验证规则-->
      <!--el-form是一个表单--->

      <div class="title-container">
        <h3 class="title">注册</h3>
      </div>

      <el-form-item prop="account">
        <span class="svg-container">    <!--span对文字进行样式修改，其父元素的class影响它-->
          <svg-icon icon-class="user" />
        </span>

        <el-input
          ref="account"
          v-model="registerForm.account"
          placeholder="手机号"
          name="account"
          type="digit"
          tabindex="1"
          auto-complete="on"
        /> <!--ref：获取dom元素或子组件从而调用子组件方法-->
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>

        <el-input
          :key="passwordType"
          ref="password"
          v-model="registerForm.password"
          :type="passwordType"
          placeholder="密码"
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
        <span class="svg-container">    <!--短信验证码部分-->
          <svg-icon icon-class="user" />
        </span>

        <el-input
          ref="code"

          v-model="registerForm.code"
          placeholder="短信验证码"
          name="code"
          type="digit"
          tabindex="1"> <!--ref：获取dom元素或子组件从而调用子组件方法-->

          <template slot="append" @click="sendCode" >发送验证码</template>
        </el-input>

      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleRegister">注册</el-button>

      <div class="to_login">
        <span style="margin-right:20px;" @click="toLogin"><u>已有账号，点击登录！</u></span>
        <span style="margin-right:20px; float: right" @click="forgetPass"> <u>忘记密码</u> </span>
      </div>

    </el-form>
  </div>
</template>

<script>
  import { validUsername } from '@/utils/validate'
  import {validateAccount} from "../../utils/validate";  //引入

  export default {   //<!--复用一个组件生成另一个-->
    name: 'register',
    data() {
      const validateAccount = (rule, value, callback) => {
        if (!validateAccount(value)) {

          callback(new Error('Please enter the correct user name'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('The password can not be less than 6 digits'))
        } else {
          callback()
        }
      }
      return {
        registerForm: {
          account: '',
          password: ''
        },

        //zz检验表单正确性
        registerRules: {
          //   <!--blur 失去焦点时触发-->
          account: [{ required: true, trigger: 'blur', validator: validateAccount }],
          password: [{ required: true, trigger: 'blur', validator: validatePassword }]
        },

        loading: false,
        passwordType: 'password',
        //重定向到某个url
        redirect: undefined
      }
    },
    watch: {//监听路由，当路由发生变化时，
      $route: {
        handler: function(route) {
          //$route.query
          //类型: Object
          //一个key/value 对象，表示 URL 查询参数。例如，对于路径/foo?user=1，则有 $route.query.user == 1，如果没有查询参数，则是个空对象。
          this.redirect = route.query && route.query.redirect
        },
        immediate: true    //在watch中声明的时候,就立刻执行handler
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

      sendCode(){
        this.$store.dispatch('sendCode').then(()=>{
          //发送成功开始倒计时
        })

      },

      handleRegister() {
        this.$refs.registerForm.validate(valid => {//ref的作用？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？?????？？？？？？？？？？？？？？？？
          if (valid) {
            this.loading = true


            this.$store.dispatch('user/register', this.registerForm).then(() => {  //异步向后台提交数据，'user/register'应该是后台的方法名

              //这个方法会向 history 栈添加一个新的记录，所以，当用户点击浏览器后退按钮时，则回到之前的 URL。
              this.$router.push({ path: this.redirect || '/' }) //实现路由跳转，登录成功后重定向到首页

              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  $light_gray:#fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .register-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .register-container {
    .el-input {
      /*display: inline-block;*/
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

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .register-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .register-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .to_login {
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
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
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

    .input-with-select .el-input-group__prepend {
      background-color: #fff;
    }
  }
</style>
