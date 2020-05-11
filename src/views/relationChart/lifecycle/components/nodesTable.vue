/*
 * 政策列表
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
          <el-table-column type="index" width="50" label="#" align="center" sortable></el-table-column>
          <el-table-column prop="docName" label="政策法规名称" align="center" sortable>
            <template slot-scope="scope">
              <el-link :underline="false" @click="path(scope.row)" type="primary">{{scope.row.docName}}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="docNum" label="政策法规文号" align="center" width="200" sortable></el-table-column>
          <el-table-column prop="docIssueOrgText" label="发布单位名称" align="center" width="200" sortable></el-table-column>
          <el-table-column prop="docIssueTime" label="发布时间" align="center" width="140" sortable></el-table-column>
          <el-table-column prop="docAnnulTime" label="废止时间" align="center" width="140" sortable></el-table-column>
          <el-table-column width="100" label="操作" align="center" fixed="right"> 
            <template slot-scope="scope">
              <el-button type="primary" plain size="mini" @click="move(scope.row)">定位</el-button>
            </template>
          </el-table-column>
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
  computed: {

  },
  methods: {
    openDialog(data) {
      this.mainVisible = true
      this.tableData = data
      this.setTabHeight()
    },
    setTabHeight() {
      this.$nextTick(function() {
        this.tableHeight = document.querySelector('.dialog-contant-default.file-download-log.nodelist').offsetHeight - 30
      })
    },
    move(row) {
      this.$emit('moveNode', row)
      this.mainVisible = false
    },
    path(row) {
      if (row.docUri) {
        window.open(row.docUri, '_blank')
      } else {
        this.$message.warning('此公文暂未收录')
      }
    }
  }
}
</script>
<style scoped>

</style>



