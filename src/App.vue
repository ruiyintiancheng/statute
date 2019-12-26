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
    }
  }
</script>

