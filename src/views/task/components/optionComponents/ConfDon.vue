/*
 * @Author: lk 
 * @Date: 2020-03-02 09:42:50 
 * @Last Modified by: lk
 * @Last Modified time: 2020-03-02 16:28:52
 * @Description:  其他下载
 */
 <template>
    <div>
      <el-form :rules="iRules"
              class="baseUpdate-form"
              ref="iUpdateFrom"
              style="margin-left: calc(50% - 200px)"
              :model="iFormData"
              label-width="120px">
            <el-form-item prop="protDonType"
                        label="类别:">
              <el-input class="form-input"
                        style="width:200px"
                        v-model.trim="iFormData.protDonType"
                        clearable></el-input>
            </el-form-item>
            <el-form-item prop="protDonFileType"
                          label="文件类型:">
              <el-input class="form-input"
                        style="width:200px"
                        v-model.trim="iFormData.protDonFileType"
                        clearable></el-input>
            </el-form-item>
            <el-form-item prop="protDonMax"
                          label="最大:">
              <el-input-number style="width:200px;" v-model="iFormData.protDonMax"  :min="1"  ></el-input-number>&nbsp;&nbsp;KB
            </el-form-item>
            <el-form-item prop="protDonMin"
                          label="最小:">
              <el-input-number style="width:200px;" v-model="iFormData.protDonMin"  :min="1"  ></el-input-number>&nbsp;&nbsp;KB
            </el-form-item>
        </el-form>
    </div>
 </template>
 
<script>
export default {
  props: {
    operateId: [Number, String, Object],
    operateStatus: Number
  },
  mounted() {
    if (this.operateStatus === 2) {
      for (const key in this.operateId.row) {
        if (this.iFormData.hasOwnProperty(key)) {
          this.iFormData[key] = this.operateId.row[key]
        }
      }
    }
  },
  data() {
    return {
      iRules: {
        protDonType: [
          { required: true, message: '请填写此项' },
          { max: 256, message: '不能超过256个字' }
        ],
        protDonFileType: [
          { required: true, message: '请填写此项' },
          { max: 1024, message: '不能超过1024个字' }
        ],
        protDonMax: [
          { required: true, message: '请填写此项' },
          { validator: (rule, value, callback) => {
            if (value >= this.iFormData.protDonMin) {
              callback()
            } else {
              callback(new Error('不能小于最小值'))
            }
          } }
        ],
        protDonMin: [
          { required: true, message: '请填写此项' },
          { validator: (rule, value, callback) => {
            if (value <= this.iFormData.protDonMax) {
              callback()
            } else {
              callback(new Error('不能大于最大值'))
            }
          } }
        ]
      },
      iFormData: {
        protDonType: null,
        protDonFileType: null,
        protDonMax: 2048,
        protDonMin: 0
      }
    }
  },
  methods: {
    add() {
      this.iFormData = {
        sysState: '1'
      }
      this.visable = true
    },
    saveCurrent(callback) {
      this.$refs.iUpdateFrom.validate((valid) => {
        if (valid) {
          callback && callback(this.iFormData)
        } else {
          return false
        }
      })
    }
  }
}
</script>
