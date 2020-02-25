/*
 * @Author: wlq
 * @Date: 2020/1/8
 * @Last Modified by: wlq
 * @Last Modified time: 2020/1/8
 * @Description:  生命周期图
 */
<template>
  <div style="width: 100%; height:100%; position: relative">
    <div>
        <div id="chart" :style="{'width': `${chart_width}px`, 'height': `${chart_height}px`}"></div>      
        <div id='brush'></div>
        <div id="legend"></div>
    </div>
    <div class="graph-web-toolbar">
      <ul>
        <li @click="savePng"><div class="text">保存图片</div></li>
        <!-- <li @click="refresh"><div class="text">重置</div></li> -->
        <li @click="relation"><div class="text">筛选</div></li>
        <li @click="openNodesTable"><div class="text">顶点列表</div></li>
      </ul>
    </div>
    <div id="contextMenu" class="contextMenu">
      <ul>
        <li @click="menuMessage">查看详情</li>
        <li @click="menuText" class='end'>查看原文</li>
      </ul>
    </div>
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
    id: Number,
    name: String
  },
  computed: {
    chart_width() {
      return this.width
    },
    chart_height() {
      return this.height - 30
    },
    table_height() {
      return this.height - 40
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
      baseRequest('/gVertex/selectLegalLifeCycle', params).then(response => {
        const data = response.data.item
        data.forEach(d => {
          d.id += ''
          if (d.id === (this.id + '')) {
            d.queryNode = true
          }
        })
        this.init(data)

        this.listLoading = false
      }, _ => {
        this.listLoading = false
      })
    },
    init(data) {
      const graph = new Chart.Graph({
        container: 'chart',
        width: this.chart_width,
        height: this.chart_height,
        contextMenu: 'contextMenu',
        background: '#26368d'
      })
      graph.data(data)
      graph.render()

      Chart.Brush.init(graph, 'brush')
      Chart.legend(graph, 'legend')
      this.$nextTick(() => {
        graph.translateCenter()
      })

      this.graph = graph
    },
    /**
     * 保存图片
     */
    savePng() {
      this.graph.savePng(`${this.name}-法律法规生命周期分析`)
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
      this.messageData = [
        // { name: 'id', value: node.id },
        { name: '政策法规名称', value: node.docName },
        { name: '政策法规文号', value: node.docNum },
        { name: '政策原文名称', value: node.docTittle },
        { name: '定位', value: node.docPositioning },
        { name: '发布时间', value: node.docIssueTime },
        { name: '生效时间', value: node.docEffectiveTime },
        { name: '废止时间', value: node.docAnnulTime },
        { name: '发布单位类型', value: node.docIssueOrgType },
        { name: '发布单位名称', value: node.docIssueOrgText },
        { name: '发文方式', value: node.docIssueType },
        { name: '适用范围', value: node.docUseBroad },
        { name: '适用范围描述', value: node.docUseBroadText },
        { name: '密级', value: node.docSecretClass },
        { name: '内容体系', value: node.docContentSys },
        { name: '文章类型', value: node.docType },
        { name: '领域类型', value: node.docDomainType },
        { name: '军民融合相关度', value: node.docAbout },
        { name: '可操作性', value: node.docOperability },
        { name: '评估重点', value: node.docFocalPoint },
        { name: '军民融合条款摘录', value: node.docSummary },
        { name: '关键词', value: node.docKeyWord }
      ]
      this.messageVisible = true
      d3.select('#contextMenu').style('display', 'none')
    },
    /**
       * 右键菜单--查看引用
       */
    menuSource() {
      // const node = this.graph.get('contextMenuNode')
      // const data = {
      // }
      // this.graph.addData(data)
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
  .graph-web-toolbar {
    position: absolute;
    display: block;
    bottom: 30px;
    right: -50px;
    width: 50px;
    font-size: 14px;
    background-color: white;
    cursor: pointer;
  }

  .graph-web-toolbar > ul {
    margin: 0px;
    box-sizing: border-box;
    text-align: center;
    padding: 0px;
    border-top: 1px solid #dedede;
    border-left: 1px solid #dedede;
    border-right: 1px solid #dedede;
  }

  .graph-web-toolbar ul > li {
    padding: 7px;
    list-style: none;
    border-bottom: 1px solid #dedede;
  }

  .graph-web-toolbar ul > li:hover {
    background-color: #409eff;
    color: white;
  }

.contextMenu {
  display: none;
  position: absolute;
  width: 80px;
  top: 200px;
  left: 50px;
  /* border: 1px solid black; */
  background-color: black;
  color: white;
  letter-spacing: 2px;
}

.contextMenu ul > li {
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 8px;
  padding-right: 8px;
  list-style: none;
  border-bottom: 1px solid #ffffff;
}

.contextMenu > ul {
  margin: 0px;
  box-sizing: border-box;
  font-size: 12px;
  text-align: center;
  user-select: none;
  padding: 0px;
}
.contextMenu ul > li.end {
  border-bottom: 0;
}

.contextMenu ul > li:hover {
  background-color: #409eff;
  color: white;
}

  .message {
    width: 300px;
    height: 100%;
    position: absolute;
    bottom: 0px;
    right: 0px;
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
