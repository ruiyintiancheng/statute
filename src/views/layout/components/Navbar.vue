/*
 * @Author: lk 
 * @Date: 2018-09-21 14:54:24 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-10-28 16:30:01
 * @Description:  
 */
<template>
  <div :class="{navbar:true,'no-text-select':true,'currentColor':$route.name!=='home'}">
    <div class="base-container clearfix">
      <div :class="{'logo':true}">
        <p>军民融合工作政策制度</p>
        <p>数据挖掘与可视化平台</p>
      </div>
      <ul :class="{'left-menu':true, 'clearfix' : true}">
        <li :class="{actived:$route.name==='home'}">
          <router-link to="/">首页</router-link>
        </li>
        <!-- <li :class="{actived:$route.name==='statistics'}">
          <router-link to="/statistics">数据统计</router-link>
        </li>, 
        <li :class="{actived:$route.name==='search'}">
          <router-link to="/analysis">模型分析</router-link>
        </li>
        <li :class="{actived:$route.name==='learn'}">
          <router-link to="/learn">学习路上</router-link>
        </li> -->
        <li v-for="(item,index) in permission_top_routers" :key="item.name+index" :class="{actived:toggleClass(item)}">
          <router-link v-if="item.path && item.component" :to="'/'+item.path">{{item.meta.title}}</router-link>
          <a v-else @click="linkTo(item.name,item.meta.title)">{{item.meta.title}}</a>
        </li>
      </ul>
      <ul class="right-menu clearfix">
        <li class="right-menu-item"
            v-if="$route.name!=='home' && isPc">
          <div class="search-input">
            <i class="search-icon"
               :style="{backgroundImage:'url('+cutter+')'}"
               @click="searchHandle"></i>
            <input type="text"
                   v-model.trim="searchVal">
          </div>
        </li>
        <li class="right-menu-item">
        
          <span class="log-out">
              <el-dropdown trigger="click" @command="handleCommand">
                  <i class="log-user"
                    @click="userManagement"
                    :style="{backgroundImage:'url('+cutter+')',cursor:'pointer'}"></i>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item disabled >{{name}}</el-dropdown-item>
                    <el-dropdown-item command="update">修改用户信息</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>

            <a @click="logout">退出</a>
          </span>
        </li>
      </ul>
    </div>
    <el-dialog title="修改用户信息"
               :visible.sync="infoVisible"
               width="550px"
               custom-class="info-update-dialog dialog-default autoHeight">
      <div class="dialog-contant-default">
        <el-form :rules="infoRules"
                 class="baseUpdate-form"
                 ref="infoUpdate"
                 style="margin-left: calc(50% - 185px)"
                 :model="updateFormData"
                 label-width="120px">
          <el-form-item prop="loginName"
                        label="登录名">
            <el-input class="form-input"
                      style="width:200px"
                      :disabled="true"
                      v-model="updateFormData.loginName"
                      clearable></el-input>
          </el-form-item>
          <el-form-item prop="userName"
                        label="用户名">
            <el-input class="form-input"
                      style="width:200px"
                      v-model="updateFormData.userName"
                      clearable></el-input>
          </el-form-item>
          <el-form-item prop="loginPasswd"
                        label="登录密码">
            <el-input class="form-input"
                      style="width:200px"
                      v-model="updateFormData.loginPasswd"
                      clearable></el-input>
          </el-form-item>
         
        </el-form>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="infoVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="saveOperate()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import cutter from '@/assets/images/cutter.png'
