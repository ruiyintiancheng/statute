/*
 * 筛选列表
 */
<template>
<div :style="{'width': `${width}px`, 'height': `${height}px`, 'overflow-y': 'auto'}">
  <el-row style="padding: 5px">
    <el-col :span="2"><div>1.</div></el-col>
    <el-col :span="22"><div>鼠标左键点击节点，弹出当前节点的政策列表</div></el-col>
  </el-row>
  <el-row style="padding: 5px">
    <el-col :span="2"><div>2.</div></el-col>
    <el-col :span="22"><div>鼠标左右拖动画布，可以调整时间范围</div></el-col>
  </el-row>
  <el-row style="padding: 5px">
    <el-col :span="2"><div>3.</div></el-col>
    <el-col :span="22"><div>点击切换按钮，坐标轴将按照年或月切换</div></el-col>
  </el-row>
</div>
</template>
<script>
export default {
  props: {
    width: Number,
    height: Number
  },
  data() {
    return {

    }
  },
  created() {
  },
  mounted() {
  },
  computed: {

  },
  methods: {

  }
}
</script>
<style scoped>

</style>