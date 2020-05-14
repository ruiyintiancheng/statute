/*  
* 时序关系图
*/
<template>
  <div id="chart_main" style="width: 100%; height:100%; position: relative">
    <div v-loading="chartLoading">
      <div id="chart" :style="{'width': `${chart_width}px`, 'height': `${chart_height}px`}"></div>
      <div id="brush"></div>
      <div id="legend"></div>
    </div>
    <!-- 选项菜单 -->
    <div class="graph-web-toolbar">
      <ul>
        <!-- <li @click="relation"><div class="text">筛选</div></li> -->
        <li @click="openNodesTable"><div class="text">政策列表</div></li>
        <li @click="openLinksTable"><div class="text">关系列表</div></li>
        <!-- <li @click="refresh"><div class="text">还原</div></li> -->
        <li @click="savePng"><div class="text">保存图片</div></li>
      </ul>
    </div>
    <!-- 鼠标悬浮提示框 -->
    <div id="title" class="title">
      <div style="min-height: 17px;">
        <div class='title-head'>发布单位: </div>
        <div class="title-content"></div>
      </div>
      <div style="min-height: 17px;">
        <div class='title-head'>发布法规: </div>
        <div class="title-content"></div>
      </div>
      <div style="min-height: 17px;">
        <div class='title-head'>发布时间: </div>
        <div class="title-content"></div>
      </div>
    </div>
    <!-- 鼠标右键菜单 -->
    <div id="contextMenu" class="contextMenu">
      <ul>
        <li @click="menuMessage">查看详情</li>
        <li @click="menuText" class='end'>查看原文</li>
      </ul>
    </div>
    <!-- 详细信息 -->
    <div v-show="messageVisible" id="message" class="message">
      <div class="message-title">
        <span class="message-title-content">详细信息</span>
        <span class="message-close" @click="messageVisible = false">×</span>
      </div>
      <el-table :data="messageData" style="width: 100%" :height=table_height>
        <el-table-column prop="name" label="名称" width="110"></el-table-column>
        <el-table-column prop="value" label="内容"></el-table-column>
      </el-table>
    </div>
    <nodes-table ref="nodesTable" @moveNode='moveNode'></nodes-table>
    <links-table ref="linksTable"></links-table>
    <!-- <relation ref="relation" @selRelation="selRelation"></relation> -->
  </div>
</template>

<script>
import { baseRequest } from '@/api/base'
import nodesTable from './components/nodesTable'
import linksTable from './components/linksTable'
// import relation from '../components/relation'
import Chart from './components/chart/index.js'
import * as d3 from 'd3'
export default {
  components: {
    nodesTable,
    linksTable
    // relation
  },
  props: {
    width: Number,
    height: Number,
    id: String,
    name: String
  },
  computed: {
    chart_width() {
      return this.width
    },
    chart_height() {
      return this.height - 30 // - 50
    },
    table_height() {
      return this.height - 41
    }
  },
  data() {
    return {
      graph: null,
      chart_data: null,
      messageData: [],
      messageVisible: false,
      chartLoading: true
    }
  },
  created() {
  },
  mounted() {
    this.$nextTick(() => {
      this.getData()
    })
  },
  methods: {
    getData() {
      const params = { id: this.id }
      // '/gVertex/getRegulatoryLevel'
      const url = process.env.CHART_API + '/chart/getRegulatoryLevel'
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
        this.chart_data = response.data.item
        this.init(this.chart_data)
        this.chartLoading = false
      }, _ => {
        this.chartLoading = false
      })
      baseRequest('/userBehaviorColl/add', {
        resourceType: '5',
        resourceId: this.id
      })
    },
    init(data) {
      const graph = new Chart.Graph({
        container: 'chart',
        width: this.chart_width,
        height: this.chart_height,
        contextMenu: 'contextMenu',
        offsetId: '#chart_main',
        nodeTitle: 'title',
        background: '#26368d' //  #04244A
      })
      graph.data(data)
      graph.render()

      // Chart.Brush.init(graph, 'brush')
      Chart.legend(graph, 'legend')
      graph.translateCenter()
      this.graph = graph
    },
    /**
     * 保存图片
     */
    savePng() {
      this.graph.savePng(`${this.name}-政策法规响应层级分析`)
    },
    /**
       * 重置
       */
    refresh() {
      this.graph.relation(null)
      Chart.Brush.moveAll()
      this.$refs.relation.clear()
    },
    /**
       * 节点定位
       */
    moveNode(node) {
      this.graph.moveCenter(node.x, node.y, 1)
    },
    /**
       * 打开节点列表
       */
    openNodesTable() {
      const nodes = this.graph.get('data').nodes
      this.$refs.nodesTable.openDialog(nodes)
    },
    /**
       * 打开关系列表
       */
    openLinksTable() {
      const links = this.graph.get('data').links
      this.$refs.linksTable.openDialog(links)
    },
    /**
       * 关系筛选
       */
    // selRelation(options) {
    //   if (this.graph) {
    //     this.graph.relation(options)
    //   }
    // },
    /**
       * 打开筛选列表
       */
    // relation() {
    //   this.$refs.relation.openDialog()
    //   // this.graph.relation({ related: ['强相关', '不相关'] })
    // },
    /**
       * 右键菜单--查看详情
       */
    menuMessage() {
      const node = this.graph.get('contextMenuNode')
      this.messageData = [
        // { name: 'id', value: node.id },
        { name: '政策法规名称', value: node.docName },
        { name: '政策原文名称', value: node.docTittle },
        { name: '政策层次', value: node.docSys },
        { name: '发布时间', value: node.docIssueTime },
        { name: '发布单位名称', value: node.docIssueOrgText },
        { name: '发布单位简称', value: node.orgAbbName },
        { name: '发布层级', value: node.orgRank },
        { name: '军民融合领域', value: node.docFuseField }
      ]
      this.messageVisible = true
      d3.select('#contextMenu').style('display', 'none')
    },
    /**
       * 右键菜单--查看引用
       */
    menuSource() {
      d3.select('#contextMenu').style('display', 'none')
    },
    /**
       * 右键菜单--查看原文
       */
    menuText() {
      const node = this.graph.get('contextMenuNode')
      window.open(node.docUri, '_blank')
    }
  }
}
</script>

<style scoped>
  @import '../components/chart.css';

  #title.title {
    position: absolute;
    display: none;
    width: 250px;
    height: auto;
    top: 200px;
    left: 50px;
    background-color: black;
    padding: 5px;
    color: white;
    letter-spacing: 2px;
    font-size: 14px;
    border-radius: 4px;
  }
  .title-head {
		float: left;
	}
	.title-content {
		margin-left: 75px;
	}
</style>
