/*
 * @Author: lk 
 * @Date: 2020-02-26 14:37:59 
 * @Last Modified by: lk
 * @Last Modified time: 2020-03-11 17:12:48
 * @Description:  左菜单
 */
 <template>
  <el-scrollbar wrapClass="scrollbar-wrapper no-text-select" :style="{backgroundColor:'#def5fb'}">
    <el-menu
           mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      background-color="#3164b7"
      text-color="#fff"
      active-text-color="#409EFF">

      <sidebar-item :routes="permission_left_routers"></sidebar-item>


      <!-- <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>数据采集</span>
        </template>
        <router-link to="/collectionSetting">
          <el-menu-item index="/collectionSetting">采集配置</el-menu-item>
        </router-link>
        <router-link to="/task">
          <el-menu-item index="/task">任务管理</el-menu-item>
        </router-link>
        <router-link to="/journal">
          <el-menu-item index="/journal">采集日志</el-menu-item>
          </router-link>
      </el-submenu>
      <el-menu-item index="2">
        <i class="el-icon-location"></i>
        <span slot="title">用户管理</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-location"></i>
        <span slot="title">系统管理</span>
      </el-menu-item> -->
    </el-menu>
  </el-scrollbar>
</template>

<script>
import SidebarItem from './SidebarItem'
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'permission_left_routers'
    ]) },
  components: {
    SidebarItem
  },
  methods: {
  }
}
</script>


<style lang="scss">
.scrollbar-wrapper{
    height:100%;
    overflow-x: hidden;
    .el-scrollbar__view{
      height:100%;
      .el-menu{
        height:100%;
      }
    }
}

</style>
