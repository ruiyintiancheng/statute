import { constantRouterMap, dashboardRouterMap } from '@/router'
const _import = require('@/router/_import_' + process.env.NODE_ENV)
import Layout from '@/views/layout/Layout'
import { deepClone, tranformStr, isRepeatComponent } from '@/utils/index'
// import { baseRequest } from '@/api/base'

/**
 * 设置访问路由的component对应的组件
 * @param {菜单数据} menuData
 */
function setBaseRouter(menuData, baseData, parentPath, parentTitle, allPath) {
  for (const item of menuData) {
    if (item.component && item.component !== '') {
      if (!isRepeatComponent(item.component)) {
        item.name = tranformStr(item.component)
      } else {
        item.name = tranformStr(item.path)
        item.meta.name = tranformStr(item.component)
      }
      try {
        item.component = _import(item.component)
      } catch (e) {
        item.component = _import('errorPage/404')
      }
    } else {
      item.component = _import('errorPage/404')
    }
    if (parentPath) {
      item.path = parentPath + '/' + item.path
      item.meta.titlePath = parentTitle + '/' + item.meta.title
      item.meta.allPath = allPath + ',' + item.path + (item.meta.type === '3' ? 'isTarget' : '')
    } else {
      item.path = item.path + ''
      item.meta.titlePath = item.meta.title
      item.meta.allPath = item.path + (item.meta.type === '3' ? 'isTarget' : '')
    }
    if (item.children && item.children.length > 0) {
      if (item.meta.type === '3') {
        baseData.push(item)
      }
      setBaseRouter(item.children, baseData, item.path, item.meta.titlePath, item.meta.allPath)
    } else {
      baseData.push(item)
    }
  }
}

/**
 * 设置路由最外层layout组件
 * @param {数据菜单} menuData
 */
function setLayout(menuData) {
  const baseMenu = []
  for (const iterator of menuData) {
    const itemMenu = {
      path: '/',
      component: Layout,
      children: [
        iterator
      ]
    }
    baseMenu.push(itemMenu)
  }
  return baseMenu
}

/**
 * 设置左侧菜单的真实路径
 */
function getFathPath(leftRoutes, path) {
  for (const iterator of leftRoutes) {
    if (!iterator.meta.fathPath) {
      iterator.path = path + '/' + iterator.path
      iterator.meta.fathPath = true
    }
    if (iterator.children && iterator.children.length !== 0) {
      getFathPath(iterator.children, iterator.path)
    }
  }
}

const permission = {
  state: {
    routers: [],
    sideTitle: '', // 侧标题
    addRouters: [],
    topRouters: [],
    leftMap: {},
    leftRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    CLEAR_ROUTERS: (state) => {
      state.routers = []
    },
    SET_TOP_ROUTERS: (state, routers) => {
      state.topRouters = dashboardRouterMap.concat(routers)
    },
    SET_LEFT_MAP: (state, map) => {
      state.leftMap = map
    },
    SET_LEFT_ROUTERS: (state, routers) => {
      state.leftRouters = routers
    },
    SET_SIDE_TITLE: (state, title) => {
      state.sideTitle = title
    }
  },
  actions: {
    // 设置侧标题
    setSideTitle({ commit }, titile) {
      return new Promise(resolve => {
        commit('SET_SIDE_TITLE', titile)
        resolve()
      })
    },
    GenerateLeftRoutes({ commit }, parmObj) {
      return new Promise(resolve => {
        getFathPath(parmObj.leftRoutes, parmObj.path)
        commit('SET_LEFT_ROUTERS', parmObj.leftRoutes)
        resolve()
      })
    },
    GenerateRoutes({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        const menuData =
        [
          { 'path': 'p200000', 'meta': { 'icon': 'location', 'title': '课程学习管理', 'type': '2' }}
        ]
        const newData = deepClone(menuData)
        var baseData = [] // 路由数据数组
        setBaseRouter(menuData, baseData)
        const baseMenu = setLayout(baseData)
        commit('SET_ROUTERS', baseMenu)

        for (const iterator of newData) {
          if (!iterator.meta.fathPath) {
            iterator.path = '/' + iterator.path
            iterator.meta.fathPath = true
          }
          if (iterator.children && iterator.children.length !== 0) {
            getFathPath(iterator.children, iterator.path)
          }
        }
        commit('SET_LEFT_ROUTERS', newData)
        resolve()
      })
    }
  }
}

export default permission
