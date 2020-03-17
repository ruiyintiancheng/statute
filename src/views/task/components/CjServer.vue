/*
 * @Author: lk 
 * @Date: 2020-02-26 15:34:09 
 * @Last Modified by: lk
 * @Last Modified time: 2020-03-09 16:59:31
 * @Description:  采集服务器
 */
<template>
  <div class="cj-server">
        <el-table :data="data"
                  border
                  :height="tableHeight"
                  >
          <el-table-column prop="sysIp"
                           label="服务器IP"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column prop="sysName"
                           label="服务器名称"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column prop="sysTAllNum"
                           label="服务器总线程数"
                           align="center"
                           min-width="200">
                           <template slot-scope="scope">
                             {{scope.row.sysTAllNum | unitGe}}
                           </template>
          </el-table-column>
          <el-table-column prop="sysTRemNum"
                           label="服务器当前可用线程数"
                           align="center"
                           min-width="200">
                            <template slot-scope="scope">
                             {{scope.row.sysTRemNum | unitGe}}
                           </template>
          </el-table-column>
          <el-table-column prop="sysTUseNum"
                           label="服务器已用线程数"
                           align="center"
                           min-width="200">
                            <template slot-scope="scope">
                             {{scope.row.sysTUseNum | unitGe}}
                           </template>
          </el-table-column>
          <el-table-column prop="sysCpuNum"
                           label="服务器CPU核数"
                           align="center"
                           min-width="200">
                           <template slot-scope="scope">
                             {{scope.row.sysCpuNum | unitGe}}
                           </template>
          </el-table-column>
          <el-table-column prop="sysRamAllNum"
                           label="服务器内存"
                           align="center"
                           min-width="200">
                           <template slot-scope="scope">
                             {{scope.row.sysRamAllNum | unitKb}}
                           </template>
          </el-table-column>
          <el-table-column prop="sysRamUseNum"
                           label="服务器已用内存"
                           align="center"
                           min-width="200">
                           <template slot-scope="scope">
                             {{scope.row.sysRamAllNum | unitKb}}
                           </template>
          </el-table-column>
          <el-table-column prop="sysRamRemNum"
                           label="服务器可用内存"
                           align="center"
                           min-width="200">
                           <template slot-scope="scope">
                             {{scope.row.sysRamRemNum | unitKb}}
                           </template>
          </el-table-column>
          <el-table-column prop="sysDiskAllNum"
                           label="服务器磁盘空间"
                           align="center"
                           min-width="200">
                           <template slot-scope="scope">
                             {{scope.row.sysDiskAllNum | unitKb}}
                           </template>
          </el-table-column>
          <el-table-column prop="sysDiskUseNum"
                           label="服务器磁盘已用空间"
                           align="center"
                           min-width="200">
                           <template slot-scope="scope">
                             {{scope.row.sysDiskUseNum | unitKb}}
                           </template>
          </el-table-column>
          <el-table-column prop="sysRamAllNum"
                           label="服务器内存"
                           align="center"
                           min-width="200">
                           <template slot-scope="scope">
                             {{scope.row.sysRamAllNum | unitKb}}
                           </template>
          </el-table-column>
          <el-table-column prop="sysDiskRemNum"
                           label="服务器磁盘可用空间"
                           align="center"
                           min-width="200">
                           <template slot-scope="scope">
                             {{scope.row.sysDiskRemNum | unitKb}}
                           </template>
          </el-table-column>
          <el-table-column prop="sysStateStr"
                           label="状态标志"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column prop="sysAddTime"
                           label="创建时间"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column prop="sysUpdTime"
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
const url = '/confProtSys/selectConfSysInfo'
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
        // console.log(response.data)
        // this.pageSize = response.data.pageSize
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>