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
          <el-table-column fixed type="index" width="50" label="序号" align="center"></el-table-column>
          <el-table-column  prop="id" label="id" align="center" width="160"></el-table-column>
          <el-table-column  prop="label" label="label" align="center" width="160"></el-table-column>
          <el-table-column property="source.id" label="source" width="200"></el-table-column>
          <el-table-column property="source.name" label="sourceName" width="200"></el-table-column>
          <el-table-column property="target.id" label="target" width="200"></el-table-column>
          <el-table-column property="target.name" label="targetName" width="200"></el-table-column>
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



