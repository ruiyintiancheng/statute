<template>
    <div class="learn-management clearfix">
        <div class="root-tree">
          <header class="tree-header">
              <span class="tree-title">
                学习项目
              </span>
              <span class="tree-add">
                <el-button
                  type="text"
                  @click="updateTreeNode()"
                  >
                  <i class="el-icon-plus" title="添加"></i>
                </el-button>
              </span>
          </header>
          <div class="tree-content">
            <el-tree
            @node-click="nodeClickHandle"
            :data="treeData"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            @node-drag-start="handleDragStart"
            @node-drop="handleDrop"
            draggable
            :allow-drop="allowDrop"
            :allow-drag="allowDrag"
            :props="defaultProps">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span :style="{color:data.labelId === currentId?'#409EFF':''}">{{ node.label }}</span>
              <span v-if="!data.children">
                <a
                  title="修改"
                  class="el-icon-edit-outline"
                  type="text"
                  size="mini"
                  @click="() => updateTreeNode(data)">
                </a>
                <a
                  title="删除"
                  class="el-icon-close"
                  type="text"
                  size="mini"
                  @click="() => removeNode(node, data)">
                </a>
              </span>
            </span>
          </el-tree>
          </div>
        </div>
        <div class="lm-content">
            <el-tabs v-model="activeName" type="border-card" >
              <el-tab-pane label="配置" name="first">
                <setting v-if="currentId" ref="setting" :labelId="currentId"></setting>
                <div v-else class="lm-content-none">请选择学习项目</div>
              </el-tab-pane>
              <el-tab-pane label="上传">
                <upload  v-if="currentId" :labelId="currentId" name="second"></upload>
                <div v-else class="lm-content-none">请选择学习项目</div>
              </el-tab-pane>
              <el-tab-pane label="列表" >
                <list  v-if="currentId" :labelId="currentId" name="third"></list>
                <div v-else class="lm-content-none">请选择学习项目</div>
              </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
import setting from './components/setting'
import upload from './components/upload'
import list from './components/list'
import { baseRequest } from '@/api/base'
export default {
  name: 'learnManagementIndex',
  components: {
    setting,
    upload,
    list
  },
  created() {
    this.getTreeData()
  },
  data() {
    return {
      activeName: 'first',
      treeData: [
      ],
      defaultProps: {
        children: 'children',
        label: 'labelName'
      },
      currentId: null,
      oldOrder: null
    }
  },
  methods: {
    nodeClickHandle(data) {
      if (data.children) {
        return
      }
      this.currentId = data.labelId
      this.$nextTick(_ => {
        this.$refs.setting.getData()
      })
    },
    getTreeData() {
      baseRequest('/bModuleLabel/selects', { labelType: '0' }).then(response => {
        this.treeData = [
          {
            labelId: '',
            labelName: '学习路上',
            children: response.data.item || []
          }
        ]
      })
    },
    updateTreeNode(data) {
      let inputValue = ''
      let url = '/bModuleLabel/add'
      const params = {
        labelType: '0'
      }
      if (data) {
        inputValue = data.labelName
        url = '/bModuleLabel/update'
        params.labelId = data.labelId
      }
      this.$prompt('请输入学习标题', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '名称不能为空',
        inputValue: inputValue
      }).then(({ value }) => {
        params.labelName = value
        baseRequest(url, params).then(_ => {
          this.getTreeData()
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        })
      })
    },
    removeNode(node, data) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        baseRequest('/bModuleLabel/delete', { labelId: data.labelId }).then(_ => {
          this.getTreeData()
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        })
      })
    },
    allowDrag(draggingNode) {
      return !draggingNode.data.children
    },
    allowDrop(draggingNode, dropNode, type) {
      if (type === 'inner') {
        return false
      } else {
        if (dropNode.data.children) {
          return false
        } else {
          return true
        }
      }
    },
    handleDragStart(node, ev) {
      this.oldOrder = this.treeData[0].children.findIndex(item => item.labelId === node.data.labelId) + 1
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      const labelId = draggingNode.data.labelId
      const newOrder = this.treeData[0].children.findIndex(item => item.labelId === labelId) + 1
      const oldOrder = this.oldOrder
      const params = {
        labelId,
        newOrder,
        oldOrder
      }
      baseRequest('/bModuleLabel/orderLabel', params).then(response => {
        this.getTreeData()
      })
    }
  }
}
</script>
<style lang="scss">
.learn-management{
  height: 100%;
  padding: 10px;
  .root-tree{
    height: 100%;
    float: left;
    width: 220px;
    border: 1px solid #DCDFE6;
    background-color: #fff;
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
    }
    .tree-header{
      height: 40px;
      line-height:40px;
      background-color: #F3F3F3;
      padding-left: 15px;
      font-size: 14px;
      color:#9d9399;
      position: relative;
      .tree-add{
        position: absolute;
        right: 15px;
      }
    }
    .tree-content{
      .el-icon-close{
          color:#F56C6C;
      }
      // .el-icon-edit{
      //   color:#409EFF;
      // }
    }
  }
  .lm-content{
    height: 100%;
    width: calc(100% - 235px);
    margin-left: 15px;
    float:left;
    .el-tabs{
      height: 100%;
      .el-tabs__content{
        height: calc(100% - 40px);
        overflow: auto;
      }
      .lm-content-none{
        text-align: center;
        margin-top:180px;
        font-size: 25px;
        font-weight: 600;
        letter-spacing: 1px;
        color: #409EFF;
      }
    }
  }
}
</style>