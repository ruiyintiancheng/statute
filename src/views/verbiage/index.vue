/*
 * @Author: wk 
 * @Date: 2019-12-31 11:54:48 
 * @Last Modified by: 1k
 * @Last Modified time: 2019-12-31 16:20:22
 * @Description:  讲话内容
 */
<template>
  <div class="verbiage base-container clearfix"
       v-loading="loading">
    <div class="article">
      <div class="article-title">{{articleDetail.conTitle}}</div>
      <div class="article-options">
        <span>发布时间: {{articleDetail.publishDate}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
        <span>来源: {{articleDetail.publishOrg}}</span>
      </div>
      <div class="article-content"
           v-html="articleDetail.fileContent">
      </div>
      <div class="ori-link">
        原文链接
        <a target="_blank"
           :href="articleDetail.conUrl">{{articleDetail.conUrl}}</a>
      </div>
    </div>
    <!-- <div class="other-articles">
      <div class="article-items">
        <div class="other-type-name">
          关联政策
        </div>
        <ul class="other-titles">
          <li class="item-title"
              @click="getInfo(128)"><a>《关于军地建立无线电管理协议机制》</a></li>
          <li class="item-title"
              @click="getInfo(128)"><a>《关于军地建立无线电管理协议机制》</a></li>
          <li class="item-title"
              @click="getInfo(128)"><a>《关于军地建立无线电管理协议机制》</a></li>
        </ul>
      </div>
      <div class="article-items">
        <div class="other-type-name">
          相关专家解读(多条)
        </div>
        <el-carousel class="other-titles other-explains"
                     trigger="click"
                     height="160px"
                     indicator-position="outside"
                     arrow="never">
          <el-carousel-item v-for="(item,index) in this.explains"
                            :key="item+index">
            <li class="item-title"
                v-for="(t,i) in item"
                :key="t+i">
              <router-link :to="{name:'explain',query:{crawlConId:128}}">{{t}}</router-link>
            </li>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div> -->
  </div>
</template>
<script>
import { baseRequest } from '@/api/base'
export default {
  name: 'verbiage',
  data() {
    return {
      articleDetail: {},
      explains: [
      ],
      loading: false
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'articleIndex') {
        if (this.$route.query.crawlConId) {
          this.getInfo()
        }
      }
    }
  },
  mounted() {
    this.getInfo()
    const temp = [
      '苗圩：1全面推进无线电管理工作再发多少大开发收到了',
      '苗圩：2全面推进无线电管理工作再发多少大开发收到了',
      '苗圩：3全面推进无线电管理工作再发多少大开发收到了',
      '苗圩：4全面推进无线电管理工作再发多少大开发收到了',
      '苗圩：5全面推进无线电管理工作再发多少大开发收到了',
      '苗圩：6全面推进无线电管理工作再发多少大开发收到了',
      '苗圩：7全面推进无线电管理工作再发多少大开发收到了',
      '苗圩：8全面推进无线电管理工作再发多少大开发收到了',
      '苗圩：9全面推进无线电管理工作再发多少大开发收到了',
      '苗圩：10全面推进无线电管理工作再发多少大开发收到了'
    ]
    const pageSize = 4
    if (temp && temp.length > 0) {
      const pageCount = Math.ceil(temp.length / pageSize)
      for (let x = 0; x < pageCount; x++) {
        const children = temp.slice(x * 4, x * 4 + 4)
        this.explains.push(children)
      }
    }
  },
  methods: {
    getInfo(id) {
      let crawlConId = ''
      if (id) {
        crawlConId = id
        this.$router.push({ name: 'policy', query: { crawlConId }})
      } else {
        crawlConId = this.$route.query.crawlConId
      }
      this.loading = true
      baseRequest('/crawlConInfo/select', { crawlConId }).then(response => {
        this.articleDetail = response.data.item
        this.loading = false
      }, _ => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.verbiage {
  .article {
    float: none;
    margin: 0 auto;
  }
}
</style>