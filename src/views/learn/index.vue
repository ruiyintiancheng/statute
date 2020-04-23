/*
 * @Author: wk
 * @Date: 2019-12-26 11:08:37 
 * @Last Modified by: lk
 * @Last Modified time: 2020-03-11 11:29:17
 * @Description:  学习路上
 */
<template>
  <div class="learning"
       >
    <div class="learning-head">
      <img :src="banner">
    </div>
    <div class="learning-bottom">
      <img :src="bottom">
    </div>
    <div class="learning-body">
      <div class="learning-body-main">
            <div class="learing-oprate">
              <div class="inside-color">
                  <div class="learing-search">
                    <el-input placeholder="请输入关键字" v-model.trim="keyword" class="input-with-select" @keyup.enter.native="learnList">
                      <el-button slot="append" type="primary" @click="learnList('0')" icon="el-icon-search">学习一下</el-button>
                    </el-input>
                </div>
              </div>
            </div>
        <div class="learn-tabs">
          <div class="inside-color">
              <ul class="learn-tabs-body clearfix">
                <li class="learn-tabs-item">
                  <div :class="{'learn-tabs-option':true, 'active':activeName==='0'}" @click="learnList('0')">
                    全部
                  </div>
                </li>
                <li class="learn-tabs-item">
                  <div :class="{'learn-tabs-option':true, 'active':activeName==='1'}" @click="learnList('1')">
                    习主席
                  </div>
                </li>
                <li class="learn-tabs-item">
                  <div :class="{'learn-tabs-option':true, 'active':activeName==='2'}" @click="learnList('2')">
                    十三五
                  </div>
                </li>
              </ul>
          </div>
        </div>
        <div class="learning-data inside-color">
          <div class="base-container">
                <learn-list v-if="activeName==='0'" ref="0" :activeName="activeName" :keyword="keyword"></learn-list>
                <learn-list v-else-if="activeName==='1'" ref="1" :activeName="activeName" :keyword="keyword"></learn-list>
                <learn-list v-else-if="activeName==='2'" ref="2" :activeName="activeName" :keyword="keyword"></learn-list>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import banner from '@/assets/images/learnBanner.png'
import bottom from '@/assets/images/learnBottom.png'
import LearnList from './components/LearnList'
export default {
  name: 'learn',
  components: {
    LearnList
  },
  data() {
    return {
      banner,
      bottom,
      keyword: '',
      activeName: '0'
    }
  },
  mounted() {
    this.learnList()
  },
  methods: {
    learnList(name) {
      if (name) {
        this.activeName = name
      }
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
  background-color: #def5fb;
  position: relative;
  .learning-head,.learning-bottom {
    position: absolute;
    img {
      width: 100%;
      display: block;
    }
  }
  .learning-head{
    opacity: 0.5;
  }
  .learning-bottom {
    bottom:0;
  }
  .inside-color{
    margin: 0px 70px 0;
    background-color: #f8faf5;
    height: 100%;
    overflow: hidden;
  }
  .learning-body {
    // background-color: #def5fb;
    .learning-body-main{
      overflow: hidden;
    }
    .learing-oprate{
      height: 136px;
    }
    .learn-tabs{
      border-bottom:1px solid #a0a0a0;
      .learn-tabs-body{
      position: relative;
      z-index: 1;
        width: 660px;
        list-style: none;
        margin:0 auto;
        .learn-tabs-item{
          float: left;
          text-align: center;
            width: 220px;
          .learn-tabs-option{
            letter-spacing: 1px;
            padding:0 10px;
            font-size: 16px;
            font-weight: 600;
            color:#666666;
            height: 40px;
            line-height: 40px;
            display: inline-block;
            cursor: pointer;
            &.active{
              color:#3164b7;
              border-bottom: 3px solid #3164b7;
            }
          }
        }
      }
    }
    .learning-data{
      padding-top:50px;
      min-width: 1200px;
    }
 
    .learing-search{
      width: 800px;
      margin:60px auto 0px;
    }
  }
}
</style>
<style lang="scss">
.learning {
  .el-input-group__append, .el-input-group__prepend{
    border:none;
  }
  .el-input-group--append .el-input__inner {
    border-radius: 0;
  }
  .el-input-group__append button.el-button{
    color: #FFF;
    background-color: $mainColor;
    border-color: $mainColor;
    border-radius: 0px;
    height: 36px;
  }
    // .el-tabs__item{
    //   color: #666;
    //   padding: 0 45px;
    //   font-weight:bolder;
    //   font-size:16px;
    //   &.is-active{
    //     color:#fff;
    //     background-color: $mainColor;
    //     border-radius: 0px;
    //   }
    // }
    // .el-tabs--top.el-tabs--card>.el-tabs__header .el-tabs__item:nth-child(2),
    // .el-tabs--bottom .el-tabs--left>.el-tabs__header .el-tabs__item:last-child, .el-tabs--bottom .el-tabs--right>.el-tabs__header .el-tabs__item:last-child, .el-tabs--bottom.el-tabs--border-card>.el-tabs__header .el-tabs__item:last-child, .el-tabs--bottom.el-tabs--card>.el-tabs__header .el-tabs__item:last-child, .el-tabs--top .el-tabs--left>.el-tabs__header .el-tabs__item:last-child, .el-tabs--top .el-tabs--right>.el-tabs__header .el-tabs__item:last-child, .el-tabs--top.el-tabs--border-card>.el-tabs__header .el-tabs__item:last-child, .el-tabs--top.el-tabs--card>.el-tabs__header .el-tabs__item:last-child {
    //   padding-left: 45px;
    //   padding-right: 45px;
    // }
    // .el-tabs--card>.el-tabs__header .el-tabs__nav{
    //   border: none;
    // }
    // .el-tabs--card>.el-tabs__header .el-tabs__item{
    //   border-left: none;
    // }
    .learing-search{
      .el-input.is-active .el-input__inner, .el-input__inner:focus {
          border-color: #DCDFE6;
          outline: 0;
      }
    }
}
</style>

