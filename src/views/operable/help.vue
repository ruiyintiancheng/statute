/*
 * 帮助
 */
<template>
  <div class="my_main">
    <span class="line">公式：</span><br/>
    <span class="line" style="margin-left: 2em;">综合分值 = 系统分值 * 系数 + 人工分值 * 系数 + 偏移度</span><br/>
    <span class="line">计算结果：</span><br/>
    <span class="line" style="margin-left: 2em;">{{synthesize}} = {{system}} * {{s}} + {{manualScore}} * {{m}} + {{x}}</span>
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
    margin: 20px 50px;
    padding: 30px;
    background-color: white;
    border: 1px solid #dddddd;
    .line {
      line-height: 30px;
    }
    
  }
</style>



