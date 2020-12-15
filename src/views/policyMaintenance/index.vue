/*
 * @Author: wk 
 * @Date: 2020-05-29 17:02:49 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-12-15 16:52:30
 * @Description:  政策数据维护
 */
<template>
  <div class="policy-main task list-comtainer" v-loading="loading">
    <div class="">
      <div class="row-botton new clearfix">
        <div class="row-title">
          <svg-icon icon-class="search" />
          <span>筛选查询</span>
        </div>
        <!-- <div class="row-option">
          <a @click="searchToggle=false"
             v-if="searchToggle">
            <svg-icon icon-class="up" />&nbsp;收起</a>
          <a @click="searchToggle=true"
             v-else>
            <svg-icon icon-class="down" />&nbsp;展开</a>
        </div> -->
      </div>
      <div v-show="searchToggle"
           class="form-search new">
        <div class="policy-search">
          <search ref="resultSearch"
                  @seacrHandle="seacrHandle"
                  @searchOperate="searchOperate"></search>
          <div class="search-button">
            <!-- <el-button icon="el-icon-plus"
                       @click="addParent"
                       plain>新增</el-button> -->
            <el-upload ref="upload"
                     action="/bDocBasic/uploadDoc"
                     style="display: inline-block"
                     :show-file-list="false"
                     :http-request="sourceUploadRequestInside"
                     :auto-upload="true">
            <el-button slot="trigger"
                       class="menu"
                       >政策公文导入</el-button>

          </el-upload>
            <!-- <el-button icon="el-icon-refresh"
                       plain
                       @click="openFullScreen"
                       type="info">同步运算</el-button> -->
            <!-- <el-upload ref="upload"
                       action="/bDocBasic/upload"
                       style="display:inline-block;margin:0 5px; position: relative;"
                       :http-request="sourceUploadRequest"
                       :show-file-list="false"
                       :auto-upload="true">
              <el-button icon="el-icon-upload"
                         plain
                         type="primary">批量导入</el-button>
              <div style="font-size:12px;color:#c9c9c9; position: absolute;bottom:-14px;left:5px;widht:60px">zip/doc/docx格式</div>
            </el-upload> -->

          </div>
        </div>
      </div>
    </div>
    <div class="">
      <div class="row-botton new clearfix">
        <div class="row-title">
          <svg-icon icon-class="ul" />
          <span>数据列表</span>
        </div>
        <!-- <div class="row-option">
          <a @click="tableToggle=false"
             v-if="tableToggle">
            <svg-icon icon-class="up" />&nbsp;收起</a>
          <a @click="tableToggle=true"
             v-else>
            <svg-icon icon-class="down" />&nbsp;展开</a>
        </div> -->
      </div>
      <div>
        <el-table :data="tabledata"
                  v-show="tableToggle"
                  border
                  :height="tableHeight">
          <el-table-column label="政策法规名称"
                           align="center"
                           show-overflow-tooltip
                           min-width="200">
            <template slot-scope="scope" >
               {{scope.row.docName}}
            </template>
          </el-table-column>
          <el-table-column label="政策法规文号"
                           align="center"
                           show-overflow-tooltip
                           min-width="200">
            <template slot-scope="scope">
                {{scope.row.docNum}}
            </template>
          </el-table-column>
          <el-table-column label="政策原文名称"
                           align="center"
                            show-overflow-tooltip
                           min-width="200">
            <template slot-scope="scope">
               {{scope.row.docTittle}}
            </template>
          </el-table-column>
          <el-table-column label="定位"
                           align="center"
                            show-overflow-tooltip
                           min-width="200">
            <template slot-scope="scope">
             {{scope.row.docPositioning}}
            </template>
          </el-table-column>
          <el-table-column label="发布时间"
                           prop="docIssueTime"
                           align="center"
                           min-width="200">

          </el-table-column>
          <el-table-column label="生效时间"
                           prop="docEffectiveTime"
                           align="center"
                           min-width="200">

          </el-table-column>
          <el-table-column label="废止时间"
                           prop="docAnnulTime"
                           align="center"
                           min-width="200">

          </el-table-column>
          <el-table-column label="发布单位类型"
                           align="center"
                             show-overflow-tooltip
                           min-width="200">
            <template slot-scope="scope">
               {{scope.row.issueOrgType}}
             
            </template>
          </el-table-column>
          <el-table-column label="发布单位名称"
                           align="center"
                            show-overflow-tooltip
                           min-width="200">
            <template slot-scope="scope">
             
               {{scope.row.issueOrgText}}
            
            </template>
          </el-table-column>
          <el-table-column label="发文方式"
                           align="center"
                            show-overflow-tooltip
                           min-width="200">
            <template slot-scope="scope">
             
               {{scope.row.issueType}}
            </template>
          </el-table-column>
          <el-table-column label="适用范围"
                           align="center"
                            show-overflow-tooltip
                           min-width="200">
            <template slot-scope="scope">
           
                {{scope.row.docUseBroad}}
            </template>
          </el-table-column>
          <el-table-column label="适用范围描述"
                           align="center"
                            show-overflow-tooltip
                           min-width="200">
            <template slot-scope="scope">
            
                {{scope.row.docUseBroadText}}
            </template>
          </el-table-column>
          <el-table-column label="密级"
                           align="center"
                            show-overflow-tooltip
                           min-width="200">
            <template slot-scope="scope">
                 {{scope.row.docSecretClass}}
            </template>
          </el-table-column>
          <el-table-column label="内容体系"
                           align="center"
                            show-overflow-tooltip
                           min-width="200">
            <template slot-scope="scope">
               {{scope.row.docContentSys}}
            </template>
          </el-table-column>
          <el-table-column label="文章类型"
                           align="center"
                            show-overflow-tooltip
                           min-width="200">
            <template slot-scope="scope">
                {{scope.row.docType}}
            </template>
          </el-table-column>
          <el-table-column label="领域类型"
                           align="center"
                            show-overflow-tooltip
                           min-width="200">
            <template slot-scope="scope">
                 {{scope.row.docDomainType}}
            </template>
          </el-table-column>
          <el-table-column label="军民融合相关度"
                           align="center"
                            show-overflow-tooltip
                           min-width="200">
            <template slot-scope="scope">
                {{scope.row.about}}
            </template>
          </el-table-column>
          <el-table-column label="可操作性"
                           align="center"
                            show-overflow-tooltip
                           min-width="200">
            <template slot-scope="scope">
                 {{scope.row.docOperability}}
            </template>
          </el-table-column>
          <el-table-column label="评估重点"
                           align="center"
                            show-overflow-tooltip
                           min-width="200">
            <template slot-scope="scope">
               {{scope.row.docFocalPoint}}
            </template>
          </el-table-column>
          <el-table-column label="来源网站"
                           align="center"
                            show-overflow-tooltip
                           min-width="200">
            <template slot-scope="scope">
                {{scope.row.docSource}}
            </template>
          </el-table-column>
          <el-table-column label="链接地址"
                           align="center"
                            show-overflow-tooltip
                           min-width="200">
            <template slot-scope="scope">
                {{scope.row.docUri}}
            </template>
          </el-table-column>
          <el-table-column label="文件路径"
                           align="center"
                           show-overflow-tooltip
                           min-width="200">
            <template slot-scope="scope">
              {{scope.row.docFile}}
            </template>
          </el-table-column>
          <el-table-column label="关联法规名称"
                           align="center"
                            show-overflow-tooltip
                           min-width="200">
            <template slot-scope="scope">
                {{scope.row.fDocTittle}}
            </template>
          </el-table-column>
          <el-table-column label="关联法规文号"
                           align="center"
                            show-overflow-tooltip
                           min-width="200">
            <template slot-scope="scope">
               {{scope.row.fDocNum}}
            </template>
          </el-table-column>
          <el-table-column label="军民融合条款摘录"
                        show-overflow-tooltip
                           align="center"
                           min-width="200">
            <template slot-scope="scope">
                 {{scope.row.docSummary}}
            </template>
          </el-table-column>
          <el-table-column label="关键词"
                           align="center"
                            show-overflow-tooltip
                           min-width="200">
            <template slot-scope="scope">
               {{scope.row.docKeyWord}}
            </template>
          </el-table-column>
          <el-table-column label="政策体系"
                           align="center"
                            show-overflow-tooltip
                           min-width="200">
            <template slot-scope="scope">
                 {{scope.row.docSys}}
            </template>
          </el-table-column>
          <el-table-column label="军民融合领域"
                           align="center"
                           show-overflow-tooltip
                           min-width="200">
            <template slot-scope="scope">
                {{scope.row.fuseField}}
            </template>
          </el-table-column>
          <el-table-column label="是否属于新形式新任务"
                           align="center"
                           show-overflow-tooltip
                           min-width="200">
            <template slot-scope="scope">
                {{scope.row.newSituaTask}}
            </template>
          </el-table-column>

          <el-table-column label="是否删除"
                           align="center"
                           min-width="200">
            <template slot-scope="scope">
              {{scope.row.docDelete==='0'?"未删除":(scope.row.docDelete==='1'?"删除":'')}}
            </template>
          </el-table-column>
          <el-table-column label="项目状态"
                           align="center"
                           prop="protStateStr"
                           min-width="200">

          </el-table-column>
          <el-table-column label="操作"
                           width="200"
                           fixed="right"
                           align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row"
                         type="primary"
                         plain
                         size="mini"
                         @click="modParent(scope.row)">修改</el-button>
              <el-button size="mini"
                         plain
                         type="danger"
                         @click="deleteForm(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="pageNo"
                       :total="total"
                       layout="total, sizes, prev, pager, next, jumper"
                       :page-sizes="[10,15,20]"
                       :page-size="pageSize">
        </el-pagination>
      </div>
    </div>

    <add-modification ref="modification" @changeLoading="changeLoading" @searchOption="searchOption"></add-modification>

  </div>
