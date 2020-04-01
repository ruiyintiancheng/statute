import { constantRouterMap, dashboardRouterMap } from '@/router'
const _import = require('@/router/_import_' + process.env.NODE_ENV)
import Layout from '@/views/layout/Layout'
import { deepClone, tranformStr, isRepeatComponent } from '@/utils/index'
import { baseRequest } from '@/api/base'

/**
 * 设置访问路由的component对应的组件
 * @param {菜单数据} menuData
 */
function setBaseRouter(menuData, baseData, parentPath) {
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
    } else {
      item.path = item.path + ''
    }
    if (item.children && item.children.length > 0) {
      setBaseRouter(item.children, baseData, item.path)
    } else {
      baseData.push(item)
    }
  }
}

var leftDataMap = {} // 左侧菜单集合
/**
 * 设置顶层菜单 和左侧菜单集合
 * @param {原始数据} topData
 */
function setSideRouter(topData) {
  for (const item of topData) {
    item.path = item.path + ''
    item.name = item.path
    if (item.children && item.children[0] && item.children[0].meta.type === '2') {
      const children = item.children
      setleftIdToString(children)
      leftDataMap[item.name] = children
      item.path = ''
      delete item.children
    }
    if (item.children) {
      setSideRouter(item.children)
    }
  }
}

/**
 * 吧id改为String
 * @param {children集合} list
 */
function setleftIdToString(list) {
  for (const iterator of list) {
    iterator.path = iterator.path + ''
    if (iterator.children && iterator.children[0]) {
      setleftIdToString(iterator.children)
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
    routers: null,
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
        baseRequest('/cmprsFunction/getMenu').then(response => {
          const menuData = response.data.item || []
          const newData = deepClone(menuData)
          var baseData = [] // 路由数据数组
          setBaseRouter(menuData, baseData)
          const baseMenu = setLayout(baseData)
          commit('SET_ROUTERS', baseMenu)

          leftDataMap = {}
          setSideRouter(newData)
          commit('SET_TOP_ROUTERS', newData)
          commit('SET_LEFT_MAP', leftDataMap)
          resolve()
        }).catch(error => {
          reject(error)
        })
        // const menuData =
        // [{
        //   'path': 1,
        //   'component': null,
        //   'children':
        //   [
        //     {
        //       'path': 2,
        //       'component': null,
        //       'children': [{
        //         'path': 3,
        //         'component': 'collectionSetting/index',
        //         'meta': {
        //           'icon': null,
        //           'title': '采集配置',
        //           'type': '2'
        //         },
        //         'parentId': 2
        //       }, {
        //         'path': 4,
        //         'component': 'task/index',
        //         'meta': {
        //           'icon': null,
        //           'title': '任务管理',
        //           'type': '2'
        //         },
        //         'parentId': 2
        //       }, {
        //         'path': 5,
        //         'component': 'journal/index',
        //         'meta': {
        //           'icon': null,
        //           'title': '采集日志',
        //           'type': '2'
        //         },
        //         'parentId': 2
        //       }],
        //       'meta': {
        //         'icon': null,
        //         'title': '数据采集',
        //         'type': '2'
        //       },
        //       'parentId': 1
        //     },
        //     {
        //       'path': 3333,
        //       'component': null,
        //       'meta': {
        //         'icon': null,
        //         'title': '系统管理',
        //         'type': '2'
        //       },
        //       'children': [
        //         {
        //           'path': 4444,
        //           'component': 'functionManagement/index',
        //           'meta': {
        //             'icon': null,
        //             'title': '菜单管理',
        //             'type': '2'
        //           },
        //           'parentId': 3333
        //         },
        //         {
        //           'path': 5555,
        //           'component': 'role/index',
        //           'meta': {
        //             'icon': null,
        //             'title': '角色管理',
        //             'type': '2'
        //           },
        //           'parentId': 3333
        //         },
        //         {
        //           'path': 666,
        //           'component': 'user/index',
        //           'meta': {
        //             'icon': null,
        //             'title': '用户管理',
        //             'type': '2'
        //           },
        //           'parentId': 777
        //         }
        //       ],
        //       'parentId': 1
        //     }
        //   ],
        //   'meta': {
        //     'icon': 'dashboard',
        //     'title': '系统管理',
        //     'type': '1'
        //   },
        //   'parentId': 0
        // }]
        // const newData = deepClone(menuData)
        // var baseData = [] // 路由数据数组
        // setBaseRouter(menuData, baseData)
        // const baseMenu = setLayout(baseData)
        // commit('SET_ROUTERS', baseMenu)

        // leftDataMap = {}
        // setSideRouter(newData)
        // commit('SET_TOP_ROUTERS', newData)
        // commit('SET_LEFT_MAP', leftDataMap)
        // resolve()
      })
    }
  }
}

export default permission
