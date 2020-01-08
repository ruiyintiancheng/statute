/*
 * @Author: lk 
 * @Date: 2018-08-11 11:43:38
 * @Last Modified by: lk
 * @Last Modified time: 2020-01-08 09:46:49
 * @Description:  登录页面
 */
<template>
  <div class="login-container">
    <div class="login-area clearfix">
      <div class="login-image">
        <img class="login-sign" :src="sign">
      </div>
      <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
        <h1 class="login-title">
          军地政策法规智能辅助系统
        </h1>
        <el-form-item prop="username">
          <i class="login-icon user" :style="{backgroundImage:'url('+cutter+')'}"></i>
          <el-input  name="username" type="text" v-model="loginForm.username"   placeholder="请输入用户名" clearable/>
          <div class="login-form-hr"></div>
        </el-form-item>

        <el-form-item prop="password">
          <i class="login-icon passwd" :style="{backgroundImage:'url('+cutter+')'}"></i>
          <el-input name="password"  :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="请输入密码" clearable/>
          <div class="login-form-hr"></div>
        </el-form-item>
        <el-form-item prop="captcha" class="captcha">
          <i class="login-icon cap" :style="{backgroundImage:'url('+cutter+')'}"></i>
          <el-input name="captcha" placeholder="请输入验证码" clearable v-model="loginForm.captcha" @keyup.enter.native="handleLogin"/>
          <a class="login-captcha" @click="handleCaptcha"><img :src="verifyCode" /></a>
          <div class="login-form-hr"></div>
        </el-form-item>
        <el-button class="login-button" type="primary" :loading="loading" @click.native.prevent="handleLogin">登&nbsp;&nbsp;录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
// import { isvalidUsername } from '@/utils/validate'
import { baseRequest } from '@/api/base'
import { encrypt } from '@/utils/encryption'
import { getToken } from '@/utils/auth'
import sign from '@/assets/images/sign.jpg'
import cutter from '@/assets/images/cutter.png'
const errorMsg = {
  username: '',
  password: '',
  captcha: ''
}
export default {
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
      sign,
      cutter,
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
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.login-container {
  overflow: hidden;
  height: 100%;
  position: relative;
  .login-area{
    height: 699px;
    width: 1080px;
    position: absolute;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
    .login-image{
      width: 550px;
      box-shadow: 20px 0px 40px 5px #c4d4ec;
      border-radius: 10px;
      overflow: hidden;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 2;
      img{
        width:100%;
        display: block;
      }
    }
    .login-form{
      width: calc(100% - 550px);
      background-color: #fff;
      margin: 22px 0;
      height: calc(100% - 44px);
      padding:0 100px 0 88px;
      border-radius: 10px;
      position: absolute;
      top: 0;
      left: 550px;
      box-shadow: 1px 0px 11px 0px #dde2ee;
      .login-title{
        line-height: 222px;
        font-size: 20px;
        font-weight: bold;
        color:#4574be;
        text-align: center;
        letter-spacing: 2px;
      }
      .el-form-item{
        position: relative;
        .el-form-item__content{
          .login-icon{
            position: absolute;
            top: 4px;
            left: 0px;
            width: 26px;
            height: 26px;
            &.user{
              background-position: 55px 400px;
            }
            &.passwd{
              background-position: 55px 334px;
            }
            &.cap{
              background-position: 55px 272px;
            }
          }
        }
        .login-captcha{
          position: absolute;
          top:0;
          right: 0;
          img{
            height: 35px;
            display:block;
          }
        }
      }
      .login-form-hr{
        height: 2px;
        border-bottom: 1px solid #3164b7;
        margin-bottom: 3px;
      }
      .login-button{
        width: 100%;
        margin-top:30px;
        height: 47px;
        border-radius: 10px;
        background-image: linear-gradient(to right, #3264b7 , #7ca7ef);
        // background-color: #3264b7;
        border:none;
        &:hover{
          background-image: linear-gradient(to right, #3d6cb8 , #90b4f3);
        }
      }
      .el-input {
        display: inline-block;
        padding-left: 26px;
        input {
          background: transparent;
          border: 0px;
          -webkit-appearance: none;
          border-radius: 0px;
          padding: 2px 5px;
          color: #7ca6ee;
          font-size: 12px;
          &::-webkit-input-placeholder {
            color: #7ca6ee;
          }
          &::-moz-input-placeholder {
            color: #7ca6ee;
          }
          &::-ms-input-placeholder {
            color: #7ca6ee;
          }
        }
      }
    }
  }
  @media (max-width: 1517px){
    height: auto;
    position: static;
    .login-area{
      margin: 184px auto;
    }
  }
}
</style>
