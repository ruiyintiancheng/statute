/*
 * @Author: wk 
 * @Date: 2020-05-29 10:39:20 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-14 13:45:44
 * @Description:  模型管理
 */
<template>
  <div class="model-management clearfix">
    <div class="root-tree">
      <header class="tree-header">
        <span class="tree-title">
          公式管理
        </span>
        <span class="tree-add">
          <el-button type="text"
                     @click="addParent">
            <i class="el-icon-plus"
               title="添加"></i>
          </el-button>
        </span>
      </header>
      <div class="tree-content">
        <el-tree @node-click="menuchange"
                 :data="treeData"
                 node-key="id"
                 :props="defaultProps">
          <span class="custom-tree-node"
                slot-scope="{ node, data }">
            <span :style="{color:data.id === activeIndex?'#409EFF':''}">{{ node.label }}</span>
            <span v-if="!data.children">
              <a title="修改"
                 class="el-icon-edit-outline"
                 type="text"
                 size="mini"
                 @click.stop="() => modParent(data)">
              </a>
              <a title="删除"
                 class="el-icon-close"
                 type="text"
                 size="mini"
                 @click.stop="() => delParent(node, data)">
              </a>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <div class="lm-content">
      <div class="demo-input-size conter-view" v-if="nameType === 2">
        <span>综合占比 =</span>
        <span>操作性占比(k)</span>
        <span class="xing">*</span>
        <el-input placeholder=""
                  style="width:140px"
                  @change="coefficientChange($event,1,0,'操作性占比')"
                  v-model="seachData.k"
                  size="small"
                  clearable>
        </el-input>
        <span>+ 时效性占比(h)</span>
        <span class="xing">*</span>
        <el-input placeholder=""
                  style="width:140px"
                  @change="coefficientChange($event,1,0,'时效性占比')"
                  v-model="seachData.h"
                  size="small"
                  clearable>
        </el-input>
      </div>
      <div class="demo-input-size conter-view" v-else>
        <span>综合分值 =</span>
        <span>系统分值(s)</span>
        <span class="xing">*</span>
        <el-input placeholder=""
                  style="width:140px"
                  @change="coefficientChange($event,1,0,'系统系数')"
                  v-model="seachData.s"
                  size="small"
                  clearable>
        </el-input>
        <span>+ 人工分值(m)</span>
        <span class="xing">*</span>
        <el-input placeholder=""
                  style="width:140px"
                  @change="coefficientChange($event,1,0,'人工系数')"
                  v-model="seachData.m"
                  size="small"
                  clearable>
        </el-input>
        <span>+ 偏移量(x)</span>
        <span class="xing">*</span>
        <el-input placeholder=""
                  style="width:140px"
                  @change="coefficientChange($event,100,-100,'偏移量系数')"
                  v-model="seachData.x"
                  size="small"
                  clearable>
        </el-input>
      </div>
      <div class="submiite">
        <el-button type="primary"
                   @click="saveScore">保存</el-button>
        <el-button @click="restScore">恢复</el-button>
      </div>
    </div>
    <el-dialog :title="dialogTitle[operateStatus]"
               :visible.sync="pringBox"
               width="550px"
               custom-class="dialog-default autoHeight">
      <div class="dialog-contant-default">
        <el-form :rules="outsideRules"
                 class="baseUpdate-form"
                 ref="formOutside"
                 style="    margin-left: calc(50% - 185px)"
                 :model="updateFormData"
                 label-width="120px">
          <el-form-item prop="formulaName"
                        label="公式名称">
            <el-input class="form-input"
                      style="width:200px"
                      v-model="updateFormData.formulaName"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="菜单"
                        prop="actionId">
            <el-select v-model="updateFormData.actionId"
                       placeholder="">
              <el-option v-for="(item,index) in menus"
                         :key="index"
                         :label="item"
                         :value="index"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="pringBox = false">取消</el-button>
        <el-button type="primary"
                   @click="saveOperate()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { baseRequest } from '@/api/base'
