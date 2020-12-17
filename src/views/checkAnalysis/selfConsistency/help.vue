/*
 * 帮助
 */
<template>
  <div class="my_main">
    <!-- <p class="title">自洽性评分帮助说明</p> -->
    <p>对两篇文章内容，逐句进行比较，寻找两句之间语义相似但不完全相同的内容进行相似性评分分析。</p>
    <p>相似性评分数值在0到100之间。</p>
    <p>自洽性评分根据相似性评分结果进行转换，首先语义相似度大于70分，自洽性分值在70-100分之间呈正态分布。通过公式转换，得出单句自洽性得分s’。</p>
    <p>系统计算自洽性总得分ss=avg(s’1,s’n)。</p>
    <br/>  
    <p>综合评分公式：</p>
    <p>综合分值(S) = 系统分值(ss) * 系数(s) + 专家评分(ps) * 系数(m) + 偏移度(x)</p>
    <p>计算结果：</p>
    <p>{{synthesize}} = {{system}} * {{s}} + {{manualScore}} * {{m}} + {{x}}</p>
  </div>
</template>
<script>
export default {
  props: {
    system: [String, Number],
    manualScore: [String, Number],
    synthesize: [String, Number],
    s: [String, Number],
    m: [String, Number],
    x: [String, Number]
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
    // padding: 30px 90px;
    background-color: white;
    // border: 1px solid #dddddd;
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