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
            <el-checkbox-group v-model="options.dinwei" >
              <el-checkbox label="具体操作"></el-checkbox>
              <el-checkbox label="指导原则"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="适用范围:">
            <el-checkbox-group v-model="options.syfw" >
              <el-checkbox label="全国"></el-checkbox>
              <el-checkbox label="地方"></el-checkbox>
              <el-checkbox label="部门"></el-checkbox>
              <el-checkbox label="军队"></el-checkbox>
              <el-checkbox label="空白"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="军民融合相关度:">
            <el-checkbox-group v-model="options.xgd" >
              <el-checkbox label="强相关"></el-checkbox>
              <el-checkbox label="有所涉及"></el-checkbox>
              <el-checkbox label="不相关"></el-checkbox>
              <el-checkbox label="空白"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="可操作性:">
            <el-checkbox-group v-model="options.kczx" >
              <el-checkbox label="强相关"></el-checkbox>
              <el-checkbox label="有所涉及"></el-checkbox>
              <el-checkbox label="不相关"></el-checkbox>
              <el-checkbox label="空白"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="文章类型:">
            <el-checkbox-group v-model="options.wzlx" >
              <el-checkbox label="法律法规"></el-checkbox>
              <el-checkbox label="法律修订"></el-checkbox>
              <el-checkbox label="通知公告"></el-checkbox>
              <el-checkbox label="网络舆情"></el-checkbox>
              <el-checkbox label="意见征求"></el-checkbox>
              <el-checkbox label="招标信息"></el-checkbox>
              <el-checkbox label="政策文件"></el-checkbox>
              <el-checkbox label="政策修订"></el-checkbox>
              <el-checkbox label="专家解读"></el-checkbox>
              <el-checkbox label="空白"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="评估重点:">
            <el-checkbox-group v-model="options.pgzd" >
              <el-checkbox label="参考法律法规"></el-checkbox>
              <el-checkbox label="基本法律法规"></el-checkbox>
              <el-checkbox label="军地数据资源交换共享"></el-checkbox>
              <el-checkbox label="军地只会信息系统互联互通"></el-checkbox>
              <el-checkbox label="网络安全联防联控"></el-checkbox>
              <el-checkbox label="信息基础设施共建共用"></el-checkbox>
              <el-checkbox label="其它"></el-checkbox>
            </el-checkbox-group>
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
      // tableHeight: 100,
      tableData: [],
      options: {
        dinwei: [],
        syfw: [],
        xgd: [],
        kczx: [],
        wzlx: [],
        pgzd: []
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
      this.$emit('selRelation', this.options)
      this.mainVisible = false
    },
    /**
     *  清空
     */
    clear() {
      for (const key in this.options) {
        this.options[key] = []
      }
      this.$emit('selRelation', this.options)
    }
  }
}
</script>
<style scoped>

</style>