export default {
  name: 'modelManagement',
  data() {
    return {
      nameType: '',
      defaultProps: {
        children: 'children',
        label: 'formulaName'
      },
      menus: [],
      defaultIndex: null,
      treeData: [], // 左侧菜单数据
      activeIndex: '', // 选中菜单id
      updateFormData: {
        formulaName: '',
        actionId: ''
      },
      outsideRules: {
        formulaName: [
          { required: true, message: '该项为必填项' }
        ],
        actionId: [
          { required: true, message: '该项为必填项' }
        ]
      },
      operateStatus: null, // 操作选项
      dialogTitle: { // 弹框标题
        1: '添加',
        2: '修改',
        3: '删除'
      },
      pringBox: false, // 父类数据弹框开关
      seachData: {
        s: '',
        m: '',
        x: '',
        k: '',
        h: ''
      }
    }
  },
  mounted() {
    this.searchOption()
    baseRequest('/formula/getFormulaTree').then(response => {
      this.menus = response.data.item
    })
  },
  methods: {
    coefficientChange(evnet, max, min, p) {
      if (evnet > max || evnet < min) {
        this.$Message.warning('请确保' + p + '的值在' + min + '到' + max + '之间')
      }
    },
    searchOption() {
      baseRequest('/formula/selects', {}).then(response => {
        if (response.data.item) {
          this.treeData = response.data.item
          if (this.activeIndex) {
            baseRequest('/formula/select', { id: this.activeIndex }).then(response => {
              this.seachData = response.data.item ? response.data.item : { m: '', x: '', s: '', k: '', h: '' }
            })
          }

          // for (const i in this.treeData) {
          //   if (i === '0') {
          //     this.defaultIndex = this.treeData[i].id
          //     this.activeIndex = this.treeData[i].id
          //     baseRequest('/formula/select', { id: this.defaultIndex }).then(response => {
          //       this.seachData = response.data.item ? response.data.item : { m: '', x: '', s: '' }
          //     })
          //   }
          // }
        } else {
          this.treeData = []
        }
      })
    },
    restScore() {
      if (!this.activeIndex) {
        this.$Message.warning('请选择公式')
        return
      }
      baseRequest('/formula/select', { id: this.activeIndex }).then(response => {
        this.seachData = response.data.item
      })
    },
    saveScore() {
      if (!this.activeIndex) {
        this.$Message.warning('请选择公式')
        return
      }
      this.$confirm('是否确认更改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const sum = this.seachData.s * 1 + this.seachData.m * 1
        const py = this.seachData.x * 1
        if (this.seachData.s || this.seachData.m) {
          if (sum > 1) {
            this.$Message.warning('系统系数+人工系数总和不能大于1')
            return
          }
        }
        if (this.seachData.x) {
          if (py < -100 || py > 100) {
            this.$Message.warning('偏移量在-100~100之间')
            return
          }
        }
        if (this.seachData.k) {
          if (this.seachData.k < 0 || this.seachData.k > 1) {
            this.$Message.warning('操作性占比在0~1之间')
            return
          }
        }
        if (this.seachData.h) {
          if (this.seachData.h < 0 || this.seachData.h > 1) {
            this.$Message.warning('时效性占比在0~1之间')
            return
          }
        }
        const params = this.seachData
        params.id = this.activeIndex
        params.s = this.seachData.s ? this.seachData.s : ''
        params.m = this.seachData.m ? this.seachData.m : ''
        params.x = this.seachData.x ? this.seachData.x : ''
        params.k = this.seachData.k ? this.seachData.k : ''
        params.h = this.seachData.h ? this.seachData.h : ''
        baseRequest('/formula/update', params).then(response => {
          this.$Message.success('操作成功')
          this.searchOption()
        })
      })
    },
    delParent(node, data) {
      this.$confirm('此操作将永久删除该模型, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        baseRequest('/formula/delete', { id: data.id }).then(response => {
          this.$Message.success('操作成功')
          this.searchOption()
        })
      })
    },
    modParent(data) {
      this.operateStatus = 2
      this.defaultIndex = data.id
      for (const i of this.treeData) {
        if (i.id === this.defaultIndex) {
          this.updateFormData.formulaName = i.formulaName
          this.updateFormData.actionId = this.menus[i.actionId]
          this.pringBox = true
          // alert(3)
        }
      }
    },
    addParent() {
      this.operateStatus = 1
      for (var i in this.updateFormData) {
        this.updateFormData[i] = ''
      }
      this.pringBox = true
      this.$nextTick(_ => {
        this.$refs.formOutside.clearValidate()
      })
    },
    saveOperate() {
      let url = null
      if (this.operateStatus === 1) {
        this.$refs.formOutside.validate(valid => {
          if (valid) {
            url = '/formula/add'
            baseRequest(url, this.updateFormData).then(response => {
              this.pringBox = false
              this.$Message.success('操作成功')
              this.searchOption()
            })
          }
        })
      } else if (this.operateStatus === 2) {
        url = '/formula/update'
        this.updateFormData.id = this.defaultIndex
        baseRequest(url, this.updateFormData).then(response => {
          this.pringBox = false
          this.$Message.success('操作成功')
          this.searchOption()
        })
      }
    },
    menuchange(val) {
      this.activeIndex = parseInt(val.id)
      this.nameType = val.formulaType
      baseRequest('/formula/select', { id: this.activeIndex }).then(response => {
        this.seachData = response.data.item ? response.data.item : { m: '', x: '', s: '' }
      })
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    zhuanzf(str) {
      return str + ''
    }
  }
}
</script>
<style lang="scss">
.model-management {
  height: 100%;
  padding: 10px;
  .root-tree {
    height: 100%;
    float: left;
    width: 220px;
    border: 1px solid #dcdfe6;
    background-color: #fff;
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
    }
    .tree-header {
      height: 40px;
      line-height: 40px;
      background-color: #f3f3f3;
      padding-left: 15px;
      font-size: 14px;
      color: #9d9399;
      position: relative;
      .tree-add {
        position: absolute;
        right: 15px;
      }
    }
    .tree-content {
      .el-icon-close {
        color: #f56c6c;
      }
      // .el-icon-edit{
      //   color:#409EFF;
      // }
    }
  }
  .lm-content {
    height: 100%;
    width: calc(100% - 235px);
    margin-left: 15px;
    float: left;
    position: relative;
    border: 1px solid #dcdfe6;
    background-color: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
    .el-tabs {
      height: 100%;
      .el-tabs__content {
        height: calc(100% - 40px);
        overflow: auto;
      }
      .lm-content-none {
        text-align: center;
        margin-top: 180px;
        font-size: 25px;
        font-weight: 600;
        letter-spacing: 1px;
        color: #409eff;
      }
    }
    .conter-view {
      margin-top: 25%;
      margin-left: 50%;
      position: absolute;
      left: -410px;
    }
    .submiite {
      position: absolute;
      right: 90px;
      bottom: 40px;
    }
  }
}
</style>