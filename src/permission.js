/*
 * @Author: lk
 * @Date: 2019-02-01 17:38:40
 * @Last Modified by: lk
 * @Last Modified time: 2019-12-23 10:55:13
 */
import router from './router'
// import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress Configuration

const whiteList = ['/login']// no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (getToken()) { // determine if there has token
    /* has token*/
    if (to.path === '/login') {
      next()
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      // if (store.getters.permission_routers.length === 0) {
      // store.dispatch('GenerateRoutes').then(() => { // 根据roles权限生成可访问的路由表
      // router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
      // store.dispatch('GetUserInfo').then(_ => {
      //   next({ path: '/' })
      // })// 拉取user_info
      // })
      // } else {
      next()
      // }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
