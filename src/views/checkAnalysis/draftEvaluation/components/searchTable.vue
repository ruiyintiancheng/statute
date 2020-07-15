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
      append-to-body>
    <div style="padding: 5px 50px">
        <div v-show="tableToogle">
          <el-table :data="tableData" border
            :header-cell-style="{'color': 'gray', 'background-color': '#d8dadb'}"
            highlight-current-row 
            @current-change="handleCurrentRowChange">
            <el-table-column width="50" label="选择" align="center"> 
              <template slot-scope="scope">
                <el-radio v-model="radio" :label="scope.row.id"><span></span></el-radio>
              </template>
            </el-table-column>
            <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
            <el-table-column  prop="docName" label="公文名称" align="center"></el-table-column>
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
      tableToogle: true,

      tableData: [],
      pageNo: 1,
      total: null,
      pageSize: 10,
      radio: null,
      currentRow: null,
      ids: []
    }
  },
  computed: {},
  mounted() {

  },
  methods: {
    openDialog(val) {
      this.tableData = []
      this.radio = null
      this.tableToogle = false
      this.mainVisible = true
      this.ids = val
      this.searchOption()
    },
    openInfo(data) {
      this.crawlConId = data.id + ''
      this.infoVisible = true
    },
    onSubmit() {
      this.$emit('selectFileName', this.currentRow)
      this.mainVisible = false
    },
    searchOption(page) {
      this.tableToogle = true
      if (!page) {
        this.pageNo = 1
      }
      const param = {
        ids: this.ids,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      // const url = 'http://39.96.94.120:38080/app/mock/36/wsClient/getThemesList'
      const url = '/wsClient/getThemesList'
      baseSearch(url, param)
        .then(response => {
          this.tableData = response.data.item
          this.total = response.data.total
          this.pageSize = response.data.pageSize
        })
    },
    // 行点击id
    handleCurrentRowChange(val) {
      this.currentRow = val
      this.radio = val.id
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