/*
 * @Author: lk 
 * @Date: 2019-12-23 11:16:27 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-17 11:15:35
 * @Description:  首页
 */
<template>
  <div class="dashboard-container" :style="{backgroundImage:'url('+bj+')'}" >
    <navbar class="has-border"></navbar>
    <div class="base-container home-main">
      <div class="home-search">
        <search @seacrHandle="seacrHandle" @searchOperate="searchOperate"></search>
      </div>
      <div class="home-options clearfix">
        <div class="home-item" @click="$router.push({name:'statisticsIndex'})">
          <img :src="all">
          <p class="home-item-text">
            统计概览
          </p>
        </div>
        <div class="home-item"  @click="$router.push({name:'analysisIndex'})">
          <img :src="fenxi">
          <p class="home-item-text">
            政策分析
          </p>
        </div>
        <div class="home-item" @click="linkTo('relationChartBarChartIndex')">
          <img :src="math">
          <p class="home-item-text">
            校验分析
          </p>
        </div>
        <div class="home-item" @click="$router.push({name:'learnIndex'})">
          <img :src="study">
          <p class="home-item-text">
            学习路上
          </p>
        </div>
      </div>
      <div class="home-bottom">
        <img :src="wline" width="100%">
        军地政策法规智能辅助系统
      </div>
    </div>
  </div>
</template>
<script>
import bj from '@/assets/images/bj.jpg'
import wline from '@/assets/images/wline.png'
import all from '@/assets/images/all.png'
import fenxi from '@/assets/images/fenxi.png'
import math from '@/assets/images/math.png'
import study from '@/assets/images/study.png'
import Navbar from '../layout/components/Navbar'
import Search from '@/components/Search'
import { mapGetters } from 'vuex'
export default {
  name: 'home',
  computed: {
    ...mapGetters([
      'permission_left_map',
      'add_routers'
    ])
  },
  components: {
    Navbar,
    Search
  },
  data() {
    return {
      bj,
      wline,
      all,
      fenxi,
      math,
      study,
      fathPath: ''
    }
  },
  methods: {
    seacrHandle(obj) {
      this.$router.push({
        path: '/search',
        query: {
          val: obj.dataValue
        }
      })
    },
    searchOperate(params) {
      this.$router.push({
        path: '/search',
        query: {
          params: JSON.stringify(params)
        }
      })
    },
    linkTo(component) {
      let name = ''
      const currentRoute = this.add_routers.find(item => {
        if (item.children && item.children.length > 0) {
          const route = item.children[0]
          if (route.name === component) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      })
      if (currentRoute) {
        let fullPath = currentRoute.children[0].path
        fullPath = fullPath.split('/')[0]
        name = fullPath
      } else {
        this.$message.error('抱歉，您没有权限访问此页面')
        return
      }
      this.$store.dispatch('setleftBarTitle', '校验分析')
      const parmObj = {
        leftRoutes: this.permission_left_map[name],
        path: '/' + name
      }
      this.$store.dispatch('GenerateLeftRoutes', parmObj).then(() => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .dashboard-container{
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    overflow: auto;
    .has-border{
      border-bottom:1px solid #fff;
    }
    .home-main{
      height: calc(100% - 70px);
      position: relative;
      // padding-top: 127px;
    }
    .home-search{
      width: 920px;
      position: absolute;
      left: 50%;
      margin-left: -460px;
      top: 13.5%;
      // margin:0 auto;
      .el-input-group{
        overflow: hidden;
      }
    }
    .home-options{
      height:342px;
      width: 100%;
      top: 31%;
      left: 0;
      // margin-top:-171px;
      position: absolute;
      // margin: 127px auto 100px;
      .home-item{
        cursor: pointer;
        width: 240px;
        height: 100%;
        float: left;
        margin-left: 80px;
        background-color: #96b4e1;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0px 20px 20px -20px #111;
        transition: all .2s linear;
        &:hover{
          // -webkit-box-shadow: 0 15px 30px rgba(0,0,0,.1);
          // box-shadow: 0 15px 30px rgba(0,0,0,.1);
          box-shadow: 20px 20px 20px -20px #111;
          -webkit-transform: translate3d(0,-2px,0);
          transform: translate3d(0,-2px,0);
        }
        img{
          margin-top:94px;
        }
        .home-item-text{
          margin-top:28px;
          font-size: 20px;
          color:#fff;
          letter-spacing: 1px;
        }
        &:first-child{
          margin-left:0;
        }
      }
    }
    .home-bottom{
      width: 850px;
      height: 100px;
      position: absolute;
      left: 50%;
      margin-left: -425px;
      bottom:0px;
      font-size: 14px;
      color:#fff;
      letter-spacing: 4px;
      text-align: center;
      padding-top:35px;
      img{
        position: absolute;
        top:0;
        left: 0;
      }
    }
  }
</style>

<style lang="scss">
  .dashboard-container{
    .home-search{
      .el-input-group{
        overflow: hidden;
      }
    }
  }
</style>