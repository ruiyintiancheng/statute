/*
 * 标签对比
 */
<template>
  <div class="my_main">
    <span class="line">综合分值计算公式：</span><br/>
    <span class="line">系统分值 * 系数 + 人工分值 * 系数 + 偏移度</span>
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

  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
  .my_main {
    margin: 20px 50px;
    padding: 30px;
    background-color: white;
    border: 1px solid #dddddd;
    .line {
      line-height: 30px;
    }
    
  }
</style>



