/*  
* 时序关系图
*/
<template>
  <div id="chart_main" style="
    position: absolute;
    visibility: hidden;
    top: 50%;
    left: 0;">
    <div style="width: 10px; height: 10px">
      <div id="chart" :style="{'width': `${chart_width}px`, 'height': `${chart_height}px`}"></div>
    </div>
  </div>  
</template>

<script>
import { baseRequest } from '@/api/base'
import Chart from '../lawsRelationChart/components/chart/index.js'
import { handleData } from '../lawsRelationChart/components/data.js'

export default {
  components: {},
  props: {},
  computed: {
    chart_width() {
      return this.width
    },
    chart_height() {
      return this.height - 50 // - 50
    },
    table_height() {
      return this.height - 41
    }
  },
  data() {
    return {
      id: '',
      width: 10,
      height: 10,
      name: '关于请组织推荐全国循环经济工作先进单位的通知(发改办环资[2011]3171号)',

      graph: null,
      chart_data: null,

      chartLoading: true,

      shearState: false
    }
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * 加载图
     * id: 节点id
     * callback(ids, png) id: 剪枝后节点列表 png: base64编码的图片字符串
     */
    getData(id, callback) {
      this.id = id
      console.log('getData')
      document.getElementById('chart').innerHTML = ''
      const params = { id: this.id }
      const url = process.env.CHART_API + '/chart/selectLegalAssAnalysis'

      baseRequest(url, params).then(response => {
        response.data.item.nodes.forEach(d => {
          d.id += ''
          if (d.id === (this.id + '')) {
            d.queryNode = true
          }
        })
        response.data.item.links.forEach(d => {
          d.source += ''
          d.target += ''
        })
        handleData(response.data.item, this.id)
        this.chart_data = response.data.item

        this.init(this.chart_data, callback)
      })
    },
    init(data, callback) {
      const graph = new Chart.Graph({
        container: 'chart',
        width: this.chart_width,
        height: this.chart_height,
        contextMenu: 'contextMenu',
        offsetId: '#chart_main',
        background: '#F9FAFF'
      })
      graph.data(data)
      graph.render()

      this.graph = graph
      this.$nextTick(() => {
        this.graph.shear(true)
        this.savePng(callback)
      })
    },
    /**
     * 保存图片
     */
    savePng(callback) {
      // this.graph.savePng(`${this.name}-政策法规关联分析`)
      const padding = 50

      var svg = this.graph.get('svg')
      const g = this.graph.get('g')
      const bg = g.node().getBBox()
      const csvg = svg.clone(true)

      const width = bg.width + 2 * padding
      const height = bg.height + 2 * padding

      csvg.select('g.group').attr('transform', `translate(${padding - bg.x}, ${padding - bg.y})scale(1)`)

      var serializer = new XMLSerializer()
      var source = serializer.serializeToString(csvg.node())
      source = '<?xml version="1.0" standalone="no"?>\r\n' + source
      var image = new Image()
      image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source)
      image.width = width
      image.height = height

      var canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      var context = canvas.getContext('2d')

      csvg.remove()

      image.onload = () => {
        context.drawImage(image, 0, 0)
        let pic = canvas.toDataURL('image/png')
        pic = pic.replace(/^data:image\/(png|jpg);base64,/, '')

        const ids = []
        const nodes = this.graph.get('data').nodes
        nodes.forEach(d => {
          if (d.isShow) {
            ids.push(d.id)
          }
        })
        callback(ids, pic)

        var a = document.createElement('a')
        a.download = 'png'
        a.href = canvas.toDataURL('image/png')
        a.click()
      }
    }
  }
}
</script>
<style scoped>
  @import '../components/chart.css';
</style>
<style lang="scss" scoped>
  #chart {
    border: 1px solid #ccc;
  }
</style>
