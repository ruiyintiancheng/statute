/*
 * @Author: lk 
 * @Date: 2020-02-26 15:34:09 
 * @Last Modified by: lk
 * @Last Modified time: 2020-06-03 18:16:14
 * @Description:  接口信息
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
              <el-input v-model.trim="ifsName"
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
          <el-table-column prop="ifsName"
                           label="接口名称"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column prop="ifsType"
                           label="接口类型"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column prop="ifsUrl"
                           label="接口地址"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column prop="ifsReq"
                           label="请求参数"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column prop="ifsResp"
                           label="响应参数"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column prop="ifsState"
                           label="状态标识"
                           align="center"
                           min-width="200">
                    <template slot-scope="scope">
                        {{ scope.row.ifsState | state}}
                    </template>
          </el-table-column>
          <el-table-column prop="ifsAddTime"
                           label="创建时间"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column prop="ifsUpdTime"
                           label="修改时间"
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
              <el-button size="mini"
                         plain
                         type="danger"
                         @click="deleteForm(scope.row)" v-if="scope.row.ifsState !== '0'">删除</el-button>
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
          <el-form-item prop="ifsName"
                              label="接口名称:">
                    <el-input class="form-input"
                              style="width:200px"
                              v-model.trim="updateFormData.ifsName"
                              clearable></el-input>
                  </el-form-item>
                  <el-form-item prop="ifsType"
                        label="接口类型:">
                      <el-select class="form-input" style="width:200px;"
                      v-model="updateFormData.ifsType"
                      clearable>
                          <el-option value="webService" label="webService"></el-option>        
                          <el-option value="HTML" label="HTML"></el-option>        
                      </el-select>
                  </el-form-item>
                  <el-form-item prop="ifsUrl"
                                label="接口地址:">
                    <el-input class="form-input"
                              style="width:200px"
                              v-model.trim="updateFormData.ifsUrl"
                              clearable></el-input>
                  </el-form-item>
                  <el-form-item prop="ifsPort"
                                label="接口端口:">
                    <el-input class="form-input"
                              style="width:200px"
                              v-model.trim="updateFormData.ifsPort"
                              clearable></el-input>
                  </el-form-item>
                  <el-form-item prop="ifsReq"
                                label="请求参数:">
                    <el-input class="form-input"
                              style="width:200px"
                              v-model.trim="updateFormData.ifsReq"
                              clearable></el-input>
                  </el-form-item>
                  <el-form-item prop="ifsResp"
                                label="响应结果:">
                    <el-input class="form-input"
                              style="width:200px"
                              v-model.trim="updateFormData.ifsResp"
                              clearable></el-input>
                  </el-form-item>
                  <el-form-item prop="ifsState"
                                label="状态">
                      <el-radio v-model="updateFormData.ifsState" label="1">停用</el-radio>
                      <el-radio v-model="updateFormData.ifsState" label="2">启用</el-radio>
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
const url = '/confIfs/selects'
export default {
  name: 'dlServerList',
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
      ifsName: '', // 列表查询参数
      // tableHeight: 0,
      searchToggle: true,
      tableToggle: true,
      data: [],
      operateStatus: 1, // 1添加 2修改
      operateVisable: false,
      rules: {
        ifsName: [
          { required: true, message: '请填写此项' },
          { max: 256, message: '不能超过256个字' }
        ],
        ifsType: [
          { required: true, message: '请填写此项' }
        ],
        ifsUrl: [
          { required: true, message: '请填写此项' },
          { validator: (rule, value, callback) => {
            if (/(http|https|ftp):\/\/([\w.]+\/?)\S*/.test(value)) {
              callback()
            } else {
              callback(new Error('格式不正确'))
            }
          } }
        ],
        ifsPort: [
          { required: true, message: '请填写此项' },
          { validator: (rule, value, callback) => {
            if (/^[0-9]*\.?[0-9]+$/.test(value)) {
              callback()
            } else {
              callback(new Error('端口号格式不正确'))
            }
          }
          }
        ],
        ifsReq: [
          { required: true, message: '请填写此项' },
          { max: 2000, message: '不能超过2000个字' }
        ],
        ifsResp: [
          { required: true, message: '请填写此项' },
          { max: 2000, message: '不能超过2000个字' }
        ],
        ifsState: [
          { required: true, message: '请填写此项' }
        ]
      },
      updateFormData: {
        'ifsName': null,
        'ifsType': null,
        'ifsUrl': null,
        'ifsPort': null,
        'ifsReq': null,
        'ifsResp': null,
        'ifsState': '1'
      },
      currentId: null
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
  computed: {
    tableHeight: function() {
      return this.$store.state.app.containHeight - 360
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
      const param = { ifsName: this.ifsName, pageNo: this.pageNo, pageSize: this.pageSize } // this.$refs.basicTable.getData(url, this.$refs.searchForm.searchParam())
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
        baseRequest('/confIfs/delete', { ifsId: row.ifsId }).then(response => {
          this.$Message.success('操作成功')
          this.searchOption()
        })
      })
    },
    addModel() {
      this.operateStatus = 1
      this.updateFormData = {
        'ifsName': null,
        'ifsType': null,
        'ifsUrl': null,
        'ifsPort': null,
        'ifsReq': null,
        'ifsResp': null,
        'ifsState': '1'
      }
      this.operateVisable = true
    },

    // 修改表单
    updateOption(row) {
      this.updateFormData = {
        'ifsName': null,
        'ifsType': null,
        'ifsUrl': null,
        'ifsPort': null,
        'ifsReq': null,
        'ifsResp': null,
        'ifsState': '1'
      }
      this.operateStatus = 2
      this.currentId = row.ifsId
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
        params.ifsId = this.currentId
        saveUpdate('/confIfs/update', params, this.rules, this.$refs.updateFrom).then(() => {
          this.operateVisable = false
          this.$Message.success('操作成功')
          this.searchOption()
        })
      } else {
        saveUpdate('/confIfs/add', params, this.rules, this.$refs.updateFrom).then(() => {
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