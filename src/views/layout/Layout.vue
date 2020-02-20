<template>
  <div class="app-wrapper" >
    <navbar></navbar>
    <div class="main-container" :style="{height:height+'px'}">
      <app-main ref="appMain" :style="{minHeight:(height - 55)+'px',backgroundColor:conColor}">></app-main>
      <bottom-bar></bottom-bar>
    </div>
  </div>
</template>

<script>
import { Navbar, AppMain, BottomBar } from './components'

export default {
  name: 'layout',
  components: {
    Navbar,
    AppMain,
    BottomBar
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
    this.setCurrentHeight()
    this.$i18n.locale = this.$store.state.app.language
    window.addEventListener('resize', function() {
      this.setCurrentHeight()
    }.bind(this), false)
  },
  data() {
    return {
      height: null
    }
  },
  methods: {
    setCurrentHeight() {
      this.height = document.body.offsetHeight - 60
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
