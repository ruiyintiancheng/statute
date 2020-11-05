<template>
    <div class="read base-container clearfix" v-loading="loading">
            <div class="catalog" :style="{height:catalogHeight + 'px'}">
              <el-scrollbar wrapClass="scrollbar-wrapper" style="height:100%">
                    <template v-for="(it1,index1) in catalogData">
                      <a v-if="it1.level === 1" :class="{'catalog-one':true}" :title="it1.catalog"  :key="it1+index1" :href="'#'+it1.size"><span class="catalog-name">{{it1.catalog}}</span></a>
                      <a v-else-if="it1.level === 2" class="catalog-two" :title="it1.catalog" :key="it1+index1" :href="'#'+it1.size"><span class="catalog-name">{{it1.catalog}}</span></a>
                      <a v-else-if="it1.level === 3" class="catalog-three" :title="it1.catalog" :key="it1+index1" :href="'#'+it1.size"><span class="catalog-name">{{it1.catalog}}</span></a>
                    </template>
              </el-scrollbar>
            </div>
        <div class="read-article article" :class="{'just-content':!catalogData || catalogData.length ===0}">
            <div class="article-title">{{title}}</div>
            <div class="article-options" v-if="issueTime || source">
              <span v-if="issueTime">发布时间: {{issueTime |timeFiltering}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
              <span v-if="source">来源: {{source}}</span>
            </div>
            <div class="read-article-content" >
              <p v-for="(item,index) in article" :key="item+index">
                <a  :name="index+''">{{item}}</a>
              </p>
            </div>
        </div>
    </div>
</template>
<script>
import { baseRequest } from '@/api/base'
export default {
  computed: {
    catalogHeight() {
      return this.$store.state.app.containHeight - 37 - 55
    }
  },
  data() {
    return {
      article: [],
      catalogData: [],
      loading: false,
      title: '',
      issueTime: '',
      source: ''
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
  created() {
    this.getContent(this.$route.query.crawlConId)
  },
  methods: {
    getContent(targetFileId) {
      this.loading = true
      baseRequest('/wsClient/getCatalog', { targetFileId }).then(response => {
        this.catalogData = response.data.item.catalog
        this.article = response.data.item.context
        this.title = response.data.item.tittle
        this.issueTime = response.data.item.issueTime
        this.source = response.data.item.source
        this.loading = false
      })
    },
    jumpRowHandle(index) {
      const appMainDom = document.querySelector('.app-main')
      const number = Number(index) - 1
      appMainDom.scrollTop = 37 + (number * 30.75)
    }
  }
}
</script>
<style lang="scss" scoped>
.read{
    font-size: 16px;
    color:#333;
    padding-top:37px;
    .catalog{
        // padding:10px 0;
        float: left;
        width: 240px;
        position: absolute;
        a{
            display: block;
            & .catalog-name:hover{
              color:#409EFF;
            }
        }
        .catalog-one{
            line-height: 38px;
            font-weight: 600;
            cursor: pointer;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            margin-top:6px;
            .catalog-first{
              margin-top: 0px;
            }
        }
        .catalog-two,.catalog-three{
            line-height: 33px;
            font-size: 14px;
            color:#666;
            font-weight: normal;
            cursor: pointer;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
        }
        .catalog-two{
          text-indent: 1em;
        }
        .catalog-three{
          text-indent: 2em;
        }
    }
    .read-article{
        float:left;
        margin-left: 240px;
        width: calc(100% - 240px);
        padding: 0px 93px;
        &.just-content{
          margin-left: 0px;
          width: auto;
        }
        .read-article-content{
            line-height: 29px;
        }
        &.article{
          .article-title{
                padding-top: 0px;
          }
        }
    }
}
</style>
<style lang="scss">
.read{
  .el-scrollbar__wrap{
    overflow-x: hidden;
  }
}
</style>