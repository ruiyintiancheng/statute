/*
 * @Author: lk 
 * @Date: 2020-03-02 09:42:50 
 * @Last Modified by: lk
 * @Last Modified time: 2020-03-09 17:32:07
 * @Description:  其他下载
 */
 <template>
    <div>
      <el-form :rules="rules"
              class="baseUpdate-form"
              ref="updateFrom"
              style="margin-left: calc(50% - 200px)"
              :model="formData"
              label-width="120px">
            <el-form-item prop="protAnysTittle"
                        label="标题:">
              <el-input class="form-input"
                        style="width:200px"
                        v-model.trim="formData.protAnysTittle"
                        clearable></el-input>
            </el-form-item>
            <el-form-item prop="protAnysHtml"
                          label="html规则:">
              <el-input class="form-input"
                        style="width:200px"
                        v-model.trim="formData.protAnysHtml"
                        clearable></el-input>
            </el-form-item>
            <el-form-item prop="protAnysZz"
                          label="正则规则:">
              <el-input class="form-input"
                        style="width:200px"
                        v-model.trim="formData.protAnysZz"
                        clearable></el-input>
            </el-form-item>
            <el-form-item prop="protAnysChar"
                          label="关键字:">
              <el-input class="form-input"
                        style="width:200px"
                        v-model.trim="formData.protAnysChar"
                        clearable></el-input>
            </el-form-item>
            <el-form-item prop="protAnysIfsId"
                    label="调用接口:">
                  <el-select class="form-input" style="width:200px;"
                  v-model="formData.protAnysIfsId"
                  clearable>
                      <el-option v-for="(text,value) in item" :key="value" :value="value" :label="text"></el-option>        
                  </el-select>
                  <el-button plain @click="add">创建</el-button>
              </el-form-item>
              <el-form-item prop="protAnysPage"
                                label="解析类型">
                  <el-radio v-model="formData.protAnysPage" label="0">{{protAnysType === '0'?'普通翻页':'解析操作'}}</el-radio>
                  <el-radio v-model="formData.protAnysPage" label="1" v-if="protAnysType === '0'">追加翻页</el-radio>
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
                  <el-form-item prop="ifsName"
                              label="接口名称:">
                    <el-input class="form-input"
                              style="width:200px"
                              v-model.trim="iFormData.ifsName"
                              clearable></el-input>
                  </el-form-item>
                  <el-form-item prop="ifsType"
                        label="接口类型:">
                      <el-select class="form-input" style="width:200px;"
                      v-model="iFormData.ifsType"
                      clearable>
                          <el-option value="webService" label="webService"></el-option>        
                          <el-option value="HTML" label="HTML"></el-option>        
                      </el-select>
                  </el-form-item>
                  <el-form-item prop="ifsUrl"
                                label="接口地址:">
                    <el-input class="form-input"
                              style="width:200px"
                              v-model.trim="iFormData.ifsUrl"
                              clearable></el-input>
                  </el-form-item>
                  <el-form-item prop="ifsPort"
                                label="接口端口:">
                    <el-input class="form-input"
                              style="width:200px"
                              v-model.trim="iFormData.ifsPort"
                              clearable></el-input>
                  </el-form-item>
                  <el-form-item prop="ifsReq"
                                label="请求参数:">
                    <el-input class="form-input"
                              style="width:200px"
                              v-model.trim="iFormData.ifsReq"
                              clearable></el-input>
                  </el-form-item>
                  <el-form-item prop="ifsResp"
                                label="响应结果:">
                    <el-input class="form-input"
                              style="width:200px"
                              v-model.trim="iFormData.ifsResp"
                              clearable></el-input>
                  </el-form-item>
                  <el-form-item prop="ifsState"
                                label="代理状态">
                      <el-radio v-model="iFormData.ifsState" label="1">停用</el-radio>
                      <el-radio v-model="iFormData.ifsState" label="2">启用</el-radio>
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
    operateId: [Number, String, Object],
    operateStatus: Number
  },
  computed: {
    protAnysType: function() {
      if (this.operateStatus === 2) {
        return this.operateId.row.protAnysType
      } else {
        return this.operateId
      }
    }
  },
  mounted() {
    baseRequest('/confIfs/getConfIfsSelect').then(response => {
      this.item = response.data.item
      if (this.operateStatus === 2) {
        for (const key in this.operateId.row) {
          if (this.formData.hasOwnProperty(key)) {
            this.formData[key] = this.operateId.row[key]
          }
        }
      }
    })
  },
  data() {
    return {
      item: {},
      rules: {
        protAnysTittle: [
          { required: true, message: '请填写此项' },
          { max: 256, message: '不能超过256个字' }
        ],
        protAnysHtml: [
          { max: 4000, message: '不能超过4000个字' }
        ],
        protAnysZz: [
          { max: 1000, message: '不能超过1000个字' }
        ],
        protAnysChar: [
          { max: 4000, message: '不能超过4000个字' }
        ]
        // protAnysIfsId: [
        //   { required: true, message: '请填写此项' }
        // ]
      },
      formData: {
        protAnysTittle: null,
        protAnysHtml: null,
        protAnysZz: null,
        protAnysChar: null,
        protAnysIfsId: null,
        protAnysPage: '0'
      },

      visable: false,
      iFormData: {
        ifsState: '1'
      },
      iRules: {
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
      }
    }
  },
  methods: {
    add() {
      this.iFormData = {
        ifsState: '1'
      }
      this.visable = true
    },
    saveCurrent(callback) {
      if (!this.formData.protAnysHtml && !this.formData.protAnysZz && !this.formData.protAnysChar && (!this.formData.protAnysIfsId && this.formData.protAnysIfsId !== 0)) {
        this.$message.warning('请填写至少一个解析规则')
        return
      }
      this.$refs.updateFrom.validate((valid) => {
        if (valid) {
          this.formData.protAnysIfsName = this.item[this.formData.protAnysIfsId] || null
          this.formData.protAnysType = this.protAnysType
          if (this.protAnysType === '1') {
            delete this.formData.protAnysPage
          }
          callback && callback(this.formData)
        } else {
          return false
        }
      })
    },
    getOptions() {
      baseRequest('/confIfs/getConfIfsSelect').then(response => {
        this.item = response.data.item
      })
    },
    save() {
      saveUpdate('/confIfs/add', this.iFormData, this.iRules, this.$refs.iUpdateFrom).then(() => {
        this.visable = false
        this.$Message.success('操作成功')
        this.getOptions()
      })
    }
  }
}
</script>
