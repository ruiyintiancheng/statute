/*
 * @Author: lk 
 * @Date: 2020-02-26 15:34:09 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-11-18 13:54:45
 * @Description:  角色管理
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
              <span class="input-label">角色名称:</span>
              <el-input v-model.trim="roleName"
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
              <span class="input-label">有效期:</span>
              <el-date-picker v-model.trim="validTime"
                         style="width:150px"
                         type="date"
                         format="yyyy-MM-dd"
                         value-format="yyyy-MM-dd"
                         placeholder="生效时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item class="input-order">
              <span class="input-label">-&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <el-date-picker v-model.trim="invalidTime"
                         style="width:150px"
                         type="date"
                         format="yyyy-MM-dd"
                         value-format="yyyy-MM-dd"
                         placeholder="失效时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item class="input-order">
                <el-button icon="el-icon-search"
                     @click="searchOption()"
                     type="primary">查询</el-button>
                <el-button icon="el-icon-refresh"
                     @click="reset"
                     >重置</el-button>
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
          <el-table-column prop="roleName"
                           label="角色名称"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column prop="addTime"
                           label="添加时间"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column prop="validTime"
                           label="生效时间"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column prop="invalidTime"
                           label="失效时间"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column label="操作"
                           width="260"
                           fixed="right"
                           align="center">
            <template slot-scope="scope" >
                <el-button
                          type="primary"
                          plain
                          size="mini"
                          @click="updateOption(scope.row)">修改</el-button>
                <el-button
                          type="primary"
                          plain
                          size="mini"
                          @click="menuSetting(scope.row)">菜单权限</el-button>
                <el-button size="mini"
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
               width="500px"
               custom-class="dialog-default autoHeight">
      <div class="dialog-contant-default" v-if="operateVisable">
          <el-form :rules="rules"
                 class="baseUpdate-form"
                 ref="updateFrom"
                 style="margin-left: calc(50% - 185px)"
                 :model="updateFormData"
                 label-width="120px">
        <el-form-item prop="roleName"
                              label="角色名称:">
                    <el-input class="form-input"
                              style="width:200px"
                              v-model.trim="updateFormData.roleName"
                              clearable></el-input>
                  </el-form-item>
        <el-form-item prop="validTime"
                              label="生效时间:">
                        <el-date-picker
                        class="form-input"
                              style="width:200px"
                        v-model="updateFormData.validTime"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        >
                       </el-date-picker>
                </el-form-item>
        <el-form-item prop="invalidTime"
                              label="失效时间:">
                        <el-date-picker
                        class="form-input"
                              style="width:200px"
                        v-model="updateFormData.invalidTime"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        >
                       </el-date-picker>
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
    <el-dialog title="菜单权限"
               :visible.sync="menuDialogVisable"
               width="420px"
               custom-class="dialog-default">
      <div class="dialog-contant-default" v-if="menuDialogVisable">
        <el-tree  ref="tree" :data="treeData" node-key="id" :props="defaultProps" default-expand-all :expand-on-click-node='false' show-checkbox ></el-tree>
      </div>
            <div slot="footer"
           class="dialog-footer">
        <el-button @click="menuDialogVisable = false">取消</el-button>
        <el-button type="primary"
                  @click="saveRoleTree">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { baseSearch, baseRequest } from '@/api/base'
import { saveUpdate } from '@/utils/validate'
const url = '/cmprsRoles/selects'
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
      menuDialogVisable: false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      pageNo: 1,
      total: null,
      pageSize: 15,
      roleName: '', // 列表查询参数
      startDate: null,
      endDate: null,
      validTime: null,
      invalidTime: null,
      // tableHeight: 0,
      searchToggle: true,
      tableToggle: true,
      data: [],
      operateStatus: 1, // 1添加 2修改
      operateVisable: false,
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空' }
        ],
        validTime: [
          {
            validator: (rule, val, callback) => {
              if (this.updateFormData.validTime && this.updateFormData.invalidTime && this.updateFormData.validTime + '' > this.updateFormData.invalidTime + '') {
                callback('生效时间不能大于失效时间')
              } else {
                callback()
              }
            }
          }
        ]
      },
      updateFormData: {
        roleName: null,
        validTime: null,
        invalidTime: null
      },
      currentId: null
    }
  },
  computed: {
    tableHeight: function() {
      return this.$store.state.app.containHeight - 390
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
    reset() {
      this.roleName = ''
      this.startDate = null
      this.endDate = null
      this.validTime = null
      this.invalidTime = null
      this.searchOption()
    },
    menuSetting(row) {
      this.currentId = row.roleId
      baseRequest('/cmprsFunction/getTree').then(response => {
        const root = response.data.item
        this.treeData = root
        this.menuDialogVisable = true
        baseRequest('/cmprsRoles/getActionByRole', { roleId: row.roleId }).then(response => {
          if (response.data.item && response.data.item.length > 0) {
            const keyList = []
            for (const iterator of response.data.item) {
              const node = this.getCurrentNode(this.treeData, iterator)
              if (node && (!node.children || node.children.length === 0)) {
                keyList.push(iterator)
              }
            }
            this.$nextTick(function() {
              this.$refs.tree.setCheckedKeys(keyList)
            })
          }
        })
      })

      // const root = [{ 'name': '我的工作台', 'msgId': 1881, 'id': 71, 'type': '1', 'children': [{ 'name': '我的收藏', 'msgId': 1882, 'id': 72, 'type': '2' }] }, { 'children': [{ 'children': [{ 'name': 'sqoop导入配置', 'msgId': 3063, 'id': 143, 'type': '2' }, { 'name': 'excel模板配置', 'msgId': 3021, 'id': 138, 'type': '2' }, { 'name': '校验补录配置', 'msgId': 3328, 'id': 173, 'type': '2' }], 'name': '采集配置', 'msgId': 3298, 'id': 166, 'type': '2' }, { 'children': [{ 'name': 'Excel上传', 'msgId': 3051, 'id': 142, 'type': '2' }], 'name': '数据采集', 'msgId': 3299, 'id': 167, 'type': '2' }, { 'children': [{ 'name': '校验查询', 'msgId': 3330, 'id': 175, 'type': '2' }, { 'name': '数据补录', 'msgId': 3329, 'id': 174, 'type': '2' }], 'name': '数据补录', 'msgId': 3327, 'id': 172, 'type': '2' }], 'name': '数据采集', 'msgId': 3014, 'id': 133, 'type': '1' }, { 'children': [{ 'name': '查询配置', 'msgId': 3300, 'id': 168, 'type': '2', 'children': [{ 'name': '模型定义', 'msgId': 3012, 'id': 131, 'type': '2' }, { 'name': 'SQL查询', 'msgId': 2943, 'id': 130, 'type': '2' }] }, { 'name': '数据查询', 'msgId': 3307, 'id': 170, 'type': '2', 'children': [{ 'name': '我的查询', 'msgId': 3017, 'id': 134, 'type': '2' }, { 'name': '模型计算', 'msgId': 3308, 'id': 171, 'type': '2' }] }], 'name': '数据筛查', 'msgId': 2940, 'id': 127, 'type': '1' }, { 'children': [{ 'children': [{ 'name': '任务类', 'msgId': 2732, 'id': 105, 'type': '2' }, { 'name': '系统参数', 'msgId': 2834, 'id': 109, 'type': '2' }, { 'name': '流程配置', 'msgId': 2856, 'id': 114, 'type': '2' }, { 'name': '通知管理', 'msgId': 2855, 'id': 113, 'type': '2' }], 'name': '任务配置', 'msgId': 2759, 'id': 106, 'type': '2' }, { 'children': [{ 'name': '已部署流程', 'msgId': 2911, 'id': 125, 'type': '2' }, { 'name': '计算流程', 'msgId': 2912, 'id': 126, 'type': '2' }, { 'name': '计算日志', 'msgId': 2837, 'id': 112, 'type': '2' }], 'name': '任务监控', 'msgId': 2908, 'id': 124, 'type': '2' }], 'name': '任务管理', 'msgId': 2731, 'id': 104, 'type': '1' }, { 'children': [{ 'name': '元数据管理', 'msgId': 121, 'id': 34, 'type': '2' }, { 'children': [{ 'name': '用户管理', 'msgId': 119, 'id': 32, 'type': '2' }, { 'name': '角色管理', 'msgId': 120, 'id': 33, 'type': '2' }, { 'name': '数据权限配置', 'msgId': 2551, 'id': 100, 'type': '2' }, { 'name': '权限审批', 'msgId': 3232, 'id': 155, 'type': '2' }], 'name': '权限管理', 'msgId': 118, 'id': 31, 'type': '2' }, { 'children': [{ 'name': '文件下载', 'msgId': 128, 'id': 41, 'type': '2' }, { 'name': '资源访问', 'msgId': 127, 'id': 40, 'type': '2' }, { 'name': '登录日志', 'msgId': 126, 'id': 39, 'type': '2' }], 'name': '日志管理', 'msgId': 125, 'id': 38, 'type': '2' }, { 'children': [{ 'name': '通知公告', 'msgId': 131, 'id': 44, 'type': '2' }, { 'name': '国际化管理', 'msgId': 132, 'id': 45, 'type': '2' }, { 'name': '文件生成', 'msgId': 130, 'id': 43, 'type': '2' }], 'name': '其他', 'msgId': 129, 'id': 42, 'type': '2' }], 'name': '系统管理', 'msgId': 117, 'id': 30, 'type': '1' }, { 'children': [{ 'name': '开发配置', 'msgId': 100, 'id': 1, 'type': '1', 'children': [{ 'name': '系统配置', 'msgId': 101, 'id': 2, 'type': '2', 'children': [{ 'name': '代码管理', 'msgId': 104, 'id': 5, 'type': '2' }, { 'name': '权限管理', 'msgId': 105, 'id': 6, 'type': '2' }, { 'name': '缓存管理', 'msgId': 107, 'id': 8, 'type': '2' }, { 'name': '定时任务', 'msgId': 110, 'id': 11, 'type': '2' }, { 'name': '客户端缓存', 'msgId': 3234, 'id': 157, 'type': '2' }, { 'name': '资源管理', 'msgId': 102, 'id': 3, 'type': '2' }, { 'name': '查询组件', 'msgId': 109, 'id': 10, 'type': '2' }, { 'name': '功能管理', 'msgId': 103, 'id': 4, 'type': '2' }] }, { 'children': [{ 'name': '关键字维护', 'msgId': 3219, 'id': 152, 'type': '2' }, { 'name': '函数配置', 'msgId': 3013, 'id': 132, 'type': '2' }, { 'name': '验证器', 'msgId': 108, 'id': 9, 'type': '2' }, { 'name': '数据类型', 'msgId': 3227, 'id': 154, 'type': '2' }, { 'name': '事件管理', 'msgId': 111, 'id': 12, 'type': '2' }, { 'name': 'VUE参数', 'msgId': 1917, 'id': 88, 'type': '2' }, { 'name': '系统参数', 'msgId': 1918, 'id': 89, 'type': '2' }, { 'name': '资源参数', 'msgId': 1916, 'id': 87, 'type': '2' }, { 'name': '自定义参数', 'msgId': 2492, 'id': 99, 'type': '2' }], 'name': '参数配置', 'msgId': 3301, 'id': 169, 'type': '2' }, { 'children': [{ 'name': '系统日志', 'msgId': 113, 'id': 14, 'type': '2' }, { 'name': '资源监控', 'msgId': 115, 'id': 16, 'type': '2' }, { 'name': 'SQL查询', 'msgId': 2877, 'id': 118, 'type': '2' }, { 'name': 'SQL监控', 'msgId': 114, 'id': 15, 'type': '2' }, { 'name': '服务器信息', 'msgId': 116, 'id': 17, 'type': '2' }, { 'name': '客户端缓存', 'msgId': 3233, 'id': 156, 'type': '2' }], 'name': '系统监控', 'msgId': 112, 'id': 13, 'type': '2' }] }, { 'children': [{ 'name': '流程管理', 'msgId': 3085, 'id': 147, 'type': '2', 'children': [{ 'name': '部署管理', 'msgId': 3087, 'id': 149, 'type': '2' }] }, { 'name': '模型管理', 'msgId': 3084, 'id': 146, 'type': '2' }], 'name': '工作流', 'msgId': 3080, 'id': 145, 'type': '1' }, { 'children': [{ 'name': '归档配置', 'msgId': 3267, 'id': 159, 'type': '2', 'children': [{ 'name': '数据导入', 'msgId': 3269, 'id': 161, 'type': '2' }, { 'name': '数据导出', 'msgId': 3270, 'id': 162, 'type': '2' }] }, { 'name': '数据查询', 'msgId': 3268, 'id': 160, 'type': '2', 'children': [{ 'name': '全量数据', 'msgId': 3273, 'id': 165, 'type': '2' }, { 'name': '版本数据', 'msgId': 3272, 'id': 164, 'type': '2' }] }], 'name': '数据归档', 'msgId': 3266, 'id': 158, 'type': '1' }], 'name': '其他模块', 'msgId': 3079, 'id': 144, 'type': '1' }, { 'children': [{ 'children': [{ 'name': '一、公共信息', 'msgId': 3366, 'id': 184, 'type': '2', 'children': [{ 'name': '1.机构信息表', 'msgId': 3367, 'id': 185, 'type': '2' }] }], 'name': '数据查询', 'msgId': 3365, 'id': 183, 'type': '1' }, { 'name': '报送管理', 'msgId': 3368, 'id': 186, 'type': '1' }, { 'name': '数据校验', 'msgId': 3369, 'id': 187, 'type': '1' }, { 'name': '统计分析', 'msgId': 3370, 'id': 188, 'type': '1' }], 'name': 'east2020', 'msgId': 3364, 'id': 182, 'type': '1' }]
      // this.treeData = root
      // this.menuDialogVisable = true
      // this.$nextTick(function() {
      //   this.$refs.tree.setCheckedKeys([72])
      // })
    },
    getCurrentNode(arr, id) {
      for (const iterator of arr) {
        if (iterator.id === id) {
          return iterator
        } else {
          if (iterator.children && iterator.children.length > 0) {
            const item = this.getCurrentNode(iterator.children, id)
            if (item) {
              return item
            }
          }
        }
      }
    },
    saveRoleTree() {
      const checkedNodes = this.$refs.tree.getCheckedNodes(false, true)
      const list = []
      for (const it of checkedNodes) {
        if (!it.children || it.children.length === 0) {
          list.push(it.id + '')
        }
      }
      baseRequest('/cmprsRoles/addAction', { roleId: this.currentId, actionIds: list }).then(response => {
        this.$Message.success('操作成功')
        this.menuDialogVisable = false
      })
    },
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
      if (this.startDate && this.endDate && this.startDate + '' > this.endDate + '') {
        this.$message.warning('开始时间不能大于结束时间')
        return
      }
      if (this.validTime && this.invalidTime && this.validTime + '' > this.invalidTime + '') {
        this.$message.warning('生效日期不能大于失效日期')
        return
      }
      if (!page) {
        this.pageNo = 1
      }
      const param = {
        roleName: this.roleName,
        startDate: this.startDate,
        endDate: this.endDate,
        validTime: this.validTime,
        invalidTime: this.invalidTime,
        pageNo: this.pageNo, pageSize: this.pageSize } // this.$refs.basicTable.getData(url, this.$refs.searchForm.searchParam())
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
        baseRequest('/cmprsRoles/delete', { roleId: row.roleId }).then(response => {
          this.$Message.success('操作成功')
          this.searchOption()
        })
      })
    },
    addModel() {
      this.operateStatus = 1
      this.updateFormData = {
        roleName: null,
        validTime: null,
        invalidTime: null
      }
      this.operateVisable = true
    },

    // 修改表单
    updateOption(row) {
      this.updateFormData = {
        roleName: null,
        validTime: null,
        invalidTime: null
      }
      this.operateStatus = 2
      this.currentId = row.roleId
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
        params.roleId = this.currentId
      }
      saveUpdate('/cmprsRoles/add', params, this.rules, this.$refs.updateFrom).then(() => {
        this.operateVisable = false
        this.$Message.success('操作成功')
        this.searchOption()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>