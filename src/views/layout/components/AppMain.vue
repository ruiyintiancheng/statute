<template>
  <section class="app-main">
    <transition name="fade" mode="out-in">
      <el-scrollbar style="height:calc(100%);">
        <router-view></router-view>
      </el-scrollbar>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  created() {
  }
}
</script>


