/*
 * 筛选列表
 */
<template>
  <el-dialog title="筛选列表" width="50%" custom-class="dialog-default"
      :visible.sync="mainVisible" 
      :close-on-click-modal='false' 
      append-to-body
      v-el-drag-dialog>
    <div class="dialog-contant-default file-download-log relation">
        <el-form ref="form" label-width="160px">
          <el-form-item label="政策层次:">
            <el-checkbox-group v-model="options.docSys.values" >
              <el-checkbox v-for="(value, key, index) in optionLabels.docSys"
                          :key="index"
                          :label="value"
                          :value="value">
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="适用范围:">
            <el-checkbox-group v-model="options.docUseBroad.values" >
              <el-checkbox v-for="(value, key, index) in optionLabels.docUseBroad"
                          :key="index"
                          :label="value"
                          :value="value">
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="军民融合相关度:">
            <el-checkbox-group v-model="options.docAbout.values" >
              <el-checkbox v-for="(value, key, index) in optionLabels.docAbout"
                          :key="index"
                          :label="value"
                          :value="value">
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="可操作性:">
            <el-checkbox-group v-model="options.docOperability.values" >
              <el-checkbox v-for="(value, key, index) in optionLabels.docOperability"
                          :key="index"
                          :label="value"
                          :value="value">
              </el-checkbox>
            </el-checkbox-group>  
          </el-form-item>

          <el-form-item label="公文类型:">
            <el-checkbox-group v-model="options.docType.values" >
              <el-checkbox v-for="(value, key, index) in optionLabels.docType"
                          :key="index"
                          :label="value"
                          :value="value">
              </el-checkbox>
            </el-checkbox-group>  
          </el-form-item>

          <el-form-item label="军民融合领域:">
            <el-checkbox-group v-model="options.docFuseField.values" >
              <el-checkbox v-for="(value, key, index) in optionLabels.docFuseField"
                          :key="index"
                          :label="value"
                          :value="value">
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="发布时间:">
            <el-date-picker v-model="options.docIssueTime.min" 
              type="date" placeholder="起始日期" size="small">
            </el-date-picker>
            —
            <el-date-picker v-model="options.docIssueTime.max"
              type="date" placeholder="截至日期" size="small">
            </el-date-picker>
          </el-form-item>
        </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit">查看</el-button>
      <el-button type="primary" @click="clear">清空</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { baseSearch } from '@/api/base'
export default {
  data() {
    return {
      mainVisible: false,
      options: {
        docSys: { values: [], has: null },
        docUseBroad: { values: [], has: null },
        docAbout: { values: [], has: null },
        docOperability: { values: [], has: null },
        docType: { values: [], has: null },
        docFuseField: { values: [], has: null },
        docIssueTime: { min: '', max: '' }
      },
      optionLabels: {
        docSys: {},
        docUseBroad: {},
        docAbout: {},
        docOperability: {},
        docType: {},
        docFuseField: {}
      }
    }
  },
  computed: {
    tableHeight() {
      return document.querySelector('.dialog-contant-default.file-download-log.relation').offsetHeight - 30
    }
  },
  created() {},
  mounted() {
    this.loadOption()
  },
  methods: {
    loadOption() {
      // 政策层次:AA-012000000000000000-0001
      // 适用范围:AA-006000000000000000-0001
      // 军民融合相关度:AA-008000000000000000-0001
      // 可操作性:AA-009000000000000000-0001
      // 公文类型:AA-003000000000000000-0001
      // 军民融合领域:AA-011000000000000000-0001
      const param = {
        fCodeId: 'AA-012000000000000000-0001,AA-006000000000000000-0001,AA-008000000000000000-0001,' +
         'AA-009000000000000000-0001,AA-003000000000000000-0001,AA-011000000000000000-0001,' +
         'AA-010000000000000000-0001'
      }
      baseSearch('/bCode/getOptionByFCodeId', param).then(response => {
        const item = response.data.item
        this.optionLabels = {
          docSys: item.docSys,
          docUseBroad: item.docUseBroad,
          docAbout: item.about,
          docOperability: item.docOperability,
          docType: item.docType,
          docFuseField: item.fuseField
        }
        // console.log(this.optionLabels)
      })
    },
    openDialog() {
      this.mainVisible = true
    },
    /**
     * 查看
     */
    onSubmit() {
      const relations = {}
      for (const key in this.options) {
        if (this.options[key].value) {
          const values = this.options[key].values
          if (values && values.length > 0) {
            relations[key] = this.options[key]
            relations[key].has = new Set(this.options[key].values)
          }
        } else {
          relations[key] = this.options[key]
        }
      }

      this.$emit('selRelation', check)
      this.mainVisible = false

      function check(obj) {
        let flag = true
        for (const key in relations) {
          if (key === 'docSys') {
            // flag = flag && inArray(obj[key], relations[key].has)
            flag = flag && arrayInArray(obj[key], ';', relations[key].has)
          }
          if (key === 'docUseBroad') {
            flag = flag && arrayInArray(obj[key], ';', relations[key].has)
          }
          if (key === 'docAbout') {
            flag = flag && arrayInArray(obj[key], ';', relations[key].has)
          }
          if (key === 'docOperability') {
            flag = flag && arrayInArray(obj[key], ';', relations[key].has)
          }
          if (key === 'docType') {
            flag = flag && arrayInArray(obj[key], ';', relations[key].has)
          }
          if (key === 'docFuseField') {
            flag = flag && arrayInArray(obj[key], ';', relations[key].has)
          }
          if (key === 'docIssueTime') {
            flag = flag && inData(obj[key], [relations[key].min, relations[key].max])
          }
        }

        return flag

        // function inArray(value, set) {
        //   return set.has(value)
        // }
        function arrayInArray(value, separator, set) {
          if (value === null) {
            return false
          }
          const newArray = value.split(separator)
          let isSel = false
          newArray.forEach(v => {
            if (set.has(v)) {
              isSel = true
            }
          })
          return isSel
        }
        function inData(value, times) {
          const time = new Date(value)
          let isSel = true
          if (times[1] && time[1] !== '') {
            isSel = isSel && time <= time[1]
          }
          if (time[0] && time[0] !== '') {
            isSel = isSel && time >= time[0]
          }
          return isSel
        }
      }
    },
    /**
     *  清空
     */
    clear() {
      this.options.docSys.values = []
      this.options.docUseBroad.values = []
      this.options.docAbout.values = []
      this.options.docOperability.values = []
      this.options.docType.values = []
      this.options.docFuseField.values = []
      this.options.docIssueTime.values = []
      this.$emit('selRelation', null)
    }
  }
}
</script>
<style scoped>

</style>