/*
 * @Author: lk 
 * @Date: 2019-11-02 16:39:31 
 * @Last Modified by: lk
 * @Last Modified time: 2020-01-08 16:54:37
 * @Description:  政策文章
 */
<template>
  <div class="policy base-container clearfix"
       v-loading="loading">
    <div class="article">
      <div class="article-title">{{articleDetail.docName}}</div>
      <div class="article-options">
        <span>发布时间: {{articleDetail.docIssueTime | timeFiltering}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
        <span>发布机构: {{articleDetail.issueOrgText}}</span>
      </div>
      <div class="article-content"
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
              v-for="item in articleDetail.listBDocBasicpolicy"
              :key="item.id"
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
    getInfo(id) {
      let crawlConId = ''
      if (id) {
        crawlConId = id
        this.$router.push({ name: 'policy', query: { crawlConId }})
      } else {
        crawlConId = this.$route.query.crawlConId
      }
      this.loading = true
      baseRequest('/bDocBasic/selectById', { id: crawlConId }).then(response => {
        this.articleDetail = response.data.item
        const temp = response.data.item.listBDocBasicExplain
        const pageSize = 4
        if (temp && temp.length > 0) {
          const pageCount = Math.ceil(temp.length / pageSize)
          for (let x = 0; x < pageCount; x++) {
            const children = temp.slice(x * 4, x * 4 + 4)
            this.explains.push(children)
          }
        }
        this.loading = false
      }, _ => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// .policy {
// }
</style>
