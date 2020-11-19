/*
 * @Author: lk 
 * @Date: 2020-02-26 14:37:59 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-11-18 14:24:25
 * @Description:  左菜单
 */
 <template>
  <el-scrollbar wrapClass="scrollbar-wrapper no-text-select">
    <el-menu class="sidebar-menu"
           mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      text-color="#141414"
      active-text-color="#3365B5">

    <!-- <div class="sidebar-title">{{leftBarTitle}}</div> -->
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
      'permission_left_routers',
      'leftBarTitle'
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
    overflow-x: hidden;
    .el-scrollbar__view{
      height:100%;
      .el-menu{
        height:100%;
      }
    }
}
.sidebar-menu{
  padding: 10px 0;
  border-radius: 6px;
  font-size: 16px;
  .sidebar-title{
    height: 75px;
    line-height: 75px;
    font-weight: bold;
    color:#fff;
    font-size: 20px;
    padding-left: 20px;
  }
  /deep/.el-submenu__title,.el-menu-item{
    font-size: 16px;
    &:hover{
      // color:#3365B5;
      // background-color: #fff;
    }
  }
  .el-menu-item.is-active{
    font-weight: bold;
  }
}
</style>
