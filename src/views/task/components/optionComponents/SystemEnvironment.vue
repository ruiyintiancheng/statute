/*
 * @Author: lk 
 * @Date: 2020-03-02 09:42:50 
 * @Last Modified by: lk
 * @Last Modified time: 2020-03-09 15:28:26
 * @Description:  系统环境
 */
 <template>
    <div>
      <el-form :rules="rules"
                class="baseUpdate-form"
                ref="updateFrom"
                style="margin-left: calc(50% - 230px)"
                :model="updateFormData"
                label-width="120px">
        <el-form-item prop="systemEnvironment"
                    label="选择跑批环境">
            <el-select class="form-input" style="width:255px;"
            v-model="updateFormData.systemEnvironment"
            clearable>
                <el-option v-for="(text,value) in item" :key="value" :value="value" :label="text"></el-option>        
            </el-select>
            <el-button plain @click="add">创建</el-button>
        </el-form-item>
      </el-form>

        <el-dialog title="新增系统环境"
              :visible.sync="visable"
              append-to-body
              width="40%"
              custom-class="dialog-default"
              >
          <div class="dialog-contant-default" v-if="visable">
            <el-form :rules="iRules"
                    class="baseUpdate-form"
                    ref="iUpdateFrom"
                    style="margin-left: calc(50% - 200px)"
                    :model="iFormData"
                    label-width="120px">
                  <el-form-item prop="sysName"
                              label="环境名称:">
                    <el-input class="form-input"
                              style="width:200px"
                              v-model.trim="iFormData.sysName"
                              clearable></el-input>
                  </el-form-item>
                  <el-form-item prop="sysIp"
                                label="环境地址:">
                    <el-input class="form-input"
                              style="width:200px"
                              v-model.trim="iFormData.sysIp"
                              clearable></el-input>
                  </el-form-item>
                  <el-form-item prop="sysTAllNum"
                                label="总线程数:">
                    <el-input-number style="width:200px;" v-model="iFormData.sysTAllNum"  :min="1"  ></el-input-number>
                  </el-form-item>
                  <el-form-item prop="sysCpuNum"
                                label="处理器核:">
                    <el-input-number style="width:200px;" v-model="iFormData.sysCpuNum"  :min="1"  ></el-input-number>&nbsp;&nbsp;颗
                  </el-form-item>
                  <el-form-item prop="sysRamAllNum"
                                label="总内存数:">
                    <el-input-number style="width:200px;" v-model="iFormData.sysRamAllNum"  :min="1"  ></el-input-number>&nbsp;&nbsp;KB
                  </el-form-item>
                  <el-form-item prop="sysDiskAllNum"
                                label="磁盘空间:">
                    <el-input-number style="width:200px;" v-model="iFormData.sysDiskAllNum"  :min="1"  ></el-input-number>&nbsp;&nbsp;KB
                  </el-form-item>
                  <el-form-item prop="sysState"
                                label="代理状态">
                      <el-radio v-model="iFormData.sysState" label="1">停用</el-radio>
                      <el-radio v-model="iFormData.sysState" label="2">启用</el-radio>
                  </el-form-item>
              </el-form>
          </div>
                <div slot="footer"
              class="dialog-footer">
            <el-button @click="visable = false">取消</el-button>
            <el-button type="primary"
                      @click="save()">保存</el-button>
          </div>
        </el-dialog>
    </div>
 </template>
 
<script>
import { baseRequest } from '@/api/base'
import { saveUpdate } from '@/utils/validate'
export default {
  props: {
    operateId: [Number, String],
    operateStatus: Number
  },
  mounted() {
    baseRequest('/confSystem/getSystemSelect').then(response => {
      this.item = response.data.item
      if (this.operateStatus === 2) {
        this.updateFormData.systemEnvironment = this.operateId + ''
      }
    })
  },
  data() {
    return {
      rules: {
        systemEnvironment: [
          { required: true, message: '请选择此项' }
        ]
      },
      updateFormData: {
        systemEnvironment: null
      },
      item: {},

      visable: false,
      iRules: {
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
      iFormData: {
        sysState: '1'
      }
    }
  },
  methods: {
    getOptions() {
      baseRequest('/confSystem/getSystemSelect').then(response => {
        this.item = response.data.item
      })
    },
    add() {
      this.iFormData = {
        sysState: '1'
      }
      this.visable = true
    },
    save() {
      saveUpdate('/confSystem/add', this.iFormData, this.iRules, this.$refs.iUpdateFrom).then(() => {
        this.visable = false
        this.$Message.success('操作成功')
        this.getOptions()
      })
    },
    saveCurrent(callback) {
      this.$refs.updateFrom.validate((valid) => {
        if (valid) {
          callback && callback({ sysId: this.updateFormData.systemEnvironment, sysName: this.item[this.updateFormData.systemEnvironment] })
        } else {
          return false
        }
      })
    }
  }
}
</script>
