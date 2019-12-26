import { logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    userId: null,
    role: '',
    deptId: null,
    roleName: '',
    ip: '',
    port: '',
    avatar: '',
    introduction: '',
    roles: [],
    buttonJurisdiction: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_USERID: (state, userId) => {
      state.userId = userId
    },
    SET_ROLE: (state, role) => {
      state.role = role
    },
    SET_ROLENAME: (state, roleName) => {
      state.roleName = roleName
    },
    SET_DEPTID: (state, deptId) => {
      state.deptId = deptId
    },
    SET_IP: (state, ip) => {
      state.ip = ip
    },
    SET_PORT: (state, port) => {
      state.port = port
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_BJ: (state, buttonJurisdiction) => {
      state.buttonJurisdiction = buttonJurisdiction
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, token) {
      // const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', token)
        setToken(token)
        commit('CLEAR_ROUTERS')
        resolve()
        // loginByUsername(username, userInfo.password).then(response => {
        //   const data = response.data.item
        //   commit('SET_TOKEN', data.token)
        //   setToken(data.token)
        //   commit('CLEAR_ROUTERS')
        //   resolve()
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(response => {
          if (!response.data) {
            reject('error')
          }
          const data = response.data.item
          commit('SET_NAME', data.userName)
          commit('SET_USERID', data.userId)
          commit('SET_ROLE', data.roleId + '')
          commit('SET_ROLENAME', data.roleName)
          commit('SET_DEPTID', data.deptId ? data.deptId + '' : null)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    }
  }
}

export default user
