/*
 * @Author: lk 
 * @Date: 2020-02-26 15:34:09 
 * @Last Modified by: lk
 * @Last Modified time: 2020-06-03 18:16:58
 * @Description:  采集任务
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
              <span class="input-label">名称:</span>
              <el-input v-model.trim="sysName"
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
                            <el-table-column 
                           label="编号"
                           align="center"
                           type="index"
                           width="50">
          </el-table-column>
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
                             {{scope.row.sysCpuNum | unitKb}}
                           </template>
          </el-table-column>
          <el-table-column prop="sysRamUseNum"
                           label="服务器已用内存"
                           align="center"
                           min-width="200">
                           <template slot-scope="scope">
                             {{scope.row.sysRamUseNum | unitKb}}
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
          <el-table-column prop="sysState"
                           label="状态标志"
                           align="center"
                           min-width="200">
                            <template slot-scope="scope">
                        {{ scope.row.sysState | state}}
                    </template>
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
          <el-table-column label="操作"
                           width="260"
                           fixed="right"
                           align="center">
            <template slot-scope="scope">
              <el-button
                         type="primary"
                         plain
                         size="mini"
                         @click="updateOption(scope.row)">修改</el-button>
              <el-button size="mini" v-if="scope.row.sysState !== '0'"
                         plain
                         type="danger"
                         @click="deleteForm(scope.row)">删除</el-button>
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
    <el-dialog :title="operateStatus===1?'创建':'修改'"
               :visible.sync="operateVisable"
               width="40%"
               custom-class="dialog-default">
      <div class="dialog-contant-default" v-if="operateVisable">
          <el-form :rules="rules"
                 class="baseUpdate-form"
                 ref="updateFrom"
                 style="margin-left: calc(50% - 185px)"
                 :model="updateFormData"
                 label-width="120px">
        <el-form-item prop="sysName"
                              label="环境名称:">
                    <el-input class="form-input"
                              style="width:200px"
                              v-model.trim="updateFormData.sysName"
                              clearable></el-input>
                  </el-form-item>
                  <el-form-item prop="sysIp"
                                label="环境地址:">
                    <el-input class="form-input"
                              style="width:200px"
                              v-model.trim="updateFormData.sysIp"
                              clearable></el-input>
                  </el-form-item>
                  <el-form-item prop="sysTAllNum"
                                label="总线程数:">
                    <el-input-number style="width:200px;" v-model="updateFormData.sysTAllNum"  :min="1"  ></el-input-number>
                  </el-form-item>
                  <el-form-item prop="sysCpuNum"
                                label="处理器核:">
                    <el-input-number style="width:200px;" v-model="updateFormData.sysCpuNum"  :min="1"  ></el-input-number>&nbsp;&nbsp;颗
                  </el-form-item>
                  <el-form-item prop="sysRamAllNum"
                                label="总内存数:">
                    <el-input-number style="width:200px;" v-model="updateFormData.sysRamAllNum"  :min="1"  ></el-input-number>&nbsp;&nbsp;KB
                  </el-form-item>
                  <el-form-item prop="sysDiskAllNum"
                                label="磁盘空间:">
                    <el-input-number style="width:200px;" v-model="updateFormData.sysDiskAllNum"  :min="1"  ></el-input-number>&nbsp;&nbsp;KB
                  </el-form-item>
                  <el-form-item prop="sysState"
                                label="状态">
                      <el-radio v-model="updateFormData.sysState" label="1">停用</el-radio>
                      <el-radio v-model="updateFormData.sysState" label="2">启用</el-radio>
                  </el-form-item>
        </el-form>
      </div>
            <div slot="footer"
           class="dialog-footer">
        <el-button @click="operateVisable = false">取消</el-button>
        <el-button type="primary"
                   @click="saveOperate()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { baseSearch, baseRequest } from '@/api/base'
import { saveUpdate } from '@/utils/validate'
const url = '/confSystem/selects'
export default {
  filters: {
    state(val) {
      const item = {
        '0': '删除',
        '1': '停用',
        '2': '生效' }
      return item[val]
    }
  },
  data() {
    return {
      pageNo: 1,
      total: null,
      pageSize: 15,
      sysName: '', // 列表查询参数
      // tableHeight: 0,
      searchToggle: true,
      tableToggle: true,
      data: [],
      operateStatus: 1, // 1添加 2修改
      operateVisable: false,
      rules: {
        sysName: [
          { required: true, message: '请填写此项' },
          { max: 256, message: '不能超过256个字' }
        ],
        sysIp: [
          { required: true, message: '请填写此项' },
          { max: 16, message: '不能超过16个字' }
        ],
        sysTAllNum: [
          { required: true, message: '请填写此项' }
        ],
        sysCpuNum: [
          { required: true, message: '请填写此项' }
        ],
        sysRamAllNum: [
          { required: true, message: '请填写此项' }
        ],
        sysDiskAllNum: [
          { required: true, message: '请填写此项' }
        ],
        sysState: [
          { required: true, message: '请填写此项' }
        ]
      },
      updateFormData: {
        sysIp: null,
        sysName: null,
        sysTAllNum: null,
        sysCpuNum: null,
        sysRamAllNum: null,
        sysDiskAllNum: null,
        sysState: '1'
      },
      currentId: null
    }
  },
  computed: {
    tableHeight: function() {
      return this.$store.state.app.containHeight - 360
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
        this.tableHeight = document.body.offsetHeight - 300
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
      const param = { sysName: this.sysName, pageNo: this.pageNo, pageSize: this.pageSize } // this.$refs.basicTable.getData(url, this.$refs.searchForm.searchParam())
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
        baseRequest('/confSystem/delete', { sysId: row.sysId }).then(response => {
          this.$Message.success('操作成功')
          this.searchOption()
        })
      })
    },
    addModel() {
      this.operateStatus = 1
      this.updateFormData = {
        sysIp: null,
        sysName: null,
        sysTAllNum: 40,
        sysCpuNum: 8,
        sysRamAllNum: 20480000,
        sysDiskAllNum: 20480000000,
        sysState: '1'
      }
      this.operateVisable = true
    },

    // 修改表单
    updateOption(row) {
      this.updateFormData = {
        sysIp: null,
        sysName: null,
        sysTAllNum: null,
        sysCpuNum: null,
        sysRamAllNum: null,
        sysDiskAllNum: null,
        sysState: '1'
      }
      this.operateStatus = 2
      this.currentId = row.sysId
      for (const key in row) {
        if (this.updateFormData.hasOwnProperty(key)) {
          this.updateFormData[key] = row[key]
          if (this.updateFormData[key]) {
            this.updateFormData[key] = this.updateFormData[key] + ''
          }
        }
      }
      this.operateVisable = true
    },
    saveOperate() {
      const params = {}
      for (const key in this.updateFormData) {
        params[key] = this.updateFormData[key]
      }
      if (this.operateStatus === 2) {
        params.sysId = this.currentId
        saveUpdate('/confSystem/update', params, this.rules, this.$refs.updateFrom).then(() => {
          this.operateVisable = false
          this.$Message.success('操作成功')
          this.searchOption()
        })
      } else {
        saveUpdate('/confSystem/add', params, this.rules, this.$refs.updateFrom).then(() => {
          this.operateVisable = false
          this.$Message.success('操作成功')
          this.searchOption()
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>