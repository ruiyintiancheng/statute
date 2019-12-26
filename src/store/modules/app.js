import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      opened: true,
      withoutAnimation: false
    },
    device: 'desktop',
    language: Cookies.get('language') || 'zh',
    dispalySideBar: 'block',
    marginNavBar: '210px',
    containHeight: null,
    appWidth: null,
    dialogHeight: null,
    bgColor: '#304156' // 主题背景颜色
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        state.dispalySideBar = 'block'
        state.marginNavBar = '36px'
      } else {
        state.dispalySideBar = 'block'
        state.marginNavBar = '210px'
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_LANGUAGE: (state, language) => {
      language = language || 'zh'
      state.language = language
      Cookies.set('language', language)
    },
    SET_CONTAIN_HEIGHT: (state, height) => {
      state.containHeight = height
    },
    SET_CONTAIN_WIDTH: (state, appWidth) => {
      state.appWidth = appWidth
    },
    SET_DIALOG_HEIGHT: (state, height) => {
      state.dialogHeight = height
    },
    SET_PAGE_STYLE: (state, style) => {
      if (!state.sidebar.opened && style.dispalySideBar === 'block') {
        state.marginNavBar = '36px'
      } else {
        state.marginNavBar = style.marginNavBar
      }
      state.dispalySideBar = style.dispalySideBar
    },
    SET_BG_COLOR: (state, bgColor) => {
      bgColor = bgColor || '#304156'
      state.bgColor = bgColor
    }
  },
  actions: {
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    toggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language)
    },
    setPageStyle({ commit }, style) {
      commit('SET_PAGE_STYLE', style)
    },
    setContainHeight({ commit }, { height, dialogHeight, appWidth }) {
      commit('SET_CONTAIN_HEIGHT', height)
      commit('SET_DIALOG_HEIGHT', dialogHeight)
      commit('SET_CONTAIN_WIDTH', appWidth)
    },
    setBgColor({ commit }, bgColor) {
      commit('SET_BG_COLOR', bgColor)
    }
  }
}

export default app
