/*
 * @Author: lk 
 * @Date: 2020-02-26 15:34:09 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-11-20 13:56:14
 * @Description:  代理服务
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
              <el-input v-model.trim="agntName"
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
          <el-table-column prop="agntState"
                           label="状态标志"
                           align="center"
                           min-width="200">
                           <template slot-scope="scope">
                        {{ scope.row.agntState | state}}
                    </template>
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
              <el-button size="mini" v-if="scope.row.agntState !== '0'"
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
          <el-form-item prop="agntName"
                        label="代理名称">
            <el-input class="form-input"
                      style="width:200px"
                      v-model.trim="updateFormData.agntName"
                      clearable></el-input>
          </el-form-item>
          <el-form-item prop="agntIp"
                        label="代理IP">
            <el-input class="form-input"
                      style="width:200px"
                      v-model.trim="updateFormData.agntIp"
                      clearable></el-input>
          </el-form-item>
          <el-form-item prop="agntPort"
                        label="代理端口">
            <el-input class="form-input"
                      style="width:200px"
                      v-model.trim="updateFormData.agntPort"
                      clearable></el-input>
          </el-form-item>
          <el-form-item prop="agntUsername"
                        label="代理用户名">
            <el-input class="form-input"
                      style="width:200px"
                      v-model.trim="updateFormData.agntUsername"
                      clearable></el-input>
          </el-form-item>
          <el-form-item prop="agntPazzword"
                        label="代理密码">
            <el-input class="form-input"
                      style="width:200px"
                      @focus="updateFormData.agntPazzword=null"
                      v-model.trim="updateFormData.agntPazzword"
                      type="password"
                      clearable></el-input>
          </el-form-item>
          <el-form-item prop="agntState"
                        label="状态">
              <el-radio v-model="updateFormData.agntState" label="1">停用</el-radio>
              <el-radio v-model="updateFormData.agntState" label="2">启用</el-radio>
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
import { encode64 } from '@/utils/base64'
const url = '/confAgnt/selects'
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
      agntName: '', // 列表查询参数
      // tableHeight: 0,
      searchToggle: true,
      tableToggle: true,
      data: [],
      operateStatus: 1, // 1添加 2修改
      operateVisable: false,
      rules: {
        agntName: [
          { required: true, message: '请填写此项' },
          { max: 256, message: '不能超过256个字' }
        ],
        agntIp: [
          { required: true, message: '请填写此项' },
          { max: 16, message: '不能超过16个字' }
        ],
        agntPort: [
          { required: true, message: '请填写此项' },
          { max: 256, message: '不能超过256个字' },
          { validator: (rule, value, callback) => {
            if (/^[0-9]*\.?[0-9]+$/.test(value)) {
              callback()
            } else {
              callback(new Error('端口号格式不正确'))
            }
          }
          }
        ],
        agntUsername: [
          { required: true, message: '请填写此项' },
          { max: 128, message: '不能超过128个字' }
        ],
        agntPazzword: [
          { required: true, message: '请填写此项' },
          { max: 16, message: '不能超过16个字' }
        ],
        agntState: [
          { required: true, message: '请填写此项' }
        ]
      },
      updateFormData: {
        'agntIp': null,
        'agntName': null,
        'agntPazzword': null,
        'agntPort': null,
        'agntState': '1',
        'agntUsername': null
      },
      currentId: null,
      currentPassword: null
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
        this.tableHeight = document.body.offsetHeight - 360
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
      const param = { agntName: this.agntName, pageNo: this.pageNo, pageSize: this.pageSize } // this.$refs.basicTable.getData(url, this.$refs.searchForm.searchParam())
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
        baseRequest('/confAgnt/delete', { agntId: row.agntId }).then(response => {
          this.$Message.success('操作成功')
          this.searchOption()
        })
      })
    },
    addModel() {
      this.operateStatus = 1
      this.updateFormData = {
        'agntIp': null,
        'agntName': null,
        'agntPazzword': null,
        'agntPort': null,
        'agntState': '1',
        'agntUsername': null
      }
      this.operateVisable = true
    },

    // 修改表单
    updateOption(row) {
      this.updateFormData = {
        'agntIp': null,
        'agntName': null,
        'agntPazzword': null,
        'agntPort': null,
        'agntState': '1',
        'agntUsername': null
      }
      this.operateStatus = 2
      this.currentId = row.agntId
      this.currentPassword = row.agntPazzword
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
        if (key !== 'agntPazzword' || this.updateFormData.agntPazzword === this.currentPassword) {
          params[key] = this.updateFormData[key]
        } else {
          params[key] = encode64(this.updateFormData[key])
        }
      }
      if (this.operateStatus === 2) {
        params.agntId = this.currentId
        saveUpdate('/confAgnt/update', params, this.rules, this.$refs.updateFrom).then(() => {
          this.operateVisable = false
          this.$Message.success('操作成功')
          this.searchOption()
        })
      } else {
        saveUpdate('/confAgnt/add', params, this.rules, this.$refs.updateFrom).then(() => {
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