/*
 * @Author: lk
 * @Date: 2019-02-01 17:37:48
 * @Last Modified by: lk
 * @Last Modified time: 2019-03-19 18:00:53
 */
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import Cookies from 'js-cookie'
import NProgress from 'nprogress'
NProgress.configure({ showSpinner: false })
// import router from '../router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  headers: { 'Content-Type': 'application/json' }
  // timeout: 5000 // request timeout
})

const langMap = {
  zh: 'zh_CN',
  en: 'en_US'
}

// request interceptor
service.interceptors.request.use(config => {
  NProgress.start()
  // Do something before request is sent
  if (store.getters.token) {
    config.headers['token'] = getToken() // 让每个请求携带token
  }
  let lang = Cookies.get('language')
  if (lang) {
    lang = langMap[lang]
  } else {
    lang = 'zh_CN'
  }
  config.headers['lang'] = lang // 国际化
  return config
}, error => {
  // Do something with request error
  NProgress.done()
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
    if (response.config.responseType === 'blob') {
      NProgress.done()
      return response
    } else {
      if (!response.data) {
        Message({
          message: '网络异常',
          type: 'error',
          duration: 5 * 1000
        })
        NProgress.done()
        return Promise.reject()
      }
      const res = response.data
      if (res.code !== 1) {
        if (res.code === 2) {
          NProgress.done()
          return response.data
        }
        Message({
          message: res.msg,
          type: 'error',
          duration: 5 * 1000
        })
        if (res.code === 10005 || res.code === 20007 || res.code === 20008) {
          // MessageBox.confirm('登录已过期，可以取消继续留在该页面，或者重新登录', '确定登出', {
          //   confirmButtonText: '重新登录',
          //   cancelButtonText: '取消',
          //   type: 'warning'
          // }).then(() => {
          // localStorage.setItem('loginMsg', res.msg)
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
          // })
        }
        NProgress.done()
        return Promise.reject(res.msg)
      } else {
        NProgress.done()
        return response.data
      }
    }
  },
  error => {
    console.log('err' + error)
    Message({
      message: '网络异常',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error) // 返回接口返回的错误信息
  })

export default service