</template>
<script>
import { baseSearch, baseRequest, baseUpload } from '@/api/base'
import Search from './components/searchPolicy'
import addModification from './components/addModification'
// const url = '/confProtInfo/selects'
export default {
  components: {
    Search,
    addModification
  },
  data() {
    return {
      loading: false,
      searchParam: {},
      fileList: [], // 上传文件列表
      pageNo: 1,
      total: null,
      pageSize: 15,
      taskName: '', // 列表查询参数
      // tableHeight: 0,
      searchToggle: true,
      tableToggle: true,
      tabledata: null,
      cjVisible: false,
      dlVisible: false,
      currentProtId: null
    }
  },
  computed: {
    tableHeight: function() {
      return this.$store.state.app.containHeight - 380
    }
  },
  mounted() {
    this.searchOption()
    // this.getTableHeight()
  },
  watch: {
    searchToggle() {
      // this.getTableHeight()
    }
  },
  filters: {
    written(val) {
      // if (val.length > 18) {
      //   return val.substr(0, 18) + '...'
      // } else {
      return val
      // }
    }
  },
  methods: {
    sourceUploadRequestInside(content) {
      this.$refs.modification.articleId = ''
      this.$refs.modification.sourceUploadRequest(content)
    },
    changeLoading(boo) {
      this.loading = boo
    },
    modParent(data) {
      this.$refs.modification.maintainMod(data)
    },
    addParent() {
      this.$refs.modification.maintainAdd()
    },
    openFullScreen() { // 同步运算
      const loading = this.$loading({
        lock: true,
        text: '运算中请等待',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      baseRequest('/bDocBasic/runModel').then(response => {
        loading.close()
        this.$Message.success('操作成功')
      }).catch(err => {
        this.$Message.error(err)
      })
    },
    searchOperate(parmas) { // 高级搜索
      this.searchParam = parmas
      this.searchOption()
    },
    seacrHandle(val) { // 普通搜索
      this.searchParam = val
      this.searchOption()
      // alert(val.dataValue)
    },
    getTableHeight() {
      this.$nextTick(_ => {
        const formDom = document.querySelector('.form-search new')
        const formHeight = formDom ? formDom.offsetHeight : 0
        this.tableHeight = document.body.offsetHeight - formHeight - 160
      })
    },
    handleSizeChange(val) { // 分页
      this.pageSize = val
      this.searchOption()
    },
    handleCurrentChange(val) { // 分页
      this.pageNo = val
      this.searchOption(true)
    },
    searchOption(page) {
      if (!page) {
        this.pageNo = 1
      }
      // this.$refs.basicTable.getData(url, this.$refs.searchForm.searchParam())
      this.searchParam.pageNo = this.pageNo
      this.searchParam.pageSize = this.pageSize
      baseSearch('/bDocBasic/selects', this.searchParam).then(response => {
        this.tabledata = response.data.item
        // if (this.tabledata) {
        //   for (const i in this.tabledata) {
        //     this.$set(this.tabledata, i, response.data.item[i])
        //   }
        // }
        this.total = response.data.total
        this.pageSize = response.data.pageSize
      })
    },
    // 删除
    deleteForm(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        baseRequest('/bDocBasic/delete', { id: row.id }).then(response => {
          this.$Message.success('操作成功')
          this.searchOption()
        })
      })
    },

    addModel() {
      this.$router.push({ name: 'taskOption' })
    },

    // 修改表单
    updateOption(row) {
      this.$router.push({ name: 'taskOption', query: { protId: row.protId }})
    },
    sourceUploadRequest(content) {
      const patt = new RegExp('.*\.(zip|doc|docx)$')
      if (!patt.test(content.file.name)) {
        this.$refs.upload.clearFiles
        this.$message({
          showClose: true,
          message: '错误的文件类型,请选择zip/doc/docx文件上传',
          type: 'error'
        })
        return
      }
      // const isLt100M = content.file.size / 1024 / 1024 < 100
      // if (!isLt100M) {
      //   this.$refs.upload.clearFiles
      //   this.$message({
      //     showClose: true,
      //     message: '文件大小不能超过100M',
      //     type: 'error'
      //   })
      //   return
      // }
      var form = new FormData()
      form.append('file', content.file)
      // form.append('labelId', this.labelId)
      this.loading = true

      baseUpload('/bDocBasic/upload', form).then((response) => {
        this.loading = false
        this.$Message.success('上传成功')
      }, _ => {
        this.$refs.upload.clearFiles()
        this.loading = false
        this.$message({
          showClose: true,
          message: '上传失败',
          type: 'error'
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.select-down:hover {
  width: 300px;
}
.policy-main {
  .policy-search {
    width: 920px;
    margin: 0 auto;
    text-align: center;
    .search-button {
      margin: 8px auto 15px auto;
    }
  }
}
</style>