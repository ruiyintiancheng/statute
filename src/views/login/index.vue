/*
 * @Author: lk 
 * @Date: 2018-08-11 11:43:38
 * @Last Modified by: lk
 * @Last Modified time: 2019-12-24 18:28:19
 * @Description:  登录页面
 */
<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <div class="title-container clearfix">
        <a class="logo" href="javascript:;" ></a>
         <!-- <h3 class="title">锐银天成EAST系统</h3> -->
        <!-- <lang-select class="set-language"></lang-select> -->
      </div>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input  name="username" type="text" v-model="loginForm.username"   placeholder="请输入用户名" clearable/>
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input name="password"  :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="请输入密码" clearable/>
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
       <el-form-item prop="captcha" class="captcha">
         <span class="svg-container">
          <svg-icon icon-class="captcha" />
        </span>
         <el-input name="captcha" placeholder="请输入验证码" clearable v-model="loginForm.captcha" @keyup.enter.native="handleLogin"/>
         <a><img height="50" width="100" :src="verifyCode"  @click="handleCaptcha"/></a>
       </el-form-item>
      <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
// import { isvalidUsername } from '@/utils/validate'
import { baseRequest } from '@/api/base'
import LangSelect from '@/components/LangSelect'
import SocialSign from './socialsignin'
import { encrypt } from '@/utils/encryption'
import { getToken } from '@/utils/auth'
const errorMsg = {
  username: '',
  password: '',
  captcha: ''
}
export default {
  components: { LangSelect, SocialSign },
  name: 'login',
  created() {
    if (getToken()) {
      this.$router.push('/')
    } else {
      this.handleCaptcha()
    }
  },
  data() {
    return {
      verifyCode: '',
      verifyRandom: '',
      loginForm: {
        username: '',
        password: '',
        captcha: ''
      },
      loginRules:
      { username: [{ required: true, message: '用户名不能为空' },
        {
          validator: (rule, value, callback) => {
            if (errorMsg.username) {
              callback(new Error(errorMsg.username))
            } else {
              callback()
            }
          }
        }
      ],
      password: [{ required: true, message: '密码不能为空' },
        {
          validator: (rule, value, callback) => {
            if (errorMsg.password) {
              callback(new Error(errorMsg.password))
            } else {
              callback()
            }
          }
        }],
      captcha: [{ required: true, message: '验证码不能为空' },
        {
          validator: (rule, value, callback) => {
            if (errorMsg.captcha) {
              callback(new Error(errorMsg.captcha))
            } else {
              callback()
            }
          }
        }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    // 点击切换验证码
    handleCaptcha() {
      baseRequest('/login/getVerifyCode', { date: new Date().getTime() }).then((response) => {
        this.verifyCode = 'data:image/png;base64,' + response.data.item.verifyCode
        this.verifyRandom = response.data.item.verifyRandom
      })
    },
    // 点击登录
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          // 加密：要测试的明文数据
          encrypt(this.loginForm.password).then(password => {
            const username = this.loginForm.username.trim()
            baseRequest('/login/cmprsLogin', { loginName: username, loginPasswd: password, captcha: this.loginForm.captcha, verifyRandom: this.verifyRandom }).then(response => {
              if (response.code === 2) {
                const validateMsg = response.data.validateMsg
                if (validateMsg.hasOwnProperty('loginName')) {
                  errorMsg.username = validateMsg.loginName
                  this.$refs.loginForm.validateField('username')
                  errorMsg['username'] = ''
                }
                if (validateMsg.hasOwnProperty('loginPasswd')) {
                  errorMsg.password = validateMsg.loginPasswd
                  this.$refs.loginForm.validateField('password')
                  errorMsg['password'] = ''
                  console.log('密码错误')
                }
                if (validateMsg.hasOwnProperty('verifyCode')) {
                  this.verifyCode = 'data:image/png;base64,' + validateMsg.verifyCode
                  this.verifyRandom = validateMsg.verifyRandom
                  console.log('验证码错误')
                  this.$nextTick(function() {
                    errorMsg.captcha = validateMsg.captcha
                    this.$refs.loginForm.validateField('captcha')
                    errorMsg['captcha'] = ''
                  })
                }
                this.loading = false
                return
              }
              this.$store.dispatch('LoginByUsername', response.data.item.token).then(() => {
                // this.loading = false
                this.$router.push({ path: '/' })
              }).catch(() => {
                this.loading = false
              })
            }).catch(_ => {
              this.loading = false
            })
          })
        } else {
          // alert('error submit!!')
          return false
        }
      })
    },
    afterQRScan() {
      // const hash = window.location.hash.slice(1)
      // const hashObj = getQueryObject(hash)
      // const originUrl = window.location.origin
      // history.replaceState({}, '', originUrl)
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // }
      // const codeName = hashObj[codeMap[this.auth_type]]
      // if (!codeName) {
      //   alert('第三方登录失败')
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' })
      //   })
      // }
    }
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$inputBg:#012D46;
$light_gray:#eee;

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
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $inputBg inset !important;
        box-shadow: 0 0 0px 1000px $inputBg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: $inputBg;
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
// $bg:#2d3a4b;
$bgTop:#000;
$bgBottom:#0374B3;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background: -webkit-linear-gradient($bgTop, $bgBottom); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient($bgTop, $bgBottom); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient($bgTop, $bgBottom); /* Firefox 3.6 - 15 */
  background: linear-gradient($bgTop, $bgBottom); /* 标准的语法（必须放在最后） */
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
    .captcha{
      .el-input{
        width: 69%;
      }
      a{
        display:block;
        float:right;
        img{
        display:block;
      }
      }
    }
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
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .logo{
      display: block;
      height: 80px;
      width: 100%;
      background-repeat: no-repeat;
      background-size: 100% 75px;
      font-size: 0;
      margin-bottom: 10px;
    }
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0;
      text-align: center;
      font-weight: bold;
      line-height: 49.2px;
      float: left;
      margin-left: 5px;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
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
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>
