<template>
  <div :id="id"
       :style="{height:propsHeight,width:chartWidth}"
       :option="option"></div>
</template>
<script>
import echarts from 'echarts'
import walden from './theme/walden' // 引入theme
import { debounce } from '@/utils'
export default {
  name: 'componentsChartsCustomEcharts',
  props: {
    id: {
      type: String,
      default: 'chart'
    },
    propsWidth: {
      type: String,
      default: '100%'
    },
    propsHeight: {
      type: String,
      default: '320px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    option: Object
  },
  data() {
    return {
      chart: null,
      chartWidth: null
    }
  },
  computed: {
    marginWidth: function() {
      return this.$store.state.app.marginNavBar
    },
    dispalySideBar: function() {
      return this.$store.state.app.dispalySideBar
    }
  },
  mounted() {
    this.initChart()
    this.chart.resize()
    this.resizeFun()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHanlder)
    }

    // const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    // sidebarElm.removeEventListener('transitionend', this.__resizeHanlder)

    const codeTreeElm = document.getElementsByClassName('sidebar-card')[0]
    codeTreeElm.removeEventListener('click', this.__resizeHanlder)
    this.chart.dispose()
    this.chart = null
  },
  updated() {
    this.$nextTick(function() {
      this.initChart()
      this.chart.resize()
      this.resizeFun()
    })
  },
  activated() {
    this.chartWidth = this.propsWidth
  },
  watch: {
    propsWidth(val) {
      this.chartWidth = val
    },
    marginWidth() {
      this.__resizeHanlder()
    },
    dispalySideBar() {
      this.__resizeHanlder()
    }
  },
  methods: {
    initChart() {
      echarts.registerTheme('walden', walden)
      this.chart = echarts.init(document.getElementById(this.id), 'walden')
      this.chart.setOption(this.option)
    },
    resizeFun() {
      if (this.autoResize) {
        this.__resizeHanlder = debounce(() => {
          this.chartWidth = '100%'
          if (this.chart) {
            this.chart.resize()
          }
        }, 100)
        window.addEventListener('resize', this.__resizeHanlder)
      }

      // 监听侧边栏的变化
      // const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
      // sidebarElm.addEventListener('transitionend', this.__resizeHanlder)

      // 监听械侧树的变化
      const codeTreeElm = document.getElementsByClassName('sidebar-card')[0]
      codeTreeElm.addEventListener('click', this.__resizeHanlder)
    },
    hightLightNodes(str) {
      this.chart.dispatchAction({
        type: 'highlight',
        name: str
      })
    }
  }
}
</script>
