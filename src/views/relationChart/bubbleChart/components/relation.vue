/*
 * 筛选列表
 */
<template>
<div :style="{'width': `${width}px`, 'height': `${height}px`, 'overflow-y': 'auto', 'overflow-x': 'hidden'}">
  <div>
    <div class="check-group-label">政策层级:</div>
    <div class="check-group">
      <el-checkbox-group v-model="options.docSys.values" @change="handleChange">
        <el-checkbox label="政策体系1" style="width: 100%">基础政策</el-checkbox>
        <el-checkbox label="政策体系2" style="width: 100%">具体政策</el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
  <div>
    <div class="check-group-label">军民融合领域:</div>
    <div class="check-group">
      <el-checkbox-group v-model="options.fuseField.values" @change="handleChange">
        <el-checkbox style="width: 100%" label="基础设施共建共享领域"></el-checkbox>
        <el-checkbox style="width: 100%" label="国防科技工业武器装备领域"></el-checkbox>
        <el-checkbox style="width: 100%" label="军民科技协同创新领域"></el-checkbox>
        <el-checkbox style="width: 100%" label="重大安全领域"></el-checkbox>
        <el-checkbox style="width: 100%" label="军地人力资源开发领域"></el-checkbox>
        <el-checkbox style="width: 100%" label="军队保障社会化领域"></el-checkbox>
        <el-checkbox style="width: 100%" label="统筹应急应战公共安全领域"></el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
  <div>
    <div class="check-group-label">二级领域:</div>
    <div class="check-group">
      <el-checkbox-group v-model="options.docContentSys.values" @change="handleChange">
        <!-- <el-checkbox style="width: 100%" label="强相关"></el-checkbox>
        <el-checkbox style="width: 100%" label="有所涉及"></el-checkbox>
        <el-checkbox style="width: 100%" label="不相关"></el-checkbox>
        <el-checkbox style="width: 100%" label="空白"></el-checkbox> -->
      </el-checkbox-group>
    </div>
  </div>
  <div>
    <div class="check-group-label">发布时间:</div>
    <div class="check-group">
      <el-checkbox-group v-model="options.timeType.values" @change="handleChange">
        <el-checkbox style="width: 100%" label=1>0-3年</el-checkbox>
        <el-checkbox style="width: 100%" label=2>3-5年</el-checkbox>
        <el-checkbox style="width: 100%" label=3>5-10年</el-checkbox>
        <el-checkbox style="width: 100%" label=4>10年以前</el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
  <div style="margin-top: 10px; margin-left: 30px">
    <el-button size='small' @click="clear" style="width: 200px">清空</el-button>
  </div>
</div>
</template>
<script>
// import { baseRequest } from '@/api/base'
export default {
  props: {
    width: Number,
    height: Number
  },
  data() {
    return {
      mainVisible: false,
      options: {
        docSys: { type: 'array', values: [] },
        fuseField: { type: 'array', values: [] },
        docContentSys: { type: 'array', values: [] },
        timeType: { type: 'array', valueType: 'number', values: [] }
      }
    }
  },
  created() {

  },
  mounted() {
    this.$nextTick(() => {
      this.getOption()
    })
  },
  computed: {
    tableHeight() {
      return document.querySelector('.dialog-contant-default.file-download-log.relation').offsetHeight - 30
    }
  },
  methods: {
    getOption() {
      // console.log('getOption')
      // const params = { 'pid': '0' }
      // baseRequest('/confMci/getMciOption', params).then(response => {
      // // console.log(response.data.item)
      // })
    },
    handleChange(value) {
      // console.log('change', value)
      this.onSubmit()
    },
    /**
     * 查看
     */
    onSubmit() {
      const relations = {}
      for (const key in this.options) {
        if (this.options[key].type === 'array') {
          const values = this.options[key].values
          if (values && values.length > 0) {
            relations[key] = this.options[key]
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
          const d = relations[key]
          if (obj.hasOwnProperty(key)) {
            if (d.type === 'array') {
              flag = flag && array(obj[key], d.values, d.valueType)
            }

            if (d.type === 'date') {
              flag = flag && date(obj[key], d.max, d.min)
            }
          }
        }
        return flag

        function array(value, arrays, valueType) {
          let isSel = false
          arrays.forEach(v => {
            if (value === conversion(v, valueType)) {
              isSel = true
            }
          })
          return isSel
        }
        function date(value, max, min) {
          const time = new Date(value)
          let isSel = true
          if (max && max !== '') {
            isSel = isSel && time <= max
          }
          if (min && min !== '') {
            isSel = isSel && time >= min
          }
          return isSel
        }
        function conversion(value, valueType) {
          if (valueType === 'number') {
            return parseInt(value)
          }
          return value
        }
      }
    },
    /**
     *  清空
     */
    clear() {
      this.options.docSys.values = []
      this.options.fuseField.values = []
      this.options.docContentSys.values = []
      this.options.timeType.values = []
      this.$emit('selRelation', null)
    }
  }
}
</script>
<style scoped>
  .check-group-label {
    padding: 5px;
  }
  .check-group {
    margin-left: 35px;
  }
</style>



