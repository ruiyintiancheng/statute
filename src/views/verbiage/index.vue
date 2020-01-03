/*
 * @Author: wk 
 * @Date: 2019-12-31 11:54:48 
 * @Last Modified by: 1k
 * @Last Modified time: 2020-01-02 16:30:00
 * @Description:  讲话内容
 */
<template>
  <div class="verbiage base-container clearfix"
       v-loading="loading">
    <div class="article">
      <div class="article-title">{{articleDetail.docTittle}}</div>
      <div class="article-options">
        <span>发布时间: {{articleDetail.docIssueTime |timeFiltering}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
        <span>来源: {{articleDetail.docSource}}</span>
      </div>
      <div class="article-content">
        <p v-for="(item,index) in contentFormat(articleDetail.content)"
           :key="index">{{item}}</p>
      </div>
      <!-- <div class="ori-link">
        原文链接
        <a target="_blank"
           :href="articleDetail.conUrl">{{articleDetail.conUrl}}</a>
      </div> -->
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
  filters: {
    timeFiltering(t) {
      if (t) {
        const newdate = t.substr(0, 10)
        return newdate
      }
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    contentFormat(t) {
      const str = t.trim().split(/\s+/)
      return str
    },
    getInfo(id) {
      let crawlConId = ''
      if (id) {
        crawlConId = id
        this.$router.push({ name: 'policy', query: { crawlConId }})
      } else {
        crawlConId = this.$route.query.crawlConId
      }
      this.loading = true
      baseRequest('bXjpBasic/selectById', { id: crawlConId }).then(response => {
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