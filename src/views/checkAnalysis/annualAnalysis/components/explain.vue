/*
 * 帮助文档
 */
<template>
<div class="expain-contant">
  <p class="explain-item">
    1.图形中坐标系为右手坐标系，水平方向表示x轴，垂直方向表示y轴，斜向表示z轴
  </p>
  <p class="explain-item">
    2.x轴表示政策发布年份，y轴表示发布数量，z轴表示是否属于新形式新任务
  </p>
  <p class="explain-item">
    3.鼠标左键交互图形旋转，鼠标滚轮放大缩进图形，鼠标右键平移图形
  </p>
  <p class="explain-item">
    4.点击立方体可以查看‘政策列表’
  </p>
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
<style lang="scss" scoped>
.expain-contant{
  padding: 15px 10px;
  color:#666;
  .explain-item{
    padding: 10px 0;
    line-height: 30px;
    font-size: 15px;
    font-weight: 600;
  }
}
</style>