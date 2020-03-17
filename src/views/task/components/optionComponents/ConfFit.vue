/*
 * @Author: lk 
 * @Date: 2020-03-02 09:42:50 
 * @Last Modified by: lk
 * @Last Modified time: 2020-03-09 16:18:23
 * @Description:  不跟踪HTML
 */
 <template>
    <div>
      <el-form :rules="rules"
                class="baseUpdate-form"
                ref="updateFrom"
                style="margin-left: calc(50% - 230px)"
                :model="updateFormData"
                label-width="120px">
        <el-form-item prop="confFit"
                    label="新增HTML">
            <el-select class="form-input" style="width:255px;"
            v-model="updateFormData.confFit"
            clearable>
                <el-option v-for="(text,value) in item" :key="value" :value="value" :label="text"></el-option>        
            </el-select>
        </el-form-item>
      </el-form>
    </div>
 </template>
 
<script>
import { baseRequest } from '@/api/base'
export default {
  props: {
    operateId: [Number, String],
    operateStatus: Number
  },
  mounted() {
    baseRequest('/confProtFilt/getProtFiltSelect').then(response => {
      this.item = response.data.item
      if (this.operateStatus === 2) {
        this.updateFormData.confFit = this.operateId + ''
      }
    })
  },
  data() {
    return {
      rules: {
        confFit: [
          { required: true, message: '请选择此项' }
        ]
      },
      updateFormData: {
        confFit: null
      },
      item: {}
    }
  },
  methods: {
    getOptions() {
      baseRequest('/confProtFilt/getProtFiltSelect').then(response => {
        this.item = response.data.item
      })
    },
    saveCurrent(callback) {
      this.$refs.updateFrom.validate((valid) => {
        if (valid) {
          callback && callback({ protFiltId: this.updateFormData.confFit, protFilt: this.item[this.updateFormData.confFit] })
        } else {
          return false
        }
      })
    }
  }
}
</script>
