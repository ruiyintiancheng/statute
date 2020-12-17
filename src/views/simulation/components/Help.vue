/*
 * 帮助
 */
<template>
  <div class="my_main">
    <!-- <p class="title">事件仿真帮助说明</p> -->
    <p>可输入重大事件关键词查询库内政策情况。默认为输入关键词后，根据自然语言规则创建默认关键词词组进行搜索展示。</p>
    <p>用户可建立定制化的重大事件与关键词的关系词组。根据个人搜索习惯展示将会完善自然语言规则模型。</p>
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