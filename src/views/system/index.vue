/*
 * @Author: lk 
 * @Date: 2020-02-26 15:49:17 
 * @Last Modified by: lk
 * @Last Modified time: 2020-03-11 09:55:35
 * @Description:  系统管理
 */
<template>
    <div class="system" :style="{height:height}" v-loading="loading" element-loading-text="加载中,请稍后...">
        <!-- <iframe id="iframe" src="http://39.106.123.32:8080/dataCollection/" frameborder="0" height="100%" width='100%'></iframe> -->
    </div>
</template>
<script>
export default {
  name: 'system',
  data() {
    return {
      height: 0,
      loading: false
    }
  },
  mounted() {
    this.loading = true
    this.height = document.body.offsetHeight - 115 + 'px'
    const iframe = document.getElementById('iframe')
    window.addEventListener('resize', function() {
      this.height = document.body.offsetHeight - 115 + 'px'
    }.bind(this), false)

    const watchIframe = _ => {
      window.setTimeout(_ => {
        this.loading = false
      }, 100)
      iframe.removeEventListener('load', watchIframe, true)
    }
    iframe.addEventListener('load', watchIframe, true)
  }
}
</script>
<style lang="scss" scoped>
.system{
    overflow: hidden;
    border-top:1px solid #ccc;
}
</style>
