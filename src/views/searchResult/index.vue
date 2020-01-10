/*
 * @Author: lk 
 * @Date: 2019-12-24 20:48:17 
 * @Last Modified by: lk
 * @Last Modified time: 2020-01-10 15:31:28
 * @Description:  查询列表
 */
<template>
  <div class="search-result base-container">
    <div class="result-search base-container">
      <search ref="resultSearch"
              @seacrHandle="seacrHandle"
              @searchOperate="searchOperate"></search>
    </div>
    <div class="literalexcess"
         v-if="literalexcess"><i class="el-icon-warning-outline"></i> 查询限制在38个汉字以内超出后省略。</div>
    <div style='margin:20px 0;font-size:16px'
         v-if="total || total === 0">
      当前关键词:<span style="color:#1f73f3;"
            v-if="keyword">"{{keyword}}"</span>&nbsp;&nbsp;共<span style="color:#1f73f3;">{{total}}</span>条相关记录
    </div>
    <div class="searchBody"
         v-loading="listLoading">
      <div class="query-results"
           v-if="hasData">
        <div class="data-bar"
             v-for="(item,index) in tabularData"
             :key="index">
          <a @click="$router.push({name:'policy',query:{crawlConId:item.id}})"
             style="color:#666">
            <h4> <span v-html="item.issueOrgText"></span>:<span v-html="item.docName  "></span></h4>
          </a>
          <p class="bar-title"
             style="font-size:14px;color:#777"
             v-html="item.docContent"></p>
          <p class="bar-date"
             style="font-size:12px;color:#999">{{item.docIssueTime==='null'?'':item.docIssueTime}}</p>
        </div>
        <el-pagination v-if="total || total === 0"
                       background
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="pageNo"
                       :total="total"
                       style="margin-bottom:10px;text-align:center;margin-top:44px;"
                       layout="total, sizes, prev, pager, next, jumper"
                       :page-sizes="[10,15,20]"
                       :page-size="pageSize">
        </el-pagination>
      </div>
      <div v-else
           class="not-find">
        <h3>未查询到相关结果,建议:</h3>
        <p>1.请检查输入是否有误</p>
        <p>2.请您尝试简化输入词</p>
        <p>3.请您尝试用类似词或常见词</p>
      </div>
    </div>
  </div>
