/*
 * @Author: lk
 * @Date: 2019-02-01 17:38:32
 * @Last Modified by: lk
 * @Last Modified time: 2019-04-02 16:48:43
 * @Description:  入口js
 */
import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import Element from 'element-ui'
import { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css
// import '@/icons/alicdn.js' 加载全局的图标

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog'// error log
import './permission' // permission control
// import './mock' // simulation data

import * as filters from './filters' // global filters

import elDragDialog from '@/directive/el-dragDialog'

Vue.use(Element, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

Vue.prototype.$Message = Message

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.directive('elDragDialog', elDragDialog)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
