/*
 * 顶点列表
 */
<template>
  <el-dialog title="政策列表" width="77%" custom-class="dialog-default"
      :visible.sync="mainVisible" 
      :close-on-click-modal='false' 
      append-to-body
      v-el-drag-dialog>
    <div class="dialog-contant-default file-download-log nodelist">
        <el-table :data="tableData" style="width: 100%;" :height="tableHeight"
          :border="true" :fit="true">
          <!-- <el-table-column  type="index" :index="indexMethod" width="50" label="#" align="center" sortable></el-table-column> -->
          <!-- <el-table-column  prop="docName" label="政策名称" align="center" width="500" sortable></el-table-column>
          <el-table-column width="150" label="发布时间" align="center" sortable> 
            <template slot-scope="scope">
              <div>{{scope.row.year}}年{{scope.row.month}}月</div>
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="docSys" label="政策层级" align="center" width="150" sortable></el-table-column>
          <el-table-column prop="fuseField" label="军民融合领域" align="center" width="400" sortable></el-table-column>
          <el-table-column prop="docContentSys" label="二级领域" align="center" width="250" sortruetable></el-table-column> -->
          <el-table-column  type="index" :index="indexMethod" width="50" label="#" align="center"></el-table-column>
          <el-table-column prop="docName" label="政策法规名称" align="center" sortable>
            <template slot-scope="scope">
              <el-link :underline="false" @click="openInfo(scope.row)" type="primary">{{scope.row.docName}}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="docNum" label="政策法规文号" align="center" width="200" sortable></el-table-column>
          <el-table-column prop="docIssueOrgText" label="发布单位名称" align="center" width="200" sortable></el-table-column>
          <el-table-column prop="docIssueTime" label="发布时间" align="center" width="140" sortable></el-table-column>
          <el-table-column prop="docAnnulTime" label="废止时间" align="center" width="140" sortable></el-table-column>
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
    <div slot="footer" class="dialog-footer">
      <el-button @click="mainVisible = false">关闭</el-button>
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
export default {
  data() {
    return {
      mainVisible: false,
      infoVisible: false,
      tableHeight: 100,

      countData: null,
      tableData: null,
      crawlConId: '',
      total: null,
      pageNo: 1,
      pageSize: 15
    }
  },
  components: {
    policy
  },
  computed: {

  },
  methods: {
    openDialog(data) {
      this.mainVisible = true
      this.countData = data
      this.total = data.length
      this.getData()
      this.setTabHeight()
    },
    setTabHeight() {
      this.$nextTick(function() {
        this.tableHeight = document.querySelector('.dialog-contant-default.file-download-log.nodelist').offsetHeight - 53
      })
    },
    getData() {
      const array = []
      let i = (this.pageNo - 1) * this.pageSize
      for (; i < this.total && i < this.pageNo * this.pageSize; i++) {
        array.push(this.countData[i])
      }
      this.tableData = array
    },
    openInfo(data) {
      this.crawlConId = data.id + ''
      this.infoVisible = true
    },
    indexMethod(index) {
      return (this.pageNo - 1) * this.pageSize + index + 1
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val
      this.getData()
    },
    // 分页
    handleCurrentChange(val) {
      this.pageNo = val
      this.getData()
    }
  }
}
</script>
<style scoped>

</style>



