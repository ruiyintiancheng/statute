/*
 * 帮助
 */
<template>
  <div class="my_main">
    <p class="title">可操作性评分帮助说明</p>
    <p>对当前要进行可操作性分析的文章，逐句进行以下可操作性性分析分值在0到100之间。</p>
    <p>一是政策主体是否明确，主要包括：发布主体、执行主体、监督主体、政策受体。</p>
    <p>二是对操作性项进行量化分析评分，主要包含：明确的单位类型、明确的数值范围、明确的工作内容、明确的检查内容等方面进行评分。</p>
    <p>逐句评分完成后，根据每句的操作性，进行综合评判，可操作性在每句的0到100分之间操作性强弱呈正态分布，分值在70左右达到最强，逐句分值进行转换获取单句的操作性评分s’。</p>
    <p>系统计算操作性总得分ss=avg(s’1,s’n);</p>
    <br/>  
    <p>综合评分公式：</p>
    <p class="retract">综合分值(S) = 系统分值(ss) * 系数(s) + 人工分值(ps) * 系数(m) + 偏移度(x)</p>
    <p>计算结果：</p>
    <p class="retract">{{synthesize}} = {{system}} * {{s}} + {{manualScore}} * {{m}} + {{x}}</p>
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
  // .my_main {
  //   margin: 20px 50px;
  //   padding: 30px 90px;
  //   background-color: white;
  //   border: 1px solid #dddddd;
  //   line-height: 1.5;
  //   p {
  //     text-indent: 2em;
  //     letter-spacing: 1px;
  //   }
  //   .retract {
  //     text-indent: 4em
  //   }
  // }

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