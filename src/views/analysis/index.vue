<template>
  <div class="search-result base-container">
    <div class="result-search base-container">
      <el-input placeholder="请输入政策法规名称"
                class="text-search"
                ref="searchInput"
                v-model="dataValue"
                >
        <el-button slot="append"
                  icon="el-icon-search"
                  @click="seacrHandle">搜索</el-button>
      </el-input>
    </div>
    <div class="searchBody"  v-loading="listLoading">
      <div class="query-results"
           v-if="hasData">
        <div class="data-bar"
             v-for="(item,index) in tabularData"
             :key="index"
             >
          <a style="color:#666">
            <h4> <span v-html="item.docName"></span></h4>
          </a>
          <div>
            <div style="display: inline-block;"><span>发布单位: </span></div>
            <div style="margin-left: 80px; margin-top: -18px;">
              <span>{{item.docIssueOrgText}}</span>
            </div>
          </div>
          <div style="margin-top: 5px;margin-bottom: 5px;">
            <span>发布时间: {{item.docIssueTime}}</span>
          </div>
          <div>
            <el-button type="primary" @click="openChart(item.id, item.docName, 0)">政策法规关联分析 </el-button>
            <el-button type="success" @click="openChart(item.id, item.docName, 1)">政策法规生命周期分析 </el-button>
            <el-button type="warning" @click="openChart(item.id, item.docName, 2)">政策法规响应层级分析</el-button>
          </div>

          <!-- <p class="bar-title" style="font-size:14px;color:#777"
             v-html="item.fileContent"></p>
          <p class="bar-date" style="font-size:12px;color:#999">{{item.publishDate==='null'?'':item.publishDate}}</p>
         -->
        </div>
        <el-pagination 
                       v-if="total || total === 0"
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
export default {
  data() {
    return {
      dataValue: '',
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
    this.requestSearch()
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
    openChart(id, name, type) {
      this.$router.push({
        name: 'relationChart',
        params: {
          id: id, // 500166, 500007
          name: name,
          type: type
        }
      })
    },
    seacrHandle() {
      if (this.dataValue.length <= 0) {
        return false
      }
      this.requestSearch()
    },
    requestSearch(page) {
      if (!page) {
        this.pageNo = 1
      }
      const params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        docName: this.dataValue
      }
      this.listLoading = true
      baseRequest('/gVertex/selects', params).then(response => {
        this.tabularData = response.data.item
        this.total = response.data.total
        this.pageSize = response.data.pageSize
        if (response.data.item.length !== 0) {
          this.hasData = true
        } else {
          this.hasData = false
        }
        this.listLoading = false
      }, _ => {
        this.listLoading = false
      })
    }
  }
}
</script>
<style lang="scss">
.search-result {
  padding: 30px 15px 15px;
  .literalexcess{
    margin-top: 10px;
  }
  .result-search{
      width: 920px;
  }
  .searchBody {
    .not-find {
      font-size: 14px;
      color: #666;
    }
    .data-bar{
      padding:0 40px;
      h4{
        line-height: 30px;
        position: relative;
        padding: 28px 0 11px;
        &::before{
          content: "";
          width:10px;
          height: 10px;
          border-radius: 50%;
          background-color: #1f73f3;
          position: absolute;
          top: 36px;
          left: -18px;
        }
      }
      .bar-title{
        line-height: 28px;
        padding:0 30px 0 5px;
        border:1px dashed #ccc;
      }
      .bar-date{
        height: 46px;
        line-height: 46px;
      }
      h4,p{
        margin:0;
      }
      &:nth-of-type(2n-1){
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
