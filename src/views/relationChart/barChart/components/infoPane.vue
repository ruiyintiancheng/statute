/*
 * 政策列表
 */
<template>
  <el-table :data="tableData" style="width: 100%;" :height="height" :border="true" :fit="true" size='mini'>
    <el-table-column fixed type="index" width="45" label="#" align="center"></el-table-column>
    <el-table-column  prop="docName" label="政策名称" align="center"></el-table-column>
    <!-- <el-table-column width="200" label="操作" align="center" fixed="right"> 
      <template slot-scope="scope">
        <el-button type="primary" plain size="mini" @click="openInfo(scope.row)">查看原文</el-button>
      </template>
    </el-table-column> -->
  </el-table>
</template>
<script>
export default {
  props: {
    width: Number,
    height: Number
  },
  data() {
    return {
      tableData: []
    }
  },
  created() {
  },
  mounted() {
  },
  computed: {
  },
  methods: {
    setData(list) {
      let info = []
      list.forEach(d => {
        info = info.concat(d.data)
      })
      this.tableData = info
    }
  }
}
</script>
<style scoped>

</style>