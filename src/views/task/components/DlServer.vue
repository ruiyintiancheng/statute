/*
 * @Author: lk 
 * @Date: 2020-02-26 15:34:09 
 * @Last Modified by: lk
 * @Last Modified time: 2020-03-03 16:38:39
 * @Description:  代理服务器
 */
<template>
  <div class="dl-server">
        <el-table :data="data"
                  border
                  :height="tableHeight"
                  >
          <el-table-column prop="agntName"
                           label="代理名称"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column prop="agntIp"
                           label="代理IP"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column prop="agntPort"
                           label="代理端口"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column prop="agntUsername"
                           label="代理用户名"
                           align="center"
                           min-width="200">
          </el-table-column>
          <!-- <el-table-column prop="agntPazzword"
                           label="代理密码"
                           align="center"
                           min-width="200">
          </el-table-column> -->
          <el-table-column prop="agntStateStr"
                           label="状态标志"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column prop="agntAddTime"
                           label="创建时间"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column prop="agntUpdTime"
                           label="更新时间"
                           align="center"
                           min-width="200">
          </el-table-column>
        </el-table>
        <!-- <el-pagination background
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="pageNo"
                       :total="total"
                       layout="total, sizes, prev, pager, next, jumper"
                       :page-sizes="[10,15,20]"
                       :page-size="pageSize">
        </el-pagination> -->
  </div>
</template>
<script>
import { baseSearch } from '@/api/base'
const url = '/confProtAgnt/selectConfAgntInfo'
export default {
  name: 'cjServer',
  components: {},
  props: {
    protId: [Number, String]
  },
  data() {
    return {
      pageNo: 1,
      total: null,
      pageSize: 15,
      tableHeight: 0,
      data: []
    }
  },
  computed: {

  },
  mounted() {
    this.searchOption()
    this.getTableHeight()
  },
  methods: {
    getTableHeight() {
      this.$nextTick(_ => {
        this.tableHeight = document.body.offsetHeight * 0.75 - 90
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
      // if (!page) {
      //   this.pageNo = 1
      // }
      const param = { protId: this.protId } // this.$refs.basicTable.getData(url, this.$refs.searchForm.searchParam())
      baseSearch(url, param).then(response => {
        this.data = response.data.item
        // this.total = response.data.total
        // this.pageSize = response.data.pageSize
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>