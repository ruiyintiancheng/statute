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
          <el-form-item label="定位:">
            <el-checkbox-group v-model="options.docPositioning.values" >
              <el-checkbox label="具体操作"></el-checkbox>
              <el-checkbox label="指导原则"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="适用范围:">
            <el-checkbox-group v-model="options.docUseBroad.values" >
              <el-checkbox label="全国"></el-checkbox>
              <el-checkbox label="地方"></el-checkbox>
              <el-checkbox label="部门"></el-checkbox>
              <el-checkbox label="军队"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="军民融合相关度:">
            <el-checkbox-group v-model="options.docAbout.values" >
              <el-checkbox label="强相关"></el-checkbox>
              <el-checkbox label="有所涉及"></el-checkbox>
              <el-checkbox label="不相关"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="可操作性:">
            <el-checkbox-group v-model="options.docOperability.values" >
              <el-checkbox label="强"></el-checkbox>
              <el-checkbox label="弱"></el-checkbox>
              <el-checkbox label="其他"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="文章类型:">
            <el-checkbox-group v-model="options.docType.values" >
              <el-checkbox label="法律法规"></el-checkbox>
              <el-checkbox label="法律修订"></el-checkbox>
              <el-checkbox label="通知公告"></el-checkbox>
              <el-checkbox label="网络舆情"></el-checkbox>
              <el-checkbox label="意见征求"></el-checkbox>
              <el-checkbox label="招标信息"></el-checkbox>
              <el-checkbox label="政策文件"></el-checkbox>
              <el-checkbox label="政策修订"></el-checkbox>
              <el-checkbox label="专家解读"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="评估重点:">
            <el-checkbox-group v-model="options.docFocalPoint.values" >
              <el-checkbox label="参考法律法规"></el-checkbox>
              <el-checkbox label="基本法律法规"></el-checkbox>
              <el-checkbox label="军地数据资源交换共享"></el-checkbox>
              <el-checkbox label="军地指挥信息系统互联互通"></el-checkbox>
              <el-checkbox label="网络安全联防联控"></el-checkbox>
              <el-checkbox label="信息基础设施共建共用"></el-checkbox>
              <el-checkbox label="其他"></el-checkbox>
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
export default {
  data() {
    return {
      mainVisible: false,
      options: {
        docPositioning: { values: [], has: null },
        docUseBroad: { values: [], has: null },
        docAbout: { values: [], has: null },
        docOperability: { values: [], has: null },
        docType: { values: [], has: null },
        docFocalPoint: { values: [], has: null },
        docIssueTime: { min: '', max: '' }
      }
    }
  },
  created() {
  },
  computed: {
    tableHeight() {
      return document.querySelector('.dialog-contant-default.file-download-log.relation').offsetHeight - 30
    }
  },
  methods: {
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
          if (key === 'docPositioning') {
            flag = flag && inArray(obj[key], relations[key].has)
          }
          if (key === 'docUseBroad') {
            flag = flag && arrayInArray(obj[key], ';', relations[key].has)
          }
          if (key === 'docAbout') {
            flag = flag && inArray(obj[key], relations[key].has)
          }
          if (key === 'docOperability') {
            flag = flag && inArray(obj[key], relations[key].has)
          }
          if (key === 'docType') {
            flag = flag && inArray(obj[key], relations[key].has)
          }
          if (key === 'docFocalPoint') {
            flag = flag && inArray(obj[key], relations[key].has)
          }
          if (key === 'docIssueTime') {
            flag = flag && inData(obj[key], [relations[key].min, relations[key].max])
          }
        }

        return flag

        function inArray(value, set) {
          return set.has(value)
        }
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
      this.options.docPositioning.values = []
      this.options.docUseBroad.values = []
      this.options.docAbout.values = []
      this.options.docOperability.values = []
      this.options.docType.values = []
      this.options.docFocalPoint.values = []
      this.options.docIssueTime.values = []
      this.$emit('selRelation', null)
    }
  }
}
</script>
<style scoped>

</style>