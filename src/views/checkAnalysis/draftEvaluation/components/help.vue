/*
 * 帮助
 */
<template>
  <div class="my_main">
    <!-- <h3 style="text-align: center;">文本评估验证帮助说明</h3> -->
    <p>对当前要进行政策评估验证分析的文章，逐句进行以下分析分值在0到100之间。</p>
    <p>一是对政策矛盾性进行泛化分析，在数据库范围内相似主体和政策目标的相关政策进行导向矛盾性分析。对比分值转换获取两篇政策矛盾性评分s’。 计算矛盾性相关评分cs =avg(s’1 * s’n / n)</p>
    <p>二是对操作性项进行量化分析评分，主要包含：明确的单位类型、明确的数值范围、明确的工作内容、明确的检查内容等方面进行评分。 逐句分值进行转换获取单句的操作性评分s’。系统计算操作性总得分ss=avg(s’1,s’n);</p>
    <p>三是对政策时效性进行量化分析，主要包括：明确的发布时间，执行时间，政策任务形式，主要指标等进行分析. 同时展示相关主要指标的评分词汇标准。</p>
    <p>综合评分公式：</p>
    <p class="retract">
      综合分值(S) = 矛盾性分值(ss) * 系数(s) + (操作性分值(s) * 系数(m) + 时效性分值(ts) * 系数(n)) * 系数(z)
    </p>
  </div>
</template>
<script>
export default {
  props: {},
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