/*
 * @Author: wk 
 * @Date: 2019-10-17 19:59:27 
 * @Last Modified by: lk
 * @Last Modified time: 2020-04-13 14:33:29
 * @Description:  用户管理
 */
<template>
  <div class="sys-config list-comtainer">
    <div class="">
      <div class="row-botton new clearfix">
        <div class="row-title">
          <svg-icon icon-class="search" />
          <span>筛选查询</span>
        </div>
        <div class="row-option">
          <!-- <a href="javascript:void(0)" class="button" @click="searchOption">查询</a> -->

          <a @click="searchToggle=false"
             v-if="searchToggle">
            <svg-icon icon-class="up" />&nbsp;收起</a>
          <a @click="searchToggle=true"
             v-else>
            <svg-icon icon-class="down" />&nbsp;展开</a>
        </div>
      </div>
      <div v-show="searchToggle"
           class="form-search new">
        <el-form :inline="true"
                 class="demo-table-expand">
            <el-form-item class="input-order">
              <span class="input-label">用户名:</span>
              <el-input v-model.trim="userName"
                         style="width:150px"
                         clearable
                         placeholder="">
              </el-input>
            </el-form-item>
            <el-form-item class="input-order">
              <span class="input-label">登录名:</span>
              <el-input v-model.trim="loginName"
                         style="width:150px"
                         clearable
                         placeholder="">
              </el-input>
            </el-form-item>
            <el-form-item class="input-order">
              <span class="input-label">添加时间:</span>
              <el-date-picker v-model.trim="startDate"
                         style="width:150px"
                         type="date"
                         format="yyyy-MM-dd"
                         value-format="yyyy-MM-dd"
                         placeholder="开始日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item class="input-order">
              <span class="input-label">-&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <el-date-picker v-model.trim="endDate"
                         style="width:150px"
                         type="date"
                         format="yyyy-MM-dd"
                         value-format="yyyy-MM-dd"
                         placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
             <el-form-item class="input-order">
              <span class="input-label">是否有效:</span>
              <el-select v-model="statusParameter"
                         style="width:90px"
                         clearable
                         placeholder="">
                <el-option label="无效"
                           value="0">
                </el-option>
                <el-option label="有效"
                           value="1">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="input-order">
                          <el-button icon="el-icon-search"
                     @click="searchOption()"
                     type="primary">查询</el-button>
                       <el-button icon="el-icon-refresh"
                     @click="reset">重置</el-button>
                        <el-button icon="el-icon-plus"
                     @click="addParent">添加</el-button>
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
        <div class="row-option">
          <a @click="tableToggle=false"
             v-if="tableToggle">
            <svg-icon icon-class="up" />&nbsp;收起</a>
          <a @click="tableToggle=true"
             v-else>
            <svg-icon icon-class="down" />&nbsp;展开</a>
        </div>
      </div>
      <div>
        <el-table :data="data"
                  v-show="tableToggle"
                  border
                  :height="tableHeight">
          <el-table-column prop="userName"
                           label="用户名"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column prop="loginName"
                           label="登录名"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column prop="addTime"
                           label="添加时间"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column prop="field_convert_map.status"
                           label="是否有效"
                           align="center"
                           min-width="200">
          </el-table-column>

          <!-- <el-table-column label="参数描述"
                           align="center">
            <template slot-scope="scope">
              <el-tooltip :disabled="textJug(scope.row.config_des)"
                          :content="scope.row.config_des"
                          placement="top"
                          visible-arrow
                          effect="light">
                <div class="basic-table-column">
                  {{ scope.row.config_des}}
                </div>
              </el-tooltip>
            </template>
          </el-table-column> -->
          <el-table-column label="操作"
                           width="350"
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
                        v-if="$store.state.user.userId === scope.row.userId"
                         plain
                         type="warning"
                         @click="updatePw(scope.row)">修改密码</el-button>
              <el-button size="mini"
                        v-else-if="$store.state.user.userId === 1"
                         plain
                         type="warning"
                         @click="resetPw(scope.row)">重置密码</el-button>
              <el-button size="mini"
                         plain
                         @click="roleSetting(scope.row)"
                         >角色配置</el-button>
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
    <el-dialog :title="dialogTitle[operateStatus]"
               :visible.sync="parentFormVisible"
               width="550px"
               custom-class="dialog-default autoHeight">
      <div class="dialog-contant-default">
        <el-form :rules="outsideRules"
                 class="baseUpdate-form"
                 ref="formOutside"
                 style="    margin-left: calc(50% - 185px)"
                 :model="updateFormData"
                 label-width="120px">
          <el-form-item prop="userName"
                        label="用户名">
            <el-input class="form-input"
                      style="width:200px"
                      v-model="updateFormData.userName"
                      clearable></el-input>
          </el-form-item>
          <el-form-item prop="loginName"
                        label="登录名">
            <el-input class="form-input"
                      style="width:200px"
                      :disabled="operateStatus === 2"
                      v-model="updateFormData.loginName"
                      clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="parentFormVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="saveOperate()">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改密码"
               :visible.sync="updatePwVisable"
               width="550px"
               custom-class="dialog-default autoHeight">
      <div class="dialog-contant-default" v-if="updatePwVisable">
        <el-form :rules="pwRules"
                 class="baseUpdate-form"
                 ref="pwForm"
                 style="    margin-left: calc(50% - 185px)"
                 :model="pwFormData"
                 label-width="120px">
          <el-form-item prop="loginPasswd"
                        label="登录密码">
            <el-input class="form-input"
                      style="width:200px"
                      v-model="pwFormData.loginPasswd"
                      clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="updatePwVisable = false">取消</el-button>
        <el-button type="primary"
                   @click="savePwOperate()">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="角色配置"
               :visible.sync="roleVisable"
               width="500px"
               custom-class="dialog-default">
      <div class="dialog-contant-default" v-if="roleVisable">
        <el-table :data="roleData"
                  border
                  ref="roleDialogTable"
                  @selection-change="handleSelectionChange"
                  >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column prop="roleName"
                           label="角色名称"
                           align="center"
                           min-width="200">
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="roleVisable = false">取消</el-button>
        <el-button type="primary"
                   @click="saveRoles()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import SearchForm from 'search-form-ry'
