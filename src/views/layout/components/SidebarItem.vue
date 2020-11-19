<template>
  <div class="menu-wrapper">
    <template v-for="item in routes" >
      <template v-if="!item.meta.hidden">
      <router-link v-if="!item.children || item.children.length === 0" :to="item.path"
        :key="item.path">
          <el-menu-item class="item" :index="item.path" :class="{'submenu-title-noDropdown':!isNest}">
            <template v-if="item.meta&&item.meta.icon === 'zzx'">
              <!-- <svg-icon v-if="$route.path.endsWith(item.path)" icon-class="zzxa"></svg-icon>
              <svg-icon v-else icon-class="zzx"></svg-icon> -->
              <img class="si-bt" v-if="$route.path.endsWith(item.path)" src="../../../assets/images/zzxfxa.png" alt="">
              <img v-else src="../../../assets/images/zzxfx.png" alt="">
            </template>
            <template v-else-if="item.meta&&item.meta.icon === 'sxx'">
              <!-- <svg-icon v-if="$route.path.endsWith(item.path)" icon-class="sxxa"></svg-icon>
              <svg-icon v-else icon-class="sxx"></svg-icon> -->
              <img class="si-bt" v-if="$route.path.endsWith(item.path)" src="../../../assets/images/sxxfxa.png" alt="">
              <img v-else src="../../../assets/images/sxxfx.png" alt="">
            </template>
            <template v-else-if="item.meta&&item.meta.icon === 'kcz'">
              <!-- <svg-icon v-if="$route.path.endsWith(item.path)" icon-class="kcza"></svg-icon>
              <svg-icon v-else icon-class="kcz"></svg-icon> -->
              <img class="si-bt" v-if="$route.path.endsWith(item.path)" src="../../../assets/images/kczfxa.png" alt="">
              <img v-else src="../../../assets/images/kczfx.png" alt="">
            </template>
            <template v-else-if="item.meta&&item.meta.icon === 'ac2'">
              <!-- <svg-icon v-if="$route.path.endsWith(item.path)" icon-class="kcza"></svg-icon>
              <svg-icon v-else icon-class="kcz"></svg-icon> -->
              <img class="si-bt" v-if="$route.path.endsWith(item.path)" src="../../../assets/images/sjfzfxa.png" alt="">
              <img v-else src="../../../assets/images/sjfzfx.png" alt="">
            </template>
            <template v-else-if="item.meta&&item.meta.icon === 'ac1'">
              <!-- <svg-icon v-if="$route.path.endsWith(item.path)" icon-class="kcza"></svg-icon>
              <svg-icon v-else icon-class="kcz"></svg-icon> -->
              <img class="si-bt" v-if="$route.path.endsWith(item.path)" src="../../../assets/images/wbpgfxa.png" alt="">
              <img v-else src="../../../assets/images/wbpgfx.png" alt="">
            </template>
            <svg-icon v-else-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
            <span v-if="item.meta&&item.meta.title" slot="title">&nbsp;&nbsp;{{item.meta.title}}</span>
          </el-menu-item>
      </router-link>

      <el-submenu v-else :index="item.path" :key="item.path">
        <template slot="title">
          <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
          <span v-if="item.meta&&item.meta.title" slot="title">&nbsp;&nbsp;{{item.meta.title}}</span>
        </template>

        <template v-for="child in item.children">
          <template v-if="!child.hidden">
          <sidebar-item :is-nest="true" class="nest-menu" :notFirst="true" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>

            <el-tooltip effect="dark" :key="child.path" :visible-arrow="true" :disabled="!(child.meta&&child.meta.title&&titleLength(child.meta.title))" :content="child.meta.title" popper-class="left-menu-tooltip" placement="right">
                <el-menu-item :index="child.path" @click="goPath(child.path)" >
                  <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
                  <span v-if="child.meta&&child.meta.title" >&nbsp;&nbsp;{{child.meta.title}}</span>
                </el-menu-item>
            </el-tooltip>
          </template>
        </template>
      </el-submenu>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    hasOneShowingChildren(children) {
      const showingChildren = children.filter(item => {
        return !item.hidden
      })
      if (showingChildren.length === 1) {
        return true
      }
      return false
    },
    titleLength(title) {
      if (title.length <= 10) {
        return false
      }
      return true
    },
    goPath(path) {
      const current = path.split('/')[path.split('/').length - 1]
      const routers = this.$store.state.permission.addRouters
      let count = 0
      for (const iterator of routers) {
        let temp = iterator.children[0].path
        temp = temp.split('/')[temp.split('/').length - 1]
        if (current === temp) {
          if (count >= 1) {
            this.$router.push('/' + iterator.children[0].path)
            return
          } else {
            count++
          }
        }
      }
      this.$router.push(path)
    }
  }
}
</script>
<style lang="scss">
// .left-menu-tooltip.el-tooltip__popper.is-dark{
//   background-color: $menuBg;
// }
</style>

<style lang="scss">
.scrollbar-wrapper{
    height:100%;
    overflow-x: hidden;
    .si-bt{
        margin-top: -1px;
    }
    .el-scrollbar__view{
      height:100%;
      /deep/.el-menu{
        height:auto;
        border-right: none;
        .svg-icon{
          width:1.5em;
          height:1.5em;
          vertical-align: -0.4em;
        }
      }
    }
}

</style>

