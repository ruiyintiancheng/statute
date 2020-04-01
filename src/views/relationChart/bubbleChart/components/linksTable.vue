/*
 * 边列表
 */
<template>
  <el-dialog title="边列表" :visible.sync="mainVisible" :close-on-click-modal='false' 
      append-to-body
      v-el-drag-dialog width="77%" custom-class="dialog-default">
    <div class="dialog-contant-default file-download-log linklist">
        <el-table :data="tableData" style="width: 100%;" :height="tableHeight"
          :border="true" :fit="true">
          <el-table-column fixed type="index" width="50" label="序号" align="center" sortable></el-table-column>
          <el-table-column property="source.docName" label="法规名称" align="center" sortable></el-table-column>
          <el-table-column property="source.docIssueTime" label="发布时间" width="200" align="center" sortable></el-table-column>
          <el-table-column property="target.docName" label="引用法规名称" align="center" sortable></el-table-column>
          <el-table-column property="target.docIssueTime" label="引用法规发布时间" width="200" align="center" sortable></el-table-column>
          <!-- <el-table-column label="properties">
            <template slot-scope="scope">
              <div>{{ scope.row }}</div>
            </template>
          </el-table-column>   -->
        </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="mainVisible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      mainVisible: false,
      tableHeight: 100,
      tableData: []
    }
  },
  created() {
  },
  methods: {
    openDialog(data) {
      this.mainVisible = true
      this.setTabHeight()
      this.tableData = data
    },
    setTabHeight() {
      this.$nextTick(function() {
        this.tableHeight = document.querySelector('.dialog-contant-default.file-download-log.linklist').offsetHeight - 30
      })
    }
  }
}
</script>
<style scoped>

</style>