</template>
<script>
import { baseRequest } from '@/api/base'
import Search from '@/components/Search'
export default {
  name: 'searchResult',
  components: {
    Search
  },
  data() {
    return {
      tabularData: null, // 列表数据
      pageNo: 1,
      total: null,
      pageSize: 15,
      // 查询类型 1 直接查询 2复杂查询
      judgment: null,
      hasData: true,
      keyword: '',
      literalexcess: false,
      listLoading: false
    }
  },
  mounted() {
    this.routingQuery()
  },
  methods: {
    handleSizeChange(val) { // 分页
      this.pageSize = val
      this.requestSearch()
    },
    handleCurrentChange(val) { // 分页
      this.pageNo = val
      this.requestSearch(true)
    },
    searchOperate() {
      this.judgment = 2
      this.keyword = this.$refs.resultSearch.dataValue
      this.requestSearch()
    },
    seacrHandle() {
      this.judgment = 1
      this.keyword = this.$refs.resultSearch.dataValue
      this.requestSearch()
    },
    requestSearch(page) {
      this.back2Top()
      const query = {}
      if (this.judgment === 1) {
        query.val = this.keyword
      } else {
        query.params = JSON.stringify(this.$refs.resultSearch.updateFormData)
      }
      this.$router.push({
        path: '/search',
        query: query
      })
      if (!page) {
        this.pageNo = 1
      }
      const params = {
        pageNo: this.pageNo, pageSize: this.pageSize
      }
      if (this.judgment === 1) {
        if (this.keyword.length > 38) {
          this.literalexcess = true
          this.keyword = this.keyword.substr(0, 38)
        } else {
          this.literalexcess = false
        }
        params.wd = {
          content: this.keyword
        }
      } else {
        params.wd = this.getParams()
      }
      this.listLoading = true
      baseRequest('/esIndex/queryDoc', params).then(response => {
        this.tabularData = response.data.item.list
        this.total = response.data.item.total
        this.pageSize = response.data.item.pageSize
        if (response.data.item.list.length !== 0) {
          this.hasData = true
        } else {
          this.hasData = false
        }
        this.listLoading = false
      }, _ => {
        this.listLoading = false
      })
    },
    getParams() {
      let param = {}
      const formItem = this.$refs.resultSearch.updateFormData
      if (this.keyword.length > 38) {
        this.literalexcess = true
        this.keyword = this.keyword.substr(0, 38)
      } else {
        this.literalexcess = false
      }
      param.content = this.keyword
      param = Object.assign(param, formItem)
      return param
    },
    routingQuery() { // 路由传参查询
      if (this.$route.query.val) {
        this.$refs.resultSearch.setText(this.$route.query.val)
        this.$refs.resultSearch.seacrHandle()
      } else if (this.$route.query.params) {
        const params = JSON.parse(this.$route.query.params)
        this.$refs.resultSearch.setText(params.content)
        this.$refs.resultSearch.setParams(params)
        this.$refs.resultSearch.searchOperate()
      }
    },
    back2Top() {
      const mainDom = document.querySelector('.main-container')
      mainDom.scrollTop = 0
    }
  }
}
</script>
<style lang="scss">
.search-result {
  padding: 30px 15px 15px;
  .literalexcess {
    margin-top: 10px;
  }
  .result-search {
    width: 920px;
  }
  .searchBody {
    .not-find {
      font-size: 14px;
      color: #666;
    }
    .data-bar {
      padding: 0 40px;
      h4 {
        line-height: 30px;
        position: relative;
        padding: 28px 0 11px;
        &::before {
          content: "";
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #1f73f3;
          position: absolute;
          top: 36px;
          left: -18px;
        }
      }
      .bar-title {
        line-height: 28px;
        padding: 0 30px 0 5px;
        border: 1px dashed #ccc;
      }
      .bar-date {
        height: 46px;
        line-height: 46px;
      }
      h4,
      p {
        margin: 0;
      }
      &:nth-of-type(2n-1) {
        background-color: #fff;
      }
    }
  }
  .dashboard-card {
    height: 400px;
    margin-top: 15px;
    background-color: #fff;
    .dashboard-card-title {
      text-align: left;
      font-weight: bold;
      font-size: 20px;
      height: 40px;
      line-height: 40px;
      margin-left: 20px;
    }
    .dashboard-card-context {
      margin-left: 20px;
      height: 190px;
      p {
        margin: 0;
        height: 52px;
        line-height: 52px;
        font-size: 18px;
      }
    }
  }
  .dashboard-status {
    height: 500px;
    overflow: hidden;
    margin-top: 15px;
    background-color: #fff;
    &.dashboard-messages {
      background-color: #eff1f4;
      .dashboard-panel {
        height: calc(50% - 10px);
        background-color: #fff;
        &:last-child {
          margin-top: 20px;
        }
        .dashboard-panel-title {
          height: 60px;
          line-height: 60px;
          font-size: 20px;
          margin: 0;
          padding-left: 10px;
        }
        .dashboard-panel-context {
          height: calc(100% - 60px);
          padding: 10px;
          padding-left: 30px;
          overflow: auto;
          a {
            display: block;
            height: 40px;
            line-height: 40px;
            color: #85c1ff;
            text-decoration: underline;
            font-size: 23px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            .svgI {
              color: #000;
            }
          }
        }
      }
    }
  }
  .dashboard-chart {
    height: 400px;
    margin-top: 15px;
    background-color: #fff;
    textarea {
      height: 95%;
    }
  }
}
</style>
