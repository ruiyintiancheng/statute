/*
 * 帮助文档
 */
<template>
<div :style="{'width': `${width}px`, 'height': `${height}px`, 'overflow-y': 'auto'}">
  <el-row style="padding: 5px">
    <el-col :span="2"><div>1.</div></el-col>
    <el-col :span="22"><div>鼠标左键点击节点，弹出当前节点的政策列表</div></el-col>
  </el-row>
  <el-row style="padding: 5px">
    <el-col :span="2"><div>2.</div></el-col>
    <el-col :span="22"><div>鼠标左右拖动画布，可以查看更多数据</div></el-col>
  </el-row>
  <el-row style="padding: 5px">
    <el-col :span="2"><div>3.</div></el-col>
    <el-col :span="22"><div>图形中，横坐标表示政策发布时间，纵坐标表示政策发布数量</div></el-col>
  </el-row>
    <el-row style="padding: 5px">
    <el-col :span="2"><div>4.</div></el-col>
    <el-col :span="22"><div>点击切换按钮，按照年或月分布统计政策信息</div></el-col>
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