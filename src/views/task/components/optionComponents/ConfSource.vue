/*
 * @Author: lk 
 * @Date: 2020-03-02 09:42:50 
 * @Last Modified by: lk
 * @Last Modified time: 2020-03-05 16:30:44
 * @Description:  数据源
 */
 <template>
    <div>
      <el-form :rules="rules"
              class="baseUpdate-form"
              ref="updateFrom"
              style="margin-left: calc(50% - 200px)"
              :model="formData"
              label-width="120px">
            <el-form-item prop="sourceName"
                        label="名称:">
              <el-input class="form-input"
                        style="width:200px"
                        v-model.trim="formData.sourceName"
                        clearable></el-input>
            </el-form-item>
            <el-form-item prop="sourceType"
                          label="驱动类型:">
              <el-select class="form-input" style="width:200px"
                v-model="formData.sourceType"
                >
                    <el-option  value="Mysql" label="Mysql"></el-option>        
                    <el-option  value="Oracle" label="Oracle"></el-option>        
                </el-select>
            </el-form-item>
            <el-form-item prop="sourceUrl"
                          label="连接地址:">
              <el-input class="form-input"
                        style="width:200px"
                        v-model.trim="formData.sourceUrl"
                        clearable></el-input>
            </el-form-item>
            <el-form-item prop="sourceUsername"
                          label="用户名称:">
              <el-input class="form-input"
                        style="width:200px"
                        v-model.trim="formData.sourceUsername"
                        clearable></el-input>
            </el-form-item>
            <el-form-item prop="sourcePazzword"
              label="用户密码">
              <el-input class="form-input"
                        style="width:200px"
                        @focus="formData.sourcePazzword=null"
                        v-model.trim="formData.sourcePazzword"
                        type="password"
                        clearable></el-input>
            </el-form-item>
            <el-form-item prop="sourceState"
                          label="目标状态">
                <el-radio v-model="formData.sourceState" label="1">停用</el-radio>
                <el-radio v-model="formData.sourceState" label="2">启用</el-radio>
            </el-form-item>
        </el-form>

    </div>
 </template>
 
<script>
import { saveUpdate } from '@/utils/validate'
import { deepClone } from '@/utils'
import { encode64 } from '@/utils/base64'
export default {
  props: {
    operateId: [Number, String, Object],
    operateStatus: Number
  },
  mounted() {
  },
  data() {
    return {
      item: {},
      rules: {
        sourceName: [
          { required: true, message: '请填写此项' },
          { max: 256, message: '不能超过256个字' }
        ],
        sourceType: [
          { required: true, message: '请填写此项' }
        ],
        sourceUrl: [
          { required: true, message: '请填写此项' }
          // { validator: (rule, value, callback) => {
          //   if (/(http|https|ftp):\/\/([\w.]+\/?)\S*/.test(value)) {
          //     callback()
          //   } else {
          //     callback(new Error('格式不正确'))
          //   }
          // } }
        ],
        sourceUsername: [
          { required: true, message: '请填写此项' },
          { max: 32, message: '不能超过32个字' }
        ],
        sourcePazzword: [
          { required: true, message: '请填写此项' },
          { max: 32, message: '不能超过32个字' }
        ],
        sourceState: [
          { required: true, message: '请填写此项' }
        ]
      },
      formData: {
        sourceName: null,
        sourcePazzword: null,
        sourceState: '1',
        sourceType: null,
        sourceUrl: null,
        sourceUsername: null
      }

    }
  },
  methods: {
    saveCurrent(callback) {
      const data = deepClone(this.formData)
      data.sourcePazzword = encode64(data.sourcePazzword)
      saveUpdate('/confSource/add', data, this.rules, this.$refs.updateFrom).then(() => {
        callback && callback()
      })
    }
  }
}
</script>
