/*
 * @Author: weilq 
 * @Date: 2020-4-14 14:11:00 
 * @Last Modified by: 
 * @Last Modified time:
 * @Description:  自洽性校验-搜索
 */
<template>
  <el-dialog title="选择库中公文" width="77%"
      :visible.sync="mainVisible" 
      :close-on-click-modal='false' 
      append-to-body
      v-el-drag-dialog>
    <div style="padding: 5px 50px">
      <div>
        <el-row :gutter="20" style="padding: 20px 0;">
          <el-col :span="12" style="text-align: right;">
              <span class="form-label">发文机构:</span>
              <el-select v-model="issueOrgText" placeholder="请选择"
                style="width: 300px;">
                <el-option label="全部" value="全部"></el-option>
                <el-option label="国务院" value="国务院"></el-option>
                <el-option label="工信部" value="工信部"></el-option>
                <el-option label="发改委" value="发改委"></el-option>
              </el-select>
          </el-col>
          <el-col :span="12">
              <span class="form-label">政策层次:</span>
              <el-select v-model="docSys" placeholder="请选择"
                style="width: 300px;">
                <el-option label="全部" value="全部"></el-option>
                <el-option label="基础政策" value="基础政策"></el-option>
                <el-option label="具体政策" value="具体政策"></el-option>
              </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="padding: 20px 0;">
          <el-col :span="12" style="text-align: right;">
              <span class="form-label">军民融合领域:</span>
              <el-select v-model="fuseField" placeholder="请选择"
                  style="width: 300px;">
                <el-option label="全部" value="全部"></el-option>
                <el-option label="军地人力资源开发领域" value="军地人力资源开发领域"></el-option>
                <el-option label="军队保障社会化领域" value="军队保障社会化领域"></el-option>
                <el-option label="军民科技协同创新领域" value="军民科技协同创新领域"></el-option>
              </el-select>
          </el-col>
          <el-col :span="12">
            <div style="float: left;">
              <span class="form-label">发布日期:</span>
              <el-date-picker v-model.trim="startTime"
                  style="width:140px" type="date"
                  format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="年-月-日">
              </el-date-picker>
            </div>
            <div>
              <span>&nbsp;--&nbsp;</span>
              <el-date-picker v-model.trim="endTime"
                  style="width:139px" type="date"
                  format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="年-月-日">
              </el-date-picker>
            </div>
          </el-col>
        </el-row>
        <el-row style="padding: 20px 0;">
          <el-col :span="24" style="text-align: center;">
            <el-button class="menu" size="small" @click="searchOption">搜索</el-button>
          </el-col>
        </el-row>
      </div>
      <div>
        <div v-show="tableToogle">
          <el-table :data="tableData" border
            :header-cell-style="{'color': 'gray', 'background-color': '#d8dadb'}"
            highlight-current-row 
            @current-change="handleCurrentRowChange">
            <el-table-column width="50" label="选择" align="center"> 
              <template slot-scope="scope">
                <el-radio v-model="radio" :label="scope.row.docName"><span></span></el-radio>
              </template>
            </el-table-column>
            <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
            <el-table-column  prop="docName" label="公文名称" align="center"></el-table-column>
            <el-table-column  prop="docSys" label="政策层次" align="center" width="130"></el-table-column>
            <el-table-column  prop="issueOrgText" label="发文机构" align="center" width="200"></el-table-column>
            <el-table-column  prop="fuseField" label="军民让融合领域" align="center" width="200"></el-table-column>
            <el-table-column width="130" label="发布日期" align="center"> 
              <template slot-scope="scope">
                <span>{{dateFormat('yyyy-MM-dd', new Date(scope.row.docIssueTime))}}</span>
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
    </div>  
    <div slot="footer" class="dialog-footer">
       <el-button class="menu" size="small" @click="onSubmit">确定</el-button>
      <el-button size="small" @click="mainVisible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { baseSearch } from '@/api/base'
export default {
  data() {
    return {
      mainVisible: false,
      tableToogle: false,

      issueOrgText: '全部',
      docSys: '全部',
      fuseField: '全部',
      startTime: null,
      endTime: null,

      tableData: [],
      pageNo: 1,
      total: null,
      pageSize: 15,
      radio: null,
      currentRow: null,
      searchType: null
    }
  },
  computed: {

  },
  methods: {
    openDialog(val) {
      this.searchType = val
      this.tableData = []
      this.radio = null
      this.tableToogle = false
      this.mainVisible = true
    },
    onSubmit() {
      this.$emit('selectFileName', this.searchType, this.currentRow)
      this.mainVisible = false
    },
    // getTableHeight() {
    //   this.$nextTick(function() {
    //     this.tableHeight = document.querySelector('.dialog-contant-default.file-download-log.nodelist').offsetHeight - 150
    //   })
    // },
    searchOption(page) {
      this.tableToogle = true
      if (!page) {
        this.pageNo = 1
      }
      const param = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      if (this.issueOrgText !== '全部') {
        param.issueOrgText = this.issueOrgText
      }
      if (this.docSys !== '全部') {
        param.docSys = this.docSys
      }
      if (this.fuseField !== '全部') {
        param.fuseField = this.fuseField
      }
      if (this.startTime) {
        param.startTime = this.startTime
      }
      if (this.endTime) {
        param.endTime = this.endTime
      }

      baseSearch('/wsClient/selects', param).then(response => {
        this.tableData = response.data.item
        this.total = response.data.total
        this.pageSize = response.data.pageSize
      })
    },
    handleCurrentRowChange(val) {
      this.currentRow = val
      this.radio = val.docName
    },
    handleSizeChange(val) { // 分页
      this.pageSize = val
      this.searchOption()
    },
    handleCurrentChange(val) { // 分页
      this.pageNo = val
      this.searchOption(true)
    },
    dateFormat(fmt, date) {
      let ret
      const opt = {
        'y+': date.getFullYear().toString(), // 年
        'M+': (date.getMonth() + 1).toString(), // 月
        'd+': date.getDate().toString(), // 日
        'h+': date.getHours().toString(), // 时
        'm+': date.getMinutes().toString(), // 分
        's+': date.getSeconds().toString() // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
      }
      for (const k in opt) {
        ret = new RegExp('(' + k + ')').exec(fmt)
        if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
        }
      }
      return fmt
    }
  }
}
</script>
<style scoped>
  .menu {
    background-color: #3164b7;
    color: white;
  }

  .form-label {
    padding: 0 5px;
  }
</style>