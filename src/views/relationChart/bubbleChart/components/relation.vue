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
      options: {
        docSys: { values: [], has: null },
        fuseField: { values: [], has: null },
        timeType: { values: [], has: null }
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
        const item = response.data.item
        this.optionLabels = {
          docSys: item.docSys,
          fuseField: item.fuseField
        }
      })
    },
    handleChange(value) {
      this.onSubmit()
    },
    /**
     * 查看
     */
    onSubmit() {
      const relations = {}
      for (const key in this.options) {
        if (this.options[key].values) {
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
            flag = flag && arrayInArray(obj[key], ';', relations[key].has)
          }
          if (key === 'fuseField') {
            flag = flag && arrayInArray(obj[key], ';', relations[key].has)
          }
          if (key === 'timeType') {
            flag = flag && inArray(obj[key].toString(), relations[key].has)
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
      }
    },
    /**
     *  清空
     */
    clear() {
      this.options.docSys.values = []
      this.options.fuseField.values = []
      this.options.timeType.values = []
      this.$emit('selRelation', null)
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



