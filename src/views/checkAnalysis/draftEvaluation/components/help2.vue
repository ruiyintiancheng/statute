/*
 * 帮助
 */
<template>
  <div class="my_main">
    <h3 v-if="type=== 'contradict'" style="text-align: center;">矛盾性解释说明</h3>
    <p v-if="type=== 'contradict'">对政策矛盾性进行泛化分析，在数据库范围内相似主体和政策目标的相关政策进行导向矛盾性分析。对比分值转换获取两篇政策矛盾性评分s’。 计算矛盾性相关评分cs =avg(s’1 * s’n / n)</p>

    <h3 v-if="type=== 'fraction'" style="text-align: center;">操作系解释说明</h3>
    <p v-if="type=== 'fraction'">对操作性项进行量化分析评分，主要包含：明确的单位类型、明确的数值范围、明确的工作内容、明确的检查内容等方面进行评分。 逐句分值进行转换获取单句的操作性评分s’。系统计算操作性总得分ss=avg(s’1,s’n)。</p>

    <h3 v-if="type=== 'timeliness'" style="text-align: center;">时效性解释说明</h3>
    <p v-if="type=== 'timeliness'">对政策时效性进行量化分析，主要包括：明确的发布时间，执行时间，政策任务形式，主要指标等进行分析. 同时展示相关主要指标的评分词汇标准。</p>
  </div>
</template>
<script>
export default {
  props: {
    type: String
  },
  data() {
    return {

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
    margin: 0 30px;
    background-color: white;
    line-height: 2;
    font-size: 14px;
    color: #666666;
    .title {
      font-size: 20px;
      font-weight: bold;
      color: #141414
    }
  }
</style>