/*  
* 树关系图
*/
<template>
  <div style="width: 100%; height:100%; position: relative">
    <div>
        <div id="chart" :style="{'width': `${chart_width}px`, 'height': `${chart_height}px`}"></div>      
        <div id='brush'></div>
        <div id="legend"></div>
    </div>
    <div class="graph-web-toolbar" style="display: none">
      <ul>
        <li @click="refresh"><div class="text">重置</div></li>
        <li @click="relation"><div class="text">筛选</div></li>
        <li @click="openNodesTable"><div class="text">顶点列表</div></li>
        <li @click="openLinksTable"><div class="text">关系列表</div></li>
      </ul>
    </div>
    <div id="contextMenu" class="contextMenu">
      <ul>
        <li @click="menuMessage">查看详情</li>
        <li @click="menuSource">查看引用</li>
        <li @click="menuText">查看原文</li>
      </ul>
    </div>
    <div v-show="messageVisible" id="message" class="message">
      <div class="message-title">
        <span class="message-title-content">详细信息</span>
        <span class="message-close" @click="messageVisible = false">×</span>
      </div>
      <el-table :data="messageData" style="width: 100%" height=300>
        <el-table-column prop="name" label="名称" width="180"></el-table-column>
        <el-table-column prop="value" label="内容"></el-table-column>
      </el-table>
    </div>
    <nodes-table ref="nodesTable" @moveNode='moveNode'></nodes-table>
    <links-table ref="linksTable"></links-table>
    <relation ref="relation" @selRelation="selRelation"></relation>
  </div>
</template>

<script>
import { baseRequest } from '@/api/base'
import nodesTable from './components/nodesTable'
import linksTable from './components/linksTable'
import relation from './components/relation'
import Chart from './components/chart/index.js'
// import json from './components/data.json'
import * as d3 from 'd3'
export default {
  components: {
    nodesTable,
    linksTable,
    relation
  },
  props: {
    width: Number,
    height: Number,
    id: Number
  },
  computed: {
    chart_width() {
      return this.width
    },
    chart_height() {
      return this.height
    }
  },
  data() {
    return {
      graph: null,
      chart_data: null,
      messageData: [],
      messageVisible: false
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
      baseRequest('/gVertex/getRegulatoryLevel', params).then(response => {
        this.chart_data = response.data.item
        this.init(this.chart_data)
      }, _ => {
      })
    },
    init(data) {
      const graph = new Chart.Graph({
        container: 'chart',
        width: this.chart_width,
        height: this.chart_height
        // contextMenu: 'contextMenu'
      })
      graph.data(data)
      graph.render()

      // Chart.legend(graph, 'legend')
      this.graph = graph
      this.$nextTick(() => {
        // graph.moveCenter(-this.chart_width / 3, -15, 1)
        graph.moveCenter(-(this.chart_width - this.chart_height) / 2, -50, 1)
      })
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
      const nodes = this.graph.get('nodes')
      this.$refs.nodesTable.openDialog(nodes)
    },
    /**
       * 打开关系列表
       */
    openLinksTable() {
      const links = this.graph.get('links')
      this.$refs.linksTable.openDialog(links)
    },
    /**
       * 关系筛选
       */
    selRelation(options) {
      this.graph.relation(options)
    },
    /**
       * 打开筛选列表
       */
    relation() {
      this.$refs.relation.openDialog()
      // this.graph.relation({ related: ['强相关', '不相关'] })
    },
    /**
       * 右键菜单--查看详情
       */
    menuMessage() {
      const node = this.graph.get('contextMenuNode')
      if (node.label !== 'wenshu') {
        return
      }
      this.messageData = [
        { name: '政策法规名称', value: node.name },
        { name: '定位', value: node.dinwei },
        { name: '军民融合相关度', value: node.xgd }
      ]
      this.messageVisible = true
      d3.select('#contextMenu').style('display', 'none')
    },
    /**
       * 右键菜单--查看引用
       */
    menuSource() {
      const node = this.graph.get('contextMenuNode')
      const data = {
        nodes: [
          { 'id': 'c1', 'label': 'wenshu', 'state': 'running', 'name': '添加测试1', 'dinwei': '指导原则', 'xgd': '不相关' },
          { 'id': node.id, 'label': 'wenshu', 'state': 'running', 'name': '关于公布第二批国家新型工业化产业示范基地复核意见的通知', 'dinwei': '指导原则', 'xgd': '不相关' }
        ],
        links: [
          { 'id': '11', 'label': 'yinyong', 'source': node.id, 'target': 'c1', 'name': '2015-02-05' }
        ]
      }
      this.graph.addData(data)
      d3.select('#contextMenu').style('display', 'none')
    },
    /**
       * 右键菜单--查看原文
       */
    menuText() {
      // const node = this.graph.get('contextMenuNode')
      window.open('http://www.xinhuanet.com//mil/2017-03/10/c_129506655.htm', '_blank')
    }
  }
}
</script>

<style scoped>
  .graph-web-toolbar {
    position: absolute;
    display: block;
    bottom: 100px;
    right: 12px;
    width: 56px;
    font-size: 15px;
    background-color: white;
    cursor: pointer;
  }
  
  .graph-web-toolbar>ul {
    margin: 0px;
    box-sizing: border-box;
    text-align: center;
    padding: 0px;
    border-top: 1px solid #DEDEDE;
    border-left: 1px solid #DEDEDE;
    border-right: 1px solid #DEDEDE;
  }

  .graph-web-toolbar ul>li {
    padding: 12px;
    list-style: none;
    border-bottom: 1px solid #DEDEDE 
  }

  .graph-web-toolbar ul>li:hover {
    background-color: #409eff;
    color: white;
  }

  .contextMenu {
    display: none;
    position: absolute; 
    width: 120px;
    top: 200px; 
    left: 50px; 
    border: 1px solid #ccc;
    background-color: white;
  }

  .contextMenu ul>li {
    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 8px;
    padding-right: 8px;
    list-style: none;
    border-bottom: 1px solid #DEDEDE 
  }

  .contextMenu>ul {
    margin: 0px;
    box-sizing: border-box;
    font-size: 12px;
    text-align: center;
    user-select: none;
    padding: 0px;
    border-top: 1px solid #DEDEDE;
    border-left: 1px solid #DEDEDE;
    border-right: 1px solid #DEDEDE;
  }

  .contextMenu ul>li:hover {
    background-color: #409eff;
    color: white;
  }

  .message {
    width: 500px;
    height: 400px;
    position: absolute;
    bottom: 10px;
    left: 10px;
    border: 1px solid;
    background-color: white;
  }

  .message-title {
    height: 40px;
    display: block;
    background-color: #f3f3f3;
    padding-left: 10px;
    padding-right: 10px;
  }

  .message-title-content {
    color: #000;
    font-size: 18px;
    line-height: 40px;
    display: block;
    float: left;
  }
  .message-close {
      color: #128BED;
      font-size: 30px;
      font-weight: 700;
      line-height: 40px;
      display: block;
      float: right;
      cursor: pointer;
  }
</style>
