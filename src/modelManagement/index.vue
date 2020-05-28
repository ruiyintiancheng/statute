/*
 * @Author: wk 
 * @Date: 2020-05-26 09:21:42 
 * @Last Modified by: wk
 * @Last Modified time: 2020-05-27 15:44:25
 * @Description:  模型管理
 */
<template>
  <div class="modelManagement"
       style="height:100%">
    <el-row class="tac"
            style="height:100%">

      <el-col :span="5"
              style="height:100%">
        <el-menu class="el-menu-vertical-demo"
                 style="height:90%;overflow:auto"
                 :default-active=" zhuanzf(defaultIndex)"
                 @select="menuchange"
                 @open="handleOpen"
                 @close="handleClose">
          <el-menu-item v-for="item in leftData"
                        :key="item.labelId"
                        :index="zhuanzf(item.labelId)">
            <span slot="title">{{item.labelName}}</span>
          </el-menu-item>

        </el-menu>
        <div class="container">
          <el-button type="primary"
                     size="mini"
                     @click="addParent"
                     plain>添加</el-button>
          <el-button type="info"
                     size="mini"
                     @click="modParent"
                     plain>修改</el-button>
          <el-button type="danger"
                     size="mini"
                     @click="delParent"
                     plain>删除</el-button>
        </div>
      </el-col>
      <el-col :span="19"
              style="height:100%"
              class="conter">
        <div class="demo-input-size conter-view">
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
      </el-col>
    </el-row>
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
          <el-form-item prop="labelName"
                        label="模型名称">
            <el-input class="form-input"
                      style="width:200px"
                      v-model="updateFormData.labelName"
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
  </div>
</template>
<script>
import { baseRequest } from '@/api/base'
export default {
  name: 'modelManagement',
  data() {
    return {
      defaultIndex: null,
      leftData: {}, // 左侧菜单数据
      activeIndex: null, // 选中菜单id
      updateFormData: {
        labelName: ''
      },
      outsideRules: {
        labelName: [
          { required: true, message: '该项为必填项' }
        ],
        userName: [
          { required: true, message: '该项为必填项' }
        ]
      },
      operateStatus: null, // 操作选项
      dialogTitle: { // 弹框标题
        1: '添加',
        2: '修改',
        3: '删除'
      },
      parentFormVisible: false, // 父类数据弹框开关
      seachData: {
        s: '',
        m: '',
        x: ''
      }
    }
  },
  mounted() {
    this.searchOption()
  },
  methods: {
    coefficientChange(evnet, max, min, p) {
      if (evnet > max || evnet < min) {
        this.$Message.warning('请确保' + p + '的值在' + min + '到' + max + '之间')
      }
    },
    searchOption() {
      baseRequest('/bXuexiLabel/selects').then(response => {
        this.leftData = response.data.item
        for (const i in this.leftData) {
          if (i === '0') {
            this.defaultIndex = this.leftData[i].labelId
            this.activeIndex = this.leftData[i].labelId
            baseRequest('/formula/select', this.defaultIndex).then(response => {
              this.seachData = response.data.item
            })
          }
        }
      })
    },
    restScore() {
      baseRequest('/formula/select', this.activeIndex).then(response => {
        this.seachData = response.data.item
      })
    },
    saveScore() {
      this.$confirm('是否确认更改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const sum = this.seachData.s + this.seachData.m
        console.log(sum)
        const py = this.seachData.x
        if (sum <= 1 && py >= -100 && py <= 100) {
          const params = this.seachData
          params.labelId = this.activeIndex
          baseRequest('/formula/update', params).then(response => {
            this.$Message.success('操作成功')
            this.searchOption()
          })
        } else {
          this.$Message.warning('系统系数+人工系数总和不能大于1,偏移量在-100~100之间')
        }
      })
    },
    delParent() {
      this.$confirm('此操作将永久删除该模型, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        baseRequest('/bModuleLabel/deleteFormulaLabel', { labelId: this.activeIndex }).then(response => {
          this.$Message.success('操作成功')
          this.searchOption()
        })
      })
    },
    modParent() {
      this.operateStatus = 2
      for (const i of this.leftData) {
        if (i.labelId === this.activeIndex) {
          this.updateFormData.labelName = i.labelName
        }
      }
      this.parentFormVisible = true
    },
    addParent() {
      this.operateStatus = 1
      for (var i in this.updateFormData) {
        this.updateFormData[i] = ''
      }
      this.parentFormVisible = true
      this.$nextTick(_ => {
        this.$refs.formOutside.clearValidate()
      })
    },
    saveOperate() {
      let url = null
      if (this.operateStatus === 1) {
        url = '/bModuleLabel/addFormulaLabel'
        baseRequest(url, this.updateFormData).then(response => {
          this.parentFormVisible = false
          this.$Message.success('操作成功')
          this.searchOption()
        })
      } else if (this.operateStatus === 2) {
        url = '/bXuexiLabel/update'
        baseRequest(url, { labelId: this.activeIndex, labelName: this.updateFormData.labelName }).then(response => {
          this.parentFormVisible = false
          this.$Message.success('操作成功')
          this.searchOption()
        })
      }
    },
    menuchange(val) {
      this.activeIndex = val
      baseRequest('/formula/select', { id: this.activeIndex }).then(response => {
        this.seachData = response.data.item
      })
      console.log(val + '-----------------')
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
<style lang="scss" scoped>
.modelManagement {
  .container {
    width: 100%;
    height: 10%;
    text-align: center;
    vertical-align: middle;
    padding-top: 5%;
    background-color: #fff;
    border-right: 1px solid #e6e6e6;
    border-top: 1px solid #e6e6e6;
  }
  .conter {
    background-color: #fff;
    text-align: center;
    position: relative;
    .submiite {
      position: absolute;
      right: 90px;
      bottom: 40px;
    }
    .conter-view {
      margin-top: 25%;
    }
    .xing {
      font-size: 22px;
      position: relative;
      top: 5px;
    }
  }
}
</style>