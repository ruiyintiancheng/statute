/*
 * @Author: weilq 
 * @Date: 2020-4-14 14:11:00 
 * @Last Modified by: 
 * @Last Modified time:
 * @Description:  自洽性校验-搜索
 */
<template>
  <el-dialog title="选择库中公文" width="75%"
      :visible.sync="mainVisible" 
      :close-on-click-modal='false' 
      append-to-body
      v-el-drag-dialog>
    <div style="padding: 5px 50px">
      <div>
        <el-row :gutter="20" style="padding: 10px 0;">
          <el-col :span="24" style="margin-left: calc(50% - 400px);">
            <div>
              <span style="float: left; line-height: 36px; padding: 0 10px;">公文名称:</span>
              <div style="width: 695px; height: 36px; float: left;">
                <el-input v-model="option.docName" placeholder="请输入公文名称"></el-input>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="padding: 10px 0;">
          <el-col :span="12" style="text-align: right;">
              <span class="form-label">发文机构:</span>
              <el-cascader v-model="option.issueOrgText"
                :show-all-levels="false"
                :clearable="true"
                :options="option.orgOption"
                :props="{ expandTrigger: 'hover' }"
                style="width: 300px;">
              </el-cascader>
          </el-col>
          <el-col :span="12">
              <span class="form-label">政策层次:</span>
              <el-select v-model="option.docSys" placeholder="请选择"
                style="width: 300px;">
                <el-option label="全部" value="全部"></el-option>
                <el-option label="基础政策" value="基础政策"></el-option>
                <el-option label="具体政策" value="具体政策"></el-option>
              </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="padding: 10px 0;">
          <el-col :span="12" style="text-align: right;">
              <span class="form-label">军民融合领域:</span>
              <el-select v-model="option.fuseField" placeholder="请选择"
                  style="width: 300px;">
                <el-option label="全部" value="全部"></el-option>
                <el-option v-for="(value, key, index) in option.fuseFieldOption"
                           :key="index"
                           :label="value"
                           :value="key">
                </el-option>
              </el-select>
          </el-col>
          <el-col :span="12">
            <div style="float: left;">
              <span class="form-label">发布日期:</span>
              <el-date-picker v-model.trim="option.startTime"
                  style="width:140px" type="date"
                  format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="年-月-日">
              </el-date-picker>
            </div>
            <div>
              <span>&nbsp;--&nbsp;</span>
              <el-date-picker v-model.trim="option.endTime"
                  style="width:139px" type="date"
                  format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="年-月-日">
              </el-date-picker>
            </div>
          </el-col>
        </el-row>
        <el-row style="padding: 10px 0;">
          <el-col :span="24" style="text-align: center;">
            <el-button class="menu" size="small" @click="searchOption()">搜索</el-button>
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
            <!-- <el-table-column  prop="docSys" label="政策层次" align="center" width="130"></el-table-column> -->
            <!-- <el-table-column  prop="issueOrgText" label="发文机构" align="center" width="200"></el-table-column> -->
            <!-- <el-table-column  prop="fuseField" label="军民让融合领域" align="center" width="200"></el-table-column> -->
            <el-table-column width="130" label="发布日期" align="center"> 
              <template slot-scope="scope">
                <span>{{dateFormat('yyyy-MM-dd', new Date(scope.row.docIssueTime))}}</span>
              </template>
            </el-table-column>
            <el-table-column width="200" label="操作" align="center" fixed="right"> 
              <template slot-scope="scope">
                <el-button class="menu" size="mini" @click="openInfo(scope.row)">查看原文</el-button>
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
    <el-dialog title="政策文章" width="90%" custom-class="dialog-default"
        :visible.sync="infoVisible" 
        :close-on-click-modal='false'
        append-to-body
        v-el-drag-dialog>
      <div class="dialog-contant-default file-download-log nodelist2">
           <policy :crawlConId=crawlConId></policy>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="infoVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>
<script>
import policy from './policy'
import { baseSearch } from '@/api/base'
export default {
  components: {
    policy
  },
  data() {
    return {
      mainVisible: false,
      infoVisible: false,
      crawlConId: '',
      tableToogle: false,

      option: {
        docName: null,
        issueOrgText: null,
        orgOption: null,
        docSys: '全部',
        fuseField: '全部',
        fuseFieldOption: null,
        startTime: null,
        endTime: null
      },

      tableData: [],
      pageNo: 1,
      total: null,
      pageSize: 10,
      radio: null,
      currentRow: null,
      searchType: null
    }
  },
  computed: {},
  mounted() {
    this.loadOption()
  },
  methods: {
    openDialog(val) {
      this.searchType = val
      this.tableData = []
      this.radio = null
      this.tableToogle = false
      this.mainVisible = true
    },
    openInfo(data) {
      this.crawlConId = data.id + ''
      this.infoVisible = true
    },
    onSubmit() {
      this.$emit('selectFileName', this.searchType, this.currentRow)
      this.mainVisible = false
    },
    loadOption() {
      baseSearch('http://47.93.121.177:8080/app/mock/36//bCode/getOrgOption', {}).then(response => {
        this.option.orgOption = response.data.item
      })

      baseSearch('http://47.93.121.177:8080/app/mock/36//bCode/getOptionByFCodeId', { fCodeId: 'AA-011000000000000000-0001' }).then(response => {
        this.option.fuseFieldOption = response.data.item
      })
    },
    getOrgOption() {

    },
    searchOption(page) {
      this.tableToogle = true
      if (!page) {
        this.pageNo = 1
      }
      const param = {
        docName: this.option.docName,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      if (this.option.issueOrgText && this.option.issueOrgText.length > 0) {
        param.issueOrgText = this.option.issueOrgText[this.option.issueOrgText.length - 1]
      }
      if (this.option.docSys !== '全部') {
        param.docSys = this.option.docSys
      }
      if (this.option.fuseField !== '全部') {
        param.fuseField = this.option.fuseField
      }
      if (this.option.startTime) {
        param.startTime = this.option.startTime
      }
      if (this.option.endTime) {
        param.endTime = this.option.endTime
      }

      baseSearch('/wsClient/selects', param).then(response => {
        this.tableData = response.data.item
        this.total = response.data.total
        this.pageSize = response.data.pageSize
      })
    },
    // 行点击
    handleCurrentRowChange(val) {
      this.currentRow = val
      this.radio = val.docName
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val
      this.searchOption()
    },
    // 分页
    handleCurrentChange(val) {
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