/*
 * @Author: wk 
 * @Date: 2020-05-29 17:02:49 
 * @Last Modified by: wk
 * @Last Modified time: 2020-06-04 11:13:07
 * @Description:  政策数据维护
 */
<template>
  <div class="policy-main task list-comtainer">
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
            <el-button icon="el-icon-plus"
                       @click="addParent"
                       plain>新增</el-button>
            <el-upload ref="upload"
                       action="/bDocBasic/upload"
                       style="display:inline-block;margin:0 5px;"
                       :http-request="sourceUploadRequest"
                       :show-file-list="false"
                       :auto-upload="true">
              <el-button icon="el-icon-upload"
                         plain
                         type="primary">批量导入</el-button>
            </el-upload>

            <el-button icon="el-icon-refresh"
                       plain
                       @click="openFullScreen"
                       type="info">同步运算</el-button>
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
        <el-table :data="data"
                  v-show="tableToggle"
                  border
                  :height="tableHeight">
          <el-table-column label="政策法规名称"
                           align="center"
                           min-width="200">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.docName"
                          popper-class="select-down"
                          :popper-append-to-body="false"
                          placement="top"
                          effect="light">
                <div> {{scope.row.docName|written}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="政策法规文号"
                           align="center"
                           min-width="200">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.docNum"
                          popper-class="select-down"
                          :popper-append-to-body="false"
                          placement="top"
                          effect="light">
                <div> {{scope.row.docNum|written}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="政策原文名称"
                           align="center"
                           min-width="200">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.docTittle"
                          popper-class="select-down"
                          :popper-append-to-body="false"
                          placement="top"
                          effect="light">
                <div> {{scope.row.docTittle|written}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="政策原文名称"
                           align="center"
                           min-width="200">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.docPositioning"
                          popper-class="select-down"
                          :popper-append-to-body="false"
                          placement="top"
                          effect="light">
                <div> {{scope.row.docPositioning|written}}</div>
              </el-tooltip>
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
                           min-width="200">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.issueOrgType"
                          popper-class="select-down"
                          :popper-append-to-body="false"
                          placement="top"
                          effect="light">
                <div> {{scope.row.issueOrgType|written}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="发布单位名称"
                           align="center"
                           min-width="200">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.issueOrgText"
                          popper-class="select-down"
                          :popper-append-to-body="false"
                          placement="top"
                          effect="light">
                <div> {{scope.row.issueOrgText|written}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="发文方式"
                           align="center"
                           min-width="200">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.issueType"
                          popper-class="select-down"
                          :popper-append-to-body="false"
                          placement="top"
                          effect="light">
                <div> {{scope.row.issueType|written}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="适用范围"
                           align="center"
                           min-width="200">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.docUseBroad"
                          popper-class="select-down"
                          :popper-append-to-body="false"
                          placement="top"
                          effect="light">
                <div> {{scope.row.docUseBroad|written}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="适用范围描述"
                           align="center"
                           min-width="200">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.docUseBroadText"
                          popper-class="select-down"
                          :popper-append-to-body="false"
                          placement="top"
                          effect="light">
                <div> {{scope.row.docUseBroadText|written}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="密级"
                           align="center"
                           min-width="200">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.docSecretClass"
                          popper-class="select-down"
                          :popper-append-to-body="false"
                          placement="top"
                          effect="light">
                <div> {{scope.row.docSecretClass|written}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="内容体系"
                           align="center"
                           min-width="200">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.docContentSys"
                          popper-class="select-down"
                          :popper-append-to-body="false"
                          placement="top"
                          effect="light">
                <div> {{scope.row.docContentSys|written}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="文章类型"
                           align="center"
                           min-width="200">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.docType"
                          popper-class="select-down"
                          :popper-append-to-body="false"
                          placement="top"
                          effect="light">
                <div> {{scope.row.docType|written}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="领域类型"
                           align="center"
                           min-width="200">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.docDomainType"
                          popper-class="select-down"
                          :popper-append-to-body="false"
                          placement="top"
                          effect="light">
                <div> {{scope.row.docDomainType|written}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="军民融合相关度"
                           align="center"
                           min-width="200">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.about"
                          popper-class="select-down"
                          :popper-append-to-body="false"
                          placement="top"
                          effect="light">
                <div> {{scope.row.about|written}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="可操作性"
                           align="center"
                           min-width="200">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.docOperability"
                          popper-class="select-down"
                          :popper-append-to-body="false"
                          placement="top"
                          effect="light">
                <div> {{scope.row.docOperability|written}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="评估重点"
                           align="center"
                           min-width="200">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.docFocalPoint"
                          popper-class="select-down"
                          :popper-append-to-body="false"
                          placement="top"
                          effect="light">
                <div> {{scope.row.docFocalPoint|written}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="来源网站"
                           align="center"
                           min-width="200">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.docSource"
                          popper-class="select-down"
                          :popper-append-to-body="false"
                          placement="top"
                          effect="light">
                <div> {{scope.row.docSource|written}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="链接地址"
                           align="center"
                           min-width="200">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.docUri"
                          popper-class="select-down"
                          :popper-append-to-body="false"
                          placement="top"
                          effect="light">
                <div> {{scope.row.docUri|written}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="文件路径"
                           align="center"
                           min-width="200">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.docFile"
                          popper-class="select-down"
                          :popper-append-to-body="false"
                          placement="top"
                          effect="light">
                <div> {{scope.row.docFile|written}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="关联法规名称"
                           align="center"
                           min-width="200">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.fDocTittle"
                          popper-class="select-down"
                          :popper-append-to-body="false"
                          placement="top"
                          effect="light">
                <div> {{scope.row.fDocTittle|written}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="关联法规文号"
                           align="center"
                           min-width="200">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.fDocNum"
                          popper-class="select-down"
                          :popper-append-to-body="false"
                          placement="top"
                          effect="light">
                <div> {{scope.row.fDocNum|written}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="军民融合条款摘录"
                           align="center"
                           min-width="200">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.docSummary"
                          popper-class="select-down"
                          :popper-append-to-body="false"
                          placement="top"
                          effect="light">
                <div> {{scope.row.docSummary|written}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="关键词"
                           align="center"
                           min-width="200">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.docKeyWord"
                          popper-class="select-down"
                          :popper-append-to-body="false"
                          placement="top"
                          effect="light">
                <div> {{scope.row.docKeyWord|written}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="政策体系"
                           align="center"
                           min-width="200">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.docSys"
                          popper-class="select-down"
                          :popper-append-to-body="false"
                          placement="top"
                          effect="light">
                <div> {{scope.row.docSys|written}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="军民融合领域"
                           align="center"
                           min-width="200">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.fuseField"
                          popper-class="select-down"
                          :popper-append-to-body="false"
                          placement="top"
                          effect="light">
                <div> {{scope.row.fuseField|written}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="是否属于新形式新任务"
                           align="center"
                           min-width="200">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.newSituaTask"
                          popper-class="select-down"
                          :popper-append-to-body="false"
                          placement="top"
                          effect="light">
                <div> {{scope.row.newSituaTask|written}}</div>
              </el-tooltip>
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

    <add-modification ref="modification"></add-modification>

  </div>
</template>
<script>
import { baseSearch, baseRequest, baseUpload } from '@/api/base'
import Search from './components/searchPolicy'
import addModification from './components/addModification'
// const url = '/confProtInfo/selects'
export default {
  name: 'task',
  components: {
    Search,
    addModification
  },
  data() {
    return {
      searchParam: {},
      fileList: [], // 上传文件列表

      pageNo: 1,
      total: null,
      pageSize: 15,
      taskName: '', // 列表查询参数
      // tableHeight: 0,
      searchToggle: true,
      tableToggle: true,
      data: [],
      cjVisible: false,
      dlVisible: false,
      currentProtId: null
    }
  },
  computed: {
    tableHeight: function() {
      return this.$store.state.app.containHeight - 320
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
      if (val.length > 18) {
        return val.substr(0, 18) + '...'
      } else {
        return val
      }
    }
  },
  methods: {
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
      console.log(parmas)

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
        this.data = response.data.item
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
      const patt = new RegExp('.*\.(zip|txt|doc|docx)$')
      if (!patt.test(content.file.name)) {
        this.$refs.upload.clearFiles
        this.$message({
          showClose: true,
          message: '错误的文件类型,请选择zip/txt/doc/docx文件上传',
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
      margin: 10px auto;
    }
  }
}
</style>