// import BasicTable from 'basic-table-ry'
// import UpdateForm from 'update-form-ry'
// import { getSearchParam } from '@/utils/index'
import { baseRequest } from '@/api/base'
import { saveUpdate } from '@/utils/validate'
const url = '/manager/selects'
export default {
  name: 'sysConfigIndex',
  components: {},
  data() {
    return {
      // 修改密码
      updatePwVisable: false,
      pageNo: 1,
      total: null,
      pageSize: 15,
      userName: '',
      loginName: '',
      startDate: null,
      endDate: null,
      statusParameter: '', // 列表查询参数
      tableHeight: 0,
      outsideRules: {
        loginName: [
          { required: true, message: '该项为必填项' }
        ],
        userName: [
          { required: true, message: '该项为必填项' }
        ]
      },
      pwRules: {
        loginPasswd: [
          { required: true, message: '请输入密码' },
          { min: 6, message: '密码不能少于6位' }
        ]
      },
      insideRules: {
        configValue: [
          { required: true, message: '该项为必填项' }
        ],
        serverId: [
          { required: true, message: '该项为必填项' }
        ]
      },
      list: [], // 请求原始数据
      treeDataSource: [], // 组合成树表格接收的数据
      roleData: [],
      item: {
        configCode: '',
        configValue: '',
        configDes: '',
        serverDesc: '',
        dynamicFlag: ''
      },
      ConfigValue: [],
      configData: {}, // 模板数据
      configId: null, // 修改保存，删除参数id
      configDes: null,
      configCode: null,
      serverConfigId: null, // 删除子表参数识别
      searchToggle: true,
      tableToggle: true,
      updateFormData: {
        loginName: '',
        userName: ''
      },
      pwFormData: {
        loginPasswd: ''
      },
      roleVisable: false,
      currentId: null,
      multipleSelection: [],
      parentFormVisible: false, // 父类数据弹框开关
      childrenFormVisible: false, // 子类数据弹框开关
      operateStatus: null, // 操作选项
      dataType: null, // 识别父类数据，子类数据,1为父类，2为子类
      dialogTitle: { // 弹框标题
        1: '添加',
        2: '修改'
      },
      option: {
        'dynamicFlag': {
          '1': '支持动态更新',
          '2': '不支持动态更新'
        }
      },
      data: []
    }
  },
  computed: {

  },
  mounted() {
    this.searchOption()
    this.getTableHeight()
  },
  watch: {
    searchToggle() {
      this.getTableHeight()
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    roleSetting(row) {
      this.currentId = row.userId
      this.multipleSelection = []
      baseRequest('/cmprsRoles/selects', {}).then(response => {
        this.roleData = response.data.item
        this.roleVisable = true
        baseRequest('/manager/getRoleByUser', { userId: this.currentId }).then(response => {
          const selectRoles = response.data.item
          this.$nextTick(_ => {
            for (const iterator of this.roleData) {
              if (selectRoles.some(item => item === iterator.roleId)) {
                this.$refs.roleDialogTable.toggleRowSelection(iterator, true)
              }
            }
          })
        })
      })
    },
    saveRoles() {
      const roleIds = []
      for (const iterator of this.multipleSelection) {
        roleIds.push(iterator.roleId)
      }
      baseRequest('/manager/addRole', { userId: this.currentId, roleIds: roleIds }).then(response => {
        this.$message.success('操作成功')
        this.roleVisable = false
      })
    },
    // 判断字数提示
    textJug(text) {
      if (text) {
        if (text.length > 20) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    getTableHeight() {
      this.$nextTick(_ => {
        const formDom = document.querySelector('.form-search')
        const formHeight = formDom ? formDom.offsetHeight : 0
        this.tableHeight = document.body.offsetHeight - formHeight - 288
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
      if (this.startDate && this.endDate && this.startDate + '' > this.endDate + '') {
        this.$message.warning('开始时间不能大于结束时间')
        return
      }
      if (!page) {
        this.pageNo = 1
      }
      const param = {
        status: this.statusParameter,
        userName: this.userName,
        loginName: this.loginName,
        startDate: this.startDate,
        endDate: this.endDate,
        pageNo: this.pageNo, pageSize: this.pageSize } // this.$refs.basicTable.getData(url, this.$refs.searchForm.searchParam())
      baseRequest(url, param).then(response => {
        this.data = response.data.item
        this.total = response.data.total
        this.pageSize = response.data.pageSize
      })
    },
    // 删除
    deleteForm(row) {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        baseRequest('/manager/delete', { userId: row.userId }).then(response => {
          this.$Message.success('操作成功')
          this.searchOption()
        })
      })
    },
    addParent() {
      this.dataType = 1
      this.operateStatus = 1
      for (var i in this.updateFormData) {
        this.updateFormData[i] = ''
      }
      this.parentFormVisible = true
      this.$nextTick(_ => {
        this.$refs.formOutside.clearValidate()
      })
    },
    // 修改密码
    updatePw(row) {
      this.pwFormData.userId = row.userId
      this.pwFormData.loginName = row.loginName
      this.pwFormData.loginPasswd = ''
      this.updatePwVisable = true
    },
    // 修改表单
    updateOption(row) {
      this.operateStatus = 2
      this.getUpdateForm(row)
    },
    // 获取修改表单
    getUpdateForm(row) {
      this.dataType = 2
      this.updateFormData.userId = row.userId
      if (row.userId) {
        const param = {
          userId: row.userId
        }
        baseRequest('/manager/select', param).then(response => {
          for (const key in response.data.item) {
            if (this.updateFormData.hasOwnProperty(key)) {
              this.updateFormData[key] = response.data.item[key]
            }
          }
          this.parentFormVisible = true
          this.$nextTick(_ => {
            this.$refs.formOutside.clearValidate()
          })
        })
      } else {
        const param = {
          userId: row.userId
        }
        baseRequest('/manager/select', param).then(response => {
          this.updateFormData = response.data.item
          this.parentFormVisible = true
          this.$nextTick(_ => {
            this.$refs.formOutside.clearValidate()
          })
        })
      }
    },
    // 保存操作
    saveOperate() {
      if (this.dataType === 2) {
        saveUpdate('/manager/update', this.updateFormData, this.outsideRules, this.$refs.formOutside).then(() => {
          this.parentFormVisible = false
          this.$Message.success('操作成功')
          this.searchOption()
        })
      } else {
        const params = {}
        for (const key in this.updateFormData) {
          params[key] = this.updateFormData[key]
        }
        params.loginPasswd = '000000'
        saveUpdate('/manager/add', params, this.outsideRules, this.$refs.formOutside).then(() => {
          this.parentFormVisible = false
          this.$Message.success('操作成功')
          this.searchOption()
        })
      }
    },
    // 修改密码保存
    savePwOperate() {
      saveUpdate('/manager/update', this.pwFormData, this.pwRules, this.$refs.pwForm).then(() => {
        this.updatePwVisable = false
        this.$Message.success('操作成功')
        this.searchOption()
      })
    },
    reset() {
      this.statusParameter = null
      this.userName = ''
      this.loginName = ''
      this.startDate = null
      this.endDate = null
      this.searchOption()
    },
    // 重置密码
    resetPw(row) {
      this.$confirm('确定重置密码吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          userId: row.userId,
          loginName: row.loginName
          // userName: row.userName
          // loginPasswd: '000000'
        }
        baseRequest('/manager/resetPassword', params).then(() => {
          this.updatePwVisable = false
          this.$Message.success('操作成功')
          this.searchOption()
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.sys-config {
  overflow: hidden;
}
</style>