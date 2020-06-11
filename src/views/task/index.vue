/*
 * @Author: lk 
 * @Date: 2020-02-26 15:34:09 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-11 15:07:46
 * @Description:  采集任务
 */
<template>
  <div class="task list-comtainer">
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
              <span class="input-label">任务名称:</span>
              <el-input v-model.trim="taskName"
                         style="width:250px"
                         clearable
                         placeholder="">
              </el-input>
            </el-form-item>
            <el-form-item class="input-order">
                <el-button icon="el-icon-search"
                     @click="searchOption()"
                     type="primary">查询</el-button>
                <el-button icon="el-icon-plus"
                     @click="addModel">创建</el-button>
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
          <el-table-column prop="protName"
                           label="任务名称"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column prop="protWebName"
                           label="网站名称"
                           align="center"
                           min-width="200">
          </el-table-column>
          <!-- <el-table-column prop="sysCount"
                           label="采集服务器"
                           align="center"
                           min-width="200">
                <template slot-scope="scope">
                  <el-button @click="currentProtId=scope.row.protId;cjVisible=true" type="text">{{scope.row.sysCount | unitGe}}</el-button>
                </template>
          </el-table-column> -->
          <el-table-column prop="agntCount"
                           label="代理服务"
                           align="center"
                           min-width="200">
                <template slot-scope="scope">
                  <el-button @click="currentProtId=scope.row.protId;dlVisible=true" type="text">{{scope.row.agntCount | unitGe}}</el-button>
                </template>
          </el-table-column>
          <el-table-column prop="sourceName"
                           label="目标数据源"
                           align="center"
                           min-width="200">
          </el-table-column>
          <!-- <el-table-column 
                           label="线程"
                           align="center"
                           min-width="200">
                <template slot-scope="scope">
                    {{scope.row.protMinT + '-' + scope.row.protMaxT}}
                </template>
          </el-table-column> -->
          <el-table-column 
                           label="任务计划"
                           align="center"
                           min-width="200">
                <template slot-scope="scope">
                    {{portTaskOptions[scope.row.portTask]}}
                </template>
          </el-table-column>
          <el-table-column prop="protStateStr"
                           label="项目状态"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column label="操作"
                           width="260"
                           fixed="right"
                           align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row"
                         type="primary"
                         plain
                         size="mini"
                         @click="updateOption(scope.row)">修改</el-button>
              <el-button size="mini"
                         plain
                         type="danger"
                         @click="deleteForm(scope.row)">删除</el-button>
              <el-button size="mini"
                          v-if="scope.row.protState === '2' && scope.row.portStateState === '1'"
                         plain
                         type="success"
                         @click="startTask(scope.row)"
                         >立即启动</el-button>
              <el-button size="mini"
                          v-if="scope.row.portStateState === '0'"
                         plain
                         type="danger"
                         @click="stopTask(scope.row)"
                         >停止任务</el-button>
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
    <el-dialog title="采集服务器"
               :visible.sync="cjVisible"
               width="80%"
               custom-class="dialog-default no-footer">
      <div class="dialog-contant-default" v-if="cjVisible">
        <cj-server :protId="currentProtId"></cj-server>
      </div>
    </el-dialog>
    <el-dialog title="代理服务"
               :visible.sync="dlVisible"
               width="80%"
               custom-class="dialog-default no-footer">
      <div class="dialog-contant-default" v-if="dlVisible">
        <dl-server :protId="currentProtId"></dl-server>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { baseSearch, baseRequest } from '@/api/base'
import CjServer from './components/CjServer'
import DlServer from './components/DlServer'
const url = '/confProtInfo/selects'
export default {
  name: 'task',
  components: {
    CjServer,
    DlServer
  },
  data() {
    return {
      pageNo: 1,
      total: null,
      pageSize: 15,
      taskName: '', // 列表查询参数
      // tableHeight: 0,
      searchToggle: true,
      tableToggle: true,
      data: [],
      portTaskOptions: {
        '0': '当x项目结束后运行 ',
        '1': '系统启动后x分钟后运行 ',
        '3': '每分钟 ',
        '4': '每小时 ',
        '5': '每天 ',
        '6': '每周 ',
        '7': '每月 ',
        '8': '每年 ',
        '9': '运行一次 ',
        '10': '其他'
      },
      cjVisible: false,
      dlVisible: false,
      currentProtId: null
    }
  },
  computed: {
    tableHeight: function() {
      return this.$store.state.app.containHeight - 290
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
        const formDom = document.querySelector('.form-search new')
        const formHeight = formDom ? formDom.offsetHeight : 0
        this.tableHeight = document.body.offsetHeight - formHeight - 160
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
      const param = { protName: this.taskName, pageNo: this.pageNo, pageSize: this.pageSize } // this.$refs.basicTable.getData(url, this.$refs.searchForm.searchParam())
      baseSearch(url, param).then(response => {
        this.data = response.data.item
        this.total = response.data.total
        this.pageSize = response.data.pageSize
      })
    },
    // 删除
    deleteForm(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        baseRequest('/confProtInfo/delete', { protId: row.protId }).then(response => {
          this.$Message.success('操作成功')
          this.searchOption()
        })
      })
    },
    startTask(row) {
      this.$confirm('确定启动该任务吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        baseRequest('/confProtInfo/startTask', { protId: row.protId }).then(response => {
          this.$Message.success('操作成功')
          this.searchOption()
        })
      })
    },
    stopTask(row) {
      this.$confirm('确定停止该任务吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        baseRequest('/confProtInfo/stopTask', { protId: row.protId }).then(response => {
          this.$Message.success('操作成功')
          this.searchOption()
        })
      })
    },
    addModel() {
      const path = this.$route.params.path ? this.$route.params.path : this.$route.path
      this.$router.push({ name: 'taskOption', params: { path }})
    },

    // 修改表单
    updateOption(row) {
      const path = this.$route.params.path ? this.$route.params.path : this.$route.path
      this.$router.push({ name: 'taskOption', query: { protId: row.protId }, params: { path }})
    }
  }
}
</script>
<style lang="scss" scoped>
</style>