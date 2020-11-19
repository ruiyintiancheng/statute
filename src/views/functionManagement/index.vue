/*
 * @Author: lk 
 * @Date: 2019-02-12 15:42:54 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-11-18 13:58:23
 * @Description:  菜单管理
 */
<template>
    <div class="app-container menu-management" style="margin-left:10px;padding: 5px 0;">
        <el-row>
            <!-- 树开始 -->
            <el-col :span="5" class="code-tree" :style="{height:containHeight + 'px'}" v-loading="treeLoading">
              <div class="row-botton clearfix">
                  <div class="row-title">
                  <svg-icon icon-class="tree" />
                  <span>菜单管理</span>
                  </div>
              </div>
              <div class="code-tree-contain">
                <el-input placeholder="筛选" v-model="filterText" style="margin-left:5px;width:85%;margin-top:10px;" :clearable="clearable"></el-input> 
                <el-tree 
                  class="filter-tree" 
                  :filter-node-method="filterNode" 
                  :data="treeData"
                  node-key="id" 
                  :props="defaultProps" 
                  :default-expand-all = 'true'
                  @node-click="handleNodeClick"
                  :expand-on-click-node="false"
                  @node-drag-start="handleDragStart"
                  @node-drop="handleDrop"
                  draggable
                  :allow-drop="allowDrop"
                  :allow-drag="allowDrag"
                  ref="tree2">
                </el-tree>
              </div>
            </el-col>
            <!-- 树结束 -->
            <!-- 表格开始 -->
            <el-col :span="19">
                <!-- 查询区域开始 -->
                <div class="base-row">
                    <div class="row-botton clearfix">
                        <div class="row-title">
                        <svg-icon icon-class="search" />
                        <span>筛选查询</span>
                        </div>
                        <div class="row-option">
                        <!-- <el-button icon="el-icon-search" @click="searchOption" type="primary">查询</el-button>
                        <el-button icon="el-icon-refresh" @click="reset" >重置</el-button> -->
                        <!-- <a @click="searchToggle=false" v-if="searchToggle"><svg-icon icon-class="up" />&nbsp;收起</a>
                        <a  @click="searchToggle=true" v-else><svg-icon icon-class="down"/>&nbsp;展开</a> -->
                        </div>
                    </div>
                    <!-- <search-form v-show="searchToggle" ref="searchForm" :inputCount="3" :searchFormData="configData" >
                      <span class="input-label">是否有效:</span>
                        <el-select v-model="status"
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
                    </search-form> -->
                      <div v-show="searchToggle"
                                class="form-search new">
                              <el-form :inline="true"
                                      class="demo-table-expand">
                                  <el-form-item class="input-order">
                                    <span class="input-label">菜单名称:</span>
                                    <el-input v-model.trim="actionName"
                                              style="width:150px"
                                              clearable
                                              placeholder="">
                                    </el-input>
                                  </el-form-item>
                                  <el-form-item class="input-order">
                                    <span class="input-label">是否有效:</span>
                                    <el-select v-model="status"
                                              style="width:150px"
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
                                          <el-button icon="el-icon-refresh" @click="reset" >重置</el-button>
                                          <el-button icon="el-icon-plus"
                                           @click="addOption">添加</el-button>
                                  </el-form-item>
                              </el-form>
                            </div>
                </div>
                <!-- 查询区域结束 -->
                <!-- 表格数据开始 -->
                <div class="base-row">
                    <div class="row-botton clearfix">
                        <div class="row-title">
                            <svg-icon icon-class="ul" />
                            <span>数据列表</span>
                        </div>
                        <div class="row-option">
                            <!-- <el-button icon="el-icon-plus" @click="addOption" >添加</el-button> -->
                            <!-- <a @click="tableToggle=false" v-if="tableToggle"><svg-icon icon-class="up" />&nbsp;收起</a>
                            <a  @click="tableToggle=true" v-else><svg-icon icon-class="down"/>&nbsp;展开</a> -->
                        </div>
                    </div>
                    <!-- <basic-table v-show="tableToggle" ref="basicTable" :tableOption="configData" :height="containHeight - 220" :pagenation="true" :rowNum="true"> -->
                      <!-- <el-table-column slot="optionColumn" label="图标" align="center" width="180"> 
                            <template slot-scope="scope">
                                <svg-icon v-if="scope.row.actionIcon" :iconClass='scope.row.actionIcon' style="width:96px; height: 20px;"/>
                            </template>
                        </el-table-column>
                        <el-table-column slot="optionColumn" label="操作" align="center" width="280" fixed="right"> 
                            <template slot-scope="scope">
                                <el-button type="primary" plain size="mini" @click="updateOption(scope.row)">修改</el-button>         
                                <el-button type="danger" plain size="mini" @click="deleteOption(scope.row)">删除</el-button>         
                            </template>
                        </el-table-column> -->
                    <!-- </basic-table> -->
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
                                <el-table-column 
                                                label="菜单名称"
                                                align="center"
                                                min-width="200">
                                                <template slot-scope="scope">
                                                  {{scope.row.field_convert_map.msgId}}
                                                </template>
                                </el-table-column>
                                <el-table-column prop="actionDesc"
                                                label="菜单描述"
                                                align="center"
                                                min-width="200">
                                </el-table-column>
                                <el-table-column 
                                                label="类型"
                                                align="center"
                                                min-width="200">
                                                 <template slot-scope="scope">
                                                  {{scope.row.field_convert_map.actionType}}
                                                </template>
                                </el-table-column>
                                <el-table-column 
                                                label="URL"
                                                align="center"
                                                min-width="200">
                                                 <template slot-scope="scope">
                                                  {{scope.row.actionUrl}}
                                                </template>
                                </el-table-column>
                                <el-table-column 
                                                label="状态"
                                                align="center"
                                                min-width="200">
                                                 <template slot-scope="scope">
                                                  {{scope.row.field_convert_map.status}}
                                                </template>
                                </el-table-column>
                                <el-table-column label="图标" align="center" width="180"> 
                            <template slot-scope="scope">
                                <svg-icon v-if="scope.row.actionIcon" :iconClass='scope.row.actionIcon' style="width:96px; height: 20px;"/>
                            </template>
                        </el-table-column>
                        <el-table-column  label="操作" align="center" width="150" fixed="right"> 
                            <template slot-scope="scope">
                                <el-button type="primary" plain size="mini" @click="updateOption(scope.row)">修改</el-button>         
                                <el-button type="danger" plain size="mini" @click="deleteOption(scope.row)">删除</el-button>         
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
                <!-- 表格数据结束 -->
            </el-col>
            <!-- 表格结束 -->
        </el-row>
        <el-dialog :title="dialogTitle[operateStatus]" v-el-drag-dialog :visible.sync="formVisible" width="40%" :close-on-click-modal="false" custom-class="dialog-default">
            <el-form ref="form" label-suffix="" :rules="rules" label-width="100px" :model="treeform" label-position="left" style="margin-left:calc(50% - 125px);margin-top:10px">
              <el-form-item prop="actionId" v-show="false">
                <el-input v-model="treeform.actionId" :clearable="clearable" style="width:155px"></el-input>
              </el-form-item>
              <el-form-item label="名称" prop="msgId">
                <el-input v-model="treeform.msgId" :clearable="clearable" style="width:155px"></el-input>
              </el-form-item>
              <el-form-item label="描述" prop="actionDesc">
                <el-input v-model="treeform.actionDesc" :clearable="clearable" style="width:155px"></el-input>
              </el-form-item>
              <el-form-item label="类型" prop="actionType">
                <el-select  placeholder="" style="width:155px" v-model="treeform.actionType" :clearable="clearable" @change="selectValueChange">
                  <el-option :disabled="item.disabled" v-for="item in optionsType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="URL" prop="actionUrl">
                <el-input v-model="treeform.actionUrl" :clearable="clearable" style="width:155px"></el-input>
              </el-form-item>
              <el-form-item label="状态" prop="status">
                  <el-select  placeholder="" style="width:155px" v-model="treeform.status" :clearable="clearable" filterable>
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                  <el-form-item v-if="isMenu" label="图标">
                    <div>
                      <div v-if="treeform.actionIcon">
                          <svg-icon :iconClass='treeform.actionIcon' style="width:84px; height: 20px;"/>
                          <span style="color: #666;cursor:pointer;" @click="treeform.actionIcon = ''">x</span>
                           <el-button slot="append" icon="el-icon-search" @click="selectIconVisible = true"></el-button>
                      </div>
                      <div v-else>
                        <el-button slot="append" icon="el-icon-search" @click="selectIconVisible = true" style="margin-left:100px"></el-button>
                      </div>
                    </div>
                  </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="formVisible = false">取消</el-button>
                <el-button type="primary" @click="saveOperate()">保存</el-button>
            </div>
        </el-dialog>
        <!--选择图标-->
        <el-dialog title="菜单图标列表" :visible.sync="selectIconVisible" v-el-drag-dialog :close-on-click-modal='false' width="50%" custom-class="dialog-default">
          <div class="dialog-contant-default">
            <div class="icons-container">
              <div class="icons-wrapper">
                <div v-for="item of iconsMap" :key="item" @click="handleClipboard(generateIconCode(item),item,$event)">
                  <el-tooltip placement="top">
                    <div slot="content">
                      {{generateIconCode(item)}}
                    </div>
                    <div class="icon-item">
                      <svg-icon class-name="disabled" :icon-class="item" />
                      <span>{{item}}</span>
                    </div>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div> 
        </el-dialog>

    </div>
