/*
 * @Author: lk 
 * @Date: 2019-11-02 16:39:31 
 * @Last Modified by: lk
 * @Last Modified time: 2019-12-25 03:11:18
 * @Description:  政策文章
 */
<template>
    <div class="article">
        <div class="article-title">{{articleDetail.conTitle}}</div>
        <div class="article-options">
            <span>发布时间: {{articleDetail.publishDate}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
            <span>发布机构: {{articleDetail.publishOrg}}</span>
        </div>
        <div class="article-content" v-html="articleDetail.fileContent">
        </div>
        <div class="ori-link">
            原文链接
            <a target="_blank" :href="articleDetail.conUrl">{{articleDetail.conUrl}}</a>
        </div>
    </div>
</template>
<script>
import { baseRequest } from '@/api/base'
export default {
  name: 'dashboard',
  data() {
    return {
      articleDetail: {}
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
  },
  methods: {
    getInfo() {
      baseRequest('/crawlConInfo/select', { crawlConId: this.$route.query.crawlConId }).then(response => {
        this.articleDetail = response.data.item
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.article{
    width: 1200px;
    margin:0 auto;
    background-color: #fff;
    .article-title{
        text-align:center;
        padding-top:30px;
        font-size: 30px;
        font-weight: 600;
    }
    .article-options{
        text-align: center;
        padding-top:10px;
        color:#999;
    }
    .article-content{
        padding: 30px 30px;
        line-height: 40px;
    }
    .ori-link{
        padding: 0 30px 30px;
        a{
            color: #409EFF;
        }
    }
}
</style>
