/*
 * @Author: lk 
 * @Date: 2020-02-26 15:49:17 
 * @Last Modified by: lk
 * @Last Modified time: 2020-03-10 11:16:21
 * @Description:  系统管理
 */
<template>
    <div class="system" :style="{height:height}">
        <iframe src="http://39.106.123.32:8080/dataCollection/" frameborder="0" height="100%" width='100%'></iframe>
    </div>
</template>
<script>
export default {
  name: 'system',
  data() {
    return {
      height: 0
    }
  },
  mounted() {
    this.height = document.body.offsetHeight - 115 + 'px'
  }
}
</script>
<style lang="scss" scoped>
.system{
    overflow: hidden;
    border-top:1px solid #ccc;
}
</style>
