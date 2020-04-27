/*
 * 标签对比
 */
<template>
  <div class="my_main">
    <el-table :data="tableData" style="width: 100%;" :max-height="tableHeight"
      :header-cell-style="{color:'gray', 'background-color': '#d8dadb', fontSize:'16px'}"
      :border="true" :fit="true">
      <el-table-column label="标签类型" align="center"> 
        <template slot-scope="scope">
          <div style="color: #037efa">
            <span>{{scope.row.a}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column  prop="b" label="目标文件" align="center"></el-table-column>
      <el-table-column  prop="c" label="对比公文" align="center"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableHeight: 0,
      tableData: []
    }
  },
  computed: {

  },
  mounted() {
    this.$nextTick(function() {
      this.tableHeight = document.querySelector('.app-main').offsetHeight - 156
    })
  },
  methods: {
    openDialog(source, target) {
      const table = []
      table.push({ a: '文件名称', b: source.docFileName, c: target.docFileName })
      table.push({ a: '内容体系', b: source.docContentSys, c: target.docContentSys })
      table.push({ a: '领域类型', b: source.docDomainType, c: target.docDomainType })
      table.push({ a: '文章类型', b: source.docType, c: target.docType })
      table.push({ a: '发布单位类型', b: source.issueOrgType, c: target.issueOrgType })
      table.push({ a: '定位', b: source.docPositioning, c: target.docPositioning })
      table.push({ a: '适用范围', b: source.docUseBroad, c: target.docUseBroad })
      table.push({ a: '军民融合相关度', b: source.about, c: target.about })
      table.push({ a: '可操作性', b: source.docOperability, c: target.docOperability })
      table.push({ a: '评估重点', b: source.docFocalPoint, c: target.docFocalPoint })
      table.push({ a: '军民融合领域', b: source.fuseField, c: target.fuseField })
      table.push({ a: '政策层次', b: source.docSys, c: target.docSys })

      this.tableData = table
    }
  }
}
</script>
<style scoped>
  .my_main {
    margin: 20px 50px;
    padding: 30px;
    background-color: white;
    border: 1px solid #dddddd;
  }

  .circle {
    width: 15px;      
    height: 15px;      
    background-color: #037efa;      
    border-radius: 50%;      
    -moz-border-radius: 50%;      
    -webkit-border-radius: 50%;
  }
</style>



