/*
 * @Author: wk 
 * @Date: 2019-12-31 11:54:48 
 * @Last Modified by: 1k
 * @Last Modified time: 2020-01-15 10:39:16
 * @Description:  讲话内容
 */
<template>
  <div class="verbiage base-container clearfix">
    <div class="article"
         v-loading="loading">
      <div class="article-title">{{articleDetail.docTittle}}</div>
      <div class="article-options">
        <span>发布时间: {{articleDetail.docIssueTime |timeFiltering}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
        <span>来源: {{articleDetail.docSource}}</span>
      </div>
      <div :class="{'article-content':true,'article-indent':articleDetail.indent}">
        <!-- <p v-for="(item,index) in contentFormat(articleDetail.content)"
           :key="index">{{item}}</p> -->
        <div v-html="articleDetail.content"></div>
      </div>
      <!-- <div class="ori-link">
        原文链接 :
        <a target="_blank"
           :href="conUrl">{{conUrl}}</a>
      </div> -->
    </div>
  </div>
</template>
<script>
import { baseRequest } from '@/api/base'
export default {
  name: 'verbiage',
  data() {
    return {
      conUrl: null,
      articleDetail: {},
      explains: [
      ],
      loading: false
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'verbiage') {
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
        const reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g
        this.conUrl = this.articleDetail.content.match(reg)[0]
        this.articleDetail.content = this.articleDetail.content.replace(reg, '原文链接 <a style="color:#40A9FF" target="_blank" href="' + this.conUrl + '">' + this.conUrl + '</a>')
        if (response.data.item.contentType !== 'html') {
          this.articleDetail.content = this.getHtml(this.articleDetail.content)
          this.articleDetail.indent = true
        } else {
          this.articleDetail.indent = false
        }
        this.loading = false
      }, _ => {
        this.loading = false
      })
    },
    getHtml(content) {
      let str = ''
      if (content) {
        str = content.replace(/\n/g, '<p>')
      }
      return str
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