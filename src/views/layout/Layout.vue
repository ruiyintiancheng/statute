<template>
  <div class="app-wrapper" >
    <navbar></navbar>
    <div class="main-container clearfix" :style="{height:height-55+'px'}">
      <sidebar class="sidebar-container"  v-if="showSideBar" :style="{height:(height - 55)+'px',backgroundColor:'#3164b7'}"></sidebar>
      <app-main class="app-main" ref="appMain" :style="{minHeight:(height - 55)+'px',width:(showSideBar?'calc(100% - 210px)':'100%'),float:showSideBar?'left':'none',height:showSideBar?'100%':'auto'}"></app-main>
    </div>
    <bottom-bar></bottom-bar>
  </div>
</template>

<script>
import { Navbar, AppMain, BottomBar, Sidebar } from './components'

export default {
  name: 'layout',
  components: {
    Navbar,
    AppMain,
    BottomBar,
    Sidebar
  },
  watch: {
    $route(route) {
      this.hasSideBar()
    }
  },
  computed: {
    conColor: function() {
      if (this.$route.name === 'learn') {
        return '#def5fb'
      } else {
        return 'none'
      }
    }
  },
  created() {
    this.hasSideBar()
    this.setCurrentHeight()
    this.$i18n.locale = this.$store.state.app.language
    window.addEventListener('resize', function() {
      this.setCurrentHeight()
    }.bind(this), false)
  },
  data() {
    return {
      height: null,
      showSideBar: false
    }
  },
  methods: {
    hasSideBar() {
      if (this.$route.meta && this.$route.meta.type === '1') {
        this.showSideBar = false
      } else if (this.$route.meta && this.$route.meta.type === '2') {
        this.showSideBar = true
      }
    },
    setCurrentHeight() {
      this.height = document.body.offsetHeight - 70
      this.$store.dispatch('setContainHeight', { height: this.height })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .main-container{
    overflow: auto;
    overflow-x: hidden;
    width: 100%;
  }
  .app-wrapper {
   // @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>
