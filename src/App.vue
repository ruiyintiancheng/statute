<template>
  <div id="app">
    <keep-alive :include="cachedViews">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </keep-alive>
  </div>
</template>

<script>
  export default{
    name: 'App',
    data() {
      return {
        cachedViews: ['home']
      }
    },
    mounted() {
      this.$nextTick(_ => {
        if (!IsPC()) {
          document.body.style.zoom = 0.81
        }
      })
    }
  }
  function IsPC() {
    var userAgentInfo = navigator.userAgent
    var Agents = ['Android', 'iPhone',
      'SymbianOS', 'Windows Phone',
      'iPad', 'iPod']
    var flag = true
    for (var v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false
        break
      }
    }
    return flag
}
</script>

