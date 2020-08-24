<template>
  <div class="my_main">
    <h3 style="text-align: center;">事件仿真帮助说明</h3>
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
    margin: 20px 50px;
    padding: 30px 90px;
    background-color: white;
    border: 1px solid #dddddd;
    line-height: 1.5;
    
    p {
      text-indent: 2em;
      letter-spacing: 1px;
    }
    .retract {
      text-indent: 4em
    }
  }
</style>