/*
 * 帮助文档
 */
<template>
<div class="expain-contant">
  <p class="explain-item">
    1. 鼠标左键点击节点，弹出当前节点的政策列表
  </p>
  <p class="explain-item">
    2. 鼠标左右拖动画布，可以查看更多数据
  </p>
  <p class="explain-item">
    3. 图形中，横坐标表示政策发布时间，纵坐标表示政策发布数量
  </p>
  <!-- <p class="explain-item">
    4. 点击切换按钮，按照年或月分布统计政策信息
  </p> -->
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
    line-height: 30px;
    font-size: 14px;
    font-weight: 600;
  }
}
</style>