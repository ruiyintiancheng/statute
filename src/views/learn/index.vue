/*
 * @Author: wk
 * @Date: 2019-12-26 11:08:37 
 * @Last Modified by: lk
 * @Last Modified time: 2020-02-20 14:17:50
 * @Description:  学习路上
 */
<template>
  <div class="learning"
       >
    <div class="learning-head">
      <img :src="banner">
    </div>
    <div class="learning-body">
      <div class="base-container">
        <div class="learing-search">
          <el-input placeholder="请输入关键字" v-model.trim="keyword" class="input-with-select" @keyup.enter.native="learnList">
            <el-button slot="append" type="primary" @click="learnList" >学习一下</el-button>
          </el-input>
        </div>
        <el-tabs v-model="activeName"  type="card" @tab-click="learnList">
          <el-tab-pane label="全部" name="0">
            <learn-list ref="0" :activeName="activeName" :keyword="keyword"></learn-list>
          </el-tab-pane>
          <el-tab-pane label="习主席" name="1">
            <learn-list ref="1" :activeName="activeName" :keyword="keyword"></learn-list>
          </el-tab-pane>
          <el-tab-pane label="十三五" name="2">
            <learn-list ref="2" :activeName="activeName" :keyword="keyword"></learn-list>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import banner from '@/assets/images/banner.jpg'
import LearnList from './components/LearnList'
export default {
  name: 'learn',
  components: {
    LearnList
  },
  data() {
    return {
      banner,
      keyword: '',
      activeName: '0'
    }
  },
  mounted() {
    this.learnList()
  },
  methods: {
    learnList() {
      this.$nextTick(_ => {
        this.$refs[this.activeName].searchOption()
      })
    }
  }
}
</script>


<style lang="scss" scoped>
.learning {
  height: 100%;
  .learning-head {
    margin-bottom: -5px;
    img {
      width: 100%;
    }
  }
  .learning-body {
    background-color: #def5fb;
    padding: 10px 0;
    .learing-search{
      width: 800px;
      margin:10px auto 20px;
    }
  }
}
</style>
<style lang="scss">
.learning {
  .el-input-group__append button.el-button{
    color: #FFF;
    background-color: $mainColor;
    border-color: $mainColor;
    border-radius: 0px;
  }
    .el-tabs__item{
      color: #666;
      padding: 0 45px;
      font-weight:bolder;
      font-size:16px;
      // background-color: #f5f7fa;
      &.is-active{
        color:#fff;
        background-color: $mainColor;
        border-radius: 0px;
      }
    }
    .el-tabs--top.el-tabs--card>.el-tabs__header .el-tabs__item:nth-child(2),
    .el-tabs--bottom .el-tabs--left>.el-tabs__header .el-tabs__item:last-child, .el-tabs--bottom .el-tabs--right>.el-tabs__header .el-tabs__item:last-child, .el-tabs--bottom.el-tabs--border-card>.el-tabs__header .el-tabs__item:last-child, .el-tabs--bottom.el-tabs--card>.el-tabs__header .el-tabs__item:last-child, .el-tabs--top .el-tabs--left>.el-tabs__header .el-tabs__item:last-child, .el-tabs--top .el-tabs--right>.el-tabs__header .el-tabs__item:last-child, .el-tabs--top.el-tabs--border-card>.el-tabs__header .el-tabs__item:last-child, .el-tabs--top.el-tabs--card>.el-tabs__header .el-tabs__item:last-child {
      padding-left: 45px;
      padding-right: 45px;
    }
    .el-tabs--card>.el-tabs__header .el-tabs__nav{
      border: none;
    }
    // .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
    //   border-bottom-color: $mainColor;
    // }
    .el-tabs--card>.el-tabs__header .el-tabs__item{
      // border-left: 1px solid $mainColor;
      // border-left: 1px solid #dcdfe6;
      border-left: none;
    }
    // .el-tabs--card>.el-tabs__header .el-tabs__item:first-child {
    //     border-left: none;
    // }
    .learing-search{
      .el-input.is-active .el-input__inner, .el-input__inner:focus {
          border-color: #DCDFE6;
          outline: 0;
      }
    }
}
</style>

