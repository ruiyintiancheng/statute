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
        docIssueTime: { min: new Date('1945-10-1'), max: new Date() }
      },
      optionLabels: {
        docSys: {},
        docUseBroad: {},
        docAbout: {},
        docOperability: {},
        docType: {},
        docFuseField: {}
      },
      temp_options: {
        docSys: [],
        docUseBroad: [],
        docAbout: [],
        docOperability: [],
        docType: [],
        docFuseField: [],
        docIssueTime: []
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
        fCodeIds: 'AA-012000000000000000-0001,AA-006000000000000000-0001,AA-008000000000000000-0001,' +
         'AA-009000000000000000-0001,AA-003000000000000000-0001,AA-011000000000000000-0001'
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
        this.selectAll()
      })
    },
    openDialog() {
      this.options.docSys.values = this.temp_options.docSys
      this.options.docUseBroad.values = this.temp_options.docUseBroad
      this.options.docAbout.values = this.temp_options.docAbout
      this.options.docOperability.values = this.temp_options.docOperability
      this.options.docType.values = this.temp_options.docType
      this.options.docFuseField.values = this.temp_options.docFuseField
      this.options.docIssueTime = this.temp_options.docIssueTime

      this.mainVisible = true
    },
    /**
     * 查看
     */
    onSubmit() {
      this.temp_options.docSys = this.options.docSys.values
      this.temp_options.docUseBroad = this.options.docUseBroad.values
      this.temp_options.docAbout = this.options.docAbout.values
      this.temp_options.docOperability = this.options.docOperability.values
      this.temp_options.docType = this.options.docType.values
      this.temp_options.docFuseField = this.options.docFuseField.values
      this.temp_options.docIssueTime = this.options.docIssueTime

      const relations = {}
      for (const key in this.options) {
        relations[key] = this.options[key]
        if (this.options[key].values) {
          relations[key].has = new Set(this.options[key].values)
        }
      }

      // console.log(relations)
      this.$emit('selRelation', check)
      this.mainVisible = false

      function check(obj) {
        obj.doc
        let flag = true
        for (const key in relations) {
          if (key === 'docSys') {
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
            const min = relations[key].min
            const max = relations[key].max
            flag = flag && inData(obj[key], [min, max])
          }
        }

        return flag

        // function inArray(value, set) {
        //   return set.has(value)
        // }
        function arrayInArray(value, separator, set) {
          if (value === null || value === '' || value === 'null') {
            value = '其他'
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
          if (!value) {
            value = new Date('1945-10-1')
          }
          const time = new Date(value)
          let isSel = true
          if (times[1] && times[1] !== '') {
            isSel = isSel && time <= times[1]
          }
          if (times[0] && times[0] !== '') {
            isSel = isSel && time >= times[0]
          }
          return isSel
        }
      }
    },
    selectAll() {
      this.options.docSys.values = values(this.optionLabels.docSys)
      this.options.docUseBroad.values = values(this.optionLabels.docUseBroad)
      this.options.docAbout.values = values(this.optionLabels.docAbout)
      this.options.docOperability.values = values(this.optionLabels.docOperability)
      this.options.docType.values = values(this.optionLabels.docType)
      this.options.docFuseField.values = values(this.optionLabels.docFuseField)
      this.options.docIssueTime = { min: new Date('1945-10-1'), max: new Date() }

      function values(obj) {
        const result = []
        for (const name in obj) {
          result.push(obj[name])
        }
        return result
      }
      this.onSubmit()
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
      this.options.docIssueTime = { min: null, max: null }
      // this.$emit('selRelation', null)
    }
  }
}
</script>
<style scoped>

</style>