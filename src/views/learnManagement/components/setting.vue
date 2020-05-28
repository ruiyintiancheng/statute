<template>
    <div class="learn-setting">
        <el-form ref="form" label-width="80px">
            <el-form-item label="爬虫" v-for="(data,index) in form" :key="data+index">
                <el-select v-model="data.value" style="width:225px;">
                    <el-option v-for="(text,value) in selectOptions" :key="value" :value="value+''" :label="text"></el-option>
                </el-select>
                <el-button v-if="form.length > 1" @click="minusOption(index)" icon="el-icon-minus" plain size="small"></el-button>
                <el-button @click="addOption" v-if="index === form.length-1" icon="el-icon-plus" plain size="small"></el-button>
            </el-form-item>
            <el-form-item >
                <el-button type="primary" @click="saveHandle">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { baseRequest } from '@/api/base'
export default {
  props: {
    labelId: Number
  },
  mounted() {
    baseRequest('/confProtInfo/getStudyList').then(response => {
      this.selectOptions = response.data.item
    })
  },
  data() {
    return {
      form: [
      ],
      selectOptions: {
      }
    }
  },
  methods: {
    getData() {
      let data = []
      baseRequest('/bXuexiConfigure/selects', { labelId: this.labelId }).then(response => {
        data = response.data.item
        if (!data || data.length === 0) {
          data = ['']
        }
        this.form = data.map(item => {
          return { value: (item.protId || '') + '' }
        })
      })
    },
    saveHandle() {
      if (this.form.length <= 0) {
        return
      }
      const protIdList = []
      for (const iterator of this.form) {
        if (!iterator.value) {
          this.$message.warning('爬虫选项不能为空')
          return
        } else {
          if (protIdList.find(item => item === iterator.value)) {
            this.$message.warning('爬虫选项不能重复')
            return
          }
          protIdList.push(iterator.value)
        }
      }
      const params = {
        protIdList,
        labelId: this.labelId
      }
      baseRequest('/bXuexiConfigure/batchAdd', params).then(_ => {
        this.$message.success('操作成功')
      })
    },
    /**
       * 添加爬虫
       */
    addOption() {
      this.form.push({ value: '' })
    },
    /**
     * 删除爬虫
     */
    minusOption(index) {
      if (this.form.length <= 1) {
        return
      }
      this.form.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.learn-setting{
    width: 500px;
    margin:100px auto;
}
</style>