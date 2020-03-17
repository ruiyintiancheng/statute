/*
 * @Author: lk 
 * @Date: 2020-03-02 09:42:50 
 * @Last Modified by: lk
 * @Last Modified time: 2020-03-09 15:29:08
 * @Description:  代理服务
 */
 <template>
    <div>
      <el-form :rules="rules"
                class="baseUpdate-form"
                ref="updateFrom"
                style="margin-left: calc(50% - 230px)"
                :model="updateFormData"
                label-width="120px">
        <el-form-item prop="agentServer"
                    label="选择代理服务">
            <el-select class="form-input" style="width:255px;"
            v-model="updateFormData.agentServer"
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
                  <el-form-item prop="agntName"
                              label="代理名称:">
                    <el-input class="form-input"
                              style="width:200px"
                              v-model.trim="iFormData.agntName"
                              clearable></el-input>
                  </el-form-item>
                  <el-form-item prop="agntIp"
                                label="代理地址:">
                    <el-input class="form-input"
                              style="width:200px"
                              v-model.trim="iFormData.agntIp"
                              clearable></el-input>
                  </el-form-item>
                  <el-form-item prop="agntPort"
                                label="代理端口:">
                    <el-input class="form-input"
                              style="width:200px"
                              v-model.trim="iFormData.agntPort"
                              clearable></el-input>
                  </el-form-item>
                  <el-form-item prop="agntUsername"
                        label="用户名">
                      <el-input class="form-input"
                                style="width:200px"
                                v-model.trim="iFormData.agntUsername"
                                clearable></el-input>
                    </el-form-item>
                    <el-form-item prop="agntPazzword"
                                  label="密码">
                      <el-input class="form-input"
                                style="width:200px"
                                @focus="iFormData.agntPazzword=null"
                                v-model.trim="iFormData.agntPazzword"
                                type="password"
                                clearable></el-input>
                    </el-form-item>
                  <el-form-item prop="agntState"
                                label="代理状态">
                      <el-radio v-model="iFormData.agntState" label="1">停用</el-radio>
                      <el-radio v-model="iFormData.agntState" label="2">启用</el-radio>
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
import { deepClone } from '@/utils'
import { encode64 } from '@/utils/base64'
import { saveUpdate } from '@/utils/validate'
export default {
  props: {
    operateId: [Number, String],
    operateStatus: Number
  },
  mounted() {
    baseRequest('/confAgnt/getConfAgntSelect').then(response => {
      this.item = response.data.item
      if (this.operateStatus === 2) {
        this.updateFormData.agentServer = this.operateId + ''
      }
    })
  },
  data() {
    return {
      rules: {
        agentServer: [
          { required: true, message: '请选择此项' }
        ]
      },
      updateFormData: {
        agentServer: null
      },
      item: {},

      visable: false,
      iRules: {
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
          { validator: (rule, value, callback) => {
            if (/^[0-9]*\.?[0-9]+$/.test(value)) {
              callback()
            } else {
              callback(new Error('端口号格式不正确'))
            }
          }
          },
          { max: 256, message: '不能超过256个字' }
        ],
        agntUsername: [
          { required: true, message: '请填写此项' },
          { max: 128, message: '不能超过128个字' }
        ],
        agntPazzword: [
          { required: true, message: '请填写此项' },
          { max: 128, message: '不能超过128个字' }
        ],
        agntState: [
          { required: true, message: '请填写此项' }
        ]
      },
      iFormData: {
        agntName: null,
        agntIp: null,
        agntPort: null,
        agntUsername: null,
        agntPazzword: null,
        agntState: '1'
      }
    }
  },
  methods: {
    getOptions() {
      baseRequest('/confAgnt/getConfAgntSelect').then(response => {
        this.item = response.data.item
      })
    },
    add() {
      this.iFormData = {
        agntName: null,
        agntIp: null,
        agntPort: null,
        agntUsername: null,
        agntPazzword: null,
        agntState: '1'
      }
      this.visable = true
    },
    save() {
      const data = deepClone(this.iFormData)
      data.agntPazzword = encode64(data.agntPazzword)
      saveUpdate('/confAgnt/add', data, this.iRules, this.$refs.iUpdateFrom).then(() => {
        this.visable = false
        this.$Message.success('操作成功')
        this.getOptions()
      })
    },
    saveCurrent(callback) {
      this.$refs.updateFrom.validate((valid) => {
        if (valid) {
          callback && callback({ agntId: this.updateFormData.agentServer, agntName: this.item[this.updateFormData.agentServer] })
        } else {
          return false
        }
      })
    }
  }
}
</script>
