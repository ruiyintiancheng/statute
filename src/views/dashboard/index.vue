/*
 * @Author: lk 
 * @Date: 2019-12-23 11:16:27 
 * @Last Modified by: lk
 * @Last Modified time: 2020-06-04 14:54:58
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
        <div class="home-item"  @click="$router.push({name:'search'})">
          <img :src="fenxi">
          <p class="home-item-text">
            全文检索
          </p>
        </div>
        <div class="home-item" @click="$router.push({name:'analysisIndex'})">
          <img :src="math">
          <p class="home-item-text">
            政策分析
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
export default {
  name: 'home',
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
      study
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
      // position: relative;
      padding-top: 127px;
    }
    .home-search{
      width: 920px;
      // position: absolute;
      // left: 50%;
      // margin-left: -460px;
      // top:127px;
      margin:0 auto;
      .el-input-group{
        overflow: hidden;
      }
    }
    .home-options{
      height:342px;
      width: 100%;
      // top: 50%;
      // left: 0;
      // margin-top:-171px;
      // position: absolute;
      margin: 127px auto 100px;
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
      height: 11%;
      position: absolute;
      left: 50%;
      margin-left: -425px;
      bottom:17px;
      font-size: 14px;
      color:#fff;
      letter-spacing: 4px;
      text-align: center;
      padding-top:2.5%;
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