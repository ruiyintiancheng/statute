/*
 * @Author: wk 
 * @Date: 2020-05-26 09:21:42 
 * @Last Modified by: wk
 * @Last Modified time: 2020-05-28 17:39:17
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
                 @select="menuchange">
          <el-menu-item v-for="item in leftData"
                        :key="item.id"
                        :index="zhuanzf(item.id)">
            <span slot="title">{{item.formulaName}}</span>
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
      menus: [],
      defaultIndex: null,
      leftData: {}, // 左侧菜单数据
      activeIndex: null, // 选中菜单id
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
        x: ''
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
          this.leftData = response.data.item
          for (const i in this.leftData) {
            if (i === '0') {
              this.defaultIndex = this.leftData['0'].id
              this.activeIndex = this.leftData['0'].id
              baseRequest('/formula/select', { id: this.defaultIndex }).then(response => {
                this.seachData = response.data.item ? response.data.item : { m: '', x: '', s: '' }
              })
            }
          }
        } else {
          this.leftData = {}
        }
      })
    },
    restScore() {
      baseRequest('/formula/select', { id: this.activeIndex }).then(response => {
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
        const py = this.seachData.x

        if (this.seachData.s || this.seachData.m) {
          if (parseInt(sum) > 1) {
            this.$Message.warning('系统系数+人工系数总和不能大于1')
            return
          }
        }
        if (this.seachData.x) {
          if (parseInt(py) < -100 && parseInt(py) > 100) {
            this.$Message.warning('偏移量在-100~100之间')
            return
          }
        }
        const params = this.seachData
        params.id = this.activeIndex
        params.s = parseInt(this.seachData.s) ? parseInt(this.seachData.s) : ''
        params.m = parseInt(this.seachData.s) ? parseInt(this.seachData.s) : ''
        params.x = parseInt(this.seachData.x) ? parseInt(this.seachData.x) : ''
        baseRequest('/formula/update', params).then(response => {
          this.$Message.success('操作成功')
          this.searchOption()
        })
      })
    },
    delParent() {
      this.$confirm('此操作将永久删除该模型, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        baseRequest('/formula/delete', { id: this.activeIndex }).then(response => {
          this.$Message.success('操作成功')
          this.searchOption()
        })
      })
    },
    modParent() {
      this.operateStatus = 2
      for (const i of this.leftData) {
        if (i.id === this.activeIndex) {
          this.updateFormData.formulaName = i.formulaName
          this.updateFormData.actionId = this.menus[i.actionId]
          this.pringBox = true
          // alert(3)
        }
      }
    },
    addParent() {
      this.operateStatus = 1
      // for (var i in this.updateFormData) {
      //   this.updateFormData[i] = ''
      // }
      this.updateFormData.formulaName = ''
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
        baseRequest(url, { id: this.activeIndex, formulaName: this.updateFormData.formulaName }).then(response => {
          this.pringBox = false
          this.$Message.success('操作成功')
          this.searchOption()
        })
      }
    },
    menuchange(val) {
      this.activeIndex = parseInt(val)
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