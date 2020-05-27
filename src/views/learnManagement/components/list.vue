<template>
    <div class="learn-list">
        <el-table :data="tableData"
                  border
                  :height="tableHeight"
                  >
                <el-table-column prop="agntName"
                                label="ID"
                                align="center"
                                min-width="200">
                </el-table-column>
                <el-table-column prop="agntName"
                                label="文件名称"
                                align="center"
                                min-width="200">
                </el-table-column>
                <el-table-column prop="agntName"
                                label="来源"
                                align="center"
                                min-width="200">
                </el-table-column>
                <el-table-column prop="agntName"
                                label="时间"
                                align="center"
                                min-width="200">
                </el-table-column>
                <el-table-column
                                label="操作"
                                align="center"
                                min-width="200">
                        <template slot-scope="scope">
                            <el-button type="danger" size="mini" plain @click="deleteData(scope.row)"></el-button>
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
</template>
<script>
import { baseSearch } from '@/api/base'
export default {
  props: {
    labelId: Number
  },
  data() {
    return {
      tableData: [],
      pageNo: 1,
      total: null,
      pageSize: 15
    }
  },
  computed: {
    tableHeight() {
      return this.$store.state.app.containHeight - 180
    }
  },
  methods: {
    searchOption(page) {
      if (!page) {
        this.pageNo = 1
      }
      const param = { pageNo: this.pageNo, pageSize: this.pageSize } // this.$refs.basicTable.getData(url, this.$refs.searchForm.searchParam())
      baseSearch('', param).then(response => {
        this.tableData = response.data.item
        this.total = response.data.total
        this.pageSize = response.data.pageSize
      })
    },
    deleteData(row) {

    },
    handleSizeChange(val) { // 分页
      this.pageSize = val
      this.searchOption()
    },
    handleCurrentChange(val) { // 分页
      this.pageNo = val
      this.searchOption(true)
    }
  }
}
</script>