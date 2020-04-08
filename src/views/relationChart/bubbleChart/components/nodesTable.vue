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
          <el-table-column fixed type="index" width="50" label="序号" align="center" sortable></el-table-column>
          <el-table-column  prop="docName" label="政策名称" align="center" width="500" sortable></el-table-column>
          <el-table-column width="150" label="发布时间" align="center" sortable> 
            <template slot-scope="scope">
              <div>{{scope.row.year}}年{{scope.row.month}}月</div>
            </template>
          </el-table-column>
          <el-table-column prop="docSys" label="政策体系" align="center" width="150" sortable></el-table-column>
          <el-table-column prop="fuseField" label="军民融合领域" align="center" width="300" sortable></el-table-column>
          <el-table-column prop="docContentSys" label="二级领域" align="center" width="300" sortruetable></el-table-column>
          <el-table-column width="200" label="操作" align="center" fixed="right"> 
            <template slot-scope="scope">
              <!-- <el-button type="primary" plain size="mini" @click="move(scope.row)">定位</el-button> -->
              <el-button type="primary" plain size="mini" @click="openInfo(scope.row)">查看原文</el-button>
            </template>
          </el-table-column>
         </el-table>
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
      tableData: [],
      crawlConId: ''
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
      this.tableData = data
      this.setTabHeight()
    },
    setTabHeight() {
      this.$nextTick(function() {
        this.tableHeight = document.querySelector('.dialog-contant-default.file-download-log.nodelist').offsetHeight - 30
      })
    },
    // move(row) {
    //   this.$emit('moveNode', row)
    //   this.mainVisible = false
    // },
    path(row) {
      window.open(row.docUri, '_blank')
    },
    getLabel(label) {
      if (label === 'danwei') {
        return '发布单位'
      }
      if (label === 'wenshu') {
        return '政策法规'
      }
    },
    openInfo(data) {
      this.crawlConId = data.id + ''
      this.infoVisible = true
    }
  }
}
</script>
<style scoped>

</style>



