/*
 * @Author: lk 
 * @Date: 2020-02-26 15:34:09 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-11-20 13:59:12
 * @Description:  待执行
 */
<template>
  <div class="list-comtainer">
    <div class="">
      <div class="row-botton new clearfix">
        <div class="row-title">
          <svg-icon icon-class="search" />
          <span>筛选查询</span>
        </div>
        <!-- <div class="row-option">
          <a @click="searchToggle=false"
             v-if="searchToggle">
            <svg-icon icon-class="up" />&nbsp;收起</a>
          <a @click="searchToggle=true"
             v-else>
            <svg-icon icon-class="down" />&nbsp;展开</a>
        </div> -->
      </div>
      <div v-show="searchToggle"
           class="form-search new">
        <el-form :inline="true"
                 class="demo-table-expand">
            <el-form-item class="input-order">
              <span class="input-label">项目名称:</span>
              <el-input v-model.trim="protName"
                         style="width:250px"
                         clearable
                         placeholder="">
              </el-input>
            </el-form-item>
            <el-form-item class="input-order">
                <el-button icon="el-icon-search"
                     @click="searchOption()"
                     type="primary">查询</el-button>
            </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="">
      <div class="row-botton new clearfix">
        <div class="row-title">
          <svg-icon icon-class="ul" />
          <span>数据列表</span>
        </div>
        <!-- <div class="row-option">
          <a @click="tableToggle=false"
             v-if="tableToggle">
            <svg-icon icon-class="up" />&nbsp;收起</a>
          <a @click="tableToggle=true"
             v-else>
            <svg-icon icon-class="down" />&nbsp;展开</a>
        </div> -->
      </div>
      <div>
        <el-table :data="data"
                  v-show="tableToggle"
                  border
                  :height="tableHeight">
                            <el-table-column 
                           label="编号"
                           align="center"
                           type="index"
                           width="50">
          </el-table-column>
          <el-table-column prop="protName"
                           label="项目名称"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column prop="stateRunUri"
                           label="待执行地址"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column prop="stateRunFilePath"
                           label="文件地址"
                           align="center"
                           min-width="200">
                           <template slot-scope="scope">
                               {{scope.rowstateRunFilePath || '-'}}
                           </template>
          </el-table-column>
          <el-table-column prop="stateRunAddTime"
                           label="创建时间"
                           align="center"
                           min-width="200">
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
</template>
<script>
import { baseSearch } from '@/api/base'
const url = '/taskStateRun/selects'
export default {
  data() {
    return {
      pageNo: 1,
      total: null,
      pageSize: 15,
      protName: '', // 列表查询参数
      // tableHeight: 0,
      searchToggle: true,
      tableToggle: true,
      data: []
    }
  },
  computed: {
    tableHeight: function() {
      return this.$store.state.app.containHeight - 400
    }
  },
  mounted() {
    this.searchOption()
    // this.getTableHeight()
  },
  watch: {
    searchToggle() {
      // this.getTableHeight()
    }
  },
  methods: {
    getTableHeight() {
      this.$nextTick(_ => {
        this.tableHeight = document.body.offsetHeight - 305
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
      if (!page) {
        this.pageNo = 1
      }
      const param = { protName: this.protName, pageNo: this.pageNo, pageSize: this.pageSize } // this.$refs.basicTable.getData(url, this.$refs.searchForm.searchParam())
      baseSearch(url, param).then(response => {
        this.data = response.data.item
        this.total = response.data.total
        this.pageSize = response.data.pageSize
      })
    }

  }
}
</script>
<style lang="scss" scoped>
</style>