import { mapGetters } from 'vuex'
import { tranformStr } from '@/utils/index'
import { saveUpdate } from '@/utils/validate'
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
export default {
  created() {
    this.isPc = IsPC()
  },
  computed: {
    ...mapGetters([
      'permission_top_routers',
      'permission_left_map',
      'userId',
      'loginName',
      'name'
    ]),
    hasSideBar() {
      if (this.$route.meta && this.$route.meta.type === '1') {
        return false
      } else if (this.$route.meta && this.$route.meta.type === '2') {
        return true
      } else {
        return false
      }
    }
  },
  data() {
    return {
      isPc: true,
      cutter,
      searchVal: '',
      fathPath: '',
      infoVisible: false,
      infoRules: {
        loginName: [
          { required: true, message: '该项为必填项' }
        ],
        userName: [
          { required: true, message: '该项为必填项' }
        ],
        loginPasswd: [
          { required: true, message: '请输入密码' },
          { min: 6, message: '密码不能少于6位' }
        ]
      },
      updateFormData: {
        userId: null,
        userName: null,
        loginName: null,
        loginPasswd: null
      },
      tranform2Str: tranformStr
    }
  },
  components: {
  },
  mounted() {
  },
  methods: {
    toggleClass(item) {
      const component = item.component ? this.tranform2Str(item.component) : ''
      if (this.$route.name === component) {
        return true
      } else {
        const path = this.$route.params.path || this.$route.path
        if (component) {
          if ((this.$route.name === 'search' || (this.$route.params.path === '/search')) && component === 'analysisIndex') {
            return true
          } else {
            if (this.$route.params.path) {
              if (path.startsWith('/' + item.name)) {
                return true
              } else {
                return false
              }
            } else {
              return false
            }
          }
        } else {
          if (path.startsWith('/' + item.name)) {
            return true
          } else {
            return false
          }
        }
      }
    },
    userManagement() {
      // this.$router.push({
      //   name: 'user'
      // })
    },
    searchHandle() {
      if (this.$route.name === 'search') {
        this.$parent.$refs.appMain.$children[0].$refs.resultSearch.dataValue = this.searchVal
        this.$parent.$refs.appMain.$children[0].seacrHandle()
      } else {
        this.$router.push({
          path: '/search',
          query: {
            val: this.searchVal
          }
        })
      }
    },
    logout() {
      this.$confirm('确定注销当前登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.reload()
        })
      })
    },
    linkTo(name, title) {
      this.$store.dispatch('setleftBarTitle', title)
      const parmObj = {
        leftRoutes: this.permission_left_map[name],
        path: '/' + name
      }
      this.$store.dispatch('GenerateLeftRoutes', parmObj).then(() => {
        // this.getFathPath(this.permission_left_map[name])
        if (this.permission_left_map[name] && this.permission_left_map[name].length > 0) {
          this.getFathPath(this.permission_left_map[name])
          if (this.fathPath) {
            this.$router.push(this.fathPath)
          }
        }
      }).catch(() => {
        alert('error submit!!')
      })
    },
    getFathPath(map) {
      if ((!map[0].children || map[0].children.length === 0) && map[0].component) {
        this.fathPath = map[0].path
      } else {
        this.getFathPath(map[0].children)
      }
    },
    handleCommand(command) {
      if (command === 'update') {
        this.updateFormData = {
          userId: this.userId,
          userName: this.name,
          loginName: this.loginName,
          loginPasswd: null
        }
        this.infoVisible = true
      }
    },
    saveOperate() {
      saveUpdate('/manager/update', this.updateFormData, this.infoRules, this.$refs.infoUpdate).then(() => {
        this.infoVisible = false
        this.$Message.success('操作成功')
        location.reload()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.navbar {
  height: 70px;
  min-width: 1200px;
  line-height: 70px;
  position: relative;
  &.currentColor {
    background-color: $mainColor;
  }
  .logo {
    // float: left;
    // font-size: 20px;
    // font-weight: bold;
    // color: #fff;
    // letter-spacing: 2px;
    // margin-right: 60px;
        float: left;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    letter-spacing: 2px;
    margin-right: 60px;
    line-height: 27px;
    margin-top: 8px;
    a{
      // display: block;
    }
    &.leftbar-logo{
      position:absolute;
      left: 26px;
    }
  }
  .left-menu {
    float: left;
    margin-left: 0px;
    margin-top: 23px;
    &.leftbar-menu{
      position:absolute;
      left: 360px;
    }
    li {
      margin-left: 10px;
      height: 27px;
      line-height: 24px;
      &.actived {
        border-bottom: 3px solid #fff;
      }
      &:hover {
        border-bottom: 3px solid #fff;
      }
      a {
        color: #fff;
        font-size: 16px;
        padding: 0 5px;
        height: 24px;
      }
    }
  }
  .right-menu {
    float: right;
    .right-menu-item {
      float: left;
      .search-input {
        width: 270px;
        height: 28px;
        position: relative;
        margin-right: 70px;
        margin-top: 20px;
        border-radius: 20px;
        overflow: hidden;
        background-color: $mainColor;
        border: 1px solid #fff;
        .search-icon {
          position: absolute;
          top: 0px;
          right: 5px;
          width: 26px;
          height: 26px;
          background-position: 55px 112px;
          cursor: pointer;
        }
        input {
          position: absolute;
          height: 100%;
          width: calc(100% - 30px);
          top: 0;
          left: 0;
          background-color: transparent;
          margin: 0;
          padding: 5px 0px 5px 10px;
          outline: none;
          border: none;
          font-size: 12px;
          color: #fff;
        }
      }
      .log-out {
        font-size: 14px;
        color: #fff;
        position: relative;
        .log-user {
          position: absolute;
          top: -17px;
          left: -30px;
          width: 26px;
          height: 26px;
          background-position: 55px 210px;
        }
      }
    }
  }
  .left-menu,
  .right-menu {
    list-style: none;
    li {
      float: left;
    }
  }
}
</style>
<style lang="scss">
  .info-update-dialog{
    line-height:20px;
  }
</style>