</template>
<script>
// import SearchForm from 'search-form-ry'
// import BasicTable from 'basic-table-ry'
// import UpdateForm from 'update-form-ry'
import SvgIcon from '@/components/SvgIcon'
import { baseRequest, baseSearch } from '@/api/base'
import icons from '@/views/svg-icons/generateIconsView'
import clipboard from '@/utils/clipboardIcon'

export default {
  name: 'systemManagementFunctionManagementIndex',
  components: {
    // SearchForm,
    // BasicTable,
    // UpdateForm,
    SvgIcon
  },
  computed: {
    tableHeight: function() {
      return this.$store.state.app.containHeight - 376
    }
  },
  data() {
    return {
      data: [],
      pageNo: 1,
      total: null,
      pageSize: 15,
      actionName: '',
      status: null,
      treeLoading: false,
      oldParentId: null, // 拖拽之前的父id
      oldOrder: null, // 拖拽前的顺序
      actionId: null,
      connectionId: null,
      filterText: '',
      treeData: [], // 树数据
      defaultProps: { // 树对应关系
        children: 'children',
        label: 'name'
      },
      clearable: true,
      configData: {}, // 表格数据
      selectIconVisible: false, // 图标弹框开关
      updateFormData: null, // 弹框数据
      formVisible: false, // 弹框开关
      tableVisible: false,
      searchToggle: true, // 查询下拉切换
      tableToggle: true, // 表格下拉切换
      operateStatus: null,
      dictId: null, // 添加下级和修改保存参数id
      containHeight: null,
      nodeType: '1', // 树id
      isMenu: true, // 当前时菜单类型
      dialogTitle: { // 弹框标题
        1: '新增菜单/功能',
        2: '修改菜单/功能',
        3: '资源关联'
      },
      treeform: { // 添加、修改表单数据
        actionId: null,
        msgId: null,
        actionDesc: null,
        actionType: null,
        status: '1',
        actionUrl: null,
        actionIcon: null
      },
      rules: {
        msgId: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        actionType: [
          { required: true, message: '请输入类型', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请输入状态', trigger: 'change' }
        ]
      },
      iconsMap: [],
      iconss: '',
      options: [{
        value: '0',
        label: '无效'
      }, {
        value: '1',
        label: '有效'
      }],
      optionsType: [
        {
          value: '1',
          label: '顶部菜单',
          disabled: false
        }, {
          value: '2',
          label: '左侧菜单',
          disabled: false
        }
        //  {
        //   value: '3',
        //   label: '功能菜单',
        //   disabled: false
        // }
      ]
    }
  },
  created() {
    this.getOption()
    this.containHeight = this.$store.state.app.containHeight - 100
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  mounted() {
    const iconsMap = icons.state.iconsMap.map((i) => {
      return i.default.id.split('-')[1]
    })
    this.iconsMap = iconsMap
  },
  methods: {
    generateIconCode(symbol) {
      return `${symbol}`
    },
    // 点击图标
    handleClipboard(text, item, event) {
      this.iconss = item
      this.treeform.actionIcon = text
      clipboard(text, event)
      this.selectIconVisible = false
    },
    // // 资源关联
    // connections(row) {
    //   this.connectionId = row.actionId
    //   this.tableVisible = true
    //   this.operateStatus = 3
    // },
    // 左侧树筛选
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 点击查询
    searchOption(page) {
      // const param = this.$refs.searchForm.searchParam()
      if (!page) {
        this.pageNo = 1
      }
      const param = {
        actionName: this.actionName,
        status: this.status,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      param.parentId = this.actionId
      baseSearch('/cmprsFunction/selects', param).then(response => {
        this.data = response.data.item
        this.total = response.data.total
        this.pageSize = response.data.pageSize
      })
      // param.actionName = param.msgId
      // this.$refs.basicTable.getData(url, param)
    },
    // 初始化数据
    getOption() {
      baseRequest('/cmprsFunction/getTree').then(response => {
        const root = [{
          id: 0,
          type: '0',
          name: '菜单列表',
          children: response.data.item
        }]
        this.treeData = root
        this.$nextTick(function() {
          if (this.treeData[0]) {
            this.actionId = this.treeData[0].id
            this.searchOption()
          }
        })
        // baseRequest(url, { 'urlMode': '1' }).then(response => {
        //   const result = response.data
        //   result.formConfig = JSON.parse(result.formConfig)
        //   result.tableConfig = JSON.parse(result.tableConfig)
        //   this.configData = result
        //   this.$nextTick(function() {
        //     if (this.treeData[0]) {
        //       this.actionId = this.treeData[0].id
        //       this.searchOption()
        //     }
        //   })
        // })
      })
    },
    // 获取树数据
    getTree() {
      this.treeLoading = true
      baseRequest('/cmprsFunction/getTree').then(response => {
        const root = [{
          id: 0,
          type: '0',
          name: '菜单列表',
          children: response.data.item
        }]
        this.treeData = root
        this.treeLoading = false
      })
    },
    // 重置
    reset() {
      this.actionName = ''
      this.status = null
      this.searchOption()
      // baseRequest(url, { 'urlMode': '1' }).then(response => {
      //   const result = response.data
      //   result.formConfig = JSON.parse(result.formConfig)
      //   result.tableConfig = JSON.parse(result.tableConfig)
      //   this.configData = result
      //   this.actionName = ''
      //   this.status = null
      //   this.$nextTick(function() {
      //     if (this.treeData[0]) {
      //       this.actionId = this.treeData[0].id
      //       this.searchOption()
      //     }
      //   })
      // })
    },
    // 点击树切换数据
    handleNodeClick(data) {
      this.nodeType = data.type
      this.actionId = data.id
      this.searchOption()
    },
    // 设置类型下拉可选
    setOptionDisable() {
      let childrenType = null
      if (this.data && this.data[0]) {
        childrenType = this.data[0].actionType
      }
      // 当有子节点时 只能选有的节点
      // 当没有子节点时 只能选自己类型的下层节点 这里自己类型只有 '1'和'2'
      for (const item of this.optionsType) {
        if (childrenType) {
          if (childrenType === item.value) {
            item.disabled = false
          } else {
            item.disabled = true
          }
        } else {
          if (this.nodeType === '2' && item.value === '1') {
            item.disabled = true
          } else {
            item.disabled = false
          }
        }
      }
    },
    // 添加修改表单类型发生变化
    selectValueChange(val) {
      if (val === '3') {
        this.isMenu = false
        this.treeform.actionIcon = null
      } else {
        this.isMenu = true
      }
    },
    // 点击添加
    addOption() {
      this.setOptionDisable()
      this.operateStatus = 1
      this.formVisible = true
      for (const key in this.treeform) {
        if (key === 'status') {
          this.treeform[key] = '1'
        } else {
          this.treeform[key] = null
        }
      }
      this.$nextTick(function() {
        this.$refs.form.clearValidate()
      })
    },
    // 修改表单
    updateOption(row) {
      this.setOptionDisable()
      this.operateStatus = 2
      this.formVisible = true
      this.treeform.actionId = row.actionId
      this.treeform.msgId = row.field_convert_map.msgId
      this.treeform.actionName = row.msgId
      this.treeform.actionDesc = row.actionDesc
      this.treeform.actionType = row.actionType
      this.treeform.status = row.status
      this.treeform.actionUrl = row.actionUrl
      this.treeform.actionIcon = row.actionIcon
      this.$nextTick(function() {
        this.$refs.form.clearValidate()
      })
    },
    // 删除表单
    deleteOption(row) {
      this.$confirm('确认删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        baseRequest('/cmprsFunction/delete', { actionId: row.actionId, msgId: row.msgId }).then(response => {
          this.searchOption()
          this.getTree()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
    // 保存操作
    saveOperate() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const param = this.treeform
          param.parentId = this.actionId
          if (this.operateStatus === 2) {
            const temp = param.msgId
            param.msgId = param.actionName
            param.actionName = temp
          }
          baseRequest(this.operateStatus === 1 ? '/cmprsFunction/add' : '/cmprsFunction/update', param).then(response => {
            this.searchOption()
            this.getTree()
            this.$Message.success('保存成功')
          })
          this.formVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 查找父结点
    findParentId(data, id, parent) {
      for (const iterator of data) {
        if (id === iterator.id) {
          return parent
        } else {
          if (iterator.children && iterator.children.length > 0) {
            if (this.findParentId(iterator.children, id, iterator.name)) {
              return this.findParentId(iterator.children, id, iterator)
            }
          }
        }
      }
    },
    // 拖拽树操作
    handleDragStart(node, ev) {
      const oldParent = this.findParentId(this.treeData, node.data.id)
      this.oldParentId = oldParent.id
      this.oldOrder = oldParent.children.findIndex(item => item.id === node.data.id) + 1
    },
    // 放置事件
    handleDrop(draggingNode, dropNode, dropType, ev) {
      // this.treeLoading = true
      const currentId = draggingNode.data.id
      const oldParentId = this.oldParentId
      const newParent = this.findParentId(this.treeData, currentId)
      const newParentId = newParent.id
      const newOrder = newParent.children.findIndex(item => item.id === currentId) + 1
      const oldOrder = this.oldOrder
      const params = {
        oldParentId,
        newParentId,
        newOrder,
        oldOrder,
        currentId
      }
      baseRequest('/cmprsFunction/orderTree', params).then(_ => {
        this.searchOption()
        this.getTree()
      })
    },
    allowDrop(draggingNode, dropNode, type) {
      if (draggingNode.data.type === '2') {
        if (dropNode.data.type !== '2') {
          if (type === 'inner') {
            if (dropNode.childNodes.length === 0) {
              return true
            } else {
              if (dropNode.childNodes[0].data.type === '1') {
                return false
              } else {
                return true
              }
            }
          } else {
            return false
          }
        } else {
          return true
        }
      } else {
        if (dropNode.data.type !== '2') {
          if (type === 'inner') {
            if (dropNode.childNodes.length === 0) {
              return true
            } else {
              if (dropNode.childNodes[0].data.type === '2') {
                return false
              } else {
                return true
              }
            }
          } else {
            if (dropNode.data.type === '1') {
              return true
            } else {
              return false
            }
          }
        } else {
          return false
        }
      }
    },
    allowDrag(draggingNode) {
      return draggingNode.data.type !== '0'
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
<style rel="stylesheet/scss" lang="scss" scoped>
    .code-tree{
        margin-top: 5px;
        overflow:hidden;
        position: relative;
        border:1px solid #E4E4E4;
        background-color: #fff;
        .code-tree-contain{
          height:calc(100% - 50px);
          overflow:auto;
        }
    }
    .icons-container {
      margin: 10px 20px 0;
      overflow: hidden;
      .icons-wrapper {
        margin: 0 auto;
    }
    .icon-item {
      margin: 20px;
      height: 110px;
      text-align: center;
      width: 110px;
      float: left;
      font-size: 30px;
      color: #24292e;
      cursor: pointer;
    }
    span {
      display: block;
      font-size: 24px;
      margin-top: 10px;
    }
    .disabled{
      pointer-events: none;
    }
}
</style>
<style lang="scss">
.menu-management{
  .form-search .demo-form-inline{
    width:auto;
  }
}
</style>
