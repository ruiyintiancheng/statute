/*
 * 筛选列表
 */
<template>
<div >
  <div class="oprate-item">
    <div class="check-group-label">政策层次:</div>
    <div class="check-group">
      <el-checkbox-group v-model="options.docSys.values" @change="handleChange">
        <el-checkbox v-for="(value, key, index) in optionLabels.docSys"
                    :key="index"
                    :label="value"
                    :value="value">
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
  <div class="oprate-item">
    <div class="check-group-label">军民融合领域:</div>
    <div class="check-group">
      <el-checkbox-group v-model="options.fuseField.values" @change="handleChange">
        <el-checkbox v-for="(value, key, index) in optionLabels.fuseField"
                    :key="index"
                    :label="value"
                    :value="value"
                    style="width: 100%;margin-top:5px;">
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
  <div class="oprate-item last-oprate">
    <div class="check-group-label">发布时间:</div>
    <div class="check-group">
      <el-checkbox-group v-model="options.timeType.values" @change="handleChange">
        <el-checkbox style="width: 90px" label=1>0-3年</el-checkbox>
        <el-checkbox style="width: 90px" label=2>3-5年</el-checkbox>
        <el-checkbox style="width: 90px" label=3>5-10年</el-checkbox>
        <el-checkbox style="width: 90px" label=4>10年以前</el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
  <div class="clear-button">
    <el-button size='small' @click="clear" style="width: 236px">清空</el-button>
  </div>
</div>
</template>
<script>
import { baseSearch } from '@/api/base'
export default {
  props: {
    width: Number,
    height: Number
  },
  data() {
    return {
      mainVisible: false,
      optionState: false,
      options: {
        docSys: { values: [], has: null },
        fuseField: { values: [], has: null },
        timeType: { values: ['1', '2', '3', '4'], has: null }
      },
      optionLabels: {
        docSys: {},
        fuseField: {}
      }
    }
  },
  created() {

  },
  mounted() {
    this.loadOption()
  },
  computed: {
    tableHeight() {
      return document.querySelector('.dialog-contant-default.file-download-log.relation').offsetHeight - 30
    }
  },
  methods: {
    loadOption() {
      // 政策层次: AA-012000000000000000-0001
      // 军民融合领域: AA-011000000000000000-0001
      const param = {
        fCodeIds: 'AA-012000000000000000-0001,AA-011000000000000000-0001'
      }
      baseSearch('/bCode/getOptionByFCodeId', param).then(response => {
        this.optionState = true
        const item = response.data.item
        this.optionLabels = {
          docSys: item.docSys,
          fuseField: item.fuseField
        }
        this.selectAll()
      })
    },
    handleChange(value) {
      this.$emit('selRelation', this.getParams())
    },
    /**
     * 查看
     */
    onSubmit() {
      this.$emit('selRelation', this.getParams())
    },
    selectAll() {
      this.options.docSys.values = values(this.optionLabels.docSys)
      this.options.fuseField.values = values(this.optionLabels.fuseField)
      function values(obj) {
        const result = []
        for (const name in obj) {
          result.push(obj[name])
        }
        return result
      }
      if (this.optionState) {
        this.onSubmit()
      }
    },
    getParams() {
      const param = {}
      if (this.options.docSys.values.length > 0) {
        param.docSys = this.options.docSys.values.join(';')
      }
      if (this.options.fuseField.values.length > 0) {
        param.fuseField = this.options.fuseField.values.join(';')
      }
      if (this.options.timeType.values.length > 0) {
        param.timeType = this.options.timeType.values.join(';')
      }
      return param
    },
    quearyParams() {
      const param = {}
      if (this.options.docSys.values.length > 0) {
        param.docSys = this.options.docSys.values.join('|')
      }
      if (this.options.fuseField.values.length > 0) {
        param.fuseField = this.options.fuseField.values.join('|')
      }
      return param
    },
    /**
     *  清空
     */
    clear() {
      this.options.docSys.values = []
      this.options.fuseField.values = []
      this.options.timeType.values = []
      this.onSubmit()
      // this.$emit('selRelation', null)
    }
  }
}
</script>
<style lang="scss" scoped>
  .oprate-item{
    padding:15px 0;
    border-bottom:1px solid #dedfdf;
    &.last-oprate{
      border-bottom:none;
    }
  }
  .check-group-label {
    color:#666;
    margin-bottom:15px;
    font-weight: 600;
  }
  .clear-button{
    margin-top:15px;
    text-align: center;
  }
  // .check-group {
    // margin-left: 35px;
  // }
</style>



