/*
 * @Author: lk 
 * @Date: 2019-11-02 16:39:31 
 * @Last Modified by: 1k
 * @Last Modified time: 2020-01-15 14:33:26
 * @Description:  政策文章
 */
<template>
  <div class="policy base-container clearfix">
    <div class="article"
         v-loading="loading">
      <div class="article-title">{{articleDetail.docName}}</div>
      <div class="article-options">
        <span>发布时间: {{articleDetail.docIssueTime | timeFiltering}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
        <span>发布机构: {{articleDetail.issueOrgText}}</span>
      </div>
      <div :class="{'article-content':true,'article-indent':articleDetail.indent}"
           v-html="articleDetail.content">
      </div>
      <div class="ori-link">
        原文链接
        <a target="_blank"
           :href="articleDetail.docUri">{{articleDetail.docUri}}</a>
      </div>
    </div>
    <div class="other-articles">
      <div class="article-items"
           v-if="articleDetail.listBDocBasicpolicy.length!==0">
        <div class="other-type-name">
          关联政策
        </div>
        <ul class="other-titles">
          <li class="item-title"
              v-for="(item,index) in articleDetail.listBDocBasicpolicy"
              :key="item + index"
              @click="getInfo(item.id)"><a>{{item.docName}}</a></li>

        </ul>
      </div>
      <div class="article-items"
           v-if="articleDetail.listBDocBasicExplain.length!==0">
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
              <router-link :to="{name:'explain',query:{crawlConId:t.id}}">{{t.docName}}</router-link>
            </li>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </div>
</template>
<script>
import { baseRequest } from '@/api/base'
export default {
  name: 'policy',
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
      if (to.name === 'policy') {
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
    getInfo(id) {
      let crawlConId = ''
      if (id) {
        crawlConId = id
        this.$router.push({ name: 'policy', query: { crawlConId }})
      } else {
        crawlConId = this.$route.query.crawlConId
      }
      this.loading = true
      this.explains = []
      baseRequest('/bDocBasic/selectById', { id: crawlConId }).then(response => {
        this.articleDetail = response.data.item
        if (response.data.item.contentType !== 'html') {
          this.articleDetail.content = this.getHtml(this.articleDetail.content)
          this.articleDetail.indent = true
        } else {
          this.articleDetail.indent = false
        }
        const temp = response.data.item.listBDocBasicExplain
        if (temp && temp.length > 0) {
          this.explains = this.group(temp, 4)
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
    },
    group(array, subGroupLength) { // 拆分数组
      let index = 0
      const newArray = []
      while (index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength))
      }
      return newArray
    }
  }
}
</script>

<style lang="scss" scoped>
// .policy {
// }
</style>
